import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

const navItemVariants = cva(
  "flex w-full items-center gap-2.5 rounded-[var(--radius-6)] text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      tone: {
        default:
          "bg-transparent text-text-primary hover:bg-[rgba(0,0,0,0.06)] hover:text-text-primary",
        accent: "bg-transparent text-text-secondary hover:bg-surface-3 hover:text-text-primary",
      },
      size: {
        default: "px-3 py-2",
        compact: "px-3 py-1.5",
      },
      selected: {
        true: "bg-[rgba(0,0,0,0.08)] text-text-primary",
        false: "",
      },
    },
    compoundVariants: [
      {
        tone: "accent",
        selected: true,
        className: "bg-clone-subtle text-clone",
      },
    ],
    defaultVariants: {
      tone: "default",
      size: "default",
      selected: false,
    },
  },
);

export interface NavItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof navItemVariants> {
  asChild?: boolean;
}

export const NavItem = React.forwardRef<HTMLButtonElement, NavItemProps>(
  ({ asChild = false, className, selected, size, tone, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="nav-item"
        data-state={selected ? "selected" : undefined}
        className={cn(navItemVariants({ selected, size, tone }), className)}
        type={asChild ? undefined : type}
        {...props}
      />
    );
  },
);

NavItem.displayName = "NavItem";

export { navItemVariants };
