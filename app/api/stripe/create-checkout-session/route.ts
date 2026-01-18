/**
 * POST /api/stripe/create-checkout-session
 * Create a Stripe Checkout Session for an order
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getOrderWithItems, updateOrderWithPaymentInfo } from '@/lib/db/orders';
import { getStripeClient } from '@/lib/stripe/client';
import { formatAmountForStripe } from '@/lib/stripe/utils';
import { formatStripeError, StripeOrderNotFoundError, StripeCheckoutSessionError } from '@/lib/stripe/errors';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order with items
    const order = await getOrderWithItems(orderId);

    if (!order) {
      throw new StripeOrderNotFoundError(orderId);
    }

    // Verify order belongs to user
    if (order.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized. This order does not belong to you.' },
        { status: 403 }
      );
    }

    // Verify order is in pending status
    if (order.status !== 'pending') {
      return NextResponse.json(
        { error: `Order is already ${order.status}. Cannot create payment session.` },
        { status: 400 }
      );
    }

    // Build line items from order items
    if (!order.items || order.items.length === 0) {
      return NextResponse.json(
        { error: 'Order has no items' },
        { status: 400 }
      );
    }

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: order.currency?.toLowerCase() || 'usd',
        product_data: {
          name: item.product_name,
          description: `Quantity: ${item.quantity}`,
        },
        unit_amount: formatAmountForStripe(item.unit_price),
      },
      quantity: item.quantity,
    }));

    // Get app URL for redirects
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: order.customer_email,
      metadata: {
        orderId: order.id,
        orderNumber: order.order_number,
        userId: order.user_id || '',
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?error=payment_cancelled`,
      // Allow promotion codes
      allow_promotion_codes: true,
    });

    // Update order with checkout session ID
    try {
      await updateOrderWithPaymentInfo(order.id, {
        stripeCheckoutSessionId: session.id,
      });
    } catch (error) {
      console.error('Error updating order with session ID:', error);
      // Don't fail if we can't update the order, but log it
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);

    if (error instanceof StripeOrderNotFoundError || error instanceof StripeCheckoutSessionError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    const errorMessage = formatStripeError(error);

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

