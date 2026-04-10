import * as TabsPrimitive from "@radix-ui/react-tabs";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      default: "gap-1 rounded-lg bg-surface-2 p-1 text-muted-foreground",
      /** Dense row (toolbars, reward rows). Matches `ToggleGroup` `variant="compact"`. */
      compact:
        "gap-0.5 rounded-[6px] border border-border bg-surface-2/50 p-0.5 text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-md px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-foreground",
        compact:
          "h-6 min-h-6 rounded-[4px] border border-transparent bg-transparent px-2.5 py-0 text-sm leading-none text-text-secondary hover:bg-surface-1/70 hover:text-text-primary data-[state=active]:border-transparent data-[state=active]:bg-surface-0 data-[state=active]:text-text-primary data-[state=active]:shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    data-slot="tabs-list"
    className={cn(tabsListVariants({ variant }), className)}
    {...props}
  />
));

TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    data-slot="tabs-trigger"
    className={cn(tabsTriggerVariants({ variant }), className)}
    {...props}
  />
));

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-slot="tabs-content"
    className={cn("mt-3 outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    {...props}
  />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
