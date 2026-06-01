import { PostListIndex } from "@/components/PostListIndex";
import { getAllPosts } from "@/lib/content";

export const metadata = { title: "Story Prompts" };

export default async function StoryPromptsPage() {
  const posts = await getAllPosts("prompts");
  return (
    <PostListIndex
      eyebrow="Story Prompts"
      title="Every story starts with an idea. Sometimes you just need a nudge."
      intro="Themed starting points — change them, twist them, ignore them. Just start."
      emptyMessage="No prompts yet."
      posts={posts}
      basePath="/writing-resources/prompts"
    />
  );
}
