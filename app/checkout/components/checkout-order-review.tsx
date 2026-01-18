'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/contexts/checkout-context';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CheckoutOrderReview() {
  const { customerInfo, appliedCoupon, orderTotals, setCurrentStep } = useCheckout();
  const { items } = useCart();
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!customerInfo) {
      setError('Customer information is required');
      return;
    }

    setIsPlacingOrder(true);
    setError(null);

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo,
          couponCode: appliedCoupon?.code,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create order');
      }

      const order = await response.json();
      
      // Redirect to success page with order ID
      router.push(`/checkout/success?orderId=${order.id}&orderNumber=${order.order_number}`);
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Your Order</CardTitle>
          <CardDescription>
            Please review your order details before proceeding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="font-semibold text-base mb-3">Customer Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {customerInfo?.name}</p>
              <p><span className="font-medium">Email:</span> {customerInfo?.email}</p>
              {customerInfo?.phone && (
                <p><span className="font-medium">Phone:</span> {customerInfo.phone}</p>
              )}
              {customerInfo?.billingAddress && (
                <div className="mt-2 pt-2 border-t">
                  <p className="font-medium mb-1">Billing Address:</p>
                  <p className="text-muted-foreground">
                    {customerInfo.billingAddress.street}<br />
                    {customerInfo.billingAddress.city}, {customerInfo.billingAddress.state} {customerInfo.billingAddress.zipCode}<br />
                    {customerInfo.billingAddress.country}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-base mb-3">Order Items</h3>
            <div className="space-y-4">
              {items.map((item) => {
                const product = item.product;
                const productImage = product?.package_image || (product?.images as string[])?.[0] || '/placeholder-product.png';
                const productTitle = product?.title || 'Product';
                const unitPrice = typeof product?.price === 'number' 
                  ? product.price 
                  : parseFloat(String(product?.price || 0));
                const lineTotal = unitPrice * (item.quantity || 0);

                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-md border overflow-hidden">
                      <Image
                        src={productImage}
                        alt={productTitle}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{productTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ${unitPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${lineTotal.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div>
            <h3 className="font-semibold text-base mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${orderTotals.subtotal.toLocaleString()}</span>
              </div>
              {orderTotals.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Discount {appliedCoupon && `(${appliedCoupon.code})`}
                  </span>
                  <span className="text-green-600">-${orderTotals.discountAmount.toLocaleString()}</span>
                </div>
              )}
              {orderTotals.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${orderTotals.taxAmount.toLocaleString()}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${orderTotals.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="rounded-md bg-muted/50 p-4 text-sm">
            <p className="text-muted-foreground">
              By placing this order, you agree to our terms and conditions. 
              Payment will be processed in the next step after order confirmation.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(2)}
              disabled={isPlacingOrder}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              size="lg"
              className="flex-1 max-w-xs"
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Place Order
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

