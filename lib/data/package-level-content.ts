/**
 * Package Level Content Data
 * 
 * This file contains the complete content structure for each level of each package.
 * Used to display accurate content information when database data is incomplete.
 * 
 * Canonical content structure; see docs/PACKAGE_CONTENT_INFRASTRUCTURE.md
 */

export interface LevelContent {
  aiLeverage: string; // Comprehensive description of AI tools used and how they drive revenue
  implementationPlan: {
    file: string;
    type: string;
    description?: string;
  };
  platformGuides: Array<{
    file: string;
    type: string;
    platform?: string;
    description?: string;
  }>;
  creativeFrameworks: Array<{
    file: string;
    type: string;
    name?: string;
    description?: string;
  }>;
  templates: Array<{
    file: string;
    type: string;
    name?: string;
    description?: string;
  }>;
  launchMarketing?: Array<{
    file: string;
    type: string;
    name?: string;
    description?: string;
  }>;
  troubleshooting?: Array<{
    file: string;
    type: string;
    name?: string;
    description?: string;
  }>;
  planning?: Array<{
    file: string;
    type: string;
    name?: string;
    description?: string;
  }>;
}

export interface PackageLevelContent {
  level1: LevelContent;
  level2: LevelContent;
  level3: LevelContent;
}

export const packageLevelContent: Record<string, PackageLevelContent> = {
  'web-apps': {
    level1: {
      aiLeverage: 'We use ChatGPT, Cursor, and GitHub Copilot. This AI-assisted approach helps you build a functional Stripe-integrated landing page in 2-4 weeks instead of 6-8 weeks and reach market faster.',
      implementationPlan: {
        file: 'web-apps-level-1-plan.md',
        type: 'md',
        description: 'Step-by-step roadmap for building a simple single-page app or landing page SaaS'
      },
      platformGuides: [
        { file: 'nextjs-simple-setup-guide.md', type: 'md', platform: 'Next.js' },
        { file: 'vercel-deployment-guide.md', type: 'md', platform: 'Vercel' },
        { file: 'stripe-basic-setup.md', type: 'md', platform: 'Stripe' },
        { file: 'github-setup-guide.md', type: 'md', platform: 'GitHub' }
      ],
      creativeFrameworks: [
        { file: 'idea-generation-framework.md', type: 'md', name: 'Idea Generation Framework' },
        { file: 'value-proposition-worksheet.md', type: 'md', name: 'Value Proposition Worksheet' },
        { file: 'simple-mvp-framework.md', type: 'md', name: 'Simple MVP Framework' }
      ],
      templates: [
        { file: 'basic-starter-template.zip', type: 'zip', name: 'Basic Starter Template' },
        { file: 'mvp-checklist.md', type: 'md', name: 'MVP Checklist' }
      ],
      launchMarketing: [
        { file: 'web-apps-level-1-launch-checklist.md', type: 'md', name: 'Launch Checklist' },
        { file: 'web-apps-level-1-basic-marketing-guide.md', type: 'md', name: 'Basic Marketing Guide' }
      ],
      troubleshooting: [
        { file: 'web-apps-level-1-common-issues-solutions.md', type: 'md', name: 'Common Issues & Solutions' }
      ],
      planning: [
        { file: 'web-apps-level-1-time-investment-planner.md', type: 'md', name: 'Time Investment Planner' },
        { file: 'web-apps-level-1-budget-planning-worksheet.md', type: 'md', name: 'Budget Planning Worksheet' }
      ]
    },
    level2: {
      aiLeverage: 'We use Cursor, ChatGPT, Claude, and GitHub Copilot, with optional OpenAI API integration. This AI leverage supports rapid MVP development and faster market entry (e.g. 6-8 weeks instead of 12-16).',
      implementationPlan: {
        file: 'web-apps-level-2-plan.md',
        type: 'md',
        description: 'Step-by-step roadmap for building a medium complexity SaaS'
      },
      platformGuides: [
        { file: 'nextjs-saas-starter-setup.md', type: 'md', platform: 'Next.js' },
        { file: 'supabase-setup-guide.md', type: 'md', platform: 'Supabase' },
        { file: 'stripe-integration-guide.md', type: 'md', platform: 'Stripe' },
        { file: 'vercel-advanced-deployment.md', type: 'md', platform: 'Vercel' }
      ],
      creativeFrameworks: [
        { file: 'mvp-development-framework.md', type: 'md', name: 'MVP Development Framework' },
        { file: 'go-to-market-strategy.md', type: 'md', name: 'Go-to-Market Strategy' },
        { file: 'pricing-strategy-saas.md', type: 'md', name: 'Pricing Strategy for SaaS' }
      ],
      templates: [
        { file: 'saas-starter-template.zip', type: 'zip', name: 'SaaS Starter Template' },
        { file: 'development-milestones-checklist.md', type: 'md', name: 'Development Milestones Checklist' }
      ],
      launchMarketing: [
        { file: 'web-apps-level-2-customer-acquisition-guide.md', type: 'md', name: 'Customer Acquisition Guide' }
      ],
      troubleshooting: [
        { file: 'web-apps-level-2-troubleshooting-debugging-guide.md', type: 'md', name: 'Troubleshooting & Debugging Guide' }
      ],
      planning: [
        { file: 'web-apps-level-2-success-metrics-dashboard.md', type: 'md', name: 'Success Metrics Dashboard' },
        { file: 'web-apps-level-2-budget-planning-worksheet.md', type: 'md', name: 'Budget Planning Worksheet' }
      ]
    },
    level3: {
      aiLeverage: 'We use Cursor, Claude, OpenAI and Anthropic APIs, and GitHub Copilot. AI serves as both a development tool and a product feature. This dual leverage supports building enterprise-grade platforms.',
      implementationPlan: {
        file: 'web-apps-level-3-plan.md',
        type: 'md',
        description: 'Step-by-step roadmap for building a complex SaaS like DOER'
      },
      platformGuides: [
        { file: 'advanced-supabase-setup.md', type: 'md', platform: 'Supabase' },
        { file: 'ai-integration-guide.md', type: 'md', platform: 'AI Services' },
        { file: 'third-party-integrations-guide.md', type: 'md', platform: 'Third-Party APIs' },
        { file: 'vercel-edge-functions.md', type: 'md', platform: 'Vercel' }
      ],
      creativeFrameworks: [
        { file: 'advanced-mvp-framework.md', type: 'md', name: 'Advanced MVP Framework' },
        { file: 'scaling-strategy.md', type: 'md', name: 'Scaling Strategy' }
      ],
      templates: [
        { file: 'advanced-saas-template.zip', type: 'zip', name: 'Advanced SaaS Template' },
        { file: 'ai-integration-examples.zip', type: 'zip', name: 'AI Integration Examples' }
      ],
      launchMarketing: [
        { file: 'web-apps-level-3-enterprise-marketing-playbook.md', type: 'md', name: 'Enterprise Marketing Playbook' },
        { file: 'web-apps-level-3-partnership-strategy.md', type: 'md', name: 'Partnership Strategy' }
      ],
      troubleshooting: [
        { file: 'web-apps-level-3-advanced-troubleshooting-guide.md', type: 'md', name: 'Advanced Troubleshooting Guide' }
      ],
      planning: [
        { file: 'web-apps-level-3-scaling-operations-budget.md', type: 'md', name: 'Scaling Operations Budget' }
      ]
    }
  },
  'social-media': {
    level1: {
      aiLeverage: 'We use ChatGPT, Canva AI, and Claude, with optional tools like Midjourney or DALL-E. This AI leverage supports personal brand monetization through affiliate marketing, sponsored content, and product sales.',
      implementationPlan: {
        file: 'social-media-level-1-plan.pdf',
        type: 'pdf',
        description: 'Step-by-step roadmap for personal brand or simple service'
      },
      platformGuides: [
        { file: 'buffer-setup-guide.pdf', type: 'pdf', platform: 'Buffer' },
        { file: 'canva-setup-guide.pdf', type: 'pdf', platform: 'Canva' },
        { file: 'google-analytics-setup-guide.pdf', type: 'pdf', platform: 'Google Analytics' }
      ],
      creativeFrameworks: [
        { file: 'niche-selection-worksheet.pdf', type: 'pdf', name: 'Niche Selection Worksheet' },
        { file: 'brand-identity-framework.pdf', type: 'pdf', name: 'Brand Identity Framework' },
        { file: 'content-direction-framework.pdf', type: 'pdf', name: 'Content Direction Framework' }
      ],
      templates: [
        { file: 'content-strategy-template.xlsx', type: 'xlsx', name: 'Content Strategy Template' },
        { file: 'daily-posting-checklist.pdf', type: 'pdf', name: 'Daily Posting Checklist' }
      ]
    },
    level2: {
      aiLeverage: 'We use ChatGPT, Canva AI, Buffer, Later, and related automation tools. This AI leverage supports scaling content creation and managing 3-5 clients simultaneously. AI multiplies your output (e.g. one hour of AI-assisted work = 10 hours of manual work).',
      implementationPlan: {
        file: 'social-media-level-2-plan.pdf',
        type: 'pdf',
        description: 'Step-by-step roadmap for social media management service'
      },
      platformGuides: [
        { file: 'later-setup-guide.pdf', type: 'pdf', platform: 'Later' },
        { file: 'metricool-setup-guide.pdf', type: 'pdf', platform: 'Metricool' },
        { file: 'buffer-paid-setup-guide.pdf', type: 'pdf', platform: 'Buffer' }
      ],
      creativeFrameworks: [
        { file: 'client-onboarding-framework.pdf', type: 'pdf', name: 'Client Onboarding Framework' },
        { file: 'service-pricing-framework.pdf', type: 'pdf', name: 'Service Pricing Framework' }
      ],
      templates: [
        { file: 'content-calendar-template.xlsx', type: 'xlsx', name: 'Content Calendar Template' },
        { file: 'client-reporting-template.docx', type: 'docx', name: 'Client Reporting Template' },
        { file: 'client-onboarding-checklist.pdf', type: 'pdf', name: 'Client Onboarding Checklist' }
      ]
    },
    level3: {
      aiLeverage: 'We use Hootsuite, advanced analytics AI, and related workflow tools. This AI leverage supports running a social media agency with a lean team and enterprise-level results.',
      implementationPlan: {
        file: 'social-media-level-3-plan.pdf',
        type: 'pdf',
        description: 'Step-by-step roadmap for social media agency'
      },
      platformGuides: [
        { file: 'hootsuite-setup-guide.pdf', type: 'pdf', platform: 'Hootsuite' },
        { file: 'advanced-analytics-setup.pdf', type: 'pdf', platform: 'Analytics' }
      ],
      creativeFrameworks: [
        { file: 'agency-operations-framework.pdf', type: 'pdf', name: 'Agency Operations Framework' },
        { file: 'service-suite-development.pdf', type: 'pdf', name: 'Service Suite Development' }
      ],
      templates: [
        { file: 'team-management-templates.zip', type: 'zip', name: 'Team Management Templates' }
      ]
    }
  },
  'agency': {
    level1: {
      aiLeverage: 'We use ChatGPT, Claude, Canva AI, AI SEO tools (e.g. Jasper or similar), and AI ad-creation tools. This AI leverage allows a solo operator to deliver services that typically require 2-3 person teams.',
      implementationPlan: {
        file: 'agency-level-1-plan.pdf',
        type: 'pdf',
        description: 'Step-by-step roadmap for solo agency or one-person operation'
      },
      platformGuides: [
        { file: 'systeme-io-setup-guide.pdf', type: 'pdf', platform: 'Systeme.io' },
        { file: 'hubspot-free-setup.pdf', type: 'pdf', platform: 'HubSpot' },
        { file: 'clickup-free-setup.pdf', type: 'pdf', platform: 'ClickUp' },
        { file: 'hello-bonsai-setup.pdf', type: 'pdf', platform: 'Hello Bonsai' }
      ],
      creativeFrameworks: [
        { file: 'agency-niche-framework.pdf', type: 'pdf', name: 'Agency Niche Framework' },
        { file: 'service-package-framework.pdf', type: 'pdf', name: 'Service Package Framework' },
        { file: 'target-client-framework.pdf', type: 'pdf', name: 'Target Client Framework' }
      ],
      templates: [
        { file: 'client-onboarding-template.zip', type: 'zip', name: 'Client Onboarding Template' }
      ]
    },
    level2: {
      aiLeverage: 'We use ChatGPT, Claude, AI workflow automation, and related tools. This AI leverage supports scaling service delivery across your team and managing 5-10 clients with a 2-5 person team.',
      implementationPlan: {
        file: 'agency-level-2-plan.pdf',
        type: 'pdf',
        description: 'Step-by-step roadmap for small agency with 2-5 person team'
      },
      platformGuides: [
        { file: 'gohighlevel-setup-guide.pdf', type: 'pdf', platform: 'GoHighLevel' },
        { file: 'hubspot-paid-setup.pdf', type: 'pdf', platform: 'HubSpot' },
        { file: 'clickup-paid-setup.pdf', type: 'pdf', platform: 'ClickUp' },
        { file: 'zite-setup-guide.pdf', type: 'pdf', platform: 'Zite' }
      ],
      creativeFrameworks: [
        { file: 'team-management-framework.pdf', type: 'pdf', name: 'Team Management Framework' },
        { file: 'service-suite-development.pdf', type: 'pdf', name: 'Service Suite Development' },
        { file: 'client-retention-strategies.pdf', type: 'pdf', name: 'Client Retention Strategies' }
      ],
      templates: [
        { file: 'agency-operations-templates.zip', type: 'zip', name: 'Agency Operations Templates' }
      ]
    },
    level3: {
      aiLeverage: 'We use enterprise AI platforms, ChatGPT, Claude, and AI analytics tools. This AI leverage supports multi-service delivery and premium offerings.',
      implementationPlan: {
        file: 'agency-level-3-plan.pdf',
        type: 'pdf',
        description: 'Step-by-step roadmap for established agency with 5+ person team'
      },
      platformGuides: [
        { file: 'gohighlevel-enterprise-setup.pdf', type: 'pdf', platform: 'GoHighLevel' },
        { file: 'enterprise-platform-setup.pdf', type: 'pdf', platform: 'Enterprise Platforms' }
      ],
      creativeFrameworks: [
        { file: 'enterprise-operations-framework.pdf', type: 'pdf', name: 'Enterprise Operations Framework' },
        { file: 'team-scaling-guide.pdf', type: 'pdf', name: 'Team Scaling Guide' },
        { file: 'enterprise-service-development.pdf', type: 'pdf', name: 'Enterprise Service Development' }
      ],
      templates: [
        { file: 'enterprise-templates.zip', type: 'zip', name: 'Enterprise Templates' }
      ]
    }
  },
  'freelancing': {
    level1: {
      aiLeverage: 'We use ChatGPT, Claude, Canva AI, and Fiverr\'s AI features. This AI leverage supports part-time freelancing and helps you deliver work 2-3x faster.',
      implementationPlan: {
        file: 'freelancing-level-1-plan.pdf',
        type: 'pdf',
        description: 'Step-by-step roadmap for side hustle or part-time freelancing'
      },
      platformGuides: [
        { file: 'fiverr-profile-setup-guide.pdf', type: 'pdf', platform: 'Fiverr' },
        { file: 'hello-bonsai-setup-guide.pdf', type: 'pdf', platform: 'Hello Bonsai' },
        { file: 'paypal-setup-guide.pdf', type: 'pdf', platform: 'PayPal' }
      ],
      creativeFrameworks: [
        { file: 'service-definition-framework.pdf', type: 'pdf', name: 'Service Definition Framework' },
        { file: 'portfolio-creation-framework.pdf', type: 'pdf', name: 'Portfolio Creation Framework' },
        { file: 'pricing-strategy-worksheet.pdf', type: 'pdf', name: 'Pricing Strategy Worksheet' }
      ],
      templates: [
        { file: 'gig-listing-template.md', type: 'md', name: 'Gig Listing Template' },
        { file: 'portfolio-showcase-template.md', type: 'md', name: 'Portfolio Showcase Template' }
      ],
      launchMarketing: [
        { file: 'freelancing-level-1-first-client-acquisition-guide.pdf', type: 'pdf', name: 'First Client Acquisition Guide' },
        { file: 'freelancing-level-1-profile-optimization-checklist.pdf', type: 'pdf', name: 'Profile Optimization Checklist' }
      ],
      troubleshooting: [
        { file: 'freelancing-level-1-common-freelancing-issues.pdf', type: 'pdf', name: 'Common Freelancing Issues' }
      ],
      planning: [
        { file: 'freelancing-level-1-side-hustle-budget-planner.pdf', type: 'pdf', name: 'Side Hustle Budget Planner' },
        { file: 'freelancing-level-1-pricing-calculator-worksheet.pdf', type: 'pdf', name: 'Pricing Calculator Worksheet' }
      ]
    },
    level2: {
      aiLeverage: 'We use ChatGPT, Claude, proposal and contract AI tools, and communication automation. This AI leverage supports full-time freelancing and taking on 2-3x more clients.',
      implementationPlan: {
        file: 'freelancing-level-2-plan.pdf',
        type: 'pdf',
        description: 'Step-by-step roadmap for full-time freelancing business'
      },
      platformGuides: [
        { file: 'upwork-setup-guide.pdf', type: 'pdf', platform: 'Upwork' },
        { file: 'hello-bonsai-paid-setup.pdf', type: 'pdf', platform: 'Hello Bonsai' },
        { file: 'stripe-setup-guide.pdf', type: 'pdf', platform: 'Stripe' },
        { file: 'google-workspace-setup.pdf', type: 'pdf', platform: 'Google Workspace' }
      ],
      creativeFrameworks: [
        { file: 'professional-portfolio-framework.pdf', type: 'pdf', name: 'Professional Portfolio Framework' },
        { file: 'pricing-strategy-advanced.pdf', type: 'pdf', name: 'Pricing Strategy Advanced' }
      ],
      templates: [
        { file: 'proposal-templates.zip', type: 'zip', name: 'Proposal Templates' },
        { file: 'contract-templates.zip', type: 'zip', name: 'Contract Templates' },
        { file: 'client-communication-templates.md', type: 'md', name: 'Client Communication Templates' }
      ],
      launchMarketing: [
        { file: 'freelancing-level-2-client-acquisition-strategies.pdf', type: 'pdf', name: 'Client Acquisition Strategies' },
        { file: 'freelancing-level-2-portfolio-promotion-guide.pdf', type: 'pdf', name: 'Portfolio Promotion Guide' }
      ],
      troubleshooting: [
        { file: 'freelancing-level-2-client-management-issues.pdf', type: 'pdf', name: 'Client Management Issues' }
      ],
      planning: [
        { file: 'freelancing-level-2-full-time-budget-planner.pdf', type: 'pdf', name: 'Full-Time Freelancer Budget Planner' },
        { file: 'freelancing-level-2-pricing-scaling-strategy.pdf', type: 'pdf', name: 'Pricing Scaling Strategy' }
      ]
    },
    level3: {
      aiLeverage: 'We use ChatGPT, Claude, advanced AI platforms, and direct-client AI systems. This AI leverage supports premium consulting and positioning.',
      implementationPlan: {
        file: 'freelancing-level-3-plan.pdf',
        type: 'pdf',
        description: 'Step-by-step roadmap for premium freelancing or consultant'
      },
      platformGuides: [
        { file: 'premium-platform-guide.pdf', type: 'pdf', platform: 'Premium Platforms' },
        { file: 'direct-client-acquisition-guide.pdf', type: 'pdf', platform: 'Direct Client Acquisition' },
        { file: 'crm-setup-guide.pdf', type: 'pdf', platform: 'CRM' }
      ],
      creativeFrameworks: [
        { file: 'consultant-positioning-framework.pdf', type: 'pdf', name: 'Consultant Positioning Framework' },
        { file: 'direct-client-framework.pdf', type: 'pdf', name: 'Direct Client Framework' }
      ],
      templates: [
        { file: 'business-systems-templates.zip', type: 'zip', name: 'Business Systems Templates' }
      ],
      launchMarketing: [
        { file: 'freelancing-level-3-premium-positioning-guide.pdf', type: 'pdf', name: 'Premium Positioning Guide' },
        { file: 'freelancing-level-3-partnership-strategies.pdf', type: 'pdf', name: 'Partnership Strategies' }
      ],
      troubleshooting: [
        { file: 'freelancing-level-3-advanced-business-challenges.pdf', type: 'pdf', name: 'Advanced Business Challenges' }
      ],
      planning: [
        { file: 'freelancing-level-3-premium-pricing-models.pdf', type: 'pdf', name: 'Premium Pricing Models' },
        { file: 'freelancing-level-3-business-financial-planning.pdf', type: 'pdf', name: 'Business Financial Planning' }
      ]
    }
  }
};

