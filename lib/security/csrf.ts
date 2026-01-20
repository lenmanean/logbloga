/**
 * CSRF protection utilities
 * Implements Double Submit Cookie pattern
 */

import { cookies } from 'next/headers';
import crypto from 'crypto';

const CSRF_TOKEN_COOKIE_NAME = '__csrf-token';
const CSRF_TOKEN_HEADER_NAME = 'x-csrf-token';

/**
 * Generate a secure random CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Set CSRF token in HTTP-only cookie
 */
export async function setCsrfToken(): Promise<string> {
  const token = generateCsrfToken();
  const cookieStore = await cookies();

  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = 60 * 60 * 24; // 24 hours

  cookieStore.set(CSRF_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge,
    path: '/',
  });

  return token;
}

/**
 * Get CSRF token from cookie
 */
export async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CSRF_TOKEN_COOKIE_NAME);
  return token?.value || null;
}

/**
 * Validate CSRF token from request
 */
export async function validateCsrfToken(request: Request): Promise<boolean> {
  // Skip CSRF validation for GET, HEAD, OPTIONS requests
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  // Get token from header
  const headerToken = request.headers.get(CSRF_TOKEN_HEADER_NAME);

  if (!headerToken) {
    return false;
  }

  // Get token from cookie
  const cookieToken = await getCsrfToken();

  if (!cookieToken) {
    return false;
  }

  // Compare tokens (timing-safe comparison)
  return crypto.timingSafeEqual(
    Buffer.from(headerToken),
    Buffer.from(cookieToken)
  );
}

/**
 * Get CSRF token for client-side use
 * Returns the token without the HTTP-only cookie (for forms)
 */
export async function getCsrfTokenForClient(): Promise<string | null> {
  let token = await getCsrfToken();

  // If no token exists, create one
  if (!token) {
    token = await setCsrfToken();
  }

  return token;
}

/**
 * Middleware to validate CSRF token on state-changing requests
 */
export async function withCsrfProtection<T>(
  request: Request,
  handler: () => Promise<Response>
): Promise<Response> {
  // Skip CSRF validation for webhooks (they use signature verification)
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/stripe/webhook')) {
    return handler();
  }

  const isValid = await validateCsrfToken(request);

  if (!isValid) {
    return new Response(
      JSON.stringify({
        error: 'Forbidden',
        message: 'Invalid or missing CSRF token',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return handler();
}
