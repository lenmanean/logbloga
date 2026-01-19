import { requireAdmin } from '@/lib/admin/permissions';
import { getAllCustomers } from '@/lib/admin/customers';
import { CustomerTable } from '@/components/admin/customer-table';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Customers | Admin Dashboard | LogBloga',
  description: 'Manage customers',
};

export default async function AdminCustomersPage() {
  await requireAdmin();

  const customers = await getAllCustomers({});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground mt-1">
          View and manage customer accounts
        </p>
      </div>

      <CustomerTable customers={customers} />
    </div>
  );
}

