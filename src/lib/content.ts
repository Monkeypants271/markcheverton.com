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
  author?: string | null;
  featuredImage?: string | null;
  excerpt?: string;
};

export type Post = PostMeta & {
  body: string;
};

const CONTENT_DIR = join(process.cwd(), "content");

const FEATURED_IMAGE_OVERRIDES: Partial<
  Record<ContentType, Record<string, string>>
> = {
  tips: {
    "anatomy-of-a-battle-scene":
      "/images/tips/anatomy-of-a-battle-scene.jpg",
    "character-descriptions": "/images/tips/character-descriptions.jpg",
    "dark-night-of-the-soul": "/images/tips/dark-night-of-the-soul.jpg",
    "designing-flawed-characters":
      "/images/tips/designing-flawed-characters.jpg",
    "developing-your-storys-concept-and-premise":
      "/images/tips/developing-your-storys-concept-and-premise.jpg",
    dialogue: "/images/tips/dialogue.jpg",
    "dont-tell-show": "/images/tips/dont-tell-show.jpg",
    "echoing-and-character-names-2":
      "/images/tips/echoing-and-character-names-2.jpg",
    "how-to-use-grammarly-to-fix-errors":
      "/images/tips/how-to-use-grammarly-to-fix-errors.jpg",
    "not-sure-what-to-do-send-them-on-a-journey":
      "/images/tips/not-sure-what-to-do-send-them-on-a-journey.jpg",
    "physical-effects-of-emotions":
      "/images/tips/physical-effects-of-emotions.jpg",
    "pixars-storytelling-rule-4":
      "/images/tips/pixars-storytelling-rule-4.jpg",
    "plot-questions": "/images/tips/plot-questions.jpg",
    "sentence-structure": "/images/tips/sentence-structure.jpg",
    "show-what-you-need-before-you-use-it":
      "/images/tips/show-what-you-need-before-you-use-it.jpg",
    "story-planning-opposites":
      "/images/tips/story-planning-opposites.jpg",
    "structure-of-a-chapter": "/images/tips/structure-of-a-chapter.jpg",
    "what-are-the-keys-to-writing-a-good-story-these-are-mine":
      "/images/tips/what-are-the-keys-to-writing-a-good-story-these-are-mine.jpg",
    "why-do-i-alway-run-out-of-ideas-for-my-story":
      "/images/tips/why-do-i-alway-run-out-of-ideas-for-my-story.jpg",
    "writing-an-awesome-hook": "/images/tips/writing-an-awesome-hook.jpg",
    "writing-is-rewriting": "/images/tips/writing-is-rewriting.jpg",
  },
};

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
    const slug = data.slug ?? file.replace(/\.mdx$/, "");
    const featuredImage =
      data.featuredImage ??
      getFeaturedImageOverride(type, slug) ??
      extractFirstImage(content);
    posts.push({
      title: data.title ?? "Untitled",
      slug,
      date: data.date ?? null,
      postId: data.postId ?? null,
      type,
      categories: data.categories ?? [],
      canonicalSource: data.canonicalSource ?? "",
      featuredImage,
      excerpt: createExcerpt(content),
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
      author: s.author,
      featuredImage: null,
      excerpt: createExcerpt(submissionToMarkdown(s.content)),
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
      featuredImage:
        data.featuredImage ??
        getFeaturedImageOverride(type, data.slug ?? slug) ??
        extractFirstImage(content),
      excerpt: createExcerpt(content),
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
      .select("title, slug, content, author, moderated_at, created_at")
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
      author: data.author,
      featuredImage: null,
      excerpt: createExcerpt(submissionToMarkdown(data.content)),
      body: submissionToMarkdown(data.content),
    };
  }

  return null;
}

function extractFirstImage(body: string): string | null {
  const match = body.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
  return match?.[1] ?? null;
}

function getFeaturedImageOverride(
  type: ContentType,
  slug: string
): string | null {
  return FEATURED_IMAGE_OVERRIDES[type]?.[slug] ?? null;
}

function createExcerpt(body: string): string {
  return body
    .replace(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, "")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[#*_>`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
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
