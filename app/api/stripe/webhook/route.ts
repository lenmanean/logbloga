/**
 * POST /api/stripe/webhook
 * Stripe webhook handler for payment events
 * 
 * This endpoint receives webhook events from Stripe and processes them
 * to update order statuses and payment information.
 * 
 * Configure this endpoint in Stripe Dashboard:
 * - For local testing: Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
 * - For production: Add webhook endpoint in Stripe Dashboard
 */

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripeClient, getStripeWebhookSecret } from '@/lib/stripe/client';
import { StripeWebhookSignatureError, formatStripeError } from '@/lib/stripe/errors';
import {
  handleCheckoutSessionCompleted,
  handlePaymentIntentSucceeded,
  handlePaymentIntentFailed,
  handleChargeRefunded,
} from '@/lib/stripe/webhooks';
import Stripe from 'stripe';

/**
 * Handle POST request from Stripe webhook
 * 
 * Stripe webhooks are sent as POST requests with the event payload
 * in the request body and the signature in the headers.
 */
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    
    // Get Stripe signature from headers
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature in webhook request');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Get webhook secret from environment
    const webhookSecret = getStripeWebhookSecret();

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    const stripe = getStripeClient();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Log webhook event received
    console.log(`Webhook event received: ${event.type} (ID: ${event.id})`);

    // Process webhook event based on type
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          await handleCheckoutSessionCompleted(session);
          break;
        }

        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await handlePaymentIntentSucceeded(paymentIntent);
          break;
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await handlePaymentIntentFailed(paymentIntent);
          break;
        }

        case 'charge.refunded': {
          const charge = event.data.object as Stripe.Charge;
          await handleChargeRefunded(charge);
          break;
        }

        default:
          // Log unhandled event types (not an error, just informative)
          console.log(`Unhandled webhook event type: ${event.type}`);
      }
    } catch (error) {
      console.error(`Error processing webhook event ${event.type}:`, error);
      // Return 500 so Stripe will retry the webhook
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);

    // For signature errors, return 400 (don't retry)
    if (error instanceof StripeWebhookSignatureError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // For other errors, return 500 so Stripe will retry
    const errorMessage = formatStripeError(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

