/**
 * Admin analytics utilities
 * Provides functions to calculate business metrics and generate reports
 */

import { createServiceRoleClient } from '@/lib/supabase/server';
import { getUserOrders } from '@/lib/db/orders';
import { getAllProducts } from '@/lib/db/products';

export interface RevenueMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueByPeriod: Array<{ period: string; revenue: number; orders: number }>;
}

export interface OrderTrends {
  daily: Array<{ date: string; count: number; revenue: number }>;
  weekly: Array<{ week: string; count: number; revenue: number }>;
  monthly: Array<{ month: string; count: number; revenue: number }>;
}

export interface ProductPerformance {
  topProducts: Array<{
    productId: string;
    productName: string;
    sales: number;
    revenue: number;
  }>;
  salesByCategory: Array<{
    category: string;
    sales: number;
    revenue: number;
  }>;
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageCustomerValue: number;
}

/**
 * Get revenue metrics for a date range
 */
export async function getRevenueMetrics(
  startDate?: Date,
  endDate?: Date
): Promise<RevenueMetrics> {
  const supabase = await createServiceRoleClient();

  let query = supabase
    .from('orders')
    .select('total_amount, created_at')
    .eq('status', 'completed');

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('created_at', endDate.toISOString());
  }

  const { data: orders, error } = await query;

  if (error) {
    console.error('Error fetching revenue metrics:', error);
    throw new Error(`Failed to fetch revenue metrics: ${error.message}`);
  }

  const totalRevenue = orders?.reduce((sum, order) => {
    const amount = typeof order.total_amount === 'number'
      ? order.total_amount
      : parseFloat(String(order.total_amount || 0));
    return sum + amount;
  }, 0) || 0;

  const totalOrders = orders?.length || 0;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Group by period (daily for now)
  const revenueByPeriod: RevenueMetrics['revenueByPeriod'] = [];
  if (orders) {
    const periodMap = new Map<string, { revenue: number; orders: number }>();

    orders.forEach((order) => {
      const date = new Date(order.created_at || '');
      const period = date.toISOString().split('T')[0]; // YYYY-MM-DD

      const amount = typeof order.total_amount === 'number'
        ? order.total_amount
        : parseFloat(String(order.total_amount || 0));

      const existing = periodMap.get(period) || { revenue: 0, orders: 0 };
      periodMap.set(period, {
        revenue: existing.revenue + amount,
        orders: existing.orders + 1,
      });
    });

    periodMap.forEach((value, period) => {
      revenueByPeriod.push({ period, ...value });
    });

    revenueByPeriod.sort((a, b) => a.period.localeCompare(b.period));
  }

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    revenueByPeriod,
  };
}

/**
 * Get order trends over time
 */
export async function getOrderTrends(
  period: 'daily' | 'weekly' | 'monthly' = 'daily',
  days: number = 30
): Promise<OrderTrends> {
  const supabase = await createServiceRoleClient();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: orders, error } = await supabase
    .from('orders')
    .select('total_amount, created_at')
    .gte('created_at', startDate.toISOString())
    .eq('status', 'completed')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching order trends:', error);
    throw new Error(`Failed to fetch order trends: ${error.message}`);
  }

  const daily: OrderTrends['daily'] = [];
  const weekly: OrderTrends['weekly'] = [];
  const monthly: OrderTrends['monthly'] = [];

  if (orders) {
    const dailyMap = new Map<string, { count: number; revenue: number }>();
    const weeklyMap = new Map<string, { count: number; revenue: number }>();
    const monthlyMap = new Map<string, { count: number; revenue: number }>();

    orders.forEach((order) => {
      const date = new Date(order.created_at || '');
      const amount = typeof order.total_amount === 'number'
        ? order.total_amount
        : parseFloat(String(order.total_amount || 0));

      // Daily
      const dayKey = date.toISOString().split('T')[0];
      const dailyData = dailyMap.get(dayKey) || { count: 0, revenue: 0 };
      dailyMap.set(dayKey, {
        count: dailyData.count + 1,
        revenue: dailyData.revenue + amount,
      });

      // Weekly
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      const weeklyData = weeklyMap.get(weekKey) || { count: 0, revenue: 0 };
      weeklyMap.set(weekKey, {
        count: weeklyData.count + 1,
        revenue: weeklyData.revenue + amount,
      });

      // Monthly
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthlyData = monthlyMap.get(monthKey) || { count: 0, revenue: 0 };
      monthlyMap.set(monthKey, {
        count: monthlyData.count + 1,
        revenue: monthlyData.revenue + amount,
      });
    });

    dailyMap.forEach((value, date) => {
      daily.push({ date, ...value });
    });
    daily.sort((a, b) => a.date.localeCompare(b.date));

    weeklyMap.forEach((value, week) => {
      weekly.push({ week, ...value });
    });
    weekly.sort((a, b) => a.week.localeCompare(b.week));

    monthlyMap.forEach((value, month) => {
      monthly.push({ month, ...value });
    });
    monthly.sort((a, b) => a.month.localeCompare(b.month));
  }

  return { daily, weekly, monthly };
}

