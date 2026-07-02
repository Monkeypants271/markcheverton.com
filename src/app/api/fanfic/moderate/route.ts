import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { findUniqueSlug, slugify } from "@/lib/fanfic-submissions";
import { escapeHtml } from "@/lib/mail";

type Action = "approve" | "reject";

const ACTION_LABELS: Record<Action, string> = {
  approve: "Approve & publish this story",
  reject: "Reject this story",
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
  </style>
</head>
<body>${body}</body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

type Submission = {
  id: number;
  title: string;
  action_token: string;
  status: string;
  author: string | null;
};

async function resolve(
  url: URL
): Promise<
  | { error: NextResponse }
  | { id: number; token: string; action: Action; submission: Submission }
> {
  const id = Number(url.searchParams.get("id") || "");
  const token = (url.searchParams.get("token") || "").trim();
  const action = (url.searchParams.get("action") || "").trim() as Action;

  if (!Number.isInteger(id) || id <= 0 || !token || !["approve", "reject"].includes(action)) {
    return { error: htmlResponse("Bad link", `<h1 class="err">That link doesn't look right.</h1>`, 400) };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      error: htmlResponse("Not configured", `<h1 class="err">Submissions aren't configured on the server.</h1>`, 503),
    };
  }

  const { data: submission } = await supabase
    .from("fanfic_submissions")
    .select("id, title, action_token, status, author")
    .eq("id", id)
    .maybeSingle();

  if (!submission) {
    return { error: htmlResponse("Not found", `<h1 class="err">That submission doesn't exist.</h1>`, 404) };
  }

  if (submission.action_token !== token) {
    return { error: htmlResponse("Invalid token", `<h1 class="err">That moderation link is invalid.</h1>`, 403) };
  }

  if (submission.status !== "pending") {
    return {
      error: htmlResponse(
        "Already moderated",
        `<h1>This submission was already ${escapeHtml(submission.status)}.</h1>
         <p><a href="/admin/submissions">View all submissions</a></p>`
      ),
    };
  }

  return { id, token, action, submission: submission as Submission };
}

/**
 * GET renders a confirmation page only — it never mutates. Prevents email
 * scanners / prefetchers from auto-publishing a story by fetching the link.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const resolved = await resolve(url);
  if ("error" in resolved) return resolved.error;

  const { action, submission } = resolved;
  const postAction = `/api/fanfic/moderate?id=${submission.id}&token=${encodeURIComponent(
    submission.action_token
  )}&action=${action}`;

  return htmlResponse(
    "Confirm moderation",
    `<h1>${ACTION_LABELS[action]}?</h1>
     <p><strong>${escapeHtml(submission.title)}</strong>${
       submission.author ? ` by ${escapeHtml(submission.author)}` : ""
     }</p>
     ${
       action === "approve"
         ? `<p style="background:#fff4e5;border:1px solid #f5c481;border-radius:8px;padding:10px 14px;font-size:13px;color:#7a4a14">If the author used a real first &amp; last name, cancel and edit it in <a href="/admin/submissions">admin/submissions</a> first.</p>`
         : ""
     }
     <form method="post" action="${escapeHtml(postAction)}">
       <button type="submit" class="${action}">${ACTION_LABELS[action]}</button>
     </form>`
  );
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const resolved = await resolve(url);
  if ("error" in resolved) return resolved.error;

  const { id, action, submission } = resolved;
  const supabase = getSupabaseAdmin()!;

  if (action === "reject") {
    const { error } = await supabase
      .from("fanfic_submissions")
      .update({ status: "rejected", moderated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      console.error("Fanfic reject failed", error);
      return htmlResponse("Error", `<h1 class="err">Couldn't update the submission. Please try again.</h1>`, 500);
    }
    return htmlResponse(
      "Rejected",
      `<h1 class="ok">✓ Submission rejected.</h1>
       <p>It will not be published. The kid is not notified — you can reply to their email manually if you want to say something.</p>`
    );
  }

  // Approve — assign slug, publish, and redirect to the live story
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
    console.error("Fanfic approve failed", error);
    return htmlResponse("Error", `<h1 class="err">Couldn't publish the submission. Please try again.</h1>`, 500);
  }

  return NextResponse.redirect(new URL(`/fanfic/${slug}`, req.url), 303);
}
