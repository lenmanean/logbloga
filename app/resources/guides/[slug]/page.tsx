import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getGuideBySlug, guides } from '@/lib/resources/guides';
import { BlogContent } from '@/components/blog/blog-content';
import { ResourceCard } from '@/components/resources/resource-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const revalidate = 3600; // ISR: revalidate every hour

interface GuidePageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all guides at build time
 */
export async function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

/**
 * Generate metadata for SEO optimization
 */
export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found | Logbloga',
    };
  }

  return {
    title: `${guide.title} | Guides | Logbloga`,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      images: guide.featuredImage ? [guide.featuredImage] : [],
      type: 'article' as const,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  // Get related guides (same category or tags)
  const relatedGuides = guides
    .filter(g => g.id !== guide.id && (
      g.category === guide.category ||
      g.tags.some(tag => guide.tags.includes(tag))
    ))
    .slice(0, 3);

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
    advanced: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/resources/guides">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Guides
            </Button>
          </Link>
        </div>

        {/* Guide Header */}
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline">{guide.category}</Badge>
              <Badge 
                variant="outline" 
                className={cn(difficultyColors[guide.difficulty])}
              >
                {guide.difficulty}
              </Badge>
              {guide.estimatedTime && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{guide.estimatedTime}</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {guide.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              {guide.description}
            </p>

            {/* Tags */}
            {guide.tags && guide.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {guide.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Featured Image */}
            {guide.featuredImage && (
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-muted mb-8">
                <Image
                  src={guide.featuredImage}
                  alt={guide.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </header>

          {/* Guide Content */}
          <div className="prose-wrapper mb-8">
            <BlogContent content={guide.content} />
          </div>

          {/* Steps (if available) */}
          {guide.steps && guide.steps.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Step-by-Step Guide</h2>
              <div className="space-y-4">
                {guide.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-foreground">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <Separator className="my-12" />

        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedGuides.map((relatedGuide) => (
                <ResourceCard key={relatedGuide.id} resource={relatedGuide} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
