'use client';

import { useState, useMemo } from 'react';
import type { Guide } from '@/lib/resources/types';
import { ResourceCard } from './resource-card';
import { ResourceFilters } from './resource-filters';
import { ResourceSearch } from './resource-search';
import { Button } from '@/components/ui/button';
import { searchGuides, getGuidesByCategory } from '@/lib/resources/guides';
import { X } from 'lucide-react';

interface GuidesPageClientProps {
  initialGuides: Guide[];
  categories: string[];
  tags: string[];
}

export function GuidesPageClient({ initialGuides, categories, tags }: GuidesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredGuides = useMemo(() => {
    let filtered = initialGuides;

    // Filter by category
    if (selectedCategory) {
      filtered = getGuidesByCategory(selectedCategory);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(guide =>
        selectedTags.some(tag => guide.tags.includes(tag))
      );
    }

    // Filter by search
    if (searchQuery) {
      const searchResults = searchGuides(searchQuery);
      filtered = filtered.filter(guide =>
        searchResults.some(result => result.id === guide.id)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedTags, initialGuides]);

  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(undefined);
    setSelectedTags([]);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTags.length > 0;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Guides
          </h1>
          <p className="text-lg text-muted-foreground">
            Step-by-step tutorials and comprehensive guides to help you master AI tools and techniques.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <ResourceSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search guides..."
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ResourceFilters
            categories={categories}
            tags={tags}
            selectedCategory={selectedCategory}
            selectedTags={selectedTags}
            onCategoryChange={handleCategoryChange}
            onTagChange={handleTagToggle}
            onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredGuides.length} of {initialGuides.length} {initialGuides.length === 1 ? 'guide' : 'guides'}
            {selectedCategory && ` in "${selectedCategory}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <ResourceCard key={guide.id} resource={guide} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No guides found.
              {hasActiveFilters && ' Try adjusting your filters.'}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
