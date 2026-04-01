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
          "bg-muted/40 text-sm text-muted-foreground hover:shadow-refine hover:-translate-y-px [&_[data-slot=card-title]]:text-sm [&_[data-slot=card-title]]:text-secondary-foreground",
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

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, padding, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant, padding }), className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-base font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4 flex items-center gap-2", className)} {...props} />;
}
