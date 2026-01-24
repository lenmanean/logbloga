/**
 * Descriptive titles for each package level.
 * Reflects the outcome/difficulty and what the user will create at each level.
 */

export const packageLevelTitles: Record<
  string,
  { level1: string; level2: string; level3: string }
> = {
  'web-apps': {
    level1: 'Landing Page / Simple Web App',
    level2: 'SaaS MVP Application',
    level3: 'Enterprise SaaS Platform',
  },
  'social-media': {
    level1: 'Personal Brand / Content Creator',
    level2: 'Social Media Management Service',
    level3: 'Full-Service Social Media Agency',
  },
  agency: {
    level1: 'Solo Agency / Freelance+',
    level2: 'Small Team Agency',
    level3: 'Established Multi-Service Agency',
  },
  freelancing: {
    level1: 'Part-Time Freelance Side Hustle',
    level2: 'Full-Time Freelance Business',
    level3: 'Premium Freelance Consultant',
  },
};

export function getLevelTitle(
  packageSlug: string,
  levelNumber: 1 | 2 | 3
): string {
  return (
    packageLevelTitles[packageSlug]?.[`level${levelNumber}`] ||
    `Level ${levelNumber}`
  );
}
