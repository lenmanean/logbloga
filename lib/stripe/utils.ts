/**
 * Stripe utility functions
 * Helper functions for Stripe operations
 */

import type Stripe from 'stripe';
import type { OrderStatusFromPayment } from './types';
import { STRIPE_TO_ORDER_STATUS } from './types';

/**
 * Convert Stripe payment intent status to order status
 */
export function stripeStatusToOrderStatus(
  paymentStatus: string
): OrderStatusFromPayment {
  return STRIPE_TO_ORDER_STATUS[paymentStatus] || 'processing';
}

/**
 * Format amount for Stripe (convert dollars to cents)
 */
export function formatAmountForStripe(amount: number): number {
  // Round to 2 decimal places and convert to cents
  return Math.round(amount * 100);
}

/**
 * Format amount from Stripe (convert cents to dollars)
 */
export function formatAmountFromStripe(amount: number): number {
  // Convert cents to dollars
  return amount / 100;
}

/**
 * Extract metadata from Stripe checkout session
 */
export function extractCheckoutMetadata(
  session: Stripe.Checkout.Session
): {
  orderId?: string;
  orderNumber?: string;
  userId?: string;
} {
  if (!session.metadata) {
    return {};
  }

  return {
    orderId: session.metadata.orderId,
    orderNumber: session.metadata.orderNumber,
    userId: session.metadata.userId,
  };
}

/**
 * Validate Stripe checkout session is paid
 */
export function isCheckoutSessionPaid(
  session: Stripe.Checkout.Session
): boolean {
  return session.payment_status === 'paid' && session.status === 'complete';
}

/**
 * Get payment intent ID from checkout session
 */
export function getPaymentIntentId(
  session: Stripe.Checkout.Session
): string | null {
  if (typeof session.payment_intent === 'string') {
    return session.payment_intent;
  }

  if (session.payment_intent && typeof session.payment_intent === 'object') {
    return session.payment_intent.id;
  }

  return null;
}

