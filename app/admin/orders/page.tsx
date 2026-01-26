import { requireAdmin } from '@/lib/admin/permissions';
import { getAllOrders } from '@/lib/admin/orders';
import { OrderTable } from '@/components/admin/order-table';
import { SearchBar } from '@/components/admin/search-bar';
import { FilterPanel, FilterConfig } from '@/components/admin/filter-panel';
import { Pagination } from '@/components/admin/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Orders | Admin Dashboard | Logbloga',
  description: 'Manage orders',
};

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const itemsPerPage = 20;
  const offset = (page - 1) * itemsPerPage;

  const filters = {
    status: params.status,
    search: params.search,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  };

  const orders = await getAllOrders(filters);
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice(offset, offset + itemsPerPage);

  const filterConfigs: FilterConfig[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { id: 'pending', label: 'Pending', value: 'pending' },
        { id: 'processing', label: 'Processing', value: 'processing' },
        { id: 'completed', label: 'Completed', value: 'completed' },
        { id: 'cancelled', label: 'Cancelled', value: 'cancelled' },
        { id: 'refunded', label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      id: 'dateFrom',
      label: 'From Date',
      type: 'date',
    },
    {
      id: 'dateTo',
      label: 'To Date',
      type: 'date',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track all orders
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <FilterPanel
            filters={filterConfigs}
            values={params}
            onChange={() => {}}
            onClear={() => {}}
            hasActiveFilters={!!(params.status || params.dateFrom || params.dateTo)}
          />
        </div>

        <div className="lg:col-span-3 space-y-4">
          <SearchBar
            placeholder="Search by order number or email..."
            onSearch={() => {}}
            defaultValue={params.search}
          />

          <Suspense fallback={<div>Loading orders...</div>}>
            <OrderTable orders={paginatedOrders} />
          </Suspense>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={() => {}}
              totalItems={orders.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

