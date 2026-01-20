/**
 * In-app notifications database operations
 * Provides functions to manage user notifications
 * 
 * Note: This is separate from notification_preferences.ts which handles email preferences
 */

import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import { mapSupabaseNotification, mapSupabaseNotifications } from '@/lib/types/mappers';
import type { Database } from '@/lib/types/supabase';

export type NotificationType =
  | 'order_confirmation'
  | 'order_status_update'
  | 'license_delivered'
  | 'payment_received'
  | 'product_update'
  | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  metadata: Record<string, any>;
  read: boolean;
  created_at: string;
}

export interface CreateNotificationData {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  metadata?: Record<string, any>;
}

export interface NotificationFilters {
  read?: boolean;
  type?: NotificationType;
  limit?: number;
  offset?: number;
}

/**
 * Create a new notification
 * Uses service role client to bypass RLS for system notifications
 */
export async function createNotification(
  data: CreateNotificationData
): Promise<Notification> {
  const supabase = await createServiceRoleClient();

  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      user_id: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link || null,
      metadata: data.metadata || {},
      read: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    throw new Error(`Failed to create notification: ${error.message}`);
  }

  if (!notification) {
    throw new Error('Failed to create notification: No data returned');
  }

  return mapSupabaseNotification(notification);
}

/**
 * Get user's notifications
 */
export async function getUserNotifications(
  userId: string,
  filters?: NotificationFilters
): Promise<Notification[]> {
  const supabase = await createClient();

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (filters?.read !== undefined) {
    query = query.eq('read', filters.read);
  }

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching notifications:', error);
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }

  return mapSupabaseNotifications(data || []);
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) {
    console.error('Error fetching unread count:', error);
    throw new Error(`Failed to fetch unread count: ${error.message}`);
  }

  return count || 0;
}

/**
 * Mark notification as read
 */
export async function markAsRead(
  notificationId: string,
  userId: string
): Promise<Notification> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error marking notification as read:', error);
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to mark notification as read: No data returned');
  }

  return mapSupabaseNotification(data);
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) {
    console.error('Error marking all notifications as read:', error);
    throw new Error(`Failed to mark all notifications as read: ${error.message}`);
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(
  notificationId: string,
  userId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting notification:', error);
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
}

/**
 * Delete all read notifications for a user
 */
export async function deleteAllRead(userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', userId)
    .eq('read', true);

  if (error) {
    console.error('Error deleting read notifications:', error);
    throw new Error(`Failed to delete read notifications: ${error.message}`);
  }
}
