import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | LogBloga',
  description: 'Learn about LogBloga, our mission, and our commitment to helping you succeed with AI.',
  openGraph: {
    title: 'About Us | LogBloga',
    description: 'Learn about LogBloga, our mission, and our commitment to helping you succeed with AI.',
    type: 'website',
  },
};

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="mb-4">
            LogBloga is a digital platform dedicated to helping individuals and businesses transform 
            artificial intelligence capabilities into sustainable revenue streams. We provide comprehensive 
            packages, resources, and tools designed to guide you from concept to revenue.
          </p>
          <p className="mb-4">
            Our mission is to democratize access to AI-powered business solutions, making it easier 
            for entrepreneurs, freelancers, agencies, and businesses of all sizes to leverage AI 
            technology effectively.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission & Vision</h2>
          <h3 className="text-xl font-semibold mb-3">Mission</h3>
          <p className="mb-4">
            To empower individuals and businesses with the knowledge, tools, and resources needed to 
            successfully monetize AI technology and build profitable, sustainable ventures.
          </p>
          <h3 className="text-xl font-semibold mb-3">Vision</h3>
          <p className="mb-4">
            We envision a world where anyone, regardless of technical background, can harness the power 
            of artificial intelligence to create value, solve problems, and generate revenue. We strive 
            to be the leading platform for AI-to-revenue transformation.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <p className="mb-4">
            LogBloga offers structured learning paths and implementation guides through our AI to USD 
            product line. Our packages are designed for different paths:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Web Apps:</strong> Build and monetize AI-powered web applications</li>
            <li><strong>Social Media:</strong> Leverage AI for social media growth and engagement</li>
            <li><strong>Agency:</strong> Scale your agency with AI-driven solutions</li>
            <li><strong>Freelancing:</strong> Enhance your freelance business with AI tools</li>
          </ul>
          <p className="mb-4">
            Each package provides comprehensive resources including implementation guides, creative 
            decision frameworks, platform setup instructions, and production-ready templates to help 
            you succeed.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Accessibility:</strong> We believe AI tools and knowledge should be accessible to everyone, regardless of technical expertise.</li>
            <li><strong>Practicality:</strong> Our focus is on real-world applications and actionable strategies that deliver results.</li>
            <li><strong>Transparency:</strong> We provide clear, honest information about our products and what you can expect.</li>
            <li><strong>Support:</strong> We're committed to supporting our customers throughout their journey, from learning to implementation.</li>
            <li><strong>Innovation:</strong> We continuously update our resources to reflect the latest developments in AI technology.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="mb-4">
            We'd love to hear from you! Whether you have questions about our products, need support, 
            or want to share your success story, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="/contact">
                <Mail className="h-4 w-4 mr-2" />
                Contact Us
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:support@logbloga.com">
                Email Support
              </a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <strong>Response Time:</strong> We typically respond within 24-48 hours during business days.
          </p>
        </section>
      </div>
    </div>
  );
}
