import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
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
        xs: "text-sm",
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
        inherit: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

/**
 * Anchor link with variant and size options; supports `asChild` for composition.
 *
 * Size guidance:
 * - Use `size="inherit"` when the link sits inline inside a paragraph or any
 *   container with its own `text-*` class so the link matches the surrounding
 *   copy (no mixed font sizes on the same line).
 * - Use a concrete size (`xs` / `sm` / `default` / `lg`) only for standalone
 *   links that are not nested in body text.
 *
 * @example
 * <TextLink href="/docs">Read the docs</TextLink>
 *
 * @example
 * <p className="text-[13px] text-text-secondary">
 *   Need help? <TextLink href="/help" size="inherit">Contact support</TextLink>.
 * </p>
 */
export interface TextLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof textLinkVariants> {
  asChild?: boolean;
  showArrowUpRight?: boolean;
}

/**
 * Styled inline link using design tokens; forwards to `<a>` or `Slot` when `asChild`.
 *
 * @example
 * <TextLink href="/docs">Read the docs</TextLink>
 */
export const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(
  (
    { className, variant, size, asChild = false, showArrowUpRight = false, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "a";

    if (asChild) {
      return (
        <Comp
          ref={ref}
          data-slot="text-link"
          className={cn(textLinkVariants({ variant, size }), className)}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        ref={ref}
        data-slot="text-link"
        className={cn(textLinkVariants({ variant, size }), className)}
        {...props}
      >
        {children}
        {!asChild && showArrowUpRight ? (
          <ArrowUpRight size={12} className="shrink-0" aria-hidden />
        ) : null}
      </Comp>
    );
  },
);

TextLink.displayName = "TextLink";

export { textLinkVariants };
