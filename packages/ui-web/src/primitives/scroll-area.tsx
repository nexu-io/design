import * as React from "react";

import { cn } from "../lib/cn";

export const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="scroll-area"
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <div
          data-slot="scroll-area-viewport"
          className="h-full w-full overflow-auto [scrollbar-color:var(--color-border-hover)_transparent] [scrollbar-width:thin]"
        >
          {children}
        </div>
      </div>
    );
  },
);

ScrollArea.displayName = "ScrollArea";

export const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }
>(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      className={cn(
        "pointer-events-none absolute rounded-full bg-border/60",
        orientation === "vertical" ? "bottom-2 right-1 top-2 w-1" : "bottom-1 left-2 right-2 h-1",
        className,
      )}
      {...props}
    />
  );
});

ScrollBar.displayName = "ScrollBar";
