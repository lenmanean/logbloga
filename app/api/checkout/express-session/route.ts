/**
 * POST /api/checkout/express-session
 * Create a single-item order and Stripe Checkout Session for express checkout (redirect).
 * Returns { url } for redirecting to Stripe. Auth required.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/utils';
import { withRateLimit } from '@/lib/security/rate-limit-middleware';
import { uuidSchema } from '@/lib/security/validation';
import { createExpressOrder, ExpressOrderError } from '@/lib/checkout/express-order';
import { updateOrderWithPaymentInfo } from '@/lib/db/orders';
import { getStripePriceIdBySlug, SLUG_TO_STRIPE_PRICE_ENV } from '@/lib/stripe/prices';
import { formatAmountForStripe } from '@/lib/stripe/utils';
import { getStripeClient } from '@/lib/stripe/client';
import { formatStripeError } from '@/lib/stripe/errors';
import type Stripe from 'stripe';

const expressSessionBodySchema = z.object({
  productId: uuidSchema,
  productSlug: z.string().max(100).optional(),
  couponCode: z.string().max(64).optional(),
});

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
    const parsed = expressSessionBodySchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Validation error';
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const { productId, productSlug, couponCode } = parsed.data;

    let order;
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

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of order.items ?? []) {
      const slug = item.product_sku?.trim() || null;
      if (!slug) {
        return NextResponse.json(
          { error: 'Order item missing product identifier; cannot create payment session.' },
          { status: 500 }
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const cancelPath = productSlug ? `/ai-to-usd/packages/${productSlug}` : '/checkout';
    const cancelUrl = `${appUrl}${cancelPath}?error=payment_cancelled`;

    const metadata: Record<string, string> = {
      orderId: order.id,
      orderNumber: order.order_number || '',
    };
    if (order.user_id) {
      metadata.userId = order.user_id;
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'link', 'klarna', 'affirm', 'afterpay_clearpay'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: order.customer_email || undefined,
      metadata,
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      allow_promotion_codes: discountAmount <= 0,
      automatic_tax: { enabled: true },
    });

    await updateOrderWithPaymentInfo(order.id, {
      stripeCheckoutSessionId: session.id,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error;
    }
    console.error('Error creating express checkout session:', error);
    const message = formatStripeError(error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
  });
}
