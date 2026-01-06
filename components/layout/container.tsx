import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "content" | "product" | "wide";
}

const variantClasses = {
  default: "container mx-auto px-4",
  content: "container-content",
  product: "container-product",
  wide: "container mx-auto px-4 max-w-7xl",
};

export function Container({
  children,
  className,
  variant = "default",
}: ContainerProps) {
  return (
    <div className={cn(variantClasses[variant], className)}>{children}</div>
  );
}

