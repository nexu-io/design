import type * as React from "react";

import { cn } from "../lib/cn";
import { Card, type CardProps } from "./card";

export interface EntityCardProps extends Omit<CardProps, "padding"> {
  interactive?: boolean;
  selected?: boolean;
}

export function EntityCard({
  className,
  interactive = false,
  selected = false,
  variant = "outline",
  ...props
}: EntityCardProps) {
  return (
    <Card
      data-slot="entity-card"
      className={cn(
        "rounded-xl border-border bg-surface-1 p-0",
        interactive &&
          "cursor-pointer transition-colors hover:border-border-hover hover:bg-surface-2/60",
        selected && "border-accent/40 bg-accent/5 ring-1 ring-accent/20",
        className,
      )}
      padding="none"
      variant={variant}
      {...props}
    />
  );
}

export function EntityCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-start gap-3 p-4", className)} {...props} />;
}

export function EntityCardMedia({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="entity-card-media"
      className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", className)}
      {...props}
    />
  );
}

export function EntityCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-[14px] font-semibold text-text-primary", className)} {...props} />;
}

export function EntityCardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-1 text-[12px] leading-relaxed text-text-secondary", className)}
      {...props}
    />
  );
}

export function EntityCardMeta({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="entity-card-meta"
      className={cn(
        "mt-3 flex flex-wrap items-center gap-2 text-[11px] text-text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function EntityCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 pb-4", className)} {...props} />;
}

export function EntityCardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-2 border-t border-border-subtle px-4 py-3", className)}
      {...props}
    />
  );
}
