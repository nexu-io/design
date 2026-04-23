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
          "bg-[var(--color-accent)] text-[var(--color-accent-fg,white)] shadow-sm hover:bg-[var(--color-accent-hover)]",
        brand: "bg-primary text-primary-foreground hover:bg-primary/90",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        // Secondary sits one step louder than outline but follows the
        // same "translucent foreground tint" pattern so it adapts to
        // tinted / glass / plain parents instead of stamping a fixed
        // surface-2 block. Higher opacity than outline gives it a
        // slightly filled personality while still borrowing the parent
        // colour.
        secondary:
          "bg-foreground/[0.06] dark:bg-foreground/[0.1] text-secondary-foreground hover:bg-foreground/[0.09] dark:hover:bg-foreground/[0.14]",
        // Outline is a low-emphasis control. The rest fill is a
        // translucent tint of `foreground` rather than a hard surface
        // token so the button reads correctly on ANY parent colour —
        // plain cards, tinted warning/success/info cards, glass
        // chrome — instead of stamping a fixed `bg-surface-*` patch
        // onto a coloured background. `foreground` auto-flips per
        // theme (dark text in light mode / light text in dark mode),
        // so a single opacity value gives a subtle inset in light and
        // a subtle lift in dark. Hover doubles the opacity for
        // feedback. NOTE: no `shadow-*` — the border + translucent
        // tint already carry the shape; a drop shadow reads as a
        // black halo against tinted / dark parent cards.
        outline:
          "border border-input bg-foreground/[0.03] dark:bg-foreground/[0.06] text-foreground hover:border-foreground/15 hover:bg-foreground/[0.06] dark:hover:bg-foreground/[0.1] hover:text-foreground",
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
        lg: "h-12 rounded-xl px-6 text-lg font-semibold shadow-sm",
        inline: "h-auto px-0",
        /* Icon sizes pin `rounded-md` (8px) — the base `rounded-lg`
           (12px per tokens) would land at exactly half the `icon-sm`
           width (24px) and render a perfect circle on hover. Controls
           live at `--radius-md` per the design spec; only cards / panels
           use the larger `rounded-lg` radius. */
        icon: "size-10 rounded-md p-0",
        "icon-sm": "size-6 rounded-md p-0",
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
    const content = asChild ? (
      children
    ) : (
      <>
        {loading ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          leadingIcon
        )}
        {children}
        {!loading ? trailingIcon : null}
      </>
    );

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={!asChild ? disabled || loading : undefined}
        data-loading={loading ? "" : undefined}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { buttonVariants };
