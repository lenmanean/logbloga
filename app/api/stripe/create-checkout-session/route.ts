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
import { createServiceRoleClient } from '@/lib/supabase/server';
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

    // Build line items from order items
    if (!order.items || order.items.length === 0) {
      return NextResponse.json(
        { error: 'Order has no items' },
        { status: 400 }
      );
    }

    // Fetch products to get Stripe price IDs
    const supabase = await createServiceRoleClient();
    const productIds = order.items
      .map(item => item.product_id)
      .filter((id): id is string => !!id);

    let productsMap = new Map<string, { stripe_price_id: string | null }>();
    
    if (productIds.length > 0) {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, stripe_price_id')
        .in('id', productIds);

      // If error occurs, log but continue with fallback
      if (productsError) {
        console.warn('Error fetching Stripe price IDs:', productsError);
      } else if (products) {
        products.forEach((product) => {
          productsMap.set(product.id, { stripe_price_id: product.stripe_price_id || null });
        });
      }
    }

    // Build line items - use pre-created Stripe prices when available, otherwise use price_data
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map((item) => {
      const product = item.product_id ? productsMap.get(item.product_id) : null;
      const stripePriceId = product?.stripe_price_id;

      // If we have a Stripe price ID, use it (enables automatic tax)
      if (stripePriceId) {
        return {
          price: stripePriceId,
          quantity: item.quantity,
        };
      }

      // Fallback to price_data for products without Stripe IDs
      return {
        price_data: {
          currency: order.currency?.toLowerCase() || 'usd',
          product_data: {
            name: item.product_name,
            description: `Quantity: ${item.quantity}`,
            tax_code: 'txcd_10000000', // General - Electronically Supplied Services
          },
          unit_amount: formatAmountForStripe(item.unit_price),
          // Enable automatic tax even for dynamically created prices
          tax_behavior: 'exclusive' as Stripe.Checkout.SessionCreateParams.LineItem.PriceData.TaxBehavior,
        },
        quantity: item.quantity,
      };
    });

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
    const stripe = getStripeClient();

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

