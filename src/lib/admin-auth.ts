import { cookies } from "next/headers";
import { signSession, verifySession } from "./admin-session";

export const ADMIN_COOKIE = "mc_admin_session";

/**
 * Constant-time-ish password check. We fold the length difference into the
 * accumulator instead of returning early on it, so the comparison doesn't
 * leak the configured password's length through timing.
 */
export function verifyPassword(password: string): boolean {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;

  const a = new TextEncoder().encode(password);
  const b = new TextEncoder().encode(configured);

  let mismatch = a.length ^ b.length;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a[i] ^ (b[i] ?? 0);
  }
  return mismatch === 0;
}

/** Mint a signed session cookie value for a freshly authenticated admin. */
export async function makeCookieValue(): Promise<string | null> {
  return signSession();
}

export async function isAdminAuthed(): Promise<boolean> {
  const c = await cookies();
  return verifySession(c.get(ADMIN_COOKIE)?.value);
}
