"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map((h) => ({
        id: h.id,
        element: document.getElementById(h.id),
      }));

      const visibleHeadings = headingElements.filter(
        ({ element }) =>
          element && element.getBoundingClientRect().top <= 100
      );

      if (visibleHeadings.length > 0) {
        const lastVisible = visibleHeadings[visibleHeadings.length - 1];
        setActiveId(lastVisible.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24">
      <div className="border rounded-lg p-4 bg-muted/50">
        <h3 className="text-sm font-semibold mb-3">Table of Contents</h3>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "block py-1 transition-colors hover:text-primary",
                  heading.level === 1 && "font-semibold",
                  heading.level === 2 && "pl-2",
                  heading.level === 3 && "pl-4 text-muted-foreground",
                  activeId === heading.id && "text-primary font-medium"
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

