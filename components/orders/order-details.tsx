/**
 * Order details component
 * Reusable component for displaying complete order information
 */

import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderStatusBadge } from './order-status-badge';
import { OrderStatusTimeline } from './order-status-timeline';
import { DoerCouponDisplay } from '@/components/account/doer-coupon-display';
import type { OrderWithItems, OrderStatus } from '@/lib/types/database';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface OrderDetailsProps {
  order: OrderWithItems;
  showActions?: boolean;
}

export function OrderDetails({ order, showActions = true }: OrderDetailsProps) {
  const orderDate = order.created_at
    ? format(new Date(order.created_at), 'MMMM d, yyyy h:mm a')
    : 'N/A';

  const subtotal = typeof order.subtotal === 'number'
    ? order.subtotal
    : parseFloat(String(order.subtotal || 0));

  const discountAmount = typeof order.discount_amount === 'number'
    ? order.discount_amount
    : parseFloat(String(order.discount_amount || 0));

  const taxAmount = typeof order.tax_amount === 'number'
    ? order.tax_amount
    : parseFloat(String(order.tax_amount || 0));

  const totalAmount = typeof order.total_amount === 'number'
    ? order.total_amount
    : parseFloat(String(order.total_amount || 0));

  const billingAddress = order.billing_address as {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  } | null | undefined;

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Order {order.order_number}</CardTitle>
              <CardDescription className="mt-1">
                Placed on {orderDate}
              </CardDescription>
            </div>
            <OrderStatusBadge status={(order.status || 'pending') as OrderStatus} size="lg" />
          </div>
        </CardHeader>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          {order.items && order.items.length > 0 ? (
            <div className="space-y-4">
              {order.items.map((item) => {
                const unitPrice = typeof item.unit_price === 'number'
                  ? item.unit_price
                  : parseFloat(String(item.unit_price || 0));
                const totalPrice = typeof item.total_price === 'number'
                  ? item.total_price
                  : parseFloat(String(item.total_price || 0));

                return (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{item.product_name}</h4>
                          {item.product_id && (
                            <Link
                              href={`/ai-to-usd/packages/${item.product_sku || item.product_id}`}
                              className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 mt-1"
                            >
                              View Product
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">No items found</p>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Totals */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-green-600">-${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer & Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{order.customer_email}</p>
            </div>
            {order.customer_name && (
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">{order.customer_name}</p>
              </div>
            )}
            {billingAddress && (
              <div>
                <p className="text-sm font-medium">Billing Address</p>
                <p className="text-sm text-muted-foreground">
                  {billingAddress.street && <>{billingAddress.street}<br /></>}
                  {billingAddress.city && (
                    <>
                      {billingAddress.city}
                      {billingAddress.state && `, ${billingAddress.state}`}
                      {billingAddress.zipCode && ` ${billingAddress.zipCode}`}
                      <br />
                    </>
                  )}
                  {billingAddress.country}
                </p>
              </div>
            )}
            {order.stripe_payment_intent_id && (
              <div>
                <p className="text-sm font-medium">Payment ID</p>
                <p className="text-sm text-muted-foreground font-mono text-xs">
                  {order.stripe_payment_intent_id}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Doer Pro Coupon */}
      {order.doer_coupon_code && (
        <DoerCouponDisplay
          couponCode={order.doer_coupon_code}
          expiresAt={order.doer_coupon_expires_at ?? undefined}
          used={order.doer_coupon_used ?? false}
          usedAt={order.doer_coupon_used_at ?? undefined}
        />
      )}

      {/* Status Timeline */}
      <Card>
        <CardContent className="pt-6">
          <OrderStatusTimeline order={order} />
        </CardContent>
      </Card>
    </div>
  );
}

