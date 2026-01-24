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
  rating?: number;
  reviewCount?: number;
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
    productCount: 12,
    href: '/ai-to-usd/packages/web-apps',
  },
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Grow your social media presence and engagement',
    icon: 'Share2',
    productCount: 8,
    href: '/ai-to-usd/packages/social-media',
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'Scale your agency with AI-powered solutions',
    icon: 'Building2',
    productCount: 10,
    href: '/ai-to-usd/packages/agency',
  },
  {
    id: 'freelancing',
    name: 'Freelancing',
    description: 'Boost your freelancing career and income',
    icon: 'Briefcase',
    productCount: 15,
    href: '/ai-to-usd/packages/freelancing',
  },
];

/** Sample product data (fetch packages from database in production). */
export const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'AI-Powered E-Commerce Builder',
    description: 'Create stunning online stores with AI-assisted design and automation',
    category: 'web-apps',
    price: 299,
    originalPrice: 499,
    featured: true,
    duration: '6 weeks',
  },
  {
    id: '2',
    title: 'Social Media Content Generator',
    description: 'Generate engaging posts, captions, and content calendars automatically',
    category: 'social-media',
    price: 149,
    originalPrice: 249,
    featured: true,
    duration: '4 weeks',
  },
  {
    id: '3',
    title: 'Client Management System',
    description: 'Streamline your agency workflow with AI-powered project management',
    category: 'agency',
    price: 399,
    originalPrice: 599,
    featured: true,
    duration: '8 weeks',
  },
  {
    id: '4',
    title: 'Freelancer Portfolio Platform',
    description: 'Build a professional portfolio that attracts high-paying clients',
    category: 'freelancing',
    price: 199,
    originalPrice: 349,
    featured: true,
    duration: '3 weeks',
  },
  {
    id: '5',
    title: 'SaaS Dashboard Template',
    description: 'Modern dashboard template with AI analytics and reporting',
    category: 'web-apps',
    price: 249,
    featured: false,
    duration: '5 weeks',
  },
  {
    id: '6',
    title: 'Instagram Growth Automation',
    description: 'Automate engagement and grow your Instagram following organically',
    category: 'social-media',
    price: 179,
    featured: false,
    duration: '4 weeks',
  },
  {
    id: '7',
    title: 'Agency Proposal Generator',
    description: 'Create winning proposals in minutes with AI-powered templates',
    category: 'agency',
    price: 279,
    featured: false,
    duration: '2 weeks',
  },
  {
    id: '8',
    title: 'Freelance Invoice System',
    description: 'Professional invoicing and payment tracking for freelancers',
    category: 'freelancing',
    price: 129,
    featured: false,
    duration: '2 weeks',
  },
  {
    id: '9',
    title: 'API Integration Platform',
    description: 'Connect multiple services with AI-powered API integrations',
    category: 'web-apps',
    price: 349,
    featured: false,
    duration: '10 weeks',
  },
  {
    id: '10',
    title: 'TikTok Content Strategy',
    description: 'Viral content strategies and AI-powered trend analysis',
    category: 'social-media',
    price: 199,
    featured: false,
    duration: '6 weeks',
  },
  {
    id: '11',
    title: 'Team Collaboration Tool',
    description: 'AI-enhanced collaboration platform for distributed teams',
    category: 'agency',
    price: 449,
    featured: false,
    duration: '9 weeks',
  },
  {
    id: '12',
    title: 'Client Communication System',
    description: 'Automate client updates and maintain professional communication',
    category: 'freelancing',
    price: 159,
    featured: false,
    duration: '3 weeks',
  },
];

/** Static package metadata; package content fetched from database (levels). */
export const packageProducts: PackageProduct[] = [
  {
    id: 'web-apps-package',
    slug: 'web-apps',
    title: 'Web Apps Package',
    description: 'Build powerful web applications with AI assistance. Transform your skills into profitable web development projects.',
    tagline: 'Convert powerful AI solutions into profitable web applications that generate USD revenue',
    category: 'web-apps',
    price: 1997,
    originalPrice: 2997,
    featured: true,
    packageImage: '/package-2.png',
    images: ['/package-2.png'],
    rating: 4.8,
    reviewCount: 127,
    duration: 'Self-paced',
    contentHours: '40+ hours',
    pricingJustification: 'Comprehensive full-stack development course with production-ready templates and resources. Comparable to bootcamps priced at $2,000-$6,000+. Total content: 40+ hours of structured learning with immediate ROI through templates and tools.'
  },
  {
    id: 'social-media-package',
    slug: 'social-media',
    title: 'Social Media Package',
    description: 'Monetize your AI-driven content by creating profitable social media automation tools. Grow your presence and engagement.',
    tagline: 'Monetize your AI-driven content by creating profitable social media automation tools',
    category: 'social-media',
    price: 997,
    originalPrice: 1497,
    featured: true,
    packageImage: '/package-1.png',
    images: ['/package-1.png'],
    rating: 4.9,
    reviewCount: 203,
    duration: 'Self-paced',
    contentHours: '30+ hours',
    pricingJustification: 'Complete social media mastery with 500+ templates and automation systems. Comparable to agency services at $500-$2,000/month. Total content: 30+ hours of video training with immediate value through templates and automation setups that save 10+ hours/week.'
  },
  {
    id: 'agency-package',
    slug: 'agency',
    title: 'Agency Package',
    description: 'Build a profitable agency selling AI-powered services to business clients. Scale your operations with proven systems.',
    tagline: 'Build a profitable agency selling AI-powered services to business clients',
    category: 'agency',
    price: 2997,
    originalPrice: 4497,
    featured: true,
    packageImage: '/package-3.png',
    images: ['/package-3.png'],
    rating: 4.7,
    reviewCount: 89,
    duration: 'Self-paced',
    contentHours: '40+ hours',
    pricingJustification: 'Complete agency scaling system with comprehensive SOP library and templates. Comparable to agency coaching programs at $2,000-$10,000+. Total content: 40+ hours of training with immediate implementation through templates. ROI potential: $10K-$50K+ monthly revenue increase.'
  },
  {
    id: 'freelancing-package',
    slug: 'freelancing',
    title: 'Freelancing Package',
    description: 'Offer your AI expertise as a freelancer to turn automated solutions into USD earnings. Build a successful freelancing career.',
    tagline: 'Offer your AI expertise as a freelancer to turn automated solutions into USD earnings',
    category: 'freelancing',
    price: 497,
    originalPrice: 797,
    featured: true,
    packageImage: '/package-4.png',
    images: ['/package-4.png'],
    rating: 4.6,
    reviewCount: 156,
    duration: 'Self-paced',
    contentHours: '35+ hours',
    pricingJustification: 'Complete freelancer business toolkit with comprehensive templates and guides. Total content: 35+ hours of training with immediate value through templates. ROI potential: $1K-$10K+ monthly income increase. Accessible pricing for individual freelancers that can pay for itself with 1-2 projects.'
  }
];

