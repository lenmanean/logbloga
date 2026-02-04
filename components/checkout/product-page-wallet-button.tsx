'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const MIN_CHECKOUT_AMOUNT_USD = 0.5;

interface ProductPageWalletButtonProps {
  productId: string;
  productTitle: string;
  productSlug?: string | null;
  /** Product price in USD (quantity 1). Used to show wallet button without creating an order until user taps. */
  amountUsd: number;
}

/**
 * Native Apple Pay / Google Pay button for the product page.
 * When signed out: shows a link to sign-in with redirect back to the product page.
 * When signed in: fetches wallet intent, mounts Stripe Payment Request Button if available; otherwise renders nothing.
 */
export function ProductPageWalletButton({
  productId,
  productTitle,
  productSlug,
  amountUsd,
}: ProductPageWalletButtonProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [walletAvailable, setWalletAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Defer order creation until user taps Apple Pay / Google Pay (avoids pending orders on page load).
  useEffect(() => {
    if (!isAuthenticated || !stripePublishableKey || !containerRef.current) return;
    if (amountUsd < MIN_CHECKOUT_AMOUNT_USD) return;

    let mounted = true;
    let prButton: { mount: (el: HTMLElement) => void; unmount: () => void } | null = null;

    const setup = async () => {
      try {
        const stripeModule = await loadStripe(stripePublishableKey);
        if (!mounted || !stripeModule) return;

        const amountCents = Math.round(amountUsd * 100);
        const paymentRequest = stripeModule.paymentRequest({
          country: 'US',
          currency: 'usd',
          total: {
            label: productTitle || 'Total',
            amount: amountCents,
          },
          requestPayerEmail: true,
        });

        type PaymentMethodEvent = { paymentMethod: { id: string }; complete: (s: string) => void };
        (paymentRequest as { on(event: string, handler: (ev: PaymentMethodEvent) => void): void }).on(
          'paymentmethod',
          async (ev: PaymentMethodEvent) => {
            // Create order and PaymentIntent only when user commits (taps wallet button).
            let res: Response;
            try {
              res = await fetch('/api/checkout/express-wallet-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  productId,
                  productSlug: productSlug ?? undefined,
                }),
              });
            } catch {
              ev.complete('fail');
              if (mounted) setError('Unable to start payment');
              return;
            }

            const data = await res.json().catch(() => ({}));
            const clientSecret = data.clientSecret;
            const orderId = data.orderId;

            if (!res.ok || !stripeModule || !clientSecret || !orderId) {
              ev.complete('fail');
              if (mounted) setError(data.error ?? 'Unable to start payment');
              return;
            }

            const { paymentIntent, error: confirmError } = await stripeModule.confirmCardPayment(
              clientSecret,
              { payment_method: ev.paymentMethod.id },
              { handleActions: false }
            );
            if (!mounted) return;
            if (confirmError) {
              ev.complete('fail');
              setError(confirmError.message ?? 'Payment failed');
              return;
            }
            ev.complete('success');
            if (paymentIntent?.status === 'requires_action') {
              const { error: actionError } = await stripeModule.confirmCardPayment(clientSecret);
              if (actionError) {
                setError(actionError.message ?? 'Payment failed');
                return;
              }
            }
            window.location.href = `/checkout/success?order_id=${encodeURIComponent(orderId)}`;
          }
        );

        const canMake = await paymentRequest.canMakePayment();
        if (!mounted) return;
        if (canMake && containerRef.current) {
          const elements = stripeModule.elements();
          prButton = elements.create('paymentRequestButton', {
            paymentRequest,
            style: {
              paymentRequestButton: {
                type: 'default',
                theme: 'dark',
                height: '48px',
              },
            },
          });
          prButton.mount(containerRef.current);
          setWalletAvailable(true);
        } else {
          setWalletAvailable(false);
        }
      } catch (e) {
        if (!mounted) return;
        console.error('ProductPageWalletButton setup error:', e);
        setError('Unable to load wallet payment');
        setWalletAvailable(false);
      }
    };

    setup();
    return () => {
      mounted = false;
      if (prButton && containerRef.current) {
        try {
          prButton.unmount();
        } catch (_) {}
      }
    };
  }, [isAuthenticated, productId, productSlug, productTitle, amountUsd]);

  if (authLoading) {
    return null;
  }

  if (!isAuthenticated) {
    const signInRedirect = pathname || '/';
    const signInUrl = `/auth/signin?redirect=${encodeURIComponent(signInRedirect)}`;
    return (
      <div className="mb-6">
        <Button
          variant="outline"
          size="lg"
          className="w-full font-semibold text-base py-6 rounded-md border border-gray-300 dark:border-gray-600"
          asChild
        >
          <Link href={signInUrl}>
            Apple Pay / Google Pay
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground mt-1 text-center">
          Sign in to pay with Apple Pay or Google Pay
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 text-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (walletAvailable === false) {
    return null;
  }

  return (
    <div className="mb-6">
      <div ref={containerRef} className="min-h-[48px]" />
    </div>
  );
}
