'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/contexts/checkout-context';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CheckoutOrderReview() {
  const { customerInfo, appliedCoupon, orderTotals, termsAccepted, setTermsAccepted, setCurrentStep } = useCheckout();
  const { items } = useCart();
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!customerInfo) {
      setError('Customer information is required');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the Terms of Service and Refund Policy to place an order');
      return;
    }

    setIsPlacingOrder(true);
    setError(null);

    try {
      // Step 1: Create order
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo,
          couponCode: appliedCoupon?.code,
        }),
      });

      if (!orderResponse.ok) {
        const data = await orderResponse.json();
        throw new Error(data.error || 'Failed to create order');
      }

      const order = await orderResponse.json();

      // Step 2: Create Stripe Checkout Session
      const sessionResponse = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
        }),
      });

      if (!sessionResponse.ok) {
        const data = await sessionResponse.json();
        throw new Error(data.error || 'Failed to create payment session');
      }

      const sessionData = await sessionResponse.json();

      // Step 3: Redirect to Stripe Checkout
      if (sessionData.url) {
        window.location.href = sessionData.url;
      } else {
        throw new Error('No checkout URL returned from payment provider');
      }
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

          {/* Terms and Conditions - Required Checkbox */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="checkout-terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => {
                  setTermsAccepted(checked === true);
                  setError(null);
                }}
                className="mt-1 shrink-0"
                aria-invalid={error && !termsAccepted ? 'true' : 'false'}
              />
              <div className="min-w-0 text-sm leading-relaxed">
                <Label htmlFor="checkout-terms" className="cursor-pointer">
                  <span className="block">
                    I agree to the{' '}
                    <Link
                      href="/legal/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline whitespace-nowrap text-primary underline hover:text-primary/80"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link
                      href="/legal/refund"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline whitespace-nowrap text-primary underline hover:text-primary/80"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Refund Policy
                    </Link>
                    .
                  </span>
                </Label>
              </div>
            </div>
            {error && !termsAccepted && (
              <p className="text-sm text-destructive ml-8">
                You must accept the Terms of Service to complete your purchase.
              </p>
            )}
            {orderTotals.total < 0.5 && (
              <p className="text-sm text-muted-foreground ml-8">
                Minimum order total is $0.50 to proceed to payment.
              </p>
            )}
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
              disabled={isPlacingOrder || !termsAccepted || orderTotals.total < 0.5}
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

