/**
 * GET /api/products/cart-details?ids=id1,id2,id3
 * Public: returns minimal product fields for cart display (guest or pre-checkout).
 * Used to resolve guest cart item IDs to title, price, image, slug. No auth required.
 */

import { NextResponse } from 'next/server';
import { getProductsByIds } from '@/lib/db/products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    if (!idsParam || typeof idsParam !== 'string') {
      return NextResponse.json({ products: [] }, { status: 200 });
    }
    const ids = idsParam.split(',').map((id) => id.trim()).filter(Boolean);
    if (ids.length === 0) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }
    const products = await getProductsByIds(ids);
    const cartDetails = products.map((p) => ({
      id: p.id,
      title: p.title ?? p.name ?? 'Product',
      slug: p.slug ?? null,
      price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price ?? 0)),
      package_image: p.package_image ?? null,
      images: p.images ?? null,
    }));
    return NextResponse.json({ products: cartDetails }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cart product details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}
