import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { Markdown } from "@/components/Markdown";
import type { Post } from "@/lib/content";

export function PostPage({
  eyebrow,
  post,
  backHref,
  backLabel,
}: {
  eyebrow: string;
  post: Post;
  backHref: string;
  backLabel: string;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={post.title}>
        {post.date &&
          new Date(post.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
      </PageHeader>

      <Container className="py-16">
        <article className="mx-auto max-w-3xl">
          <Markdown>{post.body}</Markdown>
        </article>

        <div className="mt-12 text-center">
          <Link
            href={backHref}
            className="inline-flex rounded-full border border-[var(--color-rule)] px-5 py-2 text-sm font-semibold text-[var(--color-ink-soft)] hover:border-[var(--color-accent)]"
          >
            ← {backLabel}
          </Link>
        </div>
      </Container>
    </>
  );
}
