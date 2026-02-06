# Environment Variables: Live vs Test Mode

Use **live** Stripe keys and **live** price IDs in production. Use **test** keys and **test** price IDs for local or preview. Never mix modes (e.g. test key with live price ID).

---

## Full list

| Variable | Live (production) | Test (local / preview) | Purpose |
|----------|------------------|------------------------|---------|
| **Supabase** *(same project in both)* | | | |
| `NEXT_PUBLIC_SUPABASE_URL` | Same | Same | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same | Same | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Same | Same | Server-only Supabase access |
| **Stripe** | | | |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | `pk_test_...` | Client-side Stripe (Checkout, etc.) |
| `STRIPE_SECRET_KEY` | `sk_live_...` | `sk_test_...` | Server Stripe API |
| `STRIPE_WEBHOOK_SECRET` | Live endpoint signing secret (`whsec_...`) | Test endpoint secret or Stripe CLI secret | Webhook signature verification |
| `STRIPE_PRICE_AGENCY` | Live price ID (`price_...`) | Test price ID | Checkout line item |
| `STRIPE_PRICE_SOCIAL_MEDIA` | Live price ID | Test price ID | Checkout line item |
| `STRIPE_PRICE_WEB_APPS` | Live price ID | Test price ID | Checkout line item |
| `STRIPE_PRICE_FREELANCING` | Live price ID | Test price ID | Checkout line item |
| `STRIPE_PRICE_MASTER_BUNDLE` | Live price ID | Test price ID | Checkout line item |
| **App** | | | |
| `NEXT_PUBLIC_APP_URL` | `https://logbloga.com` (or your live URL) | `http://localhost:3000` or preview URL | Redirects, links, webhook base URL |
| **Email (Resend)** | | | |
| `RESEND_API_KEY` | Set | Set (can be same) | Sending emails (receipts, etc.) |
| `RESEND_FROM_EMAIL` | e.g. `mail@logbloga.com` | Optional (defaults used) | From address for emails |
| **Payment / coupons** | | | |
| `LOGBLOGA_PARTNER_SECRET` | Set | Set (or omit; coupon step may be skipped) | Doer coupon on package purchase |
| **Cron (production)** | | | |
| `CRON_SECRET` | Set in Vercel | Not needed locally | Secures `/api/cron/daily`, abandoned cart, piracy |
| **Optional / feature-specific** | | | |
| `UPSTASH_REDIS_REST_URL` | If using rate limit | If using rate limit | Rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | If using rate limit | If using rate limit | Rate limiting |
| `OPENAI_API_KEY` | If using AI chat | If using AI chat | Chat assistant |
| `REVALIDATE_SECRET` | If using revalidate script | Optional | On-demand revalidation |
| `CONTACT_NOTIFICATION_EMAIL` | Optional | Optional | Contact form notifications |
| `ADMIN_EMAIL` | Optional | Optional | Piracy admin emails |
| `GOOGLE_SEARCH_API_KEY`, `GOOGLE_SEARCH_ENGINE_ID` | If using piracy search | Optional | Piracy monitoring |
| `GITHUB_TOKEN` | If using DMCA/GitHub | Optional | DMCA flow |
| `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_*` | Optional | Optional | Error tracking |
| `NEXT_PUBLIC_ANALYTICS_ID` | Optional | Optional | Analytics |

---

## Summary for payments to work

- **Live:** All Supabase vars; all Stripe vars with **live** keys, **live** price IDs, and the **live** webhook signing secret; `NEXT_PUBLIC_APP_URL` = production URL; Resend (and Doer secret if you use coupons); `CRON_SECRET` if you use crons.
- **Test:** Same Supabase; Stripe vars with **test** keys, **test** price IDs, and a **test** webhook secret (or Stripe CLI secret for local); `NEXT_PUBLIC_APP_URL` = test/local URL; Resend (and Doer if you want coupons in test).

---

## Webhook secrets

- **Production:** Create a webhook destination in Stripe (Live mode) with URL `https://<your-domain>/api/stripe/webhook`. Use that destination’s **Signing secret** as `STRIPE_WEBHOOK_SECRET` in Vercel production.
- **Test:** Either create a separate destination in Stripe (Test mode) and use its signing secret, or for local testing run `stripe listen --forward-to localhost:3000/api/stripe/webhook` and use the CLI-printed secret in `.env.local`.

Do not use the same webhook secret for both live and test.
