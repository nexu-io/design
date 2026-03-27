import { X } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/cn";
import { Button } from "./button";

function formatWidth(value: number | string | undefined) {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export interface DetailPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
}

export function DetailPanel({ className, width = 400, style, ...props }: DetailPanelProps) {
  return (
    <aside
      data-slot="detail-panel"
      className={cn(
        "flex h-full shrink-0 flex-col overflow-hidden border-l border-border bg-surface-1",
        className,
      )}
      style={{ ...style, width: formatWidth(width) }}
      {...props}
    />
  );
}

export function DetailPanelHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="detail-panel-header"
      className={cn("flex items-start gap-3 border-b border-border px-4 py-3", className)}
      {...props}
    />
  );
}

export function DetailPanelContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="detail-panel-content" className={cn("min-h-0 flex-1", className)} {...props} />
  );
}

export function DetailPanelTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="detail-panel-title"
      className={cn("text-[13px] font-semibold text-text-primary", className)}
      {...props}
    />
  );
}

export function DetailPanelDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="detail-panel-description"
      className={cn("mt-0.5 text-[11px] text-text-muted", className)}
      {...props}
    />
  );
}

export interface DetailPanelCloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  srLabel?: string;
}

export const DetailPanelCloseButton = React.forwardRef<
  HTMLButtonElement,
  DetailPanelCloseButtonProps
>(({ className, srLabel = "Close panel", children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn("shrink-0 rounded-md", className)}
      {...props}
    >
      {children ?? <X size={14} />}
      <span className="sr-only">{srLabel}</span>
    </Button>
  );
});

DetailPanelCloseButton.displayName = "DetailPanelCloseButton";
