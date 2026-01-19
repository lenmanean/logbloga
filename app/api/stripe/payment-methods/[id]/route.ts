/**
 * DELETE /api/stripe/payment-methods/[id] - Remove payment method
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { detachPaymentMethod } from '@/lib/stripe/customers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;

    await detachPaymentMethod(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error removing payment method:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to remove payment method';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

