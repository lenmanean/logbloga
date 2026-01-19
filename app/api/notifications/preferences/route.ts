/**
 * GET /api/notifications/preferences - Get user's notification preferences
 * PUT /api/notifications/preferences - Update notification preferences
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getNotificationPreferences, updateNotificationPreferences } from '@/lib/db/notifications';
import type { UpdateNotificationPreferences } from '@/lib/db/notifications';

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const preferences = await getNotificationPreferences(user.id);

    return NextResponse.json({
      preferences,
    });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notification preferences';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const updates: UpdateNotificationPreferences = body;

    const preferences = await updateNotificationPreferences(user.id, updates);

    return NextResponse.json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update notification preferences';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

