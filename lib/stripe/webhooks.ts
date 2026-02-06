/**
 * Stripe webhook event processors
 * Handles various Stripe webhook events and updates orders accordingly
 */

import type Stripe from 'stripe';
import { getOrderWithItems, getOrderById, updateOrderWithPaymentInfo } from '@/lib/db/orders';
import { removeCartItemsByProductIds } from '@/lib/db/cart';
import { getPaymentIntentId, extractCheckoutMetadata } from './utils';
import { getReceiptAmountsFromStripe } from './receipt-from-stripe';
import type { Order } from '@/lib/types/database';
import { sendPaymentReceipt } from '@/lib/email/senders';
import { createNotification } from '@/lib/db/notifications-db';

/**
 * Handle checkout.session.completed event
 * Payment was successful, order should move from pending to processing
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const metadata = extractCheckoutMetadata(session);
  
  if (!metadata.orderId) {
    console.error('Checkout session completed but no orderId in metadata:', session.id);
    return;
  }

  const paymentIntentId = getPaymentIntentId(session);

  // Update order with payment information (use 'completed' so DB constraint is satisfied; some DBs only allow pending|completed|cancelled|refunded)
  await updateOrderWithPaymentInfo(metadata.orderId, {
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: paymentIntentId || undefined,
    status: 'completed',
  });

  console.log(`Order ${metadata.orderId} updated: checkout session completed, payment intent: ${paymentIntentId}`);

  // Remove from cart only the products in this order (so express checkout doesn't wipe other items)
  const userId = metadata.userId;
  if (userId) {
    try {
      const orderWithItems = await getOrderWithItems(metadata.orderId);
      const productIds = (orderWithItems?.items ?? []).map((i) => i.product_id).filter(Boolean) as string[];
      if (productIds.length > 0) {
        await removeCartItemsByProductIds(userId, productIds);
      }
    } catch (error) {
      console.error('Error clearing cart after payment:', error);
      // Don't fail webhook; cart clear is non-critical
    }
  }

  // Create notification (non-blocking)
  try {
    const orderWithItems = await getOrderWithItems(metadata.orderId);
    if (orderWithItems && orderWithItems.user_id) {
      await createNotification({
        user_id: orderWithItems.user_id,
        type: 'order_confirmation',
        title: 'Order Confirmed',
        message: `Your order #${orderWithItems.order_number || 'N/A'} has been confirmed and is being processed.`,
        link: `/account/orders/${orderWithItems.id}`,
        metadata: { orderId: orderWithItems.id },
      });
    }
  } catch (error) {
    console.error('Error creating order confirmation notification:', error);
  }

  // Run fulfillment (payment receipt + DOER coupon). Single post-purchase email: receipt only; no separate order confirmation to avoid duplicate receipt emails.
  try {
    await runFulfillmentForOrder(metadata.orderId);
  } catch (error) {
    console.error('Error running fulfillment after checkout.session.completed:', error);
  }
}

/**
 * Handle payment_intent.succeeded event
 * Payment confirmed, order should move to completed
 */
export async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  // Find order by payment intent ID, or by metadata.orderId (when payment_intent.succeeded fires before checkout.session.completed)
  let order = await findOrderByPaymentIntentId(paymentIntent.id);
  if (!order && paymentIntent.metadata?.orderId) {
    const orderById = await getOrderById(paymentIntent.metadata.orderId as string);
    if (orderById) {
      order = orderById;
      await updateOrderWithPaymentInfo(order.id, { stripePaymentIntentId: paymentIntent.id });
    }
  }
  if (!order) {
    console.error('Payment intent succeeded but no order found for payment intent:', paymentIntent.id);
    return;
  }

  // Update order status to completed (idempotent if already completed by checkout.session.completed)
  await updateOrderWithPaymentInfo(order.id, {
    stripePaymentIntentId: paymentIntent.id,
    status: 'completed',
  });

  console.log(`Order ${order.id} updated: payment succeeded, status changed to completed`);

  // Remove from cart only the products in this order (so express checkout doesn't wipe other items)
  if (order.user_id) {
    try {
      const orderWithItems = await getOrderWithItems(order.id);
      const productIds = (orderWithItems?.items ?? []).map((i) => i.product_id).filter(Boolean) as string[];
      if (productIds.length > 0) {
        await removeCartItemsByProductIds(order.user_id, productIds);
      }
    } catch (error) {
      console.error('Error clearing cart after payment:', error);
    }
  }

  // Create payment received notification (non-blocking)
  try {
    if (order.user_id) {
      await createNotification({
        user_id: order.user_id,
        type: 'payment_received',
        title: 'Payment Received',
        message: `Your payment for order #${order.order_number || 'N/A'} has been processed successfully. Your products are now available in your library.`,
        link: `/account/library`,
        metadata: { orderId: order.id },
      });
    }
  } catch (error) {
    console.error('Error creating payment notification:', error);
  }

  // Run fulfillment only for Payment Element flow (no Checkout session). Checkout flow fulfillment runs in handleCheckoutSessionCompleted.
  if (!order.stripe_checkout_session_id) {
    try {
      await runFulfillmentForOrder(order.id);
    } catch (error) {
      console.error('Error running fulfillment after payment_intent.succeeded:', error);
    }
  }
}

