import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { createTestUser, createTestSession } from '@/__tests__/utils/fixtures/users';

// Create a shared mock client
const mockAuth = {
  getSession: vi.fn().mockResolvedValue({
    data: { session: null },
    error: null,
  }),
  onAuthStateChange: vi.fn(() => ({
    data: { subscription: { unsubscribe: vi.fn() } },
  })),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
};

const mockClient = {
  auth: mockAuth,
};

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => mockClient),
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide initial loading state', async () => {
    // Reset getSession mock
    mockAuth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Initially loading, then should finish
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle sign in', async () => {
    const testUser = createTestUser();
    const testSession = createTestSession(testUser);

    mockAuth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    mockAuth.signInWithPassword.mockResolvedValue({
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
    mockAuth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    mockAuth.signInWithPassword.mockResolvedValue({
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
    mockAuth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    mockAuth.signOut.mockResolvedValue({ error: null });

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
    mockAuth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    mockAuth.resetPasswordForEmail.mockResolvedValue({ error: null });

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
