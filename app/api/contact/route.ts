import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withRateLimit } from '@/lib/security/rate-limit-middleware';
import { createContactSubmission } from '@/lib/db/contact';
import { sendContactSubmissionNotification, sendContactConfirmation } from '@/lib/email/senders';

const chatContextSchema = z.object({
  lastUserMessage: z.string().max(500).optional(),
  lastAssistantMessage: z.string().max(500).optional(),
}).optional();

/**
 * Contact form submission schema
 */
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message must be less than 5000 characters'),
  website: z.string().max(0, 'Spam detected').optional(), // Honeypot field - must be empty
  chat_context: chatContextSchema,
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const CHAT_FOLLOW_UP_SUBJECT = 'Chat Assistant - Follow-up';

/**
 * Extract IP address from request headers
 */
function getIpAddress(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0]?.trim() || realIp || null;
  return ip;
}

/**
 * Extract user agent from request headers
 */
function getUserAgent(request: Request): string | null {
  return request.headers.get('user-agent') || null;
}

/**
 * POST /api/contact
 * Handle contact form submissions
 * Rate limited: 5 requests per minute (using 'public' type)
 */
export async function POST(request: Request) {
  return withRateLimit(
    request,
    {
      type: 'public',
      skipInDevelopment: false,
    },
    async () => {
      try {
        const body = await request.json();

        // Validate request body
        const validationResult = contactFormSchema.safeParse(body);
        
        if (!validationResult.success) {
          const errors = validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }));

          return NextResponse.json(
            {
              error: 'Validation failed',
              errors,
            },
            { status: 400 }
          );
        }

        const data = validationResult.data;

        // Honeypot check - if website field has any value, it's likely spam
        if (data.website && data.website.length > 0) {
          // Silently reject (don't reveal it's a honeypot)
          return NextResponse.json(
            { success: true, message: 'Thank you for your message. We will get back to you soon.' },
            { status: 200 }
          );
        }

        const metadata: Record<string, unknown> = {};
        if (data.subject === CHAT_FOLLOW_UP_SUBJECT && data.chat_context) {
          metadata.source = 'chat';
          if (data.chat_context.lastUserMessage) metadata.lastUserMessage = data.chat_context.lastUserMessage.trim().slice(0, 500);
          if (data.chat_context.lastAssistantMessage) metadata.lastAssistantMessage = data.chat_context.lastAssistantMessage.trim().slice(0, 500);
        }

        // Extract IP address and user agent
        const ipAddress = getIpAddress(request);
        const userAgent = getUserAgent(request);

        // Create contact submission in database
        const submission = await createContactSubmission({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          ip_address: ipAddress,
          user_agent: userAgent,
          status: 'pending',
          spam_score: 0,
          metadata,
        });

        const chatContext = metadata.source === 'chat' ? {
          lastUserMessage: (metadata.lastUserMessage as string) || undefined,
          lastAssistantMessage: (metadata.lastAssistantMessage as string) || undefined,
        } : undefined;

        // Send emails asynchronously (don't block response)
        // Send notification to support team
        sendContactSubmissionNotification({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          ipAddress: ipAddress || undefined,
          submissionId: submission.id,
          submittedAt: submission.created_at,
          chatContext,
        }).catch((error) => {
          console.error('Error sending contact submission notification email:', error);
          // Don't fail the request if email fails
        });

        // Send confirmation to user
        sendContactConfirmation({
          name: data.name,
          email: data.email,
          subject: data.subject,
        }).catch((error) => {
          console.error('Error sending contact confirmation email:', error);
          // Don't fail the request if email fails
        });

        return NextResponse.json(
          {
            success: true,
            message: 'Thank you for your message. We will get back to you within 24-48 hours.',
            submissionId: submission.id,
          },
          { status: 200 }
        );
      } catch (error) {
        console.error('Error processing contact form submission:', error);

        // Check if it's a database error
        if (error instanceof Error && error.message.includes('contact submission')) {
          return NextResponse.json(
            {
              error: 'Failed to submit your message. Please try again later.',
            },
            { status: 500 }
          );
        }

        return NextResponse.json(
          {
            error: 'An unexpected error occurred. Please try again later.',
          },
          { status: 500 }
        );
      }
    }
  );
}
