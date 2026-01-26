import type { Metadata } from 'next';
import { tools, getAllCategories, getAllTags } from '@/lib/resources/tools';
import { ToolsPageClient } from '@/components/resources/tools-page-client';

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'Tools & Templates | Resources | Logbloga',
  description: 'Ready-to-use templates, tools, and resources to accelerate your AI-powered projects.',
  openGraph: {
    title: 'Tools & Templates | Resources | Logbloga',
    description: 'Ready-to-use templates, tools, and resources to accelerate your AI-powered projects.',
    type: 'website',
  },
};

export default function ToolsPage() {
  const allCategories = getAllCategories();
  const allTags = getAllTags();

  return (
    <ToolsPageClient 
      initialTools={tools}
      categories={allCategories}
      tags={allTags}
    />
  );
}
