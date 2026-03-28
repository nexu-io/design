import type * as React from "react";

import { cn } from "../lib/cn";

export interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PageShell({ className, ...props }: PageShellProps) {
  return <div className={cn("mx-auto max-w-5xl p-8", className)} {...props} />;
}
