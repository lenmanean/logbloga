'use client';

import { useState, useMemo } from 'react';
import type { Guide } from '@/lib/resources/types';
import { ResourceCard } from './resource-card';
import { ResourceSearch } from './resource-search';
import { searchGuides } from '@/lib/resources/guides';

interface GuidesPageClientProps {
  initialGuides: Guide[];
  categories?: string[];
  tags?: string[];
}

export function GuidesPageClient({ initialGuides }: GuidesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = useMemo(() => {
    // Filter by search only
    if (searchQuery) {
      const searchResults = searchGuides(searchQuery);
      return initialGuides.filter(guide =>
        searchResults.some(result => result.id === guide.id)
      );
    }

    return initialGuides;
  }, [searchQuery, initialGuides]);

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

        {/* Results Count */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredGuides.length} of {initialGuides.length} {initialGuides.length === 1 ? 'guide' : 'guides'}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        )}

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
              {searchQuery ? 'No guides found matching your search.' : 'No guides available at this time.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
