import Link from 'next/link';
import Image from 'next/image';
import { CategoryCard } from '@/components/ui/category-card';
import { MasterBundleCard } from '@/components/ui/master-bundle-card';
import { CompatibleWithCarousel } from '@/components/ai-to-usd/compatible-with-carousel';
import { categories } from '@/lib/products';
import { caseStudies } from '@/lib/resources/case-studies';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Layers, FileText, Lightbulb, TrendingUp, Users, BookOpen, CheckCircle, Clock } from 'lucide-react';

export default function AiToUsdPage() {
  // Get DOER case study (only real case study)
  const doerCaseStudy = caseStudies.find(study => study.slug === 'doer-ai-goal-achievement-platform');

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Hero / What is AI to USD */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Unlock $1k, $5k, and $10k+/mo: levels for scaling your business.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Structured packages with clear levels, templates, and guides. Ship and earn. No fluff.
            </p>
          </div>
        </section>

        {/* Compatible with platform carousel */}
        <CompatibleWithCarousel />

        {/* Explore Our Packages */}
        <div id="explore-packages" className="mb-10 md:mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Choose your level
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One package or all four. Each level has a path to the next income tier.
            </p>
          </div>
          <MasterBundleCard href="/ai-to-usd/packages/master-bundle" className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">
              <div className="flex items-center gap-3 md:gap-6 flex-1">
                <div className="relative w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src="/package-master.png"
                    alt="Master Bundle - All four AI to USD packages"
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 64px, (max-width: 1024px) 96px, 128px"
                  />
                </div>
                <div className="min-w-0">
                  <Badge className="mb-2 bg-amber-500/20 text-amber-800 dark:bg-amber-400/20 dark:text-amber-200 border-amber-500/30">Best Value</Badge>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-amber-900 dark:text-amber-100">
                    Master Bundle: All levels. One purchase.
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                    All four packages. 145+ hours, templates and guides. One purchase.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-base md:text-lg font-semibold text-amber-700 dark:text-amber-300">View Master Bundle</span>
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </MasterBundleCard>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Why Choose AI to USD */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why this works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built for people who execute, not just learn.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Level-Based Progression</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Start where you are; each level builds to the next.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Comprehensive Resources</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Templates, guides, and frameworks you can use Monday morning.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">AI-Powered Approach</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use the tools that scale. Automate, ship faster, earn more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Revenue-Focused</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Every module ties to income. Learn to build and get paid.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Implementation Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Platform setup, integrations, and best practices so you actually ship.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Self-Paced Learning</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Lifetime access. Learn at your pace, revisit as you grow.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Case Studies Showcase Section */}
        {doerCaseStudy && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Success Story
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See it in action: a real-world, production-ready app built with these principles.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {doerCaseStudy.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{doerCaseStudy.title}</CardTitle>
                  <CardDescription className="text-base">{doerCaseStudy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {doerCaseStudy.outcome && (
                    <div className="mb-6">
                      <p className="text-sm font-semibold mb-2">Key Achievement:</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {doerCaseStudy.outcome}
                      </p>
                    </div>
                  )}
                  {doerCaseStudy.results && doerCaseStudy.results.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      {doerCaseStudy.results.map((result, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">{result.metric}</p>
                          <p className="text-sm font-semibold">{result.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={`/resources/case-studies/${doerCaseStudy.slug}`} className="flex-1">
                      <Button variant="default" className="w-full">
                        Read Full Story
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                    <a 
                      href="https://usedoer.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full">
                        Visit DOER
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Call-to-Action Section */}
        <section className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to unlock your level?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the package that fits. Start turning AI into revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#explore-packages">
              <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
                Explore Packages
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/resources">
              <Button size="lg" variant="outline">
                Learn More
                <BookOpen className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
