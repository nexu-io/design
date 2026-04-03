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
}

/**
 * Renders a `<header>` with an `<h1>`, optional description, and optional action area.
 *
 * @example
 * <PageHeader title="Dashboard" description="Overview." actions={<button type="button">New</button>} />
 */
export function PageHeader({ title, description, actions, className, ...props }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 pb-6 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
      {...props}
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
