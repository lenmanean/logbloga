/**
 * Download Tracking Database Operations
 * Tracks all file downloads for piracy detection and analytics
 */

import { createServiceRoleClient } from '@/lib/supabase/server';
import type { WatermarkData } from '@/lib/security/watermarking';

export interface DownloadRecord {
  id: string;
  user_id: string;
  product_id: string;
  filename: string;
  download_token: string;
  ip_address: string | null;
  user_agent: string | null;
  referer: string | null;
  created_at: string;
  order_id: string | null;
  watermark_data: WatermarkData | null;
}

export interface DownloadStats {
  total_downloads: number;
  unique_files: number;
  unique_users: number;
  suspicious_downloads: number;
}

/**
 * Log a file download
 */
export async function logDownload(data: {
  userId: string;
  productId: string;
  filename: string;
  downloadToken: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  referer?: string | null;
  orderId?: string | null;
  watermarkData?: WatermarkData | null;
}): Promise<string> {
  const supabase = await createServiceRoleClient();

  const { data: record, error } = await supabase
    .from('download_logs')
    .insert({
      user_id: data.userId,
      product_id: data.productId,
      filename: data.filename,
      download_token: data.downloadToken,
      ip_address: data.ipAddress || null,
      user_agent: data.userAgent || null,
      referer: data.referer || null,
      order_id: data.orderId || null,
      watermark_data: data.watermarkData ? JSON.stringify(data.watermarkData) : null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error logging download:', error);
    throw new Error(`Failed to log download: ${error.message}`);
  }

  return record.id;
}

/**
 * Get download history for a user
 */
export async function getUserDownloads(
  userId: string,
  options?: {
    productId?: string;
    limit?: number;
    offset?: number;
  }
): Promise<DownloadRecord[]> {
  const supabase = await createServiceRoleClient();

  let query = supabase
    .from('download_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (options?.productId) {
    query = query.eq('product_id', options.productId);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching downloads:', error);
    throw new Error(`Failed to fetch downloads: ${error.message}`);
  }

  return (data || []).map(record => ({
    ...record,
    watermark_data: record.watermark_data 
      ? (typeof record.watermark_data === 'string' 
          ? JSON.parse(record.watermark_data) 
          : record.watermark_data) as WatermarkData | null
      : null,
  })) as DownloadRecord[];
}

/**
 * Get download statistics for a product
 */
export async function getProductDownloadStats(productId: string): Promise<DownloadStats> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('download_logs')
    .select('id, user_id, filename, ip_address')
    .eq('product_id', productId);

  if (error) {
    console.error('Error fetching download stats:', error);
    throw new Error(`Failed to fetch download stats: ${error.message}`);
  }

  const downloads = data || [];
  const uniqueFiles = new Set(downloads.map(d => d.filename)).size;
  const uniqueUsers = new Set(downloads.map(d => d.user_id)).size;

  // Detect suspicious patterns
  // - Same user downloading same file multiple times from different IPs
  // - Multiple users downloading from same IP
  const userFileMap = new Map<string, Set<string>>();
  const ipUserMap = new Map<string, Set<string>>();

  downloads.forEach(download => {
    const key = `${download.user_id}:${download.filename}`;
    if (!userFileMap.has(key)) {
      userFileMap.set(key, new Set());
    }
    if (download.ip_address) {
      userFileMap.get(key)!.add(download.ip_address);
    }

    if (download.ip_address) {
      if (!ipUserMap.has(download.ip_address)) {
        ipUserMap.set(download.ip_address, new Set());
      }
      ipUserMap.get(download.ip_address)!.add(download.user_id);
    }
  });

  let suspiciousCount = 0;
  // Same user, same file, different IPs = suspicious
  userFileMap.forEach((ips, key) => {
    if (ips.size > 2) {
      suspiciousCount++;
    }
  });
  // Same IP, multiple users = suspicious (potential sharing)
  ipUserMap.forEach((users, ip) => {
    if (users.size > 3) {
      suspiciousCount += users.size - 3;
    }
  });

  return {
    total_downloads: downloads.length,
    unique_files: uniqueFiles,
    unique_users: uniqueUsers,
    suspicious_downloads: suspiciousCount,
  };
}

/**
 * Detect suspicious download patterns for a user
 */
export async function detectSuspiciousActivity(userId: string): Promise<{
  isSuspicious: boolean;
  reasons: string[];
}> {
  const supabase = await createServiceRoleClient();

  const { data: downloads, error } = await supabase
    .from('download_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error || !downloads || downloads.length === 0) {
    return { isSuspicious: false, reasons: [] };
  }

  const reasons: string[] = [];
  
  // Check for rapid bulk downloads
  if (downloads.length > 20) {
    const recentDownloads = downloads.filter(d => {
      const downloadTime = new Date(d.created_at).getTime();
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      return downloadTime > oneHourAgo;
    });
    
    if (recentDownloads.length > 15) {
      reasons.push('Rapid bulk downloads detected');
    }
  }

  // Check for multiple IP addresses
  const uniqueIPs = new Set(downloads.map(d => d.ip_address).filter(Boolean));
  if (uniqueIPs.size > 3) {
    reasons.push('Multiple IP addresses detected');
  }

  // Check for downloading all files in short time
  const uniqueFiles = new Set(downloads.map(d => d.filename)).size;
  if (uniqueFiles > 30 && downloads.length > 30) {
    const timeSpan = new Date(downloads[0].created_at).getTime() - 
                     new Date(downloads[downloads.length - 1].created_at).getTime();
    const hours = timeSpan / (1000 * 60 * 60);
    if (hours < 24) {
      reasons.push('All files downloaded in less than 24 hours');
    }
  }

  return {
    isSuspicious: reasons.length > 0,
    reasons,
  };
}

/**
 * Get downloads by watermark token (for piracy tracking)
 */
export async function getDownloadByToken(downloadToken: string): Promise<DownloadRecord | null> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('download_logs')
    .select('*')
    .eq('download_token', downloadToken)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching download by token:', error);
    throw new Error(`Failed to fetch download: ${error.message}`);
  }

  return {
    ...data,
    watermark_data: data.watermark_data 
      ? (typeof data.watermark_data === 'string' 
          ? JSON.parse(data.watermark_data) 
          : data.watermark_data) as WatermarkData | null
      : null,
  } as DownloadRecord;
}
