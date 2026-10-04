import 'server-only';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { scrypt as derive, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
export const presenterEmail = (process.env.STORYDOGS_PRESENTER_EMAIL || 'mark@chevertonauthorvisits.com').trim().toLowerCase();
export const sessionSeconds = 8 * 60 * 60;
type Config = { passwordHash: string; cookieSecret: string };
type Cookie = { version?: number; email?: string; issuedAt?: number; expires?: number };
function validConfig(config: Config): Config | null {
  return typeof config?.passwordHash === "string" && /^scrypt-32768-8-3\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(config.passwordHash) && typeof config.cookieSecret === "string" && config.cookieSecret.length >= 32 ? config : null;
}
export async function configuration(): Promise<Config | null> {
  if (process.env.NODE_ENV === 'production' && !process.env.STORYDOGS_PRESENTER_EMAIL?.trim()) return null;
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
  const context = await presenterSession(); if (!context) return null;
  const { session } = context;
  const now = Date.now();
  if (session.version !== 2 || session.email !== presenterEmail ||
      !Number.isSafeInteger(session.issuedAt) || !Number.isSafeInteger(session.expires) ||
      session.issuedAt! > now || session.expires! <= now ||
      session.expires! <= session.issuedAt! || session.expires! > session.issuedAt! + sessionSeconds * 1000) return null;
  return context;
}
export async function loginSession(context: NonNullable<Awaited<ReturnType<typeof presenterSession>>>) {
  // Discard legacy payload fields and mint a new sealed session after every login.
  for (const key of Object.keys(context.session)) delete (context.session as Record<string, unknown>)[key];
  context.session.version = 2;
  context.session.email = presenterEmail;
  context.session.issuedAt = Date.now();
  context.session.expires = context.session.issuedAt + sessionSeconds * 1000;
  await context.session.save();
}
export async function logoutSession() {
  const context = await presenterSession();
  if (context) context.session.destroy();
  else (await cookies()).set('sd_presenter', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 });
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
