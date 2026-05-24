import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

type Action = "approve" | "reject" | "ban";

function htmlResponse(title: string, body: string, status = 200) {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, system-ui, sans-serif; max-width: 32rem; margin: 4rem auto; padding: 0 1.5rem; color: #1a1a2e; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .ok { color: #1e3a5f; }
    .err { color: #b94a3c; }
    a { color: #e07a3c; }
  </style>
</head>
<body>${body}</body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = Number(url.searchParams.get("id") || "");
  const token = (url.searchParams.get("token") || "").trim();
  const action = (url.searchParams.get("action") || "").trim() as Action;

  if (!Number.isInteger(id) || id <= 0 || !token || !["approve", "reject", "ban"].includes(action)) {
    return htmlResponse("Bad request", `<h1 class="err">That link doesn't look right.</h1>`, 400);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return htmlResponse(
      "Not configured",
      `<h1 class="err">Comments aren't configured on the server.</h1>`,
      503
    );
  }

  // Fetch + verify
  const { data: comment, error: fetchErr } = await supabase
    .from("comments")
    .select("id, action_token, status, ip_address, author, post_slug")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr || !comment) {
    return htmlResponse(
      "Not found",
      `<h1 class="err">That comment doesn't exist.</h1>`,
      404
    );
  }

  if (comment.action_token !== token) {
    return htmlResponse(
      "Invalid token",
      `<h1 class="err">That moderation link is invalid or has been replaced.</h1>`,
      403
    );
  }

  if (comment.status !== "pending") {
    return htmlResponse(
      "Already moderated",
      `<h1>This comment was already ${comment.status}.</h1>
       <p>No further action taken.</p>`
    );
  }

  // Apply action
  if (action === "approve") {
    const { error } = await supabase
      .from("comments")
      .update({ status: "approved", moderated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      return htmlResponse("Error", `<h1 class="err">Couldn't update: ${error.message}</h1>`, 500);
    }
    return htmlResponse(
      "Approved",
      `<h1 class="ok">✓ Comment approved.</h1>
       <p><strong>${comment.author}</strong>'s comment is now visible on the story page.</p>`
    );
  }

  if (action === "reject") {
    const { error } = await supabase
      .from("comments")
      .update({ status: "rejected", moderated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      return htmlResponse("Error", `<h1 class="err">Couldn't update: ${error.message}</h1>`, 500);
    }
    return htmlResponse(
      "Rejected",
      `<h1 class="ok">✓ Comment rejected.</h1>
       <p>It will not appear on the story page. The commenter's IP is not banned.</p>`
    );
  }

  // action === "ban"
  const { error: updateErr } = await supabase
    .from("comments")
    .update({ status: "rejected", moderated_at: new Date().toISOString() })
    .eq("id", id);
  if (updateErr) {
    return htmlResponse("Error", `<h1 class="err">Couldn't update: ${updateErr.message}</h1>`, 500);
  }

  if (comment.ip_address && comment.ip_address !== "unknown") {
    await supabase.from("ip_bans").upsert({
      ip_address: comment.ip_address,
      reason: `Banned via moderation of comment ${id}`,
    });
  }

  return htmlResponse(
    "Banned",
    `<h1 class="ok">✓ Comment rejected and IP banned.</h1>
     <p>IP <code>${comment.ip_address || "(unknown)"}</code> can no longer post comments.</p>
     <p>You can review or remove bans at <a href="/admin/ip-bans">/admin/ip-bans</a>.</p>`
  );
}
