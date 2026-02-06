'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';

export type AuthModalPendingAction = 'buy_now' | 'add_to_cart' | 'wallet';

export interface AuthModalPayload {
  productId?: string;
  productTitle?: string;
  productSlug?: string | null;
  variantId?: string;
  quantity?: number;
  amountUsd?: number;
}

interface AuthModalContextType {
  open: boolean;
  pendingAction: AuthModalPendingAction | null;
  payload: AuthModalPayload;
  openAuthModal: (action: AuthModalPendingAction, payload: AuthModalPayload) => void;
  closeAuthModal: () => void;
  onAuthSuccess: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

const EXPRESS_PATH_PREFIX = '/checkout/express';

function buildExpressUrl(payload: AuthModalPayload): string {
  const params = new URLSearchParams();
  if (payload.productId) params.set('productId', payload.productId);
  if (payload.productTitle != null && payload.productTitle !== '') {
    params.set('title', encodeURIComponent(payload.productTitle));
  }
  if (payload.productSlug != null && payload.productSlug !== '') {
    params.set('slug', encodeURIComponent(payload.productSlug));
  }
  return `${EXPRESS_PATH_PREFIX}?${params.toString()}`;
}

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<AuthModalPendingAction | null>(null);
  const [payload, setPayload] = useState<AuthModalPayload>({});

  const openAuthModal = useCallback((action: AuthModalPendingAction, nextPayload: AuthModalPayload) => {
    setPayload(nextPayload);
    setPendingAction(action);
    setOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setOpen(false);
    setPendingAction(null);
    setPayload({});
  }, []);

  const onAuthSuccess = useCallback(() => {
    const action = pendingAction;
    const nextPayload = { ...payload };

    if (action === 'buy_now') {
      const url = buildExpressUrl(nextPayload);
      closeAuthModal();
      router.push(url);
      return;
    }

    if (action === 'add_to_cart' && nextPayload.productId) {
      const productId = nextPayload.productId;
      const quantity = nextPayload.quantity ?? 1;
      const variantId = nextPayload.variantId;
      closeAuthModal();
      addItem(productId, quantity, variantId).catch(() => {});
      return;
    }

    if (action === 'wallet') {
      closeAuthModal();
      return;
    }

    closeAuthModal();
  }, [pendingAction, payload, closeAuthModal, router, addItem]);

  const value: AuthModalContextType = {
    open,
    pendingAction,
    payload,
    openAuthModal,
    closeAuthModal,
    onAuthSuccess,
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextType {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
