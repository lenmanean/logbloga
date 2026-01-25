'use client';

import { useState, useMemo } from 'react';
import type { FAQ } from '@/lib/resources/types';
import { FAQAccordion } from './faq-accordion';
import { ResourceSearch } from './resource-search';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { searchFAQs } from '@/lib/resources/faq';
import { Mail } from 'lucide-react';

interface FAQPageClientProps {
  initialFAQs: FAQ[];
}

export function FAQPageClient({ initialFAQs }: FAQPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = useMemo(() => {
    // Filter by search only
    if (searchQuery) {
      const searchResults = searchFAQs(searchQuery);
      return initialFAQs.filter(faq =>
        searchResults.some(result => result.id === faq.id)
      );
    }

    return initialFAQs;
  }, [searchQuery, initialFAQs]);

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

        {/* Results Count */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredFAQs.length} of {initialFAQs.length} {initialFAQs.length === 1 ? 'question' : 'questions'}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* FAQ Content */}
        {filteredFAQs.length > 0 ? (
          <Card>
            <CardContent className="p-6">
              <FAQAccordion 
                faqs={filteredFAQs} 
                searchQuery={searchQuery}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              {searchQuery ? 'No FAQs found matching your search.' : 'No FAQs available.'}
            </p>
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
