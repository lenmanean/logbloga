import { requireAuth } from '@/lib/auth/utils';
import { uploadAvatar, deleteAvatar } from '@/lib/db/profiles';
import { NextResponse } from 'next/server';

/**
 * POST /api/account/profile/avatar
 * Upload avatar
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const avatarUrl = await uploadAvatar(user.id, file);

    return NextResponse.json({ url: avatarUrl }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/account/profile/avatar
 * Delete avatar
 */
export async function DELETE() {
  try {
    const user = await requireAuth();
    await deleteAvatar(user.id);

    return NextResponse.json({ message: 'Avatar deleted' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }
    return NextResponse.json(
      { error: 'Failed to delete avatar' },
      { status: 500 }
    );
  }
}

