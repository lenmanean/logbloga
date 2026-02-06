import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitIdentifier, getRetryAfterSeconds } from '@/lib/security/rate-limit';

/**
 * Send OTP for email sign-in/sign-up (product page auth modal).
 * POST /api/auth/otp/send
 * Rate limited via auth limiter (5/min).
 */
export async function POST(request: Request) {
  try {
    const { email, fullName } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const identifier = getRateLimitIdentifier(request);
    const { success, remaining, reset } = await checkRateLimit('auth', identifier);

    if (!success) {
      const retryAfter = getRetryAfterSeconds(reset);
      return NextResponse.json(
        { error: 'Too many attempts. Please wait a moment and try again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Remaining': String(remaining),
          },
        }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        shouldCreateUser: true,
        data: typeof fullName === 'string' && fullName.trim() ? { full_name: fullName.trim() } : undefined,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Verification code sent. Please check your email.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
