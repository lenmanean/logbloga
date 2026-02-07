import { requireAuth } from '@/lib/auth/utils';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = {
  upper: /[A-Z]/,
  lower: /[a-z]/,
  number: /[0-9]/,
};

function validatePasswordStrength(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return 'Password must be at least 8 characters';
  }
  if (!PASSWORD_REGEX.upper.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!PASSWORD_REGEX.lower.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!PASSWORD_REGEX.number.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
}

/**
 * POST /api/account/change-password
 * Add a password (mode: add) or change existing password (mode: change).
 * Add: requires valid session; no current password.
 * Change: requires currentPassword verification, then update.
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { mode, currentPassword, newPassword } = body;

    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      );
    }

    const strengthError = validatePasswordStrength(newPassword);
    if (strengthError) {
      return NextResponse.json(
        { error: strengthError },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    if (mode === 'change') {
      if (!currentPassword || typeof currentPassword !== 'string' || !currentPassword.trim()) {
        return NextResponse.json(
          { error: 'Current password is required to change your password' },
          { status: 400 }
        );
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (signInError) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        );
      }
    }
    // mode === 'add' or omitted: no current password check; rely on valid session

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
      data: { has_set_password: true },
    });

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: mode === 'change' ? 'Password updated successfully' : 'Password added successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error;
    }
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}
