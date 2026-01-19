/**
 * POST /api/stripe/payment-methods/[id]/set-default
 * Set payment method as default
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getStripeCustomerId, setDefaultPaymentMethod } from '@/lib/stripe/customers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id: paymentMethodId } = await params;

    const customerId = await getStripeCustomerId(user.id);

    if (!customerId) {
      return NextResponse.json({ error: 'Stripe customer not found' }, { status: 400 });
    }

    await setDefaultPaymentMethod(customerId, paymentMethodId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to set default payment method';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

