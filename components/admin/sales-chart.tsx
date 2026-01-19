'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export interface SalesChartData {
  period: string;
  revenue: number;
  orders: number;
}

interface SalesChartProps {
  data: SalesChartData[];
  isLoading?: boolean;
  period?: 'daily' | 'weekly' | 'monthly';
}

export function SalesChart({ data, isLoading = false, period = 'daily' }: SalesChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Revenue and orders over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Revenue and orders over time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-8">No sales data available</p>
        </CardContent>
      </Card>
    );
  }

  // Simple bar chart representation (can be enhanced with recharts later)
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const maxOrders = Math.max(...data.map(d => d.orders), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Revenue and orders over time ({period})</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => {
            const revenuePercentage = (item.revenue / maxRevenue) * 100;
            const ordersPercentage = (item.orders / maxOrders) * 100;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.period}</span>
                  <div className="flex gap-4">
                    <span className="text-muted-foreground">
                      ${item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-muted-foreground">
                      {item.orders} orders
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${revenuePercentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-right">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full"
                        style={{ width: `${ordersPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-right">Orders</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

