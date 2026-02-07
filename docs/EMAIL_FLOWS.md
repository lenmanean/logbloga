# Email Flows – Single Source of Truth

All application and auth email is delivered through **Resend**. This document is the single reference for what sends each email and how it is configured.

## Overview

| Category | Who generates | Who delivers | Configuration |
|----------|----------------|---------------|---------------|
| Auth (password reset, email change, signup, invite) | Supabase Auth | Resend (via Supabase custom SMTP) | Supabase Dashboard: SMTP + Email Templates; Site URL = `NEXT_PUBLIC_APP_URL` |
| App (orders, receipts, welcome, contact, etc.) | Next.js app | Resend API | `lib/email/senders.ts`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |
| Stripe receipts | — | Disabled | App does not set `receipt_email`; only Resend sends payment receipts |

**Important:** `NEXT_PUBLIC_APP_URL` and Supabase **Site URL** (Authentication → URL Configuration) must match so password reset and verification links point to your app.

---

## Auth emails (Supabase, delivered via Resend SMTP)

Supabase Auth generates these emails (tokens, links, OTP). When **Custom SMTP** is configured in Supabase with Resend, delivery goes through Resend. Templates and sender are configured in the Supabase Dashboard.

| Flow | Trigger in code | Template / config |
|------|-----------------|-------------------|
| Forgot password | `supabase.auth.resetPasswordForEmail(email, { redirectTo })` | Supabase: **Recovery** template |
| Change email | `supabase.auth.updateUser({ email: newEmail })` | Supabase: **Change Email** template |
| Signup verification | `supabase.auth.signUp(...)` then `resend({ type: 'signup', email })` | Supabase: **Confirm signup** (or OTP) template |
| Resend verification | `supabase.auth.resend({ type: 'signup', email })` | Same as signup |
| Invite | Supabase invite flow | Supabase: **Invite** template |

- **Code:** `app/api/auth/reset-password/route.ts`, `app/api/account/change-email/route.ts`, `hooks/useAuth.tsx`, `components/auth/email-verification.tsx`, `app/api/auth/signup/route.ts`, `app/api/auth/verify-email/route.ts`. Change-email UI is on the profile page (`/account/profile`).

**Email change (double confirm):** When `double_confirm_changes` is enabled in Supabase (Auth → Providers → Email), users must confirm from BOTH their old and new email. Add `https://your-domain.com/auth/callback` to Redirect URLs in Supabase Dashboard (Authentication → URL Configuration). The banner on the home page explains the flow when users land after the first confirmation. To require only the new-email confirmation, set `double_confirm_changes` to false in Supabase Dashboard (simpler UX, slightly lower security).
- **Manual setup:** [EMAIL_RESEND_MANUAL_SETUP.md](EMAIL_RESEND_MANUAL_SETUP.md)

### Email change troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Old email still shows in profile after confirming | Session not refreshed or profiles table out of sync | Profile page calls `refreshSession()` on load. A migration (`000055_sync_profiles_email_on_auth_update.sql`) syncs `profiles.email` when `auth.users.email` changes. Run the migration if not applied. |
| Cannot sign in with new email | Email change not fully completed, or redirect went to Site URL instead of callback | Ensure `https://your-domain.com/auth/callback` is in **Redirect URLs** (Supabase Dashboard → Authentication → URL Configuration). Without this, confirmation links may redirect to the Site URL; our callback never runs and the session is not updated. Add the URL, then have the user request a new email change and complete both confirmations. |
| Lands on homepage with "Confirmation link accepted..." message | Supabase redirected to Site URL instead of `/auth/callback` | Same as above: add `/auth/callback` to Redirect URLs. The link in the email should send users to `/auth/callback` so we can verify the OTP and establish the new session. |

---

## App emails (Resend API)

Sent by the Next.js app via `lib/email/senders.ts` and `lib/email/client.ts`. All use the same Resend client and `RESEND_FROM_EMAIL` (or default).

| Email type | Sender function | Preferences |
|------------|----------------|-------------|
| Order confirmation | `sendOrderConfirmation` | `email_order_confirmation` |
| Payment receipt | `sendPaymentReceipt` | `email_order_confirmation`; when the order has a DOER coupon, the same email includes the coupon section (single post-purchase email) |
| Welcome | `sendWelcomeEmail` | Always sent |
| Abandoned cart | `sendAbandonedCartReminder` | `email_promotional` |
| Order status update | `sendOrderStatusUpdateEmail` | `email_order_shipped` |
| Product update | `sendProductUpdateEmail` | `email_product_updates` |
| Contact (to admin) | `sendContactSubmissionEmail` | — |
| Contact (to user) | `sendContactConfirmationEmail` | — |
| Piracy alerts | `lib/piracy/notifications.ts` | — |

---

## Stripe receipts

Stripe can send its own payment receipt when `receipt_email` is set on the Payment Intent. The app **does not** set `receipt_email` (it is `undefined`), so Stripe does not send a receipt. The only payment receipt the customer receives is the one sent by the app via Resend (in `lib/stripe/webhooks.ts` on `payment_intent.succeeded`), which includes order details and the Doer coupon when applicable.

- **Code:** `app/api/stripe/create-payment-intent/route.ts`, `app/api/checkout/express-wallet-intent/route.ts` use `receipt_email: undefined`.
