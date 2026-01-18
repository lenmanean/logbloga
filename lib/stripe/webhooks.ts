/**
 * Stripe webhook event processors
 * Handles various Stripe webhook events and updates orders accordingly
 */

import type Stripe from 'stripe';
import { getOrderWithItems, updateOrderWithPaymentInfo } from '@/lib/db/orders';
import { getPaymentIntentId, extractCheckoutMetadata } from './utils';
import { stripeStatusToOrderStatus } from './utils';
import type { Order } from '@/lib/types/database';

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

  // Update order with payment information
  await updateOrderWithPaymentInfo(metadata.orderId, {
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: paymentIntentId || undefined,
    status: 'processing', // Will be updated to 'completed' when payment_intent.succeeded fires
  });

  console.log(`Order ${metadata.orderId} updated: checkout session completed, payment intent: ${paymentIntentId}`);
}

/**
 * Handle payment_intent.succeeded event
 * Payment confirmed, order should move to completed
 */
export async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  // Find order by payment intent ID
  const order = await findOrderByPaymentIntentId(paymentIntent.id);

  if (!order) {
    console.error('Payment intent succeeded but no order found for payment intent:', paymentIntent.id);
    return;
  }

  // Update order status to completed
  await updateOrderWithPaymentInfo(order.id, {
    stripePaymentIntentId: paymentIntent.id,
    status: 'completed',
  });

  console.log(`Order ${order.id} updated: payment succeeded, status changed to completed`);
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

