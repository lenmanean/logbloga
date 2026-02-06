# Supabase Email Templates – Update Guide

Use this guide to align every **Authentication** and **Security** email template in Supabase with your app branding (e.g. "The Logbloga Team"). Edit each template in **Supabase Dashboard → Authentication → Email Templates**. Keep the variables listed below; change only the surrounding copy and sign-off.

**Variables reference:** [Supabase Auth Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates). Do not remove or rename variables (e.g. `{{ .ConfirmationURL }}`, `{{ .Token }}`); they are replaced by Supabase when the email is sent.

---

## Authentication templates

### 1. Confirm sign up

**Purpose:** Sent after signup so the user verifies their email. This app uses **OTP** (code in email), not a link.

**Keep:** `{{ .Token }}` only. Do **not** use `{{ .ConfirmationURL }}` for this flow (users enter the code on your verification page).

**Suggested subject:** `Confirm your signup`

**Suggested body (HTML):** Use the template in the project root file [supabase-email-template-otp.md](../supabase-email-template-otp.md), or the following:

```html
<h2>Confirm your signup</h2>
<p>Hi there,</p>
<p>Thank you for signing up! Please enter the verification code below to confirm your email address:</p>
<p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; margin: 24px 0;">{{ .Token }}</p>
<p>This code will expire in 1 hour.</p>
<p>If you didn't request this code, you can safely ignore this email.</p>
<p>Best regards,<br>The Logbloga Team</p>
```

---

### 2. Invite user

**Purpose:** Invite someone to create an account. They click a link to accept.

**Keep:** `{{ .ConfirmationURL }}`, optionally `{{ .SiteURL }}`.

**Suggested subject:** `You're invited to Logbloga`

**Suggested body:**

```html
<h2>You're invited</h2>
<p>Hi there,</p>
<p>You've been invited to join Logbloga. Click the link below to accept the invite and create your account:</p>
<p><a href="{{ .ConfirmationURL }}">Accept invite</a></p>
<p>This link will expire after use. If you didn't expect this invite, you can ignore this email.</p>
<p>Best regards,<br>The Logbloga Team</p>
```

---

### 3. Magic link / Email sign-in (OTP)

**Purpose:** This app uses **OTP (code)** for email sign-in, not a magic link. The "Magic Link" template in Supabase is used when users sign in with a one-time code; the UI asks them to enter the code, so the email must show the code.

**Keep:** `{{ .Token }}` only. Do **not** use `{{ .ConfirmationURL }}` for this flow in this app.

**Suggested subject:** `Your sign-in code`

**Suggested body:**

```html
<h2>Sign in to Logbloga</h2>
<p>Hi there,</p>
<p>Enter the 8-digit code below to sign in. This code can only be used once:</p>
<p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; margin: 24px 0;">{{ .Token }}</p>
<p>This code will expire in 1 hour.</p>
<p>If you didn't request this code, you can safely ignore this email.</p>
<p>Best regards,<br>The Logbloga Team</p>
```

---

### 4. Change email address

**Purpose:** Sent when the user requests an email change; they must confirm the new address.

**Keep:** `{{ .ConfirmationURL }}`. Optional: `{{ .NewEmail }}` if you want to show the new address in the body.

**Suggested subject:** `Confirm your new email address`

**Suggested body:**

```html
<h2>Confirm your new email address</h2>
<p>Hi there,</p>
<p>You requested to change the email address for your account. Click the link below to confirm:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm email change</a></p>
<p>If you didn't request this change, you can safely ignore this email.</p>
<p>Best regards,<br>The Logbloga Team</p>
```

---

### 5. Reset password

**Purpose:** Sent when the user requests a password reset. They click a link to set a new password.

**Keep:** `{{ .ConfirmationURL }}`.

**Suggested subject:** `Reset your password`

**Suggested body:**

```html
<h2>Reset your password</h2>
<p>Hi there,</p>
<p>We received a request to reset the password for your account. Click the link below to choose a new password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset password</a></p>
<p>This link will expire in 1 hour. If you didn't request a reset, you can safely ignore this email.</p>
<p>Best regards,<br>The Logbloga Team</p>
```

---

### 6. Reauthentication

**Purpose:** Sent when the user must re-authenticate before a sensitive action (e.g. delete account). Usually uses a short-lived code.

**Keep:** `{{ .Token }}` (OTP) or `{{ .ConfirmationURL }}` (link), depending on how you trigger reauth. Prefer `{{ .Token }}` if the UI asks for a code.

**Suggested subject:** `Confirm your identity`

**Suggested body (OTP):**

