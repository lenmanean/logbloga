/**
 * Stripe server client utility
 * Provides configured Stripe client for server-side operations
 */

import Stripe from 'stripe';

/**
 * Get Stripe secret key from environment variables
 * Throws error if not configured
 */
function getStripeSecretKey(): string {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY is not configured. Please add it to your .env.local file.'
    );
  }

  // Validate key format (should start with sk_test_ or sk_live_)
  if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
    throw new Error(
      'STRIPE_SECRET_KEY appears to be invalid. It should start with sk_test_ or sk_live_.'
    );
  }

  return secretKey;
}

/**
 * Get Stripe webhook secret from environment variables
 * Returns undefined if not configured (for development)
 */
export function getStripeWebhookSecret(): string | undefined {
  return process.env.STRIPE_WEBHOOK_SECRET;
}

/**
 * Stripe client instance for server-side operations
 * Singleton pattern to reuse the same instance
 */
let stripeClient: Stripe | null = null;

/**
 * Get Stripe client instance
 * Creates a new instance if one doesn't exist
 */
export function getStripeClient(): Stripe {
  if (stripeClient) {
    return stripeClient;
  }

  const secretKey = getStripeSecretKey();

  stripeClient = new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
  });

  return stripeClient;
}

/**
 * Get Stripe publishable key from environment variables
 * Used for client-side operations
 */
export function getStripePublishableKey(): string {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured. Please add it to your .env.local file.'
    );
  }

  // Validate key format (should start with pk_test_ or pk_live_)
  if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
    throw new Error(
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY appears to be invalid. It should start with pk_test_ or pk_live_.'
    );
  }

  return publishableKey;
}

