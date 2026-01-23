'use client';

import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '@/components/ui/product-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product, ProductCategory } from '@/lib/products';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product as DbProduct } from '@/lib/types/database';

interface ProductsPageClientProps {
  initialProducts?: DbProduct[];
}

export default function ProductsPage({ initialProducts = [] }: ProductsPageClientProps) {
  const [products, setProducts] = useState<DbProduct[]>(initialProducts);
  const [loading, setLoading] = useState(!initialProducts.length);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedProductType, setSelectedProductType] = useState<'all' | 'tool' | 'template' | 'strategy' | 'course' | 'individual'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });

  // Fetch products if not provided
  useEffect(() => {
    if (initialProducts.length === 0) {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          setProducts(data.products || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching products:', err);
          setLoading(false);
        });
    }
  }, [initialProducts.length]);

  // Convert DB products to frontend format and filter
  const filteredProducts = useMemo(() => {
    return products
      .filter((dbProduct) => {
        // Only show individual products (not packages)
        if (dbProduct.product_type === 'package') {
          return false;
        }

        // Product type filter
        if (selectedProductType !== 'all') {
          if (dbProduct.product_type !== selectedProductType) {
            return false;
          }
        } else {
          // If "all" is selected, exclude packages
          if (dbProduct.product_type === 'package') {
            return false;
          }
        }

        // Search filter
        const title = (dbProduct.title || dbProduct.name || '').toLowerCase();
        const description = (dbProduct.description || '').toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || 
          title.includes(searchLower) || 
          description.includes(searchLower);

        // Category filter
        const matchesCategory = selectedCategory === 'all' || 
          (dbProduct.category && dbProduct.category === selectedCategory);

        // Difficulty filter
        const matchesDifficulty = selectedDifficulty === 'all' || 
          (dbProduct.difficulty && dbProduct.difficulty === selectedDifficulty);

        // Price filter
        const price = typeof dbProduct.price === 'number' ? dbProduct.price : parseFloat(String(dbProduct.price || 0));
        const matchesPrice = price >= priceRange.min && price <= priceRange.max;

        return matchesSearch && matchesCategory && matchesDifficulty && matchesPrice;
      })
      .map((dbProduct): Product => {
        // Convert DB product to frontend format (client-safe conversion)
        return {
          id: dbProduct.id,
          title: (dbProduct.title || dbProduct.name || 'Untitled Product'),
          description: dbProduct.description || '',
          category: (dbProduct.category || 'web-apps') as ProductCategory,
          price: typeof dbProduct.price === 'number' ? dbProduct.price : parseFloat(String(dbProduct.price || 0)),
          originalPrice: dbProduct.original_price ? (typeof dbProduct.original_price === 'number' ? dbProduct.original_price : parseFloat(String(dbProduct.original_price))) : undefined,
          featured: dbProduct.featured || false,
          image: dbProduct.package_image || (dbProduct.images as any)?.[0] || dbProduct.image_url || undefined,
          difficulty: dbProduct.difficulty as Product['difficulty'] | undefined,
          duration: dbProduct.duration || undefined,
        };
      });
  }, [products, searchQuery, selectedCategory, selectedProductType, selectedDifficulty, priceRange]);

  const categories = [
    { id: 'all' as const, name: 'All Categories' },
    { id: 'web-apps' as const, name: 'Web Apps' },
    { id: 'social-media' as const, name: 'Social Media' },
    { id: 'agency' as const, name: 'Agency' },
    { id: 'freelancing' as const, name: 'Freelancing' },
  ];

  const difficulties = [
    { id: 'all' as const, name: 'All Levels' },
    { id: 'beginner' as const, name: 'Beginner' },
    { id: 'intermediate' as const, name: 'Intermediate' },
    { id: 'advanced' as const, name: 'Advanced' },
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedProductType('all');
    setSelectedDifficulty('all');
    setPriceRange({ min: 0, max: 1000 });
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedProductType !== 'all' || selectedDifficulty !== 'all' || priceRange.min > 0 || priceRange.max < 1000;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            AI to USD Products
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover all our AI-powered products designed to help you transform your skills and start earning.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Product Type:</span>
              <div className="flex flex-wrap gap-2">
                {productTypes.map((type) => (
                  <Badge
                    key={type.id}
                    variant={selectedProductType === type.id ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-colors',
                      selectedProductType === type.id && 'bg-red-500 text-white border-red-500'
                    )}
                    onClick={() => setSelectedProductType(type.id)}
                  >
                    {type.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Category:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-colors',
                      selectedCategory === category.id && 'bg-red-500 text-white border-red-500'
                    )}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Difficulty:</span>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <Badge
                    key={difficulty.id}
                    variant={selectedDifficulty === difficulty.id ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-colors',
                      selectedDifficulty === difficulty.id && 'bg-red-500 text-white border-red-500'
                    )}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                  >
                    {difficulty.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Price Range:</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min || ''}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                  className="w-24"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max || ''}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 1000 })}
                  className="w-24"
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="rounded-full"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.filter(p => p.product_type !== 'package').length} individual products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No products found matching your filters.
            </p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="rounded-full"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}