```html
<h2>Confirm your identity</h2>
<p>Hi there,</p>
<p>Please enter the code below to continue:</p>
<p style="font-size: 24px; font-weight: bold; letter-spacing: 6px; margin: 24px 0;">{{ .Token }}</p>
<p>This code will expire shortly. If you didn't request this, please secure your account.</p>
<p>Best regards,<br>The Logbloga Team</p>
```

**Suggested body (link):** Replace the OTP paragraph with: `<p><a href="{{ .ConfirmationURL }}">Confirm</a></p>`

---

## Security notification templates

These are **informational only** (no link to click). Keep the variables so the user sees what changed. Use the same sign-off and tone.

### 7. Password changed

**Keep:** `{{ .Email }}`.

**Suggested subject:** `Your password has been changed`

**Suggested body:**

```html
<h2>Your password has been changed</h2>
<p>Hi there,</p>
<p>This is a confirmation that the password for the account {{ .Email }} was just changed.</p>
<p>If you did not make this change, please contact support or reset your password immediately.</p>
<p>Best regards,<br>The Logbloga Team</p>
```

---

### 8. Email address changed

**Keep:** `{{ .OldEmail }}`, `{{ .Email }}` (new address).

**Suggested subject:** `Your email address has been changed`

**Suggested body:**

```html
<h2>Your email address has been changed</h2>
<p>Hi there,</p>
<p>The email address for your account was changed from {{ .OldEmail }} to {{ .Email }}.</p>
<p>If you did not make this change, please contact support immediately.</p>
<p>Best regards,<br>The Logbloga Team</p>
```

---

### 9. Phone number changed

**Keep:** `{{ .Email }}`, `{{ .OldPhone }}`, `{{ .Phone }}`.

**Suggested subject:** `Your phone number has been changed`

**Suggested body:**

```html
<h2>Your phone number has been changed</h2>
<p>Hi there,</p>
<p>The phone number for your account {{ .Email }} was changed from {{ .OldPhone }} to {{ .Phone }}.</p>
<p>If you did not make this change, please contact support immediately.</p>
<p>Best regards,<br>The Logbloga Team</p>
```

---

### 10. Identity linked

**Keep:** `{{ .Email }}`, `{{ .Provider }}`.

**Suggested subject:** `A new sign-in method was added`

**Suggested body:**

```html
<h2>A new sign-in method was added</h2>
<p>Hi there,</p>
<p>A new identity ({{ .Provider }}) was linked to your account {{ .Email }}.</p>
<p>If you did not make this change, please contact support immediately.</p>
<p>Best regards,<br>The Logbloga Team</p>
```

---

### 11. Identity unlinked

**Keep:** `{{ .Email }}`, `{{ .Provider }}`.

**Suggested subject:** `A sign-in method was removed`

**Suggested body:**

```html
<h2>A sign-in method was removed</h2>
<p>Hi there,</p>
<p>An identity ({{ .Provider }}) was unlinked from your account {{ .Email }}.</p>
<p>If you did not make this change, please contact support immediately.</p>
<p>Best regards,<br>The Logbloga Team</p>
```

---

### 12. Multi-factor authentication method added

**Keep:** `{{ .Email }}`, `{{ .FactorType }}`.

**Suggested subject:** `A new 2FA method was added`

**Suggested body:**

```html
<h2>A new two-factor method was added</h2>
<p>Hi there,</p>
<p>A new authentication method ({{ .FactorType }}) was added to your account {{ .Email }}.</p>
<p>If you did not make this change, please contact support immediately.</p>
<p>Best regards,<br>The Logbloga Team</p>
```

---

### 13. Multi-factor authentication method removed

**Keep:** `{{ .Email }}`, `{{ .FactorType }}`.

**Suggested subject:** `A 2FA method was removed`

**Suggested body:**

```html
<h2>A two-factor method was removed</h2>
<p>Hi there,</p>
<p>An authentication method ({{ .FactorType }}) was removed from your account {{ .Email }}.</p>
<p>If you did not make this change, please contact support immediately.</p>
<p>Best regards,<br>The Logbloga Team</p>
```

---

## Checklist

- Use the same sign-off in every template: **"Best regards, The Logbloga Team"** (or your chosen name).
- Do **not** remove or rename Supabase variables (`{{ .VariableName }}`).
- For **Confirm sign up**, use **OTP** (`{{ .Token }}`) only; do not use `{{ .ConfirmationURL }}` for that template in this app.
- For **Magic link** (email sign-in), use **OTP** (`{{ .Token }}`) only so users receive an 8-digit code to enter in the app; do not use `{{ .ConfirmationURL }}` for sign-in in this app.
- After editing, click **Save** for each template. Delivery still goes through Resend when custom SMTP is configured (see [EMAIL_RESEND_MANUAL_SETUP.md](EMAIL_RESEND_MANUAL_SETUP.md)).
- Security notifications are only sent when enabled (toggles in the Security section). Enable the ones you use.
