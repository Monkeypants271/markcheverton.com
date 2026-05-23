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
  const post = await getPost("sensory-details", slug);
  if (!post) return { title: "Entry not found" };
  return { title: post.title };
}

export default async function SensoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost("sensory-details", slug);
  if (!post) notFound();
  return (
    <PostPage
      eyebrow="Sensory Details"
      post={post}
      backHref="/writing-resources/sensory-details"
      backLabel="All emotions"
    />
  );
}
