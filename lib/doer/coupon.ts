/**
 * DOER Coupon Management
 * Generates and manages coupon codes via Doer's partner API
 */

import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import { getOrderWithItems } from '@/lib/db/orders';

/** Doer API packageId values */
const DOER_PACKAGE_IDS = [
  'agency',
  'social-media',
  'web-apps',
  'freelancing',
  'master-bundle',
] as const;

/** Coupon format: alphanumeric + hyphen, 6–64 chars (industry standard) */
const COUPON_FORMAT = /^[A-Za-z0-9\-]+$/;
const COUPON_MIN_LENGTH = 6;
const COUPON_MAX_LENGTH = 64;

type DoerPackageId = (typeof DOER_PACKAGE_IDS)[number];

/**
 * Validate coupon format per industry standards: unique alphanumeric token.
 * Allows hyphens for readability (e.g. DOER6M-ABC123).
 */
export function validateCouponFormat(code: string | null | undefined): boolean {
  if (code == null || typeof code !== 'string') return false;
  const trimmed = code.trim();
  if (trimmed.length < COUPON_MIN_LENGTH || trimmed.length > COUPON_MAX_LENGTH) return false;
  return COUPON_FORMAT.test(trimmed);
}

/**
 * Sanitize coupon code before storing/displaying: trim and normalize.
 */
function sanitizeCouponCode(code: string): string {
  return code.trim();
}

const SLUG_TO_PACKAGE_ID: Record<string, DoerPackageId> = {
  agency: 'agency',
  'social-media': 'social-media',
  'web-apps': 'web-apps',
  freelancing: 'freelancing',
  'master-bundle': 'master-bundle',
};

/**
 * Map product slug to Doer API packageId
 * Returns null if slug is not a valid AI-to-USD package
 */
export function getDoerPackageId(slug: string | null | undefined): DoerPackageId | null {
  if (!slug || typeof slug !== 'string') return null;
  const normalized = slug.toLowerCase().trim();
  return SLUG_TO_PACKAGE_ID[normalized] ?? null;
}

/**
 * Generate HMAC-SHA256 signature for Doer API authentication
 * Payload format: email|orderId|packageId
 */
