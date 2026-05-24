import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { getAllPosts } from "@/lib/content";

const PER_PAGE = 24;

export async function FanFicIndex({ page }: { page: number }) {
  const posts = await getAllPosts("fanfic");
  const total = posts.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  if (page > totalPages) notFound();

  const start = (page - 1) * PER_PAGE;
  const pagePosts = posts.slice(start, start + PER_PAGE);

  return (
    <>
      <PageHeader eyebrow="Fan Fiction" title="Stories from readers around the world.">
        {total > 0
          ? `${total} stories and counting. Have one to share? Send it over and I'll post it.`
          : `Have a story you'd like to share? Send it over and I'll post it. Doesn't have to be Minecraft — any topic works.`}
      </PageHeader>

      <Container className="pt-10">
        <div className="text-center">
          <Link
            href="/fanfic/submit"
            className="inline-flex rounded-full bg-[var(--color-accent)] text-white px-7 py-3 font-semibold hover:bg-[var(--color-accent-soft)] transition-colors"
          >
            Share your own story →
          </Link>
        </div>
      </Container>

      <Container className="py-16">
        {pagePosts.length === 0 ? (
          <p className="text-[var(--color-muted)]">No stories yet.</p>
        ) : (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pagePosts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/fanfic/${p.slug}`}
                    className="group block rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-accent)] hover:shadow-md transition-all"
                  >
                    <h2 className="font-display text-lg font-semibold leading-snug text-[var(--color-primary)]">
                      {p.title}
                    </h2>
                    {p.date && (
                      <p className="mt-2 text-xs text-[var(--color-muted)]">
                        {new Date(p.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    <p className="mt-3 text-sm text-[var(--color-ink-soft)] line-clamp-3">
                      {p.body
                        .replace(/!?\[.*?\]\(.*?\)/g, "")
                        .replace(/[#*_>`]/g, "")
                        .trim()
                        .slice(0, 200)}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-[var(--color-accent)] group-hover:translate-x-1 transition-transform">
                      Read story →
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            <Pagination page={page} totalPages={totalPages} />
          </>
        )}
      </Container>
    </>
  );
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  const prevHref = page === 2 ? "/fanfic" : `/fanfic/page/${page - 1}`;
  const nextHref = `/fanfic/page/${page + 1}`;

  return (
    <nav className="mt-12 flex items-center justify-between text-sm">
      {page > 1 ? (
        <Link
          href={prevHref}
          className="rounded-full border border-[var(--color-rule)] px-4 py-2 hover:border-[var(--color-accent)]"
        >
          ← Newer stories
        </Link>
      ) : (
        <span />
      )}
      <span className="text-[var(--color-muted)]">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={nextHref}
          className="rounded-full border border-[var(--color-rule)] px-4 py-2 hover:border-[var(--color-accent)]"
        >
          Older stories →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
