'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import type { StripePaymentRequestButtonElement, PaymentRequest } from '@stripe/stripe-js';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

interface ExpressPaymentRequestButtonProps {
  productId: string;
  productTitle: string;
  amountInCents: number;
  currency?: string;
  quantity?: number;
}

export function ExpressPaymentRequestButton({
  productId,
  productTitle,
  amountInCents,
  currency = 'usd',
  quantity = 1,
}: ExpressPaymentRequestButtonProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!stripePublishableKey || !mountRef.current || amountInCents < 50) return;

    let stripe: Awaited<ReturnType<typeof loadStripe>> | null = null;
    let paymentRequest: PaymentRequest | null = null;
    let buttonElement: StripePaymentRequestButtonElement | null = null;

    const init = async () => {
      stripe = await loadStripe(stripePublishableKey);
      if (!stripe) return;

      const label = productTitle.length > 100 ? productTitle.slice(0, 97) + '…' : productTitle;
      paymentRequest = stripe.paymentRequest({
        country: 'US',
        currency: currency.toLowerCase(),
        total: {
          label,
          amount: amountInCents,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const canPay = await paymentRequest.canMakePayment();
      const canShowButton = Boolean(canPay && (canPay.applePay || canPay.googlePay));
      setCanMakePayment(canShowButton);

      if (!canShowButton || !mountRef.current) return;

      paymentRequest.on('paymentmethod', async (ev) => {
        if (!stripe) {
          ev.complete('fail');
          return;
        }
        setError(null);
        try {
          const res = await fetch('/api/orders/create-express', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity }),
          });
          const data = await res.json();
          if (!res.ok) {
            ev.complete('fail');
            setError(data.error ?? 'Failed to start payment');
            return;
          }
          const { orderId, clientSecret } = data;
          if (!clientSecret) {
            ev.complete('fail');
            setError('Invalid payment session');
            return;
          }
          const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: ev.paymentMethod.id,
          });
          if (confirmError) {
            ev.complete('fail');
            setError(confirmError.message ?? 'Payment failed');
            return;
          }
          ev.complete('success');
          router.push(`/checkout/success?order_id=${orderId}`);
        } catch (err) {
          ev.complete('fail');
          setError(err instanceof Error ? err.message : 'Payment failed');
        }
      });

      const elements = stripe.elements();
      buttonElement = elements.create('paymentRequestButton', {
        paymentRequest,
      });
      buttonElement.mount(mountRef.current);
    };

    init();

    return () => {
      if (buttonElement && mountRef.current) {
        try {
          buttonElement.destroy();
        } catch (_) {}
      }
    };
  }, [productId, productTitle, amountInCents, currency, quantity, router]);

  return (
    <div className="space-y-2" style={!canMakePayment ? { display: 'none' } : undefined}>
      <div ref={mountRef} />
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
