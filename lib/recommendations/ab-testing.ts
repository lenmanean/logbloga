/**
 * A/B Testing Utilities
 * Simple A/B testing infrastructure for recommendation algorithms
 */

export type ABTestVariant = 'A' | 'B' | 'C';

export interface ABTestConfig {
  testId: string;
  variants: ABTestVariant[];
  weights?: number[]; // Probability weights for each variant (default: equal)
}

/**
 * Get or assign A/B test variant for a user
 * Uses localStorage to persist variant assignment
 */
export function getABTestVariant(config: ABTestConfig): ABTestVariant {
  if (typeof window === 'undefined') {
    return config.variants[0]; // Server-side, return default
  }

  const storageKey = `ab_test_${config.testId}`;
  const stored = localStorage.getItem(storageKey);

  if (stored && config.variants.includes(stored as ABTestVariant)) {
    return stored as ABTestVariant;
  }

  // Assign new variant based on weights
  const variant = assignVariant(config);
  localStorage.setItem(storageKey, variant);
  return variant;
}

/**
 * Assign a variant based on weights
 */
function assignVariant(config: ABTestConfig): ABTestVariant {
  const weights = config.weights || config.variants.map(() => 1 / config.variants.length);
  
  // Normalize weights
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const normalizedWeights = weights.map((w) => w / totalWeight);

  // Generate random number
  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < config.variants.length; i++) {
    cumulative += normalizedWeights[i];
    if (random <= cumulative) {
      return config.variants[i];
    }
  }

  // Fallback to first variant
  return config.variants[0];
}

/**
 * Track A/B test conversion
 * Records when a user performs a conversion action
 */
export function trackABTestConversion(
  testId: string,
  variant: ABTestVariant,
  conversionType: string = 'purchase'
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const conversionKey = `ab_test_conversion_${testId}_${variant}_${conversionType}`;
  const conversions = parseInt(localStorage.getItem(conversionKey) || '0', 10);
  localStorage.setItem(conversionKey, String(conversions + 1));
}

/**
 * Get conversion rate for a variant
 */
export function getABTestConversionRate(
  testId: string,
  variant: ABTestVariant,
  conversionType: string = 'purchase'
): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  const conversionKey = `ab_test_conversion_${testId}_${variant}_${conversionType}`;
  const conversions = parseInt(localStorage.getItem(conversionKey) || '0', 10);
  
  // In a real implementation, you'd track views/impressions separately
  // For simplicity, we're just tracking conversions
  // A proper implementation would track: views, clicks, purchases separately
  return conversions;
}

/**
 * Clear A/B test data (for testing purposes)
 */
export function clearABTestData(testId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(`ab_test_${testId}`);
  // Clear all conversion data for this test
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith(`ab_test_conversion_${testId}_`)) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Recommendation algorithm A/B test configuration
 */
export const RECOMMENDATION_AB_TEST_CONFIG: ABTestConfig = {
  testId: 'recommendation_algorithm',
  variants: ['A', 'B'],
  weights: [0.5, 0.5], // 50/50 split
};

/**
 * Get recommendation algorithm variant
 * Variant A: Rule-based + Collaborative (current default)
 * Variant B: Content-based + Popular (alternative)
 */
export function getRecommendationAlgorithmVariant(): ABTestVariant {
  return getABTestVariant(RECOMMENDATION_AB_TEST_CONFIG);
}

