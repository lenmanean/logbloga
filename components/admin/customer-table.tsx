'use client';

import { DataTable, Column } from './data-table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Profile } from '@/lib/types/database';

interface CustomerTableProps {
  customers: Profile[];
}

export function CustomerTable({ customers }: CustomerTableProps) {
  const columns: Column<Profile>[] = [
    {
      id: 'email',
      header: 'Email',
      accessor: (customer) => (
        <Link
          href={`/admin/customers/${customer.id}`}
          className="font-medium hover:text-primary transition-colors"
        >
          {customer.email}
        </Link>
      ),
      sortable: true,
    },
    {
      id: 'full_name',
      header: 'Name',
      accessor: (customer) => (
        <span>{customer.full_name || 'N/A'}</span>
      ),
      sortable: true,
    },
    {
      id: 'role',
      header: 'Role',
      accessor: (customer) => {
        const role = (customer as any).role || 'user';
        return (
          <Badge variant={role === 'admin' ? 'default' : 'outline'}>
            {role}
          </Badge>
        );
      },
      sortable: true,
    },
    {
      id: 'created_at',
      header: 'Joined',
      accessor: (customer) => (
        <span className="text-sm text-muted-foreground">
          {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <DataTable
      data={customers}
      columns={columns}
      onRowClick={(customer) => {
        window.location.href = `/admin/customers/${customer.id}`;
      }}
      emptyMessage="No customers found"
    />
  );
}

