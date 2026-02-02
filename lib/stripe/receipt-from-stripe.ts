/**
 * Stripe receipt amounts for payment receipt email
 * Fetches Checkout Session and returns totals (and line items) in dollars
 */

import { getStripeClient } from './client';
import { formatAmountFromStripe } from './utils';

export interface StripeReceiptItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface StripeReceiptAmounts {
  totalAmount: number;
  subtotal: number;
  taxAmount: number | null;
  discountAmount: number | null;
  currency: string;
  items: StripeReceiptItem[];
}

/**
 * Fetch Checkout Session by ID and return receipt-shaped totals and line items in dollars.
 * Returns null on any error (session not found, network, invalid shape).
 * Server-only; do not log PII or full Stripe objects.
 */
export async function getReceiptAmountsFromStripe(
  sessionId: string
): Promise<StripeReceiptAmounts | null> {
  if (!sessionId?.trim()) {
    return null;
  }

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    const amountTotal = session.amount_total ?? null;
    const amountSubtotal = session.amount_subtotal ?? null;
    const currency = (session.currency ?? 'usd').toUpperCase();
    const totalDetails = session.total_details;

    if (amountTotal == null || amountSubtotal == null) {
      return null;
    }

    const totalAmount = formatAmountFromStripe(amountTotal);
    const subtotal = formatAmountFromStripe(amountSubtotal);
    const taxAmount = totalDetails?.amount_tax != null
      ? formatAmountFromStripe(totalDetails.amount_tax)
      : null;
    const discountAmount = totalDetails?.amount_discount != null && totalDetails.amount_discount > 0
      ? formatAmountFromStripe(totalDetails.amount_discount)
      : null;

    const items: StripeReceiptItem[] = [];
    const lineItems = session.line_items?.data;
    if (Array.isArray(lineItems)) {
      for (const line of lineItems) {
        const qty = line.quantity ?? 0;
        const totalCents = line.amount_total ?? 0;
        const total = formatAmountFromStripe(totalCents);
        const unitPrice = qty > 0 ? formatAmountFromStripe(Math.round(totalCents / qty)) : 0;
        const productName =
          typeof line.description === 'string' && line.description.trim()
            ? line.description.trim()
            : 'Item';
        items.push({
          productName,
          quantity: qty,
          unitPrice,
          total,
        });
      }
    }

    return {
      totalAmount,
      subtotal,
      taxAmount,
      discountAmount,
      currency,
      items,
    };
  } catch {
    console.warn('Stripe session retrieve failed for receipt');
    return null;
  }
}
