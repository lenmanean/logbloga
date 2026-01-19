/**
 * Recommendation algorithms
 * Implements various recommendation strategies
 */

import type { Product } from '@/lib/types/database';
import {
  getRecommendationsByProduct,
  getRecommendationsByCategory,
  getFrequentlyBoughtTogether,
  getPopularProducts,
  type RecommendationType,
} from '@/lib/db/recommendations';

export interface RecommendationResult {
  product: Product;
  score: number;
  source: 'rule-based' | 'collaborative' | 'content-based' | 'popular';
  type?: RecommendationType;
}

/**
 * Rule-based recommendations
 * Direct recommendations from product_recommendations table
 */
export async function getRuleBasedRecommendations(
  productId: string,
  type?: RecommendationType,
  limit: number = 10
): Promise<RecommendationResult[]> {
  const recommendations = await getRecommendationsByProduct(productId, type, limit);

  return recommendations.map((product, index) => ({
    product,
    score: 100 - index * 5, // Higher priority = higher score
    source: 'rule-based',
    type: type || 'related',
  }));
}

/**
 * Collaborative filtering recommendations
 * "Frequently bought together" based on order_items analysis
 */
export async function getCollaborativeRecommendations(
  productId: string,
  limit: number = 5
): Promise<RecommendationResult[]> {
  const recommendations = await getFrequentlyBoughtTogether(productId, limit);

  // Score based on frequency (higher frequency = higher score)
  // Since getFrequentlyBoughtTogether already returns sorted by frequency,
  // we assign scores in descending order
  return recommendations.map((product, index) => ({
    product,
    score: 80 - index * 10, // Collaborative filtering gets good but not highest score
    source: 'collaborative',
    type: 'cross-sell' as RecommendationType,
  }));
}

/**
 * Content-based recommendations
 * Similar products by category, price range, and difficulty
 */
export async function getContentBasedRecommendations(
  product: Product,
  limit: number = 10
): Promise<RecommendationResult[]> {
  if (!product.category) {
    return [];
  }

  const categoryProducts = await getRecommendationsByCategory(
    product.category,
    product.id,
    limit * 2 // Get more to filter by similarity
  );

  const productPrice = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
  const priceRange = productPrice * 0.5; // 50% price range

  // Score products based on similarity
  const scoredProducts: RecommendationResult[] = categoryProducts.map((p) => {
    let score = 50; // Base score for same category

    // Price similarity (closer price = higher score)
    const pPrice = typeof p.price === 'number' ? p.price : parseFloat(String(p.price || 0));
    const priceDiff = Math.abs(pPrice - productPrice);
    if (priceDiff <= priceRange) {
      score += 20 - (priceDiff / priceRange) * 10;
    }

    // Difficulty similarity
    if (product.difficulty && p.difficulty && product.difficulty === p.difficulty) {
      score += 10;
    }

    // Featured products get bonus
    if (p.featured) {
      score += 10;
    }

    return {
      product: p,
      score: Math.min(score, 100), // Cap at 100
      source: 'content-based',
      type: 'related' as RecommendationType,
    };
  });

  // Sort by score and return top results
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Popular products recommendations
 * Featured or high-selling items
 */
export async function getPopularRecommendations(
  category?: string,
  excludeProductIds: string[] = [],
  limit: number = 10
): Promise<RecommendationResult[]> {
  const popularProducts = await getPopularProducts(category, limit * 2);

  // Filter out excluded products
  const filtered = popularProducts.filter((p) => !excludeProductIds.includes(p.id));

  // Score based on featured status and recency
  return filtered.slice(0, limit).map((product, index) => ({
    product,
    score: 60 - index * 3, // Featured products get good scores
    source: 'popular',
    type: 'related' as RecommendationType,
  }));
}

/**
 * Bundle recommendations
 * Products that complement each other
 * This is a combination of rule-based and collaborative filtering
 */
export async function getBundleRecommendations(
  productId: string,
  limit: number = 5
): Promise<RecommendationResult[]> {
  // Get cross-sell recommendations (complementary products)
  const crossSells = await getRuleBasedRecommendations(productId, 'cross-sell', limit);

  // Also get frequently bought together
  const collaborative = await getCollaborativeRecommendations(productId, limit);

  // Combine and deduplicate
  const productMap = new Map<string, RecommendationResult>();

  // Add cross-sells (higher priority)
  crossSells.forEach((rec) => {
    productMap.set(rec.product.id, { ...rec, type: 'cross-sell' });
  });

  // Add collaborative (if not already present)
  collaborative.forEach((rec) => {
    if (!productMap.has(rec.product.id)) {
      productMap.set(rec.product.id, rec);
    }
  });

  return Array.from(productMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Upsell recommendations
 * Higher-tier versions or premium add-ons
 */
export async function getUpsellRecommendations(
  productId: string,
  limit: number = 3
): Promise<RecommendationResult[]> {
  // Get explicit upsell recommendations from database
  const upsells = await getRuleBasedRecommendations(productId, 'upsell', limit);

  if (upsells.length > 0) {
    return upsells;
  }

  // Fallback: Find products in same category with higher price
  const product = await import('@/lib/db/products').then((m) => m.getProductById(productId));
  if (!product || !product.category) {
    return [];
  }

  const categoryProducts = await getRecommendationsByCategory(product.category, productId, limit * 2);
  const productPrice = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));

  // Filter for products with higher price (potential upsells)
  const upsellCandidates = categoryProducts
    .map((p) => {
      const pPrice = typeof p.price === 'number' ? p.price : parseFloat(String(p.price || 0));
      return { product: p, price: pPrice };
    })
    .filter((p) => p.price > productPrice)
    .sort((a, b) => a.price - b.price) // Sort by price ascending (closest higher price first)
    .slice(0, limit)
    .map((p) => ({
      product: p.product,
      score: 70,
      source: 'content-based' as const,
      type: 'upsell' as RecommendationType,
    }));

  return upsellCandidates;
}

