/**
 * GET /api/notifications/[id] - Get notification by ID
 * PUT /api/notifications/[id] - Update notification (mark as read)
 * DELETE /api/notifications/[id] - Delete notification
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import {
  getUserNotifications,
  markAsRead,
  deleteNotification,
} from '@/lib/db/notifications-db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const notifications = await getUserNotifications(user.id);
    const notification = notifications.find((n) => n.id === id);

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ notification });
  } catch (error) {
    console.error('Error fetching notification:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch notification';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { read } = body;

    if (read === true) {
      const notification = await markAsRead(id, user.id);
      return NextResponse.json({ notification });
    }

    return NextResponse.json(
      { error: 'Only read=true is supported' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating notification:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update notification';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    await deleteNotification(id, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete notification';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
