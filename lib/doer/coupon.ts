/**
 * Doer Coupon Management
 * Generates and manages coupon codes for Doer.com integration
 */

import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import crypto from 'crypto';

/**
 * Generate a unique Doer coupon code for an order
 * Format: DOER6M-{ORDER_ID_SHORT}-{RANDOM_6CHARS}
 * Example: DOER6M-abc123-7x9k2m
 */
export function generateDoerCouponCode(orderId: string): string {
  // Get first 6 characters of order ID (UUID, so first 8 chars without hyphens)
  const orderIdShort = orderId.replace(/-/g, '').substring(0, 6).toLowerCase();
  
  // Generate random 6-character suffix
  const randomSuffix = crypto.randomBytes(3).toString('hex').substring(0, 6);
  
  return `DOER6M-${orderIdShort}-${randomSuffix}`;
}

/**
 * Store Doer coupon code in order record
 */
export async function storeDoerCoupon(
  orderId: string,
  couponCode: string
): Promise<void> {
  const supabase = createServiceRoleClient();
  
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + 90); // 90 days expiration
  
  const { error } = await supabase
    .from('orders')
    .update({
      doer_coupon_code: couponCode,
      doer_coupon_generated_at: now.toISOString(),
      doer_coupon_expires_at: expiresAt.toISOString(),
      doer_coupon_used: false,
    })
    .eq('id', orderId);

  if (error) {
    console.error('Error storing Doer coupon:', error);
    throw new Error(`Failed to store Doer coupon: ${error.message}`);
  }
}

/**
 * Check if a Doer coupon code is valid and unused
 */
export async function isDoerCouponValid(couponCode: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select('doer_coupon_code, doer_coupon_expires_at, doer_coupon_used')
    .eq('doer_coupon_code', couponCode)
    .single();

  if (error || !data) {
    return false;
  }

  // Check if coupon has been used
  if (data.doer_coupon_used) {
    return false;
  }

  // Check if coupon has expired
  if (data.doer_coupon_expires_at) {
    const expiresAt = new Date(data.doer_coupon_expires_at);
    if (expiresAt < new Date()) {
      return false;
    }
  }

  return true;
}

/**
 * Mark a Doer coupon as used
 */
export async function markDoerCouponAsUsed(
  couponCode: string,
  doerUserId?: string
): Promise<void> {
  const supabase = createServiceRoleClient();
  
  const updateData: any = {
    doer_coupon_used: true,
    doer_coupon_used_at: new Date().toISOString(),
  };

  if (doerUserId) {
    updateData.doer_user_id = doerUserId;
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('doer_coupon_code', couponCode);

  if (error) {
    console.error('Error marking Doer coupon as used:', error);
    throw new Error(`Failed to mark Doer coupon as used: ${error.message}`);
  }
}

/**
 * Get Doer coupon code for an order
 */
export async function getDoerCouponForOrder(orderId: string): Promise<string | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select('doer_coupon_code')
    .eq('id', orderId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.doer_coupon_code || null;
}

/**
 * Generate and store Doer coupon for an order (if it's a package purchase)
 */
export async function generateDoerCouponForOrder(orderId: string): Promise<string | null> {
  // Check if order already has a coupon
  const existingCoupon = await getDoerCouponForOrder(orderId);
  if (existingCoupon) {
    return existingCoupon;
  }

  // Check if order contains a package
  const { orderContainsPackage } = await import('@/lib/db/access');
  const containsPackage = await orderContainsPackage(orderId);
  
  if (!containsPackage) {
    return null; // Only generate coupons for package purchases
  }

  // Generate coupon code
  const couponCode = generateDoerCouponCode(orderId);
  
  // Store coupon in order
  await storeDoerCoupon(orderId, couponCode);
  
  return couponCode;
}
