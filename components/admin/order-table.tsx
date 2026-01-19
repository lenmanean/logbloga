'use client';

import { DataTable, Column } from './data-table';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import type { Order, OrderStatus } from '@/lib/types/database';

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const columns: Column<Order>[] = [
    {
      id: 'order_number',
      header: 'Order Number',
      accessor: (order) => (
        <Link
          href={`/admin/orders/${order.id}`}
          className="font-medium hover:text-primary transition-colors"
        >
          {order.order_number}
        </Link>
      ),
      sortable: true,
    },
    {
      id: 'customer_email',
      header: 'Customer',
      accessor: (order) => (
        <span className="text-sm">{order.customer_email || 'N/A'}</span>
      ),
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (order) => <OrderStatusBadge status={(order.status || 'pending') as OrderStatus} />,
      sortable: true,
    },
    {
      id: 'total_amount',
      header: 'Total',
      accessor: (order) => {
        const amount = typeof order.total_amount === 'number'
          ? order.total_amount
          : parseFloat(String(order.total_amount || 0));
        return (
          <span className="font-semibold">
            ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      },
      sortable: true,
    },
    {
      id: 'created_at',
      header: 'Date',
      accessor: (order) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(order.created_at || ''), { addSuffix: true })}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      onRowClick={(order) => {
        window.location.href = `/admin/orders/${order.id}`;
      }}
      emptyMessage="No orders found"
    />
  );
}

