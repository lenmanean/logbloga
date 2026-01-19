import { requireAdmin } from '@/lib/admin/permissions';
import { getCustomerByIdAdmin, getCustomerStats } from '@/lib/admin/customers';
import { notFound } from 'next/navigation';
import { CustomerDetails } from '@/components/admin/customer-details';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Customer Details | Admin Dashboard | LogBloga',
  description: 'Customer details and management',
};

interface CustomerDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCustomerDetailsPage({ params }: CustomerDetailsPageProps) {
  await requireAdmin();

  const { id } = await params;
  const [customer, stats] = await Promise.all([
    getCustomerByIdAdmin(id),
    getCustomerStats(id),
  ]);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/customers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mt-2">Customer Details</h1>
      </div>

      <CustomerDetails customer={customer} stats={stats} />
    </div>
  );
}

