import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/stripe/webhook/route';
import { NextRequest } from 'next/server';
import { createMockStripeWebhookEvent } from '@/__tests__/utils/mocks/stripe';

// Mock Next.js headers
vi.mock('next/headers', async () => {
  const headers = vi.fn(async () => {
    const h = new Headers();
    h.set('stripe-signature', 'test-signature');
    return h;
  });
  return {
    headers,
  };
});

// Mock Stripe
const mockConstructEvent = vi.fn();
vi.mock('@/lib/stripe/client', () => ({
  getStripeClient: vi.fn(() => ({
    webhooks: {
      constructEvent: mockConstructEvent,
    },
  })),
  getStripeWebhookSecret: vi.fn(() => 'test-secret'),
}));

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createServiceRoleClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
      update: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    })),
  })),
}));

describe('Stripe API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock webhook handlers
    vi.mock('@/lib/stripe/webhooks', () => ({
      handleCheckoutSessionCompleted: vi.fn(() => Promise.resolve()),
      handlePaymentIntentSucceeded: vi.fn(() => Promise.resolve()),
      handlePaymentIntentFailed: vi.fn(() => Promise.resolve()),
      handleChargeRefunded: vi.fn(() => Promise.resolve()),
    }));
  });

  describe('POST /api/stripe/webhook', () => {
    it('should handle checkout.session.completed event', async () => {
      const event = createMockStripeWebhookEvent('checkout.session.completed', {
        id: 'cs_test_123',
        payment_status: 'paid',
        status: 'complete',
        metadata: {
          orderId: 'order123',
        },
      });

      mockConstructEvent.mockReturnValue(event);

      const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        body: JSON.stringify(event),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should reject invalid signature', async () => {
      // Make constructEvent throw an error for invalid signature
      mockConstructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('should handle payment_intent.succeeded event', async () => {
      const event = createMockStripeWebhookEvent('payment_intent.succeeded', {
        id: 'pi_test_123',
        status: 'succeeded',
        amount: 1000,
      });

      mockConstructEvent.mockReturnValue(event);

      const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        body: JSON.stringify(event),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });
});
