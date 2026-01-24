/**
 * Package Level Content Data
 * 
 * This file contains the complete content structure for each level of each package.
 * Used to display accurate content information when database data is incomplete.
 * 
 * Data sourced from COMPLETE_PACKAGE_AND_PRODUCT_RUNDOWN.md
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
}

export interface PackageLevelContent {
  level1: LevelContent;
  level2: LevelContent;
  level3: LevelContent;
}

export const packageLevelContent: Record<string, PackageLevelContent> = {
  'web-apps': {
    level1: {
      aiLeverage: 'Use ChatGPT and Cursor to generate landing page code 3-5x faster than manual coding. Cursor\'s AI-assisted development helps you build a functional Stripe-integrated landing page in 2-4 weeks instead of 6-8 weeks. This speed-to-market enables you to launch and start generating $500-$2,000/month revenue within the first month. AI handles repetitive code patterns, error debugging, and copy optimization, allowing you to focus on business logic and customer acquisition. GitHub Copilot assists with boilerplate code generation, while ChatGPT helps with copywriting, user flow design, and marketing messaging.',
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
      ]
    },
    level2: {
      aiLeverage: 'Leverage AI for rapid MVP development: Cursor generates Supabase schema patterns, ChatGPT helps design authentication flows, and Claude assists with API endpoint planning. This AI-assisted development reduces build time from 12-16 weeks to 6-8 weeks, enabling faster market entry. The $2,000-$8,000/month revenue target is achievable because AI handles 40-60% of boilerplate code, allowing you to focus on unique value propositions and user acquisition. GitHub Copilot accelerates feature development, while optional OpenAI API integration enables basic AI features that differentiate your SaaS from competitors.',
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
      ]
    },
    level3: {
      aiLeverage: 'AI is both a development tool AND a product feature. Use Cursor and Claude for complex architecture design, integrate OpenAI and Anthropic APIs to build AI-powered features (chatbots, recommendation systems, automation) that differentiate your SaaS. This dual AI leverage (development + product) enables building enterprise-grade platforms that command $10,000-$50,000+/month revenue. AI accelerates development while AI features create premium pricing and competitive moats. GitHub Copilot handles advanced code patterns, and AI-powered debugging tools optimize performance at scale.',
      implementationPlan: {
        file: 'web-apps-level-3-plan.md',
        type: 'md',
        description: 'Step-by-step roadmap for building a complex SaaS like Doer'
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
      ]
    }
  },
  'social-media': {
    level1: {
      aiLeverage: 'Use ChatGPT for daily content ideation and caption writing, Canva AI for image creation, and Claude for brand voice consistency. This AI-powered content creation enables producing 30+ posts per month in 5-10 hours instead of 20-30 hours. The $300-$1,000/month revenue comes from monetizing your personal brand through affiliate marketing, sponsored content, and product sales - all made possible by AI\'s content multiplication effect. Optional tools like Midjourney or DALL-E can create unique visuals, while AI hashtag research tools optimize discoverability.',
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
      aiLeverage: 'Scale content creation for multiple clients using AI: ChatGPT generates client-specific content batches, Canva AI creates branded visuals, and automation tools schedule everything. This AI leverage allows managing 3-5 clients simultaneously, generating $1,000-$3,000/month. AI\'s content multiplication (one hour of AI-assisted work = 10 hours of manual work) is the core revenue driver. Buffer AI features and Later AI optimize posting times, while AI-powered reporting tools create professional client reports that justify premium pricing.',
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
      aiLeverage: 'AI powers the entire agency operation: content strategy at scale, team efficiency through AI-assisted workflows, and premium services (AI-powered analytics, competitive intelligence) that command $3,000-$10,000+/month per client. AI enables the agency to deliver enterprise-level results with a lean team, maximizing profit margins. Hootsuite AI features automate complex multi-platform campaigns, advanced analytics AI provides strategic insights, and AI workflow tools train and scale your team efficiently.',
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
      aiLeverage: 'AI is your service delivery engine: ChatGPT and Claude for content creation, AI SEO tools (like Jasper or specialized SEO AI) for optimization, AI ad creation tools for campaign development. This AI leverage allows a solo operator to deliver services that typically require 2-3 person teams, enabling $2,000-$5,000/month revenue. AI handles 60-70% of service delivery work, allowing you to focus on client relationships and business development. Canva AI accelerates design work, while AI proposal tools help you win more clients.',
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
      aiLeverage: 'AI standardizes and scales service delivery across your team: AI-powered SOPs ensure consistency, AI training systems onboard new hires faster, and AI quality control maintains standards. This enables managing 5-10 clients simultaneously with a 2-5 person team, generating $5,000-$15,000/month. AI is the force multiplier that allows small teams to compete with larger agencies. ChatGPT and Claude create team workflows, AI workflow automation tools streamline operations, and AI quality control systems ensure every deliverable meets agency standards.',
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
      aiLeverage: 'AI enables enterprise-level service delivery: AI-powered multi-service offerings, AI-driven client management systems, and premium AI-enhanced services (AI strategy consulting, AI implementation) that command $15,000-$50,000+/month per client. AI is both operational efficiency and a premium service offering, maximizing revenue per client and profit margins. Enterprise AI platforms automate complex workflows, ChatGPT and Claude provide strategic consulting capabilities, and AI analytics platforms deliver insights that justify premium pricing.',
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
      aiLeverage: 'Use ChatGPT to write compelling Fiverr gig descriptions and portfolio copy, Claude for service delivery templates, and Canva AI for portfolio visuals. This AI leverage enables delivering high-quality work 2-3x faster, allowing you to complete more gigs and generate $500-$1,500/month part-time. AI makes freelancing accessible by reducing skill barriers and time investment. Fiverr\'s AI features help optimize your gig listings, while AI service delivery templates ensure consistent quality that builds your reputation.',
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
      ]
    },
    level2: {
      aiLeverage: 'AI powers professional freelancing: ChatGPT and Claude generate winning proposals and contracts, AI communication tools handle client updates, and AI-assisted service delivery enables taking on 2-3x more clients. This AI leverage transforms freelancing from gig work to a full-time business generating $1,500-$4,000/month. AI handles administrative overhead, allowing focus on high-value work. Proposal AI tools create professional documents quickly, contract AI ensures legal compliance, and AI communication automation maintains client relationships while you focus on delivery.',
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
      ]
    },
    level3: {
      aiLeverage: 'AI enables premium positioning: use ChatGPT and Claude for thought leadership content, AI platforms for high-value deliverables (AI strategy, AI implementation consulting), and AI systems for direct client acquisition. This AI leverage transforms freelancing into premium consulting, commanding $4,000-$10,000+/month through AI-enhanced services and positioning. AI is both the delivery method and the value proposition. Advanced AI platforms enable complex consulting deliverables, AI positioning tools establish your expertise, and direct client AI systems help you bypass platforms to work with high-value clients directly.',
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
    };
  }

  return staticContent;
}
