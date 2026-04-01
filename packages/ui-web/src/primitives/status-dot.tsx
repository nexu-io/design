import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

const statusDotVariants = cva("shrink-0 rounded-full", {
  variants: {
    status: {
      success: "bg-[var(--color-success)]",
      warning: "bg-[var(--color-warning)]",
      error: "bg-[var(--color-error)]",
      info: "bg-[var(--color-info)]",
      neutral: "bg-[var(--color-text-muted)]",
    },
    size: {
      xs: "size-1",
      sm: "size-1.5",
      default: "size-2",
      lg: "size-2.5",
    },
    pulse: {
      true: "animate-pulse",
      false: "",
    },
  },
  defaultVariants: {
    status: "neutral",
    size: "default",
    pulse: false,
  },
});

export interface StatusDotProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusDotVariants> {}

export const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ className, status, size, pulse, ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      data-slot="status-dot"
      aria-label={status ?? "neutral"}
      className={cn(statusDotVariants({ status, size, pulse }), className)}
      {...props}
    />
  ),
);

StatusDot.displayName = "StatusDot";

export { statusDotVariants };
