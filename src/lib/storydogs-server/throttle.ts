import 'server-only';
// Best-effort protection within ONE warm process. Cold starts and other serverless
// instances do not share these counters; they are not a reliable global quota.
const counters = new Map<string, { count: number; until: number }>();
export async function allowed(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  for (const [name, value] of counters) if (value.until <= now) counters.delete(name);
  const prior = counters.get(key);
  if (prior && prior.count >= limit) return false;
  // Bound memory under many unique clients; fail closed in this process when full.
  if (!prior && counters.size >= 2048) return false;
  counters.set(key, { count: (prior?.count || 0) + 1, until: prior?.until || now + windowMs });
  return true;
}
