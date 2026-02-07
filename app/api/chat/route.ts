import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withRateLimit } from '@/lib/security/rate-limit-middleware';
import { requireAuth } from '@/lib/auth/utils';
import { userHasAnyPackageAccess } from '@/lib/db/access';
import { retrieveKnowledgeContext } from '@/lib/chat/knowledge-retrieval';
import { buildSystemPrompt } from '@/lib/chat/system-prompt';
import { createChatCompletion, type ChatMessage } from '@/lib/chat/openai-client';
import { sanitizeText, removeControlCharacters } from '@/lib/security/sanitization';

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(2000),
      })
    )
    .max(20)
    .min(1),
});

type ChatRequest = z.infer<typeof chatRequestSchema>;

/**
 * POST /api/chat
 * AI Chat Assistant - answers questions about Logbloga packages/products using RAG.
 * Rate limited: 30 requests per minute.
 */
export async function POST(request: Request) {
  return withRateLimit(
    request,
    {
      type: 'chat',
      skipInDevelopment: false,
    },
    async () => {
      try {
        let user: { id: string };
        try {
          user = await requireAuth();
        } catch (authErr) {
          const status = (authErr as { status?: number })?.status;
          if (status === 401) {
            return NextResponse.json(
              { error: 'Sign in to use the assistant.', code: 'UNAUTHORIZED' },
              { status: 401 }
            );
          }
          throw authErr;
        }

        const hasAccess = await userHasAnyPackageAccess(user.id);
        if (!hasAccess) {
          return NextResponse.json(
            { error: 'Purchase a package to unlock the assistant.', code: 'FORBIDDEN' },
            { status: 403 }
          );
        }

        if (!process.env.OPENAI_API_KEY) {
          return NextResponse.json(
            { error: 'Chat is not available. Please try again later.' },
            { status: 503 }
          );
        }

        const body = await request.json();
        const parseResult = chatRequestSchema.safeParse(body);
        if (!parseResult.success) {
          return NextResponse.json(
            { error: 'Invalid request', details: parseResult.error.issues },
            { status: 400 }
          );
        }

        const { messages } = parseResult.data as ChatRequest;

        // Sanitize all message content
        const sanitizedMessages = messages.map((m) => ({
          role: m.role,
          content: removeControlCharacters(sanitizeText(m.content)),
        }));

        const lastUserMessage = sanitizedMessages
          .filter((m) => m.role === 'user')
          .pop();
        if (!lastUserMessage) {
          return NextResponse.json(
            { error: 'At least one user message is required' },
            { status: 400 }
          );
        }

        const context = await retrieveKnowledgeContext(lastUserMessage.content, user.id);
        const systemPrompt = buildSystemPrompt(context);

        const apiMessages: ChatMessage[] = [
          { role: 'system', content: systemPrompt },
          ...sanitizedMessages.map((m) => ({
            role: m.role as 'user' | 'assistant' | 'system',
            content: m.content,
          })),
        ];

        const response = await createChatCompletion(apiMessages);

        let sanitizedResponse = removeControlCharacters(response);
        const OFFER_MARKER = '[OFFER_CONTACT_FORM]';
        const showContactForm =
          sanitizedResponse.endsWith(OFFER_MARKER) ||
          sanitizedResponse.endsWith(`\n${OFFER_MARKER}`);

        if (showContactForm) {
          sanitizedResponse = sanitizedResponse
            .replace(/\n?\[OFFER_CONTACT_FORM\]\s*$/, '')
            .trim();
        }

        return NextResponse.json({
          message: {
            role: 'assistant' as const,
            content: sanitizedResponse,
          },
          ...(showContactForm && { showContactForm: true }),
        });
      } catch (error) {
        console.error('Chat API error:', error);

        if (error instanceof Error) {
          if (error.message.includes('OPENAI_API_KEY')) {
            return NextResponse.json(
              { error: 'Chat is not available. Please try again later.' },
              { status: 503 }
            );
          }
          if (error.message.includes('rate limit') || error.message.includes('429')) {
            return NextResponse.json(
              { error: 'Too many requests. Please wait a moment before trying again.' },
              { status: 429 }
            );
          }
        }

        return NextResponse.json(
          { error: 'An error occurred. Please try again.' },
          { status: 500 }
        );
      }
    }
  );
}
