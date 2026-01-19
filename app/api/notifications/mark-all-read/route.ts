/**
 * POST /api/notifications/mark-all-read
 * Mark all notifications as read for current user
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { markAllAsRead } from '@/lib/db/notifications-db';

export async function POST() {
  try {
    const user = await requireAuth();
    await markAllAsRead(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to mark all notifications as read';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
