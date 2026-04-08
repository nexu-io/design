import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../lib/cn";

const cardVariants = cva(
  "rounded-xl border border-[var(--color-border-subtle)] bg-card text-card-foreground shadow-rest transition-[box-shadow,transform] duration-200 ease-out",
  {
    variants: {
      variant: {
        default: "hover:shadow-refine hover:-translate-y-px",
        outline: "border-border hover:shadow-refine hover:-translate-y-px",
        muted:
          "bg-muted/40 text-lg text-muted-foreground hover:shadow-refine hover:-translate-y-px [&_[data-slot=card-title]]:text-lg [&_[data-slot=card-title]]:text-secondary-foreground",
        interactive: "cursor-pointer hover:shadow-refine hover:-translate-y-px",
        static: "",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  },
);

/**
 * Div attributes plus card variant and padding from CVA defaults.
 */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

/**
 * Bordered surface for grouped content; compose with header, title, content, and footer.
 *
 * @example
 * <Card variant="outline" padding="sm">
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *   </CardHeader>
 *   <CardContent>Body</CardContent>
 *   <CardFooter>Actions</CardFooter>
 * </Card>
 *
 * @example
 * <Card variant="static" padding="none" className="p-4">
 *   Minimal content
 * </Card>
 */
export function Card({ className, variant, padding, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant, padding }), className)} {...props} />;
}

/** Top section of a card; stacks title and description with spacing. */
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

/** Card heading; renders `h3` with `data-slot="card-title"`. */
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-xl font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

/** Main body region below the header. */
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4", className)} {...props} />;
}

/** Bottom actions row with horizontal flex layout. */
export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4 flex items-center gap-2", className)} {...props} />;
}
