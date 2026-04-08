import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/cn";

const alertVariants = cva(
  "relative flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-lg [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-border bg-surface-1 text-foreground [&>svg]:text-text-secondary",
        info: "border-info/20 bg-info-subtle/30 text-foreground [&>svg]:text-info",
        success: "border-success/20 bg-success-subtle/30 text-foreground [&>svg]:text-success",
        warning: "border-warning/20 bg-warning-subtle/30 text-foreground [&>svg]:text-warning",
        destructive:
          "border-destructive/20 bg-destructive/5 text-foreground [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Props for the alert container (`role="alert"`), including `variant` and standard div attributes.
 */
export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

/**
 * Inline alert with semantic variants; place an icon and {@link AlertTitle} / {@link AlertDescription} inside.
 *
 * @example
 * <Alert variant="warning">
 *   <TriangleAlert className="size-4" />
 *   <AlertTitle>Warning</AlertTitle>
 *   <AlertDescription>Two integrations need re-authentication.</AlertDescription>
 * </Alert>
 *
 * @example
 * <Alert variant="destructive">
 *   <CircleAlert className="size-4" />
 *   <AlertTitle>Action required</AlertTitle>
 *   <AlertDescription>Publishing is paused until you resolve the error.</AlertDescription>
 * </Alert>
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      />
    );
  },
);

Alert.displayName = "Alert";

/**
 * Primary heading line inside an {@link Alert} (renders `h5`).
 */
export const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h5
      ref={ref}
      className={cn("mb-1 font-semibold leading-none tracking-tight text-text-primary", className)}
      {...props}
    />
  );
});

AlertTitle.displayName = "AlertTitle";

/**
 * Supporting body copy inside an {@link Alert}.
 */
export const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-sm text-text-secondary [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
});

AlertDescription.displayName = "AlertDescription";

export { alertVariants };
