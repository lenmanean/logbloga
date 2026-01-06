"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Calendar } from "lucide-react";

interface BlogFiltersProps {
  tags: string[];
  authors?: string[];
}

export function BlogFilters({ tags, authors = [] }: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const selectedTag = searchParams.get("tag") || null;
  const selectedAuthor = searchParams.get("author") || null;
  const dateFilter = searchParams.get("date") || "all";

  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/blog?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    updateSearchParams("search", value || null);
  };

  const handleTagChange = (tag: string | null) => {
    updateSearchParams("tag", tag);
  };

  const handleAuthorChange = (author: string | null) => {
    updateSearchParams("author", author);
  };

  const handleDateChange = (date: string) => {
    updateSearchParams("date", date);
  };

  const clearFilters = () => {
    setSearch("");
    router.push("/blog");
  };

  const hasActiveFilters =
    selectedTag || selectedAuthor || search || dateFilter !== "all";

  const getDateRange = (filter: string) => {
    const now = new Date();
    switch (filter) {
      case "week":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "month":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case "year":
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 border-b pb-6">
      {/* Search */}
      <div>
        <SearchInput
          placeholder="Search blog posts..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          onClear={() => handleSearch("")}
        />
      </div>

      {/* Date Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Date Range
        </h3>
        <Select value={dateFilter} onValueChange={handleDateChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!selectedTag ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagChange(null)}
            >
              All
            </Button>
            {tags.slice(0, 10).map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagChange(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Author Filter */}
      {authors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">Author</h3>
          <Select
            value={selectedAuthor || "all"}
            onValueChange={(value) =>
              handleAuthorChange(value === "all" ? null : value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authors</SelectItem>
              {authors.map((author) => (
                <SelectItem key={author} value={author}>
                  {author}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}

