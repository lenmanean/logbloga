import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db/products';

export async function GET() {
  try {
    // Only return packages for customer-facing API
    const products = await getAllProducts({ active: true, productType: 'package' });
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
