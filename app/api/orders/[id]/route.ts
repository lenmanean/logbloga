/**
 * GET /api/orders/[id]
 * Fetch order by ID for the authenticated owner (e.g. success page).
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getOrderWithItems } from '@/lib/db/orders';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await getOrderWithItems(id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized. You do not have access to this order.' },
        { status: 403 }
      );
    }

    const orderWithDoer = order as {
      doer_coupon_code?: string | null;
      doer_coupon_expires_at?: string | null;
      doer_coupon_used?: boolean;
      doer_coupon_used_at?: string | null;
    };

    return NextResponse.json({
      orderNumber: order.order_number,
      status: order.status,
      orderId: order.id,
      doerCouponCode: orderWithDoer.doer_coupon_code ?? null,
      doerCouponExpiresAt: orderWithDoer.doer_coupon_expires_at ?? null,
      doerCouponUsed: orderWithDoer.doer_coupon_used ?? false,
      doerCouponUsedAt: orderWithDoer.doer_coupon_used_at ?? null,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error;
    }
    console.error('Error fetching order:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
