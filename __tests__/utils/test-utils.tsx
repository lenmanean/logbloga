import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { CartProvider } from '@/contexts/cart-context';
import { AuthProvider } from '@/hooks/useAuth';

/**
 * Custom render function that includes all providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Wait for async operations to complete
 */
export async function waitForAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Create a mock Next.js request
 */
export function createMockRequest(
  method: string = 'GET',
  body?: any,
  headers?: Record<string, string>
) {
  return {
    method,
    headers: new Headers(headers || {}),
    json: async () => body || {},
    text: async () => JSON.stringify(body || {}),
    formData: async () => new FormData(),
  } as any;
}

/**
 * Create a mock Next.js response
 */
export function createMockResponse() {
  const headers = new Headers();
  let status = 200;
  let body: any = null;

  return {
    status: (code: number) => {
      status = code;
      return {
        json: (data: any) => {
          body = data;
          return { status, headers, json: () => Promise.resolve(data) };
        },
        send: (data: any) => {
          body = data;
          return { status, headers };
        },
      };
    },
    json: (data: any) => {
      body = data;
      return { status, headers, json: () => Promise.resolve(data) };
    },
    headers,
    statusCode: status,
    body,
  };
}

// Re-export everything from React Testing Library (renderWithProviders already exported above)
export * from '@testing-library/react';
