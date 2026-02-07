# OpenAI and Anthropic in Logbloga Packages

Logbloga packages use OpenAI (GPT) and Anthropic (Claude) in two ways: as **development aids** (Cursor, ChatGPT, Copilot) and as **product features** (APIs in your app).

## Where they appear

- **Web Apps**: Level 1–2 use ChatGPT, Cursor, GitHub Copilot for building. Level 3 adds OpenAI and Anthropic **APIs** inside your SaaS (see [AI Integration Guide](https://platform.openai.com/docs) and [Anthropic docs](https://docs.anthropic.com)).
- **Social Media / Agency / Freelancing**: ChatGPT and Claude are used for content, positioning, and client work as described in each package’s AI Leverage section.

## Keys and setup

- **OpenAI**: [platform.openai.com](https://platform.openai.com) → API Keys. Use in `.env` as `OPENAI_API_KEY`.
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com) → API Keys. Use as `ANTHROPIC_API_KEY`.

For full integration steps and code patterns, use the **AI Integration Guide** and **AI Integration Examples** in the Web Apps package (Level 3).
