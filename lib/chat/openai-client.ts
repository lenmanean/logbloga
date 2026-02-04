/**
 * OpenAI client wrapper for AI Chat Assistant
 * Uses ChatGPT models only (gpt-4o or gpt-4o-mini)
 */

import OpenAI from 'openai';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const MODEL = 'gpt-4o-mini'; // Cost-effective; can switch to gpt-4o for higher quality

/**
 * Create OpenAI client. Throws if OPENAI_API_KEY is not set.
 */
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({ apiKey });
}

/**
 * Call OpenAI Chat Completions API
 */
export async function createChatCompletion(
  messages: ChatMessage[]
): Promise<string> {
  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    max_tokens: 1024,
    temperature: 0.5,
  });

  const choice = response.choices?.[0];
  if (!choice?.message?.content) {
    throw new Error('Invalid response from OpenAI');
  }
  return choice.message.content;
}
