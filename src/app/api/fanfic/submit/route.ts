import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import nodemailer from "nodemailer";
import { getSupabaseAdmin } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Add a 5-space indent to the start of every paragraph for the email
 * preview. Treats any newline run as a paragraph break (kids usually
 * press Enter once, not twice).
 */
function indentParagraphs(story: string): string {
  return story
    .replace(/\r\n/g, "\n")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map((p) => "     " + p)
    .join("\n");
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export async function POST(req: Request) {
  let body: {
    name?: string;
    email?: string;
    title?: string;
    story?: string;
    website?: string; // honeypot
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: real users leave this empty. Bots fill every field.
  if ((body.website || "").trim().length > 0) {
    return NextResponse.json({ ok: true }); // pretend success, drop silently
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const title = (body.title || "").trim();
  const story = (body.story || "").trim();

  if (!name) return NextResponse.json({ error: "Please add your name." }, { status: 400 });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  if (!title) return NextResponse.json({ error: "Please add a title." }, { status: 400 });
  if (story.length < 50)
    return NextResponse.json(
      { error: "Your story needs to be a bit longer (at least 50 characters)." },
      { status: 400 }
    );
  if (story.length > 200000)
    return NextResponse.json(
      { error: "That story is too long for the form — please email Mark directly." },
      { status: 400 }
    );

  const supabase = getSupabaseAdmin();
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.FANFIC_NOTIFY_TO;

  if (!supabase || !gmailUser || !gmailPass || !to) {
    console.error(
      "Fan fic submission not configured. Need SUPABASE_*, GMAIL_USER, GMAIL_APP_PASSWORD, FANFIC_NOTIFY_TO."
    );
    return NextResponse.json(
      { error: "Submissions aren't configured yet. Please email Mark directly." },
      { status: 503 }
    );
  }

  const ip = clientIp(req);
  const actionToken = randomBytes(24).toString("hex");

  // Insert into DB as pending (slug assigned at approval time)
  const { data: inserted, error: insertErr } = await supabase
    .from("fanfic_submissions")
    .insert({
      title,
      author: name,
      author_email: email,
      ip_address: ip,
      content: story,
      status: "pending",
      action_token: actionToken,
    })
    .select("id, action_token")
    .single();

  if (insertErr || !inserted) {
    console.error("Submission insert failed", insertErr);
    return NextResponse.json(
      { error: "Couldn't save your story. Please try again." },
      { status: 500 }
    );
  }

  const wordCount = story.split(/\s+/).filter(Boolean).length;
  const link = (action: "approve" | "reject") =>
    `${SITE_URL}/api/fanfic/moderate?id=${inserted.id}&token=${inserted.action_token}&action=${action}`;

  const htmlBody = `
<p><strong>New fan fiction submission</strong> via markcheverton.com</p>
<table style="border-collapse:collapse;font-family:-apple-system,sans-serif;font-size:14px">
  <tr><td style="padding:4px 12px 4px 0;color:#666">From:</td><td><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</td></tr>
  <tr><td style="padding:4px 12px 4px 0;color:#666">Title:</td><td><strong>${escapeHtml(title)}</strong></td></tr>
  <tr><td style="padding:4px 12px 4px 0;color:#666">Length:</td><td>${wordCount.toLocaleString()} words</td></tr>
</table>
<p style="margin-top:16px">
  <a href="${link("approve")}" style="display:inline-block;padding:10px 20px;margin-right:8px;background:#1e3a5f;color:white;text-decoration:none;border-radius:999px;font-weight:600">Approve &amp; publish</a>
  <a href="${link("reject")}" style="display:inline-block;padding:10px 20px;background:#888;color:white;text-decoration:none;border-radius:999px;font-weight:600">Reject</a>
</p>
<p style="background:#fff4e5;border:1px solid #f5c481;border-radius:8px;padding:10px 14px;font-size:13px;color:#7a4a14;margin-top:8px">
  <strong>Heads up:</strong> if the author wrote what looks like a real first &amp; last name (e.g. &ldquo;Steve Smith&rdquo;), don&apos;t use the Approve button here — go to <a href="${escapeHtml(SITE_URL)}/admin/submissions" style="color:#7a4a14">admin/submissions</a> to edit the name first, then approve.
</p>
<hr style="margin:16px 0;border:none;border-top:1px solid #ddd"/>
<div style="white-space:pre-wrap;font-family:Georgia,serif;font-size:15px;line-height:1.6">${escapeHtml(indentParagraphs(story))}</div>
<hr style="margin:16px 0;border:none;border-top:1px solid #ddd"/>
<p style="color:#888;font-size:12px">Each link works exactly once. Reply to this email to write back to ${escapeHtml(name)} directly. You can also moderate from <a href="${escapeHtml(SITE_URL)}/admin/submissions">/admin/submissions</a>.</p>
`.trim();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPass },
  });

  try {
    await transporter.sendMail({
      from: `"markcheverton.com" <${gmailUser}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject: `[Fan fic] ${title} — by ${name}`,
      html: htmlBody,
    });
  } catch (err) {
    console.error("Gmail send error", err);
    // The submission is already saved; surface a softer error
    return NextResponse.json({
      ok: true,
      warning: "Saved your story but couldn't email Mark right now — he'll see it in the admin panel.",
    });
  }

  return NextResponse.json({ ok: true });
}
