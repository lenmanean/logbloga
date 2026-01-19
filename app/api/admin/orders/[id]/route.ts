import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/permissions';
import { getAdminOrderWithItems, updateOrderStatus } from '@/lib/admin/orders';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    const order = await getAdminOrderWithItems(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedOrder = await updateOrderStatus(id, status);

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update order';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

