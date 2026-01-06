"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { NewsletterForm } from "@/components/ui/newsletter-form";
import { getBlogPosts } from "@/lib/db/blog";
import { Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-lg font-semibold">LogBloga</h3>
            <p className="text-sm text-muted-foreground">
              Your destination for digital products, technology insights, and
              productivity tools.
            </p>
            <div>
              <h4 className="text-sm font-semibold mb-3">Newsletter</h4>
              <NewsletterForm />
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Products</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=ai"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  AI Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=development"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Development
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a
                href="https://twitter.com/logbloga"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/lenmanean/logbloga"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/logbloga"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} LogBloga. All rights reserved.</p>
          <Link
            href="#top"
            className="hover:text-foreground transition-colors"
            aria-label="Back to top"
          >
            Back to top ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}

