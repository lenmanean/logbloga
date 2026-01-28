/**
 * Piracy Monitoring and Detection
 * Automated monitoring for copyright infringement
 */

import { createServiceRoleClient } from '@/lib/supabase/server';
import type { WatermarkData } from '@/lib/security/watermarking';
import { decodeWatermark, extractWatermarkFromMarkdown } from '@/lib/security/watermarking';
import { getDownloadByToken } from '@/lib/db/download-tracking';

export interface PiracyReport {
  id: string;
  infringing_url: string;
  platform: string;
  content_type: string;
  detected_at: string;
  status: 'pending' | 'investigating' | 'takedown_sent' | 'resolved' | 'false_positive' | 'escalated';
  watermark_token?: string;
  download_token?: string;
  user_id?: string;
  takedown_request_id?: string;
  notes?: string;
}

/**
 * Create a piracy report
 */
export async function createPiracyReport(data: {
  infringingUrl: string;
  platform: string;
  contentType: string;
  watermarkToken?: string;
  downloadToken?: string;
  userId?: string;
  notes?: string;
}): Promise<string> {
  const supabase = await createServiceRoleClient();

  const { data: report, error } = await supabase
    .from('piracy_reports')
    .insert({
      infringing_url: data.infringingUrl,
      platform: data.platform,
      content_type: data.contentType,
      watermark_token: data.watermarkToken || null,
      download_token: data.downloadToken || null,
      user_id: data.userId || null,
      notes: data.notes || null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating piracy report:', error);
    throw new Error(`Failed to create piracy report: ${error.message}`);
  }

  return report.id;
}

/**
 * Extract watermark from content and identify source user
 */
export async function identifyPiracySource(content: string): Promise<{
  userId?: string;
  orderId?: string;
  downloadToken?: string;
  watermarkData?: WatermarkData;
} | null> {
  // Try to extract watermark from markdown
  const watermarkData = extractWatermarkFromMarkdown(content);
  
  if (watermarkData) {
    // Look up the download record
    const downloadRecord = await getDownloadByToken(watermarkData.downloadToken);
    
    if (downloadRecord) {
      return {
        userId: downloadRecord.user_id,
        orderId: downloadRecord.order_id || undefined,
        downloadToken: downloadRecord.download_token,
        watermarkData,
      };
    }
    
    return {
      userId: watermarkData.userId,
      orderId: watermarkData.orderId,
      downloadToken: watermarkData.downloadToken,
      watermarkData,
    };
  }

  // Try to find download token in content (if someone shared the token)
  const tokenMatch = content.match(/[A-Za-z0-9]{32}/);
  if (tokenMatch) {
    const downloadRecord = await getDownloadByToken(tokenMatch[0]);
    if (downloadRecord) {
      return {
        userId: downloadRecord.user_id,
        orderId: downloadRecord.order_id || undefined,
        downloadToken: downloadRecord.download_token,
      };
    }
  }

  return null;
}

/**
 * Search for package content on web platforms
 * This is a placeholder - actual implementation would use:
 * - Google Custom Search API
 * - Web scraping (with proper rate limiting and robots.txt respect)
 * - Platform-specific APIs
 */
export async function searchForPiracy(
  searchTerms: string[],
  platforms?: string[]
): Promise<Array<{ url: string; platform: string; title: string; snippet: string }>> {
  // Placeholder implementation
  // In production, this would:
  // 1. Use Google Custom Search API with site-specific searches
  // 2. Search file sharing sites (Mega, MediaFire, etc.)
  // 3. Search marketplace sites (eBay, Etsy, Gumroad)
  // 4. Search social media (Reddit, Discord, Telegram)
  // 5. Search paste sites (Pastebin, GitHub Gists)
  
  console.log('Piracy search not yet implemented. Would search for:', searchTerms);
  return [];
}

/**
 * Monitor known piracy platforms
 */
export async function monitorPiracyPlatforms(): Promise<PiracyReport[]> {
  const supabase = await createServiceRoleClient();
  
  // Get all active products
  const { data: products } = await supabase
    .from('products')
    .select('id, title, slug')
    .eq('active', true)
    .eq('product_type', 'package');

  if (!products || products.length === 0) {
    return [];
  }

  const reports: PiracyReport[] = [];

  // Search for each product
  for (const product of products) {
    // Filter out null values and ensure all terms are strings
    const searchTerms: string[] = [
      product.title,
      product.slug,
      `"${product.title}"`,
      `"${product.slug}"`,
    ].filter((term): term is string => typeof term === 'string' && term.length > 0);

    const results = await searchForPiracy(searchTerms);
    
    for (const result of results) {
      // Check if we already have a report for this URL
      const { data: existing } = await supabase
        .from('piracy_reports')
        .select('id')
        .eq('infringing_url', result.url)
        .single();

      if (!existing) {
        // Analyze content to extract watermark
        const sourceInfo = await identifyPiracySource(result.snippet);
        
        const reportId = await createPiracyReport({
          infringingUrl: result.url,
          platform: result.platform,
          contentType: 'description', // or 'file', 'screenshot', etc.
          watermarkToken: sourceInfo?.watermarkData?.downloadToken,
          downloadToken: sourceInfo?.downloadToken,
          userId: sourceInfo?.userId,
          notes: `Auto-detected: ${result.title}`,
        });

        reports.push({
          id: reportId,
          infringing_url: result.url,
          platform: result.platform,
          content_type: 'description',
          detected_at: new Date().toISOString(),
          status: 'pending',
          watermark_token: sourceInfo?.watermarkData?.downloadToken,
          download_token: sourceInfo?.downloadToken,
          user_id: sourceInfo?.userId,
        });
      }
    }
  }

  return reports;
}

/**
 * Get pending piracy reports that need action
 */
export async function getPendingPiracyReports(): Promise<PiracyReport[]> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('piracy_reports')
    .select('*')
    .eq('status', 'pending')
    .order('detected_at', { ascending: true });

  if (error) {
    console.error('Error fetching pending reports:', error);
    return [];
  }

  return (data || []) as PiracyReport[];
}

/**
 * Update piracy report status
 */
export async function updatePiracyReportStatus(
  reportId: string,
  status: PiracyReport['status'],
  notes?: string
): Promise<void> {
  const supabase = await createServiceRoleClient();

  const updateData: any = { status };
  if (notes) {
    updateData.notes = notes;
  }
  if (status === 'resolved') {
    updateData.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('piracy_reports')
    .update(updateData)
    .eq('id', reportId);

  if (error) {
    console.error('Error updating piracy report:', error);
    throw new Error(`Failed to update report: ${error.message}`);
  }
}
