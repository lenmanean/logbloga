import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getReceiptAmountsFromStripe } from '@/lib/stripe/receipt-from-stripe';

const mockRetrieve = vi.fn();

vi.mock('@/lib/stripe/client', () => ({
  getStripeClient: () => ({
    checkout: {
      sessions: {
        retrieve: mockRetrieve,
      },
    },
  }),
}));

describe('getReceiptAmountsFromStripe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null for empty sessionId', async () => {
    expect(await getReceiptAmountsFromStripe('')).toBeNull();
    expect(await getReceiptAmountsFromStripe('   ')).toBeNull();
    expect(mockRetrieve).not.toHaveBeenCalled();
  });

  it('returns receipt totals in dollars from session', async () => {
    mockRetrieve.mockResolvedValue({
      amount_total: 1234,
      amount_subtotal: 1000,
      currency: 'usd',
      total_details: {
        amount_tax: 134,
        amount_discount: 0,
        amount_shipping: null,
      },
      line_items: {
        data: [
          {
            description: 'Web Apps Package',
            quantity: 1,
            amount_total: 1000,
            amount_subtotal: 1000,
          },
        ],
      },
    });

    const result = await getReceiptAmountsFromStripe('cs_test_123');
    expect(result).not.toBeNull();
    expect(result!.totalAmount).toBe(12.34);
    expect(result!.subtotal).toBe(10);
    expect(result!.taxAmount).toBe(1.34);
    expect(result!.discountAmount).toBeNull();
    expect(result!.currency).toBe('USD');
    expect(result!.items).toHaveLength(1);
    expect(result!.items[0].productName).toBe('Web Apps Package');
    expect(result!.items[0].quantity).toBe(1);
    expect(result!.items[0].unitPrice).toBe(10);
    expect(result!.items[0].total).toBe(10);
    expect(mockRetrieve).toHaveBeenCalledWith('cs_test_123', { expand: ['line_items'] });
  });

  it('includes discount when total_details.amount_discount > 0', async () => {
    mockRetrieve.mockResolvedValue({
      amount_total: 900,
      amount_subtotal: 1000,
      currency: 'usd',
      total_details: {
        amount_tax: 0,
        amount_discount: 100,
        amount_shipping: null,
      },
      line_items: { data: [] },
    });

    const result = await getReceiptAmountsFromStripe('cs_test_456');
    expect(result).not.toBeNull();
    expect(result!.discountAmount).toBe(1);
    expect(result!.totalAmount).toBe(9);
    expect(result!.subtotal).toBe(10);
  });

  it('uses "Item" when line item has no description', async () => {
    mockRetrieve.mockResolvedValue({
      amount_total: 500,
      amount_subtotal: 500,
      currency: 'usd',
      total_details: { amount_tax: 0, amount_discount: 0, amount_shipping: null },
      line_items: {
        data: [
          {
            description: null,
            quantity: 1,
            amount_total: 500,
            amount_subtotal: 500,
          },
        ],
      },
    });

    const result = await getReceiptAmountsFromStripe('cs_test_789');
    expect(result).not.toBeNull();
    expect(result!.items[0].productName).toBe('Item');
    expect(result!.items[0].total).toBe(5);
    expect(result!.items[0].unitPrice).toBe(5);
  });

  it('returns null when session has null amount_total', async () => {
    mockRetrieve.mockResolvedValue({
      amount_total: null,
      amount_subtotal: 1000,
      currency: 'usd',
      total_details: null,
      line_items: { data: [] },
    });

    const result = await getReceiptAmountsFromStripe('cs_test_null');
    expect(result).toBeNull();
  });

  it('returns null when retrieve throws', async () => {
    mockRetrieve.mockRejectedValue(new Error('Network error'));
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await getReceiptAmountsFromStripe('cs_test_err');
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Stripe session retrieve failed for receipt');
    consoleSpy.mockRestore();
  });

  it('handles multiple line items and computes unitPrice from total/quantity', async () => {
    mockRetrieve.mockResolvedValue({
      amount_total: 3000,
      amount_subtotal: 3000,
      currency: 'usd',
      total_details: { amount_tax: 0, amount_discount: 0, amount_shipping: null },
      line_items: {
        data: [
          { description: 'Package A', quantity: 2, amount_total: 2000, amount_subtotal: 2000 },
          { description: 'Package B', quantity: 1, amount_total: 1000, amount_subtotal: 1000 },
        ],
      },
    });

    const result = await getReceiptAmountsFromStripe('cs_multi');
    expect(result).not.toBeNull();
    expect(result!.items).toHaveLength(2);
    expect(result!.items[0].productName).toBe('Package A');
    expect(result!.items[0].quantity).toBe(2);
    expect(result!.items[0].total).toBe(20);
    expect(result!.items[0].unitPrice).toBe(10);
    expect(result!.items[1].productName).toBe('Package B');
    expect(result!.items[1].quantity).toBe(1);
    expect(result!.items[1].total).toBe(10);
    expect(result!.items[1].unitPrice).toBe(10);
  });
});
