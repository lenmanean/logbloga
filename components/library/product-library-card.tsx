/**
 * Product library card component
 * Displays a product in the user's library
 */

import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Download } from 'lucide-react';
import type { LicenseWithProduct } from '@/lib/types/database';
import Image from 'next/image';

interface ProductLibraryCardProps {
  license: LicenseWithProduct;
}

export function ProductLibraryCard({ license }: ProductLibraryCardProps) {
  const product = license.product;
  const accessDate = license.access_granted_at
    ? format(new Date(license.access_granted_at), 'MMM d, yyyy')
    : license.created_at
      ? format(new Date(license.created_at), 'MMM d, yyyy')
      : 'N/A';

  if (!product) {
    return null;
  }

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
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-muted">
              <Image
                src={productImage}
                alt={product.title || 'Product'}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate">
                {product.title || 'Product'}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Access granted {accessDate}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Access Badge */}
          <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit">
            <CheckCircle2 className="h-3 w-3 text-green-600" />
            Active License
          </Badge>

          {/* Category */}
          {product.category && (
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          )}

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
