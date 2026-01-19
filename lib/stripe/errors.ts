/**
 * Custom Stripe error types and error handling utilities
 */

/**
 * Base Stripe error class
 */
export class StripeError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'StripeError';
  }
}

/**
 * Webhook signature verification error
 */
export class StripeWebhookSignatureError extends StripeError {
  constructor(message: string = 'Invalid webhook signature') {
    super(message, 'WEBHOOK_SIGNATURE_VERIFICATION_FAILED', 401);
    this.name = 'StripeWebhookSignatureError';
  }
}

/**
 * Order not found error
 */
export class StripeOrderNotFoundError extends StripeError {
  constructor(orderId: string) {
    super(`Order not found: ${orderId}`, 'ORDER_NOT_FOUND', 404);
    this.name = 'StripeOrderNotFoundError';
  }
}

/**
 * Invalid order status error
 */
export class StripeInvalidOrderStatusError extends StripeError {
  constructor(currentStatus: string, expectedStatus: string) {
    super(
      `Invalid order status. Current: ${currentStatus}, Expected: ${expectedStatus}`,
      'INVALID_ORDER_STATUS',
      400
    );
    this.name = 'StripeInvalidOrderStatusError';
  }
}

/**
 * Checkout session creation error
 */
export class StripeCheckoutSessionError extends StripeError {
  constructor(message: string, originalError?: unknown) {
    super(
      `Failed to create checkout session: ${message}`,
      'CHECKOUT_SESSION_CREATION_FAILED',
      500
    );
    this.name = 'StripeCheckoutSessionError';
    
    if (originalError instanceof Error) {
      this.cause = originalError;
    }
  }
}

/**
 * Format Stripe API error for client consumption
 * Removes sensitive information
 */
export function formatStripeError(error: unknown): string {
  if (error instanceof StripeError) {
    // Don't expose internal error details to client
    return error.message;
  }

  if (error instanceof Error) {
    // For unknown errors, return generic message
    return 'An error occurred while processing your payment. Please try again.';
  }

  return 'An unexpected error occurred. Please try again.';
}
