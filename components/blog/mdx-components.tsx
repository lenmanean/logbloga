import Image from "next/image";
import Link from "next/link";
import { Code2, ExternalLink } from "lucide-react";

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
        className="text-primary hover:underline inline-flex items-center gap-1"
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
    return (
      <code
        {...props}
        className="block bg-muted p-4 rounded-lg overflow-x-auto my-4"
      />
    );
  },
  pre: (props: any) => (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
      {props.children}
    </pre>
  ),
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
      className="border-l-4 border-primary pl-4 my-4 italic"
      {...props}
    />
  ),
};

