/**
 * POST /api/orders/create-express
 * Create a single-item order and PaymentIntent for express checkout (Apple Pay, modal, etc.).
 * Returns orderId and clientSecret. Auth required; customer info from session.
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getProductById, getProductBySlug } from '@/lib/db/products';
import { hasProductAccess, hasProductAccessBySlug } from '@/lib/db/access';
import { getUserProfile } from '@/lib/db/profiles';
import {
  createOrderWithItems,
  getMostRecentPendingOrderForUser,
  getOrderWithItems,
  updateOrderWithPaymentInfo,
} from '@/lib/db/orders';
import type { CartItemWithProduct } from '@/lib/db/cart';
import { validateCoupon } from '@/lib/db/coupons';
import { calculateOrderTotals } from '@/lib/checkout/calculations';
import { getStripeClient } from '@/lib/stripe/client';
import { formatAmountForStripe } from '@/lib/stripe/utils';
import { formatStripeError } from '@/lib/stripe/errors';

const MIN_CHECKOUT_AMOUNT_USD = 0.5;
const EXPRESS_IDEMPOTENCY_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

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
    let quantity = typeof body?.quantity === 'number' ? body.quantity : 1;
    const couponCode = typeof body?.couponCode === 'string' ? body.couponCode.trim() : undefined;
    const idempotencyKey = typeof request.headers.get('Idempotency-Key') === 'string'
      ? request.headers.get('Idempotency-Key')!.trim()
      : undefined;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // One per package/bundle
    quantity = 1;

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

    let order: Awaited<ReturnType<typeof createOrderWithItems>>;

    if (idempotencyKey) {
      const pendingOrder = await getMostRecentPendingOrderForUser(user.id);
      const createdMs = pendingOrder?.created_at
        ? new Date(pendingOrder.created_at).getTime()
        : 0;
      const withinWindow = Date.now() - createdMs <= EXPRESS_IDEMPOTENCY_WINDOW_MS;
      const singleItemMatch =
        pendingOrder?.items?.length === 1 &&
        pendingOrder.items[0].product_id === productId &&
        (pendingOrder.items[0].quantity ?? 0) === quantity;

      if (pendingOrder && withinWindow && singleItemMatch) {
        order = pendingOrder as Awaited<ReturnType<typeof createOrderWithItems>>;
      } else {
        order = await createOrderWithItems(
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
      }
    } else {
      order = await createOrderWithItems(
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
    }

    const stripe = getStripeClient();
    const orderTotalUsd =
      typeof order.total_amount === 'number'
        ? order.total_amount
        : parseFloat(String(order.total_amount ?? 0));
    const amountCents = formatAmountForStripe(orderTotalUsd);

    let clientSecret: string | null = null;
    const existingPiId = order.stripe_payment_intent_id;
    if (existingPiId) {
      try {
        const existing = await stripe.paymentIntents.retrieve(existingPiId);
        if (
          existing.client_secret &&
          (existing.status === 'requires_payment_method' ||
            existing.status === 'requires_confirmation')
        ) {
          clientSecret = existing.client_secret;
        }
      } catch {
        // Intent invalid or gone; create new one
      }
    }

    if (!clientSecret) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        metadata: {
          orderId: order.id,
          userId: order.user_id ?? '',
        },
        receipt_email: order.customer_email ?? undefined,
      });
      await updateOrderWithPaymentInfo(order.id, {
        stripePaymentIntentId: paymentIntent.id,
      });
      clientSecret = paymentIntent.client_secret ?? null;
    }

    if (!clientSecret) {
      return NextResponse.json(
        { error: 'Failed to create payment session.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { orderId: order.id, clientSecret },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error;
    }
    console.error('Error creating express order:', error);
    const message = formatStripeError(error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
