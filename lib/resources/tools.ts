/**
 * Tools & Templates data
 * Ready-to-use templates, tools, and resources
 */

import type { Tool } from './types';

export const tools: Tool[] = [
  {
    id: '1',
    slug: 'ai-prompt-library',
    title: 'AI Prompt Library',
    description: 'Comprehensive collection of 500+ tested AI prompts for various use cases.',
    category: 'Prompts',
    tags: ['prompts', 'ai-tools', 'templates'],
    type: 'tool',
    filePath: 'resources/tools/ai-prompt-library.json',
    fileName: 'ai-prompt-library.json',
    fileSize: 245760, // 240 KB
    fileType: 'application/json',
    downloadCount: 1250,
    instructions: `# AI Prompt Library Usage

## Installation

1. Download the JSON file
2. Import into your project
3. Use prompts based on your needs

## Structure

The library contains prompts organized by category:
- Content Creation
- Business Operations
- Development
- Marketing
- Customer Service

## Example Usage

\`\`\`javascript
import prompts from './ai-prompt-library.json';

const contentPrompt = prompts.contentCreation.blogPost;
// Use with your AI API
\`\`\`

## Best Practices

- Customize prompts for your specific needs
- Test prompts before production use
- Keep prompts updated with latest best practices
- Share improvements with the community`,
    previewImage: '/images/tools/prompt-library.jpg',
    requiresAuth: true,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  },
  {
    id: '2',
    slug: 'social-media-content-calendar',
    title: 'Social Media Content Calendar Template',
    description: 'Excel template for planning and scheduling social media content across platforms.',
    category: 'Marketing',
    tags: ['social-media', 'marketing', 'templates'],
    type: 'template',
    filePath: 'resources/tools/social-media-calendar.xlsx',
    fileName: 'social-media-calendar.xlsx',
    fileSize: 51200, // 50 KB
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    downloadCount: 890,
    instructions: `# Social Media Content Calendar Template

## Features

- Monthly and weekly views
- Multi-platform support (Instagram, Twitter, Facebook, LinkedIn)
- Content type categorization
- Hashtag planning
- Engagement tracking

## How to Use

1. Open the Excel file
2. Customize platforms and dates
3. Plan your content in advance
4. Track performance metrics
5. Adjust strategy based on results

## Tips

- Plan at least 2 weeks in advance
- Mix content types (educational, entertaining, promotional)
- Use consistent branding
- Schedule optimal posting times
- Monitor and adjust based on engagement`,
    previewImage: '/images/tools/content-calendar.jpg',
    requiresAuth: true,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    slug: 'client-proposal-template',
    title: 'Client Proposal Template',
    description: 'Professional proposal template for agencies and freelancers with AI-enhanced sections.',
    category: 'Business',
    tags: ['proposals', 'business', 'templates'],
    type: 'template',
    filePath: 'resources/tools/client-proposal.docx',
    fileName: 'client-proposal.docx',
    fileSize: 153600, // 150 KB
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    downloadCount: 2100,
    instructions: `# Client Proposal Template

## Sections Included

1. Executive Summary
2. Problem Statement
3. Proposed Solution
4. Timeline and Milestones
5. Pricing and Packages
6. Team and Expertise
7. Case Studies
8. Next Steps

## Customization Guide

1. Replace placeholder text with your information
2. Add your company branding
3. Customize pricing sections
4. Include relevant case studies
5. Adjust timeline to match project scope

## AI Enhancement Tips

- Use AI to generate problem statements
- Create compelling value propositions
- Generate case study summaries
- Write persuasive call-to-actions

## Best Practices

- Keep proposals concise (10-15 pages)
- Focus on client benefits
- Use visuals and examples
- Include clear pricing
- Set specific next steps`,
    previewImage: '/images/tools/proposal-template.jpg',
    requiresAuth: true,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18'
  },
  {
    id: '4',
    slug: 'web-app-starter-kit',
    title: 'Web App Starter Kit',
    description: 'Complete starter kit for building AI-powered web applications with Next.js and TypeScript.',
    category: 'Development',
    tags: ['development', 'starter-kit', 'nextjs'],
    type: 'tool',
    filePath: 'resources/tools/web-app-starter.zip',
    fileName: 'web-app-starter.zip',
    fileSize: 2097152, // 2 MB
    fileType: 'application/zip',
    downloadCount: 560,
    instructions: `# Web App Starter Kit

## What's Included

- Next.js 14+ setup with TypeScript
- AI API integration examples
- Authentication setup
- Database configuration
- UI components library
- Deployment configurations

## Getting Started

1. Extract the ZIP file
2. Install dependencies: \`npm install\`
3. Set up environment variables
4. Configure your AI API keys
5. Run development server: \`npm run dev\`

## Features

- Type-safe API calls
- Error handling patterns
- Loading states
- Responsive design
- Dark mode support

## Customization

- Replace placeholder content
- Add your branding
- Configure your AI provider
- Set up your database
- Customize UI components

## Documentation

See included README.md for detailed setup instructions.`,
    previewImage: '/images/tools/starter-kit.jpg',
    requiresAuth: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },
  {
    id: '5',
    slug: 'email-template-collection',
    title: 'Email Template Collection',
    description: '50+ professional email templates for business communication, marketing, and customer service.',
    category: 'Communication',
    tags: ['email', 'templates', 'communication'],
    type: 'template',
    filePath: 'resources/tools/email-templates.zip',
    fileName: 'email-templates.zip',
    fileSize: 1024000, // 1 MB
    fileType: 'application/zip',
    downloadCount: 1750,
    instructions: `# Email Template Collection

## Template Categories

- Welcome emails
- Onboarding sequences
- Product announcements
- Customer service responses
- Follow-up emails
- Newsletter templates
- Transactional emails

## Usage

1. Extract the templates
2. Choose appropriate template
3. Customize with your content
4. Test before sending
5. Track performance

## Customization Tips

- Personalize with recipient names
- Add your branding
- Include clear call-to-actions
- Optimize for mobile
- A/B test subject lines

## Best Practices

- Keep subject lines concise
- Use clear, scannable formatting
- Include unsubscribe options
- Test across email clients
- Monitor open and click rates`,
    previewImage: '/images/tools/email-templates.jpg',
    requiresAuth: true,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10'
  }
];

/**
 * Get tool by slug
 */
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug);
}

/**
 * Get tools by type
 */
export function getToolsByType(type: 'tool' | 'template'): Tool[] {
  return tools.filter(tool => tool.type === type);
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): Tool[] {
  return tools.filter(tool => tool.category === category);
}

/**
 * Get tools by tag
 */
export function getToolsByTag(tag: string): Tool[] {
  return tools.filter(tool => tool.tags.includes(tag));
}

/**
 * Search tools
 */
export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return tools.filter(tool =>
    tool.title.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.instructions.toLowerCase().includes(lowerQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(tools.map(tool => tool.category)));
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  return Array.from(new Set(tools.flatMap(tool => tool.tags)));
}
