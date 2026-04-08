import type * as React from "react";

import { cn } from "../lib/cn";

export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  action?: React.ReactNode;
}

export function SectionHeader({ title, action, className, ...props }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)} {...props}>
      <div className="min-w-0">{title}</div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
