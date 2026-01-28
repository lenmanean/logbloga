/**
 * GET /api/library/[product-id]/download
 * Secure download endpoint for digital products.
 * Only flat filenames are allowed; each must be in the package allowlist.
 * Includes watermarking and download tracking for piracy protection.
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { hasProductAccess } from '@/lib/db/access';
import { getProductById } from '@/lib/db/products';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { getContentType } from '@/lib/utils/content';
import { getAllowedFilenamesForPackage } from '@/lib/data/package-level-content';
import { 
  createWatermarkData, 
  generateDownloadToken,
  watermarkMarkdown,
  generateFileMetadata 
} from '@/lib/security/watermarking';
import { logDownload } from '@/lib/db/download-tracking';

interface RouteParams {
  params: Promise<{ 'product-id': string }>;
}

/**
 * Validate file path: allow alphanumeric, dots, hyphens, underscores.
 * No path separators (flat filenames only); reject '..' and backslashes.
 */
function isValidFilePath(file: string): boolean {
  if (!file || typeof file !== 'string') return false;
  const t = file.trim();
  if (t.length === 0) return false;
  if (t.includes('..') || t.includes('\\') || t.includes('/')) return false;
  return /^[a-zA-Z0-9_.-]+$/.test(t);
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { 'product-id': productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'File path is required. Use ?file=filename.' },
        { status: 400 }
      );
    }

    if (!isValidFilePath(file)) {
      return NextResponse.json(
        { error: 'Invalid file path.' },
        { status: 400 }
      );
    }

    const hasAccess = await hasProductAccess(user.id, productId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'You do not have access to this product. Please purchase it first.' },
        { status: 403 }
      );
    }

    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found.' },
        { status: 404 }
      );
    }

    const slug = (product.slug ?? product.category ?? '') as string;
    const allowed = getAllowedFilenamesForPackage(slug);
    if (allowed.size > 0 && !allowed.has(file)) {
      return NextResponse.json(
        { error: 'File not found or could not be downloaded.' },
        { status: 404 }
      );
    }

    // Get user's order for this product to create watermark
    // Query order_items directly to find the order that contains this product
    const supabaseForOrders = await createServiceRoleClient();
    const { data: orderItem, error: orderItemError } = await supabaseForOrders
      .from('order_items')
      .select('order_id, order:orders!inner(id, status, user_id)')
      .eq('product_id', productId)
      .eq('order.user_id', user.id)
      .eq('order.status', 'completed')
      .limit(1)
      .maybeSingle();
    
    // Order ID is optional - watermark will still work without it
    const orderId = orderItem?.order_id || '';

    // Generate download token and watermark data
    const downloadToken = generateDownloadToken(user.id, productId, file);
    const watermarkData = createWatermarkData(user.id, orderId, productId, file);

    // Get client IP and user agent for tracking
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    const userAgent = request.headers.get('user-agent') || null;
    const referer = request.headers.get('referer') || null;

    // Log the download (async, don't wait)
    logDownload({
      userId: user.id,
      productId,
      filename: file,
      downloadToken,
      ipAddress,
      userAgent,
      referer,
      orderId: orderId || null,
      watermarkData,
    }).catch(err => {
      console.error('Failed to log download (non-blocking):', err);
    });

    const supabase = await createServiceRoleClient();
    const filePath = `${productId}/${file}`;

    const { data, error } = await supabase.storage
      .from('digital-products')
      .download(filePath);

    if (error || !data) {
      console.error('Error downloading file from storage:', error);
      return NextResponse.json(
        { error: 'File not found or could not be downloaded.' },
        { status: 404 }
      );
    }

    let buffer = Buffer.from(await data.arrayBuffer());
    const contentType = getContentType(file);
    const fileExtension = file.split('.').pop()?.toLowerCase() || '';

    // Apply watermarking based on file type
    if (fileExtension === 'md' || contentType === 'text/markdown') {
      // Watermark Markdown files
      const content = buffer.toString('utf-8');
      const watermarkedContent = watermarkMarkdown(content, watermarkData);
      buffer = Buffer.from(watermarkedContent, 'utf-8');
    }
    // For PDF, ZIP, and other binary files, watermarking would require
    // specialized libraries (pdf-lib, adm-zip, etc.) - can be added later
    // For now, metadata is tracked in download_logs

    // Add custom headers with watermark info (for tracking if file is shared)
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${file}"`,
      'Content-Length': buffer.length.toString(),
      'X-Download-Token': downloadToken, // For tracking if file is shared
    };

    return new NextResponse(buffer, { headers });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      throw err;
    }
    console.error('Error in download endpoint:', err);
    const msg = err instanceof Error ? err.message : 'Failed to download file.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
