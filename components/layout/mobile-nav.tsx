"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MobileNavProps {
  open: boolean;
  user: any;
  onSignOut: () => void;
}

export function MobileNav({ open, user, onSignOut }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="md:hidden border-t bg-background">
      <div className="container px-4 py-4 space-y-4">
        <nav className="flex flex-col space-y-2">
          <Link
            href="/products"
            className="text-sm font-medium transition-colors hover:text-primary py-2"
          >
            Products
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium transition-colors hover:text-primary py-2"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium transition-colors hover:text-primary py-2"
          >
            About
          </Link>
        </nav>
        <Separator />
        {user ? (
          <div className="flex flex-col space-y-2">
            <Link
              href="/account"
              className="text-sm font-medium transition-colors hover:text-primary py-2"
            >
              Account
            </Link>
            <Link
              href="/account/orders"
              className="text-sm font-medium transition-colors hover:text-primary py-2"
            >
              Orders
            </Link>
            <Link
              href="/account/downloads"
              className="text-sm font-medium transition-colors hover:text-primary py-2"
            >
              Downloads
            </Link>
            <Button variant="outline" onClick={onSignOut} className="mt-2">
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

