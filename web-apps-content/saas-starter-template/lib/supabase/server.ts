import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase client for server-side usage (Server Components, Route Handlers).
 * Uses cookies from Next.js request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component; ignore.
          }
        },
      },
    }
  );
}

/**
 * Supabase client with service role key (bypasses RLS).
 * Use only in server-side API routes (e.g. webhooks). Never expose to the client.
 */
export async function createServiceRoleClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // No-op for service role
        },
      },
    }
  );
}
