import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Clock } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'Community Forum | Resources | LogBloga',
  description: 'Connect with other users, share experiences, and get help from our active community.',
  openGraph: {
    title: 'Community Forum | Resources | LogBloga',
    description: 'Connect with other users, share experiences, and get help from our active community.',
    type: 'website',
  },
};

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Community Forum
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with other users, share experiences, and get help from our active community.
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
              <Users className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              We're building an amazing community forum where you can connect with other users, 
              share your experiences, ask questions, and learn from each other.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>Discussion Forums</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>User Profiles</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Real-time Updates</span>
              </div>
            </div>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                In the meantime, you can:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/resources/faq">Browse FAQ</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="mailto:support@logbloga.com">Contact Support</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Guidelines Preview */}
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              When our community forum launches, we'll maintain a positive and helpful environment. 
              Here's what to expect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
              <li>Be respectful and constructive in all interactions</li>
              <li>Share knowledge and help others learn</li>
              <li>Follow community guidelines and terms of service</li>
              <li>Report inappropriate content or behavior</li>
              <li>Keep discussions relevant and on-topic</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
