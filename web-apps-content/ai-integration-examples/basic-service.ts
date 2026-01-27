/**
 * Basic AI Service Example
 * 
 * Simple abstraction for OpenAI and Anthropic APIs
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateContent(
  prompt: string,
  provider: 'openai' | 'anthropic' = 'openai'
): Promise<string> {
  try {
    if (provider === 'openai') {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      });
      return response.choices[0].message.content || '';
    } else {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      });
      return response.content[0].text;
    }
  } catch (error) {
    console.error('AI API error:', error);
    throw error;
  }
}
