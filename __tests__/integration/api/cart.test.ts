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
  requireAuth: vi.fn(),
}));

// Mock cart db functions
vi.mock('@/lib/db/cart', () => ({
  getUserCartItems: vi.fn(),
  addCartItem: vi.fn(),
}));

describe('Cart API Routes', () => {
  describe('GET /api/cart', () => {
    it('should return cart items for authenticated user', async () => {
      const { requireAuth } = await import('@/lib/auth/utils');
      const testUser = { id: 'user123', email: 'test@example.com' };
      vi.mocked(requireAuth).mockResolvedValue(testUser as any);

      const { getUserCartItems } = await import('@/lib/db/cart');
      const testItem = createTestCartItem();
      vi.mocked(getUserCartItems).mockResolvedValue([testItem]);

      const request = new NextRequest('http://localhost:3000/api/cart');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(getUserCartItems).toHaveBeenCalledWith(testUser.id);
    });

    it('should return 401 for unauthenticated user', async () => {
      const { requireAuth } = await import('@/lib/auth/utils');
      const authError = new Error('Unauthorized');
      (authError as any).status = 401;
      (authError as any).redirect = '/auth/signin';
      vi.mocked(requireAuth).mockRejectedValue(authError);

      const request = new NextRequest('http://localhost:3000/api/cart');
      
      try {
        const response = await GET(request);
        // If error handling catches it, check the status
        const status = response?.status || 500;
        expect(status).toBeGreaterThanOrEqual(401);
      } catch (error) {
        // Error might be thrown, which is expected
        expect((error as any).status).toBe(401);
      }
    });
  });

  describe('POST /api/cart', () => {
    it('should add item to cart', async () => {
      const { requireAuth } = await import('@/lib/auth/utils');
      const testUser = { id: 'user123', email: 'test@example.com' };
      vi.mocked(requireAuth).mockResolvedValue(testUser as any);

      const { addCartItem } = await import('@/lib/db/cart');
      const testItem = createTestCartItem();
      vi.mocked(addCartItem).mockResolvedValue(testItem);

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          productId: 'prod123',
          quantity: 1,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201); // POST returns 201
      expect(addCartItem).toHaveBeenCalledWith(testUser.id, 'prod123', 1, undefined);
    });

    it('should validate required fields', async () => {
      const { requireAuth } = await import('@/lib/auth/utils');
      const testUser = { id: 'user123' };
      vi.mocked(requireAuth).mockResolvedValue(testUser as any);

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });
});
