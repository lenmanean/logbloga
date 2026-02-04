/**
 * Shared logic for creating a single-item express order (Buy Now / wallet button).
 * Used by express-session (Checkout redirect) and express-wallet-intent (PaymentIntent).
 */

import { getProductById, getProductBySlug } from '@/lib/db/products';
import { hasProductAccess, hasProductAccessBySlug } from '@/lib/db/access';
import { getUserProfile } from '@/lib/db/profiles';
import { createOrderWithItems } from '@/lib/db/orders';
import type { CartItemWithProduct } from '@/lib/db/cart';
import { validateCoupon } from '@/lib/db/coupons';
import { calculateOrderTotals } from '@/lib/checkout/calculations';
import type { OrderWithItems } from '@/lib/types/database';

const MIN_CHECKOUT_AMOUNT_USD = 0.5;

export class ExpressOrderError extends Error {
  constructor(
    message: string,
    public readonly status: number = 400
  ) {
    super(message);
    this.name = 'ExpressOrderError';
  }
}

function parseProductPrice(price: unknown): number {
  if (typeof price === 'number' && !Number.isNaN(price)) return price;
  const parsed = parseFloat(String(price ?? 0));
  return Number.isNaN(parsed) ? 0 : parsed;
}

export interface CreateExpressOrderParams {
  userId: string;
  userEmail: string | null;
  productId: string;
  productSlug?: string | null;
  couponCode?: string | null;
}

/**
 * Validates product, bundle/package rules, coupon; creates a single-item order.
 * Throws ExpressOrderError with status 400 for validation errors.
 */
export async function createExpressOrder(params: CreateExpressOrderParams): Promise<OrderWithItems> {
  const { userId, userEmail, productId, productSlug, couponCode } = params;
  const quantity = 1;

  const product = await getProductById(productId);
  if (!product) {
    throw new ExpressOrderError('Product not found or unavailable', 400);
  }

  const productType = (product as { product_type?: string }).product_type;
  if (productType === 'package') {
    const bundle = await getProductBySlug('master-bundle');
    if (bundle?.id && (await hasProductAccess(userId, bundle.id))) {
      throw new ExpressOrderError(
        'You already have the Master Bundle. Individual packages are not sold separately to bundle owners.',
        400
      );
    }
  }
  if (productType === 'bundle') {
    const PACKAGE_SLUGS = ['web-apps', 'social-media', 'agency', 'freelancing'] as const;
    const allPackagesOwned = await Promise.all(
      PACKAGE_SLUGS.map((slug) => hasProductAccessBySlug(userId, slug))
    );
    if (allPackagesOwned.every(Boolean)) {
      throw new ExpressOrderError(
        'You already own all four packages. The Master Bundle is not available.',
        400
      );
    }
  }

  const profile = await getUserProfile(userId);
  const customerName =
    (profile as { full_name?: string | null } | null)?.full_name ??
    userEmail ??
    'Customer';
  const customerEmail = userEmail ?? '';
  if (!customerEmail) {
    throw new ExpressOrderError('Account email is required for express checkout', 400);
  }

  const unitPrice = parseProductPrice(product.price);
  const singleItem: CartItemWithProduct = {
    id: '',
    user_id: userId,
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
      throw new ExpressOrderError(
        validationResult.error ?? 'Invalid coupon code',
        400
      );
    }
    coupon = validationResult.coupon ?? null;
  }

  const orderTotals = calculateOrderTotals([singleItem], coupon ?? undefined);
  if (orderTotals.total < MIN_CHECKOUT_AMOUNT_USD) {
    throw new ExpressOrderError(
      'Order total must be at least $0.50 to complete payment.',
      400
    );
  }

  const order = await createOrderWithItems(
    {
      userId,
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
    throw new ExpressOrderError('Order has no items', 500);
  }

  return order;
}
