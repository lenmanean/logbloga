'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import type { PaymentRequest } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface ExpressCheckoutFormProps {
  orderId: string;
  amountFormatted: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

/** Apple Pay / Google Pay native button; must be used inside Elements. Uses existing order clientSecret so one order is shared with the form below. */
function ExpressWalletButtonInline({
  clientSecret,
  orderId,
  amountInCents,
  productTitle,
  onError,
}: {
  clientSecret: string;
  orderId: string;
  amountInCents: number;
  productTitle: string;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const router = useRouter();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [canPay, setCanPay] = useState(false);

  useEffect(() => {
    if (!stripe || amountInCents < 50) return;
    const label = productTitle.length > 100 ? productTitle.slice(0, 97) + '…' : productTitle;
    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: { label, amount: amountInCents },
      requestPayerName: true,
      requestPayerEmail: true,
    });
    pr.on('paymentmethod', async (ev) => {
      onError('');
      try {
        const { error } = await stripe!.confirmCardPayment(clientSecret, {
          payment_method: ev.paymentMethod.id,
        });
        if (error) {
          onError(error.message ?? 'Payment failed');
          ev.complete('fail');
          return;
        }
        ev.complete('success');
        router.push(`/checkout/success?order_id=${orderId}`);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Payment failed');
        ev.complete('fail');
      }
    });
    pr.canMakePayment().then((result) => {
      setCanPay(Boolean(result && (result.applePay || result.googlePay)));
    });
    setPaymentRequest(pr);
  }, [stripe, clientSecret, orderId, amountInCents, productTitle, router, onError]);

  if (!canPay || !paymentRequest) return null;
  return (
    <div className="w-full [&>div]:!block">
      <PaymentRequestButtonElement options={{ paymentRequest }} />
    </div>
  );
}

