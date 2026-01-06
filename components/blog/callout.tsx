import { AlertCircle, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  type?: "info" | "warning" | "error" | "success" | "tip";
  children: React.ReactNode;
}

const calloutConfig = {
  info: {
    icon: Info,
    className: "bg-info/10 border-info/20 text-info-foreground",
    iconClassName: "text-info",
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-warning/10 border-warning/20 text-warning-foreground",
    iconClassName: "text-warning",
  },
  error: {
    icon: AlertCircle,
    className: "bg-destructive/10 border-destructive/20 text-destructive",
    iconClassName: "text-destructive",
  },
  success: {
    icon: CheckCircle,
    className: "bg-success/10 border-success/20 text-success-foreground",
    iconClassName: "text-success",
  },
  tip: {
    icon: Info,
    className: "bg-primary/10 border-primary/20 text-primary-foreground",
    iconClassName: "text-primary",
  },
};

export function Callout({ type = "info", children }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "border rounded-lg p-4 my-4 flex gap-3",
        config.className
      )}
    >
      <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", config.iconClassName)} />
      <div className="flex-1">{children}</div>
    </div>
  );
}

