# Payment Flow

This document describes how checkout and payment work: Stripe Checkout, webhooks, cart clearing, and app coupons.

## Overview

- **Card entry**: Customers enter payment details on **Stripe Checkout** (redirect). The app never handles card data (PCI-friendly).
- **Flow**: Checkout page (auth required) → Cart Review → Customer Info → Order Review → Place Order → order created (or existing pending order reused) → redirect to Stripe Checkout → payment → webhook updates order and **clears cart**.

## When the cart is cleared

The cart is **not** cleared when the order is created. It is cleared only **after successful payment**, in the Stripe webhook handler `checkout.session.completed` (see `lib/stripe/webhooks.ts`). If the user abandons or cancels payment, their cart remains so they can retry or edit.

## App coupon and Stripe

- App-side coupon (entered at checkout) is applied to the order total and sent to Stripe as a **negative line item** so the Stripe session total matches `order.total_amount`.
- When an app coupon is applied, Stripe promotion codes are disabled for that session to avoid double discount. When no app coupon is used, Stripe promotion codes are allowed.

## Resume payment (idempotency)

If the user clicks "Place Order" again with the same cart (e.g. double-click or refresh), the API returns the existing **pending** order instead of creating a duplicate. The client then creates a Stripe Checkout session for that order and redirects as usual.

## Abandoned cart email

- **Trigger**: On Vercel **Hobby**, cron runs once per day via `GET /api/cron/daily` (schedule `0 2 * * *` in `vercel.json`). That single daily cron runs both piracy monitoring and abandoned-cart. The abandoned-cart logic also lives in `GET /api/cron/abandoned-cart` for manual runs from the Vercel dashboard. Secured with `CRON_SECRET` (Authorization: Bearer) or Vercel cron header.
- **Logic**: Finds users who have at least one cart item older than 1 hour; for each, builds `AbandonedCartEmailData` (user email/name, cart items with product name/slug/price/quantity) and enqueues an `abandoned-cart` email. The email queue processes it and calls `sendAbandonedCartReminder`.
- **Email CTA**: Link in the email points to `/checkout`. Cart is cleared only after successful payment, so the user’s cart is still there when they return.
- **Preferences**: Abandoned-cart is gated by `email_promotional` in notification preferences (see `lib/email/utils.ts`).

## Webhook

- **Endpoint**: `POST /api/stripe/webhook`
- **Verification**: Request body is verified with `STRIPE_WEBHOOK_SECRET` (Stripe signature). Do not skip verification in production.
- **Events used**: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
- **Production**: Register the webhook URL in the Stripe Dashboard and set `STRIPE_WEBHOOK_SECRET` for that endpoint.

## Stripe price IDs (checkout)

- **Checkout** uses **environment variables** for Stripe price IDs: `STRIPE_PRICE_AGENCY`, `STRIPE_PRICE_SOCIAL_MEDIA`, `STRIPE_PRICE_WEB_APPS`, `STRIPE_PRICE_FREELANCING`, `STRIPE_PRICE_MASTER_BUNDLE`. Each must be set to a Stripe Price ID (`price_xxx`). Line items are built from order item `product_sku` (slug) and the corresponding env var; no DB `stripe_price_id` is used for checkout.
- **Display** (cart, checkout UI, product pages) uses `products.price` from the DB. Run `npx tsx scripts/sync-display-prices-from-stripe.ts` after changing a price in Stripe or setting a new env var so UI reflects Stripe pricing.

## Related files

- `app/api/stripe/create-checkout-session/route.ts` — Creates Stripe Checkout session (line items from env price IDs, discount, tax)
- `app/api/orders/create/route.ts` — Creates order (or returns existing pending order); does **not** clear cart
- `lib/stripe/webhooks.ts` — Handles Stripe events; clears cart in `handleCheckoutSessionCompleted`
- `app/api/cron/daily/route.ts` — Single daily cron (Hobby): piracy monitor + abandoned-cart; `vercel.json` has one cron entry for `/api/cron/daily` at 2 AM UTC
- `app/api/cron/abandoned-cart/route.ts` — Abandoned-cart only (for manual runs); shared logic in `lib/cron/run-abandoned-cart.ts`
- `lib/email/senders.ts` — `sendAbandonedCartReminder`; `lib/email/queue.ts` — processes `abandoned-cart`
- `docs/TAX_IMPLEMENTATION_GUIDE.md` — Tax configuration and Stripe Tax

---

## Production environment checklist

Ensure these are set in production:

| Variable | Purpose |
|--------|---------|
| `STRIPE_SECRET_KEY` | Server-side Stripe API (e.g. `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification (from Stripe Dashboard webhook endpoint) |
| `STRIPE_PRICE_AGENCY`, `STRIPE_PRICE_SOCIAL_MEDIA`, `STRIPE_PRICE_WEB_APPS`, `STRIPE_PRICE_FREELANCING`, `STRIPE_PRICE_MASTER_BUNDLE` | Stripe Price ID (`price_xxx`) per sellable product; checkout uses these. Use test IDs for test, live for production. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side key (e.g. `pk_live_...`) if using Stripe.js |
| `NEXT_PUBLIC_APP_URL` | App root URL for Stripe redirect URLs (success/cancel) |
| `CRON_SECRET` | Optional: secures cron routes; set in Vercel. **No leading or trailing whitespace** (Vercel rejects it for HTTP headers). Windows-safe: `node -e "require('fs').writeFileSync('.cron-secret-tmp', require('crypto').randomBytes(32).toString('hex'), 'utf8')"` then `cmd /c "vercel env add CRON_SECRET production < .cron-secret-tmp"`; delete `.cron-secret-tmp` after. |

Use **live** keys and the **live** webhook secret in production. Test with **test** keys and Stripe CLI (`stripe listen --forward-to .../api/stripe/webhook`) locally.
