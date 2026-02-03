'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ExpressCheckoutForm } from '@/components/checkout/express-checkout-payment-element-modal';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface ExpressCheckoutContentProps {
  productId: string;
  productTitle: string;
}

/**
 * Full-page express checkout so the Payment Element renders in the main document
 * (avoids blank iframe in modal on mobile/iOS).
 */
export function ExpressCheckoutContent({ productId, productTitle }: ExpressCheckoutContentProps) {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [amountFormatted, setAmountFormatted] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    fetch('/api/orders/create-express', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.orderId || !data.clientSecret) {
          setError(data.error ?? 'Failed to start payment');
          return;
        }
        setOrderId(data.orderId);
        setClientSecret(data.clientSecret);
        setAmountFormatted(data.amountFormatted ?? '');
      })
      .catch(() => setError('Failed to start payment'))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSuccess = () => {
    router.push(`/checkout/success?order_id=${orderId}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground mt-4">Preparing payment…</p>
      </main>
    );
  }

  if (error || !clientSecret || !orderId) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-md mx-auto space-y-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <p className="text-sm text-destructive rounded-md bg-destructive/15 p-4" role="alert">
            {error ?? 'Something went wrong.'}
          </p>
          <Button asChild>
            <Link href="/checkout">Go to full checkout</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!stripePromise) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <p className="text-sm text-destructive rounded-md bg-destructive/15 p-4">
          Payment is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Quick checkout — {productTitle}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose your payment method below. Options depend on your location and order amount.
          </p>
        </div>
        <div className="min-h-[320px] w-full">
          <Elements
            key={clientSecret}
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: { borderRadius: '6px' },
              },
            }}
          >
            <ExpressCheckoutForm
              orderId={orderId}
              amountFormatted={amountFormatted || '—'}
              onSuccess={handleSuccess}
              onError={setError}
            />
          </Elements>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          No options showing?{' '}
          <Link href="/checkout" className="underline">
            Use full checkout from cart
          </Link>
        </p>
      </div>
    </main>
  );
}
