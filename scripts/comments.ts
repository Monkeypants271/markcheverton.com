/**
 * Pull every comment from the WordPress REST API, group by post ID,
 * and write migration/comments.json. Existing comments are pre-approved
 * per the user's Phase 2 decision.
 *
 *   npx tsx scripts/comments.ts
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

type WPComment = {
  id: number;
  post: number;
  parent: number;
  author_name: string;
  author_url: string;
  date: string;
  content: { rendered: string };
  link: string;
  status: string;
  type: string;
};

type MigratedComment = {
  id: number;
  parent: number;
  author: string;
  authorUrl: string | null;
  date: string;
  contentHtml: string;
  link: string;
  status: "approved";
};

const BASE = "https://www.markcheverton.com/wp-json/wp/v2/comments";

async function fetchPage(page: number): Promise<WPComment[]> {
  const url = `${BASE}?per_page=100&page=${page}&_fields=id,post,parent,author_name,author_url,date,content,link,status,type`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (compatible; MarkChevertonMigrator/1.0; +https://github.com/Monkeypants271/markcheverton.com)",
    },
  });
  if (res.status === 400 || res.status === 404) {
    // past the last page
    return [];
  }
  if (!res.ok) {
    throw new Error(`Comments page ${page} failed: ${res.status}`);
  }
  return (await res.json()) as WPComment[];
}

async function main() {
  const all: MigratedComment[] = [];
  const byPost: Record<number, MigratedComment[]> = {};
  let page = 1;

  while (true) {
    const batch = await fetchPage(page);
    if (batch.length === 0) break;
    console.log(`  page ${page}: +${batch.length} comments`);

    for (const c of batch) {
      if (c.type !== "comment") continue;
      const m: MigratedComment = {
        id: c.id,
        parent: c.parent,
        author: c.author_name || "Anonymous",
        authorUrl: c.author_url || null,
        date: c.date,
        contentHtml: c.content.rendered,
        link: c.link,
        status: "approved",
      };
      all.push(m);
      (byPost[c.post] ??= []).push(m);
    }

    if (batch.length < 100) break; // last page
    page++;
    await new Promise((r) => setTimeout(r, 200));
  }

  const outDir = join(process.cwd(), "migration");
  await mkdir(outDir, { recursive: true });
  await writeFile(
    join(outDir, "comments.json"),
    JSON.stringify({ total: all.length, byPost }, null, 2),
    "utf8"
  );

  console.log(`\n✓ Wrote ${all.length} comments to migration/comments.json`);
  console.log(`  across ${Object.keys(byPost).length} posts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
