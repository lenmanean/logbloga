/**
 * Email sender functions
 * Handles sending various types of transactional emails
 */

import { render } from '@react-email/render';
import { getResendClient, getDefaultSender } from './client';
import { shouldSendEmail } from './utils';
import type {
  EmailResult,
  OrderEmailData,
  LicenseEmailData,
  WelcomeEmailData,
  AbandonedCartEmailData,
  OrderStatusUpdateEmailData,
  ProductUpdateEmailData,
} from './types';
import { OrderConfirmationEmail } from './templates/order-confirmation';
import { PaymentReceiptEmail } from './templates/payment-receipt';
import { LicenseDeliveryEmail } from './templates/license-delivery';
import { WelcomeEmail } from './templates/welcome';
import { AbandonedCartEmail } from './templates/abandoned-cart';
import { OrderStatusUpdateEmail } from './templates/order-status-update';
import { ProductUpdateEmail } from './templates/product-update';

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  userId: string,
  data: OrderEmailData
): Promise<EmailResult> {
  try {
    // Check notification preferences
    const shouldSend = await shouldSendEmail(userId, 'order-confirmation');
    if (!shouldSend) {
      console.log(`Skipping order confirmation email for user ${userId} (preferences)`);
      return { success: true, messageId: 'skipped-preference' };
    }

    const resend = getResendClient();
    const html = await render(OrderConfirmationEmail({ data }));

    const result = await resend.emails.send({
      from: getDefaultSender(),
      to: data.order.customerEmail,
      subject: `Order Confirmation - ${data.order.orderNumber}`,
      html,
      tags: [
        { name: 'email_type', value: 'order_confirmation' },
        { name: 'order_id', value: data.order.id },
      ],
    });

    if (result.error) {
      console.error('Error sending order confirmation email:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send payment receipt email
 */
export async function sendPaymentReceipt(
  userId: string,
  data: OrderEmailData
): Promise<EmailResult> {
  try {
    // Check notification preferences
    const shouldSend = await shouldSendEmail(userId, 'payment-receipt');
    if (!shouldSend) {
      console.log(`Skipping payment receipt email for user ${userId} (preferences)`);
      return { success: true, messageId: 'skipped-preference' };
    }

    const resend = getResendClient();
    const html = await render(PaymentReceiptEmail({ data }));

    const result = await resend.emails.send({
      from: getDefaultSender(),
      to: data.order.customerEmail,
      subject: `Payment Receipt - ${data.order.orderNumber}`,
      html,
      tags: [
        { name: 'email_type', value: 'payment_receipt' },
        { name: 'order_id', value: data.order.id },
      ],
    });

    if (result.error) {
      console.error('Error sending payment receipt email:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending payment receipt email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send license delivery email
 */
export async function sendLicenseDelivery(
  userId: string,
  data: LicenseEmailData
): Promise<EmailResult> {
  try {
    // Check notification preferences
    const shouldSend = await shouldSendEmail(userId, 'license-delivery');
    if (!shouldSend) {
      console.log(`Skipping license delivery email for user ${userId} (preferences)`);
      return { success: true, messageId: 'skipped-preference' };
    }

    const resend = getResendClient();
    const html = await render(LicenseDeliveryEmail({ data }));

    const result = await resend.emails.send({
      from: getDefaultSender(),
      to: data.order.customerEmail,
      subject: `Your License Keys - Order ${data.order.orderNumber}`,
      html,
      tags: [
        { name: 'email_type', value: 'license_delivery' },
        { name: 'order_id', value: data.order.id },
      ],
    });

    if (result.error) {
      console.error('Error sending license delivery email:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending license delivery email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  userId: string,
  data: WelcomeEmailData
): Promise<EmailResult> {
  try {
    // Welcome emails are always sent (no preference check)
    const resend = getResendClient();
    const html = await render(WelcomeEmail({ data }));

    const result = await resend.emails.send({
      from: getDefaultSender(),
      to: data.user.email,
      subject: 'Welcome to LogBloga!',
      html,
      tags: [
        { name: 'email_type', value: 'welcome' },
        { name: 'user_id', value: userId },
      ],
    });

    if (result.error) {
      console.error('Error sending welcome email:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send abandoned cart reminder email
 */
export async function sendAbandonedCartReminder(
  userId: string,
  data: AbandonedCartEmailData
): Promise<EmailResult> {
  try {
    const shouldSend = await shouldSendEmail(userId, 'abandoned-cart');
    if (!shouldSend) {
      console.log(`Skipping abandoned cart email for user ${userId} (preferences)`);
      return { success: true, messageId: 'skipped-preference' };
    }

    const resend = getResendClient();
    const html = await render(AbandonedCartEmail({ data }));

    const result = await resend.emails.send({
      from: getDefaultSender(),
      to: data.user.email,
      subject: 'Complete your purchase - Items waiting in your cart',
      html,
      tags: [
        { name: 'email_type', value: 'abandoned_cart' },
        { name: 'user_id', value: userId },
      ],
    });

    if (result.error) {
      console.error('Error sending abandoned cart email:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending abandoned cart email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send order status update email
 */
export async function sendOrderStatusUpdate(
  userId: string,
  data: OrderStatusUpdateEmailData
): Promise<EmailResult> {
  try {
    const shouldSend = await shouldSendEmail(userId, 'order-status-update');
    if (!shouldSend) {
      console.log(`Skipping order status update email for user ${userId} (preferences)`);
      return { success: true, messageId: 'skipped-preference' };
    }

    const resend = getResendClient();
    const html = await render(OrderStatusUpdateEmail({ data }));

    const result = await resend.emails.send({
      from: getDefaultSender(),
      to: data.order.customerEmail,
      subject: `Order Status Update - ${data.order.orderNumber}`,
      html,
      tags: [
        { name: 'email_type', value: 'order_status_update' },
        { name: 'order_id', value: data.order.id },
      ],
    });

    if (result.error) {
      console.error('Error sending order status update email:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending order status update email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send product update email
 */
export async function sendProductUpdate(
  userId: string,
  data: ProductUpdateEmailData
): Promise<EmailResult> {
  try {
    const shouldSend = await shouldSendEmail(userId, 'product-update');
    if (!shouldSend) {
      console.log(`Skipping product update email for user ${userId} (preferences)`);
      return { success: true, messageId: 'skipped-preference' };
    }

    const resend = getResendClient();
    const html = await render(ProductUpdateEmail({ data }));

    const result = await resend.emails.send({
      from: getDefaultSender(),
      to: data.user.email,
      subject: `Product Update - ${data.product.name}`,
      html,
      tags: [
        { name: 'email_type', value: 'product_update' },
        { name: 'product_id', value: data.product.id },
        { name: 'user_id', value: userId },
      ],
    });

    if (result.error) {
      console.error('Error sending product update email:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending product update email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
