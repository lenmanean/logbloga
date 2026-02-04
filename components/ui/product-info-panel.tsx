'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PackageProduct } from '@/lib/products';
import { ReviewsSection } from '@/components/ui/reviews-section';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { AddToCartButton } from '@/components/ui/add-to-cart-button';
import { AddToWishlistButton } from '@/components/wishlist/add-to-wishlist-button';
import { ProductPagePaymentButtons } from '@/components/checkout/product-page-payment-buttons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Gift, Info, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductInfoPanelProps {
  package: PackageProduct;
  className?: string;
  onQuantityChange?: (quantity: number) => void;
  /** When true, user already owns this product; show Access Package only */
  hasAccess?: boolean;
}

export function ProductInfoPanel({ package: pkg, className, onQuantityChange, hasAccess = false }: ProductInfoPanelProps) {
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
          {displayOriginalPrice && (
            <span className="text-xl text-muted-foreground line-through">
              ${displayOriginalPrice.toLocaleString()}
            </span>
          )}
        </div>
        {displayOriginalPrice && (
          <p className="text-sm text-muted-foreground">
            Save ${(displayOriginalPrice - displayPrice).toLocaleString()} 
            ({Math.round((1 - displayPrice / displayOriginalPrice) * 100)}% off)
          </p>
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

      {hasAccess ? (
        <div className="mb-6">
          <Button asChild size="lg" className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold text-base py-6 rounded-md gap-2">
            <Link href={`/account/library/${pkg.id}`} className="flex items-center justify-center gap-2">
              Access Package
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Quantity Selector — one per package/bundle */}
          <div className="mb-6">
            <QuantitySelector
              min={1}
              max={1}
              defaultValue={1}
              onChange={handleQuantityChange}
            />
          </div>

          {/* Payment method buttons (redirect to Stripe Checkout); visible to all users. */}
          <ProductPagePaymentButtons
            productId={pkg.id}
            productTitle={pkg.title}
            productSlug={pkg.slug}
          />

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
        </>
      )}

      {/* DOER Coupon Bonus */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Gift className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-green-200 dark:hover:bg-green-900 p-0"
                  >
                    <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="sr-only">Learn more about DOER integration</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Image
                        src="/usedoer_favicon.png"
                        alt="DOER logo"
                        width={24}
                        height={24}
                        className="h-6 w-6 object-contain"
                        unoptimized
                      />
                      DOER Integration with Logbloga AI to USD Packages
                    </DialogTitle>
                    <DialogDescription>
                      Learn how DOER enhances your package experience
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="max-h-[60vh] pr-4">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">What is DOER?</h3>
                        <p className="text-sm text-muted-foreground">
                          DOER is a powerful project management and task tracking platform that helps you organize, 
                          manage, and execute your projects efficiently. When you purchase any Logbloga AI to USD package, 
                          you receive 6 months of free DOER Pro subscription to help you implement and track your progress.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-2">How DOER Works with Your Package</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          DOER seamlessly integrates with your Logbloga packages to provide:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                          <li>Project tracking and milestone management for each package level</li>
                          <li>Task organization aligned with your package's implementation plan</li>
                          <li>Progress monitoring to track your journey from Level 1 to Level 3</li>
                          <li>Resource management for templates, guides, and creative frameworks</li>
                          <li>Time tracking to monitor your investment and ROI</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2">Getting Started</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-4">
                          <li>Purchase your Logbloga AI to USD package</li>
                          <li>Receive your unique DOER Pro coupon code after purchase</li>
                          <li>Visit usedoer.com/checkout?plan=pro&cycle=monthly and enter your code in the Promo Code field</li>
                          <li>Set up your DOER workspace and import your package implementation plan</li>
                          <li>Start tracking your progress through each level</li>
                        </ol>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2">Video Tutorials</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Watch these videos to learn more about implementing DOER with your package:
                        </p>
                        <div className="space-y-3">
                          <div className="bg-muted rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground">
                              Video tutorials will be available here soon
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                        <p className="text-sm text-green-900 dark:text-green-100">
                          <strong>Note:</strong> Your DOER Pro coupon code will be available in your account 
                          after purchase. The 6-month free subscription starts when you redeem the code on usedoer.com.
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Get 6 months of free DOER Pro subscription on usedoer.com with your package purchase. 
              Perfect for managing your projects and tasks. Your unique coupon code will be provided after purchase.
            </p>
          </div>
        </div>
      </div>

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

