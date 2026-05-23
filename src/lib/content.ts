import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

export type ContentType =
  | "fanfic"
  | "blog"
  | "tips"
  | "sensory-details"
  | "prompts";

export type PostMeta = {
  title: string;
  slug: string;
  date: string | null;
  postId: number | null;
  type: ContentType;
  categories: string[];
  canonicalSource: string;
};

export type Post = PostMeta & {
  body: string;
};

const CONTENT_DIR = join(process.cwd(), "content");

async function fileExists(path: string): Promise<boolean> {
  try {
    await readFile(path);
    return true;
  } catch {
    return false;
  }
}

export async function getAllPosts(type: ContentType): Promise<Post[]> {
  const dir = join(CONTENT_DIR, type);
  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return [];
  }

  const posts: Post[] = [];
  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;
    const raw = await readFile(join(dir, file), "utf8");
    const { data, content } = matter(raw);
    posts.push({
      title: data.title ?? "Untitled",
      slug: data.slug ?? file.replace(/\.mdx$/, ""),
      date: data.date ?? null,
      postId: data.postId ?? null,
      type,
      categories: data.categories ?? [],
      canonicalSource: data.canonicalSource ?? "",
      body: content.trim(),
    });
  }

  // Newest first
  posts.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });

  return posts;
}

export async function getPost(
  type: ContentType,
  slug: string
): Promise<Post | null> {
  const path = join(CONTENT_DIR, type, `${slug}.mdx`);
  if (!(await fileExists(path))) return null;

  const raw = await readFile(path, "utf8");
  const { data, content } = matter(raw);
  return {
    title: data.title ?? "Untitled",
    slug: data.slug ?? slug,
    date: data.date ?? null,
    postId: data.postId ?? null,
    type,
    categories: data.categories ?? [],
    canonicalSource: data.canonicalSource ?? "",
    body: content.trim(),
  };
}

export type MigratedComment = {
  id: number;
  parent: number;
  author: string;
  authorUrl: string | null;
  date: string;
  contentHtml: string;
  link: string;
  status: "approved";
};

let commentsCache: { byPost: Record<number, MigratedComment[]> } | null = null;

export async function getCommentsForPost(
  postId: number | null
): Promise<MigratedComment[]> {
  if (!postId) return [];
  if (!commentsCache) {
    const path = join(process.cwd(), "migration", "comments.json");
    try {
      const raw = await readFile(path, "utf8");
      commentsCache = JSON.parse(raw);
    } catch {
      commentsCache = { byPost: {} };
    }
  }
  return commentsCache?.byPost[postId] ?? [];
}
