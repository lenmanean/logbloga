/**
 * Stripe type definitions and interfaces
 * Additional types for Stripe integration
 */

import type Stripe from 'stripe';

/**
 * Stripe Checkout Session metadata
 * Used to store order-related data in Stripe sessions
 */
export interface StripeCheckoutMetadata {
  orderId: string;
  orderNumber: string;
  userId: string;
}

/**
 * Stripe webhook event types we handle
 */
export type StripeWebhookEventType =
  | 'checkout.session.completed'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'charge.refunded';

/**
 * Stripe webhook event with typed data
 */
export interface StripeWebhookEvent {
  id: string;
  type: StripeWebhookEventType;
  data: Stripe.Event.Data;
}

/**
 * Order status mapping from Stripe payment status
 */
export type OrderStatusFromPayment = 'processing' | 'completed' | 'cancelled' | 'refunded';

/**
 * Stripe payment intent status to order status mapping
 */
export const STRIPE_TO_ORDER_STATUS: Record<string, OrderStatusFromPayment> = {
  succeeded: 'completed',
  processing: 'processing',
  requires_payment_method: 'cancelled',
  requires_confirmation: 'processing',
  requires_action: 'processing',
  requires_capture: 'processing',
  canceled: 'cancelled',
};

/**
 * Checkout session completed event data
 */
export interface CheckoutSessionCompletedData {
  sessionId: string;
  paymentIntentId: string | null;
  customerEmail: string;
  amountTotal: number;
  metadata: StripeCheckoutMetadata;
}