/** Exported for use on full-page express checkout (mobile). Uses Payment Element so all Stripe payment methods can show. */
export function ExpressCheckoutForm({
  orderId,
  amountFormatted,
  onSuccess,
  onError,
}: ExpressCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!termsAccepted) {
      onError('You must accept the Terms of Service and Refund Policy to complete your purchase.');
      return;
    }
    setIsConfirming(true);
    onError('');
    const { error: submitError } = await elements.submit();
    if (submitError) {
      onError(submitError.message ?? 'Please complete the payment form.');
      setIsConfirming(false);
      return;
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const returnUrl = `${origin}/checkout/success?order_id=${orderId}`;
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: 'if_required',
    });
    if (confirmError) {
      onError(confirmError.message ?? 'Payment failed. Please try again.');
      setIsConfirming(false);
      return;
    }
    setIsConfirming(false);
    onSuccess();
    if (typeof window !== 'undefined') {
      window.location.href = `${origin}/checkout/success?order_id=${orderId}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="min-h-[320px] sm:min-h-[280px] w-full min-w-0" aria-label="Payment method">
        <PaymentElement
          options={{
            layout: { type: 'accordion', spacedAccordionItems: true, defaultCollapsed: false },
          }}
        />
      </div>
      <div className="flex items-start gap-3">
        <Checkbox
          id="express-terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked === true)}
          className="mt-1 shrink-0"
        />
        <Label htmlFor="express-terms" className="text-sm cursor-pointer">
          I agree to the{' '}
          <Link href="/legal/terms" target="_blank" rel="noopener noreferrer" className="underline whitespace-nowrap">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/legal/refund" target="_blank" rel="noopener noreferrer" className="underline whitespace-nowrap">
            Refund Policy
          </Link>
          .
        </Label>
      </div>
      <Button
        type="submit"
        disabled={!stripe || isConfirming || !termsAccepted}
        size="lg"
        className="w-full"
      >
        {isConfirming ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Processing…
          </>
        ) : (
          <>Pay {amountFormatted}</>
        )}
      </Button>
    </form>
  );
}

interface ExpressCheckoutInlineProps {
  productId: string;
  productTitle: string;
  amountFormatted: string;
  /** Total in dollars (used to derive amountInCents for wallet button). */
  amountTotalUsd: number;
  quantity: number;
}

/**
 * Inline on product page: individual native Stripe buttons (Apple/Google Pay, then Card/Link/etc. in accordion). Creates order on mount.
 */
export function ExpressCheckoutInline({
  productId,
  productTitle,
  amountFormatted,
  amountTotalUsd,
  quantity,
}: ExpressCheckoutInlineProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [amountFromApi, setAmountFromApi] = useState<string>(amountFormatted);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    fetch('/api/orders/create-express', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.orderId || !data.clientSecret) {
          setError(data.error ?? 'Failed to start payment');
          return;
        }
        setOrderId(data.orderId);
        setClientSecret(data.clientSecret);
        if (data.amountFormatted) setAmountFromApi(data.amountFormatted);
      })
      .catch(() => setError('Failed to start payment'))
      .finally(() => setLoading(false));
  }, [productId, quantity, amountFormatted]);

  const handleSuccess = () => {
    if (typeof window !== 'undefined' && orderId) {
      window.location.href = `${window.location.origin}/checkout/success?order_id=${orderId}`;
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-input bg-muted/30 p-6 flex flex-col items-center justify-center min-h-[280px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">Loading payment options…</p>
      </div>
    );
  }

  if (error || !clientSecret || !orderId) {
    return (
      <div className="rounded-lg border border-input bg-destructive/5 p-4 space-y-2">
        <p className="text-sm text-destructive" role="alert">
          {error ?? 'Something went wrong.'}
        </p>
        <Link href="/checkout" className="text-sm underline">
          Use full checkout from cart
        </Link>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <p className="text-sm text-destructive rounded-md bg-destructive/15 p-3">
        Payment is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
      </p>
    );
  }

  const amountInCents = Math.round(amountTotalUsd * 100);

  return (
    <div className="rounded-lg border border-input bg-muted/30 p-4 sm:p-6 space-y-4">
      <p className="text-sm font-medium text-foreground">
        Pay for {productTitle} — {amountFromApi}
      </p>
      {error && (
        <p className="text-sm text-destructive rounded-md bg-destructive/15 p-3" role="alert">
          {error}
        </p>
      )}
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
        <div className="space-y-4">
          <ExpressWalletButtonInline
            clientSecret={clientSecret}
            orderId={orderId}
            amountInCents={amountInCents}
            productTitle={productTitle}
            onError={setError}
          />
          <ExpressCheckoutForm
            orderId={orderId}
            amountFormatted={amountFromApi}
            onSuccess={handleSuccess}
            onError={setError}
          />
        </div>
      </Elements>
      <p className="text-xs text-muted-foreground text-center">
        No options showing?{' '}
        <Link href="/checkout" className="underline">
          Use full checkout from cart
        </Link>
      </p>
    </div>
  );
}

interface ExpressCheckoutPaymentElementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productTitle: string;
  amountFormatted: string;
  quantity: number;
}

/**
 * Modal that shows Stripe's Payment Element for quick checkout on the product page.
 * Card, Apple Pay, Google Pay, Klarna, Afterpay, Affirm, etc. use Stripe's official styling.
 */
export function ExpressCheckoutPaymentElementModal({
  open,
  onOpenChange,
  productId,
  productTitle,
  amountFormatted,
  quantity,
}: ExpressCheckoutPaymentElementModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mountPaymentElement, setMountPaymentElement] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !productId) {
      setMountPaymentElement(false);
      return;
    }
    setClientSecret(null);
    setOrderId(null);
    setError(null);
    setMountPaymentElement(false);
    setLoading(true);
    fetch('/api/orders/create-express', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.orderId || !data.clientSecret) {
          setError(data.error ?? 'Failed to start payment');
          return;
        }
        setOrderId(data.orderId);
        setClientSecret(data.clientSecret);
      })
      .catch(() => setError('Failed to start payment'))
      .finally(() => setLoading(false));
  }, [open, productId, quantity]);

  useEffect(() => {
    if (!open || !clientSecret) {
      setMountPaymentElement(false);
      return;
    }
    const baseDelay = typeof window !== 'undefined' && window.innerWidth < 640 ? 400 : 200;
    let mounted = true;
    const tryMount = () => {
      const el = containerRef.current;
      if (el && el.offsetWidth > 0 && el.offsetHeight > 0) {
        setMountPaymentElement(true);
        return;
      }
      if (!mounted) return;
      requestAnimationFrame(() => setTimeout(tryMount, 50));
    };
    const t = setTimeout(tryMount, baseDelay);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [open, clientSecret]);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(100vw-2rem,28rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick checkout — {productTitle}</DialogTitle>
          <DialogDescription>
            Choose your payment method below. Options depend on your location and order amount.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="text-sm text-destructive rounded-md bg-destructive/15 p-3" role="alert">
            {error}
          </p>
        )}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
            <p className="text-sm">Preparing payment…</p>
          </div>
        )}
        {!loading && clientSecret && orderId && !stripePromise && (
          <p className="text-sm text-destructive rounded-md bg-destructive/15 p-3" role="alert">
            Payment is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
          </p>
        )}
        {!loading && clientSecret && orderId && stripePromise && (
          <div
            ref={containerRef}
            className="min-h-[320px] sm:min-h-[280px] w-full min-w-0 flex flex-col"
            aria-busy={!mountPaymentElement}
          >
            {mountPaymentElement ? (
              <>
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
                    amountFormatted={amountFormatted}
                    onSuccess={handleSuccess}
                    onError={setError}
                  />
                </Elements>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  No options showing?{' '}
                  <Link href="/checkout" className="underline">
                    Use full checkout from cart
                  </Link>
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground min-h-[280px]">
                <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
                <p className="text-sm">Loading payment options…</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
