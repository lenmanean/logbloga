import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div>
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="mt-4 text-3xl font-bold">Page Not Found</h2>
          <p className="mt-4 text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. It may have
            been moved or deleted.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}

