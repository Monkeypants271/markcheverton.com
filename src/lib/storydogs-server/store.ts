import 'server-only';
import { redisConfigured, redisPut, redisGet, redisRemove, redisAllowed } from './redis';
import { mkdir, readFile, writeFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';

export function storageConfigured() { return process.env.NODE_ENV !== 'production' || redisConfigured(); }
function remote() { return process.env.NODE_ENV === 'production' || redisConfigured(); }

function root() {
  if (process.env.NODE_ENV === 'production') throw Error('Shared presenter storage is required.');
  return process.env.STORYDOGS_STATE_DIR || path.join(/* turbopackIgnore: true */ process.cwd(), '.local/storydogs-state');
}
const name = (key: string) => createHash('sha256').update(key).digest('hex');
export async function put(key: string, value: unknown) {
  if (remote()) return redisPut(key, value);
  const directory = root(); await mkdir(directory, { recursive: true, mode: 0o700 });
  const dest = path.join(directory, name(key)); const temp = dest + '.' + randomUUID();
  await writeFile(temp, JSON.stringify(value), { mode: 0o600 }); await rename(temp, dest);
}
export async function get<T>(key: string): Promise<T | null> {
  if (remote()) return redisGet<T>(key);
  try { return JSON.parse(await readFile(/* turbopackIgnore: true */ path.join(root(), name(key)), 'utf8')); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null; throw error; }
}
export async function remove(key: string) { if (remote()) return redisRemove(key); await rm(path.join(root(), name(key)), { force: true }); }
// Atomic directory lock serializes rate limits across local server processes.
export async function allowed(key: string, limit: number, windowMs: number) {
  if (remote()) return redisAllowed(key, limit, windowMs);
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
