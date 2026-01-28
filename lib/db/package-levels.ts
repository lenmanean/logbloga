/**
 * Package Levels Database Helpers
 *
 * HYBRID CONTENT ARCHITECTURE:
 *
 * Database-stored levels (products.levels JSONB) support 4 categories:
 *   - implementationPlan
 *   - platformGuides
 *   - creativeFrameworks
 *   - templates
 *
 * Static-only categories (package-level-content.ts) are 3 additional:
 *   - launchMarketing
 *   - troubleshooting
 *   - planning
 *
 * The static categories were added after the initial database design and remain
 * in code for simplicity and version control. The getLevelContent() function in
 * package-level-content.ts merges both sources, with database taking precedence
 * for the 4 supported categories.
 *
 * EXTENDING THIS SYSTEM:
 * To add database support for the 3 static categories, you would need to:
 * 1. Update the PackageLevel interface in lib/products.ts
 * 2. Update validatePackageLevel() in this file
 * 3. Update database migration to include new fields
 * 4. Update getLevelContent() merge logic
 *
 * For template replication: This same hybrid approach works for all packages.
 */

import type { PackageLevels, PackageLevel } from '@/lib/products';
import type { Product } from '@/lib/types/database';

/**
 * Parse levels JSONB data from database product
 */
export function parsePackageLevels(product: Product): PackageLevels | null {
  if (!product.levels || typeof product.levels !== 'object') {
    return null;
  }

  try {
    // Handle both direct JSONB and string JSON
    const levelsData = typeof product.levels === 'string' 
      ? JSON.parse(product.levels) 
      : product.levels;

    if (!levelsData || typeof levelsData !== 'object') {
      return null;
    }

    // Validate and return levels structure
    const levels: PackageLevels = {};
    
    if (levelsData.level1) {
      const level1 = validatePackageLevel(levelsData.level1, 1);
      if (level1) {
        levels.level1 = level1;
      }
    }
    if (levelsData.level2) {
      const level2 = validatePackageLevel(levelsData.level2, 2);
      if (level2) {
        levels.level2 = level2;
      }
    }
    if (levelsData.level3) {
      const level3 = validatePackageLevel(levelsData.level3, 3);
      if (level3) {
        levels.level3 = level3;
      }
    }

    // Return null if no valid levels found
    if (!levels.level1 && !levels.level2 && !levels.level3) {
      return null;
    }

    return levels;
  } catch (error) {
    console.error('Error parsing package levels:', error);
    return null;
  }
}

/**
 * Validate a single package level structure
 */
function validatePackageLevel(levelData: any, expectedLevel: 1 | 2 | 3): PackageLevel | null {
  if (!levelData || typeof levelData !== 'object') {
    return null;
  }

  // Ensure level matches expected
  const levelNumber = levelData.level === expectedLevel ? expectedLevel : expectedLevel;

  // Validate required fields
  if (!levelData.timeInvestment || !levelData.expectedProfit || !levelData.platformCosts) {
    console.warn(`Package level ${expectedLevel} missing required fields`);
    return null;
  }

  if (!levelData.aiLeverage || typeof levelData.aiLeverage !== 'string') {
    console.warn(`Package level ${expectedLevel} missing required aiLeverage`);
    return null;
  }

  // Validate implementation plan
  if (!levelData.implementationPlan || typeof levelData.implementationPlan !== 'object') {
    console.warn(`Package level ${expectedLevel} missing implementation plan`);
    return null;
  }

  // NOTE: Only 4 categories validated from database.
  // launchMarketing, troubleshooting, and planning are static-only.
  // See file header for architecture details.

  // Parse schedule (trackable timeline) - default to empty array
  const rawSchedule = levelData.schedule;
  const schedule = Array.isArray(rawSchedule)
    ? rawSchedule
        .filter(
          (s: unknown) =>
            s &&
            typeof s === 'object' &&
            'date' in (s as object) &&
            'milestone' in (s as object)
        )
        .map((s: any) => ({
          date: String(s.date || ''),
          milestone: String(s.milestone || ''),
          tasks: Array.isArray(s.tasks) ? s.tasks.map((t: unknown) => String(t)) : [],
          completed: Boolean(s.completed),
          order: typeof s.order === 'number' ? s.order : undefined,
        }))
    : [];

  // Build validated level
  const validatedLevel: PackageLevel = {
    level: levelNumber,
    timeInvestment: String(levelData.timeInvestment),
    expectedProfit: String(levelData.expectedProfit),
    platformCosts: String(levelData.platformCosts),
    aiLeverage: String(levelData.aiLeverage),
    schedule,
    implementationPlan: {
      file: String(levelData.implementationPlan.file || ''),
      type: String(levelData.implementationPlan.type || 'pdf'),
      description: String(levelData.implementationPlan.description || ''),
    },
    platformGuides: Array.isArray(levelData.platformGuides)
      ? levelData.platformGuides.map((guide: any) => ({
          file: String(guide.file || ''),
          type: String(guide.type || 'pdf'),
          description: String(guide.description || ''),
          platform: guide.platform ? String(guide.platform) : undefined,
        }))
      : [],
    creativeFrameworks: Array.isArray(levelData.creativeFrameworks)
      ? levelData.creativeFrameworks.map((framework: any) => ({
          file: String(framework.file || ''),
          type: String(framework.type || 'pdf'),
          description: String(framework.description || ''),
          name: framework.name ? String(framework.name) : undefined,
        }))
      : [],
    templates: Array.isArray(levelData.templates)
      ? levelData.templates.map((template: any) => ({
          file: String(template.file || ''),
          type: String(template.type || 'pdf'),
          description: String(template.description || ''),
          name: template.name ? String(template.name) : undefined,
        }))
      : [],
  };

  return validatedLevel;
}

/**
 * Check if a product has level-based structure
 */
export function hasPackageLevels(product: Product): boolean {
  const levels = parsePackageLevels(product);
  return levels !== null && !!(levels.level1 || levels.level2 || levels.level3);
}

/**
 * Get a specific level from package
 */
export function getPackageLevel(product: Product, levelNumber: 1 | 2 | 3): PackageLevel | null {
  const levels = parsePackageLevels(product);
  if (!levels) {
    return null;
  }

  switch (levelNumber) {
    case 1:
      return levels.level1 || null;
    case 2:
      return levels.level2 || null;
    case 3:
      return levels.level3 || null;
    default:
      return null;
  }
}

/**
 * Get all available levels for a package
 */
export function getAvailableLevels(product: Product): Array<{ level: 1 | 2 | 3; data: PackageLevel }> {
  const levels = parsePackageLevels(product);
  if (!levels) {
    return [];
  }

  const available: Array<{ level: 1 | 2 | 3; data: PackageLevel }> = [];
  
  if (levels.level1) {
    available.push({ level: 1, data: levels.level1 });
  }
  if (levels.level2) {
    available.push({ level: 2, data: levels.level2 });
  }
  if (levels.level3) {
    available.push({ level: 3, data: levels.level3 });
  }

  return available;
}
