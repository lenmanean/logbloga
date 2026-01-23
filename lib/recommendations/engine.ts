/**
 * Recommendation Engine
 * Main entry point for product recommendations
 * Combines multiple algorithms and ranks results
 */

import type { Product } from '@/lib/types/database';
import { getProductById } from '@/lib/db/products';
import { getPackageProducts } from '@/lib/db/package-products';
import {
  getRuleBasedRecommendations,
  getCollaborativeRecommendations,
  getContentBasedRecommendations,
  getPopularRecommendations,
  getBundleRecommendations,
  getUpsellRecommendations,
  type RecommendationResult,
} from './algorithms';

export type RecommendationType = 'upsell' | 'cross-sell' | 'related';

export interface RecommendationOptions {
  types?: RecommendationType[];
  limit?: number;
  excludeProductIds?: string[];
  userId?: string;
}

export interface RecommendationContext {
  cartItems?: string[];
  userOrders?: string[];
  category?: string;
}

/**
 * Get recommendations for a product
 * Combines multiple algorithms and returns ranked results
 */
export async function getRecommendations(
  productId: string,
  options: RecommendationOptions = {}
): Promise<RecommendationResult[]> {
  const {
    types = ['related', 'cross-sell', 'upsell'],
    limit = 10,
    excludeProductIds = [],
    userId,
  } = options;

  // Fetch the product to get context
  const product = await getProductById(productId);
  if (!product) {
    return [];
  }

  // If product is a package, get included products to exclude from recommendations
  let includedProductIds: string[] = [];
  if ((product as any).product_type === 'package') {
    try {
      const packageProducts = await getPackageProducts(productId);
      includedProductIds = packageProducts
        .map(pp => pp.product_id)
        .filter((id): id is string => id !== null && id !== undefined);
    } catch (error) {
      console.error('Error fetching package products for recommendations:', error);
      // Continue without excluding if there's an error
    }
  }

  // Combine included products with explicitly excluded products
  const allExcludedIds = [
    ...excludeProductIds,
    ...includedProductIds,
    productId, // Always exclude the current product
  ];

  const allRecommendations: RecommendationResult[] = [];

  // Rule-based recommendations (highest priority)
  if (types.includes('upsell')) {
    const upsells = await getUpsellRecommendations(productId, limit);
    allRecommendations.push(...upsells);
  }

  if (types.includes('cross-sell')) {
    const crossSells = await getRuleBasedRecommendations(productId, 'cross-sell', limit);
    allRecommendations.push(...crossSells);
  }

  if (types.includes('related')) {
    const related = await getRuleBasedRecommendations(productId, 'related', limit);
    allRecommendations.push(...related);
  }

  // Collaborative filtering (frequently bought together)
  if (types.includes('cross-sell') || types.includes('related')) {
    const collaborative = await getCollaborativeRecommendations(productId, limit);
    allRecommendations.push(...collaborative);
  }

  // Content-based recommendations (similar products)
  if (types.includes('related')) {
    const contentBased = await getContentBasedRecommendations(product, limit);
    allRecommendations.push(...contentBased);
  }

  // If we don't have enough recommendations, add popular products as fallback
  if (allRecommendations.length < limit) {
    const popular = await getPopularRecommendations(
      product.category || undefined,
      allExcludedIds,
      limit - allRecommendations.length
    );
    allRecommendations.push(...popular);
  }

  // Deduplicate by product ID, keeping the highest scored version
  const productMap = new Map<string, RecommendationResult>();
  allRecommendations.forEach((rec) => {
    const existing = productMap.get(rec.product.id);
    if (!existing || rec.score > existing.score) {
      productMap.set(rec.product.id, rec);
    }
  });

  // Filter out excluded products (including included products if this is a package)
  const filtered = Array.from(productMap.values()).filter(
    (rec) => !allExcludedIds.includes(rec.product.id)
  );

  // Rank and return top results
  return rankRecommendations(filtered, { category: product.category || undefined }).slice(0, limit);
}

