import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
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
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}

