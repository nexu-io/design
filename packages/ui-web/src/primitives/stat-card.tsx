import type * as React from "react";

import { cn } from "../lib/cn";
import { MonoDigits } from "../lib/mono-digits";
import { Badge, type BadgeProps } from "./badge";
import { Card, type CardProps } from "./card";
import { Progress, type ProgressProps } from "./progress";

const toneStyles = {
  default: "text-text-muted bg-surface-2",
  info: "text-info bg-info-subtle",
  accent: "text-accent bg-accent/10",
  success: "text-success bg-success-subtle",
  warning: "text-warning bg-warning-subtle",
  danger: "text-danger bg-danger-subtle",
} as const;

export type StatCardTone = keyof typeof toneStyles;

export interface StatCardTrend {
  label: React.ReactNode;
  variant?: BadgeProps["variant"];
}

export interface StatCardProps extends Omit<CardProps, "children"> {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ElementType;
  trend?: StatCardTrend;
  meta?: React.ReactNode;
  tone?: StatCardTone;
  progress?: number | null;
  progressVariant?: ProgressProps["variant"];
  progressMax?: number;
}

export function StatCard({
  className,
  label,
  value,
  icon: Icon,
  trend,
  meta,
  tone = "default",
  progress,
  progressVariant = "default",
  progressMax,
  variant,
  padding = "md",
  ...props
}: StatCardProps) {
  return (
    <Card className={className} variant={variant} padding={padding} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] text-text-muted">{label}</div>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            <MonoDigits>{value}</MonoDigits>
          </div>
        </div>
        {Icon ? (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-[10px]",
              toneStyles[tone],
            )}
          >
            <Icon size={16} aria-hidden="true" />
          </div>
        ) : null}
      </div>
      {(trend || meta) && (
        <div className="mt-2 flex items-center gap-2">
          {trend ? (
            <Badge size="xs" variant={trend.variant ?? "secondary"}>
              {trend.label}
            </Badge>
          ) : null}
          {meta ? <div className="text-[11px] text-text-muted">{meta}</div> : null}
        </div>
      )}
      {typeof progress === "number" ? (
        <Progress
          className="mt-3 bg-surface-3"
          value={progress}
          variant={progressVariant}
          max={progressMax}
          size="sm"
        />
      ) : null}
    </Card>
  );
}
