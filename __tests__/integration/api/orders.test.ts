import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/orders/create/route';
import { NextRequest } from 'next/server';
import { createMockSupabaseClient } from '@/__tests__/utils/mocks/supabase';
import { createTestOrder } from '@/__tests__/utils/fixtures/orders';

// Mock Supabase
vi.mock('@/lib/supabase/server', async () => {
  const actual = await vi.importActual('@/lib/supabase/server');
  return {
    ...actual,
    createClient: vi.fn(() => createMockSupabaseClient()),
    createServiceRoleClient: vi.fn(() => createMockSupabaseClient()),
  };
});

// Mock auth
vi.mock('@/lib/auth/utils', () => ({
  requireAuth: vi.fn(),
}));

// Mock cart db functions
vi.mock('@/lib/db/cart', () => ({
  getUserCartItems: vi.fn(),
  clearUserCart: vi.fn(() => Promise.resolve()),
}));

// Mock orders db functions
vi.mock('@/lib/db/orders', () => ({
  createOrderWithItems: vi.fn(),
  getMostRecentPendingOrderForUser: vi.fn(() => Promise.resolve(null)),
}));

// Mock coupons db functions
vi.mock('@/lib/db/coupons', () => ({
  validateCoupon: vi.fn(() => Promise.resolve({ valid: true, coupon: null })),
}));

// Mock notifications db
vi.mock('@/lib/db/notifications-db', () => ({
  createNotification: vi.fn(() => Promise.resolve()),
}));

// Mock Stripe
vi.mock('@/lib/stripe/client', () => ({
  getStripeClient: vi.fn(() => ({
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          id: 'cs_test_123',
          url: 'https://checkout.stripe.com/test',
        }),
      },
    },
  })),
}));

describe('Orders API Routes', () => {
  describe('POST /api/orders/create', () => {
    it('should create order with valid data', async () => {
      const { requireAuth } = await import('@/lib/auth/utils');
      const testUser = { id: 'user123', email: 'test@example.com' };
      vi.mocked(requireAuth).mockResolvedValue(testUser as any);

      const { getUserCartItems } = await import('@/lib/db/cart');
      const { createOrderWithItems } = await import('@/lib/db/orders');
      
      vi.mocked(getUserCartItems).mockResolvedValue([
        { id: 'item1', product_id: 'prod123', quantity: 1, product: { id: 'prod123', price: 99.99, active: true } }
      ] as any);
      vi.mocked(createOrderWithItems).mockResolvedValue(createTestOrder() as any);

      const request = new NextRequest('http://localhost:3000/api/orders/create', {
        method: 'POST',
        body: JSON.stringify({
          customerInfo: {
            email: 'test@example.com',
            name: 'Test User',
          },
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should reject order without items', async () => {
      const { requireAuth } = await import('@/lib/auth/utils');
      const testUser = { id: 'user123' };
      vi.mocked(requireAuth).mockResolvedValue(testUser as any);

      // Mock empty cart
      const { getUserCartItems } = await import('@/lib/db/cart');
      vi.mocked(getUserCartItems).mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/orders/create', {
        method: 'POST',
        body: JSON.stringify({
          items: [],
          customer_email: 'test@example.com',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('should require authentication', async () => {
      const { requireAuth } = await import('@/lib/auth/utils');
      const authError = new Error('Unauthorized');
      (authError as any).status = 401;
      (authError as any).redirect = '/auth/signin';
      vi.mocked(requireAuth).mockRejectedValue(authError);

      const request = new NextRequest('http://localhost:3000/api/orders/create', {
        method: 'POST',
        body: JSON.stringify({
          items: [{ product_id: 'prod123', quantity: 1 }],
        }),
      });

      // Error will be thrown and caught, but route handler checks for redirect property
      // So it will be re-thrown by Next.js error handling
      try {
        const response = await POST(request);
        // If error is caught and handled, should return error status
        expect(response.status).toBeGreaterThanOrEqual(400);
      } catch (error) {
        // Error might be thrown which is expected for redirect errors
        expect((error as any).status).toBe(401);
      }
    });
  });
});
