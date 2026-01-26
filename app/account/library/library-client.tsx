'use client';

import { ProductLibraryCard } from '@/components/library/product-library-card';
import { Card, CardContent } from '@/components/ui/card';
import type { ProductWithPurchaseDate } from '@/lib/db/access';

interface LibraryClientProps {
  products: ProductWithPurchaseDate[];
}

export function LibraryClient({ products }: LibraryClientProps) {
  return (
    <div className="space-y-6">
      {/* Packages List */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              No packages yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductLibraryCard
                key={product.id}
                product={product}
                purchasedDate={product.purchasedDate}
              />
            ))}
          </div>
          {/* Results count */}
          <p className="text-sm text-muted-foreground text-center">
            {products.length} {products.length === 1 ? 'package' : 'packages'}
          </p>
        </>
      )}
    </div>
  );
}
