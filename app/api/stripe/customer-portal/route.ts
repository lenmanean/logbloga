/**
 * POST /api/stripe/customer-portal
 * Create Stripe Customer Portal session
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getStripeClient } from '@/lib/stripe/client';
import { getStripeCustomerId } from '@/lib/stripe/customers';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const customerId = await getStripeCustomerId(user.id);

    if (!customerId) {
      return NextResponse.json({ error: 'Stripe customer not found' }, { status: 400 });
    }

    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    const stripe = getStripeClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/account/billing`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create customer portal session';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

