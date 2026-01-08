"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassPanelProps {
  title: string;
  description?: string;
  href: string;
  icon?: ReactNode;
  className?: string;
}

export function GlassPanel({
  title,
  description,
  href,
  icon,
  className,
}: GlassPanelProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative block p-8 rounded-xl",
        "bg-background/30 backdrop-blur-lg border border-white/20",
        "hover:bg-background/40 hover:border-[#39f400]/60",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1",
        "hover:shadow-[0_0_30px_rgba(57,244,0,0.4)]",
        className
      )}
      style={{
        boxShadow: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 30px rgba(57, 244, 0, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {icon && (
        <div className="mb-4 text-[#39f400] group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2 group-hover:text-[#39f400] transition-colors duration-300">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
      {/* Neon green glow border on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 rounded-xl border-2 border-[#39f400]/60" 
             style={{ boxShadow: "0 0 20px rgba(57, 244, 0, 0.5), inset 0 0 20px rgba(57, 244, 0, 0.1)" }} />
      </div>
    </Link>
  );
}

