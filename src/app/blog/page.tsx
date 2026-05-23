import { PostListIndex } from "@/components/PostListIndex";
import { getAllPosts } from "@/lib/content";

export const metadata = { title: "Blog" };

export default async function BlogPage() {
  const posts = await getAllPosts("blog");
  return (
    <PostListIndex
      eyebrow="Blog"
      title="On writing and teaching."
      intro="Short essays about creativity, classroom practice, and the long road from rejection to becoming a New York Times bestselling author."
      emptyMessage="No posts yet."
      posts={posts}
      basePath="/blog"
    />
  );
}
