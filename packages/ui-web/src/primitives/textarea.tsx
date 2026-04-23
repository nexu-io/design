import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

// See Input primitive for the full rationale. Short version: input
// surfaces sit slightly DEEPER than the parent card in both themes; dark
// mode mixes `surface-0` and `surface-1` so the well stays below the card
// without falling to near-black.
const textareaVariants = cva(
  // `dark:placeholder:text-muted-foreground/35` — see Input primitive for
  // why placeholder opacity drops in dark mode.
  "flex min-h-20 w-full resize-none rounded-lg border border-input bg-surface-0 dark:bg-[color:color-mix(in_srgb,var(--color-surface-0),var(--color-surface-1))] px-4 py-3 text-base text-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] placeholder:text-muted-foreground/50 dark:placeholder:text-muted-foreground/35 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50",
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
