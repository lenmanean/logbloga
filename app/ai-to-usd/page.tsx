import Link from 'next/link';
import { CategoryCard } from '@/components/ui/category-card';
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
        {/* What is AI to USD Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              What is AI to USD?
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                AI to USD is a comprehensive collection of packages designed to help you monetize artificial intelligence and build profitable businesses. Each package provides structured learning paths, implementation guides, and production-ready resources to transform AI capabilities into sustainable revenue streams.
              </p>
            </div>
          </div>
        </section>

        {/* Package Navigation Cards */}
        <div id="explore-packages" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Explore Our Packages
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each package is designed to take you from concept to revenue, with comprehensive resources tailored to your path.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Key Features/Value Propositions Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose AI to USD
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our packages are built on a foundation of proven methodologies, comprehensive resources, and real-world application.
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
                  Start where you are today and progress through structured levels as your skills and revenue grow. Each level builds upon the previous, ensuring sustainable growth.
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
                  Access production-ready templates, step-by-step guides, creative frameworks, and implementation plans. Everything you need to execute, not just learn.
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
                  Learn how to leverage cutting-edge AI tools and technologies to accelerate your development, automate workflows, and scale your operations efficiently.
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
                  Every package is designed with monetization in mind. Learn not just how to build, but how to generate sustainable income from your AI-powered solutions.
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
                  Get guidance on platform setup, integration strategies, and best practices. Our resources help you navigate the implementation process with confidence.
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
                  Learn at your own pace with lifetime access to all content. Revisit materials as your business scales and your needs evolve.
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
                See how AI to USD principles were used to build a real-world, production-ready application.
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
            Ready to Transform AI into Revenue?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the package that aligns with your goals and start your journey to monetizing artificial intelligence today.
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