/**
 * Rank recommendations based on score and context
 */
export function rankRecommendations(
  recommendations: RecommendationResult[],
  context?: RecommendationContext
): RecommendationResult[] {
  return recommendations
    .map((rec) => {
      let finalScore = rec.score;

      // Boost score for products in same category as context
      if (context?.category && rec.product.category === context.category) {
        finalScore += 5;
      }

      // Boost score if product is featured
      if (rec.product.featured) {
        finalScore += 10;
      }

      // Boost rule-based recommendations (they're manually curated)
      if (rec.source === 'rule-based') {
        finalScore += 15;
      }

      return {
        ...rec,
        score: Math.min(finalScore, 100), // Cap at 100
      };
    })
    .sort((a, b) => {
      // Primary sort: score (descending)
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      // Secondary sort: featured status
      if (a.product.featured !== b.product.featured) {
        return a.product.featured ? -1 : 1;
      }

      // Tertiary sort: creation date (newer first)
      const aDate = new Date(a.product.created_at || 0).getTime();
      const bDate = new Date(b.product.created_at || 0).getTime();
      return bDate - aDate;
    });
}

/**
 * Get recommendations for checkout (based on cart items)
 */
export async function getCheckoutRecommendations(
  cartProductIds: string[],
  limit: number = 5
): Promise<RecommendationResult[]> {
  if (cartProductIds.length === 0) {
    return [];
  }

  const allRecommendations: RecommendationResult[] = [];

  // For each product in cart, get cross-sell recommendations
  for (const productId of cartProductIds.slice(0, 3)) {
    // Limit to first 3 products to avoid too many recommendations
    const crossSells = await getRuleBasedRecommendations(productId, 'cross-sell', 3);
    allRecommendations.push(...crossSells);

    const collaborative = await getCollaborativeRecommendations(productId, 3);
    allRecommendations.push(...collaborative);
  }

  // Deduplicate and rank
  const productMap = new Map<string, RecommendationResult>();
  allRecommendations.forEach((rec) => {
    const existing = productMap.get(rec.product.id);
    if (!existing || rec.score > existing.score) {
      productMap.set(rec.product.id, rec);
    }
  });

  // Filter out products already in cart
  const filtered = Array.from(productMap.values()).filter(
    (rec) => !cartProductIds.includes(rec.product.id)
  );

  return rankRecommendations(filtered).slice(0, limit);
}

/**
 * Get post-purchase recommendations (based on purchased items)
 */
export async function getPostPurchaseRecommendations(
  purchasedProductIds: string[],
  limit: number = 6
): Promise<RecommendationResult[]> {
  if (purchasedProductIds.length === 0) {
    return [];
  }

  const allRecommendations: RecommendationResult[] = [];

  // Get recommendations for each purchased product
  for (const productId of purchasedProductIds.slice(0, 3)) {
    const related = await getRuleBasedRecommendations(productId, 'related', 4);
    allRecommendations.push(...related);

    const crossSells = await getRuleBasedRecommendations(productId, 'cross-sell', 4);
    allRecommendations.push(...crossSells);
  }

  // Deduplicate
  const productMap = new Map<string, RecommendationResult>();
  allRecommendations.forEach((rec) => {
    const existing = productMap.get(rec.product.id);
    if (!existing || rec.score > existing.score) {
      productMap.set(rec.product.id, rec);
    }
  });

  // Filter out already purchased products
  const filtered = Array.from(productMap.values()).filter(
    (rec) => !purchasedProductIds.includes(rec.product.id)
  );

  return rankRecommendations(filtered).slice(0, limit);
}

/**
 * Get bundle recommendations
 */
export async function getBundleRecommendationsForProduct(
  productId: string,
  limit: number = 5
): Promise<RecommendationResult[]> {
  return getBundleRecommendations(productId, limit);
}

