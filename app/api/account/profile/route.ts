import { requireAuth } from '@/lib/auth/utils';
import { getUserProfile, updateUserProfile } from '@/lib/db/profiles';
import { NextResponse } from 'next/server';

/**
 * GET /api/account/profile
 * Get current user's profile
 */
export async function GET() {
  try {
    const user = await requireAuth();
    const profile = await getUserProfile(user.id);

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/account/profile
 * Update current user's profile
 */
export async function PATCH(request: Request) {
  try {
    const user = await requireAuth();
    const updates = await request.json();

    const profile = await updateUserProfile(user.id, updates);

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update profile' },
      { status: 500 }
    );
  }
}

