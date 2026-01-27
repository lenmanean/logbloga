# AI Integration Guide

## Overview

This guide covers integrating AI services (OpenAI, Anthropic) into your SaaS application, including API setup, prompt engineering, cost management, and best practices.

## Prerequisites

- OpenAI API account or Anthropic API account
- Understanding of API concepts
- Next.js application ready for integration

## Step 1: API Setup

### OpenAI Setup

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account or sign in
3. Go to API Keys
4. Create new secret key
5. Copy and store securely

**Current Models** (as of 2025):
- GPT-4: Most capable
- GPT-3.5-turbo: Faster, cheaper
- GPT-4-turbo: Balanced

### Anthropic Setup

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create account
3. Go to API Keys
4. Create new key
5. Copy and store securely

**Current Models**:
- Claude 3.5 Sonnet: Latest, most capable
- Claude 3 Opus: Most powerful
- Claude 3 Haiku: Fastest, cheapest

## Step 2: Install Libraries

```bash
# OpenAI
npm install openai

# Anthropic
npm install @anthropic-ai/sdk
```

## Step 3: Environment Variables

Add to `.env.local`:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Model selection
OPENAI_MODEL=gpt-4-turbo
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

## Step 4: Create AI Service

### Service Abstraction

Create `lib/ai/service.ts`:

```typescript
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
) {
  try {
    if (provider === 'openai') {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      });
      return response.choices[0].message.content;
    } else {
      const response = await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
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
```

## Step 5: API Route Example

Create `app/api/ai/generate/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/ai/service';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, provider } = await request.json();

    // Rate limiting check
    const { data: usage } = await supabase
      .from('ai_usage')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (usage && usage.length > 100) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const content = await generateContent(prompt, provider);

    // Log usage
    await supabase.from('ai_usage').insert({
      user_id: user.id,
      prompt_length: prompt.length,
      response_length: content?.length || 0,
      provider,
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
```

## Step 6: Prompt Engineering

### Best Practices

**Be Specific**:
```
❌ "Write content"
✅ "Write a 200-word blog post about SaaS pricing strategies for small businesses"
```

**Provide Context**:
```
"Based on this user data: [data], generate a personalized recommendation."
```

**Use System Messages** (OpenAI):
```typescript
messages: [
  { role: 'system', content: 'You are a helpful SaaS advisor.' },
  { role: 'user', content: prompt }
]
```

### Prompt Templates

**Content Generation**:
```
Generate [type] about [topic] for [audience].
Requirements:
- Length: [X] words
- Tone: [tone]
- Include: [requirements]
```

**Analysis**:
```
Analyze the following [data type]: [data]
Provide:
1. Key insights
2. Trends
3. Recommendations
```

## Step 7: Cost Management

### Track Usage

Create `ai_usage` table:

```sql
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_tokens INTEGER,
  cost NUMERIC(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Cost Calculation

```typescript
function calculateCost(
  provider: string,
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const costs = {
    openai: {
      'gpt-4-turbo': { input: 0.01, output: 0.03 }, // per 1K tokens
      'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
    },
    anthropic: {
      'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
      'claude-3-haiku': { input: 0.00025, output: 0.00125 },
    },
  };

  const modelCosts = costs[provider]?.[model];
  if (!modelCosts) return 0;

  return (
    (promptTokens / 1000) * modelCosts.input +
    (completionTokens / 1000) * modelCosts.output
  );
}
```

### Rate Limiting

```typescript
// Check user's daily usage
const dailyLimit = 100; // requests per day
const { count } = await supabase
  .from('ai_usage')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', user.id)
  .gte('created_at', startOfDay);

if (count && count >= dailyLimit) {
  throw new Error('Daily limit exceeded');
}
```

## Step 8: Error Handling

### Retry Logic

```typescript
async function generateWithRetry(
  prompt: string,
  maxRetries = 3
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateContent(prompt);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Fallback Strategy

```typescript
async function generateWithFallback(prompt: string) {
  try {
    return await generateContent(prompt, 'openai');
  } catch (error) {
    console.error('OpenAI failed, trying Anthropic:', error);
    return await generateContent(prompt, 'anthropic');
  }
}
```

## Step 9: Caching

### Cache AI Responses

```typescript
import { createClient } from '@/lib/supabase/server';

async function getCachedResponse(promptHash: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('ai_cache')
    .select('response')
    .eq('prompt_hash', promptHash)
    .single();
  return data?.response;
}

async function cacheResponse(promptHash: string, response: string) {
  const supabase = await createClient();
  await supabase.from('ai_cache').insert({
    prompt_hash: promptHash,
    response,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
}
```

## Best Practices

1. **Monitor costs**: Track usage and costs daily
2. **Set limits**: Implement rate limiting per user
3. **Cache responses**: Cache common queries
4. **Handle errors**: Implement retry and fallback
5. **Optimize prompts**: Shorter prompts = lower costs
6. **Use appropriate models**: Don't use GPT-4 for simple tasks

## Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com)
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)

---

**AI integration adds powerful capabilities. Manage costs carefully and always have fallbacks!**
