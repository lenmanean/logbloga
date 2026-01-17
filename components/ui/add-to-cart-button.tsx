'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  packageId: string;
  price: number;
  quantity?: number;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
}

export function AddToCartButton({ packageId, price, quantity = 1, className, size = 'lg' }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Store package ID and quantity in sessionStorage for checkout
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedPackage', packageId);
        sessionStorage.setItem('selectedQuantity', quantity.toString());
      }
      
      // Redirect to checkout page
      router.push(`/checkout?package=${packageId}&quantity=${quantity}`);
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
        'bg-red-500 hover:bg-red-600 text-white font-semibold touch-manipulation',
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

