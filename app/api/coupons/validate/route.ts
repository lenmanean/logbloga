import { requireAuth } from '@/lib/auth/utils';
import { validateCoupon, applyCoupon } from '@/lib/db/coupons';
import { NextResponse } from 'next/server';

/**
 * POST /api/coupons/validate
 * Validate a coupon code and calculate discount
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    const { code, cartTotal, productIds } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    if (typeof cartTotal !== 'number' || cartTotal < 0) {
      return NextResponse.json(
        { error: 'Valid cart total is required' },
        { status: 400 }
      );
    }

    // Validate coupon
    const validationResult = await validateCoupon(
      code,
      cartTotal,
      productIds || []
    );

    if (!validationResult.valid || !validationResult.coupon) {
      return NextResponse.json(
        {
          valid: false,
          error: validationResult.error || 'Invalid coupon code',
        },
        { status: 200 } // Return 200 with valid: false for client-side handling
      );
    }

    // Calculate discount
    const discount = applyCoupon(validationResult.coupon, cartTotal);

    return NextResponse.json({
      valid: true,
      coupon: validationResult.coupon,
      discountAmount: discount.discountAmount,
      finalTotal: discount.finalTotal,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }

    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}

