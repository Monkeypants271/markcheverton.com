import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { ADMIN_COOKIE, makeCookieValue, verifyPassword } from "@/lib/admin-auth";

export const metadata = { title: "Admin login", robots: "noindex,nofollow" };

async function loginAction(formData: FormData) {
  "use server";
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin");

  if (!verifyPassword(password)) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const value = await makeCookieValue();
  if (!value) {
    redirect(`/admin/login?error=config&next=${encodeURIComponent(next)}`);
  }

  const c = await cookies();
  c.set({
    name: ADMIN_COOKIE,
    value: value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const errorMessage =
    params.error === "config"
      ? "Admin password isn't set on the server. Set ADMIN_PASSWORD in .env.local."
      : params.error
        ? "Wrong password."
        : null;

  return (
    <>
      <PageHeader eyebrow="Admin" title="Sign in" />
      <Container className="py-16">
        <form
          action={loginAction}
          className="mx-auto max-w-sm space-y-4 rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-8"
        >
          <input type="hidden" name="next" value={params.next || "/admin"} />
          <label htmlFor="pw" className="block text-sm font-semibold text-[var(--color-ink)]">
            Admin password
          </label>
          <input
            id="pw"
            name="password"
            type="password"
            autoFocus
            autoComplete="current-password"
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
            Sign in
          </button>
        </form>
      </Container>
    </>
  );
}
