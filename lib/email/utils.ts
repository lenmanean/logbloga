/**
 * Email utility functions
 */

import { getNotificationPreferences } from '@/lib/db/notifications';
import type { EmailTemplate } from './types';

/**
 * Check if user has opted in for a specific email type
 */
export async function shouldSendEmail(
  userId: string,
  emailType: EmailTemplate
): Promise<boolean> {
  try {
    const preferences = await getNotificationPreferences(userId);

    switch (emailType) {
      case 'order-confirmation':
      case 'payment-receipt':
        return preferences.email_order_confirmation;
      case 'order-status-update':
        return preferences.email_order_shipped;
      case 'welcome':
        // Always send welcome emails
        return true;
      case 'product-update':
        return preferences.email_product_updates;
      case 'abandoned-cart':
        return preferences.email_promotional;
      case 'password-reset':
      case 'email-verification':
        // Always send auth emails
        return true;
      default:
        return true;
    }
  } catch (error) {
    // If preferences can't be fetched, default to sending
    // This ensures critical emails aren't blocked
    console.error('Error checking notification preferences:', error);
    return true;
  }
}

/**
 * Format currency amount
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format date for emails
 */
export function formatEmailDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Generate order tracking URL
 */
export function getOrderTrackingUrl(orderId: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${appUrl}/account/orders/${orderId}`;
}

/**
 * Generate invoice download URL
 */
export function getInvoiceUrl(orderId: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${appUrl}/api/orders/${orderId}/invoice`;
}

/**
 * Generate product URL
 */
export function getProductUrl(slug: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${appUrl}/products/${slug}`;
}

/**
 * Generate library URL
 */
export function getLibraryUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${appUrl}/account/library`;
}
