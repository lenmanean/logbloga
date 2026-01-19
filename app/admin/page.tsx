import { requireAdmin } from '@/lib/admin/permissions';
import { getAllOrders } from '@/lib/admin/orders';
import { getAllProductsAdmin } from '@/lib/admin/products';
import { getAllCustomers } from '@/lib/admin/customers';
import { getRevenueMetrics, getProductPerformance } from '@/lib/admin/analytics';
import { StatsCards } from '@/components/admin/stats-cards';
import { RecentOrdersTable } from '@/components/admin/recent-orders-table';
import { SalesChart } from '@/components/admin/sales-chart';
import { TopProducts } from '@/components/admin/top-products';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Dashboard | LogBloga',
  description: 'Admin dashboard overview',
};

export default async function AdminDashboardPage() {
  await requireAdmin();

  // Fetch all dashboard data in parallel
  const [orders, products, customers, revenueMetrics, productPerformance] = await Promise.all([
    getAllOrders({}),
    getAllProductsAdmin({ active: true }),
    getAllCustomers({}),
    getRevenueMetrics(),
    getProductPerformance(),
  ]);

  const totalRevenue = revenueMetrics.totalRevenue;
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;

  // Get recent orders (last 10)
  const recentOrders = orders.slice(0, 10);

  // Get sales chart data (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentRevenueData = revenueMetrics.revenueByPeriod
    .filter(item => new Date(item.period) >= sevenDaysAgo)
    .slice(-7);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your store's performance
        </p>
      </div>

      {/* Statistics Cards */}
      <StatsCards
        stats={{
          totalOrders,
          totalRevenue,
          totalCustomers,
          totalProducts,
        }}
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <RecentOrdersTable orders={recentOrders} limit={10} />
          <TopProducts products={productPerformance.topProducts} limit={5} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <SalesChart data={recentRevenueData} period="daily" />
        </div>
      </div>
    </div>
  );
}

