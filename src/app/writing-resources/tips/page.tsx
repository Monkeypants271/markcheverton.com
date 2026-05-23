import { PostListIndex } from "@/components/PostListIndex";
import { getAllPosts } from "@/lib/content";

export const metadata = { title: "Writing Tips" };

export default async function WritingTipsPage() {
  const posts = await getAllPosts("tips");
  return (
    <PostListIndex
      eyebrow="Writing Tips"
      title="Writing isn't about following rules. It's about making choices."
      intro="Short essays on craft — from openings and dialogue to battle scenes and the dark night of the soul."
      emptyMessage="No tips yet."
      posts={posts}
      basePath="/writing-resources/tips"
    />
  );
}
