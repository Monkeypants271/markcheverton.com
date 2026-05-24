import Link from "next/link";
import { revalidatePath } from "next/cache";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { getSupabaseAdmin } from "@/lib/supabase";
import { findUniqueSlug, slugify } from "@/lib/fanfic-submissions";

export const metadata = { title: "Fan fic submissions", robots: "noindex,nofollow" };
export const dynamic = "force-dynamic";

async function approveAction(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const title = String(formData.get("title") || "").trim();
  const author = String(formData.get("author") || "").trim();
  if (!Number.isInteger(id) || id <= 0 || !title || !author) return;

  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const slug = await findUniqueSlug(slugify(title));
  await supabase
    .from("fanfic_submissions")
    .update({
      title,
      author,
      slug,
      status: "approved",
      moderated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
  revalidatePath("/fanfic");
}

async function rejectAction(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  await supabase
    .from("fanfic_submissions")
    .update({ status: "rejected", moderated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}

async function deleteAction(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  await supabase.from("fanfic_submissions").delete().eq("id", id);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
  revalidatePath("/fanfic");
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
          <p className="mb-6 text-sm text-[var(--color-ink-soft)]">
            <strong>Tip:</strong> if the author wrote what looks like a real first &amp; last name (e.g. &ldquo;Steve Smith&rdquo;), edit the name to just first name or remove the last name before approving. No full names ever go on the site.
          </p>
        ) : null}

        {pending && pending.length > 0 ? (
          <ul className="space-y-6">
            {pending.map((s) => (
              <li
                key={s.id}
                className="rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6"
              >
                <header className="flex flex-wrap items-baseline justify-between gap-3 text-xs text-[var(--color-muted)]">
                  <div>
                    {s.author_email && (
                      <a
                        href={`mailto:${s.author_email}?subject=Re: ${encodeURIComponent(s.title)}`}
                        className="hover:text-[var(--color-accent)]"
                      >
                        ✉ {s.author_email}
                      </a>
                    )}
                    <span className="ml-3">
                      IP <code>{s.ip_address || "unknown"}</code> ·{" "}
                      {s.content.split(/\s+/).filter(Boolean).length.toLocaleString()} words
                    </span>
                  </div>
                  <time>{new Date(s.created_at).toLocaleString()}</time>
                </header>

                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-[var(--color-accent)]">
                    Read story
                  </summary>
                  <div className="mt-3 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg border border-[var(--color-rule)] bg-[var(--color-bg)] p-4 font-serif text-[var(--color-ink-soft)] leading-relaxed">
                    {s.content}
                  </div>
                </details>

                <form
                  action={approveAction}
                  className="mt-4 grid sm:grid-cols-2 gap-3"
                >
                  <input type="hidden" name="id" value={s.id} />
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                      Title (editable)
                    </label>
                    <input
                      name="title"
                      defaultValue={s.title}
                      required
                      className="mt-1 w-full rounded-lg border border-[var(--color-rule)] bg-white px-3 py-2 text-[var(--color-ink)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                      Author (editable — no last names)
                    </label>
                    <input
                      name="author"
                      defaultValue={s.author}
                      required
                      className="mt-1 w-full rounded-lg border border-[var(--color-rule)] bg-white px-3 py-2 text-[var(--color-ink)]"
                    />
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap gap-2 mt-1">
                    <button
                      type="submit"
                      className="rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] text-white px-5 py-2 text-sm font-semibold"
                    >
                      Approve &amp; publish
                    </button>
                  </div>
                </form>

                <form action={rejectAction} className="mt-2">
                  <input type="hidden" name="id" value={s.id} />
                  <button
                    type="submit"
                    className="rounded-full bg-[var(--color-muted)] hover:bg-[var(--color-ink-soft)] text-white px-5 py-2 text-sm font-semibold"
                  >
                    Reject
                  </button>
                </form>
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
                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={s.id} />
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
