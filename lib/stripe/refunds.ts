/**
 * Stripe refund utilities
 * Provides functions for creating and managing Stripe refunds
 */

import Stripe from 'stripe';
import { getStripeClient } from './client';
import { StripeError, formatStripeError } from './errors';

export interface RefundOptions {
  amount?: number; // Amount in cents. If not provided, full refund
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
  metadata?: Record<string, string>;
}

export interface RefundResult {
  id: string;
  amount: number;
  status: string;
  currency: string;
  reason: string | null;
}

/**
 * Refund error class
 */
export class StripeRefundError extends StripeError {
  constructor(message: string, originalError?: unknown) {
    super(
      `Failed to process refund: ${message}`,
      'REFUND_FAILED',
      500
    );
    this.name = 'StripeRefundError';
    
    if (originalError instanceof Error) {
      this.cause = originalError;
    }
  }
}

/**
 * Create a refund for a payment intent
 * 
 * @param paymentIntentId - Stripe payment intent ID
 * @param options - Refund options (amount, reason, metadata)
 * @returns Refund result with refund details
 * @throws StripeRefundError if refund fails
 */
export async function createRefund(
  paymentIntentId: string,
  options?: RefundOptions
): Promise<RefundResult> {
  if (!paymentIntentId) {
    throw new StripeRefundError('Payment intent ID is required');
  }

  try {
    const stripe = getStripeClient();

    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    };

    // Add optional parameters
    if (options?.amount) {
      refundParams.amount = options.amount;
    }

    if (options?.reason) {
      refundParams.reason = options.reason;
    }

    if (options?.metadata) {
      refundParams.metadata = options.metadata;
    }

    const refund = await stripe.refunds.create(refundParams);

    return {
      id: refund.id,
      amount: refund.amount,
      status: refund.status || 'pending',
      currency: refund.currency,
      reason: refund.reason || null,
    };
  } catch (error) {
    const errorMessage = formatStripeError(error);
    throw new StripeRefundError(errorMessage, error);
  }
}

/**
 * Create a full refund for a payment intent
 * Convenience function that creates a full refund
 */
export async function createFullRefund(
  paymentIntentId: string,
  reason?: RefundOptions['reason'],
  metadata?: Record<string, string>
): Promise<RefundResult> {
  return createRefund(paymentIntentId, {
    reason,
    metadata,
  });
}

/**
 * Create a partial refund for a payment intent
 * 
 * @param paymentIntentId - Stripe payment intent ID
 * @param amount - Amount to refund in cents
 * @param reason - Reason for refund
 * @param metadata - Additional metadata
 */
export async function createPartialRefund(
  paymentIntentId: string,
  amount: number,
  reason?: RefundOptions['reason'],
  metadata?: Record<string, string>
): Promise<RefundResult> {
  if (amount <= 0) {
    throw new StripeRefundError('Refund amount must be greater than 0');
  }

  return createRefund(paymentIntentId, {
    amount,
    reason,
    metadata,
  });
}
