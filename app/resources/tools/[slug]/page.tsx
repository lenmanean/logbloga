import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getToolBySlug, tools } from '@/lib/resources/tools';
import { BlogContent } from '@/components/blog/blog-content';
import { ToolCard } from '@/components/resources/tool-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, FileText, Wrench } from 'lucide-react';
import { DownloadButton } from '@/components/resources/download-button';

export const revalidate = 3600; // ISR: revalidate every hour

interface ToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all tools at build time
 */
export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

/**
 * Generate metadata for SEO optimization
 */
export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found | Logbloga',
    };
  }

  return {
    title: `${tool.title} | Tools & Templates | Logbloga`,
    description: tool.description,
    openGraph: {
      title: tool.title,
      description: tool.description,
      images: tool.previewImage ? [tool.previewImage] : [],
      type: 'website' as const,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  // Get related tools
  const relatedTools = tools
    .filter(t => t.id !== tool.id && (
      t.category === tool.category ||
      t.type === tool.type ||
      t.tags.some(tag => tool.tags.includes(tag))
    ))
    .slice(0, 3);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const TypeIcon = tool.type === 'tool' ? Wrench : FileText;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/resources/tools">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Tools & Templates
            </Button>
          </Link>
        </div>

        {/* Tool Header */}
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline">{tool.category}</Badge>
              <Badge 
                variant={tool.type === 'tool' ? 'default' : 'secondary'}
                className="flex items-center gap-1"
              >
                <TypeIcon className="h-3 w-3" />
                {tool.type === 'tool' ? 'Tool' : 'Template'}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {tool.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              {tool.description}
            </p>

            {/* File Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">File:</span>
                <span className="text-sm">{tool.fileName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Size:</span>
                <span className="text-sm">{formatFileSize(tool.fileSize)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Type:</span>
                <span className="text-sm">{tool.fileType}</span>
              </div>
              {tool.downloadCount !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Downloads:</span>
                  <span className="text-sm">{tool.downloadCount.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {tool.tags && tool.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tool.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Preview Image */}
            {tool.previewImage && (
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-muted mb-8">
                <Image
                  src={tool.previewImage}
                  alt={tool.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </header>

          {/* Download Button */}
          <div className="mb-8">
            <DownloadButton tool={tool} />
          </div>

          {/* Instructions */}
          <div className="prose-wrapper mb-8">
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <BlogContent content={tool.instructions} />
          </div>
        </article>

        <Separator className="my-12" />

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Tools & Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTools.map((relatedTool) => (
                <ToolCard key={relatedTool.id} tool={relatedTool} showDownload={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
