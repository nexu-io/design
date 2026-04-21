import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

/**
 * `surface` controls the rail background:
 *  - `solid` (default): opaque `bg-surface-1`, safe on any host.
 *  - `glass`: a light frosted-glass wash (`bg-white/30 backdrop-saturate-150`)
 *    designed to sit on top of a translucent host window. On macOS Electron
 *    this gives a true frosted look when the host `BrowserWindow` opts into
 *    `vibrancy: "sidebar"` (and locks `nativeTheme.themeSource = "light"` so
 *    the native vibrancy always renders light). On web / non-vibrancy hosts
 *    it degrades gracefully to a soft white tint — never dark.
 */
const activityBarVariants = cva(
  "flex w-12 shrink-0 flex-col items-center border-r border-border py-2",
  {
    variants: {
      surface: {
        solid: "bg-surface-1",
        glass: "bg-white/30 backdrop-saturate-150",
      },
    },
    defaultVariants: {
      surface: "solid",
    },
  },
);

export interface ActivityBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof activityBarVariants> {}

export function ActivityBar({ className, surface, ...props }: ActivityBarProps) {
  return (
    <div
      data-slot="activity-bar"
      data-surface={surface ?? "solid"}
      className={cn(activityBarVariants({ surface }), className)}
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
