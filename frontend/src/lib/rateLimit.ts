/**
 * Minimal in-memory rate limiter for auth endpoints.
 *
 * This intentionally has no external dependency (Redis, etc.) — the app runs
 * as a single persistent Node process (Hostinger Node.js Web Apps, not
 * per-request serverless), so an in-process Map is a real, effective limiter
 * here. It resets on redeploy/restart, which is an acceptable tradeoff at
 * this scale; a distributed store would only be needed if this ever runs as
 * multiple instances behind a load balancer.
 */

interface AttemptRecord {
  count: number;
  firstAttemptAt: number;
}

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, AttemptRecord>();

// Periodic sweep so the Map doesn't grow unbounded from one-off/expired entries.
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of attempts) {
    if (now - record.firstAttemptAt > WINDOW_MS) attempts.delete(key);
  }
}, WINDOW_MS);
cleanupInterval.unref?.();

export function checkRateLimit(identifier: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const record = attempts.get(identifier);

  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    attempts.set(identifier, { count: 1, firstAttemptAt: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - record.firstAttemptAt)) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  record.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Call after a successful login so a real user isn't penalized by their own earlier typos. */
export function resetRateLimit(identifier: string): void {
  attempts.delete(identifier);
}

/** Best-effort client identifier behind a reverse proxy (Hostinger, etc.). */
export function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}
