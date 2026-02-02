# Pre-Test Checklist: Payment & Coupon Flow (After Changing Stripe Prices to Non-Zero)

Use this checklist before running a real payment and testing email, coupon, and completion flow.

## 0. Display consistency (Supabase package prices at $0.01)

Migration **`000044_set_test_pricing_packages.sql`** sets `products.price` and `products.original_price` to **$0.01** for all packages: **web-apps**, **social-media**, **agency**, **freelancing**, **master-bundle**. After applying it (`supabase db push` or run the migration), order totals and the payment receipt will show **$0.01** and match what Stripe charges. Apply this migration **before** creating test orders.

To revert after testing, run a follow-up migration that restores the previous package prices.

## 1. Stripe Price IDs vs Supabase

**Checkout uses `products.stripe_price_id`** from Supabase to build line items. The amount charged is whatever that Stripe Price object is.

- **If you edited the existing Stripe Price** (same `price_xxx` ID) to a non-zero amount:  
  No change needed. Supabase already points to that ID; checkout will charge the new amount.

- **If you created new Stripe Price objects** (new IDs):  
  Update Supabase so each package product points to the new price:
  - In Supabase Dashboard → Table Editor → `products`, set `stripe_price_id` for each package (e.g. `agency`, `social-media`, `web-apps`, `freelancing`, `master-bundle`) to the new Stripe Price ID.

## 2. Use a New Order for Testing

Create a **new** order after your price change. Do not reuse an old pending order that was created when prices were $0, so the checkout session uses the current Stripe prices.

- Add a package to cart → Checkout → Place order (creates order) → Pay (Stripe Checkout).
- With migration `000044` applied, order totals and the receipt will show **$0.01** for each package (including Master Bundle), matching Stripe.

## 3. Webhook Must Reach Your App

- **Production (or deployed preview):** In Stripe Dashboard → Developers → Webhooks, the endpoint (e.g. `https://yourdomain.com/api/stripe/webhook`) must be correct and receiving `checkout.session.completed` and `payment_intent.succeeded`. Ensure the webhook secret in your env (`STRIPE_WEBHOOK_SECRET`) matches the endpoint’s signing secret.

- **Local testing:** Use Stripe CLI:  
  `stripe listen --forward-to localhost:3000/api/stripe/webhook`  
  and set `STRIPE_WEBHOOK_SECRET` to the CLI’s printed secret.

## 4. Environment Variables Where the Webhook Runs

The webhook handler runs on the server that receives the Stripe event (your deployed app or localhost with CLI). That environment must have:

- **`RESEND_API_KEY`** – so the payment receipt email can be sent.
- **`RESEND_FROM_EMAIL`** – optional; defaults to `mail@logbloga.com`.
- **`LOGBLOGA_PARTNER_SECRET`** – so the Doer coupon can be requested and included in the receipt.

Without these, the order can still complete but the receipt and/or Doer coupon may fail.

## 5. Quick Verification

1. Create a new order with one package (e.g. Agency or Master Bundle).
2. Complete Stripe Checkout with a non-zero price (test card or real card).
3. After payment:
   - Order status should become **completed** (not stuck in `processing`).
   - Customer should receive the **payment receipt** email (with Doer coupon section if it’s a package).
   - In Account → Orders (or Products), the **Doer coupon** should appear for that order.

If any step fails, check webhook delivery in Stripe Dashboard and server logs for the webhook route.
