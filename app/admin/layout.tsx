import { requireAdmin } from '@/lib/admin/permissions';
import { AdminNav } from '@/components/admin/admin-nav';
import { AdminHeader } from '@/components/admin/admin-header';

export const metadata = {
  title: 'Admin Dashboard | LogBloga',
  description: 'Admin dashboard for managing the store',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container flex gap-6 px-4 py-6">
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <div className="sticky top-20">
            <AdminNav />
          </div>
        </aside>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

