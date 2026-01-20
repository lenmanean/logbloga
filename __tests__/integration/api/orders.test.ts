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
      const { getCurrentUser } = await import('@/lib/auth/utils');
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
      } as any);

      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const mockClient = createServiceRoleClient() as any;
      const testOrder = createTestOrder();

      mockClient.from = vi.fn((table: string) => {
        if (table === 'orders') {
          return {
            insert: vi.fn().mockResolvedValue({
              data: [testOrder],
              error: null,
            }),
          };
        }
        if (table === 'order_items') {
          return {
            insert: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        };
      });

      const request = new NextRequest('http://localhost:3000/api/orders/create', {
        method: 'POST',
        body: JSON.stringify({
          items: [
            {
              product_id: 'prod123',
              quantity: 1,
            },
          ],
          customer_email: 'test@example.com',
          customer_name: 'Test User',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should reject order without items', async () => {
      const { getCurrentUser } = await import('@/lib/auth/utils');
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user123',
      } as any);

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
      const { getCurrentUser } = await import('@/lib/auth/utils');
      vi.mocked(getCurrentUser).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/orders/create', {
        method: 'POST',
        body: JSON.stringify({
          items: [{ product_id: 'prod123', quantity: 1 }],
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
    });
  });
});
