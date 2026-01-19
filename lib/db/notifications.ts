/**
 * Notification preferences database operations
 * Provides functions to manage user notification preferences
 */

import { createClient } from '@/lib/supabase/server';

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_order_confirmation: boolean;
  email_order_shipped: boolean;
  email_promotional: boolean;
  email_product_updates: boolean;
  email_newsletter: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateNotificationPreferences {
  email_order_confirmation?: boolean;
  email_order_shipped?: boolean;
  email_promotional?: boolean;
  email_product_updates?: boolean;
  email_newsletter?: boolean;
}

/**
 * Get user's notification preferences
 * Creates default preferences if they don't exist
 */
export async function getNotificationPreferences(
  userId: string
): Promise<NotificationPreferences> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notification_preferences' as any)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No preferences found, create default
      return await createDefaultPreferences(userId);
    }
    console.error('Error fetching notification preferences:', error);
    throw new Error(`Failed to fetch notification preferences: ${error.message}`);
  }

  return data as unknown as NotificationPreferences;
}

/**
 * Create default notification preferences
 */
async function createDefaultPreferences(
  userId: string
): Promise<NotificationPreferences> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notification_preferences' as any)
    .insert({
      user_id: userId,
      email_order_confirmation: true,
      email_order_shipped: true,
      email_promotional: true,
      email_product_updates: true,
      email_newsletter: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating default preferences:', error);
    throw new Error(`Failed to create notification preferences: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to create notification preferences: No data returned');
  }

  return data as unknown as NotificationPreferences;
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: UpdateNotificationPreferences
): Promise<NotificationPreferences> {
  const supabase = await createClient();

  // Ensure preferences exist
  await getNotificationPreferences(userId);

  const { data, error } = await supabase
    .from('notification_preferences' as any)
    .update({
      ...preferences,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating notification preferences:', error);
    throw new Error(`Failed to update notification preferences: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to update notification preferences: No data returned');
  }

  return data as unknown as NotificationPreferences;
}

/**
 * Get users who have opted in for a specific notification type
 * Useful for sending bulk notifications
 */
export async function getUsersForNotification(
  notificationType: keyof Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notification_preferences' as any)
    .select('user_id')
    .eq(notificationType, true);

  if (error) {
    console.error('Error fetching users for notification:', error);
    throw new Error(`Failed to fetch users for notification: ${error.message}`);
  }

  return ((data || []) as any[]).map((item) => item.user_id);
}

