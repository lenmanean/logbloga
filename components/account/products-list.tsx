'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Product } from '@/lib/types/database';
import { Package, Download, ChevronRight, Calendar, Gift } from 'lucide-react';
import { DoerCouponDisplay } from './doer-coupon-display';
import { cn } from '@/lib/utils';

interface ProductsListProps {
  products: Product[];
  ordersWithCoupons?: Array<{
    id: string;
    doer_coupon_code: string | null;
    doer_coupon_expires_at: string | null;
    doer_coupon_used: boolean | null;
    doer_coupon_used_at: string | null;
  }>;
  type: 'package' | 'individual';
}

export function ProductsList({ products, ordersWithCoupons = [], type }: ProductsListProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">
            No {type === 'package' ? 'packages' : 'products'} found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const productImage = product.package_image || (product.images as string[])?.[0] || '/placeholder-product.png';
        
        // Find order with Doer coupon for this package (if it's a package)
        const orderWithCoupon = type === 'package' && product.id
          ? ordersWithCoupons.find(order => {
              // We need to check if this order contains this package
              // For now, we'll show the first available coupon
              return order.doer_coupon_code;
            })
          : null;

        return (
          <Card key={product.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
                {product.featured && (
                  <Badge variant="outline" className="text-xs bg-red-500/10 text-red-700 dark:text-red-400">
                    Featured
                  </Badge>
                )}
              </div>
              
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center mb-4">
                {productImage && productImage !== '/placeholder-product.png' ? (
                  <img 
                    src={productImage} 
                    alt={product.title || product.name || 'Product'} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="h-12 w-12 text-muted-foreground" />
                )}
              </div>

              <CardTitle className="text-xl mb-2 line-clamp-2">
                {product.title || product.name || 'Untitled Product'}
              </CardTitle>
              
              {product.description && (
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              )}
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col space-y-4">
              {/* Product Info */}
              <div className="space-y-2 text-sm text-muted-foreground">
                {product.version_year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{product.version_year} Edition</span>
                  </div>
                )}
                {product.content_hours && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>{product.content_hours} of content</span>
                  </div>
                )}
              </div>

              {/* Doer Coupon for Packages */}
              {type === 'package' && orderWithCoupon && orderWithCoupon.doer_coupon_code && (
                <div className="border-t pt-4">
                  <DoerCouponDisplay
                    couponCode={orderWithCoupon.doer_coupon_code}
                    expiresAt={orderWithCoupon.doer_coupon_expires_at || null}
                    used={orderWithCoupon.doer_coupon_used || false}
                    usedAt={orderWithCoupon.doer_coupon_used_at || null}
                    compact={true}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2 mt-auto pt-4 border-t">
                <Link href={`/account/library/${product.id}`} className="w-full">
                  <Button variant="default" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Access Product
                  </Button>
                </Link>
                <Link href={`/ai-to-usd/packages/${product.slug}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
