'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCheckout } from '@/contexts/checkout-context';
import { useCart } from '@/contexts/cart-context';
import { CheckoutCartReview } from './components/checkout-cart-review';
import { CheckoutCustomerInfo } from './components/checkout-customer-info';
import { CheckoutSummary } from './components/checkout-summary';
import { CheckoutPaymentForm } from './components/checkout-payment-form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { customerInfoSchema } from '@/lib/checkout/validation';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

export function CheckoutContent() {
  const {
    customerInfo,
    appliedCoupon,
    orderTotals,
    termsAccepted,
    setTermsAccepted,
    setCustomerInfo,
  } = useCheckout();
  const { items, isLoading } = useCart();
  const router = useRouter();

  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [isContinuing, setIsContinuing] = useState(false);

  useEffect(() => {
    if (!isLoading && items.length === 0) {
      router.replace('/');
    }
  }, [isLoading, items.length, router]);

  const handleContinueToPayment = async () => {
    setPayError(null);
    const parsed = customerInfoSchema.safeParse(customerInfo);
    if (!parsed.success) {
      setPayError('Please complete all required customer information.');
      return;
    }
    if (!customerInfo) {
      setPayError('Please fill in your details above.');
      return;
    }
    if (orderTotals.total < 0.5) {
      setPayError('Order total must be at least $0.50.');
      return;
    }

    setIsContinuing(true);
    try {
      setCustomerInfo(parsed.data);
      const orderRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo: parsed.data,
          couponCode: appliedCoupon?.code ?? undefined,
        }),
      });
      if (!orderRes.ok) {
        const data = await orderRes.json();
        throw new Error(data.error ?? 'Failed to create order');
      }
      const order = await orderRes.json();
      const piRes = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });
      if (!piRes.ok) {
        const data = await piRes.json();
        throw new Error(data.error ?? 'Failed to start payment');
      }
      const { clientSecret: secret } = await piRes.json();
      if (!secret) throw new Error('No payment session returned');
      setOrderId(order.id);
      setClientSecret(secret);
    } catch (err) {
      setPayError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsContinuing(false);
    }
  };

  const totalFormatted = useMemo(
    () => `$${orderTotals.total.toLocaleString()}`,
    [orderTotals.total]
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
          <p className="text-sm">Loading your cart…</p>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <CheckoutCartReview singlePage />
            <CheckoutCustomerInfo singlePage />
            {!clientSecret ? (
              <div className="space-y-4">
                {payError && (
                  <p className="text-sm text-destructive rounded-md bg-destructive/15 p-3" role="alert">
                    {payError}
                  </p>
                )}
                <Button
                  type="button"
                  size="lg"
                  onClick={handleContinueToPayment}
                  disabled={isContinuing || orderTotals.total < 0.5}
                  className="w-full"
                >
                  {isContinuing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                      Preparing payment…
                    </>
                  ) : (
                    `Continue to payment — ${totalFormatted}`
                  )}
                </Button>
              </div>
            ) : (
              stripePromise &&
              clientSecret &&
              orderId && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: { borderRadius: '6px' },
                    },
                  }}
                >
                  <CheckoutPaymentForm
                    orderId={orderId}
                    totalFormatted={totalFormatted}
                    termsAccepted={termsAccepted}
                    onTermsChange={setTermsAccepted}
                    onError={setPayError}
                  />
                </Elements>
              )
            )}
          </div>
          <div className="lg:col-span-1">
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </main>
  );
}
