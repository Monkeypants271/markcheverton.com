import Link from "next/link";
import { revalidatePath } from "next/cache";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata = { title: "Banned IPs", robots: "noindex,nofollow" };
export const dynamic = "force-dynamic";

async function unbanAction(ip: string) {
  "use server";
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  await supabase.from("ip_bans").delete().eq("ip_address", ip);
  revalidatePath("/admin/ip-bans");
  revalidatePath("/admin");
}

export default async function AdminIpBansPage() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return (
      <>
        <PageHeader eyebrow="Admin" title="Banned IPs" />
        <Container className="py-12">
          <p className="text-[var(--color-muted)]">Supabase isn&apos;t configured yet.</p>
        </Container>
      </>
    );
  }

  const { data: bans } = await supabase
    .from("ip_bans")
    .select("ip_address, reason, banned_at")
    .order("banned_at", { ascending: false });

  return (
    <>
      <PageHeader eyebrow="Admin" title="Banned IPs">
        {bans && bans.length > 0
          ? `${bans.length} permanently banned.`
          : "No IPs are currently banned."}
      </PageHeader>

      <Container className="py-12">
        <p className="mb-6 text-sm text-[var(--color-muted)]">
          <Link href="/admin" className="hover:text-[var(--color-ink-soft)]">← Back to admin</Link>
        </p>

        {bans && bans.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-rule)] text-left text-xs uppercase tracking-wider text-[var(--color-muted)]">
                <th className="py-2 pr-4">IP address</th>
                <th className="py-2 pr-4">Banned</th>
                <th className="py-2 pr-4">Reason</th>
                <th className="py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {bans.map((b) => (
                <tr key={b.ip_address} className="border-b border-[var(--color-rule)]">
                  <td className="py-3 pr-4 font-mono">{b.ip_address}</td>
                  <td className="py-3 pr-4 text-[var(--color-muted)]">
                    {new Date(b.banned_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4 text-[var(--color-ink-soft)]">{b.reason || "—"}</td>
                  <td className="py-3 text-right">
                    <form
                      action={async () => {
                        "use server";
                        await unbanAction(b.ip_address);
                      }}
                    >
                      <button
                        type="submit"
                        className="rounded-full border border-[var(--color-rule)] hover:border-[var(--color-accent)] px-4 py-1 text-sm font-semibold text-[var(--color-ink-soft)]"
                      >
                        Unban
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-[var(--color-muted)]">No bans. ✨</p>
        )}
      </Container>
    </>
  );
}
