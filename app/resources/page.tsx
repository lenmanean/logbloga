import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, TrendingUp, Wrench, HelpCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

function ResourceCard({ title, description, href, icon: Icon, className }: ResourceCardProps) {
  return (
    <Link href={href}>
      <Card className={cn(
        'group hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer h-full',
        className
      )}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
              <Icon className="h-8 w-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold group-hover:text-red-500 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

const resources = [
  {
    title: 'Guides',
    description: 'Step-by-step tutorials and comprehensive guides to help you master AI tools and techniques.',
    href: '/resources/guides',
    icon: FileText,
  },
  {
    title: 'Case Studies',
    description: 'Real-world examples and success stories from businesses and individuals using AI to USD products.',
    href: '/resources/case-studies',
    icon: TrendingUp,
  },
  {
    title: 'Tools & Templates',
    description: 'Ready-to-use templates, tools, and resources to accelerate your AI-powered projects.',
    href: '/resources/tools',
    icon: Wrench,
  },
  {
    title: 'FAQ',
    description: 'Find answers to common questions about our products, services, and AI implementation.',
    href: '/resources/faq',
    icon: HelpCircle,
  },
  {
    title: 'Community Forum',
    description: 'Connect with other users, share experiences, and get help from our active community.',
    href: '/resources/community',
    icon: Users,
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Resources
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Access comprehensive guides, tools, and support to help you succeed with AI to USD products.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.href}
              title={resource.title}
              description={resource.description}
              href={resource.href}
              icon={resource.icon}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

