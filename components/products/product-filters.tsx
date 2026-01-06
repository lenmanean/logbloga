"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface ProductFiltersProps {
  categories: string[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState<number[]>([
    0,
    parseInt(searchParams.get("maxPrice") || "10000") / 100,
  ]);

  const selectedCategory = searchParams.get("category") || null;
  const sortBy = searchParams.get("sort") || "newest";

  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    updateSearchParams("search", value || null);
  };

  const handleCategoryChange = (category: string | null) => {
    updateSearchParams("category", category);
  };

  const handleSortChange = (sort: string) => {
    updateSearchParams("sort", sort);
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    const params = new URLSearchParams(searchParams.toString());
    if (values[1] < 10000) {
      params.set("maxPrice", String(values[1] * 100));
    } else {
      params.delete("maxPrice");
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setPriceRange([0, 10000]);
    router.push("/products");
  };

  const hasActiveFilters =
    selectedCategory || search || priceRange[1] < 10000 || sortBy !== "newest";

  return (
    <div className="space-y-6 border-b pb-6">
      {/* Search */}
      <div>
        <SearchInput
          placeholder="Search products..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          onClear={() => handleSearch("")}
        />
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!selectedCategory ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold mb-3">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </h3>
        <Slider
          value={priceRange}
          onValueChange={handlePriceChange}
          max={10000}
          min={0}
          step={10}
          className="w-full"
        />
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Sort By</h3>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

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

