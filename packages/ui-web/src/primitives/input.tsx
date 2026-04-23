import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

// Surface — preserve the same RELATIONSHIP to the parent card across
// themes: the input sits slightly DEEPER than its card so the control
// reads as an inset well.
//   Light: `surface-0` (98%) on a `surface-1` card (100%) → subtly muted
//          recess, matches shadcn / Radix conventions.
//   Dark:  raw `surface-0` (5.7%) on a `surface-1` card (11.2%) lands as
//          a near-black pit that fights the chrome. We mix surface-0 and
//          surface-1 50/50 to land between them (~#141419), which stays
//          clearly deeper than the card but well above pure black — same
//          inset intent, calmer contrast. Textarea / Select / Combobox
//          apply the same recipe so form fields read as one family.
const inputShellVariants = cva(
  "flex w-full items-center gap-2 rounded-lg border border-input bg-surface-0 dark:bg-[color:color-mix(in_srgb,var(--color-surface-0),var(--color-surface-1))] text-foreground transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20",
  {
    variants: {
      size: {
        sm: "min-h-8 px-2.5 text-sm",
        md: "min-h-10 px-3 text-base",
        lg: "min-h-11 px-3.5 text-lg",
      },
      invalid: {
        true: "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      invalid: false,
    },
  },
);

/** Native input wrapped in a bordered shell; supports sizes, invalid state, and optional icons. */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputShellVariants> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  inputClassName?: string;
}

/**
 * Text input with optional leading/trailing icons, size variants, and invalid styling.
 *
 * @example
 * <Input type="email" placeholder="you@example.com" />
 *
 * @example
 * <Input
 *   leadingIcon={<Search size={16} />}
 *   trailingIcon={<AlertCircle size={16} />}
 *   invalid
 *   placeholder="Fix errors"
 * />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputClassName,
      leadingIcon,
      trailingIcon,
      invalid,
      size,
      type = "text",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(inputShellVariants({ invalid, size }), className)}
        data-slot="input"
        data-invalid={invalid ? "" : undefined}
      >
        {leadingIcon ? (
          <span className="text-muted-foreground" aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          type={type}
          aria-invalid={invalid || undefined}
          className={cn(
            // Placeholder contrast: in light mode `muted-foreground/50`
            // (~#7C8084 at 50%) is a subtle grey on a white input; in
            // dark mode the same token is much brighter (~#A3A3A3) and
            // at /50 on the deep-ish input surface it pops too hard
            // against the control background. Dropping to /35 in dark
            // keeps the hint visible without yelling.
            "w-full border-0 bg-transparent p-0 text-foreground outline-none placeholder:text-muted-foreground/50 dark:placeholder:text-muted-foreground/35 disabled:cursor-not-allowed disabled:opacity-50",
            inputClassName,
          )}
          {...props}
        />
        {trailingIcon ? (
          <span className="text-muted-foreground" aria-hidden="true">
            {trailingIcon}
          </span>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
