import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-base font-medium transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-sm hover:bg-[var(--color-accent-hover)] hover:shadow-md hover:shadow-accent/20",
        brand: "bg-primary text-primary-foreground hover:bg-primary/90",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input bg-background text-foreground shadow-xs hover:border-foreground/15 hover:bg-foreground/[0.03] hover:text-foreground hover:shadow-sm",
        ghost:
          "text-[var(--color-text-muted)] hover:bg-surface-2 hover:text-[var(--color-text-secondary)]",
        soft: "bg-accent/10 text-accent hover:bg-accent/20",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "h-auto p-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 rounded-md px-3 text-sm font-semibold",
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-sm font-semibold",
        md: "h-10 rounded-xl px-4 py-2 font-semibold",
        lg: "h-12 rounded-xl px-6 text-lg font-semibold shadow-sm hover:shadow-lg hover:shadow-accent/20",
        inline: "h-auto px-0",
        icon: "size-10 p-0",
        "icon-sm": "size-6 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

/**
 * Native button attributes plus variants, optional icons, loading, and `asChild`.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

/**
 * Action control with CVA-driven variants, optional leading/trailing icons, and loading spinner.
 *
 * @example
 * <Button>Save</Button>
 *
 * @example
 * <Button variant="outline" size="sm">
 *   <ArrowUp size={14} />
 *   Upgrade
 * </Button>
 *
 * @example
 * <Button loading>Saving...</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leadingIcon,
      trailingIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={!asChild ? disabled || loading : undefined}
        data-loading={loading ? "" : undefined}
        {...props}
      >
        {loading ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          leadingIcon
        )}
        {children}
        {!loading ? trailingIcon : null}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { buttonVariants };
