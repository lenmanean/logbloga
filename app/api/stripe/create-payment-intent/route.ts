/**
 * POST /api/stripe/create-payment-intent
 * Create a Stripe PaymentIntent for an existing pending order.
 * Returns clientSecret for the Payment Element (client-side confirmation only).
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getOrderWithItems, updateOrderWithPaymentInfo } from '@/lib/db/orders';
import { getStripeClient } from '@/lib/stripe/client';
import { formatAmountForStripe } from '@/lib/stripe/utils';
import { formatStripeError, StripeOrderNotFoundError } from '@/lib/stripe/errors';

const MIN_CHECKOUT_AMOUNT_USD = 0.5;

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { orderId } = body;

    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await getOrderWithItems(orderId);

    if (!order) {
      throw new StripeOrderNotFoundError(orderId);
    }

    if (order.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized. This order does not belong to you.' },
        { status: 403 }
      );
    }

    if (order.status !== 'pending') {
      return NextResponse.json(
        { error: `Order is already ${order.status}. Cannot create payment.` },
        { status: 400 }
      );
    }

    if (!order.items || order.items.length === 0) {
      return NextResponse.json(
        { error: 'Order has no items' },
        { status: 400 }
      );
    }

    const orderTotalUsd =
      typeof order.total_amount === 'number'
        ? order.total_amount
        : parseFloat(String(order.total_amount ?? 0));

    if (orderTotalUsd < MIN_CHECKOUT_AMOUNT_USD) {
      return NextResponse.json(
        { error: 'Order total must be at least $0.50 to complete payment.' },
        { status: 400 }
      );
    }

    const amountCents = formatAmountForStripe(orderTotalUsd);
    const currency = (order.currency ?? 'USD').toLowerCase();
    const stripe = getStripeClient();

    const existingPiId = order.stripe_payment_intent_id;
    if (existingPiId) {
      try {
        const existing = await stripe.paymentIntents.retrieve(existingPiId);
        if (
          existing.client_secret &&
          (existing.status === 'requires_payment_method' ||
            existing.status === 'requires_confirmation')
        ) {
          return NextResponse.json({
            clientSecret: existing.client_secret,
          });
        }
      } catch {
        // Intent invalid or gone; create new one
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId: order.id,
        userId: order.user_id ?? '',
      },
      receipt_email: undefined,
    });

    await updateOrderWithPaymentInfo(orderId, {
      stripePaymentIntentId: paymentIntent.id,
    });

    if (!paymentIntent.client_secret) {
      return NextResponse.json(
        { error: 'Failed to create payment session.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);

    if (error instanceof StripeOrderNotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode ?? 500 }
      );
    }

    const errorMessage = formatStripeError(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
