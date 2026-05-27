import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendMail, escapeHtml } from "@/lib/mail";
import {
  consumeRateLimit,
  getClientIp,
  hasTooManyLinks,
  isValidEmail,
  parseStartedAt,
  submittedTooFast,
  verifyTurnstileToken,
} from "@/lib/anti-spam";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(req: Request) {
  let body: {
    postSlug?: string;
    postType?: string;
    postId?: number | null;
    author?: string;
    authorEmail?: string;
    content?: string;
    parentId?: number | null;
    website?: string; // honeypot
    startedAt?: number | string;
    turnstileToken?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — bots fill every field
  if ((body.website || "").trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const postSlug = (body.postSlug || "").trim();
  const postType = (body.postType || "").trim();
  const author = (body.author || "").trim();
  const authorEmail = (body.authorEmail || "").trim().toLowerCase();
  const content = (body.content || "").trim();
  const turnstileToken = (body.turnstileToken || "").trim() || null;
  const startedAt = parseStartedAt(body.startedAt);
  const parentId =
    typeof body.parentId === "number" && body.parentId > 0 ? body.parentId : null;
  const postId =
    typeof body.postId === "number" && body.postId > 0 ? body.postId : null;

  if (!postSlug) return NextResponse.json({ error: "Missing post." }, { status: 400 });
  if (!postType) return NextResponse.json({ error: "Missing post type." }, { status: 400 });
  if (!author) return NextResponse.json({ error: "Please add your name." }, { status: 400 });
  if (author.length > 80)
    return NextResponse.json({ error: "Your name is too long." }, { status: 400 });
  if (!content) return NextResponse.json({ error: "Comment can't be empty." }, { status: 400 });
  if (content.length > 4000)
    return NextResponse.json({ error: "Comment is too long (4000 chars max)." }, { status: 400 });
  if (authorEmail && !isValidEmail(authorEmail))
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  if (submittedTooFast(startedAt, 3500))
    return NextResponse.json({ error: "Please take a moment and try again." }, { status: 400 });
  if (hasTooManyLinks(content, 2))
    return NextResponse.json({ error: "Too many links in one comment." }, { status: 400 });

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("Supabase not configured");
    return NextResponse.json(
      { error: "Comments aren't configured yet — please try again later." },
      { status: 503 }
    );
  }

  const ip = getClientIp(req);
  const rateLimit = consumeRateLimit("comments-submit", ip, 4, 60 * 60 * 1000);
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: "You've posted a few comments already. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)) } }
    );
  }

  const turnstile = await verifyTurnstileToken(turnstileToken, ip);
  if (!turnstile.ok) {
    return NextResponse.json({ error: turnstile.error }, { status: 400 });
  }

  // IP ban check
  if (ip !== "unknown") {
    const { data: ban } = await supabase
      .from("ip_bans")
      .select("ip_address")
      .eq("ip_address", ip)
      .maybeSingle();
    if (ban) {
      // Silent success — banned IPs don't get told they're banned
      return NextResponse.json({ ok: true });
    }
  }

  const actionToken = randomBytes(24).toString("hex");

  const { data: inserted, error: insertErr } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      post_slug: postSlug,
      post_type: postType,
      parent_id: parentId,
      author,
      author_email: authorEmail || null,
      ip_address: ip,
      content,
      status: "pending",
      action_token: actionToken,
    })
    .select("id, action_token")
    .single();

  if (insertErr || !inserted) {
    console.error("Comment insert failed", insertErr);
    return NextResponse.json(
      { error: "Couldn't save your comment. Please try again." },
      { status: 500 }
    );
  }

  // Notification email to admin
  const notifyTo = process.env.FANFIC_NOTIFY_TO;
  if (notifyTo) {
    const link = (action: "approve" | "reject" | "ban") =>
      `${SITE_URL}/api/comments/moderate?id=${inserted.id}&token=${inserted.action_token}&action=${action}`;
    const postUrl = `${SITE_URL}/${postType}/${postSlug}`;
    const html = `
<p><strong>New comment</strong> awaiting moderation on
<a href="${escapeHtml(postUrl)}">${escapeHtml(postSlug)}</a></p>
<table style="border-collapse:collapse;font-family:-apple-system,sans-serif;font-size:14px">
  <tr><td style="padding:4px 12px 4px 0;color:#666">From:</td><td><strong>${escapeHtml(author)}</strong>${authorEmail ? ` &lt;${escapeHtml(authorEmail)}&gt;` : ""}</td></tr>
  <tr><td style="padding:4px 12px 4px 0;color:#666">IP:</td><td><code>${escapeHtml(ip)}</code></td></tr>
</table>
<blockquote style="margin:16px 0;padding:12px 16px;border-left:4px solid #ddd;background:#f7f7f7;white-space:pre-wrap;font-family:Georgia,serif">${escapeHtml(content)}</blockquote>
<p style="margin-top:24px">
  <a href="${link("approve")}" style="display:inline-block;padding:10px 20px;margin-right:8px;background:#1e3a5f;color:white;text-decoration:none;border-radius:999px;font-weight:600">Approve</a>
  <a href="${link("reject")}" style="display:inline-block;padding:10px 20px;margin-right:8px;background:#888;color:white;text-decoration:none;border-radius:999px;font-weight:600">Reject</a>
  <a href="${link("ban")}" style="display:inline-block;padding:10px 20px;background:#b94a3c;color:white;text-decoration:none;border-radius:999px;font-weight:600">Reject &amp; Ban IP</a>
</p>
<p style="color:#888;font-size:12px;margin-top:24px">Each link works exactly once. The Ban link rejects this comment AND adds <code>${escapeHtml(ip)}</code> to the permanent ban list — that IP won't be able to comment again.</p>
`.trim();

    await sendMail({
      to: notifyTo,
      subject: `[Comment] ${author} on ${postSlug}`,
      html,
      replyTo: authorEmail || undefined,
    });
  }

  return NextResponse.json({ ok: true });
}
