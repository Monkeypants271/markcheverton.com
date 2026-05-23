import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import type { Post } from "@/lib/content";

export function PostListIndex({
  eyebrow,
  title,
  intro,
  emptyMessage,
  posts,
  basePath,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  emptyMessage: string;
  posts: Post[];
  basePath: string;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title}>
        {intro}
      </PageHeader>

      <Container className="py-16">
        {posts.length === 0 ? (
          <p className="text-[var(--color-muted)]">{emptyMessage}</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`${basePath}/${p.slug}`}
                  className="group block rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-accent)] hover:shadow-md transition-all"
                >
                  <h2 className="font-display text-xl font-semibold text-[var(--color-primary)]">
                    {p.title}
                  </h2>
                  {p.date && (
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {new Date(p.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-[var(--color-ink-soft)] line-clamp-2">
                    {p.body
                      .replace(/!?\[.*?\]\(.*?\)/g, "")
                      .replace(/[#*_>`]/g, "")
                      .trim()
                      .slice(0, 240)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
