# Prompt Examples

Example prompts you can pass to `generateContent()` in `basic-service.ts`. Use these in your app or in a small runner script (e.g. with `tsx`).

## Example 1: Summarize

```ts
import { generateContent } from './basic-service';

const result = await generateContent(
  'Summarize the following in 2–3 sentences: [Your text here]',
  'openai'
);
console.log(result);
```

## Example 2: Generate a tagline

```ts
const result = await generateContent(
  'Generate a short tagline for a SaaS product that helps teams manage tasks.',
  'anthropic'
);
```

## Example 3: Extract key points

```ts
const result = await generateContent(
  'Extract 3 key points from this paragraph: [Your paragraph]. Return as a bullet list.',
  'openai'
);
```

## Environment

Copy `.env.example` to `.env.local` (or `.env`) and add your `OPENAI_API_KEY` and `ANTHROPIC_API_KEY`. Never commit real keys.
