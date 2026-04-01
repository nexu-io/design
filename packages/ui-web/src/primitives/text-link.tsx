import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

const textLinkVariants = cva(
  "inline-flex items-center gap-1.5 underline-offset-4 transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] [&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-3",
  {
    variants: {
      variant: {
        default: "text-[var(--color-link)] hover:underline",
        muted:
          "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:underline",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

export interface TextLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof textLinkVariants> {
  asChild?: boolean;
}

export const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    return (
      <Comp
        ref={ref}
        data-slot="text-link"
        className={cn(textLinkVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

TextLink.displayName = "TextLink";

export { textLinkVariants };
