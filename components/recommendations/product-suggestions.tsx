'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import type { Product } from '@/lib/types/database';
import { cn } from '@/lib/utils';

export type LayoutType = 'grid' | 'carousel' | 'list';

export interface ProductSuggestion {
  product: Product;
  score?: number;
  source?: string;
  type?: 'upsell' | 'cross-sell' | 'related';
}

interface ProductSuggestionsProps {
  products: ProductSuggestion[];
  title?: string;
  layout?: LayoutType;
  limit?: number;
  showScore?: boolean;
  className?: string;
  onProductClick?: (productId: string) => void;
  isLoading?: boolean;
}

export function ProductSuggestions({
  products,
  title,
  layout = 'grid',
  limit,
  showScore = false,
  className,
  onProductClick,
  isLoading = false,
}: ProductSuggestionsProps) {
  const displayProducts = limit ? products.slice(0, limit) : products;

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading recommendations...</span>
      </div>
    );
  }

  if (displayProducts.length === 0) {
    return null;
  }

  const handleProductClick = (productId: string) => {
    if (onProductClick) {
      onProductClick(productId);
    }
  };

  const getProductImage = (product: Product): string => {
    if (product.package_image) return product.package_image;
    const images = product.images as string[] | null;
    if (images && images.length > 0) return images[0];
    if (product.image_url) return product.image_url;
    return '/placeholder-product.png';
  };

  const getProductTitle = (product: Product): string => {
    return product.title || product.name || 'Untitled Product';
  };

  const getProductPrice = (product: Product): number => {
    return typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
  };

  const getProductOriginalPrice = (product: Product): number | undefined => {
    if (!product.original_price) return undefined;
    return typeof product.original_price === 'number'
      ? product.original_price
      : parseFloat(String(product.original_price));
  };

  const categoryLabels: Record<string, string> = {
    'web-apps': 'Web Apps',
    'social-media': 'Social Media',
    'agency': 'Agency',
    'freelancing': 'Freelancing',
  };

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
    advanced: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const renderProductCard = (suggestion: ProductSuggestion, index: number) => {
    const product = suggestion.product;
    const productImage = getProductImage(product);
    const productTitle = getProductTitle(product);
    const price = getProductPrice(product);
    const originalPrice = getProductOriginalPrice(product);
    const productSlug = product.slug || product.id;

    return (
      <Card
        key={product.id}
        className={cn(
          'group hover:shadow-lg transition-all duration-300 flex flex-col',
          layout === 'list' && 'flex-row'
        )}
      >
        <CardHeader className={cn('pb-4', layout === 'list' && 'w-48 flex-shrink-0')}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {categoryLabels[product.category || ''] || product.category}
            </Badge>
            {product.featured && (
              <Badge className="bg-red-500 text-white border-0">Featured</Badge>
            )}
            {showScore && suggestion.score !== undefined && (
              <Badge variant="outline" className="text-xs">
                {Math.round(suggestion.score)}
              </Badge>
            )}
          </div>
          <div
            className={cn(
              'bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center overflow-hidden',
              layout === 'list' ? 'h-32' : 'h-48'
            )}
          >
            <Image
              src={productImage}
              alt={productTitle}
              width={layout === 'list' ? 192 : 300}
              height={layout === 'list' ? 128 : 200}
              className="object-cover w-full h-full"
            />
          </div>
        </CardHeader>
        <CardContent className={cn('flex-1 flex flex-col', layout === 'list' && 'pt-6')}>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {productTitle}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {product.description || ''}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {product.difficulty && (
              <Badge
                variant="outline"
                className={cn('text-xs', difficultyColors[product.difficulty])}
              >
                {product.difficulty}
              </Badge>
            )}
            {product.duration && (
              <Badge variant="outline" className="text-xs">
                {product.duration}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-4 border-t">
          <div className="flex items-center gap-2 w-full">
            <span className="text-2xl font-bold">${price.toLocaleString()}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <Link
            href={`/ai-to-usd/packages/${productSlug}`}
            className="w-full"
            onClick={() => handleProductClick(product.id)}
          >
            <Button
              className="w-full rounded-full"
              variant={product.featured ? 'default' : 'outline'}
            >
              {product.featured ? 'Get Started' : 'View Details'}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {title && (
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
      )}
      {layout === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map(renderProductCard)}
        </div>
      )}
      {layout === 'carousel' && (
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {displayProducts.map((suggestion, index) => (
            <div key={suggestion.product.id} className="flex-shrink-0 w-80">
              {renderProductCard(suggestion, index)}
            </div>
          ))}
        </div>
      )}
      {layout === 'list' && (
        <div className="space-y-4">
          {displayProducts.map(renderProductCard)}
        </div>
      )}
    </div>
  );
}

