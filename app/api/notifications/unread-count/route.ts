/**
 * GET /api/notifications/unread-count
 * Get unread notification count for current user
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getUnreadCount } from '@/lib/db/notifications-db';

export async function GET() {
  try {
    const user = await requireAuth();
    const count = await getUnreadCount(user.id);

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch unread count';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
