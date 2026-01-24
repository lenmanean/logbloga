/**
 * Stripe webhook event processors
 * Handles various Stripe webhook events and updates orders accordingly
 */

import type Stripe from 'stripe';
import { getOrderWithItems, updateOrderWithPaymentInfo } from '@/lib/db/orders';
import { getPaymentIntentId, extractCheckoutMetadata } from './utils';
import { stripeStatusToOrderStatus } from './utils';
import type { Order } from '@/lib/types/database';
import { sendOrderConfirmation, sendPaymentReceipt } from '@/lib/email/senders';
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

  // Update order with payment information
  await updateOrderWithPaymentInfo(metadata.orderId, {
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: paymentIntentId || undefined,
    status: 'processing', // Will be updated to 'completed' when payment_intent.succeeded fires
  });

  console.log(`Order ${metadata.orderId} updated: checkout session completed, payment intent: ${paymentIntentId}`);

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

  // Send order confirmation email (non-blocking)
  try {
    const orderWithItems = await getOrderWithItems(metadata.orderId);
    if (orderWithItems && orderWithItems.user_id && orderWithItems.customer_email) {
      const emailData = {
        order: {
          id: orderWithItems.id,
          orderNumber: orderWithItems.order_number || '',
          status: orderWithItems.status || 'processing',
          totalAmount: parseFloat(String(orderWithItems.total_amount)),
          subtotal: parseFloat(String(orderWithItems.subtotal)),
          taxAmount: orderWithItems.tax_amount ? parseFloat(String(orderWithItems.tax_amount)) : null,
          discountAmount: orderWithItems.discount_amount ? parseFloat(String(orderWithItems.discount_amount)) : null,
          currency: orderWithItems.currency || 'USD',
          createdAt: orderWithItems.created_at || new Date().toISOString(),
          customerEmail: orderWithItems.customer_email,
          customerName: orderWithItems.customer_name,
        },
        items: (orderWithItems.items || []).map(item => ({
          productName: item.product_name,
          quantity: item.quantity,
          unitPrice: parseFloat(String(item.unit_price)),
          total: parseFloat(String(item.total_price)),
        })),
      };
      await sendOrderConfirmation(orderWithItems.user_id, emailData);
    }
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
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

  // Generate DOER coupon for package purchases
  try {
    const { generateDoerCouponForOrder } = await import('@/lib/doer/coupon');
    const couponCode = await generateDoerCouponForOrder(order.id);
    if (couponCode) {
      console.log(`Generated DOER coupon ${couponCode} for order ${order.id}`);
    }
  } catch (error) {
    // Log error but don't fail the webhook (coupon generation is optional)
    console.error(`Error generating DOER coupon for order ${order.id}:`, error);
  }

  // Send payment receipt email (non-blocking)
  if (order.user_id) {
    try {
      const orderWithItems = await getOrderWithItems(order.id);
      if (orderWithItems && orderWithItems.customer_email) {
        // Get DOER coupon code if available
        const { getDoerCouponForOrder } = await import('@/lib/doer/coupon');
        const { createServiceRoleClient } = await import('@/lib/supabase/server');
        const doerCouponCode = await getDoerCouponForOrder(order.id);
        
        // Get coupon expiration if available
        const supabaseForCoupon = await createServiceRoleClient();
        const { data: orderData } = await supabaseForCoupon
          .from('orders')
          .select('doer_coupon_expires_at')
          .eq('id', order.id)
          .single() as any;

        const emailData = {
          order: {
            id: orderWithItems.id,
            orderNumber: orderWithItems.order_number || '',
            status: orderWithItems.status || 'completed',
            totalAmount: parseFloat(String(orderWithItems.total_amount)),
            subtotal: parseFloat(String(orderWithItems.subtotal)),
            taxAmount: orderWithItems.tax_amount ? parseFloat(String(orderWithItems.tax_amount)) : null,
            discountAmount: orderWithItems.discount_amount ? parseFloat(String(orderWithItems.discount_amount)) : null,
            currency: orderWithItems.currency || 'USD',
            createdAt: orderWithItems.created_at || new Date().toISOString(),
            customerEmail: orderWithItems.customer_email,
            customerName: orderWithItems.customer_name,
          },
          items: (orderWithItems.items || []).map(item => ({
            productName: item.product_name,
            quantity: item.quantity,
            unitPrice: parseFloat(String(item.unit_price)),
            total: parseFloat(String(item.total_price)),
          })),
          doerCouponCode: doerCouponCode || null,
          doerCouponExpiresAt: (orderData as any)?.doer_coupon_expires_at || null,
        };

        // Send payment receipt - products are now available in library via order-based access
        await sendPaymentReceipt(order.user_id, emailData);
      }
    } catch (error) {
      console.error('Error sending payment receipt email:', error);
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

