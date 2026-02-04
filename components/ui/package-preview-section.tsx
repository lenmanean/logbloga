'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MarkdownContent } from '@/components/ui/markdown-content';
import { Loader2, AlertCircle, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PackagePreviewSectionProps {
  productId: string;
  className?: string;
}

/**
 * Fetches package preview markdown from the API and renders it with the same
 * interactive markdown stack as the library (code highlighting, etc.).
 */
export function PackagePreviewSection({ productId, className }: PackagePreviewSectionProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchPreview() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${productId}/preview`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data.error as string) || `Failed to load preview (${res.status})`);
        }
        const text = await res.text();
        if (!cancelled) setContent(text);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load preview');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPreview();
    return () => { cancelled = true; };
  }, [productId]);

  const scrollToPurchase = () => {
    const el = document.getElementById('purchase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <section className={cn('mb-12', className)} aria-labelledby="preview-heading">
        <h2 id="preview-heading" className="text-2xl font-semibold mb-4">
          Inside the package
        </h2>
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
          </CardContent>
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn('mb-12', className)} aria-labelledby="preview-heading">
        <h2 id="preview-heading" className="text-2xl font-semibold mb-4">
          Inside the package
        </h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!content) return null;

  return (
    <section className={cn('mb-12', className)} aria-labelledby="preview-heading">
      <h2 id="preview-heading" className="text-2xl font-semibold mb-4">
        Inside the package
      </h2>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="max-h-[420px] overflow-y-auto pr-2 rounded-md border border-border/50 bg-muted/20 p-4"
            style={{ scrollbarGutter: 'stable' }}
          >
            <MarkdownContent content={content} />
          </div>
          <Button variant="outline" className="w-full sm:w-auto" onClick={scrollToPurchase}>
            Get the full package
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
