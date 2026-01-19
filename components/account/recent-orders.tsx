'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { Package, ArrowRight } from 'lucide-react';
import type { Order } from '@/lib/types/database';
import { formatDistanceToNow } from 'date-fns';

interface RecentOrdersProps {
  orders: Order[];
  limit?: number;
}

export function RecentOrders({ orders, limit = 5 }: RecentOrdersProps) {
  const recentOrders = orders.slice(0, limit);

  if (recentOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recent Orders
          </CardTitle>
          <CardDescription>Your recent order history</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No orders yet. Start shopping to see your orders here.
          </p>
          <Link href="/ai-to-usd">
            <Button className="w-full" variant="outline">
              Browse Products
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number | string): string => {
    const numAmount = typeof amount === 'number' ? amount : parseFloat(String(amount || 0));
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>Your recent order history</CardDescription>
          </div>
          {orders.length > limit && (
            <Link href="/account/orders">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => {
            const totalAmount = typeof order.total_amount === 'number'
              ? order.total_amount
              : parseFloat(String(order.total_amount || 0));
            const orderDate = order.created_at ? new Date(order.created_at) : new Date();
            const timeAgo = formatDistanceToNow(orderDate, { addSuffix: true });

            return (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="font-medium hover:text-primary transition-colors truncate"
                    >
                      Order #{order.order_number}
                    </Link>
                    <OrderStatusBadge status={order.status as any} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{formatCurrency(totalAmount)}</span>
                    <span>•</span>
                    <span>{timeAgo}</span>
                  </div>
                </div>
                <Link href={`/account/orders/${order.id}`}>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
        {orders.length > limit && (
          <div className="mt-4 pt-4 border-t">
            <Link href="/account/orders" className="w-full">
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

