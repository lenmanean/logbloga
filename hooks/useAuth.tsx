'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * User interface - compatible with Supabase Auth
 */
export interface User {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  [key: string]: any; // Allow additional properties for flexibility
}

/**
 * Authentication context interface
 */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateUser: (updates: { email?: string; password?: string; data?: Record<string, any> }) => Promise<{ error: Error | null }>;
  refreshSession: () => Promise<void>;
}

/**
 * Authentication Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Convert Supabase user to our User interface
 */
function mapSupabaseUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) return null;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
    image: supabaseUser.user_metadata?.avatar_url,
    ...supabaseUser.user_metadata,
  };
}

/**
 * AuthProvider Component
 * 
 * Provides authentication context to the entire application.
 * Manages Supabase auth state and provides auth methods.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = React.useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return createClient();
    } catch (error) {
      // During static generation, env vars might not be available
      return null;
    }
  }, []) as ReturnType<typeof createClient> | null;

  // Initialize auth state and set up listener
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined' || !supabase) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      setIsLoading(false);

      // Handle token refresh
      if (event === 'TOKEN_REFRESHED') {
        // Session refreshed automatically
      }

      // Handle sign out
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error('Supabase client not initialized') };
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string, metadata?: { full_name?: string }) => {
    if (!supabase) {
      return { error: new Error('Supabase client not initialized') };
    }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {},
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  /**
   * Sign out current user
   */
  const signOut = async () => {
    if (!supabase) {
      return { error: new Error('Supabase client not initialized') };
    }
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error };
      }

      setUser(null);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  /**
   * Reset password (send reset email)
   */
  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: new Error('Supabase client not initialized') };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password?token=reset_token`,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  /**
   * Update user profile
   */
  const updateUser = async (updates: { email?: string; password?: string; data?: Record<string, any> }) => {
    if (!supabase) {
      return { error: new Error('Supabase client not initialized') };
    }
    try {
      const updateData: any = {};

      if (updates.email) {
        updateData.email = updates.email;
      }

      if (updates.password) {
        updateData.password = updates.password;
      }

      if (updates.data) {
        updateData.data = updates.data;
      }

      const { error } = await supabase.auth.updateUser(updateData);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  /**
   * Refresh the current session
   */
  const refreshSession = async () => {
    if (!supabase) {
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.refreshSession();
      setUser(mapSupabaseUser(session?.user ?? null));
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUser,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 * 
 * Hook to access authentication state throughout the application.
 * Must be used within an AuthProvider.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

// Export context for direct access if needed
export { AuthContext };

