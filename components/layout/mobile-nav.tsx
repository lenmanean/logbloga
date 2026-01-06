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
  return (
    <div
      className={`md:hidden border-t bg-background overflow-hidden transition-all duration-300 ease-out ${
        open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="container px-4 py-4 space-y-4">
        <nav className="flex flex-col space-y-2">
          <Link
            href="/products"
            className="text-sm font-medium transition-colors hover:text-primary py-2 rounded-md px-2 hover:bg-muted"
          >
            Products
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium transition-colors hover:text-primary py-2 rounded-md px-2 hover:bg-muted"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium transition-colors hover:text-primary py-2 rounded-md px-2 hover:bg-muted"
          >
            About
          </Link>
        </nav>
        <Separator />
        {user ? (
          <div className="flex flex-col space-y-2">
            <Link
              href="/account"
              className="text-sm font-medium transition-colors hover:text-primary py-2 rounded-md px-2 hover:bg-muted"
            >
              Account
            </Link>
            <Link
              href="/account/orders"
              className="text-sm font-medium transition-colors hover:text-primary py-2 rounded-md px-2 hover:bg-muted"
            >
              Orders
            </Link>
            <Link
              href="/account/downloads"
              className="text-sm font-medium transition-colors hover:text-primary py-2 rounded-md px-2 hover:bg-muted"
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
              <Link href="/login"><span>Login</span></Link>
            </Button>
            <Button asChild>
              <Link href="/signup"><span>Sign Up</span></Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

