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
        "rounded-xl border-border-subtle bg-surface-0 p-0",
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
  return <div className={cn("flex items-start gap-3 px-4 pt-4 pb-2", className)} {...props} />;
}

export function EntityCardMedia({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="entity-card-media"
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-surface-0",
        className,
      )}
      {...props}
    />
  );
}

export interface EntityCardMediaImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function EntityCardMediaImage({ className, alt, ...props }: EntityCardMediaImageProps) {
  return (
    <img
      data-slot="entity-card-media-image"
      className={cn("size-full object-contain p-2", className)}
      alt={alt}
      {...props}
    />
  );
}

export function EntityCardMediaFallback({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="entity-card-media-fallback"
      className={cn("flex size-full items-center justify-center text-text-primary", className)}
      {...props}
    />
  );
}

export function EntityCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold text-text-primary", className)} {...props} />;
}

export function EntityCardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-1 text-sm leading-relaxed text-text-secondary", className)} {...props} />
  );
}

export function EntityCardMeta({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="entity-card-meta"
      className={cn("mt-3 flex flex-wrap items-center gap-2 text-xs text-text-muted", className)}
      {...props}
    />
  );
}

export function EntityCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 pb-3", className)} {...props} />;
}

export function EntityCardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-2 border-t border-border-subtle px-4 py-3", className)}
      {...props}
    />
  );
}
