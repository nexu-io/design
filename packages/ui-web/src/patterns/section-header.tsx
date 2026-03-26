import * as React from "react";

import { cn } from "../lib/cn";

export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function SectionHeader({
  title,
  description,
  action,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)} {...props}>
      <div className="space-y-1">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
