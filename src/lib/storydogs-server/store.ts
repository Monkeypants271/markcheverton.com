import 'server-only';
import { mkdir, readFile, writeFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';

function root() {
  if (process.env.NODE_ENV === 'production' && !process.env.STORYDOGS_STATE_DIR) throw Error('A durable StoryDogs state directory is required.');
  return process.env.STORYDOGS_STATE_DIR || path.join(process.cwd(), '.local/storydogs-state');
}
const name = (key: string) => createHash('sha256').update(key).digest('hex');
export async function put(key: string, value: unknown) {
  const directory = root(); await mkdir(directory, { recursive: true, mode: 0o700 });
  const dest = path.join(directory, name(key)); const temp = dest + '.' + randomUUID();
  await writeFile(temp, JSON.stringify(value), { mode: 0o600 }); await rename(temp, dest);
}
export async function get<T>(key: string): Promise<T | null> {
  try { return JSON.parse(await readFile(path.join(root(), name(key)), 'utf8')); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null; throw error; }
}
export async function remove(key: string) { await rm(path.join(root(), name(key)), { force: true }); }
// Atomic directory lock serializes rate limits across local server processes.
export async function allowed(key: string, limit: number, windowMs: number) {
  const directory = root(); await mkdir(directory, { recursive: true, mode: 0o700 });
  const lock = path.join(directory, name('lock:' + key));
  for (let attempt = 0; attempt < 40; attempt++) {
    try { await mkdir(lock); break; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      if (attempt === 39) return false;
      await new Promise(resolve => setTimeout(resolve, 25));
    }
  }
  try {
    const now = Date.now(); const prior = await get<{ count: number; until: number }>('rate:' + key);
    const value = prior && prior.until > now ? prior : { count: 0, until: now + windowMs };
    if (value.count >= limit) return false;
    value.count++; await put('rate:' + key, value); return true;
  } finally { await rm(lock, { recursive: true, force: true }); }
}