/**
 * Get product performance metrics
 */
export async function getProductPerformance(): Promise<ProductPerformance> {
  const supabase = await createServiceRoleClient();

  // Get order items with product information including category
  const { data: orderItems, error } = await supabase
    .from('order_items')
    .select(`
      product_id,
      product_name,
      quantity,
      total_price,
      order:orders!inner(status, created_at),
      product:products(id, category)
    `)
    .eq('order.status', 'completed');

  if (error) {
    console.error('Error fetching product performance:', error);
    throw new Error(`Failed to fetch product performance: ${error.message}`);
  }

  const productMap = new Map<string, { name: string; sales: number; revenue: number }>();
  const categoryMap = new Map<string, { sales: number; revenue: number }>();

  if (orderItems) {
    for (const item of orderItems) {
      const productId = item.product_id;
      const productName = item.product_name || 'Unknown Product';
      const quantity = item.quantity || 0;
      const revenue = typeof item.total_price === 'number'
        ? item.total_price
        : parseFloat(String(item.total_price || 0));

      // Product stats
      const productData = productMap.get(productId) || { name: productName, sales: 0, revenue: 0 };
      productMap.set(productId, {
        name: productName,
        sales: productData.sales + quantity,
        revenue: productData.revenue + revenue,
      });

      // Category stats - get category from product relation
      const product = item.product as any;
      const category = product?.category || 'uncategorized';
      
      const categoryData = categoryMap.get(category) || { sales: 0, revenue: 0 };
      categoryMap.set(category, {
        sales: categoryData.sales + quantity,
        revenue: categoryData.revenue + revenue,
      });
    }
  }

  const topProducts = Array.from(productMap.entries())
    .map(([productId, data]) => ({
      productId,
      productName: data.name,
      sales: data.sales,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Calculate sales by category
  const salesByCategory: ProductPerformance['salesByCategory'] = Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      sales: data.sales,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return {
    topProducts,
    salesByCategory,
  };
}

/**
 * Get customer metrics
 */
export async function getCustomerMetrics(): Promise<CustomerMetrics> {
  const supabase = await createServiceRoleClient();

  // Total customers
  const { count: totalCustomers, error: countError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error fetching customer count:', countError);
    throw new Error(`Failed to fetch customer metrics: ${countError.message}`);
  }

  // New customers (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: newCustomers, error: newError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString());

  if (newError) {
    console.error('Error fetching new customers:', newError);
    throw new Error(`Failed to fetch customer metrics: ${newError.message}`);
  }

  // Customers with multiple orders (returning)
  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select('user_id')
    .eq('status', 'completed');

  if (ordersError) {
    console.error('Error fetching orders for customer metrics:', ordersError);
    throw new Error(`Failed to fetch customer metrics: ${ordersError.message}`);
  }

  const customerOrderCounts = new Map<string, number>();
  ordersData?.forEach((order) => {
    if (order.user_id) {
      const count = customerOrderCounts.get(order.user_id) || 0;
      customerOrderCounts.set(order.user_id, count + 1);
    }
  });

  const returningCustomers = Array.from(customerOrderCounts.values()).filter(count => count > 1).length;

  // Average customer value
  const { data: allOrders, error: allOrdersError } = await supabase
    .from('orders')
    .select('total_amount, user_id')
    .eq('status', 'completed');

  if (allOrdersError) {
    console.error('Error fetching orders for average value:', allOrdersError);
    throw new Error(`Failed to fetch customer metrics: ${allOrdersError.message}`);
  }

  const customerRevenue = new Map<string, number>();
  allOrders?.forEach((order) => {
    if (order.user_id) {
      const amount = typeof order.total_amount === 'number'
        ? order.total_amount
        : parseFloat(String(order.total_amount || 0));
      const current = customerRevenue.get(order.user_id) || 0;
      customerRevenue.set(order.user_id, current + amount);
    }
  });

  const totalRevenue = Array.from(customerRevenue.values()).reduce((sum, val) => sum + val, 0);
  const uniqueCustomers = customerRevenue.size;
  const averageCustomerValue = uniqueCustomers > 0 ? totalRevenue / uniqueCustomers : 0;

  return {
    totalCustomers: totalCustomers || 0,
    newCustomers: newCustomers || 0,
    returningCustomers,
    averageCustomerValue,
  };
}

/**
 * Generate report data for export
 */
export async function generateReport(
  type: 'orders' | 'products' | 'customers',
  format: 'csv' | 'json' = 'json'
): Promise<string> {
  const supabase = await createServiceRoleClient();

  let data: any[] = [];

  switch (type) {
    case 'orders':
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      data = orders || [];
      break;

    case 'products':
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      data = products || [];
      break;

    case 'customers':
      const { data: customers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      data = customers || [];
      break;
  }

  if (format === 'csv') {
    if (data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        if (value === null || value === undefined) {
          return '';
        }
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        return String(value).replace(/"/g, '""');
      })
    );

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  }

  return JSON.stringify(data, null, 2);
}

