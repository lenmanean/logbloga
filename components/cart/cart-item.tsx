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
      'flex flex-col sm:flex-row gap-4 p-4 border rounded-lg relative',
      isRemoving && 'opacity-50 pointer-events-none'
    )}>
      {/* Remove: fixed top-right of card so it's always visible (e.g. in narrow cart sheet) */}
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

      {/* Product Image */}
      <Link 
        href={productSlug ? `/ai-to-usd/packages/${productSlug}` : '#'}
        className="relative w-full sm:w-24 h-24 sm:h-24 bg-muted rounded-md overflow-hidden flex-shrink-0"
      >
        <Image
          src={productImage}
          alt={productTitle}
          fill
          className="object-cover"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 min-w-0">
        <div className="flex-1 min-w-0">
          <Link 
            href={productSlug ? `/ai-to-usd/packages/${productSlug}` : '#'}
            className="hover:underline"
          >
            <h3 className="font-semibold text-lg mb-1">{productTitle}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">
            ${unitPrice.toLocaleString()} each
          </p>
        </div>

        {/* Quantity and Line Total */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <QuantitySelector
                min={1}
                max={10}
                defaultValue={item.quantity || 1}
                onChange={handleQuantityChange}
              />
            )}
          </div>
          <div className="text-right min-w-[80px]">
            <p className="font-semibold text-lg">
              ${lineTotal.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

