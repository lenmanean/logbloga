/**
 * Admin-specific type definitions
 */

import type { Order, Product, Profile, Coupon } from './database';

export type UserRole = 'user' | 'admin';

export interface AdminUser extends Profile {
  role: 'admin';
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Order[];
}

export interface AdminFilters {
  search?: string;
  status?: string | null;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  active?: boolean;
}

export interface BulkAction {
  type: 'update_status' | 'delete' | 'activate' | 'deactivate' | 'export';
  items: string[]; // IDs
  payload?: Record<string, unknown>;
}

export interface AdminOrderFilters extends Omit<AdminFilters, 'status'> {
  status?: Order['status'];
  userId?: string;
}

export interface AdminProductFilters extends AdminFilters {
  category?: string;
  active?: boolean;
  featured?: boolean;
}

export interface AdminCustomerFilters extends AdminFilters {
  role?: UserRole;
}

export interface AdminCouponFilters extends AdminFilters {
  active?: boolean;
  type?: string; // 'percentage' | 'fixed_amount'
}

