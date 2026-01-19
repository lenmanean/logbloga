/**
 * Admin authentication and authorization utilities
 * Provides functions to check admin role and protect admin routes
 */

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export type UserRole = 'user' | 'admin';

export interface AdminUser extends User {
  role: 'admin';
}

/**
 * Check if a user has admin role
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.role === 'admin';
}

/**
 * Get current user's role
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return 'user'; // Default to user if not found
  }

  return (data.role as UserRole) || 'user';
}

/**
 * Require admin authentication
 * Throws error or redirects if user is not an admin
 * Use in server components and API routes
 */
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/signin?redirect=/admin');
  }

  const isUserAdmin = await isAdmin(user.id);

  if (!isUserAdmin) {
    redirect('/account?error=unauthorized');
  }

  return user as AdminUser;
}

/**
 * Get current admin user with role verification
 * Returns null if user is not an admin
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const isUserAdmin = await isAdmin(user.id);

  if (!isUserAdmin) {
    return null;
  }

  return user as AdminUser;
}

/**
 * Check admin permission (extensible for future multi-role support)
 * Currently only checks if user is admin
 */
export async function checkAdminPermission(
  userId: string,
  permission?: string
): Promise<boolean> {
  // For now, only admin role exists
  // In future, can extend to check specific permissions
  return await isAdmin(userId);
}

