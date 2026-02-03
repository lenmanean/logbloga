import { requireAuth } from '@/lib/auth/utils';
import { getUserCartItems, addCartItem } from '@/lib/db/cart';
import { hasProductAccess, hasProductAccessBySlug } from '@/lib/db/access';
import { getProductBySlug } from '@/lib/db/products';
import { NextResponse } from 'next/server';
import type { Product } from '@/lib/types/database';

const PACKAGE_SLUGS = ['web-apps', 'social-media', 'agency', 'freelancing'] as const;

/**
 * GET /api/cart
 * Get all cart items for authenticated user
 */
export async function GET() {
  try {
    const user = await requireAuth();
    const cartItems = await getUserCartItems(user.id);

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart items' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Add item to cart
 * Only allows packages to be added
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { productId, quantity, variantId } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity <= 0 || quantity > 10) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Validate that product is a package or bundle
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('id, product_type, active')
      .eq('id', productId)
      .single();

    if (productError || !productData) {
      console.error('Error fetching product:', productError);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Type assertion - product_type column exists in database but may not be in generated types
    const product = productData as unknown as Product;

    if (!product.active) {
      return NextResponse.json(
        { error: 'Product is no longer available' },
        { status: 400 }
      );
    }

    // Only allow packages and bundles (e.g. Master Bundle) to be added to cart
    const cartEligibleTypes = ['package', 'bundle'];
    if (!product.product_type || !cartEligibleTypes.includes(product.product_type)) {
      return NextResponse.json(
        { error: 'Only packages can be added to cart.' },
        { status: 400 }
      );
    }

    // If adding a package: do not allow if user already owns the Master Bundle
    if (product.product_type === 'package') {
      const bundle = await getProductBySlug('master-bundle');
      if (bundle?.id && (await hasProductAccess(user.id, bundle.id))) {
        return NextResponse.json(
          { error: 'You already have the Master Bundle. Individual packages are not sold separately to bundle owners.' },
          { status: 400 }
        );
      }
    }

    // If adding the bundle: do not allow if user already owns all four packages
    if (product.product_type === 'bundle') {
      const allPackagesOwned = await Promise.all(
        PACKAGE_SLUGS.map((slug) => hasProductAccessBySlug(user.id, slug))
      );
      if (allPackagesOwned.every(Boolean)) {
        return NextResponse.json(
          { error: 'You already own all four packages. The Master Bundle is not available.' },
          { status: 400 }
        );
      }
    }

    // One per product: packages and bundle are limited to quantity 1
    const effectiveQuantity = Math.min(quantity, 1);

    const cartItem = await addCartItem(
      user.id,
      productId,
      effectiveQuantity,
      variantId
    );

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
    
    if (errorMessage.includes('not found') || errorMessage.includes('no longer available')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

