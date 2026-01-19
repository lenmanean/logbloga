'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LicenseCard } from '@/components/licenses/license-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import type { LicenseWithProduct, LicenseStatus } from '@/lib/types/database';

interface LicensesListClientProps {
  licenses: LicenseWithProduct[];
}

export function LicensesListClient({ licenses: initialLicenses }: LicensesListClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial filter values from URL
  const statusFilter = (searchParams.get('status') as LicenseStatus | null) || 'all';
  const searchQuery = searchParams.get('search') || '';

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Update URL when filters change
  const updateFilters = (updates: {
    status?: LicenseStatus | 'all';
    search?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.status && updates.status !== 'all') {
      params.set('status', updates.status);
    } else {
      params.delete('status');
    }

    if (updates.search) {
      params.set('search', updates.search);
    } else {
      params.delete('search');
    }

    router.push(`/account/licenses?${params.toString()}`);
  };

  // Filter licenses
  const filteredLicenses = useMemo(() => {
    let filtered = [...initialLicenses];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((license) => license.status === statusFilter);
    }

    // Filter by search query (product name or license key)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((license) => {
        const productName = license.product?.title?.toLowerCase() || '';
        const licenseKey = license.license_key.toLowerCase();
        return productName.includes(query) || licenseKey.includes(query);
      });
    }

    return filtered;
  }, [initialLicenses, statusFilter, searchQuery]);

  const hasActiveFilters = statusFilter !== 'all' || searchQuery !== '';

  const clearFilters = () => {
    setLocalSearchQuery('');
    router.push('/account/licenses');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: localSearchQuery });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <Input
                placeholder="Search by product name or license key..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </form>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    updateFilters({ status: value as LicenseStatus | 'all' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter}
                    <button
                      onClick={() => updateFilters({ status: 'all' })}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <button
                      onClick={() => {
                        setLocalSearchQuery('');
                        updateFilters({ search: '' });
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Licenses List */}
      {filteredLicenses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {hasActiveFilters
                ? 'No licenses match your filters. Try adjusting your search criteria.'
                : 'No licenses found.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLicenses.map((license) => (
            <LicenseCard key={license.id} license={license} />
          ))}
        </div>
      )}

      {/* Results count */}
      {filteredLicenses.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredLicenses.length} of {initialLicenses.length} licenses
        </p>
      )}
    </div>
  );
}
