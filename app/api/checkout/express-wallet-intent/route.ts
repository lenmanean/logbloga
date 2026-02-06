/**
 * POST /api/checkout/express-wallet-intent
 * Create a single-item order and Stripe PaymentIntent for native Apple Pay / Google Pay on the product page.
 * Returns { clientSecret, orderId } for the Payment Request Button. Auth required.
 * Reuses a recent pending order for the same user+product within 10 minutes to avoid duplicate orders.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/utils';
import { withRateLimit } from '@/lib/security/rate-limit-middleware';
import { uuidSchema } from '@/lib/security/validation';
import { createExpressOrder, ExpressOrderError } from '@/lib/checkout/express-order';
import { getMostRecentPendingOrderForUser, getOrderWithItems, updateOrderWithPaymentInfo } from '@/lib/db/orders';
import { getStripeClient } from '@/lib/stripe/client';
import { formatAmountForStripe } from '@/lib/stripe/utils';
import { formatStripeError } from '@/lib/stripe/errors';

const expressWalletBodySchema = z.object({
  productId: uuidSchema,
  productSlug: z.string().max(100).optional(),
  couponCode: z.string().max(64).optional(),
});

const PENDING_ORDER_REUSE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(request: Request) {
  let user;
  try {
    user = await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return withRateLimit(request, { type: 'payment', userId: user.id, skipInDevelopment: false }, async () => {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = expressWalletBodySchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Validation error';
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const { productId, productSlug, couponCode } = parsed.data;

    let order = await getMostRecentPendingOrderForUser(user.id);
    const createdAt = order?.created_at;
    const canReuse =
      order &&
      order.items?.length === 1 &&
      order.items[0].product_id === productId &&
      !order.stripe_checkout_session_id && // only reuse orders not tied to Checkout Session
      createdAt != null &&
      Date.now() - new Date(createdAt).getTime() <= PENDING_ORDER_REUSE_WINDOW_MS &&
      !couponCode; // do not reuse when a coupon is provided so discount is applied

    if (!canReuse) {
      try {
        order = await createExpressOrder({
          userId: user.id,
          userEmail: user.email ?? null,
          productId,
          productSlug: productSlug ?? null,
          couponCode: couponCode ?? null,
        });
      } catch (err) {
        if (err instanceof ExpressOrderError) {
          return NextResponse.json({ error: err.message }, { status: err.status });
        }
        throw err;
      }
    } else {
      order = await getOrderWithItems(order!.id);
      if (!order) {
        return NextResponse.json(
          { error: 'Failed to load order' },
          { status: 500 }
        );
      }
    }

    const orderTotalUsd =
      typeof order.total_amount === 'number'
        ? order.total_amount
        : parseFloat(String(order.total_amount ?? 0));
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
            orderId: order.id,
            totalAmountUsd: orderTotalUsd,
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

    await updateOrderWithPaymentInfo(order.id, {
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
      orderId: order.id,
      totalAmountUsd: orderTotalUsd,
    });
  } catch (error) {
    console.error('Error creating express wallet intent:', error);
    const message = formatStripeError(error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
  });
}
