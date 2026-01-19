/**
 * Notification Item Component
 * Displays a single notification
 */

'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  Package,
  CreditCard,
  Key,
  Bell,
  ShoppingBag,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Notification } from '@/lib/db/notifications-db';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const typeIcons = {
  order_confirmation: Package,
  order_status_update: ShoppingBag,
  license_delivered: Key,
  payment_received: CreditCard,
  product_update: Bell,
  system: AlertCircle,
};

const typeColors = {
  order_confirmation: 'text-blue-600',
  order_status_update: 'text-green-600',
  license_delivered: 'text-purple-600',
  payment_received: 'text-green-600',
  product_update: 'text-orange-600',
  system: 'text-gray-600',
};

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  showActions = true,
}: NotificationItemProps) {
  const Icon = typeIcons[notification.type] || Bell;
  const iconColor = typeColors[notification.type] || 'text-gray-600';

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  const content = (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg transition-colors',
        !notification.read && 'bg-blue-50 dark:bg-blue-950/20',
        notification.read && 'bg-muted/50'
      )}
    >
      <div className={cn('flex-shrink-0 mt-0.5', iconColor)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p
              className={cn(
                'text-sm font-medium',
                !notification.read && 'font-semibold'
              )}
            >
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-2">{timeAgo}</p>
          </div>
          {!notification.read && (
            <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
          )}
        </div>
        {showActions && (
          <div className="flex items-center gap-2 mt-3">
            {!notification.read && onMarkAsRead && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
              >
                Mark as read
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link
        href={notification.link}
        className="block hover:opacity-80 transition-opacity"
        onClick={() => {
          // Mark as read when clicked
          if (!notification.read && onMarkAsRead) {
            onMarkAsRead(notification.id);
          }
        }}
      >
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}
