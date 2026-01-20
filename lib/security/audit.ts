/**
 * Audit logging utilities
 * Provides functions to log security and compliance events
 */

import { createServiceRoleClient } from '@/lib/supabase/server';

/**
 * Audit log entry interface
 */
export interface AuditLogEntry {
  user_id?: string | null;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  metadata?: Record<string, any>;
}

/**
 * Common audit log actions
 */
export const AuditActions = {
  // Authentication
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGNUP: 'signup',
  PASSWORD_CHANGE: 'password_change',
  PASSWORD_RESET: 'password_reset',
  EMAIL_VERIFICATION: 'email_verification',
  EMAIL_CHANGE: 'email_change',
  
  // User actions
  PROFILE_UPDATE: 'profile_update',
  ACCOUNT_DELETE: 'account_delete',
  ACCOUNT_EXPORT: 'account_export',
  
  // Order actions
  ORDER_CREATE: 'order_create',
  ORDER_UPDATE: 'order_update',
  ORDER_STATUS_UPDATE: 'order_status_update',
  ORDER_CANCEL: 'order_cancel',
  ORDER_REFUND: 'order_refund',
  
  // Admin actions
  ADMIN_ORDER_UPDATE: 'admin_order_update',
  ADMIN_USER_UPDATE: 'admin_user_update',
  ADMIN_PRODUCT_UPDATE: 'admin_product_update',
  ADMIN_COUPON_CREATE: 'admin_coupon_create',
  ADMIN_COUPON_UPDATE: 'admin_coupon_update',
  
  // Payment actions
  PAYMENT_PROCESS: 'payment_process',
  PAYMENT_FAILED: 'payment_failed',
  PAYMENT_REFUND: 'payment_refund',
  
  // License actions
  LICENSE_GENERATE: 'license_generate',
  LICENSE_ACTIVATE: 'license_activate',
  LICENSE_DEACTIVATE: 'license_deactivate',
  
  // Security events
  RATE_LIMIT_HIT: 'rate_limit_hit',
  CSRF_TOKEN_INVALID: 'csrf_token_invalid',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  
  // GDPR
  DATA_EXPORT: 'data_export',
  DATA_DELETION: 'data_deletion',
  CONSENT_GRANTED: 'consent_granted',
  CONSENT_REVOKED: 'consent_revoked',
} as const;

/**
 * Common resource types
 */
export const ResourceTypes = {
  USER: 'user',
  PROFILE: 'profile',
  ORDER: 'order',
  PRODUCT: 'product',
  LICENSE: 'license',
  COUPON: 'coupon',
  PAYMENT: 'payment',
  CART: 'cart',
  WISHLIST: 'wishlist',
  ADDRESS: 'address',
  NOTIFICATION: 'notification',
  REVIEW: 'review',
  CONSENT: 'consent',
} as const;

/**
 * Log an audit event
 */
export async function logAction(
  entry: AuditLogEntry
): Promise<void> {
  try {
    const supabase = await createServiceRoleClient();

    // Extract IP address and user agent from request if not provided
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: entry.user_id || null,
        action: entry.action,
        resource_type: entry.resource_type,
        resource_id: entry.resource_id || null,
        ip_address: entry.ip_address || null,
        user_agent: entry.user_agent || null,
        metadata: entry.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging audit event:', error);
      // Don't throw - audit logging failures shouldn't break the application
    }
  } catch (error) {
    console.error('Error in audit logging:', error);
    // Don't throw - audit logging failures shouldn't break the application
  }
}

/**
 * Log action with request context
 */
export async function logActionWithRequest(
  entry: Omit<AuditLogEntry, 'ip_address' | 'user_agent'>,
  request?: Request
): Promise<void> {
  let ipAddress: string | null = null;
  let userAgent: string | null = null;

  if (request) {
    // Get IP address from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    ipAddress = forwarded?.split(',')[0] || realIp || null;
    
    // Get user agent
    userAgent = request.headers.get('user-agent') || null;
  }

  await logAction({
    ...entry,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
}

/**
 * Get user audit logs
 */
export async function getUserAuditLogs(
  userId: string,
  filters?: {
    action?: string;
    resource_type?: string;
    limit?: number;
    offset?: number;
  }
): Promise<any[]> {
  const supabase = await createServiceRoleClient();

  let query = supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (filters?.action) {
    query = query.eq('action', filters.action);
  }

  if (filters?.resource_type) {
    query = query.eq('resource_type', filters.resource_type);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 100) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching user audit logs:', error);
    throw new Error(`Failed to fetch audit logs: ${error.message}`);
  }

  return data || [];
}

/**
 * Get all audit logs (admin only)
 */
export async function getAuditLogs(
  filters?: {
    user_id?: string;
    action?: string;
    resource_type?: string;
    resource_id?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }
): Promise<any[]> {
  const supabase = await createServiceRoleClient();

  let query = supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.user_id) {
    query = query.eq('user_id', filters.user_id);
  }

  if (filters?.action) {
    query = query.eq('action', filters.action);
  }

  if (filters?.resource_type) {
    query = query.eq('resource_type', filters.resource_type);
  }

  if (filters?.resource_id) {
    query = query.eq('resource_id', filters.resource_id);
  }

  if (filters?.start_date) {
    query = query.gte('created_at', filters.start_date);
  }

  if (filters?.end_date) {
    query = query.lte('created_at', filters.end_date);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 100) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching audit logs:', error);
    throw new Error(`Failed to fetch audit logs: ${error.message}`);
  }

  return data || [];
}
