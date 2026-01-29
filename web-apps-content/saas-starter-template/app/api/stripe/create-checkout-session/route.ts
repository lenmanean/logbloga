import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: 'STRIPE_PRICE_ID not configured' },
      { status: 500 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  try {
    const session = await stripeClient.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?success=true`,
      cancel_url: `${appUrl}/dashboard/subscribe`,
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: { user_id: user.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Checkout failed' },
      { status: 500 }
    );
  }
}
