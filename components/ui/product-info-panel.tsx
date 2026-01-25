'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PackageProduct } from '@/lib/products';
import { ReviewsSection } from '@/components/ui/reviews-section';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { AddToCartButton } from '@/components/ui/add-to-cart-button';
import { AddToWishlistButton } from '@/components/wishlist/add-to-wishlist-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Gift } from 'lucide-react';

interface ProductInfoPanelProps {
  package: PackageProduct;
  className?: string;
  onQuantityChange?: (quantity: number) => void;
  packageValue?: number; // Total value of included products when purchased separately
}

export function ProductInfoPanel({ package: pkg, className, onQuantityChange, packageValue }: ProductInfoPanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    pkg.variants && pkg.variants.length > 0 ? pkg.variants[0].id : null
  );
  const { isAuthenticated } = useAuth();

  const currentVariant = pkg.variants?.find(v => v.id === selectedVariant);
  const displayPrice = currentVariant?.price ?? pkg.price;
  const displayOriginalPrice = currentVariant?.originalPrice ?? pkg.originalPrice;

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  const finalPrice = displayPrice * quantity;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Category & Content Hours Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {pkg.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {pkg.contentHours}
        </Badge>
      </div>

      {/* Product Title */}
      <div className="mb-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
          {pkg.title}
        </h1>
      </div>

      {/* Price */}
      <div className="space-y-2 mb-4">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl md:text-5xl font-bold">${displayPrice.toLocaleString()}</span>
          {(displayOriginalPrice || packageValue) && (
            <span className="text-xl text-muted-foreground line-through">
              ${(displayOriginalPrice || packageValue || 0).toLocaleString()}
            </span>
          )}
        </div>
        {(displayOriginalPrice || packageValue) && (
          <div className="space-y-1">
            {packageValue ? (
              <div>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                  You Save ${(packageValue - displayPrice).toLocaleString()} 
                  ({Math.round((1 - displayPrice / packageValue) * 100)}% off individual products)
                </p>
                <p className="text-xs text-muted-foreground">
                  Individual products total: ${packageValue.toLocaleString()}
                </p>
              </div>
            ) : displayOriginalPrice ? (
              <p className="text-sm text-muted-foreground">
                Save ${(displayOriginalPrice - displayPrice).toLocaleString()} 
                ({Math.round((1 - displayPrice / displayOriginalPrice) * 100)}% off)
              </p>
            ) : null}
          </div>
        )}
        {pkg.duration && (
          <p className="text-sm text-muted-foreground">
            {pkg.duration} • Lifetime access
          </p>
        )}
      </div>

      {/* Reviews */}
      {pkg.rating && pkg.reviewCount !== undefined && (
        <div className="mb-6">
          <ReviewsSection rating={pkg.rating} reviewCount={pkg.reviewCount} />
        </div>
      )}

      {/* Description */}
      <div className="mb-6">
        <p className="text-base leading-relaxed text-muted-foreground">
          {pkg.description}
        </p>
      </div>

      {/* Variant Selector (if variants exist) */}
      {pkg.variants && pkg.variants.length > 0 && (
        <div className="space-y-2 mb-6">
          <label htmlFor="variant-select" className="text-sm font-medium block">
            Package Option
          </label>
          <Select value={selectedVariant || undefined} onValueChange={setSelectedVariant}>
            <SelectTrigger id="variant-select" className="w-full h-11">
              <SelectValue placeholder="Select package option" />
            </SelectTrigger>
            <SelectContent>
              {pkg.variants.map((variant) => (
                <SelectItem key={variant.id} value={variant.id}>
                  {variant.name} - ${variant.price.toLocaleString()}
                  {variant.description && ` (${variant.description})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-6">
        <QuantitySelector
          min={1}
          max={10}
          defaultValue={1}
          onChange={handleQuantityChange}
        />
      </div>

      {/* Add to Cart Button */}
      <div className="mb-6">
        <AddToCartButton
          productId={pkg.id}
          price={finalPrice}
          quantity={quantity}
          variantId={selectedVariant || undefined}
          size="lg"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold text-base py-6 rounded-md"
        />
      </div>

      {/* Add to Wishlist Button */}
      {isAuthenticated && (
        <div className="mb-6">
          <AddToWishlistButton
            productId={pkg.id}
            variant="outline"
            size="lg"
            className="w-full"
          />
        </div>
      )}

      {/* DOER Coupon Bonus */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Gift className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-green-900 dark:text-green-100 mb-1 flex items-center gap-2">
              <span className="relative inline-flex h-6 w-6 flex-shrink-0 items-center justify-center">
                <Image
                  src="/usedoer_favicon.png"
                  alt="DOER logo"
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                  unoptimized
                />
              </span>
              <span>Bonus: 6 Months Free DOER Pro</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Get 6 months of free DOER Pro subscription on usedoer.com with your package purchase. 
              Perfect for managing your projects and tasks. Your unique coupon code will be provided after purchase.
            </p>
          </div>
        </div>
      </div>

      {/* Membership Offer Banner (if not authenticated) */}
      {!isAuthenticated && (
        <div className="bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 rounded-md p-4 mb-6">
          <p className="text-sm text-teal-900 dark:text-teal-100">
            <span className="font-medium">Members save 20%!</span>{' '}
            <Link href="/login" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">
              Login
            </Link>
            {' or '}
            <Link href="/signup" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">
              Join Today
            </Link>
          </p>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
        <div>
          <p className="font-semibold text-sm mb-1">Lifetime Access</p>
          <p className="text-muted-foreground text-xs">One-time purchase</p>
        </div>
        <div>
          <p className="font-semibold text-sm mb-1">Instant Download</p>
          <p className="text-muted-foreground text-xs">Access immediately</p>
        </div>
      </div>
    </div>
  );
}

