import * as SwitchPrimitive from "@radix-ui/react-switch";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full p-[2px] outline-none transition-all duration-200 ease-[var(--ease-standard)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-input data-[state=checked]:bg-[var(--color-link)]",
  {
    variants: {
      size: {
        default: "h-[28px] w-[64px]",
        sm: "h-[20px] w-[44px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-sm ring-0 transition-all duration-200 ease-[var(--ease-standard)] data-[state=unchecked]:translate-x-0 data-[state=checked]:border data-[state=checked]:border-[var(--color-link)]",
  {
    variants: {
      size: {
        default: "h-[24px] w-[39px] rounded-[12px] data-[state=checked]:translate-x-[21px]",
        sm: "h-[16px] w-[27px] rounded-[8px] data-[state=checked]:translate-x-[13px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, size, ...props }, ref) => (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      className={cn("relative", switchVariants({ size }), className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1/2 w-px -translate-y-1/2 rounded-full bg-white/80 opacity-0 transition-opacity duration-200 [[data-state=checked]_&]:opacity-100",
          size === "sm" ? "left-[9px] h-[9px]" : "left-[13px] h-[13px]",
        )}
      />
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(switchThumbVariants({ size }))}
      />
    </SwitchPrimitive.Root>
  ),
);

Switch.displayName = SwitchPrimitive.Root.displayName;
