/**
 * Watermarking and Content Protection
 * Implements user-specific watermarking for digital products
 */

import crypto from 'crypto';

export interface WatermarkData {
  userId: string;
  orderId: string;
  productId: string;
  downloadToken: string;
  timestamp: string;
  purchaseDate: string;
}

/**
 * Generate a unique download token for tracking
 */
export function generateDownloadToken(userId: string, productId: string, filename: string): string {
  const data = `${userId}:${productId}:${filename}:${Date.now()}`;
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 32);
}

/**
 * Create watermark data object
 */
export function createWatermarkData(
  userId: string,
  orderId: string,
  productId: string,
  filename: string
): WatermarkData {
  return {
    userId,
    orderId,
    productId,
    downloadToken: generateDownloadToken(userId, productId, filename),
    timestamp: new Date().toISOString(),
    purchaseDate: new Date().toISOString(), // Should come from order data
  };
}

/**
 * Encode watermark data as base64 string for embedding
 */
export function encodeWatermark(data: WatermarkData): string {
  const json = JSON.stringify(data);
  return Buffer.from(json).toString('base64');
}

/**
 * Decode watermark data from base64 string
 */
export function decodeWatermark(encoded: string): WatermarkData | null {
  try {
    const json = Buffer.from(encoded, 'base64').toString('utf-8');
    return JSON.parse(json) as WatermarkData;
  } catch {
    return null;
  }
}

/**
 * Generate copyright notice text with user-specific information
 */
export function generateCopyrightNotice(watermarkData?: WatermarkData): string {
  const year = new Date().getFullYear();
  const baseNotice = `Copyright © ${year} Logbloga. All Rights Reserved.

This content is protected by copyright law. Unauthorized copying, 
distribution, or reproduction is strictly prohibited and may result 
in severe civil and criminal penalties.

Licensed for personal use only. Commercial redistribution prohibited.`;

  if (watermarkData) {
    return `${baseNotice}

License ID: ${watermarkData.downloadToken.substring(0, 8).toUpperCase()}
Purchase Date: ${new Date(watermarkData.purchaseDate).toLocaleDateString()}`;
  }

  return baseNotice;
}

/**
 * Add watermark to Markdown content
 * Inserts hidden HTML comment with watermark data
 */
export function watermarkMarkdown(content: string, watermarkData: WatermarkData): string {
  const encoded = encodeWatermark(watermarkData);
  const watermarkComment = `<!-- WATERMARK:${encoded} -->\n\n`;
  const copyrightNotice = `\n\n---\n\n${generateCopyrightNotice(watermarkData)}\n`;
  
  return watermarkComment + content + copyrightNotice;
}

/**
 * Extract watermark from Markdown content
 */
export function extractWatermarkFromMarkdown(content: string): WatermarkData | null {
  const match = content.match(/<!-- WATERMARK:([A-Za-z0-9+/=]+) -->/);
  if (match && match[1]) {
    return decodeWatermark(match[1]);
  }
  return null;
}

/**
 * Generate file metadata with watermark
 * For PDF, ZIP, and other binary files
 */
export function generateFileMetadata(watermarkData: WatermarkData): Record<string, string> {
  return {
    'Author': 'Logbloga',
    'Copyright': `© ${new Date().getFullYear()} Logbloga. All Rights Reserved.`,
    'License': 'Single-user license. Redistribution prohibited.',
    'LicenseID': watermarkData.downloadToken.substring(0, 8).toUpperCase(),
    'PurchaseDate': watermarkData.purchaseDate,
    'UserID': watermarkData.userId.substring(0, 8), // Partial for privacy
    'OrderID': watermarkData.orderId.substring(0, 8), // Partial for privacy
  };
}

/**
 * Create invisible watermark text for text-based files
 * Uses zero-width characters and steganography techniques
 */
export function createInvisibleWatermark(watermarkData: WatermarkData): string {
  const data = encodeWatermark(watermarkData);
  // Convert to binary
  const binary = data.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');
  
  // Use zero-width spaces to encode data
  const zeroWidthSpace = '\u200B'; // Zero-width space
  const zeroWidthNonJoiner = '\u200C'; // Zero-width non-joiner
  const zeroWidthJoiner = '\u200D'; // Zero-width joiner
  
  let watermark = '';
  for (let i = 0; i < binary.length; i++) {
    if (binary[i] === '0') {
      watermark += zeroWidthSpace;
    } else if (binary[i] === '1') {
      watermark += zeroWidthNonJoiner;
    }
  }
  
  return watermark;
}

/**
 * Extract invisible watermark from text
 */
export function extractInvisibleWatermark(text: string): WatermarkData | null {
  const zeroWidthSpace = '\u200B';
  const zeroWidthNonJoiner = '\u200C';
  
  let binary = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === zeroWidthSpace) {
      binary += '0';
    } else if (char === zeroWidthNonJoiner) {
      binary += '1';
    }
  }
  
  if (binary.length === 0 || binary.length % 8 !== 0) {
    return null;
  }
  
  // Convert binary back to base64
  let base64 = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substring(i, i + 8);
    const charCode = parseInt(byte, 2);
    base64 += String.fromCharCode(charCode);
  }
  
  return decodeWatermark(base64);
}
