import type { Metadata } from 'next';
import { guides, getAllCategories, getAllTags } from '@/lib/resources/guides';
import { GuidesPageClient } from '@/components/resources/guides-page-client';

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'Guides | Resources | LogBloga',
  description: 'Step-by-step tutorials and comprehensive guides to help you master AI tools and techniques.',
  openGraph: {
    title: 'Guides | Resources | LogBloga',
    description: 'Step-by-step tutorials and comprehensive guides to help you master AI tools and techniques.',
    type: 'website',
  },
};

export default function GuidesPage() {
  const allCategories = getAllCategories();
  const allTags = getAllTags();

  return (
    <GuidesPageClient 
      initialGuides={guides}
      categories={allCategories}
      tags={allTags}
    />
  );
}
