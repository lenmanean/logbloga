'use client';

import { useState, useMemo } from 'react';
import type { CaseStudy } from '@/lib/resources/types';
import { ResourceCard } from './resource-card';
import { ResourceFilters } from './resource-filters';
import { ResourceSearch } from './resource-search';
import { Button } from '@/components/ui/button';
import { searchCaseStudies, getCaseStudiesByCategory, getCaseStudiesByIndustry } from '@/lib/resources/case-studies';
import { X } from 'lucide-react';

interface CaseStudiesPageClientProps {
  initialCaseStudies: CaseStudy[];
  categories: string[];
  industries: string[];
  tags: string[];
}

export function CaseStudiesPageClient({ 
  initialCaseStudies, 
  categories, 
  industries,
  tags 
}: CaseStudiesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedIndustry, setSelectedIndustry] = useState<string | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredCaseStudies = useMemo(() => {
    let filtered = initialCaseStudies;

    // Filter by category
    if (selectedCategory) {
      filtered = getCaseStudiesByCategory(selectedCategory);
    }

    // Filter by industry
    if (selectedIndustry) {
      filtered = getCaseStudiesByIndustry(selectedIndustry);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(study =>
        selectedTags.some(tag => study.tags.includes(tag))
      );
    }

    // Filter by search
    if (searchQuery) {
      const searchResults = searchCaseStudies(searchQuery);
      filtered = filtered.filter(study =>
        searchResults.some(result => result.id === study.id)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedIndustry, selectedTags, initialCaseStudies]);

  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category);
  };

  const handleIndustryChange = (industry: string | undefined) => {
    setSelectedIndustry(industry);
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
    setSelectedIndustry(undefined);
    setSelectedTags([]);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedIndustry || selectedTags.length > 0;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Case Studies
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-world examples and success stories from businesses and individuals using AI to USD products.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <ResourceSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search case studies..."
          />
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <ResourceFilters
            categories={categories}
            tags={tags}
            selectedCategory={selectedCategory}
            selectedTags={selectedTags}
            onCategoryChange={handleCategoryChange}
            onTagChange={handleTagToggle}
            onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
          />
          
          {/* Industry Filter */}
          {industries.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Industry:</span>
              <Button
                variant={!selectedIndustry ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleIndustryChange(undefined)}
                className={!selectedIndustry ? 'bg-red-500 text-white border-red-500' : ''}
              >
                All
              </Button>
              {industries.map((industry) => (
                <Button
                  key={industry}
                  variant={selectedIndustry === industry ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleIndustryChange(industry)}
                  className={selectedIndustry === industry ? 'bg-red-500 text-white border-red-500' : ''}
                >
                  {industry}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCaseStudies.length} of {initialCaseStudies.length} {initialCaseStudies.length === 1 ? 'case study' : 'case studies'}
            {selectedCategory && ` in "${selectedCategory}"`}
            {selectedIndustry && ` in "${selectedIndustry}" industry`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Case Studies Grid */}
        {filteredCaseStudies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCaseStudies.map((study) => (
              <ResourceCard key={study.id} resource={study} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No case studies found.
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
