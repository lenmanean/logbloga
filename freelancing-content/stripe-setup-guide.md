# Stripe Setup Guide (Freelancers)

Step-by-step instructions for Stripe: invoices and payouts for direct clients so you can get paid outside marketplaces and reach $1,500–$4,000/month.

## Overview

Stripe lets you send invoices and accept payments (card, etc.) from direct clients. For Level 2 full-time freelancing, Stripe complements Upwork (which handles platform payments) and Hello Bonsai (which can also invoice). Use Stripe when you want a dedicated payment processor for direct clients, subscription-style billing, or payment links. This guide walks you through account creation, invoicing, payouts, and (optionally) client portal.

## Prerequisites

- Email address and business or personal details  
- Bank account for payouts  
- Optional: Business name and address for invoices  

**Time:** About 20–35 minutes (account ~10 min; first invoice ~10 min; payouts ~5 min).

---

## Step 1: Create a Stripe Account

**Time:** ~10 minutes  
**Purpose:** Sign up so you can send invoices and accept payments.

### Sub-steps

1. Go to [stripe.com](https://stripe.com) and click **Start now** or **Sign up**.
2. Enter your **email** and create a **password**. Use an email you check regularly—Stripe sends payment and security notifications.
3. Complete **business or individual** details (name, country, address). For freelancers, "Individual" or "Sole proprietor" is common unless you have a registered business.
4. **Verify your email** by clicking the link Stripe sends. Check spam if needed.

**Testing checklist:** [ ] Account created; [ ] Email verified; [ ] Business/individual details completed

---

## Step 2: Business Verification

**Time:** ~5–15 minutes (can be async)  
**Purpose:** Complete identity and (if required) business verification so you can accept payments and withdraw.

### Sub-steps

1. In the Stripe Dashboard, go to **Settings** > **Account** or follow the verification prompt.
2. Complete **identity verification** (e.g. ID upload, date of birth) if Stripe asks. New accounts often need this before going live.
3. Add **bank account** for payouts: account number, routing number, account holder name. Stripe may make small test deposits to confirm; enter the amounts when prompted.
4. If Stripe requests **business verification** (e.g. for higher volume), submit the requested documents. Payouts may be delayed until verification completes.

**Testing checklist:** [ ] Identity verification completed (if prompted); [ ] Bank account added and confirmed; [ ] Business verification submitted (if required)

---

## Step 3: Invoicing

**Time:** ~10 minutes per invoice  
**Purpose:** Create and send professional invoices so direct clients can pay you.

### Sub-steps

1. In the Stripe Dashboard, go to **Invoices** (or **Payments** > **Invoices**) and click **Create invoice**.
2. **Add client:** Enter client name and email (or create a customer first for recurring work).
3. **Add line items:** Description (e.g. "Website redesign – Phase 1"), quantity, unit amount, and currency. Add multiple lines if needed.
4. **Set payment terms:** e.g. Net 7 (due in 7 days), Due on receipt, or custom. Add a due date.
5. **Optional:** Add your logo, business name, and payment instructions (e.g. "Pay by card or bank transfer via link below").
6. **Send:** Stripe emails the invoice to the client with a payment link. You can also download a PDF to send yourself.
7. **Track status:** In Dashboard, see Sent, Viewed, Paid, or Overdue. Set up reminders if Stripe offers them for overdue invoices.

**When to use Stripe vs Hello Bonsai:** Use Stripe when you want card processing and payment links in one place; use Bonsai when you want contracts and invoices in one place. Many freelancers use both (Bonsai for contracts and some invoices, Stripe for payment links or subscriptions).

**Testing checklist:** [ ] First invoice created; [ ] Client and line items added; [ ] Terms and due date set; [ ] Invoice sent

---

## Step 4: Payouts

**Time:** ~5 minutes setup; payouts are automatic  
**Purpose:** Get money from Stripe into your bank account.

### Sub-steps

1. In **Settings** > **Payouts** (or **Bank accounts**), confirm your **payout schedule** (e.g. daily, weekly, monthly). Stripe often defaults to rolling (e.g. 2-day rolling) for verified accounts.
2. **Payout timing:** After a client pays, funds are typically available for payout after a short holding period (e.g. 2–7 days for new accounts). Check your Dashboard for "Available for payout."
3. Stripe automatically **transfers** to your bank account on the schedule you set. No need to manually request unless you change settings.
4. **Fees:** Stripe charges a fee per transaction (e.g. % + fixed). Check Stripe's current pricing. Factor fees into your [Pricing Strategy Advanced](pricing-strategy-advanced.md).

**Testing checklist:** [ ] Payout schedule confirmed; [ ] Bank account correct; [ ] First payout received (after first payment)

---

## Step 5: Client Portal (Optional)

**Time:** ~5 minutes  
**Purpose:** Let clients manage subscriptions or view invoices in a self-serve portal (if you use recurring billing).

### Sub-steps

1. If you use **recurring** or **subscription** billing, Stripe's Customer Portal lets clients update payment method, view invoices, or cancel. Enable it in **Settings** > **Billing** > **Customer portal** (or equivalent).
2. For one-off invoices only, you can skip the portal; clients pay via the link in each invoice email.

**Testing checklist:** [ ] Portal enabled (if using subscriptions); [ ] Or skipped (if one-off only)

---

## What You'll Have When Done

- A Stripe account with identity and bank verification complete  
- Ability to create and send invoices with payment links  
- Automatic payouts to your bank account  
- Optional client portal for recurring billing  

---

## See Also

- [Hello Bonsai Paid Setup](hello-bonsai-paid-setup.md) — When to use Bonsai vs Stripe for contracts and invoicing.  
- [Pricing Strategy Advanced](pricing-strategy-advanced.md) — Factor Stripe fees into your pricing.  
- [Client Management Issues](freelancing-level-2-client-management-issues.md) — Payment disputes or late payments.
