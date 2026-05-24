import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { findUniqueSlug, slugify } from "@/lib/fanfic-submissions";

type Action = "approve" | "reject";

function htmlResponse(title: string, body: string, status = 200) {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="robots" content="noindex,nofollow" />
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

  if (!Number.isInteger(id) || id <= 0 || !token || !["approve", "reject"].includes(action)) {
    return htmlResponse("Bad link", `<h1 class="err">That link doesn't look right.</h1>`, 400);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return htmlResponse(
      "Not configured",
      `<h1 class="err">Submissions aren't configured on the server.</h1>`,
      503
    );
  }

  const { data: submission } = await supabase
    .from("fanfic_submissions")
    .select("id, title, action_token, status")
    .eq("id", id)
    .maybeSingle();

  if (!submission) {
    return htmlResponse("Not found", `<h1 class="err">That submission doesn't exist.</h1>`, 404);
  }

  if (submission.action_token !== token) {
    return htmlResponse(
      "Invalid token",
      `<h1 class="err">That moderation link is invalid.</h1>`,
      403
    );
  }

  if (submission.status !== "pending") {
    return htmlResponse(
      "Already moderated",
      `<h1>This submission was already ${submission.status}.</h1>
       <p><a href="/admin/submissions">View all submissions</a></p>`
    );
  }

  if (action === "reject") {
    const { error } = await supabase
      .from("fanfic_submissions")
      .update({ status: "rejected", moderated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      return htmlResponse("Error", `<h1 class="err">${error.message}</h1>`, 500);
    }
    return htmlResponse(
      "Rejected",
      `<h1 class="ok">✓ Submission rejected.</h1>
       <p>It will not be published. The kid is not notified — you can reply to their email manually if you want to say something.</p>`
    );
  }

  // Approve — assign slug, publish, and redirect Mark to the live story
  const base = slugify(submission.title);
  const slug = await findUniqueSlug(base);

  const { error } = await supabase
    .from("fanfic_submissions")
    .update({
      status: "approved",
      slug,
      moderated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return htmlResponse("Error", `<h1 class="err">${error.message}</h1>`, 500);
  }

  // Redirect to the live story so Mark sees the published page immediately
  return NextResponse.redirect(new URL(`/fanfic/${slug}`, req.url));
}
