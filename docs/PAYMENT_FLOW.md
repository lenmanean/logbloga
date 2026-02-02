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

## Webhook

- **Endpoint**: `POST /api/stripe/webhook`
- **Verification**: Request body is verified with `STRIPE_WEBHOOK_SECRET` (Stripe signature). Do not skip verification in production.
- **Events used**: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
- **Production**: Register the webhook URL in the Stripe Dashboard and set `STRIPE_WEBHOOK_SECRET` for that endpoint.

## Related files

- `app/api/stripe/create-checkout-session/route.ts` — Creates Stripe Checkout session (line items, discount, tax)
- `app/api/orders/create/route.ts` — Creates order (or returns existing pending order); does **not** clear cart
- `lib/stripe/webhooks.ts` — Handles Stripe events; clears cart in `handleCheckoutSessionCompleted`
- `docs/TAX_IMPLEMENTATION_GUIDE.md` — Tax configuration and Stripe Tax

---

## Production environment checklist

Ensure these are set in production:

| Variable | Purpose |
|--------|---------|
| `STRIPE_SECRET_KEY` | Server-side Stripe API (e.g. `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification (from Stripe Dashboard webhook endpoint) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side key (e.g. `pk_live_...`) if using Stripe.js |
| `NEXT_PUBLIC_APP_URL` | App root URL for Stripe redirect URLs (success/cancel) |

Use **live** keys and the **live** webhook secret in production. Test with **test** keys and Stripe CLI (`stripe listen --forward-to .../api/stripe/webhook`) locally.
