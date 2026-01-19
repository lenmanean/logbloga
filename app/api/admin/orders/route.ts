import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/permissions';
import { getAllOrders, getOrderStatistics } from '@/lib/admin/orders';

export async function GET(request: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const search = searchParams.get('search') || undefined;

    const filters = {
      status: status as any,
      userId,
      dateFrom,
      dateTo,
      search,
    };

    const orders = await getAllOrders(filters);
    const stats = await getOrderStatistics();

    return NextResponse.json({
      orders,
      stats,
      count: orders.length,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

