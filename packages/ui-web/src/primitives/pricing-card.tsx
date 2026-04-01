import { type VariantProps, cva } from "class-variance-authority";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/cn";
import { MonoDigits } from "../lib/mono-digits";
import { Badge, type BadgeProps } from "./badge";
import { Card, type CardProps } from "./card";

const pricingCardVariants = cva("relative flex h-full flex-col rounded-xl border transition-all", {
  variants: {
    featured: {
      false: "border-border-subtle bg-surface-1",
      true: "border-accent/40 bg-accent/5 ring-1 ring-accent/20 shadow-sm shadow-accent/10",
    },
    size: {
      default: "p-6",
      compact: "p-4",
    },
  },
  defaultVariants: {
    featured: false,
    size: "default",
  },
});

export interface PricingCardProps
  extends Omit<CardProps, "children" | "padding">,
    VariantProps<typeof pricingCardVariants> {
  name: React.ReactNode;
  price: React.ReactNode;
  period?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ElementType;
  iconClassName?: string;
  badge?: React.ReactNode;
  badgeVariant?: BadgeProps["variant"];
  features: React.ReactNode[];
  footer?: React.ReactNode;
}

export function PricingCard({
  className,
  name,
  price,
  period,
  description,
  icon: Icon,
  iconClassName,
  badge,
  badgeVariant = "accent",
  features,
  footer,
  featured = false,
  size = "default",
  variant,
  ...props
}: PricingCardProps) {
  return (
    <Card
      className={cn(pricingCardVariants({ featured, size }), className)}
      padding="none"
      variant={variant}
      {...props}
    >
      {badge ? (
        <Badge
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-surface-0"
          variant={badgeVariant}
        >
          {badge}
        </Badge>
      ) : null}

      <div className={cn("flex items-center gap-2", size === "compact" ? "mb-2" : "mb-3")}>
        {Icon ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2">
            <Icon aria-hidden="true" className={cn("h-4 w-4 text-text-muted", iconClassName)} />
          </div>
        ) : null}
        <div className="min-w-0">
          <div
            className={cn(
              "font-semibold text-text-primary",
              size === "compact" ? "text-base" : "text-lg",
            )}
          >
            {name}
          </div>
          {description ? (
            <div className={cn("text-text-muted", size === "compact" ? "text-xs" : "text-sm")}>
              {description}
            </div>
          ) : null}
        </div>
      </div>

      <div className={cn("flex items-baseline gap-1", size === "compact" ? "mb-3" : "mb-5")}>
        <span
          className={cn(
            "font-bold tracking-tight text-text-primary",
            size === "compact" ? "text-2xl" : "text-4xl",
          )}
        >
          <MonoDigits>{price}</MonoDigits>
        </span>
        {period ? <span className="text-sm text-text-muted">{period}</span> : null}
      </div>

      <ul className={cn("flex-1 space-y-2.5", size === "compact" ? "mb-4" : "mb-6")}>
        {React.Children.toArray(features).map((feature, index) => (
          <li
            key={
              React.isValidElement(feature) && feature.key != null
                ? String(feature.key)
                : typeof feature === "string"
                  ? feature
                  : `feature-${index + 1}`
            }
            className={cn(
              "flex items-start gap-2 text-text-secondary",
              size === "compact" ? "text-xs" : "text-base",
            )}
          >
            <Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {footer ? <div className="mt-auto">{footer}</div> : null}
    </Card>
  );
}
