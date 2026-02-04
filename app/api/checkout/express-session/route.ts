/**
 * POST /api/checkout/express-session
 * Create a single-item order and Stripe Checkout Session for express checkout (redirect).
 * Returns { url } for redirecting to Stripe. Auth required.
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getProductById, getProductBySlug } from '@/lib/db/products';
import { hasProductAccess, hasProductAccessBySlug } from '@/lib/db/access';
import { getUserProfile } from '@/lib/db/profiles';
import { createOrderWithItems, updateOrderWithPaymentInfo } from '@/lib/db/orders';
import type { CartItemWithProduct } from '@/lib/db/cart';
import { validateCoupon } from '@/lib/db/coupons';
import { calculateOrderTotals } from '@/lib/checkout/calculations';
import { getStripeClient } from '@/lib/stripe/client';
import { getStripePriceIdBySlug, SLUG_TO_STRIPE_PRICE_ENV } from '@/lib/stripe/prices';
import { formatAmountForStripe } from '@/lib/stripe/utils';
import { formatStripeError } from '@/lib/stripe/errors';
import type Stripe from 'stripe';

const MIN_CHECKOUT_AMOUNT_USD = 0.5;

function parseProductPrice(price: unknown): number {
  if (typeof price === 'number' && !Number.isNaN(price)) return price;
  const parsed = parseFloat(String(price ?? 0));
  return Number.isNaN(parsed) ? 0 : parsed;
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json().catch(() => ({}));
    const productId = typeof body?.productId === 'string' ? body.productId.trim() : undefined;
    const couponCode = typeof body?.couponCode === 'string' ? body.couponCode.trim() : undefined;
    const productSlug = typeof body?.productSlug === 'string' ? body.productSlug.trim() : undefined;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const quantity = 1;

    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or unavailable' },
        { status: 400 }
      );
    }

    const productType = (product as { product_type?: string }).product_type;
    if (productType === 'package') {
      const bundle = await getProductBySlug('master-bundle');
      if (bundle?.id && (await hasProductAccess(user.id, bundle.id))) {
        return NextResponse.json(
          { error: 'You already have the Master Bundle. Individual packages are not sold separately to bundle owners.' },
          { status: 400 }
        );
      }
    }
    if (productType === 'bundle') {
      const PACKAGE_SLUGS = ['web-apps', 'social-media', 'agency', 'freelancing'] as const;
      const allPackagesOwned = await Promise.all(
        PACKAGE_SLUGS.map((slug) => hasProductAccessBySlug(user.id, slug))
      );
      if (allPackagesOwned.every(Boolean)) {
        return NextResponse.json(
          { error: 'You already own all four packages. The Master Bundle is not available.' },
          { status: 400 }
        );
      }
    }

    const profile = await getUserProfile(user.id);
    const customerName =
      (profile as { full_name?: string | null } | null)?.full_name ??
      (user as { user_metadata?: { full_name?: string } }).user_metadata?.full_name ??
      user.email ??
      'Customer';
    const customerEmail = user.email ?? '';
    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Account email is required for express checkout' },
        { status: 400 }
      );
    }

    const unitPrice = parseProductPrice(product.price);
    const singleItem: CartItemWithProduct = {
      id: '',
      user_id: user.id,
      product_id: product.id,
      variant_id: null,
      quantity,
      created_at: '',
      updated_at: '',
      product: {
        ...product,
        title: product.title ?? product.name ?? 'Product',
        price: unitPrice,
        slug: product.slug ?? null,
      } as CartItemWithProduct['product'],
    };

    let coupon: Awaited<ReturnType<typeof validateCoupon>>['coupon'] = null;
    if (couponCode) {
      const subtotal = unitPrice * quantity;
      const validationResult = await validateCoupon(couponCode, subtotal, [product.id]);
      if (!validationResult.valid) {
        return NextResponse.json(
          { error: validationResult.error ?? 'Invalid coupon code' },
          { status: 400 }
        );
      }
      coupon = validationResult.coupon ?? null;
    }

    const orderTotals = calculateOrderTotals([singleItem], coupon ?? undefined);
    if (orderTotals.total < MIN_CHECKOUT_AMOUNT_USD) {
      return NextResponse.json(
        { error: 'Order total must be at least $0.50 to complete payment.' },
        { status: 400 }
      );
    }

    const order = await createOrderWithItems(
      {
        userId: user.id,
        customerEmail,
        customerName,
        subtotal: orderTotals.subtotal,
        totalAmount: orderTotals.total,
        taxAmount: orderTotals.taxAmount,
        discountAmount: orderTotals.discountAmount,
        couponId: coupon?.id,
        currency: 'USD',
      },
      [singleItem]
    );

    if (!order.items || order.items.length === 0) {
      return NextResponse.json(
        { error: 'Order has no items' },
        { status: 500 }
      );
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of order.items) {
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
}
