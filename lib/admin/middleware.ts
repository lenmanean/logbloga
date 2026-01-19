/**
 * Admin middleware utilities
 * Provides helpers for protecting admin routes
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { Database } from '@/lib/types/supabase';
import { isAdmin } from './permissions';

/**
 * Check if current user is admin
 * Used in Next.js middleware for route protection
 */
export async function checkAdminAccess(request: NextRequest): Promise<boolean> {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set() {
          // No-op in middleware
        },
        remove() {
          // No-op in middleware
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return false;
  }

  return await isAdmin(user.id);
}

/**
 * Protect admin route in middleware
 * Redirects non-admin users to account page
 */
export async function protectAdminRoute(
  request: NextRequest
): Promise<NextResponse | null> {
  const isAdmin = await checkAdminAccess(request);

  if (!isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = '/account';
    url.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(url);
  }

  return null; // Allow access
}

