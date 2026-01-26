/**
 * Product library card component
 * Displays a product in the user's library
 */

import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types/database';
import Image from 'next/image';

interface ProductLibraryCardProps {
  product: Product;
  purchasedDate: string;
  lastAccessedDate?: string;
}

export function ProductLibraryCard({ product, purchasedDate, lastAccessedDate }: ProductLibraryCardProps) {
  const purchaseDate = purchasedDate
    ? format(new Date(purchasedDate), 'MMM d, yyyy')
    : 'N/A';
  
  const lastAccessed = lastAccessedDate
    ? format(new Date(lastAccessedDate), 'MMM d, yyyy')
    : null;

  const images = product.images as string[] | null | undefined;
  const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
  const productImage = product.package_image || firstImage || '/placeholder-product.png';
  const productSlug = product.slug || product.id;

  return (
    <Link href={`/account/library/${product.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          {/* Product Image */}
          {productImage && (
            <div className="relative w-full h-48 mb-4 flex items-center justify-center">
              <Image
                src={productImage}
                alt={product.title || 'Product'}
                width={200}
                height={192}
                className="object-contain max-w-full max-h-full"
              />
            </div>
          )}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate">
                {product.title || product.name || 'Product'}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Purchased {purchaseDate}
              </p>
              {lastAccessed && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Last Accessed {lastAccessed}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Access Button */}
          <Button variant="default" size="sm" className="w-full h-9">
            Access Product
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
