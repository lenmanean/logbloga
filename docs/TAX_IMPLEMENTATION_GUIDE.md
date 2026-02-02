# Tax Implementation Guide for Digital Products

This guide covers how taxes apply to your digital products, your existing tax infrastructure, and what you need to complete for full compliance.

## How Taxes Apply to Digital Products

Digital products (templates, courses, ebooks, software, etc.) **are generally taxable** in most jurisdictions:

| Region | Tax Type | Notes |
|--------|----------|-------|
| **US** | Sales tax | Most states tax digital goods. Rates vary by state; nexus rules apply. |
| **EU** | VAT | Digital services taxed at destination (customer location). VAT OSS simplifies cross-border. |
| **UK** | VAT | Digital products subject to VAT; rules differ for B2B vs B2C. |
| **Canada** | GST/HST | Digital products taxable; provincial rates vary. |

Stripe Tax uses product tax codes to determine the correct rate per jurisdiction. Without a tax code, Stripe falls back to your **preset product tax code** in Dashboard settings.

---

## Existing Tax Infrastructure (What You Have)

### 1. Stripe Checkout — Automatic Tax Enabled

Your `create-checkout-session` route enables Stripe Tax:

```typescript
// app/api/stripe/create-checkout-session/route.ts
automatic_tax: { enabled: true }
```

### 2. Prices — Tax Behavior Set

- **Pre-created prices** (from sync): `tax_behavior: 'exclusive'` — tax is added on top of the displayed price
- **Dynamic price_data fallback**: Same `tax_behavior: 'exclusive'`

### 3. Order Schema & Receipt Flow

- `orders.tax_amount` stores the tax collected from Stripe
- Webhook (`payment_intent.succeeded`) and `receipt-from-stripe.ts` read `total_details.amount_tax` and persist it
- Emails, order details, and admin show tax when `tax_amount > 0`

### 4. Cart / Pre-Checkout UI

- Cart summary and checkout context show `taxAmount: 0` because tax is calculated by Stripe **at payment time**, not in the cart
- This is expected: customers see the final tax only in Stripe Checkout

---

## Gaps to Address

### 1. Product Tax Codes (Critical)

Your sync script does **not** set `tax_code` on products. Stripe then uses the **preset** from your Dashboard. To ensure correct classification for digital products:

**Recommended tax codes for your products:**

| Product Type | Stripe Tax Code | Description |
|--------------|-----------------|-------------|
| Templates, guides, PDFs | `txcd_10503000` | Digital other news or documents - downloadable - permanent rights |
| Online courses / training | `txcd_20060158` | On demand Online Courses - pre-recorded (streamed) |
| Digital books / ebooks | `txcd_10302000` | Digital Books - downloaded - permanent rights |
| General digital products | `txcd_10000000` | General - Electronically Supplied Services (safest default) |

The sync script has been updated to set `txcd_10000000` (General - Electronically Supplied Services) as the default for new products. For existing products, add tax codes in the Stripe Dashboard or via API.

### 2. Stripe Dashboard Configuration

In [Stripe Dashboard → Tax settings](https://dashboard.stripe.com/settings/tax):

1. **Head office address** — Confirm your business address
2. **Preset product tax code** — Set to `General - Electronically Supplied Services` (or your main product type) for products without a code
3. **Default tax behavior** — `Exclusive` (matches your code)
4. **Tax registrations** — Add registrations for jurisdictions where you must collect tax (e.g., US states where you have nexus, EU VAT OSS)

### 3. Tax Registrations

Without registrations, Stripe will **not** collect tax. You must:

- Register with tax authorities in each jurisdiction (US states, EU VAT, etc.)
- Add those registrations in Stripe: [Registrations](https://dashboard.stripe.com/tax/registrations)
- Stripe can help with [Stripe Taxually](https://docs.stripe.com/tax/use-stripe-to-register) for non-US

---

## Stripe CLI — Tax Investigation

Stripe CLI is not installed by default. To install on Windows:

**Using Scoop:**
```powershell
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Manual:** Download from [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli) and add to PATH.

**Login:**
```bash
stripe login
```

### Useful Stripe CLI Commands for Tax

```bash
# List tax codes (verify digital product codes)
stripe tax_codes list

# Retrieve tax settings (head office, preset, etc.)
stripe get /v1/tax/settings

# Inspect a product's tax_code
stripe products retrieve prod_xxxxx

# Inspect a price's tax_behavior
stripe prices retrieve price_xxxxx

# List your tax registrations
stripe get /v1/tax/registrations
```

Note: Stripe CLI does not have dedicated `stripe tax` subcommands; use `stripe get` for Tax API endpoints.

---

## Implementation Checklist

- [ ] **Install Stripe CLI** (optional, for inspection)
- [ ] **Dashboard**: Set preset product tax code to `General - Electronically Supplied Services`
- [ ] **Dashboard**: Add tax registrations for your jurisdictions
- [ ] **Existing products**: Update tax codes in Dashboard or via API
- [ ] **New products**: Sync script now sets `txcd_10000000` by default
- [ ] **Test**: Make a test purchase in a taxable region and confirm tax appears in Stripe and in order/emails

---

## Related Files

- `app/api/stripe/create-checkout-session/route.ts` — Checkout session with `automatic_tax`
- `lib/stripe/receipt-from-stripe.ts` — Extracts `amount_tax` from Stripe
- `lib/stripe/webhooks.ts` — Persists tax to orders
- `scripts/sync-products-to-stripe.ts` — Creates products with tax_code
- `STRIPE_PRODUCT_SYNC_SETUP.md` — Product sync overview
- [PAYMENT_FLOW.md](PAYMENT_FLOW.md) — Payment flow, webhook, cart clear, production env checklist
