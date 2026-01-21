/**
 * GET /api/stripe/get-order-by-session
 * Get order information by Stripe checkout session ID
 * Used by success page to display order details
 */

import { NextResponse } from 'next/server';
import { getOrderByStripeSessionId } from '@/lib/db/orders';
import { getStripeClient } from '@/lib/stripe/client';
import { extractCheckoutMetadata, isCheckoutSessionPaid } from '@/lib/stripe/utils';
import { formatStripeError } from '@/lib/stripe/errors';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Fetch checkout session from Stripe to verify payment
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify session is paid
    if (!isCheckoutSessionPaid(session)) {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Extract metadata from session
    const metadata = extractCheckoutMetadata(session);

    // Fetch order from database
    const order = await getOrderByStripeSessionId(sessionId);

    if (!order) {
      // If order not found by session ID, try to find by order ID from metadata
      if (metadata.orderId) {
        const { getOrderById } = await import('@/lib/db/orders');
        const orderById = await getOrderById(metadata.orderId);
        
        if (orderById) {
          const orderWithDoer = orderById as any;
          return NextResponse.json({
            orderNumber: orderById.order_number,
            status: orderById.status,
            orderId: orderById.id,
            doerCouponCode: orderWithDoer.doer_coupon_code || null,
            doerCouponExpiresAt: orderWithDoer.doer_coupon_expires_at || null,
            doerCouponUsed: orderWithDoer.doer_coupon_used || false,
            doerCouponUsedAt: orderWithDoer.doer_coupon_used_at || null,
          });
        }
      }

      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const orderWithDoer = order as any;
    return NextResponse.json({
      orderNumber: order.order_number,
      status: order.status,
      orderId: order.id,
      doerCouponCode: orderWithDoer.doer_coupon_code || null,
      doerCouponExpiresAt: orderWithDoer.doer_coupon_expires_at || null,
      doerCouponUsed: orderWithDoer.doer_coupon_used || false,
      doerCouponUsedAt: orderWithDoer.doer_coupon_used_at || null,
    });
  } catch (error) {
    console.error('Error fetching order by session:', error);
    const errorMessage = formatStripeError(error);

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
