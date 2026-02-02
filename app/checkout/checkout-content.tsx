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

export function CheckoutContent() {
  const { currentStep } = useCheckout();
  const { items } = useCart();
  const router = useRouter();

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/');
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null; // Will redirect
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

