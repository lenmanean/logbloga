'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import type { WishlistItemWithProduct } from '@/lib/types/database';
import { cn } from '@/lib/utils';

interface WishlistItemProps {
  item: WishlistItemWithProduct;
  onRemove?: (itemId: string) => void;
}

export function WishlistItem({ item, onRemove }: WishlistItemProps) {
  const { addItem } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const product = item.product;
  const productImage = product.package_image || (product.images as string[])?.[0] || product.image_url || '/placeholder-product.png';
  const productTitle = product.title || product.name || 'Product';
  const productPrice = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
  const productSlug = product.slug || product.id;

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const response = await fetch('/api/wishlist/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.product_id }),
      });

      if (response.ok) {
        onRemove?.(item.id);
      } else {
        throw new Error('Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addItem(item.product_id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 flex flex-col">
      <CardHeader className="pb-4">
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted mb-4">
          <Image
            src={productImage}
            alt={productTitle}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="text-xs">
            {product.category || 'Product'}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={isRemoving}
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Link href={`/ai-to-usd/packages/${productSlug}`}>
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
            {productTitle}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {product.description || ''}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-bold">${productPrice.toLocaleString()}</span>
          {product.featured && (
            <Badge className="bg-red-500 text-white border-0">Featured</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-4 border-t">
        <Button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full"
          variant="default"
        >
          {isAddingToCart ? (
            <>
              <ShoppingCart className="h-4 w-4 mr-2 animate-pulse" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
        <Link href={`/ai-to-usd/packages/${productSlug}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

