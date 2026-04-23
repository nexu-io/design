import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

import { cn } from "../lib/cn";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      data-slot="popover-content"
      align={align}
      sideOffset={sideOffset}
      className={cn(
        // `dark:bg-surface-2` — `bg-popover` resolves to the card tone
        // (`surface-1`) in dark mode, which blends into panels that are
        // themselves `surface-1`. Lifting to `surface-2` gives the
        // popover the same clear elevation as Dialog / DropdownMenu in
        // dark; light mode keeps the original `bg-popover` white.
        //
        // `border-border-subtle dark:border-border-strong` + `shadow-lg`
        // — PR #57 tried `dark:border-border` for overlay edges, but the
        // `--border` token in dark resolves to ≈ `hsl(240 6.5% 15.1%)`,
        // which is the same tone as `surface-2` itself. On same-tone
        // overlay-on-overlay stacks (e.g. a Popover inside a Dialog —
        // see `CreateChannelDialog`'s Select-members picker) that edge
        // self-paints invisibly. `--color-border-strong` is
        // translucent-white 12% in dark mode, so it lifts clear of any
        // parent surface without needing to know what's underneath.
        // Light mode keeps the subtle solid token — no same-tone
        // blending risk on white.
        "z-50 w-72 rounded-xl border border-border-subtle dark:border-border-strong bg-popover dark:bg-surface-2 p-4 text-popover-foreground shadow-lg outline-none animate-in fade-in-0 zoom-in-95",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
