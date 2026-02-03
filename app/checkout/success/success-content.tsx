'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, Package, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { DoerCouponDisplay } from '@/components/account/doer-coupon-display';

interface OrderData {
  orderNumber: string;
  status: string;
  orderId?: string;
  productIds?: string[];
  doerCouponCode?: string | null;
  doerCouponExpiresAt?: string | null;
  doerCouponUsed?: boolean;
  doerCouponUsedAt?: string | null;
}

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderIdParam = searchParams.get('order_id');
  const orderNumberParam = searchParams.get('orderNumber');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderData() {
      try {
        setIsLoading(true);
        setError(null);

        if (orderIdParam) {
          const response = await fetch(`/api/orders/${orderIdParam}`);
          if (!response.ok) {
            if (response.status === 403) {
              setError('You do not have access to this order.');
            } else if (response.status === 404) {
              setError('Order not found.');
            } else {
              throw new Error('Failed to fetch order information');
            }
            return;
          }
          const data = await response.json();
          setOrderData({
            orderNumber: data.orderNumber || 'N/A',
            status: data.status || 'processing',
            orderId: data.orderId ?? orderIdParam,
            doerCouponCode: data.doerCouponCode ?? null,
            doerCouponExpiresAt: data.doerCouponExpiresAt ?? null,
            doerCouponUsed: data.doerCouponUsed ?? false,
            doerCouponUsedAt: data.doerCouponUsedAt ?? null,
          });
        } else if (sessionId) {
          const response = await fetch(`/api/stripe/get-order-by-session?session_id=${sessionId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch order information');
          }
          const data = await response.json();
          setOrderData({
            orderNumber: data.orderNumber || 'N/A',
            status: data.status || 'processing',
            orderId: data.orderId,
            doerCouponCode: data.doerCouponCode || null,
            doerCouponExpiresAt: data.doerCouponExpiresAt || null,
            doerCouponUsed: data.doerCouponUsed || false,
            doerCouponUsedAt: data.doerCouponUsedAt || null,
          });
        } else if (orderNumberParam) {
          setOrderData({
            orderNumber: orderNumberParam,
            status: 'pending',
          });
        } else {
          setError('No order information found');
        }
      } catch (err) {
        console.error('Error fetching order data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load order information');
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrderData();
  }, [sessionId, orderIdParam, orderNumberParam]);

  const orderNumber = orderData?.orderNumber || orderNumberParam || 'N/A';

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="rounded-full bg-green-500 p-3">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-900 dark:text-green-100">
                Order Confirmed!
              </h1>
              <p className="text-green-700 dark:text-green-300 mt-1">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Order Details
          </CardTitle>
          <CardDescription>
            Your order information and what happens next
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading order information...</span>
            </div>
          ) : error ? (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : (
            <>
              {/* Order Number */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                <p className="text-lg font-semibold font-mono">
                  {orderNumber}
                </p>
              </div>

              <Separator />

              {/* What Happens Next */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  What Happens Next?
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Your payment has been processed successfully</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>You'll receive a confirmation email with your order details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Your digital products will be available in your account library</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>You have lifetime access to all purchased products</span>
                  </li>
                </ul>
              </div>

              {/* DOER Coupon Display */}
              {orderData?.doerCouponCode && (
                <>
                  <Separator />
                  <DoerCouponDisplay
                    couponCode={orderData.doerCouponCode}
                    expiresAt={orderData.doerCouponExpiresAt || null}
                    used={orderData.doerCouponUsed || false}
                    usedAt={orderData.doerCouponUsedAt || null}
                  />
                </>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/ai-to-usd" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            {orderData?.orderId ? (
              <>
                <Link href={`/account/orders/${orderData.orderId}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Order Details
                  </Button>
                </Link>
                <Link href="/account/library" className="flex-1">
                  <Button className="w-full">
                    Access Your Library
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/account/orders" className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Order History
                  </Button>
                </Link>
                <Link href="/account/library" className="flex-1">
                  <Button className="w-full">
                    Access Your Library
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

