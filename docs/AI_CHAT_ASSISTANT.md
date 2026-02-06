# AI Chat Assistant

The Logbloga AI Chat Assistant is a site-wide chatbot that helps users learn about our packages, products, and platform. It uses OpenAI's ChatGPT model (gpt-4o-mini) with a retrieval-augmented generation (RAG) approach to ensure factual, non-hallucinated responses.

## Features

- **Fixed floating button** in the bottom-right corner of every page (with faint glow animation)
- **Chat panel** that opens on click, with smooth fade-in, message history, and input
- **Welcome message** — the assistant greets users and asks how it may help
- **Customer service tone** — warm, professional, empathetic responses per industry standards
- **Context-aware answers** drawn from products, FAQs, resources, and package structure
- **Clarification flow** — when inquiries are unclear or outside scope, the AI asks for clarification first; if still unanswerable, offers an inline contact form
- **Inline contact form** — after failed clarification, users can submit a message via `/api/contact` (Resend)
- **Anti-hallucination safeguards** — the model is instructed to answer only from provided context
- **Rate limiting** — 30 requests per minute per user/IP
- **Accessibility** — keyboard navigation (Esc to close), ARIA labels, focus management, respects `prefers-reduced-motion`

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
- **RESEND_API_KEY**, **RESEND_FROM_EMAIL**, **CONTACT_NOTIFICATION_EMAIL** — Used by the inline contact form (same as main contact page). Chat submissions post to `/api/contact` with subject "Chat Assistant - Follow-up".

### Rate Limits

Configured in `lib/security/rate-limit.ts`:

- Type: `chat`
- Default: 30 requests per minute per identifier (IP or user ID)
- Application-layer rate limit is no-op; auth rate limits are enforced by Supabase (Dashboard > Authentication > Rate Limits)

## Architecture

```
Client (ChatWidget) → POST /api/chat → Rate Limit → Knowledge Retrieval → OpenAI Chat Completions
```

- **lib/chat/knowledge-retrieval.ts** — Aggregates and scores context from all sources
- **lib/chat/system-prompt.ts** — Builds the system prompt with anti-hallucination rules
- **lib/chat/openai-client.ts** — Thin wrapper around the OpenAI SDK
- **app/api/chat/route.ts** — API route with validation, rate limiting, and error handling
- **components/chat/chat-widget.tsx** — Floating button and chat panel UI (animations, contact form integration)
- **components/chat/chat-message.tsx** — Message bubbles with Markdown support
- **components/chat/chat-contact-form.tsx** — Compact inline contact form (name, email, message; posts to `/api/contact`)
- **hooks/useChat.ts** — Client-side chat state, welcome message, contact form state, API calls

## Clarification Flow and Contact Form

When the user's inquiry is unclear or outside the assistant's scope:

1. **First time:** The AI asks for clarification (e.g., "Could you tell me more about what you're looking for?")
2. **After clarification:** If the user's follow-up is still outside scope, the AI ends its response with `[OFFER_CONTACT_FORM]` (exact string, on its own line).
3. **API behavior:** The chat route parses responses for this marker, strips it, and returns `showContactForm: true`.
4. **Client:** When `showContactForm` is true, an inline contact form is rendered. On successful submit, the form dismisses and a confirmation message is appended. Submissions go to `/api/contact` with subject "Chat Assistant - Follow-up" and use the same Resend configuration as the main contact page.

## Updating the System Prompt

Edit `lib/chat/system-prompt.ts`. The `buildSystemPrompt(context)` function receives the retrieved context and returns the full system message. Key sections:

- **TONE & STYLE** — Customer service guidelines (warm, professional, empathetic, clear)
- **CRITICAL RULES** — Context-only answers, no fabrication, Markdown links, stay on-topic
- **CLARIFICATION FLOW** — First ask for clarification; if still unanswerable, end with `[OFFER_CONTACT_FORM]`

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
