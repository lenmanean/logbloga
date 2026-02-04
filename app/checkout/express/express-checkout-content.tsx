'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';

interface ExpressCheckoutContentProps {
  productId: string;
  productTitle: string;
  productSlug?: string | null;
}

/**
 * Redirect-only express checkout: creates a Checkout Session and redirects to Stripe.
 * No Payment Element; auth is enforced by the server page.
 */
export function ExpressCheckoutContent({
  productId,
  productTitle,
  productSlug,
}: ExpressCheckoutContentProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    setError(null);
    fetch('/api/checkout/express-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        ...(productSlug && { productSlug }),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        setError(data.error ?? 'Failed to start checkout');
      })
      .catch(() => setError('Failed to start checkout'))
      .finally(() => setLoading(false));
  }, [productId, productSlug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground mt-4">Redirecting to checkout…</p>
      </main>
    );
  }

  if (error) {
    const backHref = productSlug ? `/ai-to-usd/packages/${productSlug}` : '/ai-to-usd';
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-md mx-auto space-y-4">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <p className="text-sm text-destructive rounded-md bg-destructive/15 p-4" role="alert">
            {error}
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href={backHref}>Back to product</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/checkout">Go to full checkout</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
