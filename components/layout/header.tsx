'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronDown, ShoppingCart, User, Settings, LogIn, LogOut, UserCircle } from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { TypingAnimation } from '@/components/ui/typing-animation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface NavDropdownProps {
  label: string;
  href: string;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: () => void;
}

function NavDropdown({ label, href, children, isOpen, onOpenChange, onNavigate }: NavDropdownProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    onOpenChange(true);
  }, [onOpenChange]);

  const handleMouseLeave = useCallback(() => {
    // Small delay to allow moving from trigger to content
    timeoutRef.current = setTimeout(() => {
      onOpenChange(false);
    }, 200);
  }, [onOpenChange]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <DropdownMenu open={isOpen} onOpenChange={() => {}} modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            className="text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105 flex items-center gap-1 outline-none"
            onClick={(e) => {
              e.preventDefault();
              onNavigate();
            }}
            onMouseDown={(e) => {
              // Prevent dropdown from opening on click
              e.preventDefault();
            }}
          >
            {label}
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [aiToUsdOpen, setAiToUsdOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  // Get user initials for avatar fallback
  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const handleSignOut = () => {
    // TODO: Implement actual sign out logic when auth is added
    // Example: await signOut();
    router.push('/');
  };

  const handleTypingComplete = useCallback(() => {
    setTypingComplete(true);
  }, []);

  return (
    <div className="w-full pt-4 px-4 sticky top-0 z-50 bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
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
              href="/ai-to-usd"
              isOpen={aiToUsdOpen}
              onOpenChange={setAiToUsdOpen}
              onNavigate={() => router.push('/ai-to-usd')}
            >
              <DropdownMenuItem asChild>
                <Link href="/ai-to-usd/packages/web-apps">Web Apps</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ai-to-usd/packages/social-media">Social Media</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ai-to-usd/packages/agency">Agency</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ai-to-usd/packages/freelancing">Freelancing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/products">All Products</Link>
              </DropdownMenuItem>
            </NavDropdown>
            <NavDropdown
              label="Explore Courses"
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

          {/* Cart & Profile - Desktop */}
          <div className={`hidden md:flex items-center space-x-3 transition-opacity duration-1000 ${typingComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Cart Button */}
            <Link href="/checkout">
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Shopping cart</span>
              </Button>
            </Link>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    {isAuthenticated && user?.image && (
                      <AvatarImage src={user.image} alt={user.name || user.email || 'User'} />
                    )}
                    <AvatarFallback className="bg-red-500 text-white">
                      {isAuthenticated && user ? (
                        getUserInitials(user.name, user.email)
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Account menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isAuthenticated && user ? (
                  <>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name || 'Account'}
                        </p>
                        {user.email && (
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account/profile" className="flex items-center">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="flex items-center">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup" className="flex items-center">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign Up
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
                  <Link
                    href="/ai-to-usd"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium transition-colors hover:text-primary py-2"
                  >
                    AI to USD
                  </Link>
                  <div className="flex flex-col pl-4 space-y-2">
                    <Link
                      href="/ai-to-usd/packages/web-apps"
                      onClick={() => setOpen(false)}
                      className="text-base transition-colors hover:text-primary py-1"
                    >
                      Web Apps
                    </Link>
                    <Link
                      href="/ai-to-usd/packages/social-media"
                      onClick={() => setOpen(false)}
                      className="text-base transition-colors hover:text-primary py-1"
                    >
                      Social Media
                    </Link>
                    <Link
                      href="/ai-to-usd/packages/agency"
                      onClick={() => setOpen(false)}
                      className="text-base transition-colors hover:text-primary py-1"
                    >
                      Agency
                    </Link>
                    <Link
                      href="/ai-to-usd/packages/freelancing"
                      onClick={() => setOpen(false)}
                      className="text-base transition-colors hover:text-primary py-1"
                    >
                      Freelancing
                    </Link>
                    <Link
                      href="/products"
                      onClick={() => setOpen(false)}
                      className="text-base transition-colors hover:text-primary py-1"
                    >
                      All Products
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-lg font-medium py-2">Explore Courses</div>
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
                  <Link href="/checkout" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full flex items-center justify-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Cart
                    </Button>
                  </Link>
                  {isAuthenticated && user ? (
                    <div className="flex flex-col space-y-2">
                      <div className="px-2 py-1 border-b mb-2">
                        <p className="text-sm font-medium">{user.name || 'Account'}</p>
                        {user.email && (
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        )}
                      </div>
                      <Link href="/account/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 text-base transition-colors hover:text-primary py-1">
                        <UserCircle className="h-4 w-4" />
                        Profile
                      </Link>
                      <Link href="/account/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 text-base transition-colors hover:text-primary py-1">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <button 
                        onClick={() => {
                          handleSignOut();
                          setOpen(false);
                        }} 
                        className="flex items-center gap-2 text-base transition-colors hover:text-destructive text-destructive py-1 text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-2 text-base transition-colors hover:text-primary py-1">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Link>
                      <Link href="/signup" onClick={() => setOpen(false)} className="flex items-center gap-2 text-base transition-colors hover:text-primary py-1">
                        <LogIn className="h-4 w-4" />
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}

