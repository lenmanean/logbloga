'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/ui/product-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { sampleProducts, Product, ProductCategory } from '@/lib/products';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });

  const filteredProducts = useMemo(() => {
    return sampleProducts.filter((product) => {
      // Search filter
      const matchesSearch = 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      // Difficulty filter
      const matchesDifficulty = selectedDifficulty === 'all' || product.difficulty === selectedDifficulty;

      // Price filter
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesPrice;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, priceRange]);

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
    setSelectedDifficulty('all');
    setPriceRange({ min: 0, max: 1000 });
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all' || priceRange.min > 0 || priceRange.max < 1000;

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
            Showing {filteredProducts.length} of {sampleProducts.length} products
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

