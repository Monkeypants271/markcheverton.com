/**
 * Signed admin-session cookie helpers.
 *
 * The cookie value is `<issuedAt>.<hmac>` where hmac = HMAC-SHA256 of the
 * issuedAt timestamp keyed by a server secret. This means:
 *   - the value is NOT derivable from the password alone (it needs the secret),
 *   - each login gets a distinct value (different issuedAt),
 *   - sessions expire on their own (issuedAt + MAX_AGE), independent of the cookie maxAge.
 *
 * Web Crypto is used (not node:crypto) so the exact same code runs in the
 * Edge `proxy` and in Node route handlers / server actions.
 */

const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const CLOCK_SKEW_MS = 60 * 1000;

/**
 * Secret used to key the HMAC. Prefer a dedicated SESSION_SECRET; fall back to
 * ADMIN_PASSWORD so the site still works if only the password is configured.
 * (Rotating either value invalidates all existing sessions.)
 */
function getSecret(): string | null {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

async function hmacHex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Mint a fresh signed session value. Returns null if no secret is configured. */
export async function signSession(issuedAt: number = Date.now()): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  const payload = String(issuedAt);
  const sig = await hmacHex(secret, payload);
  return `${payload}.${sig}`;
}

/** Verify a cookie value: signature must match and the session must not be expired. */
export async function verifySession(value: string | undefined | null): Promise<boolean> {
  if (!value) return false;
  const secret = getSecret();
  if (!secret) return false;

  const dot = value.lastIndexOf(".");
  if (dot <= 0) return false;

  const payload = value.slice(0, dot);
  const sig = value.slice(dot + 1);

  const issuedAt = Number(payload);
  if (!Number.isFinite(issuedAt)) return false;

  const now = Date.now();
  if (issuedAt > now + CLOCK_SKEW_MS) return false; // future-dated
  if (now - issuedAt > MAX_AGE_MS) return false; // expired

  const expected = await hmacHex(secret, payload);
  return timingSafeEqual(sig, expected);
}
