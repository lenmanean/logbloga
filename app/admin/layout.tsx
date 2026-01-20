import { requireAdmin } from '@/lib/admin/permissions';
import dynamic from 'next/dynamic';

// Lazy load admin components (admin-only, reduce initial bundle)
const AdminNav = dynamic(() => import('@/components/admin/admin-nav').then(mod => ({ default: mod.AdminNav })), {
  loading: () => <div className="w-64 h-96 animate-pulse bg-muted rounded-lg" />,
});

const AdminHeader = dynamic(() => import('@/components/admin/admin-header').then(mod => ({ default: mod.AdminHeader })), {
  loading: () => <div className="h-16 animate-pulse bg-muted" />,
});

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

