/**
 * Discovery pass: walk every WordPress index page and collect the URL of
 * every individual post. Outputs migration/urls.json.
 *
 * Run: npx tsx scripts/discover.ts
 */

import { load as loadHTML } from "cheerio";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fetchCached } from "./lib/fetch-cache";

type SourceType = "fanfic" | "blog" | "tips" | "sensory-details" | "prompts";

type Source = {
  type: SourceType;
  indexUrl: string;
  paginated: boolean;
  maxPages?: number;
};

const SOURCES: Source[] = [
  {
    type: "fanfic",
    indexUrl: "https://markcheverton.com/fanfic/",
    paginated: true,
    maxPages: 84,
  },
  {
    type: "blog",
    indexUrl: "https://markcheverton.com/on-writing-and-teaching/",
    paginated: true,
    maxPages: 5,
  },
  {
    type: "tips",
    indexUrl: "https://markcheverton.com/writing-tips-from-mark/",
    paginated: true,
    maxPages: 5,
  },
  {
    type: "sensory-details",
    indexUrl: "https://markcheverton.com/sensorydetails/",
    paginated: true,
    maxPages: 5,
  },
  {
    type: "prompts",
    indexUrl: "https://markcheverton.com/writing-prompts/",
    paginated: true,
    maxPages: 5,
  },
];

type DiscoveredPost = {
  url: string;
  type: SourceType;
  foundOnPage: number;
};

const POST_SELECTOR = "article.et_pb_post";
const LINK_INSIDE_POST = "h2.entry-title a, h1.entry-title a";

async function discoverSource(source: Source): Promise<DiscoveredPost[]> {
  const results: DiscoveredPost[] = [];
  const seen = new Set<string>();

  const pages = source.paginated ? source.maxPages ?? 1 : 1;

  for (let page = 1; page <= pages; page++) {
    const url =
      page === 1 ? source.indexUrl : `${source.indexUrl}page/${page}/`;

    let html: string;
    try {
      html = await fetchCached(url, { rateLimitMs: 250 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // 404 means we've passed the last page — stop gracefully
      if (msg.includes("404")) {
        console.log(`  [${source.type}] reached end at page ${page}`);
        break;
      }
      throw err;
    }

    const $ = loadHTML(html);
    let pageCount = 0;

    $(POST_SELECTOR).each((_, el) => {
      const $post = $(el);
      const href = $post.find(LINK_INSIDE_POST).first().attr("href");
      if (!href) return;
      if (seen.has(href)) return;
      seen.add(href);
      results.push({ url: href, type: source.type, foundOnPage: page });
      pageCount++;
    });

    console.log(
      `  [${source.type}] page ${page}: +${pageCount} (total ${results.length})`
    );

    // Hard stop when a page yields 0 — past the last real page
    if (pageCount === 0 && page > 1) break;
  }

  return results;
}

async function main() {
  const all: DiscoveredPost[] = [];

  for (const source of SOURCES) {
    console.log(`\nDiscovering ${source.type}...`);
    const found = await discoverSource(source);
    all.push(...found);
    console.log(`  → ${found.length} ${source.type} URLs`);
  }

  const outDir = join(process.cwd(), "migration");
  await mkdir(outDir, { recursive: true });
  const outPath = join(outDir, "urls.json");
  await writeFile(outPath, JSON.stringify(all, null, 2), "utf8");

  console.log(`\n✓ Wrote ${all.length} URLs to migration/urls.json`);

  // Counts by type
  const byType = all.reduce<Record<string, number>>((acc, p) => {
    acc[p.type] = (acc[p.type] ?? 0) + 1;
    return acc;
  }, {});
  console.log("\nCounts by type:");
  for (const [type, count] of Object.entries(byType)) {
    console.log(`  ${type}: ${count}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
