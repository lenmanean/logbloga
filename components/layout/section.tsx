import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "muted" | "accent";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

const variantClasses = {
  default: "",
  muted: "bg-muted/50",
  accent: "bg-accent/10",
};

const paddingClasses = {
  none: "",
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
  xl: "py-24",
};

export function Section({
  children,
  className,
  variant = "default",
  padding = "md",
}: SectionProps) {
  return (
    <section
      className={cn(
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </section>
  );
}

