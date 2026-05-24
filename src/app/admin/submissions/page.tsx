import Link from "next/link";
import { revalidatePath } from "next/cache";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { getSupabaseAdmin } from "@/lib/supabase";
import { findUniqueSlug, slugify } from "@/lib/fanfic-submissions";

export const metadata = { title: "Fan fic submissions", robots: "noindex,nofollow" };
export const dynamic = "force-dynamic";

async function moderateSubmission(id: number, action: "approved" | "rejected", title?: string) {
  "use server";
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  if (action === "rejected") {
    await supabase
      .from("fanfic_submissions")
      .update({ status: "rejected", moderated_at: new Date().toISOString() })
      .eq("id", id);
  } else {
    const slug = await findUniqueSlug(slugify(title || "story"));
    await supabase
      .from("fanfic_submissions")
      .update({
        status: "approved",
        slug,
        moderated_at: new Date().toISOString(),
      })
      .eq("id", id);
  }

  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
  revalidatePath("/fanfic");
}

async function deleteSubmission(id: number) {
  "use server";
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  await supabase.from("fanfic_submissions").delete().eq("id", id);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}

export default async function AdminSubmissionsPage() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return (
      <>
        <PageHeader eyebrow="Admin" title="Fan fic submissions" />
        <Container className="py-12">
          <p className="text-[var(--color-muted)]">Supabase isn&apos;t configured yet.</p>
        </Container>
      </>
    );
  }

  const { data: pending } = await supabase
    .from("fanfic_submissions")
    .select("id, title, author, author_email, ip_address, content, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const { data: approved } = await supabase
    .from("fanfic_submissions")
    .select("id, title, author, slug, moderated_at")
    .eq("status", "approved")
    .order("moderated_at", { ascending: false })
    .limit(20);

  return (
    <>
      <PageHeader eyebrow="Admin" title="Fan fic submissions">
        {pending && pending.length > 0
          ? `${pending.length} awaiting moderation.`
          : "Nothing in the queue."}
      </PageHeader>

      <Container className="py-12">
        <p className="mb-6 text-sm text-[var(--color-muted)]">
          <Link href="/admin" className="hover:text-[var(--color-ink-soft)]">← Back to admin</Link>
        </p>

        <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)] mb-4">
          Pending
        </h2>
        {pending && pending.length > 0 ? (
          <ul className="space-y-6">
            {pending.map((s) => (
              <li
                key={s.id}
                className="rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6"
              >
                <header className="flex flex-wrap items-baseline justify-between gap-3 text-sm">
                  <div>
                    <span className="font-display text-lg font-semibold text-[var(--color-primary)] mr-3">
                      {s.title}
                    </span>
                    <span className="text-[var(--color-ink-soft)]">by {s.author}</span>
                    {s.author_email && (
                      <a
                        href={`mailto:${s.author_email}?subject=Re: ${encodeURIComponent(s.title)}`}
                        className="ml-2 text-[var(--color-muted)] hover:text-[var(--color-accent)]"
                      >
                        &lt;{s.author_email}&gt;
                      </a>
                    )}
                  </div>
                  <time className="text-[var(--color-muted)]">
                    {new Date(s.created_at).toLocaleString()}
                  </time>
                </header>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  IP <code className="text-xs">{s.ip_address || "unknown"}</code> ·{" "}
                  {s.content.split(/\s+/).filter(Boolean).length.toLocaleString()} words
                </p>

                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-[var(--color-accent)]">
                    Read story
                  </summary>
                  <div className="mt-3 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg border border-[var(--color-rule)] bg-[var(--color-bg)] p-4 font-serif text-[var(--color-ink-soft)] leading-relaxed">
                    {s.content}
                  </div>
                </details>

                <div className="mt-4 flex flex-wrap gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await moderateSubmission(s.id, "approved", s.title);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] text-white px-5 py-2 text-sm font-semibold"
                    >
                      Approve &amp; publish
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await moderateSubmission(s.id, "rejected");
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-full bg-[var(--color-muted)] hover:bg-[var(--color-ink-soft)] text-white px-5 py-2 text-sm font-semibold"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--color-muted)]">Nothing pending. ✨</p>
        )}

        {approved && approved.length > 0 && (
          <>
            <h2 className="mt-16 font-display text-2xl font-semibold text-[var(--color-primary)] mb-4">
              Recently approved
            </h2>
            <ul className="space-y-2">
              {approved.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-baseline justify-between gap-3 rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] p-4 text-sm"
                >
                  <div>
                    <Link
                      href={`/fanfic/${s.slug}`}
                      className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)]"
                    >
                      {s.title}
                    </Link>
                    <span className="ml-2 text-[var(--color-ink-soft)]">by {s.author}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <time className="text-[var(--color-muted)]">
                      {s.moderated_at && new Date(s.moderated_at).toLocaleDateString()}
                    </time>
                    <form
                      action={async () => {
                        "use server";
                        await deleteSubmission(s.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-xs text-[var(--color-muted)] hover:text-red-700 underline"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Container>
    </>
  );
}