/**
 * Handle payment_intent.payment_failed event
 * Payment failed, order should be marked as cancelled
 */
export async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  // Find order by payment intent ID
  const order = await findOrderByPaymentIntentId(paymentIntent.id);

  if (!order) {
    console.error('Payment intent failed but no order found for payment intent:', paymentIntent.id);
    return;
  }

  // Update order status to cancelled
  await updateOrderWithPaymentInfo(order.id, {
    stripePaymentIntentId: paymentIntent.id,
    status: 'cancelled',
  });

  console.log(`Order ${order.id} updated: payment failed, status changed to cancelled`);
}

/**
 * Handle charge.refunded event
 * Refund processed, order should be marked as refunded
 */
export async function handleChargeRefunded(
  charge: Stripe.Charge
): Promise<void> {
  // Find order by payment intent ID
  const paymentIntentId = typeof charge.payment_intent === 'string'
    ? charge.payment_intent
    : charge.payment_intent?.id;

  if (!paymentIntentId) {
    console.error('Charge refunded but no payment intent ID found:', charge.id);
    return;
  }

  const order = await findOrderByPaymentIntentId(paymentIntentId);

  if (!order) {
    console.error('Charge refunded but no order found for payment intent:', paymentIntentId);
    return;
  }

  // Update order status to refunded
  await updateOrderWithPaymentInfo(order.id, {
    stripePaymentIntentId: paymentIntentId,
    status: 'refunded',
  });

  console.log(`Order ${order.id} updated: charge refunded, status changed to refunded`);
}

/**
 * Run fulfillment for a completed order: generate DOER coupon, send receipt email, send DOER coupon email.
 * Used by both handleCheckoutSessionCompleted (Checkout flow) and handlePaymentIntentSucceeded (Payment Element flow only).
 * Uses getOrderWithItems (service role) so this works in webhook context where there is no user session.
 */
async function runFulfillmentForOrder(orderId: string): Promise<void> {
  const orderWithItems = await getOrderWithItems(orderId);
  if (!orderWithItems || !orderWithItems.user_id || !orderWithItems.customer_email) return;

  const order = orderWithItems;

  // Generate DOER coupon for package purchases
  try {
    const { generateDoerCouponForOrder } = await import('@/lib/doer/coupon');
    const couponGenerated = await generateDoerCouponForOrder(orderId);
    if (couponGenerated) {
      console.log(`Doer coupon generated for order ${orderId}`);
    }
  } catch (error) {
    console.error(`Error generating DOER coupon for order ${orderId}:`, error);
  }

  let totalAmount = parseFloat(String(orderWithItems.total_amount));
  let subtotal = parseFloat(String(orderWithItems.subtotal));
  let taxAmount: number | null = orderWithItems.tax_amount ? parseFloat(String(orderWithItems.tax_amount)) : null;
  let discountAmount: number | null = orderWithItems.discount_amount ? parseFloat(String(orderWithItems.discount_amount)) : null;
  let currency = orderWithItems.currency || 'USD';
  let items: Array<{ productName: string; quantity: number; unitPrice: number; total: number }> = (orderWithItems.items || []).map(item => ({
    productName: item.product_name,
    quantity: item.quantity,
    unitPrice: parseFloat(String(item.unit_price)),
    total: parseFloat(String(item.total_price)),
  }));

  const sessionId = order.stripe_checkout_session_id;
  if (sessionId) {
    try {
      const stripeAmounts = await getReceiptAmountsFromStripe(sessionId);
      if (stripeAmounts) {
        totalAmount = stripeAmounts.totalAmount;
        subtotal = stripeAmounts.subtotal;
        taxAmount = stripeAmounts.taxAmount;
        discountAmount = stripeAmounts.discountAmount;
        currency = stripeAmounts.currency;
        if (stripeAmounts.items.length > 0) {
          items = stripeAmounts.items;
        }
      }
    } catch {
      // Fall back to DB totals
    }
  }

  const emailData = {
    order: {
      id: orderWithItems.id,
      orderNumber: orderWithItems.order_number || '',
      status: orderWithItems.status || 'completed',
      totalAmount,
      subtotal,
      taxAmount,
      discountAmount,
      currency,
      createdAt: orderWithItems.created_at || new Date().toISOString(),
      customerEmail: orderWithItems.customer_email,
      customerName: orderWithItems.customer_name,
    },
    items,
  };

  const { getDoerCouponForOrder } = await import('@/lib/doer/coupon');
  const doerCouponCode = await getDoerCouponForOrder(orderId);
  if (doerCouponCode?.trim()) {
    emailData.doerCouponCode = doerCouponCode;
    emailData.doerCouponExpiresAt = orderWithItems.doer_coupon_expires_at ?? undefined;
  }

  try {
    await sendPaymentReceipt(order.user_id, emailData);
  } catch (error) {
    console.error('Error sending payment receipt email:', error);
  }
}

/**
 * Find order by payment intent ID
 * Searches orders table for matching payment intent ID
 */
async function findOrderByPaymentIntentId(paymentIntentId: string): Promise<Order | null> {
  const { createServiceRoleClient } = await import('@/lib/supabase/server');
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error finding order by payment intent ID:', error);
    return null;
  }

  return data;
}

