import { ReactNode } from 'react';
import { AccountTabs } from '@/components/account/account-tabs';
import { requireAuth } from '@/lib/auth/utils';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Account | Logbloga',
  description: 'Manage your account settings, orders, and products',
};

interface AccountLayoutProps {
  children: ReactNode;
}

export default async function AccountLayout({ children }: AccountLayoutProps) {
  // Ensure user is authenticated
  await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Account Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">
            Manage your account settings, orders, and purchased products
          </p>
        </div>

        {/* Tabs Navigation */}
        <AccountTabs />

        {/* Tab Content */}
        <div className="mt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
