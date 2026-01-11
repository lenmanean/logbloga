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
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
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
    href: '/ai-to-usd/web-apps',
  },
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Grow your social media presence and engagement',
    icon: 'Share2',
    productCount: 8,
    href: '/ai-to-usd/social-media',
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'Scale your agency with AI-powered solutions',
    icon: 'Building2',
    productCount: 10,
    href: '/ai-to-usd/agency',
  },
  {
    id: 'freelancing',
    name: 'Freelancing',
    description: 'Boost your freelancing career and income',
    icon: 'Briefcase',
    productCount: 15,
    href: '/ai-to-usd/freelancing',
  },
];

export const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'AI-Powered E-Commerce Builder',
    description: 'Create stunning online stores with AI-assisted design and automation',
    category: 'web-apps',
    price: 299,
    originalPrice: 499,
    featured: true,
    difficulty: 'beginner',
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
    difficulty: 'beginner',
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
    difficulty: 'intermediate',
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
    difficulty: 'beginner',
    duration: '3 weeks',
  },
  {
    id: '5',
    title: 'SaaS Dashboard Template',
    description: 'Modern dashboard template with AI analytics and reporting',
    category: 'web-apps',
    price: 249,
    featured: false,
    difficulty: 'intermediate',
    duration: '5 weeks',
  },
  {
    id: '6',
    title: 'Instagram Growth Automation',
    description: 'Automate engagement and grow your Instagram following organically',
    category: 'social-media',
    price: 179,
    featured: false,
    difficulty: 'beginner',
    duration: '4 weeks',
  },
  {
    id: '7',
    title: 'Agency Proposal Generator',
    description: 'Create winning proposals in minutes with AI-powered templates',
    category: 'agency',
    price: 279,
    featured: false,
    difficulty: 'beginner',
    duration: '2 weeks',
  },
  {
    id: '8',
    title: 'Freelance Invoice System',
    description: 'Professional invoicing and payment tracking for freelancers',
    category: 'freelancing',
    price: 129,
    featured: false,
    difficulty: 'beginner',
    duration: '2 weeks',
  },
  {
    id: '9',
    title: 'API Integration Platform',
    description: 'Connect multiple services with AI-powered API integrations',
    category: 'web-apps',
    price: 349,
    featured: false,
    difficulty: 'advanced',
    duration: '10 weeks',
  },
  {
    id: '10',
    title: 'TikTok Content Strategy',
    description: 'Viral content strategies and AI-powered trend analysis',
    category: 'social-media',
    price: 199,
    featured: false,
    difficulty: 'intermediate',
    duration: '6 weeks',
  },
  {
    id: '11',
    title: 'Team Collaboration Tool',
    description: 'AI-enhanced collaboration platform for distributed teams',
    category: 'agency',
    price: 449,
    featured: false,
    difficulty: 'intermediate',
    duration: '9 weeks',
  },
  {
    id: '12',
    title: 'Client Communication System',
    description: 'Automate client updates and maintain professional communication',
    category: 'freelancing',
    price: 159,
    featured: false,
    difficulty: 'beginner',
    duration: '3 weeks',
  },
];

