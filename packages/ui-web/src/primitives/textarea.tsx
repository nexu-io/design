import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

const textareaVariants = cva(
  "flex min-h-20 w-full resize-none rounded-lg border border-input bg-surface-0 px-4 py-3 text-[14px] text-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] placeholder:text-muted-foreground/50 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      invalid: {
        true: "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
        false: "",
      },
    },
    defaultVariants: {
      invalid: false,
    },
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(textareaVariants({ invalid }), className)}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
