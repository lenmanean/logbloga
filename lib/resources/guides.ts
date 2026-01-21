/**
 * Guides data
 * Step-by-step tutorials and comprehensive guides
 */

import type { Guide } from './types';

export const guides: Guide[] = [
  {
    id: '1',
    slug: 'getting-started-with-ai-tools',
    title: 'Getting Started with AI Tools',
    description: 'A comprehensive beginner\'s guide to understanding and using AI tools effectively in your workflow.',
    category: 'Getting Started',
    tags: ['beginner', 'ai-tools', 'tutorial'],
    content: `# Getting Started with AI Tools

Artificial Intelligence tools have revolutionized how we work, create, and solve problems. This guide will help you understand the fundamentals and get started with AI tools.

## What are AI Tools?

AI tools are software applications that use artificial intelligence to perform tasks that typically require human intelligence. These include:

- **Content Generation**: Creating text, images, and videos
- **Data Analysis**: Processing and analyzing large datasets
- **Automation**: Automating repetitive tasks
- **Decision Making**: Providing insights and recommendations

## Getting Started

### Step 1: Choose Your First AI Tool

Start with tools that match your needs:
- **Content Creation**: ChatGPT, Claude, Midjourney
- **Productivity**: Notion AI, Grammarly
- **Development**: GitHub Copilot, Cursor

### Step 2: Set Up Your Account

Most AI tools require:
- Email registration
- Basic profile setup
- Understanding of pricing plans

### Step 3: Learn the Basics

Take time to:
- Read documentation
- Try example prompts
- Experiment with features

## Best Practices

1. **Start Simple**: Begin with basic tasks before moving to complex workflows
2. **Iterate**: Refine your prompts based on results
3. **Combine Tools**: Use multiple AI tools together for better results
4. **Stay Updated**: AI tools evolve rapidly, keep learning

## Common Mistakes to Avoid

- Over-relying on AI without understanding outputs
- Not verifying AI-generated content
- Ignoring privacy and security considerations
- Expecting perfect results immediately

## Next Steps

Once you're comfortable with basic AI tools, explore:
- Advanced prompt engineering
- Workflow automation
- Integration with existing tools
- Custom AI solutions

## Resources

- [AI Tool Directory](https://example.com/ai-tools)
- [Prompt Engineering Guide](/resources/guides/prompt-engineering)
- [AI Ethics Best Practices](/resources/guides/ai-ethics)`,
    steps: [
      'Choose an AI tool that matches your needs',
      'Create an account and complete setup',
      'Explore basic features and try example prompts',
      'Start with simple tasks and gradually increase complexity',
      'Join communities to learn from others',
      'Stay updated with new features and best practices'
    ],
    difficulty: 'beginner',
    estimatedTime: '30 minutes',
    featuredImage: '/images/guides/ai-tools.jpg',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    slug: 'prompt-engineering-basics',
    title: 'Prompt Engineering Basics',
    description: 'Learn how to craft effective prompts to get the best results from AI tools.',
    category: 'AI Techniques',
    tags: ['intermediate', 'prompting', 'ai-techniques'],
    content: `# Prompt Engineering Basics

Prompt engineering is the art and science of crafting inputs to get desired outputs from AI models. This guide covers the fundamentals.

## Understanding Prompts

A prompt is the input you give to an AI model. The quality of your prompt directly affects the quality of the output.

### Key Elements of Good Prompts

1. **Clarity**: Be specific about what you want
2. **Context**: Provide relevant background information
3. **Format**: Specify the desired output format
4. **Constraints**: Set boundaries and limitations

## Prompt Structures

### Basic Prompt
\`\`\`
Write a blog post about AI
\`\`\`

### Enhanced Prompt
\`\`\`
Write a 1000-word blog post about AI for beginners. 
Include an introduction, three main sections, and a conclusion.
Use a friendly, conversational tone.
\`\`\`

## Advanced Techniques

### Chain of Thought
Break complex tasks into steps:
\`\`\`
First, analyze the problem. Then, identify potential solutions. 
Finally, recommend the best approach with reasoning.
\`\`\`

### Few-Shot Learning
Provide examples:
\`\`\`
Example 1: [example]
Example 2: [example]
Now create a similar one for: [your request]
\`\`\`

### Role Playing
Assign a role to the AI:
\`\`\`
You are an expert marketing consultant. 
Advise on a social media strategy for a tech startup.
\`\`\`

## Common Patterns

- **Instruction**: "Write...", "Create...", "Analyze..."
- **Question**: "What is...", "How does...", "Why..."
- **Completion**: "Complete the following..."
- **Transformation**: "Convert...", "Translate...", "Summarize..."

## Best Practices

1. Start broad, then narrow down
2. Use specific examples
3. Iterate and refine
4. Test different phrasings
5. Save successful prompts

## Tools for Prompt Engineering

- Prompt libraries and templates
- Prompt testing platforms
- Community-shared prompts
- Prompt versioning tools`,
    difficulty: 'intermediate',
    estimatedTime: '45 minutes',
    featuredImage: '/images/guides/prompt-engineering.jpg',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: '3',
    slug: 'building-ai-powered-web-apps',
    title: 'Building AI-Powered Web Apps',
    description: 'Step-by-step guide to integrating AI capabilities into your web applications.',
    category: 'Development',
    tags: ['advanced', 'web-development', 'ai-integration'],
    content: `# Building AI-Powered Web Apps

Learn how to integrate AI capabilities into modern web applications using popular frameworks and APIs.

## Overview

AI-powered web apps combine traditional web development with AI services to create intelligent, responsive applications.

## Architecture

### Components

1. **Frontend**: User interface and interactions
2. **Backend API**: Server-side logic and AI integration
3. **AI Services**: External AI APIs (OpenAI, Anthropic, etc.)
4. **Database**: Store user data and AI-generated content

## Getting Started

### Step 1: Choose Your Stack

- **Frontend**: React, Next.js, Vue.js
- **Backend**: Node.js, Python, Go
- **AI APIs**: OpenAI, Anthropic, Google AI

### Step 2: Set Up API Keys

Securely store API keys:
\`\`\`env
OPENAI_API_KEY=your_key_here
\`\`\`

### Step 3: Create API Endpoints

Build endpoints that:
- Accept user input
- Call AI services
- Process responses
- Return formatted data

## Implementation Examples

### Text Generation

\`\`\`typescript
async function generateText(prompt: string) {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
  return response.json();
}
\`\`\`

### Image Generation

\`\`\`typescript
async function generateImage(description: string) {
  const response = await fetch('/api/ai/image', {
    method: 'POST',
    body: JSON.stringify({ description }),
  });
  return response.json();
}
\`\`\`

## Best Practices

1. **Rate Limiting**: Implement rate limits to control costs
2. **Error Handling**: Gracefully handle API failures
3. **Caching**: Cache responses when appropriate
4. **Security**: Never expose API keys in frontend code
5. **User Experience**: Show loading states and progress

## Security Considerations

- Validate all user inputs
- Sanitize AI outputs before display
- Implement authentication for AI features
- Monitor API usage and costs
- Protect against prompt injection attacks

## Cost Optimization

- Cache common requests
- Use streaming for long responses
- Implement request queuing
- Monitor usage patterns
- Choose appropriate model tiers

## Testing

Test your AI integrations:
- Unit tests for API calls
- Integration tests for workflows
- User acceptance testing
- Performance testing

## Deployment

- Use environment variables for secrets
- Implement proper error logging
- Set up monitoring and alerts
- Plan for scaling
- Document API usage`,
    difficulty: 'advanced',
    estimatedTime: '2 hours',
    featuredImage: '/images/guides/web-apps.jpg',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  }
];

/**
 * Get guide by slug
 */
export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find(guide => guide.slug === slug);
}

/**
 * Get guides by category
 */
export function getGuidesByCategory(category: string): Guide[] {
  return guides.filter(guide => guide.category === category);
}

/**
 * Get guides by tag
 */
export function getGuidesByTag(tag: string): Guide[] {
  return guides.filter(guide => guide.tags.includes(tag));
}

/**
 * Get guides by difficulty
 */
export function getGuidesByDifficulty(difficulty: Guide['difficulty']): Guide[] {
  return guides.filter(guide => guide.difficulty === difficulty);
}

/**
 * Search guides
 */
export function searchGuides(query: string): Guide[] {
  const lowerQuery = query.toLowerCase();
  return guides.filter(guide =>
    guide.title.toLowerCase().includes(lowerQuery) ||
    guide.description.toLowerCase().includes(lowerQuery) ||
    guide.content.toLowerCase().includes(lowerQuery) ||
    guide.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(guides.map(guide => guide.category)));
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  return Array.from(new Set(guides.flatMap(guide => guide.tags)));
}
