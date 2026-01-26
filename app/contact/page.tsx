import { Metadata } from 'next';
import { ContactForm } from '@/components/contact/contact-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | LogBloga',
  description: 'Get in touch with LogBloga. We\'re here to help with questions, support, and inquiries.',
  openGraph: {
    title: 'Contact Us | LogBloga',
    description: 'Get in touch with LogBloga. We\'re here to help with questions, support, and inquiries.',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24-48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Email</p>
                <a
                  href="mailto:support@logbloga.com"
                  className="text-sm text-primary hover:underline"
                >
                  support@logbloga.com
                </a>
                <p className="text-xs text-muted-foreground mt-2">
                  For all inquiries, including legal matters
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We typically respond within <strong>24-48 hours</strong> during business days (Monday-Friday).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other Ways to Reach Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  For product support, check out our{' '}
                  <a href="/resources/faq" className="text-primary hover:underline">
                    FAQ page
                  </a>
                  .
                </p>
                <p>
                  Join our{' '}
                  <a href="/resources/community" className="text-primary hover:underline">
                    Community Forum
                  </a>
                  {' '}to connect with other users.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
