/**
 * Rate limiting utilities
 * Auth rate limits are handled by Supabase (Dashboard > Authentication > Rate Limits).
 * This module provides a no-op interface so existing API routes need no changes.
 */

export type RateLimitType = 'public' | 'authenticated' | 'auth' | 'payment' | 'admin' | 'chat';

/**
 * Check rate limit for an identifier (IP address or user ID).
 * No-op: always allows the request. Supabase enforces auth rate limits.
 */
export async function checkRateLimit(
  _type: RateLimitType,
  _identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  return {
    success: true,
    limit: 0,
    remaining: 999,
    reset: Date.now() + 60000,
  };
}

/**
 * Get identifier for rate limiting (IP address or user ID)
 */
export function getRateLimitIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  return `ip:${ip}`;
}

/**
 * Format Retry-After header value
 */
export function getRetryAfterSeconds(reset: number): number {
  const now = Date.now();
  const secondsUntilReset = Math.ceil((reset - now) / 1000);
  return Math.max(1, secondsUntilReset);
}
