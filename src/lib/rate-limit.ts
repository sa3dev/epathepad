import { headers } from "next/headers";

interface Bucket {
  count: number;
  resetAt: number;
}

// In-memory sliding-window rate limiter. This app runs as a single long-lived
// Node process (self-hosted, not serverless), so an in-memory Map is enough —
// no Redis needed. Resets on redeploy, which is an acceptable trade-off here.
const buckets = new Map<string, Bucket>();

function prune(now: number) {
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

/** Returns true if the action is allowed, false if the caller is over the limit. */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size > 5000) prune(now);

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}

// Behind Dokploy/Traefik, the real client IP is forwarded via this header.
export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headersList.get("x-real-ip") ?? "unknown";
}
