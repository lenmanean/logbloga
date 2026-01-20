'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BlogTags } from './blog-tags';
import { Search, X } from 'lucide-react';

interface BlogListingClientProps {
  initialSearch?: string;
  initialTag?: string;
  allTags: string[];
}

export function BlogListingClient({ initialSearch, initialTag, allTags }: BlogListingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }
      params.delete('page'); // Reset to page 1 on new search
      router.push(`/blog?${params.toString()}`);
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('search');
      params.delete('page');
      router.push(`/blog?${params.toString()}`);
    });
  };

  return (
    <div className="mb-8 space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search blog posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
          disabled={isPending}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            disabled={isPending}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3">Filter by Tag:</p>
          <BlogTags tags={allTags} selectedTag={initialTag} />
        </div>
      )}
    </div>
  );
}
