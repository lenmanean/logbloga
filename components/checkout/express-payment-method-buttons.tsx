'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export type ExpressMethodId = 'amazon_pay' | 'cashapp' | 'klarna' | 'afterpay_clearpay' | 'affirm';

const EXPRESS_METHODS: Array<{
  id: ExpressMethodId;
  label: string;
  className: string;
  ariaLabel: string;
}> = [
  {
    id: 'amazon_pay',
    label: 'Amazon Pay',
    ariaLabel: 'Pay with Amazon Pay',
    className:
      'bg-[#FF9900] hover:bg-[#eb8c00] text-[#232f3e] border border-[#232f3e]/20 font-semibold',
  },
  {
    id: 'klarna',
    label: 'Klarna',
    ariaLabel: 'Pay with Klarna',
    className:
      'bg-[#0A0B09] hover:bg-black text-white border border-[#0A0B09] font-medium',
  },
  {
    id: 'afterpay_clearpay',
    label: 'Afterpay',
    ariaLabel: 'Pay with Afterpay',
    className:
      'bg-[#B6D4B8] hover:bg-[#9fc9a2] text-[#0A0B09] border border-[#0A0B09]/15 font-semibold',
  },
  {
    id: 'affirm',
    label: 'Affirm',
    ariaLabel: 'Pay with Affirm',
    className:
      'bg-[#00BCD6] hover:bg-[#00a5bd] text-white border border-[#00BCD6] font-semibold',
  },
  {
    id: 'cashapp',
    label: 'Cash App Pay',
    ariaLabel: 'Pay with Cash App',
    className:
      'bg-[#00D54B] hover:bg-[#00c044] text-[#0A0B09] border border-[#0A0B09]/15 font-semibold',
  },
];

/** Stripe instance with redirect confirmation methods (not all in @stripe/stripe-js types) */
interface StripeWithConfirm {
  confirmKlarnaPayment(clientSecret: string, opts: { return_url: string }): Promise<{ error?: { message?: string } }>;
  confirmAffirmPayment(clientSecret: string, opts: { return_url: string }): Promise<{ error?: { message?: string } }>;
  confirmAfterpayClearpayPayment(clientSecret: string, opts: { return_url: string }): Promise<{ error?: { message?: string } }>;
  confirmAmazonPayPayment?(clientSecret: string, opts: { return_url: string }): Promise<{ error?: { message?: string } }>;
  confirmCashAppPayPayment?(clientSecret: string, opts: { return_url: string }): Promise<{ error?: { message?: string } }>;
}

interface ExpressPaymentMethodButtonsProps {
  productId: string;
  quantity: number;
  className?: string;
}

/**
 * Individual branded buttons that trigger each platform's native/redirect flow:
 * Klarna/Affirm/Afterpay redirect to provider; Amazon Pay/Cash App use their flows.
 * No modal – Stripe.js confirm methods handle redirect or native UI.
 */
export function ExpressPaymentMethodButtons({
  productId,
  quantity,
  className,
}: ExpressPaymentMethodButtonsProps) {
  const [loadingId, setLoadingId] = useState<ExpressMethodId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runConfirm = async (methodId: ExpressMethodId) => {
    if (!stripePublishableKey) {
      setError('Payment is not configured.');
      return;
    }
    setError(null);
    setLoadingId(methodId);
    try {
      const res = await fetch('/api/orders/create-express', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to start payment');
        setLoadingId(null);
        return;
      }
      const { orderId, clientSecret } = data;
      if (!clientSecret) {
        setError('Invalid payment session');
        setLoadingId(null);
        return;
      }
      const stripe = await loadStripe(stripePublishableKey);
      if (!stripe) {
        setError('Payment provider failed to load');
        setLoadingId(null);
        return;
      }
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const returnUrl = `${origin}/checkout/success?order_id=${orderId}`;
      const opts = { return_url: returnUrl };
      const stripeConfirm = stripe as unknown as StripeWithConfirm;

      let result: { error?: { message?: string } } | undefined;
      switch (methodId) {
        case 'klarna':
          result = await stripeConfirm.confirmKlarnaPayment(clientSecret, opts);
          break;
        case 'affirm':
          result = await stripeConfirm.confirmAffirmPayment(clientSecret, opts);
          break;
        case 'afterpay_clearpay':
          result = await stripeConfirm.confirmAfterpayClearpayPayment(clientSecret, opts);
          break;
        case 'amazon_pay':
          result = stripeConfirm.confirmAmazonPayPayment
            ? await stripeConfirm.confirmAmazonPayPayment(clientSecret, opts)
            : { error: { message: 'Amazon Pay is not available.' } };
          break;
        case 'cashapp':
          result = stripeConfirm.confirmCashAppPayPayment
            ? await stripeConfirm.confirmCashAppPayPayment(clientSecret, opts)
            : { error: { message: 'Cash App Pay is not available.' } };
          break;
        default:
          setError('Unknown payment method');
          setLoadingId(null);
          return;
      }
      if (result?.error?.message) {
        setError(result.error.message);
      }
      setLoadingId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoadingId(null);
    }
  };

  return (
    <div className={cn('space-y-2', className)} role="group" aria-label="Express payment methods">
      {error && (
        <p className="text-sm text-destructive rounded-md bg-destructive/15 p-2" role="alert">
          {error}
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {EXPRESS_METHODS.map(({ id, label, className: btnClass, ariaLabel }) => (
          <button
            key={id}
            type="button"
            onClick={() => runConfirm(id)}
            disabled={!!loadingId}
            aria-label={ariaLabel}
            className={cn(
              'rounded-md px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-1.5',
              btnClass
            )}
          >
            {loadingId === id ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
