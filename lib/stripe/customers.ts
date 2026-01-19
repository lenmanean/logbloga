/**
 * Stripe customer and payment method management
 * Provides functions to manage Stripe customers and their payment methods
 */

import { getStripeClient } from './client';
import type Stripe from 'stripe';
import { getUserProfile, updateUserProfile } from '@/lib/db/profiles';

/**
 * Get or create a Stripe customer for a user
 * Stores the customer ID in the user's profile
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<Stripe.Customer> {
  const stripe = getStripeClient();

  // Check if user already has a Stripe customer ID
  const profile = await getUserProfile(userId);
  
  if (profile && 'stripe_customer_id' in profile && (profile as any).stripe_customer_id) {
    try {
      const customer = await stripe.customers.retrieve((profile as any).stripe_customer_id);
      if (customer && !customer.deleted) {
        return customer as Stripe.Customer;
      }
    } catch (error) {
      // Customer doesn't exist in Stripe, create a new one
      console.log('Stripe customer not found, creating new one');
    }
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      userId,
    },
  });

  // Store customer ID in profile
  await updateUserProfile(userId, {
    stripe_customer_id: customer.id,
  });

  return customer;
}

/**
 * Get Stripe customer ID from user profile
 */
export async function getStripeCustomerId(userId: string): Promise<string | null> {
  const profile = await getUserProfile(userId);
  return (profile && 'stripe_customer_id' in profile) ? ((profile as any).stripe_customer_id || null) : null;
}

/**
 * Get all payment methods for a Stripe customer
 */
export async function getStripePaymentMethods(
  customerId: string
): Promise<Stripe.PaymentMethod[]> {
  const stripe = getStripeClient();

  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });

  return paymentMethods.data;
}

/**
 * Attach a payment method to a customer
 */
export async function attachPaymentMethod(
  customerId: string,
  paymentMethodId: string
): Promise<Stripe.PaymentMethod> {
  const stripe = getStripeClient();

  const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });

  return paymentMethod;
}

/**
 * Detach a payment method from a customer
 */
export async function detachPaymentMethod(
  paymentMethodId: string
): Promise<Stripe.PaymentMethod> {
  const stripe = getStripeClient();

  const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);

  return paymentMethod;
}

/**
 * Set default payment method for a customer
 */
export async function setDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
): Promise<Stripe.Customer> {
  const stripe = getStripeClient();

  const customer = await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  return customer;
}

/**
 * Create a setup intent for adding a payment method
 */
export async function createSetupIntent(
  customerId: string
): Promise<Stripe.SetupIntent> {
  const stripe = getStripeClient();

  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
  });

  return setupIntent;
}

/**
 * Get customer's default payment method
 */
export async function getDefaultPaymentMethod(
  customerId: string
): Promise<Stripe.PaymentMethod | null> {
  const stripe = getStripeClient();

  const customer = await stripe.customers.retrieve(customerId);

  if (customer.deleted || !customer.invoice_settings?.default_payment_method) {
    return null;
  }

  const paymentMethodId = customer.invoice_settings.default_payment_method as string;
  
  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    return paymentMethod;
  } catch (error) {
    console.error('Error retrieving default payment method:', error);
    return null;
  }
}

