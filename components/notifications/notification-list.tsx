/**
 * Notification List Component
 * Full page notification list with pagination and filtering
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NotificationItem } from './notification-item';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Trash2 } from 'lucide-react';
import type { NotificationType } from '@/lib/db/notifications-db';

export function NotificationList() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all');
  const [page, setPage] = useState(1);
  const limit = 20;

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  } = useNotifications(user?.id || null, {
    read: filter === 'unread' ? false : filter === 'all' ? undefined : undefined,
    type: filter !== 'all' && filter !== 'unread' ? filter : undefined,
    limit: limit * page,
  });

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : filter !== 'all' && typeof filter === 'string'
      ? notifications.filter((n) => n.type === filter)
      : notifications;

  const displayedNotifications = filteredNotifications.slice(0, limit * page);
  const hasMore = filteredNotifications.length > limit * page;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
          <Select
            value={filter}
            onValueChange={(value) => {
              setFilter(value as typeof filter);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="order_confirmation">Orders</SelectItem>
              <SelectItem value="license_delivered">Licenses</SelectItem>
              <SelectItem value="payment_received">Payments</SelectItem>
              <SelectItem value="product_update">Products</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : displayedNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">
            {filter === 'unread'
              ? 'No unread notifications'
              : 'No notifications found'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {displayedNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
                showActions={true}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
