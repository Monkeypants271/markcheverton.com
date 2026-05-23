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
  const post = await getPost("tips", slug);
  if (!post) return { title: "Tip not found" };
  return { title: post.title };
}

export default async function TipPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost("tips", slug);
  if (!post) notFound();
  return (
    <PostPage
      eyebrow="Writing Tip"
      post={post}
      backHref="/writing-resources/tips"
      backLabel="All tips"
    />
  );
}
