import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

const navItemVariants = cva(
  "flex w-full items-center gap-2.5 rounded-lg text-left text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
  {
    variants: {
      density: {
        default: "px-3 py-2",
        compact: "px-3 py-1.5",
      },
      active: {
        true: "bg-surface-2 text-text-primary font-semibold",
        false: "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
      },
    },
    defaultVariants: {
      density: "default",
      active: false,
    },
  },
);

export interface NavItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof navItemVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  label?: string;
  trailing?: React.ReactNode;
}

export const NavItem = React.forwardRef<HTMLButtonElement, NavItemProps>(
  (
    {
      className,
      asChild = false,
      active = false,
      density = "default",
      icon,
      label,
      trailing,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="nav-item"
        data-active={active ? "true" : "false"}
        aria-current={active ? "page" : undefined}
        className={cn(navItemVariants({ density, active: !!active }), className)}
        {...props}
      >
        {icon}
        {children ?? (
          <span className={density === "compact" ? "truncate text-xs" : ""}>{label}</span>
        )}
        {trailing ? <span className="ml-auto shrink-0">{trailing}</span> : null}
      </Comp>
    );
  },
);

NavItem.displayName = "NavItem";

export { navItemVariants };
