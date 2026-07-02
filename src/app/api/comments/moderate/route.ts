import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { escapeHtml } from "@/lib/mail";

type Action = "approve" | "reject" | "ban";

const ACTION_LABELS: Record<Action, string> = {
  approve: "Approve this comment",
  reject: "Reject this comment",
  ban: "Reject & ban this IP",
};

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
    button { font: inherit; cursor: pointer; padding: 10px 20px; border: none; border-radius: 999px; color: #fff; font-weight: 600; }
    .approve { background: #1e3a5f; }
    .reject { background: #888; }
    .ban { background: #b94a3c; }
    blockquote { margin: 16px 0; padding: 12px 16px; border-left: 4px solid #ddd; background: #f7f7f7; white-space: pre-wrap; }
  </style>
</head>
<body>${body}</body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

type Comment = {
  id: number;
  action_token: string;
  status: string;
  ip_address: string | null;
  author: string;
  post_slug: string;
  content: string;
};

/**
 * Parse + validate params and load the comment. Returns either an error
 * page to send back, or the validated comment plus action. Shared by the
 * GET (confirmation) and POST (mutation) handlers.
 */
async function resolve(
  url: URL
): Promise<
  | { error: NextResponse }
  | { id: number; token: string; action: Action; comment: Comment }
> {
  const id = Number(url.searchParams.get("id") || "");
  const token = (url.searchParams.get("token") || "").trim();
  const action = (url.searchParams.get("action") || "").trim() as Action;

  if (!Number.isInteger(id) || id <= 0 || !token || !["approve", "reject", "ban"].includes(action)) {
    return { error: htmlResponse("Bad request", `<h1 class="err">That link doesn't look right.</h1>`, 400) };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      error: htmlResponse("Not configured", `<h1 class="err">Comments aren't configured on the server.</h1>`, 503),
    };
  }

  const { data: comment, error: fetchErr } = await supabase
    .from("comments")
    .select("id, action_token, status, ip_address, author, post_slug, content")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr || !comment) {
    return { error: htmlResponse("Not found", `<h1 class="err">That comment doesn't exist.</h1>`, 404) };
  }

  if (comment.action_token !== token) {
    return {
      error: htmlResponse("Invalid token", `<h1 class="err">That moderation link is invalid or has been replaced.</h1>`, 403),
    };
  }

  if (comment.status !== "pending") {
    return {
      error: htmlResponse(
        "Already moderated",
        `<h1>This comment was already ${escapeHtml(comment.status)}.</h1><p>No further action taken.</p>`
      ),
    };
  }

  return { id, token, action, comment: comment as Comment };
}

/**
 * GET renders a confirmation page only — it never mutates. This prevents
 * email scanners, link-preview bots, and prefetchers from auto-approving or
 * auto-banning by fetching the link. The actual action runs on POST.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const resolved = await resolve(url);
  if ("error" in resolved) return resolved.error;

  const { action, comment } = resolved;
  const postAction = `/api/comments/moderate?id=${comment.id}&token=${encodeURIComponent(
    comment.action_token
  )}&action=${action}`;

  return htmlResponse(
    "Confirm moderation",
    `<h1>${ACTION_LABELS[action]}?</h1>
     <p>From <strong>${escapeHtml(comment.author)}</strong> on <code>${escapeHtml(comment.post_slug)}</code>${
       action === "ban" && comment.ip_address
         ? ` &middot; IP <code>${escapeHtml(comment.ip_address)}</code>`
         : ""
     }</p>
     <blockquote>${escapeHtml(comment.content)}</blockquote>
     <form method="post" action="${escapeHtml(postAction)}">
       <button type="submit" class="${action}">${ACTION_LABELS[action]}</button>
     </form>`
  );
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const resolved = await resolve(url);
  if ("error" in resolved) return resolved.error;

  const { id, action, comment } = resolved;
  const supabase = getSupabaseAdmin()!;

  if (action === "approve") {
    const { error } = await supabase
      .from("comments")
      .update({ status: "approved", moderated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      console.error("Comment approve failed", error);
      return htmlResponse("Error", `<h1 class="err">Couldn't update the comment. Please try again.</h1>`, 500);
    }
    return htmlResponse(
      "Approved",
      `<h1 class="ok">✓ Comment approved.</h1>
       <p><strong>${escapeHtml(comment.author)}</strong>'s comment is now visible on the story page.</p>`
    );
  }

  if (action === "reject") {
    const { error } = await supabase
      .from("comments")
      .update({ status: "rejected", moderated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      console.error("Comment reject failed", error);
      return htmlResponse("Error", `<h1 class="err">Couldn't update the comment. Please try again.</h1>`, 500);
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
    console.error("Comment ban-reject failed", updateErr);
    return htmlResponse("Error", `<h1 class="err">Couldn't update the comment. Please try again.</h1>`, 500);
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
     <p>IP <code>${escapeHtml(comment.ip_address || "(unknown)")}</code> can no longer post comments.</p>
     <p>You can review or remove bans at <a href="/admin/ip-bans">/admin/ip-bans</a>.</p>`
  );
}
