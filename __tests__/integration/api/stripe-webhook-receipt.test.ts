import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handlePaymentIntentSucceeded } from '@/lib/stripe/webhooks';
import type Stripe from 'stripe';

const mockGetOrderWithItems = vi.fn();
const mockUpdateOrderWithPaymentInfo = vi.fn();
const mockSendPaymentReceipt = vi.fn();
const mockGetReceiptAmountsFromStripe = vi.fn();
const mockCreateNotification = vi.fn();
const mockGetDoerCouponForOrder = vi.fn();

vi.mock('@/lib/db/orders', () => ({
  getOrderWithItems: (...args: unknown[]) => mockGetOrderWithItems(...args),
  updateOrderWithPaymentInfo: (...args: unknown[]) => mockUpdateOrderWithPaymentInfo(...args),
}));

vi.mock('@/lib/email/senders', () => ({
  sendOrderConfirmation: vi.fn(() => Promise.resolve({ success: true })),
  sendPaymentReceipt: (...args: unknown[]) => mockSendPaymentReceipt(...args),
}));

vi.mock('@/lib/stripe/receipt-from-stripe', () => ({
  getReceiptAmountsFromStripe: (...args: unknown[]) => mockGetReceiptAmountsFromStripe(...args),
}));

vi.mock('@/lib/db/notifications-db', () => ({
  createNotification: (...args: unknown[]) => mockCreateNotification(...args),
}));

let mockOrderFromFindByPaymentIntent: Record<string, unknown> = {
  id: 'ord_123',
  user_id: 'user_123',
  stripe_checkout_session_id: 'cs_test_123',
  stripe_payment_intent_id: 'pi_test_123',
  order_number: 'ORD-001',
  status: 'completed',
  total_amount: 99,
  subtotal: 90,
  tax_amount: 9,
  discount_amount: 0,
  currency: 'USD',
  customer_email: 'customer@example.com',
  customer_name: 'Customer',
  created_at: new Date().toISOString(),
};

vi.mock('@/lib/supabase/server', () => ({
  createServiceRoleClient: vi.fn(() => ({
    from: vi.fn((table: string) => ({
      select: vi.fn(() => ({
        eq: vi.fn((col: string) => ({
          single: vi.fn(() =>
            table === 'orders' && col === 'stripe_payment_intent_id'
              ? Promise.resolve({
                  data: mockOrderFromFindByPaymentIntent,
                  error: null,
                })
              : Promise.resolve({ data: null, error: { code: 'PGRST116' } })
          ),
        })),
      })),
    })),
  })),
}));

vi.mock('@/lib/doer/coupon', () => ({
  generateDoerCouponForOrder: vi.fn(() => Promise.resolve(null)),
  getDoerCouponForOrder: (...args: unknown[]) => mockGetDoerCouponForOrder(...args),
}));

const baseOrderWithItems = {
  id: 'ord_123',
  user_id: 'user_123',
  order_number: 'ORD-001',
  status: 'completed' as const,
  total_amount: 99,
  subtotal: 90,
  tax_amount: 9,
  discount_amount: 0,
  currency: 'USD',
  customer_email: 'customer@example.com',
  customer_name: 'Customer',
  created_at: new Date().toISOString(),
  stripe_checkout_session_id: 'cs_test_123',
  stripe_payment_intent_id: 'pi_test_123',
  items: [
    {
      id: 'oi_1',
      product_name: 'Test Package',
      quantity: 1,
      unit_price: 90,
      total_price: 90,
    },
  ],
  doer_coupon_expires_at: null as string | null,
};

describe('Stripe webhook receipt payload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateOrderWithPaymentInfo.mockResolvedValue(undefined);
    mockCreateNotification.mockResolvedValue(undefined);
    mockGetDoerCouponForOrder.mockResolvedValue(null);
    mockGetOrderWithItems.mockResolvedValue({ ...baseOrderWithItems });
  });

  it('uses Stripe amounts in receipt when getReceiptAmountsFromStripe returns data', async () => {
    mockGetReceiptAmountsFromStripe.mockResolvedValue({
      totalAmount: 12.34,
      subtotal: 10,
      taxAmount: 1.34,
      discountAmount: 0.5,
      currency: 'USD',
      items: [
        { productName: 'Stripe Package', quantity: 1, unitPrice: 10, total: 10 },
      ],
    });

    const paymentIntent = {
      id: 'pi_test_123',
      status: 'succeeded',
      amount: 1234,
      currency: 'usd',
    } as Stripe.PaymentIntent;

    await handlePaymentIntentSucceeded(paymentIntent);

    expect(mockSendPaymentReceipt).toHaveBeenCalledTimes(1);
    const [, emailData] = vi.mocked(mockSendPaymentReceipt).mock.calls[0];
    expect(emailData.order.totalAmount).toBe(12.34);
    expect(emailData.order.subtotal).toBe(10);
    expect(emailData.order.taxAmount).toBe(1.34);
    expect(emailData.order.discountAmount).toBe(0.5);
    expect(emailData.order.currency).toBe('USD');
    expect(emailData.items).toHaveLength(1);
    expect(emailData.items[0].productName).toBe('Stripe Package');
    expect(emailData.items[0].total).toBe(10);
  });

  it('uses DB amounts in receipt when getReceiptAmountsFromStripe returns null', async () => {
    mockGetReceiptAmountsFromStripe.mockResolvedValue(null);

    const paymentIntent = {
      id: 'pi_test_123',
      status: 'succeeded',
      amount: 1234,
      currency: 'usd',
    } as Stripe.PaymentIntent;

    await handlePaymentIntentSucceeded(paymentIntent);

    expect(mockSendPaymentReceipt).toHaveBeenCalledTimes(1);
    const [, emailData] = vi.mocked(mockSendPaymentReceipt).mock.calls[0];
    expect(emailData.order.totalAmount).toBe(99);
    expect(emailData.order.subtotal).toBe(90);
    expect(emailData.order.taxAmount).toBe(9);
    expect(emailData.order.discountAmount).toBe(null);
    expect(emailData.order.currency).toBe('USD');
    expect(emailData.items[0].productName).toBe('Test Package');
    expect(emailData.items[0].total).toBe(90);
  });

  it('uses DB amounts when order has no stripe_checkout_session_id', async () => {
    mockOrderFromFindByPaymentIntent = {
      ...mockOrderFromFindByPaymentIntent,
      stripe_checkout_session_id: null,
    };
    mockGetReceiptAmountsFromStripe.mockResolvedValue({
      totalAmount: 12.34,
      subtotal: 10,
      taxAmount: 1.34,
      discountAmount: null,
      currency: 'USD',
      items: [],
    });

    const paymentIntent = {
      id: 'pi_test_123',
      status: 'succeeded',
      amount: 1234,
      currency: 'usd',
    } as Stripe.PaymentIntent;

    await handlePaymentIntentSucceeded(paymentIntent);

    expect(mockGetReceiptAmountsFromStripe).not.toHaveBeenCalled();
    const [, emailData] = vi.mocked(mockSendPaymentReceipt).mock.calls[0];
    expect(emailData.order.totalAmount).toBe(99);
  });
});
