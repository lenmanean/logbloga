import { Metadata } from 'next';
import { requireAuth } from '@/lib/auth/utils';
import { DataExportClient } from './data-export-client';

export const metadata: Metadata = {
  title: 'Data Export | LogBloga',
  description: 'Download all your personal data in JSON format.',
};

export default async function DataExportPage() {
  await requireAuth();

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Data Export</h1>
      <p className="text-muted-foreground mb-8">
        Download all your personal data in JSON format for GDPR compliance.
      </p>

      <DataExportClient />
    </div>
  );
}
