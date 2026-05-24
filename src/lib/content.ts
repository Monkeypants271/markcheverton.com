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

async function getMdxPosts(type: ContentType): Promise<Post[]> {
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
  return posts;
}

async function getApprovedFanficSubmissions(): Promise<Post[]> {
  const { getSupabaseAdmin } = await import("@/lib/supabase");
  const { submissionToMarkdown } = await import("@/lib/fanfic-submissions");
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("fanfic_submissions")
    .select("title, slug, content, author, moderated_at, created_at")
    .eq("status", "approved")
    .not("slug", "is", null);

  if (error || !data) return [];

  return data.map((s) => ({
    title: s.title,
    slug: s.slug as string,
    date: (s.moderated_at || s.created_at)?.slice(0, 10) || null,
    postId: null,
    type: "fanfic" as const,
    categories: ["fan-fiction"],
    canonicalSource: "",
    body: submissionToMarkdown(s.content),
  }));
}

export async function getAllPosts(type: ContentType): Promise<Post[]> {
  const [mdx, db] = await Promise.all([
    getMdxPosts(type),
    type === "fanfic" ? getApprovedFanficSubmissions() : Promise.resolve([]),
  ]);

  // De-dupe by slug — MDX wins if both exist (shouldn't happen, but safe)
  const bySlug = new Map<string, Post>();
  for (const p of [...db, ...mdx]) bySlug.set(p.slug, p);
  const posts = Array.from(bySlug.values());

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
  // Try MDX first
  const path = join(CONTENT_DIR, type, `${slug}.mdx`);
  if (await fileExists(path)) {
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

  // Fall back to DB for fan fic submissions
  if (type === "fanfic") {
    const { getSupabaseAdmin } = await import("@/lib/supabase");
    const { submissionToMarkdown } = await import("@/lib/fanfic-submissions");
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;
    const { data } = await supabase
      .from("fanfic_submissions")
      .select("title, slug, content, moderated_at, created_at")
      .eq("status", "approved")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return null;
    return {
      title: data.title,
      slug: data.slug as string,
      date: (data.moderated_at || data.created_at)?.slice(0, 10) || null,
      postId: null,
      type: "fanfic",
      categories: ["fan-fiction"],
      canonicalSource: "",
      body: submissionToMarkdown(data.content),
    };
  }

  return null;
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

async function getMigratedComments(
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

async function getNewComments(
  postType: string,
  postSlug: string
): Promise<MigratedComment[]> {
  // Lazy import so Supabase doesn't load when env isn't configured
  const { getSupabaseAdmin } = await import("@/lib/supabase");
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("comments")
    .select("id, parent_id, author, content, created_at")
    .eq("post_slug", postSlug)
    .eq("post_type", postType)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  // Adapt DB rows into the shape CommentList already expects
  return data.map((c) => ({
    id: c.id,
    parent: c.parent_id ?? 0,
    author: c.author,
    authorUrl: null,
    date: c.created_at,
    // Wrap plain-text content in a <p> for the dangerouslySetInnerHTML render path
    contentHtml: `<p>${escapeHtmlForComment(c.content)}</p>`,
    link: "",
    status: "approved" as const,
  }));
}

function escapeHtmlForComment(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
}

/**
 * Returns ALL approved comments for a post — both the WordPress-migrated
 * ones (keyed by legacy post_id) and any new ones submitted through the
 * new comment form (keyed by post_type + post_slug).
 */
export async function getCommentsForPost(
  postId: number | null,
  postType?: string,
  postSlug?: string
): Promise<MigratedComment[]> {
  const [legacy, fresh] = await Promise.all([
    getMigratedComments(postId),
    postType && postSlug ? getNewComments(postType, postSlug) : Promise.resolve([]),
  ]);
  // Sort oldest-first by date for stable threading
  return [...legacy, ...fresh].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}
