import { vi } from 'vitest';
import type Stripe from 'stripe';

/**
 * Create a mock Stripe client
 */
export function createMockStripeClient(): Partial<Stripe> {
  return {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          id: 'cs_test_123',
          url: 'https://checkout.stripe.com/test',
          status: 'open',
        } as Stripe.Checkout.Session),
        retrieve: vi.fn().mockResolvedValue({
          id: 'cs_test_123',
          status: 'complete',
          payment_status: 'paid',
          customer: 'cus_test_123',
          metadata: {},
        } as Stripe.Checkout.Session),
      } as any,
    } as any,
    paymentIntents: {
      create: vi.fn().mockResolvedValue({
        id: 'pi_test_123',
        status: 'succeeded',
        amount: 1000,
        currency: 'usd',
      } as Stripe.PaymentIntent),
      retrieve: vi.fn().mockResolvedValue({
        id: 'pi_test_123',
        status: 'succeeded',
        amount: 1000,
        currency: 'usd',
      } as Stripe.PaymentIntent),
    } as any,
    customers: {
      create: vi.fn().mockResolvedValue({
        id: 'cus_test_123',
        email: 'test@example.com',
      } as Stripe.Customer),
      retrieve: vi.fn().mockResolvedValue({
        id: 'cus_test_123',
        email: 'test@example.com',
      } as Stripe.Customer),
      update: vi.fn().mockResolvedValue({
        id: 'cus_test_123',
        email: 'test@example.com',
      } as Stripe.Customer),
    } as any,
    refunds: {
      create: vi.fn().mockResolvedValue({
        id: 're_test_123',
        status: 'succeeded',
        amount: 1000,
      } as Stripe.Refund),
    } as any,
    webhooks: {
      constructEvent: vi.fn().mockImplementation((payload, signature, secret) => {
        return JSON.parse(payload.toString());
      }),
    } as any,
  } as any;
}

/**
 * Create a mock Stripe webhook event
 */
export function createMockStripeWebhookEvent(
  type: string,
  data: any
): Stripe.Event {
  return {
    id: 'evt_test_123',
    object: 'event',
    type: type as Stripe.Event.Type,
    data: {
      object: data,
    },
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    pending_webhooks: 0,
    request: {
      id: 'req_test_123',
      idempotency_key: null,
    },
    api_version: '2024-01-01',
  } as Stripe.Event;
}
