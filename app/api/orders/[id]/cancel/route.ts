/**
 * POST /api/orders/[id]/cancel
 * Cancel an order
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getOrderById, updateOrderStatus } from '@/lib/db/orders';
import { canCancelOrder, isValidStatusTransition } from '@/lib/orders/status';
import type { OrderStatus } from '@/lib/types/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify order belongs to user
    if (order.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized. This order does not belong to you.' },
        { status: 403 }
      );
    }

    // Check if order can be cancelled
    if (!canCancelOrder(order)) {
      return NextResponse.json(
        { error: `Order cannot be cancelled. Current status: ${order.status || 'unknown'}` },
        { status: 400 }
      );
    }

    // Validate status transition (order.status should not be null at this point, but handle it)
    const currentStatus = order.status;
    if (!currentStatus || !isValidStatusTransition(currentStatus as OrderStatus, 'cancelled')) {
      return NextResponse.json(
        { error: 'Invalid status transition' },
        { status: 400 }
      );
    }

    // Update order status to cancelled
    const updatedOrder = await updateOrderStatus(id, 'cancelled');

    // TODO: If payment was processed, initiate Stripe refund
    // This can be implemented later or in admin functionality
    if (order.stripe_payment_intent_id) {
      console.log(`Order ${id} cancelled with payment intent ${order.stripe_payment_intent_id}. Refund should be processed.`);
      // Future: Integrate with Stripe refund API
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error cancelling order:', error);

    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to cancel order';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

