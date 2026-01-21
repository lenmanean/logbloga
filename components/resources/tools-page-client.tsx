'use client';

import { useState, useMemo } from 'react';
import type { Tool } from '@/lib/resources/types';
import { ToolCard } from './tool-card';
import { ResourceFilters } from './resource-filters';
import { ResourceSearch } from './resource-search';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { searchTools, getToolsByType, getToolsByCategory } from '@/lib/resources/tools';
import { X } from 'lucide-react';

interface ToolsPageClientProps {
  initialTools: Tool[];
  categories: string[];
  tags: string[];
}

export function ToolsPageClient({ initialTools, categories, tags }: ToolsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'tool' | 'template'>('all');

  const filteredTools = useMemo(() => {
    let filtered = initialTools;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = getToolsByType(selectedType);
    }

    // Filter by category
    if (selectedCategory) {
      const categoryTools = getToolsByCategory(selectedCategory);
      filtered = filtered.filter(tool =>
        categoryTools.some(ct => ct.id === tool.id)
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(tool =>
        selectedTags.some(tag => tool.tags.includes(tag))
      );
    }

    // Filter by search
    if (searchQuery) {
      const searchResults = searchTools(searchQuery);
      filtered = filtered.filter(tool =>
        searchResults.some(result => result.id === tool.id)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedTags, selectedType, initialTools]);

  const tools = filteredTools.filter(t => t.type === 'tool');
  const templates = filteredTools.filter(t => t.type === 'template');

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
    setSelectedType('all');
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTags.length > 0 || selectedType !== 'all';

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Tools & Templates
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready-to-use templates, tools, and resources to accelerate your AI-powered projects.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <ResourceSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tools and templates..."
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

          {/* Type Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Type:</span>
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
              className={selectedType === 'all' ? 'bg-red-500 text-white border-red-500' : ''}
            >
              All
            </Button>
            <Button
              variant={selectedType === 'tool' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('tool')}
              className={selectedType === 'tool' ? 'bg-red-500 text-white border-red-500' : ''}
            >
              Tools
            </Button>
            <Button
              variant={selectedType === 'template' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('template')}
              className={selectedType === 'template' ? 'bg-red-500 text-white border-red-500' : ''}
            >
              Templates
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTools.length} of {initialTools.length} {initialTools.length === 1 ? 'item' : 'items'}
            {selectedCategory && ` in "${selectedCategory}"`}
            {selectedType !== 'all' && ` (${selectedType}s only)`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Tools & Templates Tabs */}
        {filteredTools.length > 0 ? (
          <Tabs defaultValue={selectedType === 'all' ? 'all' : selectedType} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all" onClick={() => setSelectedType('all')}>
                All ({filteredTools.length})
              </TabsTrigger>
              <TabsTrigger value="tool" onClick={() => setSelectedType('tool')}>
                Tools ({tools.length})
              </TabsTrigger>
              <TabsTrigger value="template" onClick={() => setSelectedType('template')}>
                Templates ({templates.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tool">
              {tools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No tools found matching your filters.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="template">
              {templates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No templates found matching your filters.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No tools or templates found.
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
