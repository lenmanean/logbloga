"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CodeBlock = ({ className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const language = className?.replace("language-", "") || "";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group my-4">
      {language && (
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
            {language}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleCopy}
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      )}
      <pre
        className={cn(
          "bg-muted p-4 rounded-lg overflow-x-auto text-sm",
          language && "pt-10"
        )}
        {...props}
      >
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

export const mdxComponents = {
  img: (props: any) => (
    <Image
      {...props}
      alt={props.alt || ""}
      width={800}
      height={400}
      className="rounded-lg my-4"
    />
  ),
  a: (props: any) => {
    const isExternal = props.href?.startsWith("http");
    return (
      <Link
        {...props}
        href={props.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-content-link hover:text-content-link-hover underline inline-flex items-center gap-1"
      >
        {props.children}
        {isExternal && <ExternalLink className="h-3 w-3" />}
      </Link>
    );
  },
  code: (props: any) => {
    const isInline = !props.className;
    if (isInline) {
      return (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
          {props.children}
        </code>
      );
    }
    return <CodeBlock {...props} />;
  },
  pre: (props: any) => {
    return <>{props.children}</>;
  },
  h1: (props: any) => (
    <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-2xl font-semibold mt-4 mb-2" {...props} />
  ),
  p: (props: any) => <p className="my-4 leading-7" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside my-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside my-4 space-y-2" {...props} />,
  li: (props: any) => <li className="ml-4" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground"
      {...props}
    />
  ),
  // Custom components
  Callout: ({ type, children }: { type?: string; children: React.ReactNode }) => {
    // This will be handled by the Callout component
    return null;
  },
};

