import { requireAuth } from '@/lib/auth/utils';
import { getHasPassword } from '@/lib/auth/has-password';
import { getUserProfile } from '@/lib/db/profiles';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/account/change-email
 * Change user email (requires verification).
 * When user has a password, requires password re-authentication.
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const profile = await getUserProfile(user.id);
    const currentEmail = profile?.email ?? user.email ?? '';
    const body = await request.json();
    const newEmail = typeof body?.newEmail === 'string' ? body.newEmail.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : undefined;

    if (!newEmail) {
      return NextResponse.json(
        { error: 'New email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (newEmail === currentEmail) {
      return NextResponse.json(
        { error: 'New email must be different from current email' },
        { status: 400 }
      );
    }

    const hasPassword = await getHasPassword(currentEmail);

    if (!hasPassword) {
      return NextResponse.json(
        { error: 'Add a password in the password section below to change your email.' },
        { status: 400 }
      );
    }

    if (!password || !password.trim()) {
      return NextResponse.json(
        { error: 'Password is required to change your email.' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: currentEmail,
      password: password.trim(),
    });

    if (signInError) {
      return NextResponse.json(
        { error: 'Invalid password. Please try again.' },
        { status: 401 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectTo = `${appUrl}/auth/callback`;

    const { error: updateError } = await supabase.auth.updateUser(
      { email: newEmail },
      { emailRedirectTo: redirectTo }
    );

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Verification email sent to new address' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }
    return NextResponse.json(
      { error: 'Failed to change email' },
      { status: 500 }
    );
  }
}

