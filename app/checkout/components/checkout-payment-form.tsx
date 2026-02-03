'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface CheckoutPaymentFormProps {
  orderId: string;
  totalFormatted: string;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  onError: (message: string) => void;
}

export function CheckoutPaymentForm({
  orderId,
  totalFormatted,
  termsAccepted,
  onTermsChange,
  onError,
}: CheckoutPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
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
      confirmParams: {
        return_url: returnUrl,
        receipt_email: undefined,
      },
    });

    if (confirmError) {
      onError(confirmError.message ?? 'Payment failed. Please try again.');
    }

    setIsConfirming(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          Enter your payment details below. You will complete your purchase on this page.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />

          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="checkout-terms-pay"
                checked={termsAccepted}
                onCheckedChange={(checked) => onTermsChange(checked === true)}
                className="mt-1 shrink-0"
                aria-invalid={!termsAccepted ? 'false' : 'false'}
              />
              <div className="min-w-0 text-sm leading-relaxed">
                <Label htmlFor="checkout-terms-pay" className="cursor-pointer">
                  I agree to the{' '}
                  <Link
                    href="/legal/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/legal/refund"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Refund Policy
                  </Link>
                  .
                </Label>
              </div>
            </div>
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
              <>Pay {totalFormatted}</>
            )}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
