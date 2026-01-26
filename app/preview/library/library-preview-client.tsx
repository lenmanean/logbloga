'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import type { ProductWithPurchaseDate } from '@/lib/types/database';

interface LibraryPreviewClientProps {
  products: ProductWithPurchaseDate[];
}

export function LibraryPreviewClient({ products: initialProducts }: LibraryPreviewClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial filter values from URL
  const categoryFilter = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialProducts.forEach((product) => {
      if (product.category) {
        cats.add(product.category);
      }
    });
    return Array.from(cats).sort();
  }, [initialProducts]);

  // Update URL when filters change
  const updateFilters = (updates: {
    category?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.category && updates.category !== 'all') {
      params.set('category', updates.category);
    } else {
      params.delete('category');
    }

    if (updates.search) {
      params.set('search', updates.search);
    } else {
      params.delete('search');
    }

    router.push(`/preview/library?${params.toString()}`);
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts];

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    // Filter by search query (product name)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) => {
        const productName = product.title?.toLowerCase() || product.name?.toLowerCase() || '';
        return productName.includes(query);
      });
    }

    return filtered;
  }, [initialProducts, categoryFilter, searchQuery]);

  const hasActiveFilters = categoryFilter !== 'all' || searchQuery !== '';

  const clearFilters = () => {
    setLocalSearchQuery('');
    router.push('/preview/library');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: localSearchQuery });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <Input
                placeholder="Search by product name..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </form>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Select
                    value={categoryFilter}
                    onValueChange={(value) => updateFilters({ category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {categoryFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {categoryFilter}
                    <button
                      onClick={() => updateFilters({ category: 'all' })}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <button
                      onClick={() => {
                        setLocalSearchQuery('');
                        updateFilters({ search: '' });
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {hasActiveFilters
                ? 'No products match your filters. Try adjusting your search criteria.'
                : 'No products found.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <PreviewProductLibraryCard
              key={product.id}
              product={product}
              purchasedDate={product.purchasedDate}
            />
          ))}
        </div>
      )}

      {/* Results count */}
      {filteredProducts.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredProducts.length} of {initialProducts.length} products
        </p>
      )}
    </div>
  );
}

/**
 * Preview version of ProductLibraryCard that links to preview pages
 */
function PreviewProductLibraryCard({ product, purchasedDate }: { product: ProductWithPurchaseDate; purchasedDate: string }) {
  const purchaseDate = purchasedDate
    ? format(new Date(purchasedDate), 'MMM d, yyyy')
    : 'N/A';

  const images = product.images as string[] | null | undefined;
  const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
  const productImage = product.package_image || firstImage || '/placeholder-product.png';
  const productSlug = product.slug || product.id;

  return (
    <Link href={`/preview/library/${productSlug}`}>
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
