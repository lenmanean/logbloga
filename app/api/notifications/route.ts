/**
 * GET /api/notifications - Get user's notifications
 * POST /api/notifications - Create a notification (admin/system only)
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import {
  getUserNotifications,
  createNotification,
  getUnreadCount,
} from '@/lib/db/notifications-db';
import type { NotificationType } from '@/lib/db/notifications-db';

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);

    const read = searchParams.get('read');
    const type = searchParams.get('type') as NotificationType | null;
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!)
      : undefined;
    const offset = searchParams.get('offset')
      ? parseInt(searchParams.get('offset')!)
      : undefined;

    const notifications = await getUserNotifications(user.id, {
      read: read === 'true' ? true : read === 'false' ? false : undefined,
      type: type || undefined,
      limit,
      offset,
    });

    const unreadCount = await getUnreadCount(user.id);

    return NextResponse.json({
      notifications,
      unreadCount,
      count: notifications.length,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch notifications';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Only allow system/service role to create notifications
    // In production, you might want to add admin check here
    const body = await request.json();
    const { user_id, type, title, message, link, metadata } = body;

    if (!user_id || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, type, title, message' },
        { status: 400 }
      );
    }

    const notification = await createNotification({
      user_id,
      type,
      title,
      message,
      link: link || null,
      metadata: metadata || {},
    });

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create notification';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
