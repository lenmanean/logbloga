/**
 * Case Studies data
 * Real-world examples and success stories
 */

import type { CaseStudy } from './types';

export const caseStudies: CaseStudy[] = [
  {
    id: '1',
    slug: 'doer-ai-goal-achievement-platform',
    title: 'DOER: Building an AI-Powered Goal Achievement Platform',
    description: 'How DOER was built using AI to USD principles to create a production-ready SaaS platform that transforms goals into actionable plans.',
    category: 'Web Apps',
    tags: ['web-apps', 'saas', 'ai-integration', 'product-development'],
    content: `# DOER: Building an AI-Powered Goal Achievement Platform

## Background

DOER is an AI-powered goal achievement platform that transforms user goals into structured, actionable plans. Built using principles and methodologies from the AI to USD Web Apps package, DOER demonstrates how AI can be leveraged to create production-ready SaaS applications that generate real value.

## The Vision

The goal was to create a platform that could take any user goal—from "Learn to play guitar" to "Start a business"—and automatically generate a personalized plan with tasks, checkpoints, and timelines. This required sophisticated AI integration, smart scheduling algorithms, and seamless calendar integrations.

## Challenge

Building a platform like DOER presented several challenges:

- **AI Integration Complexity**: Implementing AI that could understand natural language goals and break them down into actionable tasks
- **Smart Scheduling**: Creating an intelligent scheduler that considers dependencies, priorities, and user availability
- **Calendar Synchronization**: Integrating with multiple calendar platforms (Google Calendar, Outlook, Apple Calendar) while maintaining data consistency
- **Real-time Updates**: Ensuring that plan changes and rescheduling happen instantly across all integrated platforms
- **Scalability**: Building a system that could handle thousands of concurrent users and plans

## Solution: AI to USD Approach

DOER was developed following the structured approach outlined in the AI to USD Web Apps package:

### Level 1: Foundation
- Built core AI plan generation functionality
- Implemented basic task management and scheduling
- Created user authentication and plan storage

### Level 2: Advanced Features
- Developed smart scheduling algorithms with dependency resolution
- Integrated multiple calendar platforms
- Added progress tracking and health score systems
- Implemented auto-rescheduling capabilities

### Level 3: Enterprise Features
- Built comprehensive API for third-party integrations
- Added integrations with task management tools (Todoist, Asana, Trello, etc.)
- Implemented analytics and insights dashboard
- Created team collaboration features

## Key Features Implemented

### AI Plan Generation
DOER uses advanced AI to analyze goals, break them down into actionable tasks, estimate timelines, and create personalized roadmaps. The AI considers complexity, dependencies, and realistic scheduling.

### Smart Scheduling & Auto-Rescheduling
The AI-powered scheduler analyzes available time, task priorities, and dependencies to automatically place tasks in calendars. It considers work hours, existing commitments, and optimal productivity patterns.

### Calendar Integrations
DOER seamlessly integrates with Google Calendar, Outlook, and Apple Calendar, keeping tasks synchronized as calendar events and respecting existing commitments.

### Progress Tracking
Real-time progress tracking with health scores (0-100) that reflect how well users maintain their commitments. The system provides analytics and insights to help users optimize their approach.

### Extensive Integrations
DOER connects with popular tools including Todoist, Asana, Trello, Notion, Slack, Strava, and more, creating a unified workflow ecosystem.

## Technical Implementation

The platform was built using modern web technologies and AI tools, following the implementation plans and best practices from the AI to USD packages. Key technical achievements include:

- **AI-Powered Goal Analysis**: Natural language processing to understand user intent
- **Dependency Resolution**: Complex algorithm to handle task dependencies and conflicts
- **Real-time Synchronization**: Bidirectional sync with multiple calendar and task management platforms
- **Scalable Architecture**: Built to handle growth from individual users to enterprise teams

## Results

DOER successfully launched as a production-ready SaaS platform, demonstrating the power of AI to USD methodologies:

- **Platform Launch**: Successfully deployed and available at usedoer.com
- **User Adoption**: Growing user base leveraging AI-powered goal achievement
- **Integration Ecosystem**: Comprehensive integrations with major productivity tools
- **Proven Methodology**: Validates the AI to USD approach for building AI-powered SaaS applications

## Impact

DOER serves as a real-world example of how the AI to USD Web Apps package can be used to build sophisticated, AI-powered applications. It demonstrates:

- How AI can be integrated into production applications
- The value of structured implementation plans and level-based progression
- The importance of comprehensive resources and templates
- How AI-powered tools can create real business value

The platform continues to evolve, with new features and integrations being added based on user feedback and the ongoing application of AI to USD principles.`,
    company: 'DOER',
    industry: 'SaaS',
    outcome: 'Production-ready AI-powered SaaS platform successfully launched, demonstrating real-world application of AI to USD principles',
    testimonial: 'Building DOER using the AI to USD Web Apps package provided the structured approach, resources, and implementation plans needed to create a sophisticated AI-powered platform. The level-based progression and comprehensive templates were invaluable in going from concept to production.',
    featuredImage: '/usedoer_favicon.png',
    results: [
      { metric: 'Platform Status', value: 'Production Ready' },
      { metric: 'AI Integration', value: 'Advanced Goal Analysis & Scheduling' },
      { metric: 'Calendar Integrations', value: 'Google, Outlook, Apple Calendar' },
      { metric: 'Task Management Integrations', value: 'Todoist, Asana, Trello, Notion' },
      { metric: 'API Availability', value: 'REST API with Full Documentation' }
    ],
    createdAt: '2024-01-15',
    updatedAt: '2025-01-25'
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
