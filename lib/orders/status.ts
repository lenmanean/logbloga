/**
 * Order status utilities and helpers
 * Provides functions for order status management, validation, and display
 */

import type { Order, OrderStatus } from '@/lib/types/database';

/**
 * Order status definitions with labels and descriptions
 */
export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    description: string;
    color: string;
    bgColor: string;
  }
> = {
  pending: {
    label: 'Pending',
    description: 'Order has been placed and is awaiting payment processing',
    color: 'text-yellow-700 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  processing: {
    label: 'Processing',
    description: 'Payment has been received and order is being processed',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  completed: {
    label: 'Completed',
    description: 'Order has been completed and delivered',
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Order has been cancelled',
    color: 'text-gray-700 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
  },
  refunded: {
    label: 'Refunded',
    description: 'Order has been refunded',
    color: 'text-orange-700 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
};

/**
 * Valid status transitions
 * Maps each status to the statuses it can transition to
 */
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['completed', 'cancelled', 'refunded'],
  completed: ['refunded'],
  cancelled: [], // Cannot transition from cancelled
  refunded: [], // Cannot transition from refunded
};

/**
 * Check if a status transition is valid
 */
export function isValidStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean {
  // Same status is always valid (no-op)
  if (currentStatus === newStatus) {
    return true;
  }

  // Check if transition is in valid transitions list
  return VALID_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

/**
 * Get human-readable label for order status
 */
export function getStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_CONFIG[status]?.label || status;
}

/**
 * Get description for order status
 */
export function getStatusDescription(status: OrderStatus): string {
  return ORDER_STATUS_CONFIG[status]?.description || '';
}

/**
 * Get color classes for status badge
 */
export function getStatusColor(status: OrderStatus): {
  text: string;
  bg: string;
} {
  const config = ORDER_STATUS_CONFIG[status];
  if (!config) {
    return {
      text: 'text-gray-700 dark:text-gray-400',
      bg: 'bg-gray-100 dark:bg-gray-900/30',
    };
  }

  return {
    text: config.color,
    bg: config.bgColor,
  };
}

/**
 * Check if an order can be cancelled
 */
export function canCancelOrder(order: Order): boolean {
  // Can only cancel pending or processing orders
  return order.status === 'pending' || order.status === 'processing';
}

/**
 * Get order status timeline
 * Returns array of status changes with timestamps
 */
export interface StatusTimelineEntry {
  status: OrderStatus;
  label: string;
  timestamp: Date;
  isCurrent: boolean;
}

export function getOrderStatusTimeline(order: Order): StatusTimelineEntry[] {
  const timeline: StatusTimelineEntry[] = [];

  // Always start with pending (order creation)
  const createdAt = order.created_at ? new Date(order.created_at) : new Date();
  timeline.push({
    status: 'pending',
    label: getStatusLabel('pending'),
    timestamp: createdAt,
    isCurrent: order.status === 'pending',
  });

  // If order moved beyond pending, add processing
  if (order.status !== 'pending') {
    // Use updated_at if available, otherwise estimate based on created_at
    const processingTime = order.updated_at
      ? new Date(order.updated_at)
      : new Date(createdAt.getTime() + 1000); // 1 second after creation

    timeline.push({
      status: 'processing',
      label: getStatusLabel('processing'),
      timestamp: processingTime,
      isCurrent: order.status === 'processing',
    });
  }

  // If order is completed, add completed status
  if (order.status === 'completed') {
    const completedTime = order.updated_at
      ? new Date(order.updated_at)
      : new Date();

    timeline.push({
      status: 'completed',
      label: getStatusLabel('completed'),
      timestamp: completedTime,
      isCurrent: true,
    });
  }

  // If order is cancelled, add cancelled status
  if (order.status === 'cancelled') {
    const cancelledTime = order.updated_at
      ? new Date(order.updated_at)
      : new Date();

    timeline.push({
      status: 'cancelled',
      label: getStatusLabel('cancelled'),
      timestamp: cancelledTime,
      isCurrent: true,
    });
  }

  // If order is refunded, add refunded status
  if (order.status === 'refunded') {
    const refundedTime = order.updated_at
      ? new Date(order.updated_at)
      : new Date();

    timeline.push({
      status: 'refunded',
      label: getStatusLabel('refunded'),
      timestamp: refundedTime,
      isCurrent: true,
    });
  }

  return timeline;
}

/**
 * Get next possible statuses for an order
 */
export function getNextPossibleStatuses(
  currentStatus: OrderStatus
): OrderStatus[] {
  return VALID_TRANSITIONS[currentStatus] || [];
}

