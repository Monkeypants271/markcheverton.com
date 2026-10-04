import 'server-only';
import { createHash } from 'node:crypto';

export function redisConfigured() {
  const url = process.env.STORYDOGS_REDIS_REST_URL;
  return Boolean(url && /^https:\/\//.test(url) && process.env.STORYDOGS_REDIS_REST_TOKEN);
}
const keyName = (key: string) => `storydogs:${process.env.STORYDOGS_REDIS_NAMESPACE || 'production'}:${createHash('sha256').update(key).digest('hex')}`;
async function command(args: (string | number)[]) {
  if (!redisConfigured()) throw new Error('Shared presenter storage is unavailable.');
  const response = await fetch(process.env.STORYDOGS_REDIS_REST_URL!, {
    method: 'POST', headers: { Authorization: `Bearer ${process.env.STORYDOGS_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args), cache: 'no-store', signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error('Shared presenter storage is unavailable.');
  const data = await response.json();
  if (data.error) throw new Error('Shared presenter storage is unavailable.');
  return data.result;
}
export async function redisPut(key: string, value: unknown) {
  const expiry = (value as { expires?: number })?.expires;
  if (!Number.isFinite(expiry)) throw new Error('A session expiry is required.');
  await command(['SET', keyName(key), JSON.stringify(value), 'PX', Math.max(1, expiry! - Date.now())]);
}
export async function redisGet<T>(key: string): Promise<T | null> {
  const result = await command(['GET', keyName(key)]);
  return result === null ? null : JSON.parse(result);
}
export async function redisRemove(key: string) { await command(['DEL', keyName(key)]); }
// A single Redis transaction checks/increments and sets expiry. All instances share the same limit.
const limitScript = `local n = tonumber(redis.call('GET', KEYS[1]) or '0')
if n >= tonumber(ARGV[1]) then return 0 end
n = redis.call('INCR', KEYS[1])
if n == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[2]) end
return 1`;
export async function redisAllowed(key: string, limit: number, windowMs: number) {
  return await command(['EVAL', limitScript, 1, keyName('rate:' + key), limit, windowMs]) === 1;
}
