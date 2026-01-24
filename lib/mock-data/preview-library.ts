/**
 * Mock data for preview library page
 * Contains all 4 packages with complete level-based content structure
 * Used for visual testing and UI refinement
 */

import type { ProductCategory } from '@/lib/types/database';

export interface MockPackageLevelContent {
  file: string;
  type: string;
  description: string;
  platform?: string;
  name?: string;
}

export interface MockPackageLevel {
  level: 1 | 2 | 3;
  timeInvestment: string;
  expectedProfit: string;
  platformCosts: string;
  implementationPlan: MockPackageLevelContent;
  platformGuides: MockPackageLevelContent[];
  creativeFrameworks: MockPackageLevelContent[];
  templates: MockPackageLevelContent[];
}

export interface MockPackage {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  packageImage: string;
  tagline: string;
  contentHours: string;
  rating: number;
  reviewCount: number;
  levels: {
    level1: MockPackageLevel;
    level2: MockPackageLevel;
    level3: MockPackageLevel;
  };
}

export const mockPackages: MockPackage[] = [
  {
    id: 'web-apps-package',
    slug: 'web-apps',
    title: 'Web Apps Package',
    description: 'Build powerful web applications with AI assistance. Transform your skills into profitable web development projects. Comprehensive full-stack development course with production-ready templates and resources.',
    category: 'web-apps',
    price: 1997,
    originalPrice: 2997,
    packageImage: '/package-2.png',
    tagline: 'Convert powerful AI solutions into profitable web applications that generate USD revenue',
    contentHours: '40+ hours',
    rating: 4.8,
    reviewCount: 127,
    levels: {
      level1: {
        level: 1,
        timeInvestment: '2-4 Weeks',
        expectedProfit: '$500-$2,000/month',
        platformCosts: '$0-50/month',
        implementationPlan: {
          file: 'web-apps-level-1-plan.md',
          type: 'markdown',
          description: '2-4 week step-by-step roadmap for building a simple single-page app or landing page SaaS',
        },
        platformGuides: [
          {
            file: 'nextjs-simple-setup-guide.md',
            type: 'markdown',
            description: 'Next.js template setup with screenshots and step-by-step instructions',
            platform: 'Next.js',
          },
          {
            file: 'vercel-deployment-guide.md',
            type: 'markdown',
            description: 'Deployment steps for Vercel with configuration examples',
            platform: 'Vercel',
          },
          {
            file: 'stripe-basic-setup.md',
            type: 'markdown',
            description: 'Basic Stripe integration setup with code examples',
            platform: 'Stripe',
          },
          {
            file: 'github-setup-guide.md',
            type: 'markdown',
            description: 'Version control setup with GitHub',
            platform: 'GitHub',
          },
        ],
        creativeFrameworks: [
          {
            file: 'idea-generation-framework.md',
            type: 'markdown',
            description: 'Guided exercises for generating web app ideas',
            name: 'Idea Generation Framework',
          },
          {
            file: 'value-proposition-worksheet.md',
            type: 'markdown',
            description: 'Value proposition exercises and templates',
            name: 'Value Proposition Worksheet',
          },
          {
            file: 'simple-mvp-framework.md',
            type: 'markdown',
            description: 'Feature prioritization and MVP scope definition',
            name: 'Simple MVP Framework',
          },
        ],
        templates: [
          {
            file: 'basic-starter-template.zip',
            type: 'zip',
            description: 'Simple Next.js template with Tailwind CSS configured',
            name: 'Basic Starter Template',
          },
          {
            file: 'mvp-checklist.md',
            type: 'markdown',
            description: 'Development checklist for MVP launch',
            name: 'MVP Checklist',
          },
        ],
      },
      level2: {
        level: 2,
        timeInvestment: '6-8 Weeks',
        expectedProfit: '$2,000-$8,000/month',
        platformCosts: '$50-200/month',
        implementationPlan: {
          file: 'web-apps-level-2-plan.md',
          type: 'markdown',
          description: '6-8 week roadmap for building a medium complexity SaaS application',
        },
        platformGuides: [
          {
            file: 'nextjs-saas-starter-setup.md',
            type: 'markdown',
            description: 'Official Next.js SaaS template setup and customization',
            platform: 'Next.js',
          },
          {
            file: 'supabase-setup-guide.md',
            type: 'markdown',
            description: 'Database and authentication setup with Supabase',
            platform: 'Supabase',
          },
          {
            file: 'stripe-integration-guide.md',
            type: 'markdown',
            description: 'Payment integration with subscriptions and webhooks',
            platform: 'Stripe',
          },
          {
            file: 'vercel-advanced-deployment.md',
            type: 'markdown',
            description: 'Advanced deployment configuration and optimization',
            platform: 'Vercel',
          },
        ],
        creativeFrameworks: [
          {
            file: 'mvp-development-framework.md',
            type: 'markdown',
            description: 'Feature development and prioritization framework',
            name: 'MVP Development Framework',
          },
          {
            file: 'go-to-market-strategy.md',
            type: 'markdown',
            description: 'User acquisition and growth strategies',
            name: 'Go-to-Market Strategy',
          },
          {
            file: 'pricing-strategy-saas.md',
            type: 'markdown',
            description: 'SaaS pricing models and strategies',
            name: 'Pricing Strategy for SaaS',
          },
        ],
        templates: [
          {
            file: 'saas-starter-template.zip',
            type: 'zip',
            description: 'Full Next.js SaaS template with Supabase and Stripe integration',
            name: 'SaaS Starter Template',
          },
          {
            file: 'development-milestones-checklist.md',
            type: 'markdown',
            description: 'Milestone tracker for development phases',
            name: 'Development Milestones Checklist',
          },
        ],
      },
      level3: {
        level: 3,
        timeInvestment: '10-12 Weeks',
        expectedProfit: '$10,000-$50,000+/month',
        platformCosts: '$200-500/month',
        implementationPlan: {
          file: 'web-apps-level-3-plan.md',
          type: 'markdown',
          description: '10-12 week roadmap for building a complex SaaS application (like Doer)',
        },
        platformGuides: [
          {
            file: 'advanced-supabase-setup.md',
            type: 'markdown',
            description: 'Complex database design and multi-tenant architecture',
            platform: 'Supabase',
          },
          {
            file: 'ai-integration-guide.md',
            type: 'markdown',
            description: 'OpenAI and Anthropic API integration with examples',
            platform: 'AI APIs',
          },
          {
            file: 'third-party-integrations-guide.md',
            type: 'markdown',
            description: 'API integrations and webhook management',
            platform: 'Third-party APIs',
          },
          {
            file: 'vercel-edge-functions.md',
            type: 'markdown',
            description: 'Edge functions setup and optimization',
            platform: 'Vercel',
          },
        ],
        creativeFrameworks: [
          {
            file: 'advanced-mvp-framework.md',
            type: 'markdown',
            description: 'Complex feature prioritization and architecture decisions',
            name: 'Advanced MVP Framework',
          },
          {
            file: 'scaling-strategy.md',
            type: 'markdown',
            description: 'Growth strategies and scaling architecture',
            name: 'Scaling Strategy',
          },
        ],
        templates: [
          {
            file: 'advanced-saas-template.zip',
            type: 'zip',
            description: 'Complex template with AI integration and advanced features',
            name: 'Advanced SaaS Template',
          },
          {
            file: 'ai-integration-examples.zip',
            type: 'zip',
            description: 'AI integration code examples and patterns',
            name: 'AI Integration Examples',
          },
        ],
      },
    },
  },
  {
    id: 'social-media-package',
    slug: 'social-media',
    title: 'Social Media Package',
    description: 'Monetize your AI-driven content by creating profitable social media automation tools. Grow your presence and engagement. Complete social media mastery with 500+ templates and automation systems.',
    category: 'social-media',
    price: 997,
    originalPrice: 1497,
    packageImage: '/package-1.png',
    tagline: 'Monetize your AI-driven content by creating profitable social media automation tools',
    contentHours: '30+ hours',
    rating: 4.9,
    reviewCount: 203,
    levels: {
      level1: {
        level: 1,
        timeInvestment: '2-3 Weeks',
        expectedProfit: '$300-$1,000/month',
        platformCosts: '$0-30/month',
        implementationPlan: {
          file: 'social-media-level-1-plan.pdf',
          type: 'pdf',
          description: '2-3 week roadmap for personal brand or simple service',
        },
        platformGuides: [
          {
            file: 'buffer-setup-guide.pdf',
            type: 'pdf',
            description: 'Buffer account creation and configuration',
            platform: 'Buffer',
          },
          {
            file: 'canva-setup-guide.pdf',
            type: 'pdf',
            description: 'Canva account setup for content creation',
            platform: 'Canva',
          },
          {
            file: 'google-analytics-setup-guide.pdf',
            type: 'pdf',
            description: 'Google Analytics setup and configuration',
            platform: 'Google Analytics',
          },
        ],
        creativeFrameworks: [
          {
            file: 'niche-selection-worksheet.pdf',
            type: 'pdf',
            description: 'Niche selection framework with exercises',
            name: 'Niche Selection Worksheet',
          },
          {
            file: 'brand-identity-framework.pdf',
            type: 'pdf',
            description: 'Username, bio, and profile picture guidance',
            name: 'Brand Identity Framework',
          },
          {
            file: 'content-direction-framework.pdf',
            type: 'pdf',
            description: 'Content strategy exercises and planning',
            name: 'Content Direction Framework',
          },
        ],
        templates: [
          {
            file: 'content-strategy-template.xlsx',
            type: 'xlsx',
            description: 'Content pillars template in Excel format',
            name: 'Content Strategy Template',
          },
          {
            file: 'daily-posting-checklist.pdf',
            type: 'pdf',
            description: 'Quick-start checklist for daily posting',
            name: 'Daily Posting Checklist',
          },
        ],
      },
      level2: {
        level: 2,
        timeInvestment: '4-6 Weeks',
        expectedProfit: '$1,000-$3,000/month',
        platformCosts: '$30-100/month',
        implementationPlan: {
          file: 'social-media-level-2-plan.pdf',
          type: 'pdf',
          description: '4-6 week roadmap for social media management service',
        },
        platformGuides: [
          {
            file: 'later-setup-guide.pdf',
            type: 'pdf',
            description: 'Later platform setup for content scheduling',
            platform: 'Later',
          },
          {
            file: 'metricool-setup-guide.pdf',
            type: 'pdf',
            description: 'Analytics setup with Metricool',
            platform: 'Metricool',
          },
          {
            file: 'buffer-paid-setup-guide.pdf',
            type: 'pdf',
            description: 'Paid Buffer plan setup and features',
            platform: 'Buffer',
          },
        ],
        creativeFrameworks: [
          {
            file: 'client-onboarding-framework.pdf',
            type: 'pdf',
            description: 'Service package development framework',
            name: 'Client Onboarding Framework',
          },
          {
            file: 'service-pricing-framework.pdf',
            type: 'pdf',
            description: 'Pricing strategy exercises for services',
            name: 'Service Pricing Framework',
          },
        ],
        templates: [
          {
            file: 'content-calendar-template.xlsx',
            type: 'xlsx',
            description: 'Multi-client content calendar template',
            name: 'Content Calendar Template',
          },
          {
            file: 'client-reporting-template.docx',
            type: 'docx',
            description: 'Monthly report template for clients',
            name: 'Client Reporting Template',
          },
          {
            file: 'client-onboarding-checklist.pdf',
            type: 'pdf',
            description: 'Onboarding checklist for new clients',
            name: 'Client Onboarding Checklist',
          },
        ],
      },
      level3: {
        level: 3,
        timeInvestment: '8-12 Weeks',
        expectedProfit: '$3,000-$10,000+/month',
        platformCosts: '$100-300/month',
        implementationPlan: {
          file: 'social-media-level-3-plan.pdf',
          type: 'pdf',
          description: '8-12 week roadmap for social media agency',
        },
        platformGuides: [
          {
            file: 'hootsuite-setup-guide.pdf',
            type: 'pdf',
            description: 'Enterprise setup with Hootsuite',
            platform: 'Hootsuite',
          },
          {
            file: 'advanced-analytics-setup.pdf',
            type: 'pdf',
            description: 'Advanced analytics stack configuration',
            platform: 'Analytics',
          },
        ],
        creativeFrameworks: [
          {
            file: 'agency-operations-framework.pdf',
            type: 'pdf',
            description: 'Team scaling and operations framework',
            name: 'Agency Operations Framework',
          },
          {
            file: 'service-suite-development.pdf',
            type: 'pdf',
            description: 'Multiple service offerings development',
            name: 'Service Suite Development',
          },
        ],
        templates: [
          {
            file: 'team-management-templates.zip',
            type: 'zip',
            description: 'Multiple templates for team management',
            name: 'Team Management Templates',
          },
        ],
      },
    },
  },
  {
    id: 'agency-package',
    slug: 'agency',
    title: 'Agency Package',
    description: 'Build a profitable agency selling AI-powered services to business clients. Scale your operations with proven systems. Complete agency scaling system with comprehensive SOP library and templates.',
    category: 'agency',
    price: 2997,
    originalPrice: 4497,
    packageImage: '/package-3.png',
    tagline: 'Build a profitable agency selling AI-powered services to business clients',
    contentHours: '40+ hours',
    rating: 4.7,
    reviewCount: 89,
    levels: {
      level1: {
        level: 1,
        timeInvestment: '3-4 Weeks',
        expectedProfit: '$2,000-$5,000/month',
        platformCosts: '$100-300/month',
        implementationPlan: {
          file: 'agency-level-1-plan.pdf',
          type: 'pdf',
          description: '3-4 week roadmap for solo agency or one-person operation',
        },
        platformGuides: [
          {
            file: 'systeme-io-setup-guide.pdf',
            type: 'pdf',
            description: 'Budget-friendly all-in-one platform setup',
            platform: 'Systeme.io',
          },
          {
            file: 'hubspot-free-setup.pdf',
            type: 'pdf',
            description: 'Free CRM setup with HubSpot',
            platform: 'HubSpot',
          },
          {
            file: 'clickup-free-setup.pdf',
            type: 'pdf',
            description: 'Free project management setup',
            platform: 'ClickUp',
          },
          {
            file: 'hello-bonsai-setup.pdf',
            type: 'pdf',
            description: 'Contracts and invoicing setup',
            platform: 'Hello Bonsai',
          },
        ],
        creativeFrameworks: [
          {
            file: 'agency-niche-framework.pdf',
            type: 'pdf',
            description: 'What services to offer framework',
            name: 'Agency Niche Framework',
          },
          {
            file: 'service-package-framework.pdf',
            type: 'pdf',
            description: 'How to package services framework',
            name: 'Service Package Framework',
          },
          {
            file: 'target-client-framework.pdf',
            type: 'pdf',
            description: 'Who to serve framework',
            name: 'Target Client Framework',
          },
        ],
        templates: [
          {
            file: 'client-onboarding-template.zip',
            type: 'zip',
            description: 'Onboarding templates in multiple formats',
            name: 'Client Onboarding Template',
          },
        ],
      },
      level2: {
        level: 2,
        timeInvestment: '6-8 Weeks',
        expectedProfit: '$5,000-$15,000/month',
        platformCosts: '$300-800/month',
        implementationPlan: {
          file: 'agency-level-2-plan.pdf',
          type: 'pdf',
          description: '6-8 week roadmap for small agency with 2-5 person team',
        },
        platformGuides: [
          {
            file: 'gohighlevel-setup-guide.pdf',
            type: 'pdf',
            description: 'Complete agency platform setup',
            platform: 'GoHighLevel',
          },
          {
            file: 'hubspot-paid-setup.pdf',
            type: 'pdf',
            description: 'Advanced CRM setup with paid HubSpot',
            platform: 'HubSpot',
          },
          {
            file: 'clickup-paid-setup.pdf',
            type: 'pdf',
            description: 'Team project management setup',
            platform: 'ClickUp',
          },
          {
            file: 'zite-setup-guide.pdf',
            type: 'pdf',
            description: 'Client onboarding portals setup',
            platform: 'Zite',
          },
        ],
        creativeFrameworks: [
          {
            file: 'team-management-framework.pdf',
            type: 'pdf',
            description: 'Hiring and training framework',
            name: 'Team Management Framework',
          },
          {
            file: 'service-suite-development.pdf',
            type: 'pdf',
            description: 'Multiple offerings development',
            name: 'Service Suite Development',
          },
          {
            file: 'client-retention-strategies.pdf',
            type: 'pdf',
            description: 'Growth and retention strategies',
            name: 'Client Retention Strategies',
          },
        ],
        templates: [
          {
            file: 'agency-operations-templates.zip',
            type: 'zip',
            description: 'Operations templates for agency management',
            name: 'Agency Operations Templates',
          },
        ],
      },
      level3: {
        level: 3,
        timeInvestment: '12-16 Weeks',
        expectedProfit: '$15,000-$50,000+/month',
        platformCosts: '$800-2,000/month',
        implementationPlan: {
          file: 'agency-level-3-plan.pdf',
          type: 'pdf',
          description: '12-16 week roadmap for established agency with 5+ person team',
        },
        platformGuides: [
          {
            file: 'gohighlevel-enterprise-setup.pdf',
            type: 'pdf',
            description: 'Enterprise features setup',
            platform: 'GoHighLevel',
          },
          {
            file: 'enterprise-platform-setup.pdf',
            type: 'pdf',
            description: 'Advanced tools and platform setup',
            platform: 'Enterprise Tools',
          },
        ],
        creativeFrameworks: [
          {
            file: 'enterprise-operations-framework.pdf',
            type: 'pdf',
            description: 'Advanced processes framework',
            name: 'Enterprise Operations Framework',
          },
          {
            file: 'team-scaling-guide.pdf',
            type: 'pdf',
            description: 'Advanced hiring and scaling guide',
            name: 'Team Scaling Guide',
          },
          {
            file: 'enterprise-service-development.pdf',
            type: 'pdf',
            description: 'High-value services development',
            name: 'Enterprise Service Development',
          },
        ],
        templates: [
          {
            file: 'enterprise-templates.zip',
            type: 'zip',
            description: 'Enterprise-level templates and resources',
            name: 'Enterprise Templates',
          },
        ],
      },
    },
  },
  {
    id: 'freelancing-package',
    slug: 'freelancing',
    title: 'Freelancing Package',
    description: 'Offer your AI expertise as a freelancer to turn automated solutions into USD earnings. Build a successful freelancing career. Complete freelancer business toolkit with comprehensive templates and guides.',
    category: 'freelancing',
    price: 497,
    originalPrice: 797,
    packageImage: '/package-4.png',
    tagline: 'Offer your AI expertise as a freelancer to turn automated solutions into USD earnings',
    contentHours: '35+ hours',
    rating: 4.6,
    reviewCount: 156,
    levels: {
      level1: {
        level: 1,
        timeInvestment: '1-2 Weeks',
        expectedProfit: '$500-$1,500/month',
        platformCosts: '$0-20/month',
        implementationPlan: {
          file: 'freelancing-level-1-plan.pdf',
          type: 'pdf',
          description: '1-2 week roadmap for side hustle or part-time freelancing',
        },
        platformGuides: [
          {
            file: 'fiverr-profile-setup-guide.pdf',
            type: 'pdf',
            description: 'Fiverr profile creation and optimization',
            platform: 'Fiverr',
          },
          {
            file: 'hello-bonsai-setup-guide.pdf',
            type: 'pdf',
            description: 'Contract and invoicing setup',
            platform: 'Hello Bonsai',
          },
          {
            file: 'paypal-setup-guide.pdf',
            type: 'pdf',
            description: 'Payment processing setup',
            platform: 'PayPal',
          },
        ],
        creativeFrameworks: [
          {
            file: 'service-definition-framework.pdf',
            type: 'pdf',
            description: 'What services to offer framework',
            name: 'Service Definition Framework',
          },
          {
            file: 'portfolio-creation-framework.pdf',
            type: 'pdf',
            description: 'How to showcase work framework',
            name: 'Portfolio Creation Framework',
          },
          {
            file: 'pricing-strategy-worksheet.pdf',
            type: 'pdf',
            description: 'Pricing decision framework',
            name: 'Pricing Strategy Worksheet',
          },
        ],
        templates: [
          {
            file: 'gig-listing-template.md',
            type: 'markdown',
            description: 'Fiverr gig description template',
            name: 'Gig Listing Template',
          },
          {
            file: 'portfolio-showcase-template.md',
            type: 'markdown',
            description: 'Portfolio structure template',
            name: 'Portfolio Showcase Template',
          },
        ],
      },
      level2: {
        level: 2,
        timeInvestment: '3-4 Weeks',
        expectedProfit: '$1,500-$4,000/month',
        platformCosts: '$20-50/month',
        implementationPlan: {
          file: 'freelancing-level-2-plan.pdf',
          type: 'pdf',
          description: '3-4 week roadmap for full-time freelancing business',
        },
        platformGuides: [
          {
            file: 'upwork-setup-guide.pdf',
            type: 'pdf',
            description: 'Upwork profile setup and optimization',
            platform: 'Upwork',
          },
          {
            file: 'hello-bonsai-paid-setup.pdf',
            type: 'pdf',
            description: 'Advanced Hello Bonsai features',
            platform: 'Hello Bonsai',
          },
          {
            file: 'stripe-setup-guide.pdf',
            type: 'pdf',
            description: 'Professional payment processing',
            platform: 'Stripe',
          },
          {
            file: 'google-workspace-setup.pdf',
            type: 'pdf',
            description: 'Professional email and calendar setup',
            platform: 'Google Workspace',
          },
        ],
        creativeFrameworks: [
          {
            file: 'professional-portfolio-framework.pdf',
            type: 'pdf',
            description: 'Website portfolio guide',
            name: 'Professional Portfolio Framework',
          },
          {
            file: 'pricing-strategy-advanced.pdf',
            type: 'pdf',
            description: 'Full-time pricing strategies',
            name: 'Pricing Strategy Advanced',
          },
        ],
        templates: [
          {
            file: 'proposal-templates.zip',
            type: 'zip',
            description: 'Word and PDF proposal templates',
            name: 'Proposal Templates',
          },
          {
            file: 'contract-templates.zip',
            type: 'zip',
            description: 'Hello Bonsai contract templates',
            name: 'Contract Templates',
          },
          {
            file: 'client-communication-templates.md',
            type: 'markdown',
            description: 'Email templates for client communication',
            name: 'Client Communication Templates',
          },
        ],
      },
      level3: {
        level: 3,
        timeInvestment: '6-8 Weeks',
        expectedProfit: '$4,000-$10,000+/month',
        platformCosts: '$50-150/month',
        implementationPlan: {
          file: 'freelancing-level-3-plan.pdf',
          type: 'pdf',
          description: '6-8 week roadmap for premium freelancing or consultant',
        },
        platformGuides: [
          {
            file: 'premium-platform-guide.pdf',
            type: 'pdf',
            description: 'Toptal and Arc setup guides',
            platform: 'Premium Platforms',
          },
          {
            file: 'direct-client-acquisition-guide.pdf',
            type: 'pdf',
            description: 'Moving beyond platforms guide',
            platform: 'Direct Clients',
          },
          {
            file: 'crm-setup-guide.pdf',
            type: 'pdf',
            description: 'HubSpot or GoHighLevel for freelancers',
            platform: 'CRM',
          },
        ],
        creativeFrameworks: [
          {
            file: 'consultant-positioning-framework.pdf',
            type: 'pdf',
            description: 'Premium positioning framework',
            name: 'Consultant Positioning Framework',
          },
          {
            file: 'direct-client-framework.pdf',
            type: 'pdf',
            description: 'Direct client acquisition framework',
            name: 'Direct Client Framework',
          },
        ],
        templates: [
          {
            file: 'business-systems-templates.zip',
            type: 'zip',
            description: 'Advanced templates for business systems',
            name: 'Business Systems Templates',
          },
        ],
      },
    },
  },
];

