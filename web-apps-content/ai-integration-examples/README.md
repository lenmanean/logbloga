# AI Integration Examples

Code examples and patterns for integrating AI services (OpenAI, Anthropic) into your SaaS.

## Features

- **Basic AI Service** (`basic-service.ts`) — Single abstraction for OpenAI and Anthropic; one function `generateContent(prompt, provider)`.
- **Prompt examples** (`prompt-examples.md`) — Sample prompts and how to pass them to `generateContent`.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key and/or Anthropic API key

### Installation

1. Extract this folder to your project or use the files as reference.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your API keys to `.env.local`:
   - `OPENAI_API_KEY` — from [OpenAI](https://platform.openai.com/api-keys)
   - `ANTHROPIC_API_KEY` — from [Anthropic](https://console.anthropic.com/)

4. Use in your app:
   - Import `generateContent` from `basic-service.ts` in your API routes or server code.
   - Never expose API keys to the client; call AI only from the server.

   Or run a quick test with `tsx` (install globally or via npx):
   ```bash
   npx tsx -e "require('dotenv').config({ path: '.env.local' }); const { generateContent } = require('./basic-service.ts'); generateContent('Say hello in one word.').then(console.log);"
   ```
   (Adjust for ESM/TS as needed; the examples are meant to be copied into your Next.js app.)

## Examples Included

1. **Basic AI Service** (`basic-service.ts`) — OpenAI and Anthropic integration with a single `generateContent(prompt, provider)` function. Supports both providers; use in API routes or server actions.

2. **Prompt examples** (`prompt-examples.md`) — Sample prompts (summarize, tagline, extract key points) and how to pass them to `generateContent`.

## Usage

- **Server-only**: Use `basic-service.ts` in Next.js API routes, Server Actions, or other server code. Do not import it in client components.
- **Env**: Keep `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` in `.env.local` (or your server env); never commit them.
- **Cost**: Both providers charge per token; start with small `max_tokens` and add usage/cost tracking as you scale.

For more detail on patterns, cost management, and prompts, see the Web Apps Level 3 **ai-integration-guide.md** in the package.

## Support

Refer to the Web Apps Level 3 guides for detailed documentation and best practices.

## License

These examples are provided as-is for use with the Web Apps package.
