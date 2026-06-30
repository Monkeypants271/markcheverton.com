import type { MetadataRoute } from "next";
import { getAllPosts, type ContentType } from "@/lib/content";

const BASE = "https://www.markcheverton.com";

// Static routes with hand-tuned priorities. /minecraft-books is the canonical
// Minecraft-inspired book hub, so it sits just under the homepage.
const staticRoutes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/minecraft-books", priority: 0.9 },
  { path: "/books", priority: 0.8 },
  { path: "/free-books", priority: 0.6 },
  { path: "/author-visits", priority: 0.7 },
  { path: "/for-educators", priority: 0.6 },
  { path: "/writing-resources", priority: 0.7 },
  { path: "/writing-resources/plot", priority: 0.6 },
  { path: "/writing-resources/tips", priority: 0.6 },
  { path: "/writing-resources/prompts", priority: 0.6 },
  { path: "/writing-resources/sensory-details", priority: 0.6 },
  { path: "/fanfic", priority: 0.6 },
  { path: "/blog", priority: 0.6 },
  { path: "/about", priority: 0.6 },
  { path: "/patents", priority: 0.5 },
  { path: "/contact", priority: 0.5 },
  { path: "/privacy", priority: 0.3 },
];

// Content collections that map to a route prefix. Individual posts are pulled
// from the same source the pages use, so new posts appear automatically.
const contentCollections: { type: ContentType; prefix: string }[] = [
  { type: "blog", prefix: "/blog" },
  { type: "tips", prefix: "/writing-resources/tips" },
  { type: "prompts", prefix: "/writing-resources/prompts" },
  { type: "sensory-details", prefix: "/writing-resources/sensory-details" },
  { type: "fanfic", prefix: "/fanfic" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: r.priority,
  }));

  const collectionEntries = await Promise.all(
    contentCollections.map(async ({ type, prefix }) => {
      let posts;
      try {
        posts = await getAllPosts(type);
      } catch {
        return [] as MetadataRoute.Sitemap;
      }
      return posts.map((post) => ({
        url: `${BASE}${prefix}/${post.slug}`,
        lastModified: post.date ? new Date(post.date) : now,
        changeFrequency: "yearly" as const,
        priority: 0.5,
      }));
    }),
  );

  return [...staticEntries, ...collectionEntries.flat()];
}
