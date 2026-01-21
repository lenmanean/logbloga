/**
 * Case Studies data
 * Real-world examples and success stories
 */

import type { CaseStudy } from './types';

export const caseStudies: CaseStudy[] = [
  {
    id: '1',
    slug: 'ecommerce-automation-success',
    title: 'E-commerce Automation Success Story',
    description: 'How a small e-commerce business increased revenue by 300% using AI automation tools.',
    category: 'E-commerce',
    tags: ['automation', 'ecommerce', 'revenue-growth'],
    content: `# E-commerce Automation Success Story

## Background

A small e-commerce business specializing in handmade crafts was struggling with manual order processing, customer service, and marketing. The team of 5 was overwhelmed with repetitive tasks.

## Challenge

- Manual order processing taking 4+ hours daily
- Customer service response time averaging 24 hours
- Limited marketing reach due to time constraints
- High employee turnover due to repetitive work

## Solution

The business implemented AI-powered automation tools:

### 1. Order Processing Automation
- Automated order confirmation emails
- Inventory management integration
- Shipping label generation
- Tracking number updates

### 2. Customer Service AI
- Chatbot for common inquiries
- Automated FAQ responses
- Smart ticket routing
- Response time reduced to under 2 hours

### 3. Marketing Automation
- AI-generated product descriptions
- Automated social media posts
- Personalized email campaigns
- Dynamic pricing optimization

## Implementation Timeline

- **Month 1**: Order processing automation
- **Month 2**: Customer service AI integration
- **Month 3**: Marketing automation setup
- **Month 4**: Optimization and refinement

## Results

The implementation led to significant improvements across all metrics.`,
    company: 'Crafty Creations',
    industry: 'E-commerce',
    outcome: '300% revenue increase, 80% time savings, improved customer satisfaction',
    testimonial: 'AI automation transformed our business. We went from struggling to keep up to scaling rapidly while maintaining quality. The time savings allowed us to focus on product development and customer relationships.',
    featuredImage: '/images/case-studies/ecommerce.jpg',
    results: [
      { metric: 'Revenue Increase', value: '300%' },
      { metric: 'Time Saved', value: '80%' },
      { metric: 'Customer Satisfaction', value: '4.8/5' },
      { metric: 'Response Time', value: '2 hours (from 24 hours)' },
      { metric: 'Order Processing Time', value: '5 minutes (from 4 hours)' }
    ],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '2',
    slug: 'agency-client-acquisition',
    title: 'Digital Agency Client Acquisition Success',
    description: 'How a digital agency used AI tools to acquire 50+ new clients in 6 months.',
    category: 'Agency',
    tags: ['agency', 'client-acquisition', 'growth'],
    content: `# Digital Agency Client Acquisition Success

## Background

A mid-size digital agency was struggling with client acquisition. Traditional methods were expensive and yielded low conversion rates.

## Challenge

- High cost per acquisition ($500+)
- Long sales cycles (3-6 months)
- Limited qualified leads
- Inconsistent messaging

## Solution

The agency implemented AI-powered tools for:

### 1. Lead Generation
- AI-powered market research
- Automated prospect identification
- Personalized outreach campaigns
- Smart lead scoring

### 2. Content Creation
- AI-generated proposals
- Automated case study creation
- Social media content automation
- Email campaign optimization

### 3. Sales Automation
- Automated follow-up sequences
- Smart scheduling and reminders
- Proposal generation
- Contract template automation

## Results

The agency achieved remarkable growth in client acquisition.`,
    company: 'Digital Solutions Agency',
    industry: 'Digital Marketing',
    outcome: '50+ new clients, 60% cost reduction, 50% faster sales cycle',
    testimonial: 'AI tools revolutionized our client acquisition process. We're now able to reach more prospects with personalized messaging at a fraction of the cost.',
    featuredImage: '/images/case-studies/agency.jpg',
    results: [
      { metric: 'New Clients', value: '50+' },
      { metric: 'Cost Reduction', value: '60%' },
      { metric: 'Sales Cycle', value: '1.5 months (from 3-6 months)' },
      { metric: 'Conversion Rate', value: '15% (from 5%)' },
      { metric: 'ROI', value: '400%' }
    ],
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  },
  {
    id: '3',
    slug: 'freelancer-productivity-boost',
    title: 'Freelancer Productivity Boost',
    description: 'How a freelance designer increased productivity by 200% using AI tools.',
    category: 'Freelancing',
    tags: ['freelancing', 'productivity', 'automation'],
    content: `# Freelancer Productivity Boost

## Background

A freelance graphic designer was working 60+ hour weeks but struggling to increase income. Manual tasks were consuming too much time.

## Challenge

- Time-consuming client communication
- Repetitive design tasks
- Proposal writing taking hours
- Limited time for actual design work

## Solution

The freelancer integrated AI tools into their workflow:

### 1. Communication Automation
- AI-powered email responses
- Automated project updates
- Smart scheduling
- Contract generation

### 2. Design Assistance
- AI design suggestions
- Automated asset organization
- Template generation
- Color palette suggestions

### 3. Business Automation
- Proposal generation
- Invoice automation
- Time tracking integration
- Client onboarding automation

## Results

The freelancer dramatically improved productivity and work-life balance.`,
    company: 'Independent Designer',
    industry: 'Freelancing',
    outcome: '200% productivity increase, 30% income growth, better work-life balance',
    testimonial: 'AI tools gave me my life back. I can now focus on creative work while automation handles the business side. I work fewer hours but earn more.',
    featuredImage: '/images/case-studies/freelancer.jpg',
    results: [
      { metric: 'Productivity Increase', value: '200%' },
      { metric: 'Income Growth', value: '30%' },
      { metric: 'Hours Worked', value: '40 hours (from 60+)' },
      { metric: 'Client Satisfaction', value: '4.9/5' },
      { metric: 'Project Completion Time', value: '50% faster' }
    ],
    createdAt: '2024-02-05',
    updatedAt: '2024-02-05'
  }
];

/**
 * Get case study by slug
 */
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(study => study.slug === slug);
}

/**
 * Get case studies by industry
 */
export function getCaseStudiesByIndustry(industry: string): CaseStudy[] {
  return caseStudies.filter(study => study.industry === industry);
}

/**
 * Get case studies by category
 */
export function getCaseStudiesByCategory(category: string): CaseStudy[] {
  return caseStudies.filter(study => study.category === category);
}

/**
 * Get case studies by tag
 */
export function getCaseStudiesByTag(tag: string): CaseStudy[] {
  return caseStudies.filter(study => study.tags.includes(tag));
}

/**
 * Search case studies
 */
export function searchCaseStudies(query: string): CaseStudy[] {
  const lowerQuery = query.toLowerCase();
  return caseStudies.filter(study =>
    study.title.toLowerCase().includes(lowerQuery) ||
    study.description.toLowerCase().includes(lowerQuery) ||
    study.content.toLowerCase().includes(lowerQuery) ||
    study.company?.toLowerCase().includes(lowerQuery) ||
    study.industry.toLowerCase().includes(lowerQuery) ||
    study.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get all unique industries
 */
export function getAllIndustries(): string[] {
  return Array.from(new Set(caseStudies.map(study => study.industry)));
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(caseStudies.map(study => study.category)));
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  return Array.from(new Set(caseStudies.flatMap(study => study.tags)));
}
