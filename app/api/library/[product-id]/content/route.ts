/**
 * GET /api/library/[product-id]/content
 * Securely fetch markdown content from Supabase Storage for in-browser rendering.
 * Requires authentication and product access.
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { hasProductAccess } from '@/lib/db/access';
import { getProductById } from '@/lib/db/products';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { getAllowedFilenamesForPackage } from '@/lib/data/package-level-content';

interface RouteParams {
  params: Promise<{ 'product-id': string }>;
}

/**
 * Validate filename to prevent directory traversal.
 * Only allow simple filenames (no path separators or parent refs).
 */
function isValidFilename(filename: string): boolean {
  if (!filename || typeof filename !== 'string') return false;
  const trimmed = filename.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.includes('..') || trimmed.includes('/') || trimmed.includes('\\')) return false;
  return /^[a-zA-Z0-9_.-]+\.(md|markdown)$/i.test(trimmed);
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
    const filename = searchParams.get('file');

    if (!filename) {
      return NextResponse.json(
        { error: 'File query parameter is required' },
        { status: 400 }
      );
    }

    if (!isValidFilename(filename)) {
      return NextResponse.json(
        { error: 'Invalid file path. Only .md and .markdown files are allowed.' },
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
    if (allowed.size > 0 && !allowed.has(filename)) {
      return NextResponse.json(
        { error: 'File not found or could not be downloaded.' },
        { status: 404 }
      );
    }

    const supabase = await createServiceRoleClient();
    const filePath = `${productId}/${filename}`;

    const { data, error } = await supabase.storage
      .from('digital-products')
      .download(filePath);

    if (error || !data) {
      console.error('Error fetching content from storage:', error);
      return NextResponse.json(
        { error: 'File not found or could not be loaded' },
        { status: 404 }
      );
    }

    const text = await data.text();

    return new NextResponse(text, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        // Use stale-while-revalidate for better UX while ensuring fresh content
        'Cache-Control': 'private, no-cache, must-revalidate',
        // Prevent CDN caching to ensure content updates are immediately visible
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      throw err;
    }
    console.error('Error in content endpoint:', err);
    const msg = err instanceof Error ? err.message : 'Failed to fetch content';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
