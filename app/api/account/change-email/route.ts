import { requireAuth } from '@/lib/auth/utils';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/account/change-email
 * Change user email (requires verification)
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const { newEmail } = await request.json();

    if (!newEmail) {
      return NextResponse.json(
        { error: 'New email is required' },
        { status: 400 }
      );
    }

    if (newEmail === user.email) {
      return NextResponse.json(
        { error: 'New email must be different from current email' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Update email (Supabase will send verification email)
    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail,
    });

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

