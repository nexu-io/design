import type * as React from "react";

import { cn } from "../lib/cn";

export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DataTable({ children, className, ...props }: DataTableProps) {
  return (
    <div
      data-slot="data-table"
      className={cn(
        "overflow-hidden rounded-xl border border-border-subtle bg-surface-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DataTableHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="data-table-header"
      className={cn(
        "flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}

export function DataTableToolbar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="data-table-toolbar"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

export function DataTableTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="data-table-title"
      className={cn("text-[13px] font-semibold text-text-primary", className)}
      {...props}
    />
  );
}

export function DataTableDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="data-table-description"
      className={cn("text-[11px] text-text-muted", className)}
      {...props}
    />
  );
}

export function DataTableFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="data-table-footer"
      className={cn(
        "flex items-center justify-between gap-3 border-t border-border-subtle px-4 py-2.5 text-[11px] text-text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function DataTableEmpty({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="data-table-empty"
      className={cn("px-4 py-8 text-center text-[12px] text-text-muted", className)}
      {...props}
    />
  );
}
