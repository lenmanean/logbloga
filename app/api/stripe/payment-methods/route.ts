/**
 * GET /api/stripe/payment-methods - Get user's saved payment methods
 * POST /api/stripe/payment-methods - Add new payment method
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getOrCreateStripeCustomer, getStripePaymentMethods, attachPaymentMethod } from '@/lib/stripe/customers';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser?.email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    // Get or create Stripe customer
    const customer = await getOrCreateStripeCustomer(user.id, authUser.email, authUser.user_metadata?.full_name);

    // Get payment methods
    const paymentMethods = await getStripePaymentMethods(customer.id);

    return NextResponse.json({
      paymentMethods,
      customerId: customer.id,
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payment methods';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { paymentMethodId } = body;

    if (!paymentMethodId) {
      return NextResponse.json({ error: 'Payment method ID is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser?.email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    // Get or create Stripe customer
    const customer = await getOrCreateStripeCustomer(user.id, authUser.email, authUser.user_metadata?.full_name);

    // Attach payment method
    const paymentMethod = await attachPaymentMethod(customer.id, paymentMethodId);

    return NextResponse.json({
      success: true,
      paymentMethod,
    });
  } catch (error) {
    console.error('Error adding payment method:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to add payment method';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

