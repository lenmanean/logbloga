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

export interface PackageModule {
  title: string;
  description: string;
  hours: string;
  items: string[];
}

export interface PackageResource {
  category: string;
  items: string[];
}

// Package Level Structure (added in migration 000027)
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
  images?: string[]; // Array for multiple product images
  tagline: string;
  modules: PackageModule[]; // @deprecated - Use levels instead. Kept for backward compatibility.
  resources: PackageResource[]; // @deprecated - Use levels instead. Kept for backward compatibility.
  bonusAssets: string[]; // @deprecated - Removed from UI. Kept for backward compatibility.
  levels?: PackageLevels; // New level-based structure
  pricingJustification: string;
  contentHours: string;
  slug: string;
  variants?: PackageVariant[]; // For future package variations
  rating?: number; // 0-5 rating
  reviewCount?: number; // Number of reviews
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

/**
 * NOTE: This data is now fallback data for backward compatibility.
 * The application now fetches products from the database.
 * This array will be removed after full migration verification.
 */
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

/**
 * NOTE: This data is now fallback data for backward compatibility.
 * The application now fetches package products from the database using getPackageProducts().
 * This array will be removed after full migration verification.
 */
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
    modules: [
      {
        title: 'AI-Powered Development Fundamentals',
        description: 'Master the fundamentals of building web apps with AI assistance',
        hours: '6-8 hours',
        items: [
          'Building web apps with AI assistance (ChatGPT, GitHub Copilot, Cursor)',
          'AI-powered debugging and code optimization',
          'Prompt engineering for development tasks'
        ]
      },
      {
        title: 'Full-Stack Web Application Course',
        description: 'Complete guide to building full-stack applications',
        hours: '15-20 hours',
        items: [
          'Modern frameworks (Next.js, React, Node.js) with AI enhancement',
          'Database integration with AI-assisted schema design',
          'API development and integration strategies'
        ]
      },
      {
        title: 'AI Integration Mastery',
        description: 'Learn to integrate AI APIs and build custom AI features',
        hours: '8-10 hours',
        items: [
          'Integrating AI APIs (OpenAI, Anthropic, etc.)',
          'Building custom AI features (chatbots, recommendation systems)',
          'Real-time AI processing and optimization'
        ]
      },
      {
        title: 'Deployment & Scaling',
        description: 'Deploy and scale your applications effectively',
        hours: '5-6 hours',
        items: [
          'CI/CD with AI assistance',
          'Performance optimization',
          'Security best practices'
        ]
      }
    ],
    resources: [
      {
        category: 'Code Templates',
        items: [
          '20+ production-ready code templates',
          '15+ starter project templates',
          'AI prompt library (200+ developer prompts)'
        ]
      },
      {
        category: 'Deployment Guides',
        items: [
          'Deployment guides for Vercel, AWS, etc.',
          'Database templates and schemas'
        ]
      },
      {
        category: 'Business Resources',
        items: [
          'Pricing strategies guide',
          'Client acquisition templates',
          'Proposal templates',
          'Contract templates',
          'Portfolio optimization guide'
        ]
      }
    ],
    bonusAssets: [
      'Access to private Discord community',
      'Monthly Q&A sessions (6 months)',
      'Code review sessions',
      'Lifetime updates',
      'Certificate of completion'
    ],
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
    modules: [
      {
        title: 'AI Content Creation Mastery',
        description: 'Master creating engaging content with AI tools',
        hours: '8-10 hours',
        items: [
          'Writing engaging copy with AI',
          'Image/video generation workflows',
          'Brand voice consistency with AI tools'
        ]
      },
      {
        title: 'Multi-Platform Strategy',
        description: 'Develop strategies for all major social platforms',
        hours: '10-12 hours',
        items: [
          'Platform-specific strategies (Instagram, TikTok, LinkedIn, Twitter)',
          'Content calendars and automation',
          'Algorithm optimization'
        ]
      },
      {
        title: 'Growth & Engagement Systems',
        description: 'Build systems for sustainable growth',
        hours: '6-8 hours',
        items: [
          'AI-powered audience analysis',
          'Engagement optimization',
          'Community management automation'
        ]
      },
      {
        title: 'Monetization & Analytics',
        description: 'Turn your social media into a revenue stream',
        hours: '5-6 hours',
        items: [
          'Influencer partnerships',
          'Affiliate marketing with AI',
          'Analytics and ROI tracking'
        ]
      }
    ],
    resources: [
      {
        category: 'Content Templates',
        items: [
          '500+ AI-generated content templates',
          '50+ ready-to-use caption templates',
          '30-day content calendar templates',
          'Brand voice guides (multiple industries)',
          'Hashtag research tools and databases',
          'Analytics dashboard templates'
        ]
      },
      {
        category: 'Automation Tools',
        items: [
          'Social media automation workflows',
          'Content scheduling setups',
          'Engagement bot configurations',
          'AI prompt library (300+ social media prompts)'
        ]
      },
      {
        category: 'Business Assets',
        items: [
          'Pricing guide for social media services',
          'Client onboarding templates',
          'Reporting templates',
          'Service package templates'
        ]
      }
    ],
    bonusAssets: [
      'Private community access',
      'Monthly strategy sessions (6 months)',
      'Content feedback sessions',
      'Trend alerts and updates',
      'Lifetime access to updates'
    ],
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
    modules: [
      {
        title: 'Agency Foundation & Systems',
        description: 'Build a solid foundation for your agency',
        hours: '8-10 hours',
        items: [
          'Agency business models',
          'Pricing and service packages',
          'Operations and workflows'
        ]
      },
      {
        title: 'AI-Powered Service Delivery',
        description: 'Deliver exceptional services using AI tools',
        hours: '12-15 hours',
        items: [
          'AI tools for each service (SEO, content, ads, web dev)',
          'Scalable service delivery systems',
          'Quality control with AI assistance'
        ]
      },
      {
        title: 'Client Acquisition & Retention',
        description: 'Build a pipeline of high-value clients',
        hours: '8-10 hours',
        items: [
          'AI-powered lead generation',
          'Sales processes and proposals',
          'Client onboarding and retention'
        ]
      },
      {
        title: 'Scaling & Team Management',
        description: 'Scale your agency operations effectively',
        hours: '6-8 hours',
        items: [
          'Hiring and training with AI',
          'Standard operating procedures',
          'Scaling operations'
        ]
      },
      {
        title: 'Financial Management',
        description: 'Optimize your agency\'s financial performance',
        hours: '4-5 hours',
        items: [
          'Pricing strategies',
          'Profit optimization',
          'Financial tracking and forecasting'
        ]
      }
    ],
    resources: [
      {
        category: 'Business Resources',
        items: [
          'Complete agency SOP library (50+ documents)',
          'Service package templates (20+ variations)',
          'Proposal templates ($10K-$100K+ projects)',
          'Contract templates',
          'Onboarding system templates',
          'Client reporting templates (monthly/quarterly)'
        ]
      },
      {
        category: 'Operational Tools',
        items: [
          'AI workflow automations',
          'Client management system setup',
          'Project management templates',
          'Team training materials',
          'Quality assurance checklists'
        ]
      },
      {
        category: 'Sales & Marketing',
        items: [
          'Sales script library',
          'Email sequences (cold outreach, follow-ups)',
          'Case study templates',
          'Testimonial collection systems',
          'Pricing calculator tools'
        ]
      }
    ],
    bonusAssets: [
      'Private mastermind community',
      'Monthly group coaching calls (12 months)',
      '1-on-1 strategy session',
      'Access to agency case studies',
      'Legal document templates',
      'Lifetime updates and new content'
    ],
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
    modules: [
      {
        title: 'Freelancing Fundamentals',
        description: 'Start your freelancing journey on the right foot',
        hours: '6-8 hours',
        items: [
          'Starting and positioning',
          'Niche selection with AI insights',
          'Portfolio development'
        ]
      },
      {
        title: 'AI Tools for Freelancers',
        description: 'Leverage AI to boost productivity and quality',
        hours: '10-12 hours',
        items: [
          'Productivity tools (ChatGPT, Claude, etc.)',
          'Project management automation',
          'Time tracking and optimization'
        ]
      },
      {
        title: 'Client Acquisition Systems',
        description: 'Build systems to attract high-paying clients',
        hours: '8-10 hours',
        items: [
          'AI-powered outreach',
          'Proposal writing with AI',
          'Negotiation strategies',
          'Building referral systems'
        ]
      },
      {
        title: 'Service Delivery & Quality',
        description: 'Deliver exceptional work efficiently',
        hours: '6-8 hours',
        items: [
          'Delivering high-quality work efficiently',
          'Client communication automation',
          'Project management workflows'
        ]
      },
      {
        title: 'Pricing & Financial Growth',
        description: 'Price your services for maximum income',
        hours: '5-6 hours',
        items: [
          'Pricing strategies ($50-$500+/hour)',
          'Contract negotiation',
          'Financial management',
          'Scaling from freelancer to agency'
        ]
      }
    ],
    resources: [
      {
        category: 'Business Templates',
        items: [
          '100+ proposal templates (various services)',
          '50+ contract templates',
          'Invoice templates and systems',
          'Client onboarding templates',
          'Portfolio website templates',
          'Email template library (100+ templates)'
        ]
      },
      {
        category: 'Business Tools',
        items: [
          'Rate calculator tool',
          'Project scope template library',
          'Client questionnaire templates',
          'Time tracking setups',
          'Automated follow-up sequences'
        ]
      },
      {
        category: 'Industry Guides',
        items: [
          'Writing/Content creation',
          'Web development',
          'Design',
          'Marketing',
          'Consulting'
        ]
      }
    ],
    bonusAssets: [
      'Private freelancer community',
      'Monthly group calls (6 months)',
      'Q&A sessions',
      'Job board access',
      'Lifetime updates',
      'Certificate of completion'
    ],
    pricingJustification: 'Complete freelancer business toolkit with comprehensive templates and guides. Total content: 35+ hours of training with immediate value through templates. ROI potential: $1K-$10K+ monthly income increase. Accessible pricing for individual freelancers with can pay for itself with 1-2 projects.'
  }
];

