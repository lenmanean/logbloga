'use client';

import { DataTable, Column } from './data-table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Product } from '@/lib/types/database';

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const columns: Column<Product>[] = [
    {
      id: 'title',
      header: 'Product',
      accessor: (product) => (
        <Link
          href={`/admin/products/${product.id}`}
          className="font-medium hover:text-primary transition-colors"
        >
          {product.title || product.name || 'Untitled Product'}
        </Link>
      ),
      sortable: true,
    },
    {
      id: 'category',
      header: 'Category',
      accessor: (product) => (
        <Badge variant="outline">{product.category || 'N/A'}</Badge>
      ),
      sortable: true,
    },
    {
      id: 'price',
      header: 'Price',
      accessor: (product) => {
        const price = typeof product.price === 'number'
          ? product.price
          : parseFloat(String(product.price || 0));
        return (
          <span className="font-semibold">
            ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      },
      sortable: true,
    },
    {
      id: 'active',
      header: 'Status',
      accessor: (product) => (
        <Badge variant={product.active ? 'default' : 'secondary'}>
          {product.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: 'featured',
      header: 'Featured',
      accessor: (product) => (
        <Badge variant={product.featured ? 'default' : 'outline'}>
          {product.featured ? 'Yes' : 'No'}
        </Badge>
      ),
      sortable: true,
    },
  ];

  return (
    <DataTable
      data={products}
      columns={columns}
      onRowClick={(product) => {
        window.location.href = `/admin/products/${product.id}`;
      }}
      emptyMessage="No products found"
    />
  );
}