/**
 * Get level content for a package, merging database data with static content
 */
export function getLevelContent(
  packageSlug: string,
  levelNumber: 1 | 2 | 3,
  databaseLevel?: any
): LevelContent | null {
  const packageContent = packageLevelContent[packageSlug];
  if (!packageContent) {
    return null;
  }

  const staticContent = packageContent[`level${levelNumber}` as keyof PackageLevelContent] as LevelContent;
  if (!staticContent) {
    return null;
  }

  // If database has data, merge it with static content (database takes precedence)
  if (databaseLevel) {
    return {
      aiLeverage: databaseLevel.aiLeverage ?? staticContent.aiLeverage,
      implementationPlan: databaseLevel.implementationPlan?.file
        ? databaseLevel.implementationPlan
        : staticContent.implementationPlan,
      platformGuides: databaseLevel.platformGuides?.length > 0
        ? databaseLevel.platformGuides
        : staticContent.platformGuides,
      creativeFrameworks: databaseLevel.creativeFrameworks?.length > 0
        ? databaseLevel.creativeFrameworks
        : staticContent.creativeFrameworks,
      templates: databaseLevel.templates?.length > 0
        ? databaseLevel.templates
        : staticContent.templates,
      launchMarketing:
        databaseLevel.launchMarketing?.length > 0
          ? databaseLevel.launchMarketing
          : staticContent.launchMarketing,
      troubleshooting:
        databaseLevel.troubleshooting?.length > 0
          ? databaseLevel.troubleshooting
          : staticContent.troubleshooting,
      planning:
        databaseLevel.planning?.length > 0
          ? databaseLevel.planning
          : staticContent.planning,
    };
  }

  return staticContent;
}
