'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

interface ProductPagePaymentButtonsProps {
  productId: string;
  productTitle: string;
  productSlug?: string | null;
}

/**
 * Buy Now button for the product page (like Add to Cart). Links to /checkout/express;
 * auth is enforced there. Visible to all users. Stripe Checkout offers card, Link, Klarna, Affirm, Afterpay, etc.
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
    <div className="mb-6">
      <Button
        size="lg"
        className="w-full font-semibold text-base py-6 rounded-md"
        asChild
      >
        <Link href={expressUrl} className="flex items-center justify-center gap-2">
          <ShoppingBag className="h-5 w-5" aria-hidden />
          Buy Now
        </Link>
      </Button>
    </div>
  );
}
