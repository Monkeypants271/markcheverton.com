import Image from "next/image";
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
          <ul className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`${basePath}/${p.slug}`}
                  className="group block overflow-hidden rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] shadow-[0_16px_36px_rgba(22,32,48,0.12)] transition-all hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[0_24px_48px_rgba(22,32,48,0.18)]"
                >
                  {p.featuredImage ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-rule)]">
                      <Image
                        src={p.featuredImage}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
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
                  <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)] line-clamp-4">
                    {p.excerpt}
                  </p>
                  <p className="mt-5 text-sm font-semibold text-[var(--color-accent)]">
                    Read article →
                  </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
