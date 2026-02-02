'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/contexts/checkout-context';
import { useCart } from '@/contexts/cart-context';
import { CheckoutProgress } from './components/checkout-progress';
import { CheckoutCartReview } from './components/checkout-cart-review';
import { CheckoutCustomerInfo } from './components/checkout-customer-info';
import { CheckoutOrderReview } from './components/checkout-order-review';
import { CheckoutSummary } from './components/checkout-summary';
import { Loader2 } from 'lucide-react';

export function CheckoutContent() {
  const { currentStep } = useCheckout();
  const { items, isLoading } = useCart();
  const router = useRouter();

  // Redirect only after cart has finished loading and is truly empty (avoid redirect race on initial load)
  useEffect(() => {
    if (!isLoading && items.length === 0) {
      router.replace('/');
    }
  }, [isLoading, items.length, router]);

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
    return null; // Redirect in progress
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Progress Indicator */}
        <div className="mb-8">
          <CheckoutProgress />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Step Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && <CheckoutCartReview />}
            {currentStep === 2 && <CheckoutCustomerInfo />}
            {currentStep === 3 && <CheckoutOrderReview />}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </main>
  );
}

