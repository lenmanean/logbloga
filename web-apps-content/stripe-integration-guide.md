# Stripe Integration Guide for SaaS

## Overview

This guide covers integrating Stripe subscriptions into your SaaS application, including checkout, webhooks, and subscription management.

**Current API Version**: 2024-11-20.acacia
**Documentation**: [stripe.com/docs/billing](https://stripe.com/docs/billing)

## Prerequisites

- Stripe account with subscriptions enabled
- Next.js application with Supabase
- User authentication working

## Step 1: Create Subscription Products

### In Stripe Dashboard

1. Go to Products
2. Click "Add product"
3. Set up pricing:
   - **Name**: "Pro Plan"
   - **Pricing model**: Recurring
   - **Price**: $29/month (or your price)
   - **Billing period**: Monthly
4. Save and note the **Price ID** (starts with `price_...`)

### Create Multiple Tiers

Create tiers like:
- **Starter**: $9/month
- **Pro**: $29/month
- **Enterprise**: $99/month

## Step 2: Install Stripe

```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

## Step 3: Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Get after setting up webhook
```

## Step 4: Create Checkout Session

### API Route

Create `app/api/create-checkout-session/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId } = await request.json();

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

## Step 5: Create Checkout Page

Create `app/pricing/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (priceId: string) => {
    setLoading(true);

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });

    const { sessionId } = await response.json();
    const stripe = await stripePromise;

    if (stripe) {
      await stripe.redirectToCheckout({ sessionId });
    }

    setLoading(false);
  };

  const plans = [
    {
      name: 'Starter',
      price: '$9',
      priceId: 'price_starter',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
    },
    {
      name: 'Pro',
      price: '$29',
      priceId: 'price_pro',
      features: ['All Starter', 'Feature 4', 'Feature 5'],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Pricing</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className="border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
            <div className="text-4xl font-bold mb-6">{plan.price}/month</div>
            <ul className="mb-8 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(plan.priceId)}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              {loading ? 'Loading...' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Step 6: Set Up Webhooks

### Create Webhook Endpoint

Create `app/api/webhooks/stripe/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createClient();

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId) {
        // Update user subscription in database
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status: 'active',
          });
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      // Update subscription status in database
      await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
        })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
```

### Configure Webhook in Stripe

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy webhook signing secret to `.env.local`

### Test Webhooks Locally

Use Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Step 7: Subscription Management

### Create Subscription Status Page

Create `app/dashboard/subscription/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Get subscription from database
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (subscription) {
    // Get subscription details from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripe_subscription_id
    );

    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Subscription</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Status: {stripeSubscription.status}</p>
          <p>Current Plan: {subscription.plan_name}</p>
          <p>
            Next billing date:{' '}
            {new Date(
              stripeSubscription.current_period_end * 1000
            ).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Subscription</h1>
      <p>No active subscription</p>
      <a href="/pricing" className="text-blue-600">
        View Plans
      </a>
    </div>
  );
}
```

## Step 8: Cancel Subscription

Create API route `app/api/cancel-subscription/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', user.id)
    .single();

  if (subscription) {
    await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
}
```

## Step 9: Database Schema

Create subscriptions table:

```sql
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  stripe_customer_id text not null,
  stripe_subscription_id text not null,
  status text not null,
  plan_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);
```

## Common Issues

### Webhook Not Receiving Events

**Check**:
- Webhook URL is correct and accessible
- Webhook secret matches
- Events are selected in Stripe dashboard
- Endpoint is returning 200 status

### Subscription Not Updating

**Verify**:
- Webhook is processing events
- Database is being updated
- RLS policies allow updates

## Resources

- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)

---

**Your Stripe subscription integration is complete!** Test thoroughly before going live.
