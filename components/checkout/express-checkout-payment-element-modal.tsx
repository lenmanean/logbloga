'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  PaymentElement,
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
import { PAYMENT_METHOD_ORDER } from '@/lib/stripe/payment-element-options';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface ExpressCheckoutFormProps {
  orderId: string;
  amountFormatted: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

function ExpressCheckoutForm({
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
      <div className="min-h-[280px] w-full" aria-label="Payment method">
        <PaymentElement
          options={{
            layout: 'tabs',
            paymentMethodOrder: [...PAYMENT_METHOD_ORDER],
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
          <Link href="/legal/terms" target="_blank" rel="noopener noreferrer" className="underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/legal/refund" target="_blank" rel="noopener noreferrer" className="underline">
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
  // Defer mounting Payment Element until dialog is open and painted (fixes blank iframe in modal)
  const [mountPaymentElement, setMountPaymentElement] = useState(false);

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

  // Mount Payment Element only after dialog content is visible so Stripe iframe has dimensions
  useEffect(() => {
    if (!open || !clientSecret) {
      setMountPaymentElement(false);
      return;
    }
    const t = setTimeout(() => setMountPaymentElement(true), 200);
    return () => clearTimeout(t);
  }, [open, clientSecret]);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick checkout — {productTitle}</DialogTitle>
          <DialogDescription>
            Choose your payment method below. Enable Klarna, Afterpay, Affirm, and others in Stripe Dashboard if you want them to appear here.
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
        {!loading && clientSecret && orderId && stripePromise && mountPaymentElement && (
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
        )}
      </DialogContent>
    </Dialog>
  );
}
