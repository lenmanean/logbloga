# Step-by-Step: All Email Through Resend

This guide walks through the manual steps required so that **all** email (auth and app) is delivered via Resend. App emails already use the Resend API; auth emails (password reset, email change, signup verification) are sent by Supabase but delivered through Resend when you configure Supabase to use Resend as custom SMTP.

---

## Prerequisites

- Resend account with a **verified sending domain** (e.g. `logbloga.com`) and **API key** (see [RESEND_SETUP.md](RESEND_SETUP.md)).
- Supabase project (hosted; local dev will still use Inbucket).
- `NEXT_PUBLIC_APP_URL` and `RESEND_FROM_EMAIL` (or default) already set for your environment.

---

## Part 1: Resend (SMTP credentials)

Resend provides SMTP so Supabase can send through Resend instead of Supabase’s default mailer.

1. **Domain and API key**
   - In [Resend](https://resend.com): ensure your sending domain (e.g. `logbloga.com`) is **verified** (Domains).
   - Ensure you have an API key (API Keys). You can reuse the same key as the app (`RESEND_API_KEY`) or create a separate key with “Send” permission for SMTP.

2. **SMTP details** (you will enter these in Supabase in Part 2):
   - **Host:** `smtp.resend.com`
   - **Port:** `465` (SMTPS) or `587` (STARTTLS). Use `465` if unsure.
   - **Username:** `resend`
   - **Password:** Your Resend API key (e.g. the value of `RESEND_API_KEY`).
   - **From address:** Use an address on your verified domain, e.g. `mail@logbloga.com` or `noreply@logbloga.com` (same as `RESEND_FROM_EMAIL` is recommended).

---

## Part 2: Supabase – Custom SMTP

1. Open the [Supabase Dashboard](https://supabase.com/dashboard) and select your project.

2. Go to **Project Settings** (gear icon) → **Authentication**.

3. Find the **SMTP Settings** (or **Custom SMTP**) section.

4. **Enable** “Custom SMTP” (or equivalent).

5. Enter the Resend SMTP details:
   - **Sender email:** e.g. `mail@logbloga.com` (must be on your verified Resend domain).
   - **Sender name:** e.g. `Logbloga`.
   - **Host:** `smtp.resend.com`
   - **Port:** `465` or `587`.
   - **Username:** `resend`
   - **Password:** Your Resend API key (paste the same value as `RESEND_API_KEY`, or the dedicated SMTP key).

6. **Save** the SMTP settings.

Supabase will now send all auth emails (password reset, email change, signup, invite) through Resend.

---

## Part 3: Supabase – Site URL

Auth emails contain links (e.g. password reset, magic link). They must point to your app URL.

1. In the Supabase Dashboard, go to **Authentication** → **URL Configuration** (or **Project URL** / **Site URL**).

2. Set **Site URL** to your app’s public URL, e.g. `https://logbloga.com`. This should match `NEXT_PUBLIC_APP_URL` in your app environment.

3. **Save**.

If you use **Redirect URLs**, ensure your production domain (and any preview domains) are listed in **Redirect URLs** as needed.

---

## Part 4: Optional – Email templates in Supabase

You can align auth email copy and branding with your app.

1. In Supabase Dashboard: **Authentication** → **Email Templates**.

2. Edit the templates you use:
   - **Confirm signup** (and/or Magic Link / OTP, depending on your flow).
   - **Recovery** (password reset).
   - **Change Email Address.**

3. Use the same tone and sign-off as your Resend templates (e.g. “The Logbloga Team”). For OTP-based signup, see [supabase-email-template-otp.md](../supabase-email-template-otp.md) in the project root for the `{{ .Token }}` variable.

4. **Save** each template.

Delivery still goes through Resend; only the content is customized in Supabase.

---

## Part 5: Verification

1. **Password reset**
   - On your app, use “Forgot password” and enter a real email you can access.
   - Check that the reset email arrives and that the link uses your app domain (e.g. `https://logbloga.com/auth/reset-password?...`).
   - In Resend Dashboard → **Logs**, confirm the same email appears as sent via Resend.

2. **Signup**
   - Register a new account with an email you can access.
   - Check that the verification email (link or OTP) arrives.
   - In Resend → **Logs**, confirm the signup email is present.

3. **App emails**
   - Trigger an order confirmation or payment receipt (e.g. test purchase). Confirm it arrives and appears in Resend Logs.

If auth emails do not appear in Resend, double-check Supabase SMTP settings (host, port, username, password, sender) and that the sender domain is verified in Resend.

---

## Summary checklist

- [ ] Resend domain verified; API key available.
- [ ] Supabase: Custom SMTP enabled; host `smtp.resend.com`, port 465 or 587, user `resend`, password = API key; sender = verified from address.
- [ ] Supabase: Site URL = `NEXT_PUBLIC_APP_URL`.
- [ ] Optional: Supabase email templates updated for branding.
- [ ] Verified: password reset and signup emails delivered and visible in Resend Logs.

---

## Local development

Supabase local (e.g. `supabase start`) uses **Inbucket** for auth email by default (`smtp_port = 54325` in `supabase/config.toml`). You do not need to configure Resend SMTP for local dev; auth emails will appear in Inbucket. Production (hosted Supabase) uses the custom SMTP (Resend) configured above.
