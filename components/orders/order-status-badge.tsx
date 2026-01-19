/**
 * Order status badge component
 * Displays order status with color-coded styling
 */

import { getStatusColor, getStatusLabel } from '@/lib/orders/status';
import type { OrderStatus } from '@/lib/types/database';
import { cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function OrderStatusBadge({
  status,
  className,
  size = 'md',
}: OrderStatusBadgeProps) {
  const colors = getStatusColor(status);
  const label = getStatusLabel(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        colors.bg,
        colors.text,
        sizeClasses[size],
        className
      )}
    >
      {label}
    </span>
  );
}

