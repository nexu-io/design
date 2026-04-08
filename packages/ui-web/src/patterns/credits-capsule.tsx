import type * as React from "react";

import { cn } from "../lib/cn";
import { Progress, type ProgressProps } from "../primitives/progress";

export interface CreditsCapsuleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  badge?: React.ReactNode;
  value: React.ReactNode;
  meta?: React.ReactNode;
  hint?: React.ReactNode;
  action?: React.ReactNode;
  breakdown?: React.ReactNode;
  footer?: React.ReactNode;
  progress?: number | null;
  progressMax?: number;
  progressVariant?: ProgressProps["variant"];
  progressAriaLabel?: string;
}

export function CreditsCapsule({
  title = "Credits",
  badge,
  value,
  meta,
  hint,
  action,
  breakdown,
  footer,
  progress,
  progressMax,
  progressVariant = "accent",
  progressAriaLabel = "Credit usage progress",
  className,
  ...props
}: CreditsCapsuleProps) {
  return (
    <div
      className={cn("rounded-2xl border border-border bg-surface-1 p-5 shadow-rest", className)}
      {...props}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-semibold text-text-primary">{title}</div>
              {badge}
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
              {value}
            </div>
            {(meta || hint) && (
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-text-muted">
                {meta ? <span>{meta}</span> : null}
                {hint ? <span>{hint}</span> : null}
              </div>
            )}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>

        {typeof progress === "number" ? (
          <Progress
            aria-label={progressAriaLabel}
            max={progressMax}
            value={progress}
            variant={progressVariant}
            size="lg"
          />
        ) : null}

        {breakdown ? <div>{breakdown}</div> : null}
        {footer ? <div className="border-t border-border/50 pt-3">{footer}</div> : null}
      </div>
    </div>
  );
}
