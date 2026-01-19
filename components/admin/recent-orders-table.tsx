'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Order } from '@/lib/types/database';
import { formatDistanceToNow } from 'date-fns';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';

interface RecentOrdersTableProps {
  orders: Order[];
  limit?: number;
}

export function RecentOrdersTable({ orders, limit = 10 }: RecentOrdersTableProps) {
  const displayOrders = orders.slice(0, limit);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <Link href="/admin/orders">
          <Button variant="link" size="sm">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {displayOrders.length > 0 ? (
          <div className="space-y-4">
            {displayOrders.map((order) => {
              const totalAmount = typeof order.total_amount === 'number'
                ? order.total_amount
                : parseFloat(String(order.total_amount || 0));

              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {order.order_number}
                      </Link>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.customer_email} • {formatDistanceToNow(new Date(order.created_at || ''), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold">${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-4">No recent orders</p>
        )}
      </CardContent>
    </Card>
  );
}

