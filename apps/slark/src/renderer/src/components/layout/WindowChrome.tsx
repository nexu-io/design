import * as React from "react";

import { cn } from "@/lib/utils";

export interface WindowChromeProps extends React.HTMLAttributes<HTMLDivElement> {}

export const WindowChrome = React.forwardRef<HTMLDivElement, WindowChromeProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("drag-region shrink-0", className)} {...props} />;
  },
);

WindowChrome.displayName = "WindowChrome";
