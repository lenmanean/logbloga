/**
 * Rate limiting middleware wrapper for Next.js API routes
 */

import { NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitIdentifier, getRetryAfterSeconds, type RateLimitType } from './rate-limit';

/**
 * Rate limit middleware options
 */
export interface RateLimitOptions {
  type: RateLimitType;
  userId?: string;
  skipInDevelopment?: boolean;
}

/**
 * Apply rate limiting to an API route handler
 */
export async function withRateLimit<T>(
  request: Request,
  options: RateLimitOptions,
  handler: () => Promise<Response>
): Promise<Response> {
  // Skip rate limiting in development if configured
  if (options.skipInDevelopment && process.env.NODE_ENV === 'development') {
    return handler();
  }

  try {
    const identifier = getRateLimitIdentifier(request, options.userId);
    const result = await checkRateLimit(options.type, identifier);

    if (!result.success) {
      const retryAfter = getRetryAfterSeconds(result.reset);
      
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.reset).toISOString(),
          },
        }
      );
    }

    // Call the handler
    const response = await handler();

    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(result.reset).toISOString());

    return response;
  } catch (error) {
    console.error('Rate limiting error:', error);
    // On error, allow the request to proceed (fail open)
    // This prevents rate limiting from breaking the application
    return handler();
  }
}
