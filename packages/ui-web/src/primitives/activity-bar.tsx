import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "../lib/cn";

export function ActivityBar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="activity-bar"
      className={cn(
        "flex w-12 shrink-0 flex-col items-center border-r border-border bg-surface-1 py-2",
        className,
      )}
      {...props}
    />
  );
}

export function ActivityBarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="activity-bar-header"
      className={cn("mb-3 flex w-8 flex-col items-center border-b border-border pb-3", className)}
      {...props}
    />
  );
}

export function ActivityBarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="activity-bar-content"
      className={cn("flex flex-1 flex-col items-center gap-0.5", className)}
      {...props}
    />
  );
}

export function ActivityBarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="activity-bar-footer"
      className={cn("flex w-8 flex-col items-center gap-1 border-t border-border pt-2", className)}
      {...props}
    />
  );
}

export interface ActivityBarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  active?: boolean;
}

export const ActivityBarItem = React.forwardRef<HTMLButtonElement, ActivityBarItemProps>(
  ({ className, asChild = false, active = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="activity-bar-item"
        data-active={active ? "true" : "false"}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex size-10 items-center justify-center rounded-lg text-text-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active ? "text-text-primary" : "hover:bg-surface-3 hover:text-text-secondary",
          className,
        )}
        {...props}
      />
    );
  },
);

ActivityBarItem.displayName = "ActivityBarItem";

export function ActivityBarIndicator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="activity-bar-indicator"
      aria-hidden="true"
      className={cn("absolute inset-y-2 left-0 w-0.5 rounded-r bg-accent", className)}
      {...props}
    />
  );
}
