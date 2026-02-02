'use client';

import { useCheckout } from '@/contexts/checkout-context';
import { DiscountCodeForm } from '@/components/checkout/discount-code-form';
import { CheckoutUpsell } from '@/components/recommendations/checkout-upsell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag } from 'lucide-react';

export function CheckoutSummary() {
  const { orderTotals, appliedCoupon } = useCheckout();

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Discount Code Form */}
        <DiscountCodeForm />

        <Separator />

        {/* Order Totals */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${orderTotals.subtotal.toLocaleString()}</span>
          </div>

          {orderTotals.discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Discount {appliedCoupon && `(${appliedCoupon.code})`}
              </span>
              <span className="font-medium text-green-600">
                -${orderTotals.discountAmount.toLocaleString()}
              </span>
            </div>
          )}

          {orderTotals.taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">${orderTotals.taxAmount.toLocaleString()}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${orderTotals.total.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Tax (if any) is calculated at payment.
          </p>
        </div>

        <Separator />

        {/* Checkout Upsell */}
        <CheckoutUpsell />
      </CardContent>
    </Card>
  );
}

