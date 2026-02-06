'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthModal } from '@/contexts/auth-modal-context';

function isPackagePage(pathname: string): boolean {
  return pathname.startsWith('/ai-to-usd/packages/') && pathname.length > '/ai-to-usd/packages/'.length;
}

interface ProductPagePaymentButtonsProps {
  productId: string;
  productTitle: string;
  productSlug?: string | null;
}

/**
 * Buy Now button for the product page (like Add to Cart). Links to /checkout/express;
 * auth is enforced there. When signed out on package page, opens auth modal instead of navigating.
 */
export function ProductPagePaymentButtons({
  productId,
  productTitle,
  productSlug,
}: ProductPagePaymentButtonsProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { openAuthModal } = useAuthModal();

  const expressUrl =
    `/checkout/express?productId=${encodeURIComponent(productId)}&title=${encodeURIComponent(productTitle)}` +
    (productSlug ? `&slug=${encodeURIComponent(productSlug)}` : '');

  const showModal = !authLoading && !isAuthenticated && isPackagePage(pathname ?? '');

  if (showModal) {
    return (
      <div className="mb-6">
        <Button
          size="lg"
          className="w-full font-semibold text-base py-6 rounded-md flex items-center justify-center gap-2"
          onClick={() =>
            openAuthModal('buy_now', {
              productId,
              productTitle,
              productSlug: productSlug ?? undefined,
            })
          }
        >
          <ShoppingBag className="h-5 w-5" aria-hidden />
          Buy Now
        </Button>
      </div>
    );
  }

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
