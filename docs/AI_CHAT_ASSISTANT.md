# AI Chat Assistant

The Logbloga AI Chat Assistant is a site-wide chatbot that helps users learn about our packages, products, and platform. It uses OpenAI's ChatGPT model (gpt-4o-mini) with a retrieval-augmented generation (RAG) approach to ensure factual, non-hallucinated responses.

## Features

- **Fixed floating button** in the bottom-right corner of every page
- **Chat panel** that opens on click, with message history and input
- **Context-aware answers** drawn from products, FAQs, resources, and package structure
- **Anti-hallucination safeguards** — the model is instructed to answer only from provided context
- **Rate limiting** — 30 requests per minute per user/IP
- **Accessibility** — keyboard navigation (Esc to close), ARIA labels, focus management

## Knowledge Sources

The assistant retrieves context from:

1. **Products & packages** — `lib/products.ts` (packageProducts, categories), including Master Bundle
2. **Package content structure** — `lib/data/package-level-content.ts`, `lib/data/package-level-titles.ts`
3. **FAQs** — `lib/resources/faq.ts` (prioritized by relevance to the user query)
4. **Resources** — Case studies and tools from `lib/resources/case-studies.ts`, `lib/resources/tools.ts`
5. **Site structure** — Canonical URLs for packages, resources, about, contact, etc.

## Configuration

### Environment Variables

- **OPENAI_API_KEY** (required for chat) — Your OpenAI API key. Set in `.env.local`. Without it, the chat API returns 503.

### Rate Limits

Configured in `lib/security/rate-limit.ts`:

- Type: `chat`
- Default: 30 requests per minute per identifier (IP or user ID)
- Uses Upstash Redis when configured; otherwise rate limiting is skipped

## Architecture

```
Client (ChatWidget) → POST /api/chat → Rate Limit → Knowledge Retrieval → OpenAI Chat Completions
```

- **lib/chat/knowledge-retrieval.ts** — Aggregates and scores context from all sources
- **lib/chat/system-prompt.ts** — Builds the system prompt with anti-hallucination rules
- **lib/chat/openai-client.ts** — Thin wrapper around the OpenAI SDK
- **app/api/chat/route.ts** — API route with validation, rate limiting, and error handling
- **components/chat/chat-widget.tsx** — Floating button and chat panel UI
- **components/chat/chat-message.tsx** — Message bubbles with Markdown support
- **hooks/useChat.ts** — Client-side chat state and API calls

## Updating the System Prompt

Edit `lib/chat/system-prompt.ts`. The `buildSystemPrompt(context)` function receives the retrieved context and returns the full system message. Key rules:

1. Only answer from the provided context
2. Never fabricate product names, prices, or URLs
3. When unsure, direct users to /ai-to-usd or /contact
4. Format links as Markdown `[text](/path)`
5. Stay on-topic (Logbloga packages/products only)

## Adding New Context

To include new data in the assistant's knowledge base:

1. Add the data source in `lib/chat/knowledge-retrieval.ts`
2. Create a new `build*Context()` function or extend an existing one
3. Call it from `retrieveKnowledgeContext()` and append to the context string
4. Keep total context under ~28K characters (approx. 8K tokens) to stay within model limits

## Security

- API key is server-side only; never exposed to the client
- Input validation via Zod (max 20 messages, 2000 chars per message)
- Output sanitization (removeControlCharacters)
- Client renders Markdown with react-markdown; internal links use Next.js Link
- Rate limiting prevents abuse and cost overruns

## Model

Currently uses **gpt-4o-mini** for cost-effectiveness. To switch to gpt-4o for higher quality, update `lib/chat/openai-client.ts`.
