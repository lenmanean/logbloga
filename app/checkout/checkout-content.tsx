'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/contexts/checkout-context';
import { useCart } from '@/contexts/cart-context';
import { CheckoutCartReview } from './components/checkout-cart-review';
import { CheckoutSummary } from './components/checkout-summary';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CheckoutContentProps {
  /** When true, show Master Bundle upsell below cart (user doesn't own it; client hides if cart has master-bundle). */
  showMasterBundleUpsell?: boolean;
  /** Master Bundle product data for upsell card (title, price, image). */
  masterBundle?: {
    title: string;
    price: number;
    package_image?: string | null;
  } | null;
}

export function CheckoutContent({ showMasterBundleUpsell = false, masterBundle = null }: CheckoutContentProps) {
  const { appliedCoupon, orderTotals } = useCheckout();
  const { items, isLoading } = useCart();
  const router = useRouter();

  const [payError, setPayError] = useState<string | null>(null);
  const [isContinuing, setIsContinuing] = useState(false);

  useEffect(() => {
    if (!isLoading && items.length === 0) {
      router.replace('/');
    }
  }, [isLoading, items.length, router]);

  const handleProceedToStripeCheckout = async () => {
    setPayError(null);
    if (orderTotals.total < 0.5) {
      setPayError('Order total must be at least $0.50.');
      return;
    }

    setIsContinuing(true);
    try {
      const orderRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponCode: appliedCoupon?.code ?? undefined,
        }),
      });
      if (!orderRes.ok) {
        const data = await orderRes.json();
        throw new Error(data.error ?? 'Failed to create order');
      }
      const order = await orderRes.json();

      const sessionRes = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });
      if (!sessionRes.ok) {
        const data = await sessionRes.json();
        throw new Error(data.error ?? 'Failed to start checkout');
      }
      const { url } = await sessionRes.json();
      if (!url) throw new Error('No checkout URL returned');
      window.location.href = url;
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

  const cartHasMasterBundle = items.some(
    (item) => (item.product?.slug ?? '').toLowerCase() === 'master-bundle'
  );
  const showUpsell = showMasterBundleUpsell && masterBundle && !cartHasMasterBundle;

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

            {showUpsell && (
              <MasterBundleUpsellCard
                title={masterBundle.title}
                price={masterBundle.price}
                image={masterBundle.package_image}
              />
            )}

            <div className="space-y-4">
              {payError && (
                <p className="text-sm text-destructive rounded-md bg-destructive/15 p-3" role="alert">
                  {payError}
                </p>
              )}
              <Button
                type="button"
                size="lg"
                onClick={handleProceedToStripeCheckout}
                disabled={isContinuing || orderTotals.total < 0.5}
                className="w-full"
              >
                {isContinuing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    Redirecting to checkout…
                  </>
                ) : (
                  `Proceed to Stripe Checkout — ${totalFormatted}`
                )}
              </Button>
            </div>
          </div>
          <div className="lg:col-span-1">
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </main>
  );
}

/** Compact Master Bundle upsell card for checkout (no full MasterBundleCard wrapper to avoid double link). */
function MasterBundleUpsellCard({
  title,
  price,
  image,
}: {
  title: string;
  price: number;
  image?: string | null;
}) {
  return (
    <a
      href="/ai-to-usd/packages/master-bundle"
      className="block overflow-hidden border-2 border-amber-400/50 dark:border-amber-500/40 bg-gradient-to-br from-amber-50/80 via-amber-100/40 to-yellow-50/70 dark:from-amber-950/30 dark:via-amber-900/20 dark:to-yellow-950/25 hover:shadow-xl hover:border-amber-500/60 dark:hover:border-amber-400/50 transition-all duration-300 rounded-lg"
    >
      <div className="p-6 md:p-8 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg text-amber-800 dark:text-amber-200">Get the Master Bundle</h3>
          <p className="text-sm text-muted-foreground mt-1">{title}</p>
          <p className="mt-2 text-lg font-semibold text-amber-700 dark:text-amber-300">
            ${price.toLocaleString()}
          </p>
          <span className="inline-block mt-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
            View Master Bundle →
          </span>
        </div>
        {image && (
          <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" className="object-cover w-full h-full" />
          </div>
        )}
      </div>
    </a>
  );
}
