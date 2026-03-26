import * as React from "react";

import { cn } from "../lib/cn";

const progressVariants = {
  default: "bg-foreground/80",
  success: "bg-success",
  warning: "bg-warning",
  accent: "bg-accent",
} as const;

const progressSizes = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
} as const;

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number | null;
  max?: number;
  variant?: keyof typeof progressVariants;
  size?: keyof typeof progressSizes;
  indicatorClassName?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = "default",
      size = "md",
      indicatorClassName,
      ...props
    },
    ref,
  ) => {
    const clampedMax = max > 0 ? max : 100;
    const safeValue = typeof value === "number" ? Math.min(Math.max(value, 0), clampedMax) : null;
    const percentage = safeValue === null ? 0 : (safeValue / clampedMax) * 100;

    return (
      <div
        ref={ref}
        role="progressbar"
        tabIndex={0}
        aria-valuemax={clampedMax}
        aria-valuemin={0}
        aria-valuenow={safeValue ?? undefined}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-surface-3",
          progressSizes[size],
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 rounded-full transition-transform duration-300 ease-out",
            progressVariants[variant],
            indicatorClassName,
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    );
  },
);

Progress.displayName = "Progress";
