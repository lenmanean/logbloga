import { requireAdmin } from '@/lib/admin/permissions';
import { getAllProductsAdmin } from '@/lib/admin/products';
import { ProductTable } from '@/components/admin/product-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Products | Admin Dashboard | LogBloga',
  description: 'Manage products',
};

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await getAllProductsAdmin({});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Product
          </Button>
        </Link>
      </div>

      <ProductTable products={products} />
    </div>
  );
}

