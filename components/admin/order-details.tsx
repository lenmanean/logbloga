'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { format } from 'date-fns';
import type { OrderWithItems, OrderStatus } from '@/lib/types/database';

interface OrderDetailsProps {
  order: OrderWithItems;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const totalAmount = typeof order.total_amount === 'number'
    ? order.total_amount
    : parseFloat(String(order.total_amount || 0));
  const subtotal = typeof order.subtotal === 'number'
    ? order.subtotal
    : parseFloat(String(order.subtotal || 0));
  const taxAmount = typeof order.tax_amount === 'number'
    ? order.tax_amount
    : parseFloat(String(order.tax_amount || 0));
  const discountAmount = typeof order.discount_amount === 'number'
    ? order.discount_amount
    : parseFloat(String(order.discount_amount || 0));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Order Information */}
      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <OrderStatusBadge status={(order.status || 'pending') as OrderStatus} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Order Number</span>
            <span className="font-medium">{order.order_number}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Date</span>
            <span className="text-sm">
              {format(new Date(order.created_at || ''), 'PPpp')}
            </span>
          </div>
          {order.stripe_payment_intent_id && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment Intent</span>
              <span className="text-sm font-mono">{order.stripe_payment_intent_id}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-sm text-muted-foreground">Email</span>
            <p className="font-medium">{order.customer_email || 'N/A'}</p>
          </div>
          {order.customer_name && (
            <div>
              <span className="text-sm text-muted-foreground">Name</span>
              <p className="font-medium">{order.customer_name}</p>
            </div>
          )}
          {order.user_id && (
            <div>
              <span className="text-sm text-muted-foreground">User ID</span>
              <p className="font-mono text-sm">{order.user_id}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          {order.items && order.items.length > 0 ? (
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    {item.product_sku && (
                      <p className="text-sm text-muted-foreground">SKU: {item.product_sku}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${item.total_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${item.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No items found</p>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          {taxAmount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}
          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <span>Discount</span>
              <span>-${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}
          <Separator />
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

