import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

const filterPillsVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      pill: "flex-wrap gap-2",
      segment: "gap-1 rounded-full bg-surface-2 p-1",
    },
    size: {
      sm: "",
      md: "",
    },
  },
  defaultVariants: {
    variant: "pill",
    size: "sm",
  },
});

export interface FilterPillItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ComponentType<{ size?: number }>;
  emoji?: string;
}

export interface FilterPillsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof filterPillsVariants> {
  items: FilterPillItem[];
  value: string;
  onChange: (id: string) => void;
}

const pillActiveClass = "bg-[var(--color-accent)] text-[var(--color-accent-fg)]";
const pillInactiveClass =
  "border border-border bg-surface-1 text-text-secondary hover:text-text-primary hover:border-[var(--color-border-hover)]";
const segmentActiveClass = "bg-surface-1 text-text-primary shadow-[var(--shadow-rest)]";
const segmentInactiveClass = "text-text-secondary hover:text-text-primary";

const sizeMap = {
  sm: { button: "h-7 px-3 text-xs", count: "text-2xs" },
  md: { button: "h-8 px-4 text-sm", count: "text-xs" },
} as const;

export const FilterPills = React.forwardRef<HTMLDivElement, FilterPillsProps>(
  ({ className, items, value, onChange, variant = "pill", size = "sm", ...props }, ref) => {
    const s = sizeMap[size ?? "sm"];

    return (
      <div
        ref={ref}
        data-slot="filter-pills"
        className={cn(filterPillsVariants({ variant, size }), className)}
        {...props}
      >
        {items.map((item) => {
          const active = value === item.id;
          const Icon = item.icon;
          const activeClass = variant === "segment" ? segmentActiveClass : pillActiveClass;
          const inactiveClass = variant === "segment" ? segmentInactiveClass : pillInactiveClass;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              data-active={active ? "true" : "false"}
              className={cn(
                "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full font-medium leading-none transition-colors",
                s.button,
                active ? activeClass : inactiveClass,
              )}
            >
              {Icon ? <Icon size={14} /> : null}
              {item.emoji ? <span className="text-2xs">{item.emoji}</span> : null}
              {item.label}
              {item.count != null ? (
                <span
                  className={cn(
                    "ml-0.5 tabular-nums",
                    s.count,
                    active ? "opacity-80" : "opacity-50",
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    );
  },
);

FilterPills.displayName = "FilterPills";

export { filterPillsVariants };