/**
 * Mock individual product structure
 */
export interface MockIndividualProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice: number | null;
  featured: boolean;
  duration: string;
  productType: 'tool' | 'template' | 'strategy' | 'course' | 'individual';
  image?: string;
}

/**
 * Mock individual products for preview
 */
export const mockIndividualProducts: MockIndividualProduct[] = [
  {
    id: 'ai-ecommerce-builder',
    slug: 'ai-ecommerce-builder',
    title: 'AI-Powered E-Commerce Builder',
    description: 'Create stunning online stores with AI-assisted design and automation',
    category: 'web-apps',
    price: 299.00,
    originalPrice: 499.00,
    featured: true,
    duration: '6 weeks',
    productType: 'tool',
  },
  {
    id: 'social-content-generator',
    slug: 'social-content-generator',
    title: 'Social Media Content Generator',
    description: 'Generate engaging posts, captions, and content calendars automatically',
    category: 'social-media',
    price: 149.00,
    originalPrice: 249.00,
    featured: true,
    duration: '4 weeks',
    productType: 'tool',
  },
  {
    id: 'client-management-system',
    slug: 'client-management-system',
    title: 'Client Management System',
    description: 'Streamline your agency workflow with AI-powered project management',
    category: 'agency',
    price: 399.00,
    originalPrice: 599.00,
    featured: true,
    duration: '8 weeks',
    productType: 'tool',
  },
  {
    id: 'freelancer-portfolio',
    slug: 'freelancer-portfolio',
    title: 'Freelancer Portfolio Platform',
    description: 'Build a professional portfolio that attracts high-paying clients',
    category: 'freelancing',
    price: 199.00,
    originalPrice: 349.00,
    featured: true,
    duration: '3 weeks',
    productType: 'template',
  },
  {
    id: 'saas-dashboard-template',
    slug: 'saas-dashboard-template',
    title: 'SaaS Dashboard Template',
    description: 'Modern dashboard template with AI analytics and reporting',
    category: 'web-apps',
    price: 249.00,
    originalPrice: null,
    featured: false,
    duration: '5 weeks',
    productType: 'template',
  },
  {
    id: 'instagram-automation',
    slug: 'instagram-automation',
    title: 'Instagram Growth Automation',
    description: 'Automate engagement and grow your Instagram following organically',
    category: 'social-media',
    price: 179.00,
    originalPrice: null,
    featured: false,
    duration: '4 weeks',
    productType: 'tool',
  },
  {
    id: 'agency-proposal-generator',
    slug: 'agency-proposal-generator',
    title: 'Agency Proposal Generator',
    description: 'Create winning proposals in minutes with AI-powered templates',
    category: 'agency',
    price: 279.00,
    originalPrice: null,
    featured: false,
    duration: '2 weeks',
    productType: 'template',
  },
  {
    id: 'freelance-invoice-system',
    slug: 'freelance-invoice-system',
    title: 'Freelance Invoice System',
    description: 'Professional invoicing and payment tracking for freelancers',
    category: 'freelancing',
    price: 129.00,
    originalPrice: null,
    featured: false,
    duration: '2 weeks',
    productType: 'tool',
  },
  {
    id: 'api-integration-platform',
    slug: 'api-integration-platform',
    title: 'API Integration Platform',
    description: 'Connect multiple services with AI-powered API integrations',
    category: 'web-apps',
    price: 349.00,
    originalPrice: null,
    featured: false,
    duration: '10 weeks',
    productType: 'tool',
  },
  {
    id: 'tiktok-strategy',
    slug: 'tiktok-strategy',
    title: 'TikTok Content Strategy',
    description: 'Viral content strategies and AI-powered trend analysis',
    category: 'social-media',
    price: 199.00,
    originalPrice: null,
    featured: false,
    duration: '6 weeks',
    productType: 'strategy',
  },
  {
    id: 'team-collaboration-tool',
    slug: 'team-collaboration-tool',
    title: 'Team Collaboration Tool',
    description: 'AI-enhanced collaboration platform for distributed teams',
    category: 'agency',
    price: 449.00,
    originalPrice: null,
    featured: false,
    duration: '9 weeks',
    productType: 'tool',
  },
  {
    id: 'client-communication-system',
    slug: 'client-communication-system',
    title: 'Client Communication System',
    description: 'Automate client updates and maintain professional communication',
    category: 'freelancing',
    price: 159.00,
    originalPrice: null,
    featured: false,
    duration: '3 weeks',
    productType: 'tool',
  },
];

/**
 * Get all mock packages
 */
export function getAllMockPackages(): MockPackage[] {
  return mockPackages;
}

/**
 * Get a mock package by slug
 */
export function getMockPackageBySlug(slug: string): MockPackage | undefined {
  return mockPackages.find((pkg) => pkg.slug === slug);
}

/**
 * Get mock packages by category
 */
export function getMockPackagesByCategory(category: ProductCategory): MockPackage[] {
  return mockPackages.filter((pkg) => pkg.category === category);
}

/**
 * Get all mock individual products
 */
export function getAllMockIndividualProducts(): MockIndividualProduct[] {
  return mockIndividualProducts;
}

/**
 * Get a mock individual product by slug
 */
export function getMockIndividualProductBySlug(slug: string): MockIndividualProduct | undefined {
  return mockIndividualProducts.find((product) => product.slug === slug);
}

/**
 * Get mock individual products by category
 */
export function getMockIndividualProductsByCategory(category: ProductCategory): MockIndividualProduct[] {
  return mockIndividualProducts.filter((product) => product.category === category);
}
