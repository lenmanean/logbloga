export type ProductCategory = 'web-apps' | 'social-media' | 'agency' | 'freelancing';

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  featured: boolean;
  image?: string;
  duration?: string;
}

// Package Level Structure (migration 000027)
export interface PackageLevelContent {
  file: string;
  type: string;
  description: string;
  platform?: string; // For platform guides
  name?: string; // For creative frameworks and templates
}

// Schedule/Timeline item for trackable progress
export interface PackageLevelScheduleItem {
  date: string; // "YYYY-MM-DD" format
  milestone: string; // Milestone description
  tasks: string[]; // Array of tasks for this milestone
  completed?: boolean; // Track completion status
  order?: number; // Display order
}

export interface PackageLevel {
  level: 1 | 2 | 3;
  timeInvestment: string; // "2-3 Weeks"
  expectedProfit: string; // "$500-$1,500/month"
  platformCosts: string; // "$0-50/month"
  aiLeverage: string; // Comprehensive description of AI tools used and how they drive revenue
  schedule: PackageLevelScheduleItem[]; // Trackable timeline/schedule
  implementationPlan: PackageLevelContent;
  platformGuides: PackageLevelContent[];
  creativeFrameworks: PackageLevelContent[];
  templates: PackageLevelContent[];
}

export interface PackageLevels {
  level1?: PackageLevel;
  level2?: PackageLevel;
  level3?: PackageLevel;
}

export interface PackageVariant {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
}

export interface PackageProduct extends Product {
  packageImage: string;
  images?: string[];
  tagline: string;
  levels?: PackageLevels;
  pricingJustification: string;
  contentHours: string;
  slug: string;
  variants?: PackageVariant[];
}

export interface Category {
  id: ProductCategory;
  name: string;
  description: string;
  icon: string;
  productCount: number;
  href: string;
}

export const categories: Category[] = [
  {
    id: 'web-apps',
    name: 'Web Apps',
    description: 'Build powerful web applications with AI assistance',
    icon: 'Globe',
    productCount: 1,
    href: '/ai-to-usd/packages/web-apps',
  },
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Grow your social media presence and engagement',
    icon: 'Share2',
    productCount: 1,
    href: '/ai-to-usd/packages/social-media',
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'Scale your agency with AI-powered solutions',
    icon: 'Building2',
    productCount: 1,
    href: '/ai-to-usd/packages/agency',
  },
  {
    id: 'freelancing',
    name: 'Freelancing',
    description: 'Boost your freelancing career and income',
    icon: 'Briefcase',
    productCount: 1,
    href: '/ai-to-usd/packages/freelancing',
  },
];

/** Static package metadata (fallback when DB unavailable); package content fetched from database (levels). */
export const packageProducts: PackageProduct[] = [
  {
    id: 'web-apps-package',
    slug: 'web-apps',
    title: 'Web Apps Package',
    description: 'Build powerful web applications with AI assistance. Transform your skills into profitable web development projects with implementation plans, platform guides, creative frameworks, and production-ready templates.',
    tagline: 'Convert powerful AI solutions into profitable web applications that generate USD revenue',
    category: 'web-apps',
    price: 697,
    originalPrice: 1049,
    featured: true,
    packageImage: '/package-2.png',
    images: ['/package-2.png'],
    duration: 'Self-paced',
    contentHours: '45 files',
    pricingJustification: 'Comprehensive level-based content with 45 files: implementation plans, platform setup guides, creative frameworks, launch checklists, troubleshooting guides, budget worksheets, and code templates (Next.js, Supabase, Stripe). Comparable to bootcamps priced at $2,000-$6,000+. Lifetime access with immediate ROI through templates and tools.'
  },
  {
    id: 'social-media-package',
    slug: 'social-media',
    title: 'Social Media Package',
    description: 'Monetize your AI-driven content by creating profitable social media automation tools. Grow your presence and engagement with implementation plans, platform guides, and templates.',
    tagline: 'Monetize your AI-driven content by creating profitable social media automation tools',
    category: 'social-media',
    price: 397,
    originalPrice: 595,
    featured: true,
    packageImage: '/package-1.png',
    images: ['/package-1.png'],
    duration: 'Self-paced',
    contentHours: '39 files',
    pricingJustification: 'Complete social media package with 39 files: implementation plans, platform setup guides (Buffer, Canva, Later, Hootsuite), creative frameworks, content strategy templates, client reporting templates, and budget planners. Comparable to agency services at $500-$2,000/month. Lifetime access with templates that save 10+ hours/week.'
  },
  {
    id: 'agency-package',
    slug: 'agency',
    title: 'Agency Package',
    description: 'Build a profitable agency selling AI-powered services to business clients. Scale your operations with proven systems, implementation plans, and templates.',
    tagline: 'Build a profitable agency selling AI-powered services to business clients',
    category: 'agency',
    price: 797,
    originalPrice: 1330,
    featured: true,
    packageImage: '/package-3.png',
    images: ['/package-3.png'],
    duration: 'Self-paced',
    contentHours: '40 files',
    pricingJustification: 'Complete agency package with 40 files: implementation plans, platform setup guides (Systeme.io, GoHighLevel, HubSpot, ClickUp), creative frameworks, client onboarding templates, agency operations templates, and budget planners. Comparable to agency coaching programs at $2,000-$10,000+. ROI potential: $10K-$50K+ monthly revenue increase.'
  },
  {
    id: 'freelancing-package',
    slug: 'freelancing',
    title: 'Freelancing Package',
    description: 'Offer your AI expertise as a freelancer to turn automated solutions into USD earnings. Build a successful freelancing career with implementation plans and templates.',
    tagline: 'Offer your AI expertise as a freelancer to turn automated solutions into USD earnings',
    category: 'freelancing',
    price: 397,
    originalPrice: 560,
    featured: true,
    packageImage: '/package-4.png',
    images: ['/package-4.png'],
    duration: 'Self-paced',
    contentHours: '41 files',
    pricingJustification: 'Complete freelancer package with 41 files: implementation plans, platform setup guides (Fiverr, Upwork, Hello Bonsai, Stripe), creative frameworks, proposal and contract templates, and budget planners. ROI potential: $1K-$10K+ monthly income increase. Accessible pricing that pays for itself with 1-2 projects.'
  }
];

