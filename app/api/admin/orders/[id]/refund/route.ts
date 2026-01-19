import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/permissions';
import { getStripeClient } from '@/lib/stripe/client';
import { updateOrderStatus } from '@/lib/admin/orders';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Payment intent ID is required' }, { status: 400 });
    }

    const stripe = getStripeClient();

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    // Update order status to refunded
    await updateOrderStatus(id, 'refunded');

    return NextResponse.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
      },
    });
  } catch (error: any) {
    console.error('Error processing refund:', error);
    const errorMessage = error?.message || 'Failed to process refund';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

