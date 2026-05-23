import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostPage } from "@/components/PostPage";
import { getPost } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost("blog", slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost("blog", slug);
  if (!post) notFound();
  return (
    <PostPage
      eyebrow="Blog"
      post={post}
      backHref="/blog"
      backLabel="All posts"
    />
  );
}
