/**
 * Email Queue System
 * Simple in-memory queue for email sending with retry logic
 * 
 * Note: For production, consider using a proper queue system like Bull, BullMQ, or a cloud service
 */

interface QueuedEmail {
  id: string;
  userId: string;
  emailType: string;
  data: any;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  nextRetryAt: Date;
}

class EmailQueue {
  private queue: QueuedEmail[] = [];
  private processing = false;
  private readonly maxAttempts = 3;
  private readonly retryDelay = 60000; // 1 minute

  /**
   * Add email to queue
   */
  async enqueue(
    userId: string,
    emailType: string,
    data: any
  ): Promise<string> {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const email: QueuedEmail = {
      id,
      userId,
      emailType,
      data,
      attempts: 0,
      maxAttempts: this.maxAttempts,
      createdAt: new Date(),
      nextRetryAt: new Date(),
    };

    this.queue.push(email);
    this.processQueue();

    return id;
  }

  /**
   * Process queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    try {
      const now = new Date();
      const readyEmails = this.queue.filter(
        (email) => email.nextRetryAt <= now
      );

      for (const email of readyEmails) {
        try {
          await this.sendEmail(email);
          // Remove from queue on success
          this.queue = this.queue.filter((e) => e.id !== email.id);
        } catch (error) {
          console.error(`Error sending queued email ${email.id}:`, error);
          email.attempts++;
          email.nextRetryAt = new Date(
            Date.now() + this.retryDelay * email.attempts
          );

          if (email.attempts >= email.maxAttempts) {
            console.error(
              `Email ${email.id} failed after ${email.maxAttempts} attempts, removing from queue`
            );
            this.queue = this.queue.filter((e) => e.id !== email.id);
          }
        }
      }
    } finally {
      this.processing = false;

      // Schedule next processing if queue has items
      if (this.queue.length > 0) {
        setTimeout(() => this.processQueue(), 5000);
      }
    }
  }

  /**
   * Send email using appropriate sender function
   */
  private async sendEmail(email: QueuedEmail): Promise<void> {
    const { sendOrderConfirmation, sendPaymentReceipt, sendLicenseDelivery, sendWelcomeEmail, sendAbandonedCartReminder, sendOrderStatusUpdate, sendProductUpdate } = await import('./senders');

    switch (email.emailType) {
      case 'order-confirmation':
        await sendOrderConfirmation(email.userId, email.data);
        break;
      case 'payment-receipt':
        await sendPaymentReceipt(email.userId, email.data);
        break;
      case 'license-delivery':
        await sendLicenseDelivery(email.userId, email.data);
        break;
      case 'welcome':
        await sendWelcomeEmail(email.userId, email.data);
        break;
      case 'abandoned-cart':
        await sendAbandonedCartReminder(email.userId, email.data);
        break;
      case 'order-status-update':
        await sendOrderStatusUpdate(email.userId, email.data);
        break;
      case 'product-update':
        await sendProductUpdate(email.userId, email.data);
        break;
      default:
        throw new Error(`Unknown email type: ${email.emailType}`);
    }
  }

  /**
   * Get queue status
   */
  getStatus(): { queued: number; processing: boolean } {
    return {
      queued: this.queue.length,
      processing: this.processing,
    };
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue = [];
  }
}

// Singleton instance
let emailQueueInstance: EmailQueue | null = null;

/**
 * Get email queue instance
 */
export function getEmailQueue(): EmailQueue {
  if (!emailQueueInstance) {
    emailQueueInstance = new EmailQueue();
  }
  return emailQueueInstance;
}

/**
 * Queue an email for sending
 * Use this for non-critical emails that can be sent asynchronously
 */
export async function queueEmail(
  userId: string,
  emailType: string,
  data: any
): Promise<string> {
  const queue = getEmailQueue();
  return queue.enqueue(userId, emailType, data);
}
