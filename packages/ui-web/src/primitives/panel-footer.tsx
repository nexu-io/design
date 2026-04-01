import type * as React from "react";

import { cn } from "../lib/cn";

export interface PanelFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "between" | "end" | "start";
}

export function PanelFooter({ className, align = "between", ...props }: PanelFooterProps) {
  return (
    <div
      data-slot="panel-footer"
      className={cn(
        "flex flex-wrap items-center gap-2 border-t border-border bg-surface-1 px-4 py-3",
        align === "between" && "justify-between",
        align === "end" && "justify-end",
        align === "start" && "justify-start",
        className,
      )}
      {...props}
    />
  );
}

export function PanelFooterActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="panel-footer-actions"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

export function PanelFooterMeta({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="panel-footer-meta"
      className={cn("text-xs text-text-muted", className)}
      {...props}
    />
  );
}
