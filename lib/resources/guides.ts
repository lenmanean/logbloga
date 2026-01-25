/**
 * Guides data
 * Step-by-step tutorials and comprehensive guides
 */

import type { Guide } from './types';

export const guides: Guide[] = [];

/**
 * Get guide by slug
 */
export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find(guide => guide.slug === slug);
}

/**
 * Get guides by category
 */
export function getGuidesByCategory(category: string): Guide[] {
  return guides.filter(guide => guide.category === category);
}

/**
 * Get guides by tag
 */
export function getGuidesByTag(tag: string): Guide[] {
  return guides.filter(guide => guide.tags.includes(tag));
}

/**
 * Get guides by difficulty
 */
export function getGuidesByDifficulty(difficulty: Guide['difficulty']): Guide[] {
  return guides.filter(guide => guide.difficulty === difficulty);
}

/**
 * Search guides
 */
export function searchGuides(query: string): Guide[] {
  const lowerQuery = query.toLowerCase();
  return guides.filter(guide =>
    guide.title.toLowerCase().includes(lowerQuery) ||
    guide.description.toLowerCase().includes(lowerQuery) ||
    guide.content.toLowerCase().includes(lowerQuery) ||
    guide.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(guides.map(guide => guide.category)));
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  return Array.from(new Set(guides.flatMap(guide => guide.tags)));
}
