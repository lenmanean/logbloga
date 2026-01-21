'use client';

import { useState, useMemo } from 'react';
import type { FAQ } from '@/lib/resources/types';
import { FAQAccordion } from './faq-accordion';
import { ResourceSearch } from './resource-search';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { searchFAQs, getFAQsByCategory } from '@/lib/resources/faq';
import { X, Mail } from 'lucide-react';

interface FAQPageClientProps {
  initialFAQs: FAQ[];
  categories: string[];
}

export function FAQPageClient({ initialFAQs, categories }: FAQPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const filteredFAQs = useMemo(() => {
    let filtered = initialFAQs;

    // Filter by category
    if (selectedCategory) {
      filtered = getFAQsByCategory(selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const searchResults = searchFAQs(searchQuery);
      filtered = filtered.filter(faq =>
        searchResults.some(result => result.id === faq.id)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory, initialFAQs]);

  const faqsByCategory = useMemo(() => {
    const grouped: Record<string, FAQ[]> = {};
    filteredFAQs.forEach(faq => {
      if (!grouped[faq.category]) {
        grouped[faq.category] = [];
      }
      grouped[faq.category].push(faq);
    });
    return grouped;
  }, [filteredFAQs]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(undefined);
  };

  const hasActiveFilters = searchQuery || selectedCategory;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our products, services, and AI implementation.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <ResourceSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search FAQs..."
          />
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Category:</span>
              <Button
                variant={!selectedCategory ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(undefined)}
                className={!selectedCategory ? 'bg-red-500 text-white border-red-500' : ''}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'bg-red-500 text-white border-red-500' : ''}
                >
                  {category}
                </Button>
              ))}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="ml-auto"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredFAQs.length} of {initialFAQs.length} {initialFAQs.length === 1 ? 'question' : 'questions'}
            {selectedCategory && ` in "${selectedCategory}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* FAQ Content */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-6">
            {selectedCategory ? (
              // Show single category
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">{selectedCategory}</h2>
                  <FAQAccordion 
                    faqs={filteredFAQs} 
                    searchQuery={searchQuery}
                  />
                </CardContent>
              </Card>
            ) : (
              // Show all categories in tabs
              <Tabs defaultValue={categories[0]} className="w-full">
                <TabsList className="mb-6">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category} ({faqsByCategory[category]?.length || 0})
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map((category) => (
                  <TabsContent key={category} value={category}>
                    <Card>
                      <CardContent className="p-6">
                        <FAQAccordion 
                          faqs={faqsByCategory[category] || []} 
                          searchQuery={searchQuery}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No FAQs found matching your search.
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

        {/* Contact Section */}
        <Card className="mt-12">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground mb-4">
              Can't find the answer you're looking for? Please contact our support team.
            </p>
            <Button asChild>
              <a href="mailto:support@logbloga.com">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
