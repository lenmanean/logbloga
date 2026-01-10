'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { TypingAnimation } from '@/components/ui/typing-animation';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full pt-4 px-4">
      <header className="mx-auto max-w-7xl rounded-full border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="flex h-16 items-center justify-between px-6 md:px-8">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center transition-transform hover:scale-105">
            <TypingAnimation 
              text="log(b)log(a)" 
              duration={150}
              className="text-xl md:text-2xl font-bold"
            />
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/products" 
              className="text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105"
            >
              Products
            </Link>
            <Link 
              href="/blog" 
              className="text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105"
            >
              Blog
            </Link>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="rounded-full">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-full shadow-sm hover:shadow-md transition-shadow">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium transition-colors hover:text-primary py-2"
                >
                  Products
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium transition-colors hover:text-primary py-2"
                >
                  Blog
                </Link>
                <div className="flex flex-col space-y-3 pt-4 border-t">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <Button className="w-full rounded-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}

