'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface AdminStatsData {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange?: number; // Percentage change
  ordersChange?: number; // Percentage change
}

interface StatsCardsProps {
  stats: AdminStatsData | null;
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading = false }: StatsCardsProps) {
  const statCards = [
    {
      title: 'Total Revenue',
      value: stats?.totalRevenue || 0,
      icon: DollarSign,
      format: (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: stats?.revenueChange,
      description: 'All time revenue',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      format: (val: number) => val.toLocaleString(),
      change: stats?.ordersChange,
      description: 'All orders',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      format: (val: number) => val.toLocaleString(),
      description: 'Registered users',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      format: (val: number) => val.toLocaleString(),
      description: 'Active products',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const hasChange = stat.change !== undefined;
        const isPositive = stat.change !== undefined && stat.change >= 0;

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.format(stat.value)}</div>
              {hasChange && (
                <div className={cn('flex items-center text-xs mt-1', isPositive ? 'text-green-600' : 'text-red-600')}>
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stat.change || 0).toFixed(1)}% from last period
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

