'use client';

import { useCart } from '@/contexts/cart-context';
import { useCheckout } from '@/contexts/checkout-context';
import { DiscountCodeForm } from '@/components/checkout/discount-code-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag } from 'lucide-react';

export function CheckoutSummary() {
  const { items } = useCart();
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
        {/* Cart line items (no images) */}
        <div className="space-y-2">
          {items.map((item) => {
            const productTitle = item.product?.title ?? 'Product';
            const unitPrice = typeof item.product?.price === 'number'
              ? item.product.price
              : parseFloat(String(item.product?.price ?? 0));
            return (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-foreground">{productTitle}</span>
                <span className="font-medium">${unitPrice.toLocaleString()}</span>
              </div>
            );
          })}
        </div>

        <Separator />

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
      </CardContent>
    </Card>
  );
}

