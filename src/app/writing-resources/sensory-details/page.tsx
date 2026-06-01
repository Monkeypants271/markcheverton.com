import { PostListIndex } from "@/components/PostListIndex";
import { getAllPosts } from "@/lib/content";

export const metadata = { title: "Sensory Details" };

export default async function SensoryDetailsPage() {
  const posts = await getAllPosts("sensory-details");
  return (
    <PostListIndex
      eyebrow="Sensory Details"
      title="Don't just tell readers what's happening — help them feel it."
      intro="Emotion-by-emotion guides for showing rather than telling. From anger to wonder to the small, specific kinds of dread."
      emptyMessage="No entries yet."
      posts={posts}
      basePath="/writing-resources/sensory-details"
    />
  );
}
