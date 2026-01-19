'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductLibraryCard } from '@/components/library/product-library-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import type { LicenseWithProduct } from '@/lib/types/database';

interface LibraryClientProps {
  licenses: LicenseWithProduct[];
}

export function LibraryClient({ licenses: initialLicenses }: LibraryClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial filter values from URL
  const categoryFilter = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialLicenses.forEach((license) => {
      if (license.product?.category) {
        cats.add(license.product.category);
      }
    });
    return Array.from(cats).sort();
  }, [initialLicenses]);

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

    router.push(`/account/library?${params.toString()}`);
  };

  // Filter licenses
  const filteredLicenses = useMemo(() => {
    let filtered = [...initialLicenses];

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (license) => license.product?.category === categoryFilter
      );
    }

    // Filter by search query (product name)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((license) => {
        const productName = license.product?.title?.toLowerCase() || '';
        return productName.includes(query);
      });
    }

    return filtered;
  }, [initialLicenses, categoryFilter, searchQuery]);

  const hasActiveFilters = categoryFilter !== 'all' || searchQuery !== '';

  const clearFilters = () => {
    setLocalSearchQuery('');
    router.push('/account/library');
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
      {filteredLicenses.length === 0 ? (
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
          {filteredLicenses.map((license) => (
            <ProductLibraryCard
              key={license.id}
              license={license}
            />
          ))}
        </div>
      )}

      {/* Results count */}
      {filteredLicenses.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredLicenses.length} of {initialLicenses.length} products
        </p>
      )}
    </div>
  );
}
