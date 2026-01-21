/**
 * Unified search and filter utilities for all resources
 * Provides cross-resource search and filtering capabilities
 */

import type { SearchResult } from './types';
import { guides, searchGuides } from './guides';
import { caseStudies, searchCaseStudies } from './case-studies';
import { tools, searchTools } from './tools';
import { faqs, searchFAQs } from './faq';

/**
 * Search across all resource types
 */
export function searchAllResources(query: string): SearchResult[] {
  const results: SearchResult[] = [];

  // Search guides
  const guideResults = searchGuides(query);
  guideResults.forEach(guide => {
    results.push({
      type: 'guide',
      resource: guide,
      relevanceScore: calculateRelevanceScore(guide, query)
    });
  });

  // Search case studies
  const caseStudyResults = searchCaseStudies(query);
  caseStudyResults.forEach(study => {
    results.push({
      type: 'case-study',
      resource: study,
      relevanceScore: calculateRelevanceScore(study, query)
    });
  });

  // Search tools
  const toolResults = searchTools(query);
  toolResults.forEach(tool => {
    results.push({
      type: 'tool',
      resource: tool,
      relevanceScore: calculateRelevanceScore(tool, query)
    });
  });

  // Search FAQs
  const faqResults = searchFAQs(query);
  faqResults.forEach(faq => {
    results.push({
      type: 'faq',
      resource: faq,
      relevanceScore: calculateRelevanceScore(faq, query)
    });
  });

  // Sort by relevance score (highest first)
  return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
}

/**
 * Filter resources by category across all types
 */
export function filterByCategory(category: string): SearchResult[] {
  const results: SearchResult[] = [];

  // Filter guides
  guides
    .filter(guide => guide.category === category)
    .forEach(guide => {
      results.push({ type: 'guide', resource: guide });
    });

  // Filter case studies
  caseStudies
    .filter(study => study.category === category)
    .forEach(study => {
      results.push({ type: 'case-study', resource: study });
    });

  // Filter tools
  tools
    .filter(tool => tool.category === category)
    .forEach(tool => {
      results.push({ type: 'tool', resource: tool });
    });

  // Filter FAQs
  faqs
    .filter(faq => faq.category === category)
    .forEach(faq => {
      results.push({ type: 'faq', resource: faq });
    });

  return results;
}

/**
 * Filter resources by tag across all types
 */
export function filterByTag(tag: string): SearchResult[] {
  const results: SearchResult[] = [];

  // Filter guides
  guides
    .filter(guide => guide.tags.includes(tag))
    .forEach(guide => {
      results.push({ type: 'guide', resource: guide });
    });

  // Filter case studies
  caseStudies
    .filter(study => study.tags.includes(tag))
    .forEach(study => {
      results.push({ type: 'case-study', resource: study });
    });

  // Filter tools
  tools
    .filter(tool => tool.tags.includes(tag))
    .forEach(tool => {
      results.push({ type: 'tool', resource: tool });
    });

  // Filter FAQs
  faqs
    .filter(faq => faq.tags.includes(tag))
    .forEach(faq => {
      results.push({ type: 'faq', resource: faq });
    });

  return results;
}

/**
 * Get all unique categories across all resource types
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  
  guides.forEach(guide => categories.add(guide.category));
  caseStudies.forEach(study => categories.add(study.category));
  tools.forEach(tool => categories.add(tool.category));
  faqs.forEach(faq => categories.add(faq.category));

  return Array.from(categories).sort();
}

/**
 * Get all unique tags across all resource types
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  
  guides.forEach(guide => guide.tags.forEach(tag => tags.add(tag)));
  caseStudies.forEach(study => study.tags.forEach(tag => tags.add(tag)));
  tools.forEach(tool => tool.tags.forEach(tag => tags.add(tag)));
  faqs.forEach(faq => faq.tags.forEach(tag => tags.add(tag)));

  return Array.from(tags).sort();
}

/**
 * Calculate relevance score for search results
 * Higher score = more relevant
 */
function calculateRelevanceScore(resource: any, query: string): number {
  const lowerQuery = query.toLowerCase();
  let score = 0;

  // Title match (highest weight)
  if (resource.title?.toLowerCase().includes(lowerQuery)) {
    score += 10;
  }

  // Exact title match (even higher)
  if (resource.title?.toLowerCase() === lowerQuery) {
    score += 20;
  }

  // Description match
  if (resource.description?.toLowerCase().includes(lowerQuery)) {
    score += 5;
  }

  // Tag match
  if (resource.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery))) {
    score += 3;
  }

  // Content match (lower weight)
  if (resource.content?.toLowerCase().includes(lowerQuery)) {
    score += 1;
  }

  // Question match (for FAQs)
  if (resource.question?.toLowerCase().includes(lowerQuery)) {
    score += 8;
  }

  // Answer match (for FAQs)
  if (resource.answer?.toLowerCase().includes(lowerQuery)) {
    score += 2;
  }

  return score;
}

/**
 * Get resource URL based on type and slug
 */
export function getResourceUrl(type: SearchResult['type'], slug: string): string {
  const urlMap: Record<SearchResult['type'], string> = {
    'guide': `/resources/guides/${slug}`,
    'case-study': `/resources/case-studies/${slug}`,
    'tool': `/resources/tools/${slug}`,
    'faq': `/resources/faq#${slug}`
  };

  return urlMap[type] || '/resources';
}

/**
 * Get resource type label
 */
export function getResourceTypeLabel(type: SearchResult['type']): string {
  const labelMap: Record<SearchResult['type'], string> = {
    'guide': 'Guide',
    'case-study': 'Case Study',
    'tool': 'Tool',
    'faq': 'FAQ'
  };

  return labelMap[type] || 'Resource';
}
