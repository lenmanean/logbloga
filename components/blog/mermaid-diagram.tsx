'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface MermaidDiagramProps {
  code: string;
  className?: string;
}

/**
 * Renders Mermaid diagram code as SVG. Client component - runs mermaid.render() in useEffect.
 */
export function MermaidDiagram({ code, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    if (!code?.trim() || !containerRef.current) return;

    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'loose',
        });
        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
        const { svg: rendered } = await mermaid.render(id, code);
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram');
          setSvg(null);
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (error) {
    return (
      <div
        className={cn(
          'my-8 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive',
          className
        )}
      >
        <p className="font-medium">Diagram could not be rendered</p>
        <pre className="mt-2 overflow-x-auto text-xs opacity-80">{code}</pre>
      </div>
    );
  }

  if (svg) {
    return (
      <div
        ref={containerRef}
        className={cn('my-8 flex justify-center [&_svg]:max-w-full [&_svg]:h-auto', className)}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('my-8 flex min-h-[120px] items-center justify-center rounded-lg bg-muted/50', className)}
    >
      <span className="text-sm text-muted-foreground">Loading diagram...</span>
    </div>
  );
}