export function generateDoerSignature(
  email: string,
  orderId: string,
  packageId: string
): string {
  const secret = process.env.LOGBLOGGA_PARTNER_SECRET;
  if (!secret) {
    throw new Error('LOGBLOGGA_PARTNER_SECRET is not configured');
  }

  const payload = `${email}|${orderId}|${packageId}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return signature;
}

/**
 * Store DOER coupon code in order record
 * Uses 6-month (180 days) expiration by default.
 * Rejects invalid format (does not persist).
 */
export async function storeDoerCoupon(
  orderId: string,
  couponCode: string,
  expiresAt?: Date
): Promise<void> {
  const sanitized = sanitizeCouponCode(couponCode);
  if (!validateCouponFormat(sanitized)) {
    throw new Error('Invalid coupon format: must be alphanumeric with optional hyphens, 6–64 characters');
  }

  const supabase = await createServiceRoleClient();

  const now = new Date();
  const expiration =
    expiresAt ?? (() => {
      const d = new Date(now);
      d.setDate(d.getDate() + 180); // 6 months
      return d;
    })();

  const { error } = await (supabase as any)
    .from('orders')
    .update({
      doer_coupon_code: sanitized,
      doer_coupon_generated_at: now.toISOString(),
      doer_coupon_expires_at: expiration.toISOString(),
      doer_coupon_used: false,
    } as any)
    .eq('id', orderId);

  if (error) {
    console.error('Error storing DOER coupon:', error);
    throw new Error(`Failed to store DOER coupon: ${error.message}`);
  }
}

/**
 * Check if a DOER coupon code is valid and unused
 */
export async function isDoerCouponValid(couponCode: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from('orders')
    .select('doer_coupon_code, doer_coupon_expires_at, doer_coupon_used')
    .eq('doer_coupon_code', couponCode)
    .single();

  if (error || !data) {
    return false;
  }

  if (data.doer_coupon_used) {
    return false;
  }

  if (data.doer_coupon_expires_at) {
    const expiresAt = new Date(data.doer_coupon_expires_at);
    if (expiresAt < new Date()) {
      return false;
    }
  }

  return true;
}

/**
 * Mark a DOER coupon as used
 */
export async function markDoerCouponAsUsed(
  couponCode: string,
  doerUserId?: string
): Promise<void> {
  const supabase = await createServiceRoleClient();

  const updateData: any = {
    doer_coupon_used: true,
    doer_coupon_used_at: new Date().toISOString(),
  };

  if (doerUserId) {
    updateData.doer_user_id = doerUserId;
  }

  const { error } = await (supabase as any)
    .from('orders')
    .update(updateData as any)
    .eq('doer_coupon_code', couponCode);

  if (error) {
    console.error('Error marking DOER coupon as used:', error);
    throw new Error(`Failed to mark DOER coupon as used: ${error.message}`);
  }
}

/**
 * Get DOER coupon code for an order
 */
export async function getDoerCouponForOrder(orderId: string): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from('orders')
    .select('doer_coupon_code')
    .eq('id', orderId)
    .single();

  if (error || !data) {
    return null;
  }

  return (data as any).doer_coupon_code || null;
}

const DOER_API_URL = 'https://usedoer.com/api/partners/logblogga/generate-coupon';
const DOER_FETCH_TIMEOUT_MS = 15_000;
const DOER_MAX_ATTEMPTS = 3;
const DOER_BACKOFF_MS = [1000, 2000]; // 1s, 2s

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Request a unique 6-month Doer Pro coupon from Doer's partner API.
 * Uses timeout (15s), retries (3 attempts, exponential backoff), and format validation.
 */
async function requestDoerCouponFromApi(
  email: string,
  orderId: string,
  packageId: DoerPackageId
): Promise<{ couponCode: string; expiresAt?: string } | null> {
  const secret = process.env.LOGBLOGGA_PARTNER_SECRET;
  if (!secret) {
    console.error('Doer API: LOGBLOGGA_PARTNER_SECRET is not configured');
    return null;
  }

  const signature = generateDoerSignature(email, orderId, packageId);
  const body = JSON.stringify({ email, orderId, packageId, signature });

  let lastError: Error | null = null;
  let lastStatus: number | null = null;

  for (let attempt = 1; attempt <= DOER_MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DOER_FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(DOER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      lastStatus = response.status;

      if (!response.ok) {
        const text = await response.text();
        const isRetryable = response.status >= 500 || response.status === 408;
        if (isRetryable && attempt < DOER_MAX_ATTEMPTS) {
          await sleep(DOER_BACKOFF_MS[attempt - 1] ?? 2000);
          continue;
        }
        console.error(`Doer API error ${response.status}`, {
          orderId,
          packageId,
          attempt,
          message: text.slice(0, 200),
        });
        return null;
      }

      const data = await response.json();
      const rawCode =
        data.code ?? data.couponCode ?? data.coupon_code ?? null;
      const expiresAt =
        data.expiresAt ?? data.expires_at ?? data.expiration ?? null;

      if (!rawCode || typeof rawCode !== 'string') {
        console.error('Doer API: Invalid response - missing coupon code', {
          orderId,
          packageId,
        });
        return null;
      }

      const couponCode = sanitizeCouponCode(rawCode);
      if (!validateCouponFormat(couponCode)) {
        console.error('Doer API: Coupon format validation failed', {
          orderId,
          packageId,
        });
        return null;
      }

      return {
        couponCode,
        expiresAt: typeof expiresAt === 'string' ? expiresAt : undefined,
      };
    } catch (err) {
      clearTimeout(timeout);
      lastError = err instanceof Error ? err : new Error(String(err));
      const isRetryable =
        lastError.name === 'AbortError' ||
        (lastError as { code?: string }).code === 'ECONNRESET' ||
        (lastError as { code?: string }).code === 'ETIMEDOUT';
      if (isRetryable && attempt < DOER_MAX_ATTEMPTS) {
        await sleep(DOER_BACKOFF_MS[attempt - 1] ?? 2000);
        continue;
      }
      console.error('Doer API request failed', {
        orderId,
        packageId,
        attempt,
        error: lastError.message,
      });
      return null;
    }
  }

  if (lastError) {
    console.error('Doer API: All retries exhausted', {
      orderId,
      packageId,
      lastStatus,
      error: lastError.message,
    });
  }
  return null;
}

/**
 * Extract Doer packageId from order items
 * Prefers master-bundle if present, otherwise first valid package slug
 */
function extractPackageIdFromOrder(
  items: Array<{ product_sku?: string | null }>
): DoerPackageId | null {
  if (!items || items.length === 0) return null;

  // Prefer master-bundle if in order
  for (const item of items) {
    const pkg = getDoerPackageId(item.product_sku);
    if (pkg === 'master-bundle') return pkg;
  }

  // Otherwise first valid package
  for (const item of items) {
    const pkg = getDoerPackageId(item.product_sku);
    if (pkg) return pkg;
  }

  return null;
}

/**
 * Generate and store DOER coupon for an order (if it's a package purchase)
 * Requests coupon from Doer's partner API
 */
export async function generateDoerCouponForOrder(orderId: string): Promise<string | null> {
  const existingCoupon = await getDoerCouponForOrder(orderId);
  if (existingCoupon) {
    return existingCoupon;
  }

  const orderWithItems = await getOrderWithItems(orderId);
  if (!orderWithItems || !orderWithItems.customer_email) {
    return null;
  }

  const packageId = extractPackageIdFromOrder(orderWithItems.items ?? []);
  if (!packageId) {
    return null; // Only generate for AI-to-USD package purchases
  }

  const email = orderWithItems.customer_email;

  const result = await requestDoerCouponFromApi(email, orderId, packageId);
  if (!result) {
    return null;
  }

  const expiresAt = result.expiresAt
    ? new Date(result.expiresAt)
    : undefined;

  await storeDoerCoupon(orderId, result.couponCode, expiresAt);

  return result.couponCode;
}
