import { ReactNode } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button asChild>
          <Link href={action.href}><span>{action.label}</span></Link>
        </Button>
      )}
    </div>
  );
}

