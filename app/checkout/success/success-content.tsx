'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

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
          {/* Order Number */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
            <p className="text-lg font-semibold font-mono">
              {orderNumber || 'N/A'}
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
                <span>Payment will be processed in the next step (Stripe integration coming in Phase 5)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Once payment is confirmed, you'll receive a confirmation email with your order details</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Your digital products will be available in your account library after payment confirmation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>License keys and download links will be generated automatically</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/ai-to-usd" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/account/orders" className="flex-1">
              <Button className="w-full">
                View Order History
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

