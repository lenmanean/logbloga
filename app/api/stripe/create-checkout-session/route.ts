/**
 * POST /api/stripe/create-checkout-session
 * Create a Stripe Checkout Session for an order
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getOrderWithItems, updateOrderWithPaymentInfo } from '@/lib/db/orders';
import { getStripeClient } from '@/lib/stripe/client';
import { getStripePriceIdBySlug, SLUG_TO_STRIPE_PRICE_ENV } from '@/lib/stripe/prices';
import { formatAmountForStripe } from '@/lib/stripe/utils';
import { formatStripeError, StripeOrderNotFoundError, StripeCheckoutSessionError } from '@/lib/stripe/errors';
import type Stripe from 'stripe';

/** Stripe requires Checkout Session total to be at least $0.50 USD */
const MIN_CHECKOUT_AMOUNT_USD = 0.5;

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

    // Build line items from order items (Stripe price IDs from env only)
    if (!order.items || order.items.length === 0) {
      return NextResponse.json(
        { error: 'Order has no items' },
        { status: 400 }
      );
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of order.items) {
      const slug = item.product_sku?.trim() || null;
      if (!slug) {
        return NextResponse.json(
          { error: 'Order item missing product identifier; cannot create payment session.' },
          { status: 400 }
        );
      }

      const stripePriceId = getStripePriceIdBySlug(slug);
      if (!stripePriceId) {
        const envKey = SLUG_TO_STRIPE_PRICE_ENV[slug.toLowerCase()] ?? `STRIPE_PRICE_${slug.replace(/-/g, '_').toUpperCase()}`;
        return NextResponse.json(
          { error: `Stripe price is not configured for product. Set ${envKey} in environment.` },
          { status: 400 }
        );
      }

      lineItems.push({
        price: stripePriceId,
        quantity: item.quantity,
      });
    }

    const stripe = getStripeClient();

    // Apply app coupon as a negative line item so Stripe total matches order.total_amount
    const discountAmount = typeof order.discount_amount === 'number'
      ? order.discount_amount
      : parseFloat(String(order.discount_amount || 0));
    if (discountAmount > 0) {
      lineItems.push({
        price_data: {
          currency: order.currency?.toLowerCase() || 'usd',
          product_data: {
            name: 'Discount',
            description: 'Coupon discount applied at checkout',
          },
          unit_amount: -formatAmountForStripe(discountAmount),
        },
        quantity: 1,
      });
    }

    // Stripe minimum: total must be at least $0.50 USD
    const orderTotalUsd = typeof order.total_amount === 'number'
      ? order.total_amount
      : parseFloat(String(order.total_amount || 0));
    if (orderTotalUsd < MIN_CHECKOUT_AMOUNT_USD) {
      return NextResponse.json(
        { error: 'Order total must be at least $0.50 to complete payment.' },
        { status: 400 }
      );
    }

    // Get app URL for redirects
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session

    // Prepare metadata with proper type handling (Stripe metadata only accepts strings)
    const metadata: Record<string, string> = {
      orderId: order.id,
      orderNumber: order.order_number || '',
    };
    
    // Only add userId if it exists (metadata values must be strings)
    if (order.user_id) {
      metadata.userId = order.user_id;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: order.customer_email || undefined,
      metadata,
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?error=payment_cancelled`,
      // Only allow Stripe promotion codes when no app coupon was applied (avoid double discount)
      allow_promotion_codes: discountAmount <= 0,
      // Enable automatic tax calculation
      automatic_tax: {
        enabled: true,
      },
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

    // Stripe amount_too_small: return 400 with clear message
    const stripeError = error as { code?: string };
    if (stripeError?.code === 'amount_too_small') {
      return NextResponse.json(
        { error: 'Order total must be at least $0.50 to complete payment.' },
        { status: 400 }
      );
    }

    const errorMessage = formatStripeError(error);

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

