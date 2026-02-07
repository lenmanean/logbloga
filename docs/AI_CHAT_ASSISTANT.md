# AI Chat Assistant

The Logbloga AI Chat Assistant is a **gated** chatbot for signed-in users who have purchased at least one package. It uses OpenAI's gpt-4o-mini with **vector RAG** (retrieval-augmented generation) so answers are grounded in Logbloga content, package materials, and platform docs. It is marketed as an included benefit of each package ("A personalized chat assistant to assist in your package progress").

## Access control

- **Who can use it:** Only users who are (1) signed in and (2) have purchased at least one package (or the Master Bundle). Entitlement is checked via `lib/db/access.ts` (`userHasAnyPackageAccess`, `getOwnedPackageSlugs`).
- **Chat API:** `POST /api/chat` requires auth; returns 401 if not signed in, 403 if signed in but no package purchase.
- **Entitlement API:** `GET /api/chat/entitlement` returns `{ canUse: boolean }` for the current user. Used by the client to show the chat widget only when entitled; otherwise a CTA is shown ("Sign in and purchase a package to unlock your personal assistant").

## Features

- **Floating button** in the bottom-right (only after auth and entitlement are known). When not entitled, opening the panel shows a CTA with sign-in and package links.
- **Chat panel** with message history, input, and Markdown rendering. Links use relative paths or sanitized external URLs.
- **Welcome message** positions the assistant as the guide to Logbloga, the user's packages, and the tools used in packages.
- **Vector RAG** — context is built from shared content (site structure, products, FAQs, resources) plus **package-scoped** similarity search over `chat_embeddings`. Only chunks for packages the user owns (and shared platform docs) are retrieved.
- **Conversational tone** — system prompt instructs short, concise responses (2–4 sentences or brief bullets); no long-winded replies.
- **Clarification flow** — if the inquiry is unclear or out of scope, the AI asks for clarification once; if still unanswerable, it offers the inline contact form via `[OFFER_CONTACT_FORM]`.
- **Escalation** — inline contact form posts to `/api/contact` with subject "Chat Assistant - Follow-up". Optional `chat_context` (last user question, last assistant reply) is sent so support sees the conversation; it is stored in `contact_submissions.metadata` and included in the notification email.
- **Rate limiting** — 30 requests per minute per identifier (chat type).
- **Accessibility** — keyboard (Esc to close), ARIA labels, focus management, `prefers-reduced-motion`.

## Knowledge sources

1. **Shared context** (always included): site structure, products/categories, FAQs (relevance-ranked), case studies, tools. Built in `lib/chat/knowledge-retrieval.ts`.
2. **Vector store** (`chat_embeddings`): Chunks from package markdown (per-package) and curated platform docs (`docs/chat-platforms/*.md`). Retrieved by semantic similarity; filtered by **owned package slugs** so users only get content for packages they purchased (plus `shared` content for platform docs).

## Vector RAG

- **Table:** `chat_embeddings` (migration `000058_chat_embeddings.sql`). Columns: content_hash, package_slug, source_type, source_id, chunk_index, content, embedding (vector(1536)), created_at. Index: HNSW on embedding for cosine similarity.
- **RPC:** `match_chat_embeddings(query_embedding, package_slugs[], match_count)` returns the top-N chunks from owned packages or `shared`.
- **Retrieval:** `lib/chat/vector-retrieval.ts` — `queryVectorStore(query, ownedPackageSlugs, limit)` embeds the query with OpenAI text-embedding-3-small and calls the RPC. Used by `retrieveKnowledgeContext(query, userId)` when `userId` is set.
- **Ingest:** `scripts/ingest-chat-embeddings.ts` chunks package `.md` files (from repo dirs `web-apps-content/`, etc.) and `docs/chat-platforms/*.md`, embeds with text-embedding-3-small, and inserts into `chat_embeddings`. Idempotent (skips by content_hash). After deploying the migration, run once to populate the vector store (e.g. from CI or a one-off run with production env vars): `npm run chat:ingest`. Requires OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY. Re-run when package or platform docs change.

