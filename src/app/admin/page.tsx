import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata = { title: "Admin", robots: "noindex,nofollow" };

async function logoutAction() {
  "use server";
  const c = await cookies();
  c.set({ name: ADMIN_COOKIE, value: "", path: "/", maxAge: 0 });
  redirect("/admin/login");
}

export default async function AdminHome() {
  const supabase = getSupabaseAdmin();
  let pendingCount = 0;
  let banCount = 0;
  if (supabase) {
    const [{ count: pc }, { count: bc }] = await Promise.all([
      supabase.from("comments").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("ip_bans").select("ip_address", { count: "exact", head: true }),
    ]);
    pendingCount = pc ?? 0;
    banCount = bc ?? 0;
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="Moderation" />
      <Container className="py-12">
        <ul className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          <li>
            <Link
              href="/admin/comments"
              className="block rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-accent)]"
            >
              <p className="font-display text-2xl font-semibold text-[var(--color-primary)]">
                Pending comments
              </p>
              <p className="mt-2 text-3xl font-semibold text-[var(--color-accent)]">{pendingCount}</p>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                Review, approve or reject submissions awaiting moderation.
              </p>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/ip-bans"
              className="block rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-accent)]"
            >
              <p className="font-display text-2xl font-semibold text-[var(--color-primary)]">
                Banned IPs
              </p>
              <p className="mt-2 text-3xl font-semibold text-[var(--color-accent)]">{banCount}</p>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                Manage permanent IP bans (added when you click &quot;Reject &amp; Ban&quot;).
              </p>
            </Link>
          </li>
        </ul>

        <form action={logoutAction} className="mt-12">
          <button
            type="submit"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink-soft)] underline"
          >
            Sign out
          </button>
        </form>
      </Container>
    </>
  );
}
