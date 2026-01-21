/**
 * FAQ data
 * Frequently asked questions and answers
 */

import type { FAQ } from './types';

export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'What is AI to USD?',
    answer: 'AI to USD is a comprehensive platform that provides digital products, tools, and resources to help individuals and businesses leverage artificial intelligence to generate revenue and improve productivity. We offer courses, templates, tools, and guides designed to help you transform AI knowledge into real-world income.',
    category: 'General',
    tags: ['general', 'about', 'platform'],
    helpfulCount: 245
  },
  {
    id: '2',
    question: 'Do I need technical experience to use your products?',
    answer: 'No, you don\'t need extensive technical experience. Our products are designed for various skill levels, from complete beginners to advanced users. Each product clearly indicates its difficulty level (beginner, intermediate, or advanced), and we provide step-by-step guides and tutorials to help you get started.',
    category: 'Getting Started',
    tags: ['beginner', 'technical', 'requirements'],
    helpfulCount: 189
  },
  {
    id: '3',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and PayPal. All payments are processed securely through Stripe, ensuring your financial information is protected.',
    category: 'Payment',
    tags: ['payment', 'billing', 'security'],
    helpfulCount: 156
  },
  {
    id: '4',
    question: 'Can I get a refund if I\'m not satisfied?',
    answer: 'Yes, we offer a 30-day money-back guarantee on all digital products. If you\'re not satisfied with your purchase, contact our support team within 30 days of purchase, and we\'ll process a full refund. Please note that refunds may take 5-10 business days to appear in your account.',
    category: 'Refunds',
    tags: ['refund', 'guarantee', 'policy'],
    helpfulCount: 203
  },
  {
    id: '5',
    question: 'How do I access my purchased products?',
    answer: 'After completing your purchase, you\'ll receive an email confirmation with access instructions. You can also access all your purchased products by logging into your account and visiting the "My Library" section. Each product includes download links and access to online resources.',
    category: 'Access',
    tags: ['access', 'library', 'download'],
    helpfulCount: 278
  },
  {
    id: '6',
    question: 'Are the products updated regularly?',
    answer: 'Yes, we regularly update our products to reflect the latest AI tools, techniques, and best practices. When you purchase a product, you receive lifetime access to all future updates at no additional cost. We notify customers via email when significant updates are released.',
    category: 'Updates',
    tags: ['updates', 'lifetime-access', 'maintenance'],
    helpfulCount: 167
  },
  {
    id: '7',
    question: 'Can I use these products for commercial purposes?',
    answer: 'Yes, most of our products include commercial licenses that allow you to use them for your business or client projects. However, please review the specific license terms for each product, as some may have restrictions. Generally, you can use templates and tools for commercial purposes, but you cannot resell or redistribute the products themselves.',
    category: 'Licensing',
    tags: ['license', 'commercial', 'usage'],
    helpfulCount: 194
  },
  {
    id: '8',
    question: 'Do you offer support if I have questions?',
    answer: 'Yes, we provide customer support via email and our community forum. For product-specific questions, you can reach out to our support team, and we typically respond within 24-48 hours. We also have an active community forum where you can ask questions and connect with other users.',
    category: 'Support',
    tags: ['support', 'help', 'community'],
    helpfulCount: 142
  },
  {
    id: '9',
    question: 'What AI tools do I need to use your products?',
    answer: 'Our products work with popular AI tools like ChatGPT, Claude, Midjourney, and others. Most products are tool-agnostic and teach concepts that apply across different AI platforms. We provide recommendations for specific tools when relevant, but you can adapt the content to work with your preferred AI tools.',
    category: 'Requirements',
    tags: ['ai-tools', 'requirements', 'compatibility'],
    helpfulCount: 178
  },
  {
    id: '10',
    question: 'Are there any prerequisites for the courses?',
    answer: 'Prerequisites vary by course. Beginner courses require no prior experience, while advanced courses may require basic knowledge of AI tools or specific technical skills. Each course page clearly lists any prerequisites, and we provide recommendations for preparation if needed.',
    category: 'Courses',
    tags: ['courses', 'prerequisites', 'requirements'],
    helpfulCount: 134
  },
  {
    id: '11',
    question: 'Can I share my account with others?',
    answer: 'No, account sharing is not permitted. Each account is for individual use only. If multiple people need access, each person should create their own account and purchase the products they need. This ensures proper licensing and access control.',
    category: 'Account',
    tags: ['account', 'sharing', 'license'],
    helpfulCount: 98
  },
  {
    id: '12',
    question: 'How long do I have access to purchased products?',
    answer: 'You have lifetime access to all products you purchase. This includes access to future updates and new content added to the products. Your access is tied to your account, so as long as your account is active, you can access your purchased products.',
    category: 'Access',
    tags: ['access', 'lifetime', 'duration'],
    helpfulCount: 211
  },
  {
    id: '13',
    question: 'Do you offer discounts or promotions?',
    answer: 'Yes, we regularly offer discounts and promotions, especially during special events and holidays. To stay updated, subscribe to our newsletter or follow us on social media. We also offer bundle discounts when purchasing multiple products together.',
    category: 'Pricing',
    tags: ['pricing', 'discounts', 'promotions'],
    helpfulCount: 165
  },
  {
    id: '14',
    question: 'What file formats are the products available in?',
    answer: 'Our products are available in various formats depending on the content type. Common formats include PDF guides, ZIP files for templates and tools, video files (MP4), and online access for interactive content. Each product page specifies the exact formats included.',
    category: 'Formats',
    tags: ['formats', 'files', 'download'],
    helpfulCount: 123
  },
  {
    id: '15',
    question: 'Can I get a certificate after completing a course?',
    answer: 'Yes, many of our courses offer completion certificates. After completing all course modules and any required assessments, you can download your certificate from your account dashboard. Certificates are issued in PDF format and can be shared on LinkedIn or included in your portfolio.',
    category: 'Certificates',
    tags: ['certificates', 'completion', 'credentials'],
    helpfulCount: 187
  },
  {
    id: '16',
    question: 'What if I have a question that\'s not answered here?',
    answer: 'If you have a question that\'s not covered in our FAQ, please contact our support team at support@logbloga.com. We\'re here to help and typically respond within 24-48 hours. You can also visit our community forum to ask questions and connect with other users.',
    category: 'Support',
    tags: ['support', 'contact', 'help'],
    helpfulCount: 89
  }
];

/**
 * Get FAQ by ID
 */
export function getFAQById(id: string): FAQ | undefined {
  return faqs.find(faq => faq.id === id);
}

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(category: string): FAQ[] {
  return faqs.filter(faq => faq.category === category);
}

/**
 * Get FAQs by tag
 */
export function getFAQsByTag(tag: string): FAQ[] {
  return faqs.filter(faq => faq.tags.includes(tag));
}

/**
 * Search FAQs
 */
export function searchFAQs(query: string): FAQ[] {
  const lowerQuery = query.toLowerCase();
  return faqs.filter(faq =>
    faq.question.toLowerCase().includes(lowerQuery) ||
    faq.answer.toLowerCase().includes(lowerQuery) ||
    faq.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(faqs.map(faq => faq.category)));
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  return Array.from(new Set(faqs.flatMap(faq => faq.tags)));
}
