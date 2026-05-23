/**
 * Content extraction pass: read migration/urls.json, fetch each post, write
 * MDX to content/{type}/{slug}.mdx, and download images to /public/images/migrated/.
 *
 *   npx tsx scripts/extract.ts              # all 1,095 posts
 *   npx tsx scripts/extract.ts --limit 5    # only first 5 (great for testing)
 *   npx tsx scripts/extract.ts --type fanfic --limit 10
 *   npx tsx scripts/extract.ts --no-images  # skip image downloads
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { extractPost, loadDiscoveredUrls } from "./lib/extract";

function parseArgs(argv: string[]) {
  const args = {
    limit: undefined as number | undefined,
    type: undefined as string | undefined,
    downloadImages: true,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--limit") args.limit = Number(argv[++i]);
    else if (a === "--type") args.type = argv[++i];
    else if (a === "--no-images") args.downloadImages = false;
  }
  return args;
}

function frontmatter(data: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(data)) {
    if (v === null || v === undefined) continue;
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      lines.push(`${k}: [${v.map((x) => JSON.stringify(x)).join(", ")}]`);
    } else if (typeof v === "string") {
      // Always JSON-stringify strings to handle quotes/colons safely
      lines.push(`${k}: ${JSON.stringify(v)}`);
    } else {
      lines.push(`${k}: ${JSON.stringify(v)}`);
    }
  }
  return `---\n${lines.join("\n")}\n---\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let urls = await loadDiscoveredUrls();
  if (args.type) urls = urls.filter((u) => u.type === args.type);
  if (args.limit) urls = urls.slice(0, args.limit);

  console.log(`Extracting ${urls.length} posts (downloadImages=${args.downloadImages})\n`);

  let success = 0;
  let failed = 0;
  const errors: { url: string; error: string }[] = [];

  for (let i = 0; i < urls.length; i++) {
    const { url, type } = urls[i];
    const prefix = `[${i + 1}/${urls.length}] ${type}`;
    try {
      const post = await extractPost(url, type, {
        downloadImages: args.downloadImages,
      });

      const fm = frontmatter({
        title: post.title,
        slug: post.slug,
        date: post.date,
        postId: post.postId,
        type: post.type,
        categories: post.categories,
        canonicalSource: post.url,
      });

      const outDir = join(process.cwd(), "content", type);
      await mkdir(outDir, { recursive: true });
      const outPath = join(outDir, `${post.slug}.mdx`);
      await writeFile(outPath, fm + "\n" + post.contentMarkdown + "\n", "utf8");

      const imgNote = post.imagesDownloaded.length
        ? ` +${post.imagesDownloaded.length} img`
        : "";
      console.log(`${prefix} ✓ ${post.slug}${imgNote}`);
      success++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`${prefix} ✗ ${url}: ${msg}`);
      errors.push({ url, error: msg });
      failed++;
    }
  }

  console.log(`\n✓ Extracted ${success}, ✗ Failed ${failed}`);

  if (errors.length) {
    const errPath = join(process.cwd(), "migration", "extract-errors.json");
    await writeFile(errPath, JSON.stringify(errors, null, 2), "utf8");
    console.log(`  Error details written to ${errPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