## Configuration

### Environment variables

- **OPENAI_API_KEY** — Required for chat and for ingest. Without it, the chat API returns 503.
- **RESEND_API_KEY**, **RESEND_FROM_EMAIL**, **CONTACT_NOTIFICATION_EMAIL** — Inline contact form uses `/api/contact` (same as main contact page).
- **NEXT_PUBLIC_SUPABASE_URL**, **SUPABASE_SERVICE_ROLE_KEY** — For ingest script and server-side vector/access.

### Rate limits

- Chat: type `chat`, 30/min (see `lib/security/rate-limit.ts`; implementation may be no-op until enforced).
- Contact: type `public` for the escalation form.

## Architecture

```
Client: ChatWidget (useAuth, entitlement fetch) → only if canUse: chat panel + useChat
         useChat → POST /api/chat (with cookies)
API:     POST /api/chat → requireAuth → userHasAnyPackageAccess → retrieveKnowledgeContext(query, userId)
         retrieveKnowledgeContext → getOwnedPackageSlugs(userId) + queryVectorStore + shared context
         → buildSystemPrompt(context) → OpenAI Chat Completions
         GET /api/chat/entitlement → requireAuth → userHasAnyPackageAccess → { canUse }
```

- **lib/db/access.ts** — `userHasAnyPackageAccess`, `getOwnedPackageSlugs`, `getUserProductAccess`
- **lib/chat/knowledge-retrieval.ts** — Shared context builders + vector retrieval when userId present
- **lib/chat/vector-retrieval.ts** — `queryVectorStore`, query embedding
- **lib/chat/system-prompt.ts** — Oracle role, conciseness, links, clarification and `[OFFER_CONTACT_FORM]`
- **app/api/chat/route.ts** — Auth, entitlement, rate limit, sanitization, marker strip
- **app/api/chat/entitlement/route.ts** — GET entitlement for client
- **components/chat/chat-widget.tsx** — Button visibility, CTA vs chat panel, contact form with chatContext
- **components/chat/chat-contact-form.tsx** — Sends chat_context when provided

## Escalation (contact form with chat context)

When the AI cannot answer after clarification it appends `[OFFER_CONTACT_FORM]`. The client shows the inline contact form. The form can receive `chatContext: { lastUserMessage, lastAssistantMessage }` from the parent and sends it in the POST body as `chat_context`. The contact API validates and stores it in `contact_submissions.metadata` (source: 'chat', lastUserMessage, lastAssistantMessage) and passes `chatContext` to the notification email template so support sees the user's question and last assistant reply. Security: honeypot, Zod validation, rate limit; no logging of full message/metadata.

## Updating the system prompt

Edit `lib/chat/system-prompt.ts`. Sections: role and scope (definitive source for Logbloga, packages, platform docs); tone (concise, conversational); critical rules (context-only, links, no off-topic); clarification flow and `[OFFER_CONTACT_FORM]`.

## Adding content for RAG

- **Package markdown:** Add or edit files in `web-apps-content/`, `agency-content/`, etc. Run `npm run chat:ingest` to re-chunk and re-embed (idempotent for unchanged chunks).
- **Platform docs:** Add short, Logbloga-specific `.md` files under `docs/chat-platforms/`. Ingest gives them `package_slug: 'shared'` and `source_type: 'platform_doc'` so all entitled users can get them in retrieval.

## Security

- API key and Supabase service role are server-side only.
- Chat and entitlement require a valid session; chat additionally requires package access.
- Input validation (Zod), output sanitization, rate limiting. Contact form: honeypot and validated chat_context length (500 chars per field).

## Model

Chat uses **gpt-4o-mini**. Embeddings use **text-embedding-3-small** (1536 dimensions). To change the chat model, update `lib/chat/openai-client.ts`.
