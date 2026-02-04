/**
 * Rate limiting utilities using Upstash Redis
 * Provides different rate limit configurations for various endpoint types
 */

import { Ratelimit, type Duration } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Rate limit configuration types
 */
export type RateLimitType = 'public' | 'authenticated' | 'auth' | 'payment' | 'admin' | 'chat';

/**
 * Rate limit configurations
 */
const rateLimitConfigs: Record<RateLimitType, { requests: number; window: Duration }> = {
  public: { requests: 100, window: '1 m' }, // 100 requests per minute
  authenticated: { requests: 200, window: '1 m' }, // 200 requests per minute
  auth: { requests: 5, window: '1 m' }, // 5 requests per minute (signin/signup)
  payment: { requests: 10, window: '1 m' }, // 10 requests per minute (payment endpoints)
  admin: { requests: 500, window: '1 m' }, // 500 requests per minute (admin endpoints)
  chat: { requests: 30, window: '1 m' }, // 30 requests per minute (AI chat)
};

/**
 * Create rate limiter instance for a specific type
 */
function createRateLimiter(type: RateLimitType): Ratelimit {
  const config = rateLimitConfigs[type];
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    analytics: true,
    prefix: `ratelimit:${type}`,
  });
}

// Pre-create rate limiters for each type
const rateLimiters = {
  public: createRateLimiter('public'),
  authenticated: createRateLimiter('authenticated'),
  auth: createRateLimiter('auth'),
  payment: createRateLimiter('payment'),
  admin: createRateLimiter('admin'),
  chat: createRateLimiter('chat'),
};

/**
 * Get rate limiter instance
 */
export function getRateLimiter(type: RateLimitType): Ratelimit {
  return rateLimiters[type];
}

/**
 * Check rate limit for an identifier (IP address or user ID)
 * Returns success status and remaining requests
 */
export async function checkRateLimit(
  type: RateLimitType,
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const limiter = getRateLimiter(type);
  const result = await limiter.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Get identifier for rate limiting (IP address or user ID)
 */
export function getRateLimitIdentifier(request: Request, userId?: string): string {
  // Use user ID if authenticated, otherwise use IP address
  if (userId) {
    return `user:${userId}`;
  }

  // Get IP address from headers
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
