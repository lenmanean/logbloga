'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCart } from '@/contexts/cart-context';
import type { Coupon } from '@/lib/types/database';
import type { OrderTotals } from '@/lib/checkout/calculations';
import { calculateOrderTotals } from '@/lib/checkout/calculations';

const CHECKOUT_STORAGE_KEY = 'checkout_state';

export type CheckoutStep = 1 | 2 | 3;

interface CheckoutState {
  appliedCoupon: Coupon | null;
  orderTotals: OrderTotals;
}

export interface CheckoutContextType {
  currentStep: CheckoutStep;
  customerInfo: null;
  appliedCoupon: Coupon | null;
  orderTotals: OrderTotals;
  termsAccepted: boolean;
  isValidatingCoupon: boolean;
  checkoutError: string | null;
  setCurrentStep: (step: CheckoutStep) => void;
  setCustomerInfo: (info: unknown) => void;
  setTermsAccepted: (accepted: boolean) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
  calculateTotals: () => void;
  validateStep: (step: CheckoutStep) => boolean;
  resetCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

/**
 * CheckoutProvider Component
 * Manages checkout state (cart totals, coupon). Customer info and steps removed; Stripe Checkout handles payment.
 */
export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const { items } = useCart();
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [orderTotals, setOrderTotals] = useState<OrderTotals>({
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0,
  });
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  /**
   * Load checkout state from sessionStorage (coupon and totals only)
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<CheckoutState>;
        if (parsed.appliedCoupon) setAppliedCoupon(parsed.appliedCoupon);
        if (parsed.orderTotals) setOrderTotals(parsed.orderTotals);
      }
    } catch (error) {
      console.error('Error loading checkout state:', error);
    }
  }, []);

  /**
   * Save checkout state to sessionStorage
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const state: CheckoutState = { appliedCoupon, orderTotals };
      sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving checkout state:', error);
    }
  }, [appliedCoupon, orderTotals]);

  const setCurrentStep = useCallback((_step: CheckoutStep) => {}, []);
  const setCustomerInfo = useCallback((_info: unknown) => {}, []);
  const setTermsAccepted = useCallback((_accepted: boolean) => {}, []);
  const validateStep = useCallback((_step: CheckoutStep): boolean => true, []);

  const applyCoupon = useCallback(async (code: string): Promise<{ success: boolean; error?: string }> => {
    if (!code || !code.trim()) {
      return { success: false, error: 'Please enter a coupon code' };
    }
    setIsValidatingCoupon(true);
    setCheckoutError(null);
    try {
      const subtotal = items.reduce((sum, item) => {
        const price = typeof item.product?.price === 'number'
          ? item.product.price
          : parseFloat(String(item.product?.price || 0));
        return sum + (price * (item.quantity || 0));
      }, 0);
      const productIds = items
        .map(item => item.product_id)
        .filter((id): id is string => !!id);
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          cartTotal: subtotal,
          productIds,
        }),
      });
      const data = await response.json();
      if (!data.valid || !data.coupon) {
        setAppliedCoupon(null);
        return { success: false, error: data.error || 'Invalid coupon code' };
      }
      setAppliedCoupon(data.coupon);
      return { success: true };
    } catch (error) {
      console.error('Error applying coupon:', error);
      setAppliedCoupon(null);
      return { success: false, error: 'Failed to apply coupon. Please try again.' };
    } finally {
      setIsValidatingCoupon(false);
    }
  }, [items]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCheckoutError(null);
  }, []);

  const calculateTotals = useCallback(() => {
    const totals = calculateOrderTotals(items, appliedCoupon);
    setOrderTotals(totals);
  }, [items, appliedCoupon]);

  useEffect(() => {
    calculateTotals();
  }, [items, appliedCoupon, calculateTotals]);

  const resetCheckout = useCallback(() => {
    setAppliedCoupon(null);
    setCheckoutError(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
    }
  }, []);

  const value: CheckoutContextType = {
    currentStep: 1,
    customerInfo: null,
    appliedCoupon,
    orderTotals,
    termsAccepted: false,
    isValidatingCoupon,
    checkoutError,
    setCurrentStep,
    setCustomerInfo,
    setTermsAccepted,
    applyCoupon,
    removeCoupon,
    calculateTotals,
    validateStep,
    resetCheckout,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout(): CheckoutContextType {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
