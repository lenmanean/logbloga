/**
 * GET /api/products/[id]/preview
 * Returns package preview markdown (public, no auth).
 * Only active package/bundle with allowlisted slug; content from repo previews/{slug}.md.
 */

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { getProductById } from '@/lib/db/products';

const ALLOWLISTED_SLUGS = ['web-apps', 'social-media', 'agency', 'freelancing', 'master-bundle'] as const;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id: productId } = await params;
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const productType = product.product_type ?? '';
    if (productType !== 'package' && productType !== 'bundle') {
      return NextResponse.json({ error: 'Preview not available for this product' }, { status: 404 });
    }

    const slug = (product.slug ?? '').trim();
    if (!slug || !ALLOWLISTED_SLUGS.includes(slug as (typeof ALLOWLISTED_SLUGS)[number])) {
      return NextResponse.json({ error: 'Preview not available for this product' }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), 'previews', `${slug}.md`);
    const content = await readFile(filePath, 'utf-8');

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load preview';
    if (message.includes('ENOENT')) {
      return NextResponse.json({ error: 'Preview not found' }, { status: 404 });
    }
    console.error('GET /api/products/[id]/preview:', err);
    return NextResponse.json({ error: 'Failed to load preview' }, { status: 500 });
  }
}
