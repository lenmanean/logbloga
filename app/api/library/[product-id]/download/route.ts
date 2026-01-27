/**
 * GET /api/library/[product-id]/download
 * Secure download endpoint for digital products.
 * Only flat filenames are allowed; each must be in the package allowlist.
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { hasProductAccess } from '@/lib/db/access';
import { getProductById } from '@/lib/db/products';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { getContentType } from '@/lib/utils/content';
import { getAllowedFilenamesForPackage } from '@/lib/data/package-level-content';

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

    const buffer = Buffer.from(await data.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': getContentType(file),
        'Content-Disposition': `attachment; filename="${file}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      throw err;
    }
    console.error('Error in download endpoint:', err);
    const msg = err instanceof Error ? err.message : 'Failed to download file.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
