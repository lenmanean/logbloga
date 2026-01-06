import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";

interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactElement;
}

export function FormField({
  label,
  error,
  hint,
  required,
  children,
}: FormFieldProps) {
  const id = children.props.id || React.useId();
  const hasError = !!error;

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className={hasError ? "text-destructive" : ""}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {React.cloneElement(children, {
        id,
        "aria-invalid": hasError,
        "aria-describedby": error
          ? `${id}-error`
          : hint
          ? `${id}-hint`
          : undefined,
        className: cn(children.props.className, hasError && "border-destructive"),
      })}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

