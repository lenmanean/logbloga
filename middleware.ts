import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { Database } from '@/lib/types/supabase';
import { protectAdminRoute } from '@/lib/admin/middleware';

/**
 * Middleware for session management and route protection
 * Runs on every request to refresh session and protect routes
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client for middleware
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser();

      // Protected routes that require authentication
      const protectedPaths = ['/account', '/checkout'];
      const apiProtectedPaths = ['/api/account', '/api/cart', '/api/coupons', '/api/orders'];

  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const adminRedirect = await protectAdminRoute(request);
    if (adminRedirect) {
      return adminRedirect;
    }
  }

  // Check if path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isProtectedApiPath = apiProtectedPaths.some(path => pathname.startsWith(path));

  // For protected API routes, check authentication
  if (isProtectedApiPath) {
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  // For protected pages, redirect to sign in if not authenticated
  if (isProtectedPath && !user) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Allow auth pages and callback routes
  if (pathname.startsWith('/auth/')) {
    return response;
  }

  // HTTPS enforcement in production
  const isProduction = process.env.NODE_ENV === 'production';
  const protocol = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol;
  
  if (isProduction && protocol !== 'https') {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = 'https';
    return NextResponse.redirect(httpsUrl, 301);
  }

  // Add security headers
  const headers = new Headers(response.headers);

  // Content Security Policy
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com https://resend.com wss://*.supabase.co",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');

  headers.set('Content-Security-Policy', cspDirectives);
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('X-XSS-Protection', '1; mode=block');

  // HSTS (Strict-Transport-Security) - only in production
  if (isProduction) {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Create new response with security headers
  const secureResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Copy all headers to the response
  headers.forEach((value, key) => {
    secureResponse.headers.set(key, value);
  });

  return secureResponse;
}

/**
 * Configure which routes should be processed by middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

