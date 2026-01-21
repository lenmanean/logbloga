import type { Metadata } from 'next';
import { FAQPageClient } from '@/components/resources/faq-page-client';
import { faqs, getAllCategories } from '@/lib/resources/faq';

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'FAQ | Resources | LogBloga',
  description: 'Find answers to common questions about our products, services, and AI implementation.',
  openGraph: {
    title: 'FAQ | Resources | LogBloga',
    description: 'Find answers to common questions about our products, services, and AI implementation.',
    type: 'website',
  },
};

export default function FAQPage() {
  const allCategories = getAllCategories();

  return (
    <FAQPageClient 
      initialFAQs={faqs}
      categories={allCategories}
    />
  );
}
