import Link from "next/link";
import { revalidatePath } from "next/cache";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata = { title: "Pending comments", robots: "noindex,nofollow" };
export const dynamic = "force-dynamic";

type ActionResult = "approved" | "rejected" | "banned";

async function moderateAction(id: number, action: ActionResult, ip: string | null) {
  "use server";
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const status = action === "approved" ? "approved" : "rejected";
  await supabase
    .from("comments")
    .update({ status, moderated_at: new Date().toISOString() })
    .eq("id", id);

  if (action === "banned" && ip && ip !== "unknown") {
    await supabase.from("ip_bans").upsert({
      ip_address: ip,
      reason: `Banned via admin moderation of comment ${id}`,
    });
  }

  revalidatePath("/admin/comments");
  revalidatePath("/admin");
}

export default async function AdminCommentsPage() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return (
      <>
        <PageHeader eyebrow="Admin" title="Pending comments" />
        <Container className="py-12">
          <p className="text-[var(--color-muted)]">Supabase isn&apos;t configured yet.</p>
        </Container>
      </>
    );
  }

  const { data: pending } = await supabase
    .from("comments")
    .select("id, post_slug, post_type, author, author_email, ip_address, content, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader eyebrow="Admin" title="Pending comments">
        {pending && pending.length > 0
          ? `${pending.length} awaiting moderation.`
          : "Nothing in the queue."}
      </PageHeader>

      <Container className="py-12">
        <p className="mb-6 text-sm text-[var(--color-muted)]">
          <Link href="/admin" className="hover:text-[var(--color-ink-soft)]">← Back to admin</Link>
        </p>

        {pending && pending.length > 0 ? (
          <ul className="space-y-6">
            {pending.map((c) => (
              <li key={c.id} className="rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6">
                <header className="flex flex-wrap items-baseline justify-between gap-3 text-sm">
                  <div>
                    <span className="font-semibold text-[var(--color-primary)]">{c.author}</span>
                    {c.author_email && (
                      <span className="ml-2 text-[var(--color-muted)]">&lt;{c.author_email}&gt;</span>
                    )}
                    <span className="ml-3 text-[var(--color-muted)]">
                      IP <code className="text-xs">{c.ip_address || "unknown"}</code>
                    </span>
                  </div>
                  <time className="text-[var(--color-muted)]">
                    {new Date(c.created_at).toLocaleString()}
                  </time>
                </header>

                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  On <Link href={`/${c.post_type}/${c.post_slug}`} className="hover:text-[var(--color-accent)]">{c.post_slug}</Link>
                </p>

                <blockquote className="mt-4 whitespace-pre-wrap rounded-lg border border-[var(--color-rule)] bg-[var(--color-bg)] p-4 text-[var(--color-ink-soft)]">
                  {c.content}
                </blockquote>

                <div className="mt-4 flex flex-wrap gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await moderateAction(c.id, "approved", c.ip_address);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] text-white px-5 py-2 text-sm font-semibold"
                    >
                      Approve
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await moderateAction(c.id, "rejected", c.ip_address);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-full bg-[var(--color-muted)] hover:bg-[var(--color-ink-soft)] text-white px-5 py-2 text-sm font-semibold"
                    >
                      Reject
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await moderateAction(c.id, "banned", c.ip_address);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-full bg-red-700 hover:bg-red-800 text-white px-5 py-2 text-sm font-semibold"
                    >
                      Reject &amp; Ban IP
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--color-muted)]">Queue is empty. ✨</p>
        )}
      </Container>
    </>
  );
}
