import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Simple AI completion using OpenAI.
 * Use in API routes or server actions; never expose the API key to the client.
 */
export async function complete(prompt: string, maxTokens = 500): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
  });
  const content = response.choices[0]?.message?.content;
  return content ?? '';
}
