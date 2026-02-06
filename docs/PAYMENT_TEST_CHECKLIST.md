# Payment Test Checklist

Use this checklist before running payment tests and verifying the full flow (Stripe Test Mode, email, coupon, completion).

## 1. Stripe Price IDs (environment variables)

**Checkout uses environment variables** (`STRIPE_PRICE_*` per product slug), not `products.stripe_price_id` from Supabase. The amount charged is whatever that Stripe Price object is.

- Set these in your environment (e.g. Vercel, `.env.local`):
  `STRIPE_PRICE_AGENCY`, `STRIPE_PRICE_SOCIAL_MEDIA`, `STRIPE_PRICE_WEB_APPS`, `STRIPE_PRICE_FREELANCING`, `STRIPE_PRICE_MASTER_BUNDLE` — each to a Stripe Price ID (`price_xxx`). Use **test** price IDs for test mode, **live** for production.
- After changing a price in Stripe or setting a new env var, run **`npx tsx scripts/sync-display-prices-from-stripe.ts`** so `products.price` in the DB matches Stripe and the UI shows the correct amount.

## 2. Use a New Order for Testing

Create a **new** order after your price change. Do not reuse an old pending order.

- Add a package to cart → Checkout → Place order (creates order) → Pay (Stripe Checkout).
- Use Stripe test card `4242 4242 4242 4242` for successful payment in Test Mode.

## 3. Webhook Must Reach Your App

- **Production (or deployed preview):** In Stripe Dashboard → Developers → Webhooks, the endpoint (e.g. `https://yourdomain.com/api/stripe/webhook`) must be correct and receiving `checkout.session.completed` and `payment_intent.succeeded`. Ensure the webhook secret in your env (`STRIPE_WEBHOOK_SECRET`) matches the endpoint's signing secret.

- **Local testing:** Use Stripe CLI:
  `stripe listen --forward-to localhost:3000/api/stripe/webhook`
  and set `STRIPE_WEBHOOK_SECRET` to the CLI's printed secret.

## 4. Environment Variables Where the Webhook Runs

The webhook handler runs on the server that receives the Stripe event. That environment must have:

- **`RESEND_API_KEY`** – so the payment receipt email can be sent.
- **`RESEND_FROM_EMAIL`** – optional; defaults to `mail@logbloga.com`.
- **`LOGBLOGA_PARTNER_SECRET`** – so the Doer coupon can be requested and included in the receipt.

Without these, the order can still complete but the receipt and/or Doer coupon may fail.

## 5. Quick Verification

1. Create a new order with one package (e.g. Agency or Master Bundle).
2. Complete Stripe Checkout with a test card (e.g. `4242 4242 4242 4242` in Test Mode).
3. After payment:
   - Order status should become **completed** (not stuck in `processing`).
   - Customer should receive the **payment receipt** email (with Doer coupon section if it's a package).
   - In Account → Orders (or Products), the **Doer coupon** should appear for that order.

If any step fails, check webhook delivery in Stripe Dashboard and server logs for the webhook route.
