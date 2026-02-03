'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/cart-context';
import { useCheckout } from '@/contexts/checkout-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';

interface CheckoutCartReviewProps {
  /** When true, do not show step navigation (single-page checkout). */
  singlePage?: boolean;
}

export function CheckoutCartReview({ singlePage }: CheckoutCartReviewProps = {}) {
  const { items } = useCart();
  const { setCurrentStep } = useCheckout();

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Cart is Empty</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Add items to your cart to continue with checkout.
          </p>
          <Link href="/ai-to-usd">
            <Button>Continue Shopping</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Review Your Cart</CardTitle>
          <Link href="/">
            <Button variant="outline" size="sm">
              Edit Cart
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const product = item.product;
          const productSlug = product?.slug;
          const productImage = product?.package_image || (product?.images as string[])?.[0] || '/placeholder-product.png';
          const productTitle = product?.title || 'Product';
          const unitPrice = typeof product?.price === 'number' 
            ? product.price 
            : parseFloat(String(product?.price || 0));
          const lineTotal = unitPrice * (item.quantity || 0);

          return (
            <div key={item.id} className="flex gap-4 py-4">
              <div className="relative h-20 w-20 flex-shrink-0 rounded-md border overflow-hidden">
                <Link href={productSlug ? `/ai-to-usd/packages/${productSlug}` : '#'}>
                  <Image
                    src={productImage}
                    alt={productTitle}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </Link>
              </div>

              <div className="flex-1 min-w-0">
                <Link 
                  href={productSlug ? `/ai-to-usd/packages/${productSlug}` : '#'}
                  className="hover:underline"
                >
                  <h3 className="font-semibold text-sm md:text-base">{productTitle}</h3>
                </Link>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Qty: {item.quantity || 0}
                  </span>
                  <span className="font-semibold">
                    ${lineTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <Separator />

        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-semibold">Subtotal</span>
          <span className="text-lg font-semibold">
            ${items.reduce((sum, item) => {
              const price = typeof item.product?.price === 'number' 
                ? item.product.price 
                : parseFloat(String(item.product?.price || 0));
              return sum + (price * (item.quantity || 0));
            }, 0).toLocaleString()}
          </span>
        </div>

        {!singlePage && (
          <div className="flex justify-end pt-4">
            <Button onClick={() => setCurrentStep(2)} size="lg">
              Continue to Customer Info
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

