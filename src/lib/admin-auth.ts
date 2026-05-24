import { cookies } from "next/headers";

export const ADMIN_COOKIE = "mc_admin_session";

/**
 * Cookie value is a Web-Crypto SHA-256 hash of the configured admin
 * password plus a server-side salt. Web Crypto is used (not node:crypto)
 * so the hash matches what middleware computes on the Edge runtime.
 * When the password changes, all existing cookies invalidate.
 */
async function expectedCookieValue(): Promise<string | null> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  const data = new TextEncoder().encode(pw + "markcheverton.com/admin/v1");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function verifyPassword(password: string): boolean {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  if (password.length !== configured.length) return false;
  let mismatch = 0;
  for (let i = 0; i < password.length; i++) {
    mismatch |= password.charCodeAt(i) ^ configured.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function makeCookieValue(): Promise<string | null> {
  return expectedCookieValue();
}

export async function isAdminAuthed(): Promise<boolean> {
  const expected = await expectedCookieValue();
  if (!expected) return false;
  const c = await cookies();
  const got = c.get(ADMIN_COOKIE)?.value;
  return got === expected;
}
