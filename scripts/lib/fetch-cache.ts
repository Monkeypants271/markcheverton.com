import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";

const CACHE_DIR = join(process.cwd(), ".cache", "fetch");

function cacheKey(url: string): string {
  return createHash("sha1").update(url).digest("hex");
}

function cachePath(url: string): string {
  const key = cacheKey(url);
  return join(CACHE_DIR, key.slice(0, 2), `${key}.html`);
}

export async function fetchCached(
  url: string,
  opts: { rateLimitMs?: number; force?: boolean } = {}
): Promise<string> {
  const path = cachePath(url);
  if (!opts.force) {
    try {
      await stat(path);
      return await readFile(path, "utf8");
    } catch {
      // not cached, fetch
    }
  }

  if (opts.rateLimitMs) {
    await new Promise((r) => setTimeout(r, opts.rateLimitMs));
  }

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; MarkChevertonMigrator/1.0; +https://github.com/Monkeypants271/markcheverton.com)",
    },
  });

  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status} for ${url}`);
  }

  const body = await res.text();
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, body, "utf8");
  return body;
}
