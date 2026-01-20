import { describe, it, expect } from 'vitest';
import {
  stripeStatusToOrderStatus,
  formatAmountForStripe,
  formatAmountFromStripe,
  extractCheckoutMetadata,
  isCheckoutSessionPaid,
  getPaymentIntentId,
} from '@/lib/stripe/utils';
import type Stripe from 'stripe';

describe('Stripe Utils', () => {
  describe('stripeStatusToOrderStatus', () => {
    it('should convert succeeded to completed', () => {
      expect(stripeStatusToOrderStatus('succeeded')).toBe('completed');
    });

    it('should convert processing to processing', () => {
      expect(stripeStatusToOrderStatus('processing')).toBe('processing');
    });

    it('should convert requires_payment_method to cancelled', () => {
      expect(stripeStatusToOrderStatus('requires_payment_method')).toBe('cancelled');
    });

    it('should default to processing for unknown status', () => {
      expect(stripeStatusToOrderStatus('unknown_status')).toBe('processing');
    });
  });

  describe('formatAmountForStripe', () => {
    it('should convert dollars to cents', () => {
      expect(formatAmountForStripe(10.99)).toBe(1099);
    });

    it('should handle whole numbers', () => {
      expect(formatAmountForStripe(100)).toBe(10000);
    });

    it('should round to nearest cent', () => {
      expect(formatAmountForStripe(10.999)).toBe(1100);
    });

    it('should handle zero', () => {
      expect(formatAmountForStripe(0)).toBe(0);
    });
  });

  describe('formatAmountFromStripe', () => {
    it('should convert cents to dollars', () => {
      expect(formatAmountFromStripe(1099)).toBe(10.99);
    });

    it('should handle whole numbers', () => {
      expect(formatAmountFromStripe(10000)).toBe(100);
    });

    it('should handle zero', () => {
      expect(formatAmountFromStripe(0)).toBe(0);
    });
  });

  describe('extractCheckoutMetadata', () => {
    it('should extract metadata from session', () => {
      const session = {
        metadata: {
          orderId: 'order123',
          orderNumber: 'ORD-001',
          userId: 'user123',
        },
      } as Stripe.Checkout.Session;

      const metadata = extractCheckoutMetadata(session);
      expect(metadata.orderId).toBe('order123');
      expect(metadata.orderNumber).toBe('ORD-001');
      expect(metadata.userId).toBe('user123');
    });

    it('should return empty object when metadata is null', () => {
      const session = {
        metadata: null,
      } as Stripe.Checkout.Session;

      const metadata = extractCheckoutMetadata(session);
      expect(metadata).toEqual({});
    });

    it('should return empty object when metadata is undefined', () => {
      const session = {} as Stripe.Checkout.Session;

      const metadata = extractCheckoutMetadata(session);
      expect(metadata).toEqual({});
    });
  });

  describe('isCheckoutSessionPaid', () => {
    it('should return true for paid and complete session', () => {
      const session = {
        payment_status: 'paid',
        status: 'complete',
      } as Stripe.Checkout.Session;

      expect(isCheckoutSessionPaid(session)).toBe(true);
    });

    it('should return false for unpaid session', () => {
      const session = {
        payment_status: 'unpaid',
        status: 'open',
      } as Stripe.Checkout.Session;

      expect(isCheckoutSessionPaid(session)).toBe(false);
    });

    it('should return false for incomplete session', () => {
      const session = {
        payment_status: 'paid',
        status: 'open',
      } as Stripe.Checkout.Session;

      expect(isCheckoutSessionPaid(session)).toBe(false);
    });
  });

  describe('getPaymentIntentId', () => {
    it('should return payment intent ID as string', () => {
      const session = {
        payment_intent: 'pi_test_123',
      } as Stripe.Checkout.Session;

      expect(getPaymentIntentId(session)).toBe('pi_test_123');
    });

    it('should return payment intent ID from object', () => {
      const session = {
        payment_intent: {
          id: 'pi_test_123',
        },
      } as Stripe.Checkout.Session;

      expect(getPaymentIntentId(session)).toBe('pi_test_123');
    });

    it('should return null when payment intent is null', () => {
      const session = {
        payment_intent: null,
      } as Stripe.Checkout.Session;

      expect(getPaymentIntentId(session)).toBeNull();
    });

    it('should return null when payment intent is undefined', () => {
      const session = {} as Stripe.Checkout.Session;

      expect(getPaymentIntentId(session)).toBeNull();
    });
  });
});
