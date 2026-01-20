import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/auth/signup/route';
import { NextRequest } from 'next/server';
import { createMockSupabaseClient } from '@/__tests__/utils/mocks/supabase';

// Create a shared mock client with configurable auth methods
const mockAuthSignUp = vi.fn();
const mockClient = createMockSupabaseClient();
mockClient.auth = {
  ...mockClient.auth,
  signUp: mockAuthSignUp,
} as any;

// Mock Supabase
vi.mock('@/lib/supabase/server', async () => {
  const actual = await vi.importActual('@/lib/supabase/server');
  return {
    ...actual,
    createClient: vi.fn(() => mockClient),
    createServiceRoleClient: vi.fn(() => createMockSupabaseClient()),
  };
});

describe('Auth API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user with valid data', async () => {
      mockAuthSignUp.mockResolvedValue({
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

      expect(response.status).toBe(201); // Signup returns 201 on success
      expect(data.user).toBeTruthy();
      expect(data.user.email).toBe('test@example.com');
    });

    it('should reject invalid email', async () => {
      // Supabase will validate email format
      mockAuthSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid email address' },
      });

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
      // Supabase will validate password strength
      mockAuthSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Password should be at least 8 characters' },
      });

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
      mockAuthSignUp.mockResolvedValue({
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
