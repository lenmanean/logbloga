'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/cart-context';

interface AddToCartButtonProps {
  productId: string;
  price: number;
  quantity?: number;
  variantId?: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  redirectToCart?: boolean; // Default: false
}

export function AddToCartButton({
  productId,
  price,
  quantity = 1,
  variantId,
  className,
  size = 'lg',
  redirectToCart = false,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    setIsLoading(true);
    setIsSuccess(false);

    try {
      await addItem(productId, quantity, variantId);
      setIsSuccess(true);
      
      // Reset success state after 2 seconds
      setTimeout(() => setIsSuccess(false), 2000);

      // Redirect to cart if requested
      if (redirectToCart) {
        router.push('/cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Error is handled by cart context, but we can show a message here if needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading || isSuccess}
      size={size}
      className={cn(
        'bg-red-500 hover:bg-red-600 text-white font-semibold touch-manipulation',
        isSuccess && 'bg-green-500 hover:bg-green-600',
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Adding...
        </>
      ) : isSuccess ? (
        <>
          <Check className="h-5 w-5" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          Add to Cart - ${price.toLocaleString()}
        </>
      )}
    </Button>
  );
}

