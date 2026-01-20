import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/auth/signup/route';
import { NextRequest } from 'next/server';
import { createMockSupabaseClient } from '@/__tests__/utils/mocks/supabase';

// Mock Supabase
vi.mock('@/lib/supabase/server', async () => {
  const actual = await vi.importActual('@/lib/supabase/server');
  return {
    ...actual,
    createClient: vi.fn(() => createMockSupabaseClient()),
    createServiceRoleClient: vi.fn(() => createMockSupabaseClient()),
  };
});

describe('Auth API Routes', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user with valid data', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockClient = createClient() as any;

      mockClient.auth.signUp = vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'user123',
            email: 'test@example.com',
          },
          session: null,
        },
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Password123!',
          full_name: 'Test User',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toBeTruthy();
      expect(data.user.email).toBe('test@example.com');
    });

    it('should reject invalid email', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'Password123!',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('should reject weak password', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'weak',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('should handle signup errors', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      const mockClient = createClient() as any;

      mockClient.auth.signUp = vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'User already exists' },
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'existing@example.com',
          password: 'Password123!',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });
});
