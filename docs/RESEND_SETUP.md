# Resend Setup for Logbloga

This guide covers configuring [Resend](https://resend.com) so users receive transactional emails **securely and reliably**, including the **payment receipt with their unique Doer coupon** after purchasing an AI-to-USD package.

## Why this matters

- **Payment receipts** (sent after Stripe `payment_intent.succeeded`) include the customer’s **Doer Pro coupon code** when they buy a package. If Resend isn’t set up correctly, these emails can land in spam or fail to send, and customers won’t get their coupon.
- **Domain verification** (SPF/DKIM) improves deliverability and ensures the “from” address is trusted by inbox providers.

## 1. Resend account and API key

1. Sign up or log in at [resend.com](https://resend.com).
2. In the dashboard, go to **API Keys** and create a key:
   - **Development**: use a test key for local/dev (optional).
   - **Production**: create a **Production** API key for your live app.
3. Copy the key and store it as an environment variable:
   - **Local**: add to `.env.local` as `RESEND_API_KEY=re_xxxx`.
   - **Vercel**: **Project → Settings → Environment Variables** → add `RESEND_API_KEY` for **Production** (and **Preview** if you send from preview).  
   Never commit the API key to git.

## 2. Verify your sending domain

Resend only sends from **verified** domains. Without this, emails may be rejected or go to spam.

1. In Resend, go to **Domains** and click **Add Domain**.
2. Enter your sending domain (e.g. `logbloga.com`).
3. Resend will show DNS records to add at your DNS provider (e.g. your registrar or Vercel/Cloudflare):
   - **SPF** (TXT) – authorizes Resend to send for your domain.
   - **DKIM** (TXT) – cryptographic signing so providers can verify the email.
   - **DMARC** (optional but recommended) – policy for how providers handle failures.
4. Add the records exactly as Resend shows them. Verification can take a few minutes to 48 hours.
5. In Resend, click **Verify**; the domain should show as verified before you rely on it for production.

## 3. Set the “From” address

The app uses `RESEND_FROM_EMAIL` if set; otherwise it defaults to `mail@logbloga.com`.

- **Format**: use an address on your **verified** domain, e.g.:
  - `noreply@logbloga.com`
  - `mail@logbloga.com`
  - `orders@logbloga.com`
- **Where to set**:
  - **Local**: in `.env.local`: `RESEND_FROM_EMAIL=noreply@logbloga.com`
  - **Vercel**: add `RESEND_FROM_EMAIL` in **Environment Variables** for Production (and Preview if needed).

Resend will only send from addresses whose domain is verified; otherwise sends will fail or be restricted.

## 4. Environment variables summary

| Variable             | Required | Description |
|----------------------|----------|-------------|
| `RESEND_API_KEY`     | Yes      | Resend API key (Production for live). |
| `RESEND_FROM_EMAIL` | No       | From address (e.g. `noreply@logbloga.com`). Defaults to `mail@logbloga.com`. |

Set both in Vercel for the environment(s) where you send real payment receipts (usually **Production**).

## 5. Security and best practices

- **Keep the API key secret**: only in environment variables, never in source code or client.
- **Use a Production key** in production; use a test/development key only in dev.
- **One key per environment** if you want to separate dev and prod usage in Resend.
- **Optional**: In Resend, configure **Webhooks** for delivery/bounce/complaint events so you can monitor failures.
- **Optional**: In Resend dashboard, review **Logs** after a test purchase to confirm the payment receipt (with Doer coupon) is sent and delivered.

## 6. Quick test after setup

1. Deploy with `RESEND_API_KEY` and `RESEND_FROM_EMAIL` set (and domain verified).
2. Make a test purchase that triggers a Doer coupon (e.g. an Agency, Social Media, Web Apps, Freelancing, or Master Bundle package).
3. Check the customer inbox for the **Payment Receipt** email; it should contain the Doer coupon code and redemption instructions.
4. If it’s in spam, double-check domain verification (SPF/DKIM) and “from” address.

## Auth emails (password reset, email change, signup)

Auth emails (password reset, email change, signup verification, invite) are **sent by Supabase** but can be **delivered via Resend** so all email goes through one provider. To do that, configure Supabase to use Resend as **Custom SMTP** in the Supabase Dashboard (Project Settings → Authentication → SMTP). Supabase continues to generate the emails (tokens, links, OTP); only the delivery transport switches to Resend.

- **Step-by-step:** [EMAIL_RESEND_MANUAL_SETUP.md](EMAIL_RESEND_MANUAL_SETUP.md)
- **All email flows:** [EMAIL_FLOWS.md](EMAIL_FLOWS.md)
- **Supabase SMTP docs:** [Supabase Auth – Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)

## Related

- **Doer coupon flow**: Generated after payment in the Stripe webhook; stored on the order and included in the payment receipt email. See `lib/doer/coupon.ts` and `lib/email/templates/payment-receipt.tsx`.
- **LOGBLOGA_PARTNER_SECRET**: Required for Doer coupon generation; set in Vercel separately from Resend (see Doer partner setup).
