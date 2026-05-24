import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.FANFIC_NOTIFY_TO;

  if (!gmailUser || !gmailPass || !to) {
    console.error(
      "Fan fic submission not configured. Set GMAIL_USER, GMAIL_APP_PASSWORD, FANFIC_NOTIFY_TO in .env.local"
    );
    return NextResponse.json(
      { error: "Submissions aren't configured yet. Please email Mark directly." },
      { status: 503 }
    );
  }

  const wordCount = story.split(/\s+/).filter(Boolean).length;
  const htmlBody = `
<p><strong>New fan fiction submission</strong> via markcheverton.com</p>
<table style="border-collapse:collapse;font-family:-apple-system,sans-serif;font-size:14px">
  <tr><td style="padding:4px 12px 4px 0;color:#666">From:</td><td><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</td></tr>
  <tr><td style="padding:4px 12px 4px 0;color:#666">Title:</td><td><strong>${escapeHtml(title)}</strong></td></tr>
  <tr><td style="padding:4px 12px 4px 0;color:#666">Length:</td><td>${wordCount.toLocaleString()} words</td></tr>
</table>
<hr style="margin:16px 0;border:none;border-top:1px solid #ddd"/>
<div style="white-space:pre-wrap;font-family:Georgia,serif;font-size:15px;line-height:1.6">${escapeHtml(story)}</div>
<hr style="margin:16px 0;border:none;border-top:1px solid #ddd"/>
<p style="color:#888;font-size:12px">Reply to this email to write back to ${escapeHtml(name)} directly. To publish, paste the story into a new MDX file at content/fanfic/ in the repo.</p>
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
    return NextResponse.json(
      { error: "Couldn't send right now. Please try again in a moment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
