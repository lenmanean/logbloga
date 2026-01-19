import { requireAuth } from '@/lib/auth/utils';
import { getAccountStatistics } from '@/lib/db/account-stats';
import { getUserOrders } from '@/lib/db/orders';
import { getUserLicenses } from '@/lib/db/licenses';
import { getUserProfile } from '@/lib/db/profiles';
import { DashboardStats } from '@/components/account/dashboard-stats';
import { RecentOrders } from '@/components/account/recent-orders';
import { ActiveLicenses } from '@/components/account/active-licenses';
import { QuickActions } from '@/components/account/quick-actions';
import { ActivityFeed } from '@/components/account/activity-feed';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Account Dashboard | LogBloga',
  description: 'Your account dashboard',
};

export default async function AccountDashboardPage() {
  const user = await requireAuth();
  const profile = await getUserProfile(user.id);

  // Fetch all dashboard data in parallel
  const [stats, orders, licenses] = await Promise.all([
    getAccountStatistics(user.id),
    getUserOrders(user.id),
    getUserLicenses(user.id),
  ]);

  const userName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const greeting = getGreeting();

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {greeting}, {userName}!
          </h1>
          <p className="text-muted-foreground">
            Welcome to your account dashboard. Here's an overview of your account.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8">
          <DashboardStats
            stats={{
              totalOrders: stats.totalOrders,
              totalSpent: stats.totalSpent,
              activeLicenses: stats.activeLicenses,
              wishlistItems: stats.wishlistItems,
              accountAge: stats.accountAge,
            }}
          />
        </div>

        <Separator className="my-8" />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Orders */}
            <RecentOrders orders={orders} limit={5} />

            {/* Active Licenses */}
            <ActiveLicenses licenses={licenses} limit={5} />

            {/* Activity Feed */}
            <ActivityFeed activities={stats.recentActivity} limit={10} />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * Get time-based greeting
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}
