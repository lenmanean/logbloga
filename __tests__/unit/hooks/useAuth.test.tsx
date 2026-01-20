import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { createTestUser, createTestSession } from '@/__tests__/utils/fixtures/users';

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
  })),
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide initial loading state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle sign in', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockClient = createClient() as any;
    const testUser = createTestUser();
    const testSession = createTestSession(testUser);

    mockClient.auth.signInWithPassword.mockResolvedValue({
      data: { user: testUser, session: testSession },
      error: null,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const signInResult = await result.current.signIn('test@example.com', 'password123');
    expect(signInResult.error).toBeNull();
  });

  it('should handle sign in error', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockClient = createClient() as any;

    mockClient.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials' },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const signInResult = await result.current.signIn('test@example.com', 'wrong');
    expect(signInResult.error).toBeTruthy();
  });

  it('should handle sign out', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockClient = createClient() as any;

    mockClient.auth.signOut.mockResolvedValue({ error: null });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const signOutResult = await result.current.signOut();
    expect(signOutResult.error).toBeNull();
  });

  it('should handle password reset', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockClient = createClient() as any;

    mockClient.auth.resetPasswordForEmail.mockResolvedValue({ error: null });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const resetResult = await result.current.resetPassword('test@example.com');
    expect(resetResult.error).toBeNull();
  });
});
