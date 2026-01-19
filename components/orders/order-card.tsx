/**
 * Order card component for list view
 * Displays order summary in a card format
 */

import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusBadge } from './order-status-badge';
import { ArrowRight, Package } from 'lucide-react';
import type { Order, OrderStatus } from '@/lib/types/database';
import { Button } from '@/components/ui/button';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const orderDate = order.created_at
    ? format(new Date(order.created_at), 'MMM d, yyyy')
    : 'N/A';

  const totalAmount = typeof order.total_amount === 'number'
    ? order.total_amount
    : parseFloat(String(order.total_amount || 0));

  return (
    <Link href={`/account/orders/${order.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate">
                {order.order_number || 'Order'}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {orderDate}
              </p>
            </div>
            <OrderStatusBadge status={(order.status || 'pending') as OrderStatus} size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <Button variant="ghost" size="sm" className="h-8">
              View Details
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

