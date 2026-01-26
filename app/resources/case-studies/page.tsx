import type { Metadata } from 'next';
import { caseStudies, getAllCategories, getAllIndustries, getAllTags } from '@/lib/resources/case-studies';
import { CaseStudiesPageClient } from '@/components/resources/case-studies-page-client';

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'Case Studies | Resources | Logbloga',
  description: 'Real-world examples and success stories from businesses and individuals using AI to USD products.',
  openGraph: {
    title: 'Case Studies | Resources | Logbloga',
    description: 'Real-world examples and success stories from businesses and individuals using AI to USD products.',
    type: 'website',
  },
};

export default function CaseStudiesPage() {
  const allCategories = getAllCategories();
  const allIndustries = getAllIndustries();
  const allTags = getAllTags();

  return (
    <CaseStudiesPageClient 
      initialCaseStudies={caseStudies}
      categories={allCategories}
      industries={allIndustries}
      tags={allTags}
    />
  );
}
