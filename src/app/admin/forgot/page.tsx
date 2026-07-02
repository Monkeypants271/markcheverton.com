import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "node:crypto";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendMail, escapeHtml } from "@/lib/mail";
import { consumeRateLimit, getClientIpFromHeaders } from "@/lib/anti-spam";

export const metadata = { title: "Forgot password", robots: "noindex,nofollow" };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const TOKEN_TTL_MIN = 15;

async function requestMagicLinkAction(formData: FormData) {
  "use server";

  const adminEmail = (
    process.env.ADMIN_EMAIL || process.env.FANFIC_NOTIFY_TO || ""
  )
    .trim()
    .toLowerCase();

  const submitted = String(formData.get("email") || "").trim().toLowerCase();

  // Throttle to prevent email-bombing the admin and flooding the token table:
  // 3 link requests per hour per IP. Silently redirect to the same "sent"
  // page so this doesn't leak anything either.
  const ip = getClientIpFromHeaders(await headers());
  const rl = consumeRateLimit("admin-forgot", ip, 3, 60 * 60 * 1000);
  if (!rl.ok) {
    redirect("/admin/forgot?sent=1");
  }

  // Always redirect to the same "sent" page regardless of whether the email
  // matched — prevents leaking which email is the admin. (Even though it's
  // a one-admin system, no need to expose the address publicly.)
  if (!adminEmail || submitted !== adminEmail) {
    redirect("/admin/forgot?sent=1");
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    redirect("/admin/forgot?error=config");
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MIN * 60 * 1000).toISOString();

  const { error } = await supabase!.from("admin_magic_tokens").insert({
    token,
    expires_at: expiresAt,
  });
  if (error) {
    console.error("Could not insert magic token", error);
    redirect("/admin/forgot?error=db");
  }

  const link = `${SITE_URL}/admin/magic?token=${token}`;
  await sendMail({
    to: adminEmail,
    subject: "Sign in to markcheverton.com admin",
    html: `
<p>Click this link to sign in to the admin panel:</p>
<p style="margin:24px 0">
  <a href="${escapeHtml(link)}" style="display:inline-block;padding:12px 24px;background:#1e3a5f;color:white;text-decoration:none;border-radius:999px;font-weight:600">Sign me in</a>
</p>
<p style="color:#666;font-size:13px">This link expires in ${TOKEN_TTL_MIN} minutes and works only once. If you didn't request it, you can ignore this email.</p>
<p style="color:#999;font-size:12px;margin-top:24px">Or paste this URL into your browser:<br/><code style="word-break:break-all">${escapeHtml(link)}</code></p>
`.trim(),
  });

  redirect("/admin/forgot?sent=1");
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;

  if (params.sent) {
    return (
      <>
        <PageHeader eyebrow="Admin" title="Check your email" />
        <Container className="py-16">
          <div className="mx-auto max-w-sm rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-8 text-center">
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              If that email is the admin address, a sign-in link is on its way.
              It expires in {TOKEN_TTL_MIN} minutes and works only once.
            </p>
            <p className="mt-6 text-xs text-[var(--color-muted)]">
              Didn&apos;t get it? Check spam, or{" "}
              <a href="/admin/forgot" className="underline">try again</a>.
            </p>
          </div>
        </Container>
      </>
    );
  }

  const errorMessage =
    params.error === "config"
      ? "Admin email/database isn't set up yet on the server."
      : params.error === "db"
        ? "Couldn't generate a link right now. Please try again."
        : null;

  return (
    <>
      <PageHeader eyebrow="Admin" title="Forgot your password?">
        Enter your admin email and we&apos;ll send you a one-time sign-in link.
        No need to remember a password.
      </PageHeader>
      <Container className="py-16">
        <form
          action={requestMagicLinkAction}
          className="mx-auto max-w-sm space-y-4 rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-8"
        >
          <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-ink)]">
            Admin email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            autoComplete="email"
            className="w-full rounded-lg border border-[var(--color-rule)] bg-white px-3 py-2 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
          />
          {errorMessage && (
            <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] text-white px-5 py-3 font-semibold transition-colors"
          >
            Send me a sign-in link
          </button>
          <p className="text-center text-xs text-[var(--color-muted)]">
            <a href="/admin/login" className="underline">Back to password sign in</a>
          </p>
        </form>
      </Container>
    </>
  );
}
