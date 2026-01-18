'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

/**
 * User interface - compatible with common authentication systems
 * This can be easily adapted to work with Supabase, NextAuth, Auth0, etc.
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
  // Methods that will be implemented when auth is added
  signIn?: () => Promise<void>;
  signOut?: () => Promise<void>;
}

/**
 * Authentication Context
 * This will be populated by an AuthProvider when authentication is implemented
 */
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
});

/**
 * useAuth Hook
 * 
 * Hook to access authentication state throughout the application.
 * 
 * CURRENT STATE: Returns unauthenticated state by default
 * 
 * TO INTEGRATE AUTHENTICATION:
 * 1. Create an AuthProvider component that wraps your app
 * 2. Update this hook to read from your auth system (Supabase, NextAuth, etc.)
 * 3. Implement signIn and signOut methods
 * 
 * Example integration with Supabase:
 * ```tsx
 * import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
 * 
 * export function useAuth() {
 *   const supabase = createClientComponentClient()
 *   const [user, setUser] = useState<User | null>(null)
 *   const [isLoading, setIsLoading] = useState(true)
 * 
 *   useEffect(() => {
 *     supabase.auth.getUser().then(({ data }) => {
 *       setUser(data.user)
 *       setIsLoading(false)
 *     })
 *   }, [])
 * 
 *   return { user, isLoading, isAuthenticated: !!user }
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  // TODO: Replace this with actual auth implementation
  // For now, return unauthenticated state
  const [isLoading] = useState(false);
  
  // When auth is implemented, replace this with:
  // const { user, isLoading } = useContext(AuthContext);
  
  return {
    user: null, // Set to null until auth is implemented
    isLoading,
    isAuthenticated: false, // Will be true when user exists
  };
}

/**
 * AuthProvider Component (placeholder)
 * 
 * This component should wrap your app when authentication is implemented.
 * 
 * Example:
 * ```tsx
 * // In app/layout.tsx
 * import { AuthProvider } from '@/hooks/useAuth'
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <AuthProvider>
 *       {children}
 *     </AuthProvider>
 *   )
 * }
 * ```
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // TODO: Implement actual auth provider logic here
  // This is a placeholder that can be replaced with your auth system
  
  const value: AuthContextType = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Export context for direct access if needed
export { AuthContext };

