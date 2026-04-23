import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

/**
 * `surface` controls the rail background:
 *  - `solid` (default): opaque `bg-surface-1`, safe on any host.
 *  - `glass`: a frosted-glass wash designed to sit on top of a translucent
 *    host window. On macOS Electron the host `BrowserWindow` opts into
 *    `vibrancy: "sidebar"`, and the HTML tint is tuned per-theme so the
 *    rail looks right even when the **app theme and the OS appearance
 *    disagree** (dark-app-on-light-OS is the common case — the user
 *    toggles the in-app theme while macOS stays in Light Mode, so
 *    native vibrancy keeps rendering the desktop wallpaper behind the
 *    chrome).
 *
 *    Light mode: `bg-white/30 backdrop-saturate-150` — a thin white
 *    wash pops the rail against the grey-ish light sidebar vibrancy,
 *    which otherwise reads as muddy.
 *
 *    Dark mode: `bg-surface-0/85` — a `surface-0` wash (one step
 *    darker than the surrounding `surface-1` island). 85 % opacity
 *    is a deliberate design call: high enough to mute a light-OS
 *    vibrancy leak to a non-distracting amount, but low enough to
 *    keep a visible frosted feel on both dark-OS and light-OS hosts
 *    (higher values start to read as a flat opaque chip). Paired
 *    with `backdrop-saturate-100` so any residual leak is NOT
 *    colour-amplified — the previous `bg-black/80 +
 *    backdrop-saturate-125` combo used a similar alpha but pumped
 *    the leak's saturation, which is what made the rail read as
 *    whitish-coloured.
 *
 *    On web / non-vibrancy hosts the variant still works as a plain
 *    theme-matched tint; callers that want a hard opaque background
 *    should use `surface="solid"`.
 */
const activityBarVariants = cva(
  "flex w-12 shrink-0 flex-col items-center border-r border-border py-2",
  {
    variants: {
      surface: {
        solid: "bg-surface-1",
        glass: "bg-white/30 backdrop-saturate-150 dark:bg-surface-0/85 dark:backdrop-saturate-100",
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
