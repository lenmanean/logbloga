# Stripe Basic Setup Guide

## Overview

This guide walks you through setting up Stripe for basic payment processing in your Next.js application. Stripe is a payment processing platform that handles credit cards, subscriptions, and more.

**Current API Version**: 2024-11-20.acacia (as of January 2025)
**Documentation**: [stripe.com/docs](https://stripe.com/docs)

## Prerequisites

- A Stripe account (free to create)
- A Next.js application ready for integration
- Basic understanding of API concepts

## Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Click "Start now" or "Sign up"
3. Enter your email and create a password
4. Complete account verification:
   - Business information
   - Bank account details (for payouts)
   - Identity verification

**Note**: You can start in Test Mode to develop without processing real payments.

## Step 2: Get API Keys

1. Log into [Stripe Dashboard](https://dashboard.stripe.com)
2. Toggle to **Test mode** (top right)
3. Navigate to **Developers** → **API keys**
4. Copy your keys:
   - **Publishable key**: Starts with `pk_test_...` (safe for frontend)
   - **Secret key**: Starts with `sk_test_...` (keep secret, backend only)

**Important**: Never commit secret keys to Git. Always use environment variables.

## Step 3: Install Stripe Libraries

In your Next.js project:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

For server-side operations:

```bash
npm install stripe
```

## Step 4: Set Up Environment Variables

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

Add to `.gitignore`:
```
.env.local
.env*.local
```

## Step 5: Create a Product in Stripe

1. In Stripe Dashboard, go to **Products**
2. Click **Add product**
3. Fill in:
   - **Name**: Your product name
   - **Description**: Product description
   - **Pricing**: Set one-time or recurring price
   - **Currency**: USD (or your currency)
4. Click **Save product**
5. Note the **Price ID** (starts with `price_...`)

## Step 6: Frontend Setup

### 6.1 Create Payment Page

Create `app/payment/page.tsx`:

```typescript
'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentPage() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Complete Your Purchase</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
```

### 6.2 Create Checkout Form Component

Create `components/CheckoutForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setLoading(false);
      return;
    }

    // Create payment intent on server
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 2000 }), // $20.00 in cents
    });

    const { clientSecret } = await response.json();

    const { error: confirmError } = await stripe.confirmPayment({
      clientSecret,
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (confirmError) {
      setError(confirmError.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
```

## Step 7: Backend API Route

Create `app/api/create-payment-intent/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
```

## Step 8: Success Page

Create `app/payment/success/page.tsx`:

```typescript
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="max-w-md mx-auto mt-8 text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        Payment Successful!
      </h1>
      <p className="mb-4">Thank you for your purchase.</p>
      <Link
        href="/"
        className="text-blue-500 hover:underline"
      >
        Return to Home
      </Link>
    </div>
  );
}
```

## Step 9: Test Payments

### 9.1 Test Card Numbers

Use these in Test Mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any:
- Future expiry date (e.g., 12/34)
- Any 3-digit CVC
- Any ZIP code

### 9.2 Test Payment Flow

1. Start your dev server: `npm run dev`
2. Navigate to `/payment`
3. Enter test card details
4. Complete payment
5. Verify success page appears

## Step 10: View Test Data

1. Go to Stripe Dashboard
2. Check **Payments** tab to see test transactions
3. Check **Customers** tab for created customers
4. Use **Events** tab to debug webhook issues

## Security Best Practices

1. **Never expose secret keys**: Only use in server-side code
2. **Validate amounts server-side**: Never trust client-side amounts
3. **Use HTTPS**: Always in production
4. **Verify webhook signatures**: When implementing webhooks
5. **Store customer data securely**: Follow PCI compliance guidelines

## Common Issues

### "Invalid API Key"
- Check you're using Test keys in Test mode
- Verify keys are in environment variables
- Ensure no extra spaces in keys

### "Payment method not supported"
- Ensure you're using a supported card type
- Check your Stripe account country settings

### "Amount too small"
- Stripe minimum is $0.50 USD
- Ensure amount is in cents (e.g., 500 = $5.00)

## Next Steps

1. **Implement webhooks**: Handle payment events server-side
2. **Add subscription support**: For recurring payments
3. **Create customer portal**: Let customers manage subscriptions
4. **Switch to live mode**: When ready for real payments

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Security](https://stripe.com/docs/security)

## AI Assistance

**Using ChatGPT**:
- Ask for explanations of Stripe concepts
- Get help debugging payment errors
- Understand webhook implementation

**Using Cursor**:
- Generate Stripe integration code
- Auto-complete payment flows
- Refactor payment components

---

**You're ready to accept payments!** Test thoroughly before switching to live mode.
