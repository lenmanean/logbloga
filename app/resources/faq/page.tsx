import type { Metadata } from 'next';
import { FAQPageClient } from '@/components/resources/faq-page-client';
import { faqs } from '@/lib/resources/faq';

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'FAQ | Resources | Logbloga',
  description: 'Find answers to common questions about our products, services, and AI implementation.',
  openGraph: {
    title: 'FAQ | Resources | Logbloga',
    description: 'Find answers to common questions about our products, services, and AI implementation.',
    type: 'website',
  },
};

export default function FAQPage() {
  return (
    <FAQPageClient 
      initialFAQs={faqs}
    />
  );
}
