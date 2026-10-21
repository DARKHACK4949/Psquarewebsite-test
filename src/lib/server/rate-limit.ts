import "server-only";

type Bucket = { hits: number[] };
const buckets = new Map<string, Bucket>();

/**
 * Sliding-window limiter, per key. In-memory, so it is per server instance;
 * for multi-region production swap in a shared store (e.g. Upstash Redis /
 * Vercel KV) behind this same signature.
 */
export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const b = buckets.get(key) ?? { hits: [] };
  b.hits = b.hits.filter((t) => now - t < windowMs);
  if (b.hits.length >= limit) {
    buckets.set(key, b);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - b.hits[0])) / 1000) };
  }
  b.hits.push(now);
  buckets.set(key, b);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.hits.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return { ok: true, retryAfter: 0 };
}
