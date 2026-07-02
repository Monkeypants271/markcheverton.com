type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterMs: number };

type RateBucket = {
  count: number;
  resetAt: number;
};

const rateBuckets = new Map<string, RateBucket>();

function getBucketKey(scope: string, ip: string) {
  return `${scope}:${ip || "unknown"}`;
}

function pruneExpiredBuckets(now: number) {
  for (const [key, bucket] of rateBuckets.entries()) {
    if (bucket.resetAt <= now) rateBuckets.delete(key);
  }
}

type HeaderGetter = { get(name: string): string | null };

/**
 * Resolve the client IP from a trusted, platform-set header.
 *
 * The leftmost value of `x-forwarded-for` is client-controlled (an attacker
 * can send their own header, which the platform appends to), so it must NOT
 * be trusted for rate limiting or IP bans. On Vercel, `x-real-ip` is set by
 * the platform to the true client IP; Cloudflare uses `cf-connecting-ip`.
 * We only fall back to `x-forwarded-for` when neither trusted header exists,
 * and then take the RIGHTMOST entry (the one added by the closest proxy).
 */
export function getClientIpFromHeaders(headers: HeaderGetter): string {
  const real = headers.get("x-real-ip");
  if (real) return real.trim();

  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }

  return "unknown";
}

export function getClientIp(req: Request): string {
  return getClientIpFromHeaders(req.headers);
}

export function consumeRateLimit(
  scope: string,
  ip: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  pruneExpiredBuckets(now);
  const key = getBucketKey(scope, ip);
  const existing = rateBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: Math.max(0, limit - 1) };
  }

  if (existing.count >= limit) {
    return { ok: false, retryAfterMs: Math.max(0, existing.resetAt - now) };
  }

  existing.count += 1;
  rateBuckets.set(key, existing);
  return { ok: true, remaining: Math.max(0, limit - existing.count) };
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function submittedTooFast(startedAt: number | null, minMs: number) {
  if (!startedAt || !Number.isFinite(startedAt)) return true;
  return Date.now() - startedAt < minMs;
}

export function parseStartedAt(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function hasTooManyLinks(value: string, maxLinks = 2) {
  const matches = value.match(/(?:https?:\/\/|www\.)/gi);
  return (matches?.length ?? 0) > maxLinks;
}

export async function verifyTurnstileToken(token: string | null, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    // Bot protection is silently disabled without a secret. That's fine for
    // local dev, but in production it means the CAPTCHA layer is off — make
    // that loud so a misconfigured deploy doesn't quietly ship unprotected.
    if (process.env.NODE_ENV === "production") {
      console.error(
        "TURNSTILE_SECRET_KEY is not set in production — bot protection is DISABLED."
      );
    }
    return { ok: true as const, skipped: true as const };
  }

  if (!token) {
    return { ok: false as const, error: "Please confirm you're human." };
  }

  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip && ip !== "unknown") form.append("remoteip", ip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      console.error("Turnstile verify failed", res.status);
      return { ok: false as const, error: "Security check failed. Please try again." };
    }

    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (!data.success) {
      console.warn("Turnstile rejected submission", data["error-codes"] || []);
      return { ok: false as const, error: "Please confirm you're human and try again." };
    }

    return { ok: true as const, skipped: false as const };
  } catch (error) {
    console.error("Turnstile request error", error);
    return { ok: false as const, error: "Security check failed. Please try again." };
  }
}
