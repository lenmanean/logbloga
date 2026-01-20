'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';

export function DataExportClient() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch('/api/account/data-export');

      if (!response.ok) {
        if (response.status === 429) {
          setError('You can only export your data once per 24 hours. Please try again later.');
          return;
        }

        const data = await response.json();
        setError(data.error || 'Failed to export data. Please try again.');
        return;
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch?.[1] || 'logbloga-data-export.json';

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Your Data</CardTitle>
        <CardDescription>
          Download all your personal data in JSON format. This includes your profile, 
          orders, licenses, cart items, addresses, notifications, wishlist, reviews, 
          and consent records.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/50 p-4">
          <h3 className="font-semibold mb-2">What&apos;s included in the export:</h3>
          <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
            <li>Profile information</li>
            <li>Order history</li>
            <li>Licenses</li>
            <li>Cart items</li>
            <li>Addresses</li>
            <li>Notifications</li>
            <li>Wishlist items</li>
            <li>Reviews</li>
            <li>Audit logs</li>
            <li>Cookie consent preferences</li>
            <li>Consent records</li>
          </ul>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> You can only export your data once per 24 hours. 
            The export will be in JSON format and can be opened with any text editor or 
            JSON viewer.
          </p>
        </div>

        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full sm:w-auto"
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download My Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
