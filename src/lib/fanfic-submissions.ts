import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { getSupabaseAdmin } from "@/lib/supabase";

export type DBFanficSubmission = {
  id: number;
  slug: string | null;
  title: string;
  author: string;
  author_email: string | null;
  ip_address: string | null;
  content: string;
  status: "pending" | "approved" | "rejected";
  action_token: string;
  created_at: string;
  moderated_at: string | null;
};

/** Lowercase, strip diacritics, replace non-alphanumerics with hyphens. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "story";
}

/**
 * Find a slug that doesn't conflict with an existing MDX file or
 * approved DB submission. Appends -2, -3 etc. as needed.
 */
export async function findUniqueSlug(base: string): Promise<string> {
  const mdxSlugs = new Set<string>();
  try {
    const files = await readdir(join(process.cwd(), "content", "fanfic"));
    for (const f of files) if (f.endsWith(".mdx")) mdxSlugs.add(f.replace(/\.mdx$/, ""));
  } catch {
    // content dir might not exist in tests; ignore
  }

  const supabase = getSupabaseAdmin();
  let dbSlugs = new Set<string>();
  if (supabase) {
    const { data } = await supabase
      .from("fanfic_submissions")
      .select("slug")
      .not("slug", "is", null);
    if (data) dbSlugs = new Set(data.map((r) => r.slug as string));
  }

  const isTaken = (s: string) => mdxSlugs.has(s) || dbSlugs.has(s);

  if (!isTaken(base)) return base;
  for (let n = 2; n < 1000; n++) {
    const candidate = `${base}-${n}`;
    if (!isTaken(candidate)) return candidate;
  }
  // last-ditch fallback: append timestamp
  return `${base}-${Date.now()}`;
}

/**
 * Convert the raw kid-typed submission into renderable Markdown:
 * every newline-run becomes a paragraph break, paragraphs joined with
 * blank lines so react-markdown renders them as <p>s.
 */
export function submissionToMarkdown(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .join("\n\n");
}
