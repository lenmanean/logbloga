'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/hooks/useAuth';
import type { Coupon } from '@/lib/types/database';
import type { CustomerInfo } from '@/lib/checkout/validation';
import type { OrderTotals } from '@/lib/checkout/calculations';
import { calculateOrderTotals } from '@/lib/checkout/calculations';

const CHECKOUT_STORAGE_KEY = 'checkout_state';

export type CheckoutStep = 1 | 2 | 3;

interface CheckoutState {
  currentStep: CheckoutStep;
  customerInfo: CustomerInfo | null;
  appliedCoupon: Coupon | null;
  orderTotals: OrderTotals;
  termsAccepted: boolean;
}

export interface CheckoutContextType {
  currentStep: CheckoutStep;
  customerInfo: CustomerInfo | null;
  appliedCoupon: Coupon | null;
  orderTotals: OrderTotals;
  termsAccepted: boolean;
  isValidatingCoupon: boolean;
  checkoutError: string | null;
  setCurrentStep: (step: CheckoutStep) => void;
  setCustomerInfo: (info: CustomerInfo) => void;
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
 * Manages checkout state across steps
 */
export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const { items } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStepState] = useState<CheckoutStep>(1);
  const [customerInfo, setCustomerInfoState] = useState<CustomerInfo | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [orderTotals, setOrderTotals] = useState<OrderTotals>({
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0,
  });
  const [termsAccepted, setTermsAcceptedState] = useState<boolean>(false);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  /**
   * Load checkout state from sessionStorage
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<CheckoutState>;
        
        // Restore state
        if (parsed.currentStep) {
          setCurrentStepState(parsed.currentStep);
        }
        if (parsed.customerInfo) {
          setCustomerInfoState(parsed.customerInfo);
        }
        if (parsed.appliedCoupon) {
          setAppliedCoupon(parsed.appliedCoupon);
        }
        if (parsed.orderTotals) {
          setOrderTotals(parsed.orderTotals);
        }
        if (typeof parsed.termsAccepted === 'boolean') {
          setTermsAcceptedState(parsed.termsAccepted);
        }
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
      const state: CheckoutState = {
        currentStep,
        customerInfo,
        appliedCoupon,
        orderTotals,
        termsAccepted,
      };
      sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving checkout state:', error);
    }
  }, [currentStep, customerInfo, appliedCoupon, orderTotals, termsAccepted]);

  /**
   * Calculate order totals whenever items or coupon changes
   */
  useEffect(() => {
    calculateTotals();
  }, [items, appliedCoupon]);

  /**
   * Set current step
   */
  const setCurrentStep = useCallback((step: CheckoutStep) => {
    // Validate that step progression is valid
    if (step > currentStep + 1) {
      setCheckoutError('Please complete previous steps first');
      return;
    }
    
    setCheckoutError(null);
    setCurrentStepState(step);
  }, [currentStep]);

  /**
   * Set customer information
   */
  const setCustomerInfo = useCallback((info: CustomerInfo) => {
    setCustomerInfoState(info);
    setCheckoutError(null);
  }, []);

  /**
   * Set terms acceptance
   */
  const setTermsAccepted = useCallback((accepted: boolean) => {
    setTermsAcceptedState(accepted);
    setCheckoutError(null);
  }, []);

  /**
   * Apply coupon code
   */
  const applyCoupon = useCallback(async (code: string): Promise<{ success: boolean; error?: string }> => {
    if (!code || !code.trim()) {
      return { success: false, error: 'Please enter a coupon code' };
    }

    setIsValidatingCoupon(true);
    setCheckoutError(null);

    try {
      // Calculate current cart total
      const subtotal = items.reduce((sum, item) => {
        const price = typeof item.product?.price === 'number' 
          ? item.product.price 
          : parseFloat(String(item.product?.price || 0));
        return sum + (price * (item.quantity || 0));
      }, 0);

      // Get product IDs for coupon validation
      const productIds = items
        .map(item => item.product_id)
        .filter((id): id is string => !!id);

      // Validate coupon via API
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

  /**
   * Remove applied coupon
   */
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCheckoutError(null);
  }, []);

  /**
   * Calculate order totals
   */
  const calculateTotals = useCallback(() => {
    const totals = calculateOrderTotals(items, appliedCoupon);
    setOrderTotals(totals);
  }, [items, appliedCoupon]);

  /**
   * Validate step before allowing progression
   */
  const validateStep = useCallback((step: CheckoutStep): boolean => {
    switch (step) {
      case 1:
        // Cart review - always valid if items exist
        return items.length > 0;
      
      case 2:
        // Customer info - requires customerInfo to be set
        return customerInfo !== null;
      
      case 3:
        // Order review - requires customerInfo to be set
        return customerInfo !== null;
      
      default:
        return false;
    }
  }, [items.length, customerInfo, termsAccepted]);

  /**
   * Reset checkout state
   */
  const resetCheckout = useCallback(() => {
    setCurrentStepState(1);
    setCustomerInfoState(null);
    setAppliedCoupon(null);
    setTermsAcceptedState(false);
    setCheckoutError(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
    }
  }, []);

  const value: CheckoutContextType = {
    currentStep,
    customerInfo,
    appliedCoupon,
    orderTotals,
    termsAccepted,
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

/**
 * useCheckout Hook
 * Access checkout context
 */
export function useCheckout(): CheckoutContextType {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}

