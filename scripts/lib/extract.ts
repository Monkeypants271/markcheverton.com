import { load as loadHTML, type CheerioAPI } from "cheerio";
import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import TurndownService from "turndown";
import { fetchCached } from "./fetch-cache";

export type ExtractedPost = {
  url: string;
  slug: string;
  type: string;
  title: string;
  date: string | null;
  postId: number | null;
  categories: string[];
  excerpt: string;
  contentMarkdown: string;
  imagesDownloaded: { original: string; local: string }[];
};

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "_",
});

// Strip Divi's wrapping divs that don't carry semantic meaning, keep their contents
turndown.addRule("stripDiviWrappers", {
  filter: (node) => {
    if (node.nodeName !== "DIV") return false;
    const cls = (node as HTMLElement).className || "";
    return /\bet_pb_/.test(cls);
  },
  replacement: (content) => content,
});

// Drop sharing widgets and similar UI cruft
turndown.addRule("dropUiCruft", {
  filter: (node) => {
    if (node.nodeName !== "DIV") return false;
    const cls = (node as HTMLElement).className || "";
    return /\b(sharedaddy|jp-relatedposts|wp-block-buttons|post-meta)\b/.test(
      cls
    );
  },
  replacement: () => "",
});

const IMAGES_DIR = join(process.cwd(), "public", "images", "migrated");

async function downloadImage(src: string): Promise<string> {
  const hash = createHash("sha1").update(src).digest("hex").slice(0, 16);
  const ext = (extname(new URL(src).pathname) || ".jpg").toLowerCase();
  const filename = `${hash}${ext}`;
  const localPath = join(IMAGES_DIR, filename);
  const publicPath = `/images/migrated/${filename}`;

  try {
    await stat(localPath);
    return publicPath;
  } catch {
    // not downloaded yet
  }

  const res = await fetch(src, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; MarkChevertonMigrator/1.0; +https://github.com/Monkeypants271/markcheverton.com)",
    },
  });
  if (!res.ok) {
    throw new Error(`Image fetch failed ${res.status} for ${src}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(IMAGES_DIR, { recursive: true });
  await writeFile(localPath, buf);
  return publicPath;
}

function slugFromUrl(url: string): string {
  const u = new URL(url);
  const parts = u.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] || "index";
}

function postIdFromArticle($: CheerioAPI): number | null {
  const id = $("article").first().attr("id");
  if (!id) return null;
  const match = id.match(/post-(\d+)/);
  return match ? Number(match[1]) : null;
}

function categoriesFromArticle($: CheerioAPI): string[] {
  const cls = $("article").first().attr("class") || "";
  const cats: string[] = [];
  for (const m of cls.matchAll(/category-([\w-]+)/g)) {
    cats.push(m[1]);
  }
  return cats;
}

export async function extractPost(
  url: string,
  type: string,
  opts: { downloadImages?: boolean } = {}
): Promise<ExtractedPost> {
  const html = await fetchCached(url, { rateLimitMs: 250 });
  const $ = loadHTML(html);

  const title =
    $("h1.entry-title").first().text().trim() ||
    $("h1").first().text().trim() ||
    "Untitled";

  const dateMeta = $('meta[property="article:published_time"]').attr("content");
  const date = dateMeta ? dateMeta.split("T")[0] : null;

  const postId = postIdFromArticle($);
  const categories = categoriesFromArticle($);

  // Body candidates, in order of preference
  let $body =
    $(".entry-content").first().length > 0
      ? $(".entry-content").first()
      : $("article.et_pb_post .et_pb_text_inner").first();

  if (!$body.length) {
    $body = $("article").first();
  }

  // Strip nav/sharing elements that sometimes get caught
  $body.find("nav, .sharedaddy, .jp-relatedposts, script, style").remove();

  // Download every image in body and rewrite src
  const imagesDownloaded: { original: string; local: string }[] = [];
  if (opts.downloadImages) {
    const imgs = $body.find("img").toArray();
    for (const img of imgs) {
      const src = $(img).attr("src");
      if (!src) continue;
      try {
        const local = await downloadImage(src);
        $(img).attr("src", local);
        imagesDownloaded.push({ original: src, local });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`    ! image skipped (${msg}): ${src}`);
      }
    }
  }

  const bodyHtml = $body.html() ?? "";
  const contentMarkdown = turndown.turndown(bodyHtml).trim();

  // Excerpt = first ~280 chars of plain text
  const plainText = $body.text().replace(/\s+/g, " ").trim();
  const excerpt = plainText.slice(0, 280);

  return {
    url,
    slug: slugFromUrl(url),
    type,
    title,
    date,
    postId,
    categories,
    excerpt,
    contentMarkdown,
    imagesDownloaded,
  };
}

export async function loadDiscoveredUrls(): Promise<
  { url: string; type: string }[]
> {
  const path = join(process.cwd(), "migration", "urls.json");
  const json = JSON.parse(await readFile(path, "utf8")) as Array<{
    url: string;
    type: string;
  }>;
  return json;
}
