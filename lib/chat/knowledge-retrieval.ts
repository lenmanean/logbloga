/**
 * Knowledge retrieval for AI Chat Assistant
 * Aggregates products, FAQs, resources, and package content for RAG-style context injection.
 * When userId is provided, vector RAG adds chunks from the user's owned packages and shared platform docs.
 */

import { packageProducts, categories } from '@/lib/products';
import { faqs } from '@/lib/resources/faq';
import { caseStudies } from '@/lib/resources/case-studies';
import { tools } from '@/lib/resources/tools';
import { packageLevelTitles } from '@/lib/data/package-level-titles';
import { packageLevelContent } from '@/lib/data/package-level-content';
import { getOwnedPackageSlugs } from '@/lib/db/access';
import { queryVectorStore } from '@/lib/chat/vector-retrieval';

// Approximate token limit (~8K tokens ≈ 32K chars). We'll cap context size.
const MAX_CONTEXT_CHARS = 28000;

/**
 * Score relevance of text against a query (simple keyword matching)
 */
function relevanceScore(text: string, query: string): number {
  const lowerText = text.toLowerCase();
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
  let score = 0;
  for (const word of words) {
    if (lowerText.includes(word)) {
      score += word.length > 3 ? 2 : 1;
    }
  }
  return score;
}

/**
 * Build products/packages context section
 */
function buildProductsContext(_query: string): string {
  const lines: string[] = ['## Packages & Products\n'];

  // Include Master Bundle
  lines.push(
    '- Master Bundle: All four packages (Web Apps, Social Media, Agency, Freelancing). 145+ hours of content. URL: /ai-to-usd/packages/master-bundle'
  );

  for (const pkg of packageProducts) {
    const url = `/ai-to-usd/packages/${pkg.slug}`;
    lines.push(
      `- ${pkg.title} (slug: ${pkg.slug}): ${pkg.description}. Price: $${pkg.price} (original $${pkg.originalPrice}). Content: ${pkg.contentHours}. Tagline: ${pkg.tagline}. URL: ${url}`
    );
  }

  lines.push('\n## Categories');
  for (const cat of categories) {
    lines.push(`- ${cat.name} (${cat.id}): ${cat.description}. URL: ${cat.href}`);
  }

  return lines.join('\n');
}

/**
 * Build FAQs context section (prioritize by relevance)
 */
function buildFAQsContext(query: string): string {
  const scored = faqs.map((faq) => ({
    faq,
    score:
      relevanceScore(faq.question, query) * 2 +
      relevanceScore(faq.answer, query) +
      faq.tags.reduce((s, t) => s + relevanceScore(t, query), 0),
  }));
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 12).map(({ faq }) => faq);

  const lines: string[] = ['## FAQs\n'];
  const faqBase = '/resources/faq';
  for (const faq of top) {
    lines.push(`- Q: ${faq.question}\n  A: ${faq.answer}\n  URL: ${faqBase}#${faq.id}`);
  }
  return lines.join('\n');
}

/**
 * Build resources context (case studies, tools)
 */
function buildResourcesContext(query: string): string {
  const lines: string[] = ['## Resources\n'];

  for (const study of caseStudies) {
    const url = `/resources/case-studies/${study.slug}`;
    const score =
      relevanceScore(study.title, query) +
      relevanceScore(study.description, query) +
      study.tags.reduce((s, t) => s + relevanceScore(t, query), 0);
    if (score > 0 || lines.length < 8) {
      lines.push(`- Case Study: ${study.title}. ${study.description}. URL: ${url}`);
    }
  }

  for (const tool of tools.slice(0, 8)) {
    const url = `/resources/tools/${tool.slug}`;
    lines.push(`- Tool: ${tool.title}. ${tool.description}. URL: ${url}`);
  }

  return lines.join('\n');
}

/**
 * Build package content structure (level titles, AI leverage, content types)
 */
function buildPackageContentContext(_query: string): string {
  const lines: string[] = ['## Package Structure & Content\n'];

  for (const slug of ['web-apps', 'social-media', 'agency', 'freelancing']) {
    const titles = packageLevelTitles[slug];
    const content = packageLevelContent[slug];
    if (!titles || !content) continue;

    lines.push(`### ${slug} package:`);
    for (const l of [1, 2, 3] as const) {
      const level = content[`level${l}` as keyof typeof content];
      const title = titles[`level${l}` as keyof typeof titles];
      if (level && title) {
        const lev = level as { aiLeverage?: string; implementationPlan?: { description?: string } };
        lines.push(
          `  Level ${l} (${title}): AI Leverage: ${lev.aiLeverage ?? 'N/A'}. Implementation: ${lev.implementationPlan?.description ?? 'N/A'}`
        );
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Build site structure / navigation context
 */
function buildSiteStructureContext(): string {
  return `
## Site Structure
- AI to USD (main packages): /ai-to-usd
- Package pages: /ai-to-usd/packages/web-apps, /ai-to-usd/packages/social-media, /ai-to-usd/packages/agency, /ai-to-usd/packages/freelancing, /ai-to-usd/packages/master-bundle
- Resources: /resources (case studies, tools, FAQ)
- FAQ: /resources/faq
- About: /about
- Contact: /contact
- Blog: /blog
- Checkout: /checkout (requires sign-in)
- Account/Library: /account/library (requires sign-in)
`.trim();
}

/**
 * Retrieve and format knowledge context for a user query.
 * Returns a string suitable for injection into the system prompt.
 * When userId is provided, vector RAG adds content from the user's owned packages and shared platform docs.
 */
export async function retrieveKnowledgeContext(query: string, userId?: string): Promise<string> {
  const sections: string[] = [
    buildSiteStructureContext(),
    buildProductsContext(query),
    buildFAQsContext(query),
    buildResourcesContext(query),
    buildPackageContentContext(query),
  ];

  if (userId) {
    try {
      const ownedSlugs = await getOwnedPackageSlugs(userId);
      const vectorChunks = await queryVectorStore(query, ownedSlugs, 15);
      if (vectorChunks.length > 0) {
        const vectorSection =
          '## Retrieved package and platform content\n\n' +
          vectorChunks.map((c) => c.content.trim()).join('\n\n---\n\n');
        sections.push(vectorSection);
      }
    } catch (err) {
      console.error('Vector retrieval failed, using shared context only:', err);
    }
  }

  let context = sections.join('\n\n');
  if (context.length > MAX_CONTEXT_CHARS) {
    context = context.slice(0, MAX_CONTEXT_CHARS) + '\n\n[Context truncated for length.]';
  }
  return context;
}
