'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CreditCard, Smartphone } from 'lucide-react';

interface ProductPagePaymentButtonsProps {
  productId: string;
  productTitle: string;
  productSlug?: string | null;
}

/**
 * Individual payment method buttons for the product page (like Add to Cart).
 * All link to /checkout/express; auth is enforced there. Visible to all users.
 */
export function ProductPagePaymentButtons({
  productId,
  productTitle,
  productSlug,
}: ProductPagePaymentButtonsProps) {
  const expressUrl =
    `/checkout/express?productId=${encodeURIComponent(productId)}&title=${encodeURIComponent(productTitle)}` +
    (productSlug ? `&slug=${encodeURIComponent(productSlug)}` : '');

  return (
    <>
      <div className="mb-6">
        <Button
          size="lg"
          className="w-full font-semibold text-base py-6 rounded-md"
          asChild
        >
          <Link href={expressUrl} className="flex items-center justify-center gap-2">
            <CreditCard className="h-5 w-5" aria-hidden />
            Pay with card
          </Link>
        </Button>
      </div>
      <div className="mb-6">
        <Button
          variant="outline"
          size="lg"
          className="w-full font-semibold text-base py-6 rounded-md"
          asChild
        >
          <Link href={expressUrl} className="flex items-center justify-center gap-2">
            <Smartphone className="h-5 w-5" aria-hidden />
            Pay with Apple Pay / Google Pay
          </Link>
        </Button>
      </div>
    </>
  );
}
