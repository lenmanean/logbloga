'use client';

import { DataTable, Column } from './data-table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Coupon } from '@/lib/types/database';

interface CouponTableProps {
  coupons: Coupon[];
}

export function CouponTable({ coupons }: CouponTableProps) {
  const columns: Column<Coupon>[] = [
    {
      id: 'code',
      header: 'Code',
      accessor: (coupon) => (
        <Link
          href={`/admin/coupons/${coupon.id}`}
          className="font-mono font-medium hover:text-primary transition-colors"
        >
          {coupon.code}
        </Link>
      ),
      sortable: true,
    },
    {
      id: 'type',
      header: 'Type',
      accessor: (coupon) => (
        <Badge variant="outline">{coupon.type}</Badge>
      ),
      sortable: true,
    },
    {
      id: 'value',
      header: 'Value',
      accessor: (coupon) => {
        const value = typeof coupon.value === 'number' ? coupon.value : parseFloat(String(coupon.value || 0));
        return (
          <span className="font-semibold">
            {coupon.type === 'percentage' ? `${value}%` : `$${value.toFixed(2)}`}
          </span>
        );
      },
      sortable: true,
    },
    {
      id: 'active',
      header: 'Status',
      accessor: (coupon) => (
        <Badge variant={coupon.active ? 'default' : 'secondary'}>
          {coupon.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: 'usage_count',
      header: 'Usage',
      accessor: (coupon) => {
        const count = coupon.usage_count || 0;
        const limit = coupon.usage_limit;
        return (
          <span className="text-sm">
            {count} {limit ? `/ ${limit}` : ''}
          </span>
        );
      },
      sortable: true,
    },
  ];

  return (
    <DataTable
      data={coupons}
      columns={columns}
      onRowClick={(coupon) => {
        window.location.href = `/admin/coupons/${coupon.id}`;
      }}
      emptyMessage="No coupons found"
    />
  );
}

