'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResourceSearch } from './resource-search';
import { searchAllResources, getResourceUrl, getResourceTypeLabel } from '@/lib/resources';
import type { SearchResult } from '@/lib/resources/types';
import { FileText, TrendingUp, Wrench, HelpCircle } from 'lucide-react';

interface UnifiedSearchProps {
  className?: string;
  maxResults?: number;
}

const typeIcons = {
  'guide': FileText,
  'case-study': TrendingUp,
  'tool': Wrench,
  'faq': HelpCircle,
};

export function UnifiedSearch({ className, maxResults = 10 }: UnifiedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const allResults = searchAllResources(searchQuery);
    return allResults.slice(0, maxResults);
  }, [searchQuery, maxResults]);

  const groupedResults = useMemo(() => {
    const grouped: Record<string, SearchResult[]> = {
      'guide': [],
      'case-study': [],
      'tool': [],
      'faq': [],
    };

    results.forEach(result => {
      grouped[result.type].push(result);
    });

    return grouped;
  }, [results]);

  if (!searchQuery.trim()) {
    return (
      <div className={className}>
        <ResourceSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search all resources..."
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <ResourceSearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search all resources..."
      />

      {results.length > 0 ? (
        <div className="mt-4 space-y-4">
          {Object.entries(groupedResults).map(([type, typeResults]) => {
            if (typeResults.length === 0) return null;

            const Icon = typeIcons[type as keyof typeof typeIcons];
            const typeLabel = getResourceTypeLabel(type as SearchResult['type']);

            return (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5" />
                    {typeLabel} ({typeResults.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {typeResults.map((result) => {
                      const resource = result.resource;
                      // FAQs don't have slug, use id instead
                      const identifier = 'slug' in resource ? resource.slug : resource.id;
                      const href = getResourceUrl(result.type, identifier);

                      return (
                        <Link
                          key={resource.id || ('slug' in resource ? resource.slug : resource.id)}
                          href={href}
                          className="block p-3 rounded-lg border hover:bg-muted transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">
                                {'title' in resource ? resource.title : resource.question}
                              </h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {'description' in resource ? resource.description : resource.answer.substring(0, 100) + '...'}
                              </p>
                              {resource.tags && resource.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {resource.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            {result.relevanceScore && result.relevanceScore > 5 && (
                              <Badge variant="secondary" className="text-xs">
                                High Match
                              </Badge>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="mt-4">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No resources found matching &quot;{searchQuery}&quot;
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
