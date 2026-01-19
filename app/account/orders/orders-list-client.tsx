'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { OrderCard } from '@/components/orders/order-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import type { Order, OrderStatus } from '@/lib/types/database';
import { format, subDays, subMonths, subYears } from 'date-fns';

interface OrdersListClientProps {
  orders: Order[];
}

type DateFilter = 'all' | '30days' | '3months' | '1year';

export function OrdersListClient({ orders: initialOrders }: OrdersListClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial filter values from URL
  const statusFilter = (searchParams.get('status') as OrderStatus | null) || 'all';
  const dateFilter = (searchParams.get('date') as DateFilter | null) || 'all';
  const searchQuery = searchParams.get('search') || '';

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Update URL when filters change
  const updateFilters = (updates: {
    status?: OrderStatus | 'all';
    date?: DateFilter;
    search?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.status && updates.status !== 'all') {
      params.set('status', updates.status);
    } else {
      params.delete('status');
    }

    if (updates.date && updates.date !== 'all') {
      params.set('date', updates.date);
    } else {
      params.delete('date');
    }

    if (updates.search) {
      params.set('search', updates.search);
    } else {
      params.delete('search');
    }

    router.push(`/account/orders?${params.toString()}`);
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    let filtered = [...initialOrders];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by date range
    if (dateFilter !== 'all') {
      const now = new Date();
      let cutoffDate: Date;

      switch (dateFilter) {
        case '30days':
          cutoffDate = subDays(now, 30);
          break;
        case '3months':
          cutoffDate = subMonths(now, 3);
          break;
        case '1year':
          cutoffDate = subYears(now, 1);
          break;
        default:
          cutoffDate = new Date(0); // Beginning of time
      }

      filtered = filtered.filter((order) => {
        if (!order.created_at) return false;
        const orderDate = new Date(order.created_at);
        return orderDate >= cutoffDate;
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        const orderNumber = order.order_number?.toLowerCase() || '';
        return orderNumber.includes(query);
      });
    }

    return filtered;
  }, [initialOrders, statusFilter, dateFilter, searchQuery]);

  const hasActiveFilters = statusFilter !== 'all' || dateFilter !== 'all' || searchQuery !== '';

  const clearFilters = () => {
    setLocalSearchQuery('');
    router.push('/account/orders');
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
                placeholder="Search by order number..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </form>

            {/* Status and Date Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    updateFilters({ status: value as OrderStatus | 'all' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <Select
                  value={dateFilter}
                  onValueChange={(value) =>
                    updateFilters({ date: value as DateFilter })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
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
                {dateFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Date: {dateFilter === '30days' ? 'Last 30 Days' : dateFilter === '3months' ? 'Last 3 Months' : 'Last Year'}
                    <button
                      onClick={() => updateFilters({ date: 'all' })}
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

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {hasActiveFilters
                ? 'No orders match your filters. Try adjusting your search criteria.'
                : 'No orders found.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Results count */}
      {filteredOrders.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredOrders.length} of {initialOrders.length} orders
        </p>
      )}
    </div>
  );
}

