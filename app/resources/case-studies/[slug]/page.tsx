import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCaseStudyBySlug, caseStudies } from '@/lib/resources/case-studies';
import { BlogContent } from '@/components/blog/blog-content';
import { ResourceCard } from '@/components/resources/resource-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, TrendingUp, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const revalidate = 3600; // ISR: revalidate every hour

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all case studies at build time
 */
export async function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

/**
 * Generate metadata for SEO optimization
 */
export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    return {
      title: 'Case Study Not Found | LogBloga',
    };
  }

  return {
    title: `${study.title} | Case Studies | LogBloga`,
    description: study.description,
    openGraph: {
      title: study.title,
      description: study.description,
      images: study.featuredImage ? [study.featuredImage] : [],
      type: 'article' as const,
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  // Get related case studies
  const relatedStudies = caseStudies
    .filter(s => s.id !== study.id && (
      s.category === study.category ||
      s.industry === study.industry ||
      s.tags.some(tag => study.tags.includes(tag))
    ))
    .slice(0, 3);

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CaseStudy',
    headline: study.title,
    description: study.description,
    image: study.featuredImage || undefined,
    about: {
      '@type': 'Thing',
      name: study.industry,
    },
    publisher: {
      '@type': 'Organization',
      name: 'LogBloga',
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/resources/case-studies">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Case Studies
              </Button>
            </Link>
          </div>

          {/* Case Study Header */}
          <article>
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline">{study.category}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {study.industry}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {study.title}
              </h1>

              <p className="text-xl text-muted-foreground mb-6">
                {study.description}
              </p>

              {study.company && (
                <p className="text-lg font-semibold mb-4">
                  Company: {study.company}
                </p>
              )}

              {/* Tags */}
              {study.tags && study.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {study.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Featured Image */}
              {study.featuredImage && (
                <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-muted mb-8">
                  <Image
                    src={study.featuredImage}
                    alt={study.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </header>

            {/* Results Summary */}
            {study.results && study.results.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Key Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {study.results.map((result, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {result.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {result.metric}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Outcome */}
            {study.outcome && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Outcome</h2>
                <p className="text-lg">{study.outcome}</p>
              </div>
            )}

            {/* Case Study Content */}
            <div className="prose-wrapper mb-8">
              <BlogContent content={study.content} />
            </div>

            {/* Testimonial */}
            {study.testimonial && (
              <Card className="mb-8 border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Quote className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-lg italic mb-2">{study.testimonial}</p>
                      {study.company && (
                        <p className="text-sm font-semibold">— {study.company}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </article>

          <Separator className="my-12" />

          {/* Related Case Studies */}
          {relatedStudies.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Case Studies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedStudies.map((relatedStudy) => (
                  <ResourceCard key={relatedStudy.id} resource={relatedStudy} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
