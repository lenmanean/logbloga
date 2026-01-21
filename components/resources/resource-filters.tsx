'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ResourceFiltersProps {
  categories: string[];
  tags?: string[];
  selectedCategory?: string;
  selectedTags?: string[];
  onCategoryChange?: (category: string | undefined) => void;
  onTagChange?: (tag: string) => void;
  onClearFilters?: () => void;
  className?: string;
}

export function ResourceFilters({
  categories,
  tags,
  selectedCategory,
  selectedTags = [],
  onCategoryChange,
  onTagChange,
  onClearFilters,
  className
}: ResourceFiltersProps) {
  const hasActiveFilters = selectedCategory || selectedTags.length > 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Category Filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Category:</span>
          <Badge
            variant={!selectedCategory ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-colors',
              !selectedCategory && 'bg-red-500 text-white border-red-500'
            )}
            onClick={() => onCategoryChange?.(undefined)}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-colors',
                selectedCategory === category && 'bg-red-500 text-white border-red-500'
              )}
              onClick={() => onCategoryChange?.(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}

      {/* Tag Filters */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Tags:</span>
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <Badge
                key={tag}
                variant={isSelected ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer transition-colors',
                  isSelected && 'bg-red-500 text-white border-red-500'
                )}
                onClick={() => onTagChange?.(tag)}
              >
                {tag}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && onClearFilters && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="rounded-full"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
