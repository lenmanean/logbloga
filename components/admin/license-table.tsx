'use client';

import { DataTable, Column } from './data-table';
import { Badge } from '@/components/ui/badge';
import type { License } from '@/lib/types/database';

interface LicenseTableProps {
  licenses: License[];
}

export function LicenseTable({ licenses }: LicenseTableProps) {
  const columns: Column<License>[] = [
    {
      id: 'license_key',
      header: 'License Key',
      accessor: (license) => (
        <span className="font-mono text-sm">{license.license_key}</span>
      ),
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (license) => {
        const status = license.status || 'inactive';
        const variant = status === 'active' ? 'default' : status === 'revoked' ? 'destructive' : 'secondary';
        return <Badge variant={variant}>{status}</Badge>;
      },
      sortable: true,
    },
    {
      id: 'user_id',
      header: 'User ID',
      accessor: (license) => (
        <span className="font-mono text-xs">{license.user_id.substring(0, 8)}...</span>
      ),
      sortable: true,
    },
    {
      id: 'product_id',
      header: 'Product ID',
      accessor: (license) => (
        <span className="font-mono text-xs">{license.product_id.substring(0, 8)}...</span>
      ),
      sortable: true,
    },
    {
      id: 'created_at',
      header: 'Created',
      accessor: (license) => (
        <span className="text-sm text-muted-foreground">
          {license.created_at ? new Date(license.created_at).toLocaleDateString() : 'N/A'}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <DataTable
      data={licenses}
      columns={columns}
      emptyMessage="No licenses found"
    />
  );
}

