/**
 * Resend email client wrapper
 * Provides a configured Resend client instance
 */

import { Resend } from 'resend';

let resendClient: Resend | null = null;

/**
 * Get or create Resend client instance
 * Uses singleton pattern to reuse client
 */
export function getResendClient(): Resend {
  if (resendClient) {
    return resendClient;
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

/**
 * Get the default sender for Resend (display name + address).
 * Uses quoted display name so inboxes show "Logbloga" instead of the local part of the email (e.g. "mail").
 */
export function getDefaultSender(): string {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'mail@logbloga.com';
  const rawName = process.env.RESEND_FROM_NAME ?? 'Logbloga';
  const fromName = (typeof rawName === 'string' ? rawName.trim() : '') || 'Logbloga';
  return `"${fromName.replace(/"/g, '')}" <${fromEmail}>`;
}

/**
 * Get the application URL for email links
 */
export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}
