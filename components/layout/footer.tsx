'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PUBLIC_PATH_PREFIXES = ['/', '/about', '/contact', '/blog', '/resources', '/legal', '/checkout'];
const PRIVATE_PATH_PREFIXES = ['/account', '/admin', '/auth'];

function isPublicPage(pathname: string): boolean {
  if (pathname === '/') return true;
  const isPrivate = PRIVATE_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isPrivate) return false;
  const isPublic = PUBLIC_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));
  return isPublic;
}

export function Footer() {
  const pathname = usePathname();
  if (!pathname || !isPublicPage(pathname)) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-10">
          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/legal/terms" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/refund" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/resources/faq" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/resources/case-studies" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/resources/community" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                  Community
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-10 border-t pt-8 md:mt-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Link href="/" className="text-sm font-semibold text-foreground hover:text-primary">
              Logbloga
            </Link>
            <p className="text-xs text-muted-foreground">
              © {currentYear} Logbloga. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
