'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  packageId: string;
  price: number;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
}

export function AddToCartButton({ packageId, price, className, size = 'lg' }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Store package ID in sessionStorage for checkout
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedPackage', packageId);
      }
      
      // Redirect to checkout page
      router.push(`/checkout?package=${packageId}`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading}
      size={size}
      className={cn(
        'bg-red-500 hover:bg-red-600 text-white font-semibold',
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Processing...
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

