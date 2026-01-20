import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST } from '@/app/api/cart/route';
import { NextRequest } from 'next/server';
import { createMockSupabaseClient } from '@/__tests__/utils/mocks/supabase';
import { createTestCartItem } from '@/__tests__/utils/fixtures/cart';

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
  getCurrentUser: vi.fn(),
  requireAuth: vi.fn(),
}));

describe('Cart API Routes', () => {
  describe('GET /api/cart', () => {
    it('should return cart items for authenticated user', async () => {
      const { getCurrentUser } = await import('@/lib/auth/utils');
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
      } as any);

      const { createClient } = await import('@/lib/supabase/server');
      const mockClient = createClient() as any;
      const testItems = [createTestCartItem()];

      mockClient.from = vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: testItems,
          error: null,
        }),
      }));

      const request = new NextRequest('http://localhost:3000/api/cart');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data.items)).toBe(true);
    });

    it('should return 401 for unauthenticated user', async () => {
      const { getCurrentUser } = await import('@/lib/auth/utils');
      vi.mocked(getCurrentUser).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/cart');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/cart', () => {
    it('should add item to cart', async () => {
      const { getCurrentUser } = await import('@/lib/auth/utils');
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
      } as any);

      const { createClient } = await import('@/lib/supabase/server');
      const mockClient = createClient() as any;

      mockClient.from = vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({
          data: [{ id: 'cart123', product_id: 'prod123', quantity: 1 }],
          error: null,
        }),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }));

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          product_id: 'prod123',
          quantity: 1,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should validate required fields', async () => {
      const { getCurrentUser } = await import('@/lib/auth/utils');
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user123',
      } as any);

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });
});
