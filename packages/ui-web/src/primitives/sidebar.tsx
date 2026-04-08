import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "../lib/cn";

export function Sidebar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <aside
      data-slot="sidebar"
      className={cn("flex min-h-0 min-w-0 flex-col border-r border-border bg-surface-1", className)}
      {...props}
    />
  );
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="sidebar-header" className={cn("shrink-0", className)} {...props} />;
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="sidebar-content" className={cn("min-h-0 flex-1", className)} {...props} />;
}

export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="sidebar-footer" className={cn("shrink-0", className)} {...props} />;
}

export function NavigationMenu({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      data-slot="navigation-menu"
      className={cn("flex min-w-0 flex-col", className)}
      {...props}
    />
  );
}

export function NavigationMenuList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="navigation-menu-list" className={cn("space-y-0.5", className)} {...props} />
  );
}

export function NavigationMenuItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="navigation-menu-item" className={cn("min-w-0", className)} {...props} />;
}

export function NavigationMenuLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="navigation-menu-label"
      className={cn(
        "px-3 pb-2 text-xs font-medium uppercase tracking-wider text-text-muted",
        className,
      )}
      {...props}
    />
  );
}

export interface NavigationMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  active?: boolean;
}

export const NavigationMenuButton = React.forwardRef<HTMLButtonElement, NavigationMenuButtonProps>(
  ({ className, asChild = false, active = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="navigation-menu-button"
        data-active={active ? "true" : "false"}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-base font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active
            ? "bg-surface-2 text-text-primary"
            : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
          className,
        )}
        {...props}
      />
    );
  },
);

NavigationMenuButton.displayName = "NavigationMenuButton";
