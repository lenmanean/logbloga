'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { OrderStatus } from '@/lib/types/database';

interface OrderStatusSelectorProps {
  orderId: string;
  currentStatus: OrderStatus;
  onStatusChange?: (status: OrderStatus) => void;
}

export function OrderStatusSelector({
  orderId,
  currentStatus,
  onStatusChange,
}: OrderStatusSelectorProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order status');
      }

      setStatus(newStatus);
      onStatusChange?.(newStatus);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(error instanceof Error ? error.message : 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={status}
        onValueChange={(value) => handleStatusChange(value as OrderStatus)}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="refunded">Refunded</SelectItem>
        </SelectContent>
      </Select>
      {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
    </div>
  );
}

