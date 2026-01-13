'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronDown } from 'lucide-react';
import { useState, useCallback } from 'react';
import { TypingAnimation } from '@/components/ui/typing-animation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavDropdownProps {
  label: string;
  href: string;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: () => void;
}

function NavDropdown({ label, href, children, isOpen, onOpenChange, onNavigate }: NavDropdownProps) {
  return (
    <div
      onMouseEnter={() => onOpenChange(true)}
      onMouseLeave={() => onOpenChange(false)}
      className="relative"
    >
      <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <button
            className="text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105 flex items-center gap-1 outline-none"
            onClick={(e) => {
              e.preventDefault();
              onNavigate();
            }}
          >
            {label}
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start"
          onMouseEnter={() => onOpenChange(true)}
          onMouseLeave={() => onOpenChange(false)}
        >
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [aiToUsdOpen, setAiToUsdOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const handleTypingComplete = useCallback(() => {
    setTypingComplete(true);
  }, []);

  return (
    <div className="w-full pt-4 px-4">
      <header className="mx-auto max-w-7xl rounded-full border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="flex h-16 items-center justify-between px-6 md:px-8">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center transition-transform hover:scale-105">
            <TypingAnimation 
              text="log(b)log(a)" 
              duration={50}
              className="text-xl md:text-2xl font-bold"
              onComplete={handleTypingComplete}
            />
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className={`hidden md:flex items-center space-x-8 transition-opacity duration-1000 ${typingComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <NavDropdown
              label="AI to USD"
              href="/products"
              isOpen={aiToUsdOpen}
              onOpenChange={setAiToUsdOpen}
              onNavigate={() => router.push('/products')}
            >
              <DropdownMenuItem asChild>
                <Link href="/ai-to-usd/web-apps">Web Apps</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ai-to-usd/social-media">Social Media</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ai-to-usd/agency">Agency</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ai-to-usd/freelancing">Freelancing</Link>
              </DropdownMenuItem>
            </NavDropdown>
            <NavDropdown
              label="Resources"
              href="/resources"
              isOpen={resourcesOpen}
              onOpenChange={setResourcesOpen}
              onNavigate={() => router.push('/resources')}
            >
              <DropdownMenuItem asChild>
                <Link href="/resources/guides">Guides</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/resources/case-studies">Case Studies</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/resources/tools">Tools & Templates</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/resources/faq">FAQ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/resources/community">Community Forum</Link>
              </DropdownMenuItem>
            </NavDropdown>
            <Link 
              href="/blog" 
              className="text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105"
            >
              Blog
            </Link>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className={`hidden md:flex items-center space-x-3 transition-opacity duration-1000 ${typingComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="rounded-full">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-full shadow-sm hover:shadow-md transition-shadow bg-red-500 text-white hover:bg-red-600">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className={`md:hidden transition-opacity duration-1000 ${typingComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <div className="flex flex-col">
                  <div className="text-lg font-medium py-2">AI to USD</div>
                  <div className="flex flex-col pl-4 space-y-2">
                    <Link
                      href="/ai-to-usd/web-apps"
                      onClick={() => setOpen(false)}
                      className="text-base transition-colors hover:text-primary py-1"
                    >
                      Web Apps
                    </Link>
                    <Link
                      href="/ai-to-usd/social-media"
                      onClick={() => setOpen(false)}
                      className="text-base transition-colors hover:text-primary py-1"
                    >
                      Social Media
                    </Link>
                    <Link
                      href="/ai-to-usd/agency"
                      onClick={() => setOpen(false)}
                      className="text-base transition-colors hover:text-primary py-1"
                    >
                      Agency
                    </Link>
                    <Link
                      href="/ai-to-usd/freelancing"
                      onClick={() => setOpen(false)}
                      className="text-base transition-colors hover:text-primary py-1"
                    >
                      Freelancing
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-lg font-medium py-2">Resources</div>
                  <div className="flex flex-col pl-4 space-y-2">
                    <Link
                      href="/resources/guides"
                      onClick={() => setOpen(false)}
                      className="text-base transition-colors hover:text-primary py-1"
                    >
                      Guides
                    </Link>
                    <Link
                      href="/resources/case-studies"
                      onClick={() => setOpen(false)}
                      className="text-base transition-colors hover:text-primary py-1"
                    >
                      Case Studies
                    </Link>
                    <Link
                      href="/resources/tools"
                      onClick={() => setOpen(false)}
                      className="text-base transition-colors hover:text-primary py-1"
                    >
                      Tools & Templates
                    </Link>
                    <Link
                      href="/resources/faq"
                      onClick={() => setOpen(false)}
                      className="text-base transition-colors hover:text-primary py-1"
                    >
                      FAQ
                    </Link>
                    <Link
                      href="/resources/community"
                      onClick={() => setOpen(false)}
                      className="text-base transition-colors hover:text-primary py-1"
                    >
                      Community Forum
                    </Link>
                  </div>
                </div>
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
                    <Button className="w-full rounded-full bg-red-500 text-white hover:bg-red-600">
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

