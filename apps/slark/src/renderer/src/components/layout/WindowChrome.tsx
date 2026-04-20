import * as React from "react";

import { cn } from "@nexu-design/ui-web";

export interface WindowChromeProps extends React.HTMLAttributes<HTMLDivElement> {}

export const WindowChrome = React.forwardRef<HTMLDivElement, WindowChromeProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("drag-region shrink-0", className)} {...props} />;
  },
);

WindowChrome.displayName = "WindowChrome";

export function TitleBarSpacer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <WindowChrome aria-hidden="true" className={cn("h-10 w-full", className)} {...props} />;
}

export function TitleBarDragRegion({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <WindowChrome
      aria-hidden="true"
      className={cn("absolute inset-x-0 top-0 z-20 h-10 w-full", className)}
      {...props}
    />
  );
}
