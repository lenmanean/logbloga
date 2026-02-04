import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Auth callback route handler
 * Handles OAuth redirects and email verification callbacks
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type'); // 'signup', 'recovery', etc.
  const next = requestUrl.searchParams.get('next') || '/account/profile';

  const supabase = await createClient();

  // Handle email verification (token_hash)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'signup' | 'email' | 'recovery' | 'invite',
    });

    if (!error) {
      // Email verified successfully - redirect to next (e.g. express checkout) or account
      const redirectUrl = new URL(next, request.url);
      redirectUrl.searchParams.set('verified', 'true');
      return NextResponse.redirect(redirectUrl);
    } else {
      // Verification failed
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('error', 'verification_failed');
      return NextResponse.redirect(signInUrl);
    }
  }

  // Handle OAuth callback (code)
  if (code) {
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to the specified next URL or default
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // If there's an error or no valid parameters, redirect to sign in
  const signInUrl = new URL('/auth/signin', request.url);
  signInUrl.searchParams.set('error', 'auth_error');
  
  return NextResponse.redirect(signInUrl);
}

