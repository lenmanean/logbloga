/**
 * Email Notifications for Piracy Detection
 * Sends automated emails when piracy is detected
 */

import { createServiceRoleClient } from '@/lib/supabase/server';
import type { PiracyReport } from './monitoring';

/**
 * Send email notification when new piracy is detected
 */
export async function notifyPiracyDetected(report: PiracyReport): Promise<void> {
  // Get admin email from environment or database
  const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL;
  
  if (!adminEmail) {
    console.warn('Admin email not configured, skipping notification');
    return;
  }

  // Check if Resend is configured (will throw if not configured)
  try {
    await import('@/lib/email/client');
  } catch {
    console.warn('Resend not configured, skipping email notification');
    return;
  }

  try {
    const { getResendClient, getDefaultSender } = await import('@/lib/email/client');
    const resend = getResendClient();

    const confidence = calculateConfidence(report);
    const confidenceLabel = confidence > 70 ? 'HIGH' : confidence > 40 ? 'MEDIUM' : 'LOW';

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@logbloga.com',
      to: adminEmail,
      subject: `🚨 Piracy Detected: ${report.platform} - ${confidenceLabel} Confidence`,
      html: `
        <h2>New Piracy Report Detected</h2>
        
        <p><strong>Platform:</strong> ${report.platform}</p>
        <p><strong>URL:</strong> <a href="${report.infringing_url}">${report.infringing_url}</a></p>
        <p><strong>Content Type:</strong> ${report.content_type}</p>
        <p><strong>Confidence:</strong> ${confidenceLabel} (${confidence}%)</p>
        
        ${report.watermark_token ? `<p><strong>✅ Watermark Found:</strong> ${report.watermark_token.substring(0, 8)}</p>` : ''}
        ${report.download_token ? `<p><strong>✅ Download Token Found:</strong> ${report.download_token.substring(0, 8)}</p>` : ''}
        ${report.user_id ? `<p><strong>👤 Source User ID:</strong> ${report.user_id.substring(0, 8)}...</p>` : ''}
        
        <p><strong>Detected:</strong> ${new Date(report.detected_at).toLocaleString()}</p>
        
        ${report.notes ? `<p><strong>Notes:</strong> ${report.notes}</p>` : ''}
        
        <hr>
        
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/piracy/${report.id}" 
             style="background: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Review & Submit DMCA
          </a>
        </p>
        
        <p style="color: #666; font-size: 12px;">
          This is an automated notification. Review the report before submitting DMCA takedown.
        </p>
      `,
    });

    console.log(`Piracy notification sent for report ${report.id}`);
  } catch (error) {
    console.error('Error sending piracy notification:', error);
    // Don't throw - email failure shouldn't break the process
  }
}

/**
 * Calculate confidence score for a piracy report
 */
function calculateConfidence(report: PiracyReport): number {
  let score = 0;

  if (report.watermark_token) score += 50;
  if (report.download_token) score += 30;
  if (report.user_id) score += 20;

  // Platform-specific scoring
  if (report.platform === 'github') score += 10;
  if (report.platform === 'google-drive') score += 10;
  if (report.platform === 'reddit') score += 5;

  return Math.min(score, 100);
}

/**
 * Send summary email of daily monitoring results
 */
export async function notifyDailySummary(
  newReports: number,
  pendingReports: number,
  submittedToday: number
): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL;
  
  if (!adminEmail || !process.env.RESEND_API_KEY) {
    return;
  }

  try {
    const { getResendClient, getDefaultSender } = await import('@/lib/email/client');
    const resend = getResendClient();

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@logbloga.com',
      to: adminEmail,
      subject: `Daily Piracy Monitoring Summary - ${new Date().toLocaleDateString()}`,
      html: `
        <h2>Daily Piracy Monitoring Summary</h2>
        
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <ul>
          <li><strong>New Reports Found:</strong> ${newReports}</li>
          <li><strong>Pending Reports:</strong> ${pendingReports}</li>
          <li><strong>DMCA Requests Submitted Today:</strong> ${submittedToday}</li>
        </ul>
        
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/piracy" 
             style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View All Reports
          </a>
        </p>
      `,
    });
  } catch (error) {
    console.error('Error sending daily summary:', error);
  }
}
