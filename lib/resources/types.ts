/**
 * Type definitions for Resources
 * Defines all resource types: Guides, Case Studies, Tools/Templates, and FAQs
 */

// Base resource interface
export interface BaseResource {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Guide-specific interface
export interface Guide extends BaseResource {
  content: string; // Markdown/HTML content
  steps?: string[]; // Optional step-by-step guide
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  featuredImage?: string;
}

// Case study-specific interface
export interface CaseStudy extends BaseResource {
  content: string;
  company?: string;
  industry: string;
  outcome: string; // Success metrics description
  testimonial?: string;
  featuredImage?: string;
  results: {
    metric: string;
    value: string;
  }[];
}

// Tool/Template-specific interface
export interface Tool extends BaseResource {
  type: 'tool' | 'template';
  filePath: string; // Path in Supabase Storage
  fileName: string;
  fileSize: number;
  fileType: string;
  downloadCount?: number;
  instructions: string;
  previewImage?: string;
  requiresAuth: boolean; // Always true per requirements
}

// FAQ-specific interface
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpfulCount?: number;
}

// Search result interface for unified search
export interface SearchResult {
  type: 'guide' | 'case-study' | 'tool' | 'faq';
  resource: Guide | CaseStudy | Tool | FAQ;
  relevanceScore?: number;
}
