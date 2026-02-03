'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/cart-context';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import type { CartItemWithProduct } from '@/lib/db/cart';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItemWithProduct;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const product = item.product;
  const productSlug = product?.slug;
  const productImage = product?.package_image || (product?.images as string[])?.[0] || '/placeholder-product.png';
  const productTitle = product?.title || 'Product';
  const unitPrice = typeof product?.price === 'number' 
    ? product.price 
    : parseFloat(String(product?.price || 0));
  const lineTotal = unitPrice * (item.quantity || 0);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity === item.quantity) return;

    setIsUpdating(true);
    try {
      await updateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm('Remove this item from your cart?')) {
      return;
    }

    setIsRemoving(true);
    try {
      await removeItem(item.id);
    } catch (error) {
      console.error('Error removing item:', error);
      setIsRemoving(false);
    }
  };

  return (
    <div className={cn(
      'flex gap-4 p-4 pr-24 border rounded-lg relative',
      isRemoving && 'opacity-50 pointer-events-none'
    )}>
      {/* Remove: fixed top-right so it's always visible and doesn't affect layout */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        disabled={isRemoving}
        className="absolute top-3 right-3 z-10 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
      >
        {isRemoving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Trash2 className="h-4 w-4 mr-1" />
            <span>Remove</span>
          </>
        )}
        <span className="sr-only">Remove item from cart</span>
      </Button>

      {/* Product Image: fixed size so layout is predictable */}
      <Link 
        href={productSlug ? `/ai-to-usd/packages/${productSlug}` : '#'}
        className="relative w-20 h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden"
      >
        <Image
          src={productImage}
          alt={productTitle}
          fill
          className="object-cover"
        />
      </Link>

      {/* Content: single column so title, price, quantity never overlap */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {/* Title and unit price only - no inline quantity/price */}
        <Link 
          href={productSlug ? `/ai-to-usd/packages/${productSlug}` : '#'}
          className="hover:underline min-w-0"
        >
          <h3 className="font-semibold text-sm leading-tight break-words">
            {productTitle}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground">
          ${unitPrice.toLocaleString()} each
        </p>
        {/* Quantity and line total on their own row, below title */}
        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex items-center gap-2">
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <QuantitySelector
                min={1}
                max={1}
                defaultValue={item.quantity || 1}
                onChange={handleQuantityChange}
              />
            )}
          </div>
          <p className="font-semibold text-sm shrink-0">
            ${lineTotal.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

