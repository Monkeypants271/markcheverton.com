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
  const post = await getPost("prompts", slug);
  if (!post) return { title: "Prompt not found" };
  return { title: post.title };
}

export default async function PromptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost("prompts", slug);
  if (!post) notFound();
  return (
    <PostPage
      eyebrow="Story Prompts"
      post={post}
      backHref="/writing-resources/prompts"
      backLabel="All prompts"
    />
  );
}
