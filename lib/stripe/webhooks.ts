/**
 * Stripe webhook event processors
 * Handles various Stripe webhook events and updates orders accordingly
 */

import type Stripe from 'stripe';
import { getOrderWithItems, updateOrderWithPaymentInfo } from '@/lib/db/orders';
import { clearUserCart } from '@/lib/db/cart';
import { getPaymentIntentId, extractCheckoutMetadata } from './utils';
import { getReceiptAmountsFromStripe } from './receipt-from-stripe';
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

  // Clear cart only after successful payment (so abandoned checkouts keep cart)
  const userId = metadata.userId;
  if (userId) {
    try {
      await clearUserCart(userId);
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

  // Clear cart after successful payment (PaymentIntent-only flow has no Checkout Session)
  if (order.user_id) {
    try {
      await clearUserCart(order.user_id);
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

  // Generate DOER coupon for package purchases
  try {
    const { generateDoerCouponForOrder } = await import('@/lib/doer/coupon');
    const couponGenerated = await generateDoerCouponForOrder(order.id);
    if (couponGenerated) {
      console.log(`Doer coupon generated for order ${order.id}`);
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
        const { getDoerCouponForOrder } = await import('@/lib/doer/coupon');
        const doerCouponCode = await getDoerCouponForOrder(order.id);

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

        // When there is a Checkout Session, use Stripe amounts for receipt; otherwise use DB only (PaymentIntent-only flow)
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
            // Fall back to DB totals; already set above
          }
        }
        // When no session: totalAmount, subtotal, taxAmount, discountAmount, items already from DB above

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
          doerCouponCode: doerCouponCode || null,
          doerCouponExpiresAt: orderWithItems.doer_coupon_expires_at ?? null,
        };

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

