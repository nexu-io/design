import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 leading-none font-medium transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        brand: "border border-accent/20 bg-accent/5 text-accent",
        accent: "border border-accent/20 bg-accent/5 text-accent",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline:
          "border-border bg-background text-foreground hover:border-border-hover hover:bg-accent/5",
        success: "bg-[var(--color-success-subtle)] text-[var(--color-success)]",
        warning: "bg-[var(--color-warning-subtle)] text-[var(--color-warning)]",
        danger: "bg-[var(--color-danger-subtle)] text-[var(--color-danger)]",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
      },
      size: {
        xs: "px-1.5 py-0.5 text-[9px]",
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-2 py-0.5 text-[11px]",
        lg: "px-3 py-1.5 text-[13px] font-semibold",
      },
      radius: {
        full: "rounded-full",
        md: "rounded-md",
        lg: "rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "full",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, radius, ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, radius }), className)}
      {...props}
    />
  );
}

export { badgeVariants };
