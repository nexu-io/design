import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "../lib/cn";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      className={cn(
        "group relative z-50 rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-md animate-in fade-in-0 zoom-in-95",
        className,
      )}
      {...props}
    >
      {children}
      <span className="absolute size-2.5 rotate-45 rounded-[2px] bg-foreground group-data-[side=top]:left-1/2 group-data-[side=top]:-bottom-1 group-data-[side=top]:-translate-x-1/2 group-data-[side=bottom]:left-1/2 group-data-[side=bottom]:-top-1 group-data-[side=bottom]:-translate-x-1/2 group-data-[side=left]:top-1/2 group-data-[side=left]:-right-1 group-data-[side=left]:-translate-y-1/2 group-data-[side=right]:top-1/2 group-data-[side=right]:-left-1 group-data-[side=right]:-translate-y-1/2" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
