import { createServiceRoleClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  const supabase = await createServiceRoleClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== 'subscription' || !session.subscription || !session.client_reference_id) break;
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const subItem = subscription.items.data[0];
      await supabase.from('subscriptions').upsert({
        user_id: session.client_reference_id,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        plan_id: subItem?.price.id ?? null,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'stripe_subscription_id' });
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const status = subscription.status === 'canceled' || subscription.status === 'unpaid' ? 'canceled' : subscription.status;
      await supabase
        .from('subscriptions')
        .update({
          status,
          plan_id: subscription.items.data[0]?.price.id ?? null,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }
    default:
      // Unhandled event type
      break;
  }

  return NextResponse.json({ received: true });
}
