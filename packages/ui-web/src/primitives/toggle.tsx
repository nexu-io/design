import * as TogglePrimitive from "@radix-ui/react-toggle";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium outline-none transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-md px-3 py-1.5 text-text-secondary hover:bg-surface-1 hover:text-text-primary data-[state=on]:bg-surface-0 data-[state=on]:text-text-primary data-[state=on]:shadow-sm",
        outline:
          "rounded-full border border-border bg-surface-1 px-3 py-1.5 text-text-secondary hover:border-border-hover hover:text-text-primary data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background",
        /** Low-height segmented control — `rounded-[4px]` chip inside `rounded-[6px]` track; selected `surface-0` + shadow, unselected transparent. */
        compact:
          "h-6 min-h-6 rounded-[4px] border border-transparent bg-transparent px-2.5 py-0 text-[11px] font-medium leading-none text-text-secondary hover:bg-surface-1/70 hover:text-text-primary data-[state=on]:!border-border/40 data-[state=on]:!bg-white data-[state=on]:!text-text-primary data-[state=on]:!shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        pill: "rounded-full px-4 py-1.5 text-base text-text-secondary hover:bg-surface-2 hover:text-text-primary data-[state=on]:bg-white data-[state=on]:text-text-primary data-[state=on]:shadow-[var(--shadow-rest)]",
        underline:
          "rounded-none border-b-2 border-transparent px-3 py-2.5 text-sm text-text-muted hover:text-text-secondary data-[state=on]:border-accent data-[state=on]:text-text-primary",
      },
      size: {
        /** Skip fixed height (used with `variant="compact"`, which sets its own). */
        none: "",
        sm: "h-7 text-xs",
        default: "h-8",
        lg: "h-9 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const toggleGroupVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      default: "gap-1 rounded-lg border border-border bg-surface-2/50 p-1",
      outline: "flex-wrap gap-2",
      compact: "gap-0.5 rounded-[6px] border border-border bg-surface-2/50 p-0.5",
      pill: "gap-1 rounded-full bg-surface-2 p-1",
      underline: "w-full gap-0 border-b border-border bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type ToggleVariantContextValue = VariantProps<typeof toggleVariants>;

const ToggleVariantContext = React.createContext<ToggleVariantContextValue>({
  variant: "default",
  size: "default",
});

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

export const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
  ({ className, variant, size, ...props }, ref) => {
    const effectiveSize = variant === "compact" ? "none" : (size ?? "default");
    return (
      <TogglePrimitive.Root
        ref={ref}
        data-slot="toggle"
        className={cn(toggleVariants({ variant, size: effectiveSize }), className)}
        {...props}
      />
    );
  },
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export type ToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> &
  VariantProps<typeof toggleGroupVariants>;

export const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, variant, size, ...props }, ref) => (
  <ToggleVariantContext.Provider value={{ variant, size }}>
    <ToggleGroupPrimitive.Root
      ref={ref}
      data-slot="toggle-group"
      className={cn(toggleGroupVariants({ variant }), className)}
      {...props}
    />
  </ToggleVariantContext.Provider>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

export interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof toggleVariants> {}

export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleVariantContext);
  const resolvedVariant = variant ?? context.variant;
  const resolvedSize = size ?? context.size;
  const effectiveSize = resolvedVariant === "compact" ? "none" : (resolvedSize ?? "default");

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({
          variant: resolvedVariant,
          size: effectiveSize,
        }),
        className,
      )}
      {...props}
    />
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { toggleVariants };
