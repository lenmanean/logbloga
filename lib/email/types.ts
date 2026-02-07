/**
 * Email type definitions
 */

export type EmailTemplate =
  | 'order-confirmation'
  | 'payment-receipt'
  | 'welcome'
  | 'password-reset'
  | 'email-verification'
  | 'abandoned-cart'
  | 'order-status-update'
  | 'product-update';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  tags?: Array<{ name: string; value: string }>;
  metadata?: Record<string, string>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface OrderEmailData {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    subtotal: number;
    taxAmount: number | null;
    discountAmount: number | null;
    currency: string;
    createdAt: string;
    customerEmail: string;
    customerName: string | null;
  };
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  doerCouponCode?: string | null;
  doerCouponExpiresAt?: string | null;
}

export interface WelcomeEmailData {
  user: {
    email: string;
    name: string | null;
  };
}

export interface AbandonedCartEmailData {
  user: {
    email: string;
    name: string | null;
  };
  cartItems: Array<{
    productName: string;
    productSlug: string;
    quantity: number;
    price: number;
  }>;
  discountCode?: string;
}

export interface OrderStatusUpdateEmailData {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    customerEmail: string;
    customerName: string | null;
  };
  previousStatus?: string;
}

export interface ProductUpdateEmailData {
  user: {
    email: string;
    name: string | null;
  };
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
}

export interface ContactSubmissionData {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress?: string;
  submissionId: string;
  submittedAt: string;
  chatContext?: {
    lastUserMessage?: string;
    lastAssistantMessage?: string;
  };
}

export interface ContactConfirmationData {
  name: string;
  email: string;
  subject: string;
}
