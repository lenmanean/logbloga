'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'date' | 'text';
  options?: FilterOption[];
  placeholder?: string;
}

interface FilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  onClear: () => void;
  hasActiveFilters?: boolean;
}

export function FilterPanel({
  filters,
  values,
  onChange,
  onClear,
  hasActiveFilters = false,
}: FilterPanelProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Filters</CardTitle>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {filters.map((filter) => (
          <div key={filter.id} className="space-y-2">
            <Label htmlFor={filter.id}>{filter.label}</Label>
            {filter.type === 'select' && filter.options ? (
              <Select
                value={values[filter.id] || ''}
                onValueChange={(value) => onChange(filter.id, value)}
              >
                <SelectTrigger id={filter.id}>
                  <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : filter.type === 'date' ? (
              <Input
                id={filter.id}
                type="date"
                value={values[filter.id] || ''}
                onChange={(e) => onChange(filter.id, e.target.value)}
              />
            ) : (
              <Input
                id={filter.id}
                type="text"
                placeholder={filter.placeholder}
                value={values[filter.id] || ''}
                onChange={(e) => onChange(filter.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

