import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { Markdown } from "@/components/Markdown";
import { CommentList } from "@/components/CommentList";
import { CommentForm } from "@/components/CommentForm";
import { getPost, getCommentsForPost } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost("fanfic", slug);
  if (!post) return { title: "Story not found" };
  return { title: post.title };
}

export default async function FanFicStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost("fanfic", slug);
  if (!post) notFound();

  const comments = await getCommentsForPost(post.postId, "fanfic", post.slug);

  return (
    <>
      <PageHeader eyebrow="Fan Fiction" title={post.title}>
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
          <CommentList comments={comments} />
          <CommentForm postSlug={post.slug} postType="fanfic" postId={post.postId} />
        </article>

        <div className="mt-12 text-center">
          <Link
            href="/fanfic"
            className="inline-flex rounded-full border border-[var(--color-rule)] px-5 py-2 text-sm font-semibold text-[var(--color-ink-soft)] hover:border-[var(--color-accent)]"
          >
            ← All stories
          </Link>
        </div>
      </Container>
    </>
  );
}
