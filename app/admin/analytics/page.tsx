import { requireAdmin } from '@/lib/admin/permissions';
import { getRevenueMetrics, getOrderTrends, getProductPerformance, getCustomerMetrics } from '@/lib/admin/analytics';
import { SalesChart } from '@/components/admin/sales-chart';
import { TopProducts } from '@/components/admin/top-products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Analytics | Admin Dashboard | LogBloga',
  description: 'Store analytics and reports',
};

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  const [revenueMetrics, orderTrends, productPerformance, customerMetrics] = await Promise.all([
    getRevenueMetrics(),
    getOrderTrends('daily', 30),
    getProductPerformance(),
    getCustomerMetrics(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Store performance and insights
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${revenueMetrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueMetrics.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerMetrics.totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${revenueMetrics.averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SalesChart data={orderTrends.daily.slice(-7)} period="daily" />
        <TopProducts products={productPerformance.topProducts} limit={10} />
      </div>
    </div>
  );
}

