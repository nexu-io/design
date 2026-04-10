import type * as React from "react";

import { cn } from "../lib/cn";

/**
 * Page-level header: title, optional description and actions.
 *
 * @example
 * <PageHeader title="Dashboard" description="Overview." actions={<button type="button">New</button>} />
 */
export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /**
   * `shell` matches embedded desktop shells (e.g. Tauri): 24px/700 title and 12px tertiary description,
   * aligned with app-level `.heading-page` / `.heading-page-desc` rhythm.
   */
  density?: "default" | "shell";
}

/**
 * Renders a `<header>` with an `<h1>`, optional description, and optional action area.
 *
 * @example
 * <PageHeader title="Dashboard" description="Overview." actions={<button type="button">New</button>} />
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
  density = "default",
  ...props
}: PageHeaderProps) {
  const isShell = density === "shell";

  return (
    <header
      className={cn(
        "flex flex-col sm:flex-row sm:items-start sm:justify-between",
        isShell ? "gap-2 pb-6" : "gap-3 pb-6",
        className,
      )}
      {...props}
    >
      <div className={isShell ? "space-y-1" : "space-y-2"}>
        <h1
          className={cn(
            isShell
              ? "text-2xl font-bold tracking-tight text-[var(--color-text-heading)]"
              : "text-3xl font-semibold tracking-tight",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              isShell
                ? "text-xs font-normal leading-snug text-[var(--color-text-tertiary)] [&_a]:text-[var(--color-link)]"
                : "text-sm text-muted-foreground [&_a]:text-[var(--color-link)]",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
