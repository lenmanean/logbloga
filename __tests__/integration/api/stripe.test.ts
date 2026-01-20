import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/stripe/webhook/route';
import { NextRequest } from 'next/server';
import { createMockStripeWebhookEvent } from '@/__tests__/utils/mocks/stripe';

// Mock Stripe
vi.mock('@/lib/stripe/client', () => ({
  getStripeClient: vi.fn(() => ({
    webhooks: {
      constructEvent: vi.fn((payload, signature, secret) => {
        return JSON.parse(payload.toString());
      }),
    },
  })),
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

      const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test-signature',
        },
        body: JSON.stringify(event),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should reject invalid signature', async () => {
      const { getStripeClient } = await import('@/lib/stripe/client');
      const mockStripe = getStripeClient() as any;

      mockStripe.webhooks.constructEvent = vi.fn(() => {
        throw new Error('Invalid signature');
      });

      const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        headers: {
          'stripe-signature': 'invalid-signature',
        },
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

      const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test-signature',
        },
        body: JSON.stringify(event),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });
});
