import * as TogglePrimitive from "@radix-ui/react-toggle";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-[12px] font-medium outline-none transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-md px-3 py-1.5 text-text-secondary hover:bg-surface-1 hover:text-text-primary data-[state=on]:bg-surface-0 data-[state=on]:text-text-primary data-[state=on]:shadow-sm",
        outline:
          "rounded-full border border-border bg-surface-1 px-3 py-1.5 text-text-secondary hover:border-border-hover hover:text-text-primary data-[state=on]:border-accent data-[state=on]:bg-accent data-[state=on]:text-white",
        pill: "rounded-full px-4 py-1.5 text-[13px] text-text-secondary hover:bg-surface-2 hover:text-text-primary data-[state=on]:bg-white data-[state=on]:text-text-primary data-[state=on]:shadow-[var(--shadow-rest)]",
        underline:
          "rounded-none border-b-2 border-transparent px-3 py-2.5 text-[12px] text-text-muted hover:text-text-secondary data-[state=on]:border-accent data-[state=on]:text-text-primary",
      },
      size: {
        sm: "h-7 text-[11px]",
        default: "h-8",
        lg: "h-9 text-[13px]",
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
  ({ className, variant, size, ...props }, ref) => (
    <TogglePrimitive.Root
      ref={ref}
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  ),
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

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({
          variant: variant ?? context.variant,
          size: size ?? context.size,
        }),
        className,
      )}
      {...props}
    />
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { toggleVariants };
