import type * as React from "react";
import { cn } from "@nexu-design/ui-web";

export function TitleBarSpacer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className={cn("drag-region h-10 w-full shrink-0", className)}
      {...props}
    />
  );
}
