import 'server-only';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { randomBytes, scrypt as derive, timingSafeEqual, createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { get, put, remove, storageConfigured } from './store';
export const presenterEmail = (process.env.STORYDOGS_PRESENTER_EMAIL || 'mark@chevertonauthorvisits.com').trim().toLowerCase();
export const sessionSeconds = 4 * 60 * 60;
type Config = { passwordHash: string; cookieSecret: string };
type Cookie = { sid?: string; expires?: number; fingerprint?: string };
function validConfig(config: Config): Config | null {
  return typeof config?.passwordHash === "string" && /^scrypt-32768-8-3\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(config.passwordHash) && typeof config.cookieSecret === "string" && config.cookieSecret.length >= 32 ? config : null;
}
export async function configuration(): Promise<Config | null> {
  if (process.env.STORYDOGS_PASSWORD_HASH && process.env.STORYDOGS_SESSION_SECRET) return validConfig({ passwordHash: process.env.STORYDOGS_PASSWORD_HASH, cookieSecret: process.env.STORYDOGS_SESSION_SECRET });
  if (process.env.NODE_ENV === 'production') return null;
  try { return validConfig(JSON.parse(await readFile(path.join(process.cwd(), '.local/storydogs-presenter.json'), 'utf8'))); }
  catch { return null; }
}
export async function verifyPassword(password: string, hash: string) {
  const [scheme, salt, hex] = hash.split('$');
  if (scheme !== 'scrypt-32768-8-3' || !/^[a-f0-9]{32}$/.test(salt || '') || !/^[a-f0-9]{128}$/.test(hex || '')) return false;
  const actual = await new Promise<Buffer>((resolve, reject) => derive(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 }, (error, key) => error ? reject(error) : resolve(key)));
  return timingSafeEqual(actual, Buffer.from(hex, 'hex'));
}
export async function presenterSession() {
  const config = await configuration();
  if (!config || config.cookieSecret.length < 32) return null;
  const session = await getIronSession<Cookie>(await cookies(), { cookieName: 'sd_presenter', password: config.cookieSecret, ttl: sessionSeconds, cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: sessionSeconds } });
  return { session, config };
}
export async function authenticated() {
  if (!storageConfigured()) return null;
  const context = await presenterSession(); if (!context) return null;
  const { session, config } = context;
  if (!session.sid || !session.expires || session.expires <= Date.now() || session.fingerprint !== createHash('sha256').update(config.passwordHash).digest('hex')) return null;
  try {
    const record = await get<{ expires: number }>('session:' + session.sid);
    return record && record.expires > Date.now() ? context : null;
  } catch { return null; }
}
export async function loginSession(context: NonNullable<Awaited<ReturnType<typeof presenterSession>>>) {
  if (context.session.sid) await remove('session:' + context.session.sid);
  context.session.sid = randomBytes(32).toString('hex'); context.session.expires = Date.now() + sessionSeconds * 1000;
  context.session.fingerprint = createHash('sha256').update(context.config.passwordHash).digest('hex');
  await put('session:' + context.session.sid, { expires: context.session.expires }); await context.session.save();
}
export async function logoutSession() {
  const context = await presenterSession();
  if (context) { if (context.session.sid) await remove('session:' + context.session.sid); context.session.destroy(); }
}
export function sameOrigin(request: Request) {
  try {
    const origin = new URL(request.headers.get('origin') || '');
    const host = request.headers.get('host') || new URL(request.url).host;
    // Next's internal URL can use localhost even when the browser uses 127.0.0.1.
    return origin.host === host && (process.env.NODE_ENV === 'production' ? origin.protocol === 'https:' : ['http:', 'https:'].includes(origin.protocol));
  } catch { return false; }
}
export const privateHeaders = { 'Cache-Control': 'no-store' };
