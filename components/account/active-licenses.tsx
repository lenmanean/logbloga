'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, ArrowRight, BookOpen } from 'lucide-react';
import type { LicenseWithProduct } from '@/lib/types/database';

interface ActiveLicensesProps {
  licenses: LicenseWithProduct[];
  limit?: number;
}

export function ActiveLicenses({ licenses, limit = 5 }: ActiveLicensesProps) {
  // Filter to only active licenses
  const activeLicenses = licenses.filter((license) => license.status === 'active').slice(0, limit);

  if (activeLicenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Active Licenses
          </CardTitle>
          <CardDescription>Your active product licenses</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No active licenses yet. Purchase products to get started.
          </p>
          <Link href="/ai-to-usd">
            <Button className="w-full" variant="outline">
              Browse Products
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const getProductImage = (product: LicenseWithProduct['product']): string => {
    if (!product) return '/placeholder-product.png';
    if (product.package_image) return product.package_image;
    const images = product.images as string[] | null;
    if (images && images.length > 0) return images[0];
    if (product.image_url) return product.image_url;
    return '/placeholder-product.png';
  };

  const getProductTitle = (product: LicenseWithProduct['product']): string => {
    if (!product) return 'Product';
    return product.title || product.name || 'Product';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Active Licenses
            </CardTitle>
            <CardDescription>Your active product licenses</CardDescription>
          </div>
          {licenses.length > limit && (
            <Link href="/account/licenses">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeLicenses.map((license) => {
            if (!license.product) return null;

            const productSlug = license.product.slug || license.product_id;
            const productImage = getProductImage(license.product);
            const productTitle = getProductTitle(license.product);

            return (
              <div
                key={license.id}
                className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden border flex-shrink-0">
                  <Image
                    src={productImage}
                    alt={productTitle}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/account/library/${license.product_id}`}
                      className="font-medium hover:text-primary transition-colors truncate"
                    >
                      {productTitle}
                    </Link>
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    License key: {license.license_key.substring(0, 12)}...
                  </p>
                </div>
                <Link href={`/account/library/${license.product_id}`}>
                  <Button variant="ghost" size="sm">
                    <BookOpen className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
        {licenses.length > limit && (
          <div className="mt-4 pt-4 border-t">
            <Link href="/account/licenses" className="w-full">
              <Button variant="outline" className="w-full">
                View All Licenses
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

