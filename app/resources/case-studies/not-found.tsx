import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CaseStudyNotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Case Study Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The case study you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild>
              <Link href="/resources/case-studies">View All Case Studies</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/resources">Back to Resources</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
