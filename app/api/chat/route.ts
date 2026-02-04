import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withRateLimit } from '@/lib/security/rate-limit-middleware';
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

        const context = await retrieveKnowledgeContext(lastUserMessage.content);
        const systemPrompt = buildSystemPrompt(context);

        const apiMessages: ChatMessage[] = [
          { role: 'system', content: systemPrompt },
          ...sanitizedMessages.map((m) => ({
            role: m.role as 'user' | 'assistant' | 'system',
            content: m.content,
          })),
        ];

        const response = await createChatCompletion(apiMessages);

        const sanitizedResponse = removeControlCharacters(response);

        return NextResponse.json({
          message: {
            role: 'assistant' as const,
            content: sanitizedResponse,
          },
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
