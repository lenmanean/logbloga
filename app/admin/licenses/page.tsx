import { requireAdmin } from '@/lib/admin/permissions';
import { getAllLicenses } from '@/lib/admin/licenses';
import { LicenseTable } from '@/components/admin/license-table';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Licenses | Admin Dashboard | LogBloga',
  description: 'Manage licenses',
};

export default async function AdminLicensesPage() {
  await requireAdmin();

  const licenses = await getAllLicenses({});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Licenses</h1>
        <p className="text-muted-foreground mt-1">
          Manage product licenses
        </p>
      </div>

      <LicenseTable licenses={licenses} />
    </div>
  );
}

