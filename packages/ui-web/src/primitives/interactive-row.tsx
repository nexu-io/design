import * as React from "react";

import { cn } from "../lib/cn";

export interface InteractiveRowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  tone?: "default" | "subtle";
}

export const InteractiveRow = React.forwardRef<HTMLButtonElement, InteractiveRowProps>(
  ({ className, selected, tone = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        data-slot="interactive-row"
        data-state={selected ? "selected" : undefined}
        className={cn(
          "flex w-full items-start gap-3 rounded-xl border text-left transition-colors",
          tone === "default"
            ? "border-border bg-surface-1 hover:border-border-hover hover:bg-surface-2/60"
            : "border-transparent bg-transparent hover:bg-surface-2/60",
          selected && "border-accent/40 bg-accent/5 ring-2 ring-accent/20",
          className,
        )}
        {...props}
      />
    );
  },
);

InteractiveRow.displayName = "InteractiveRow";

export function InteractiveRowLeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="interactive-row-leading" className={cn("shrink-0", className)} {...props} />
  );
}

export function InteractiveRowContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="interactive-row-content"
      className={cn("min-w-0 flex-1", className)}
      {...props}
    />
  );
}

export function InteractiveRowTrailing({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="interactive-row-trailing" className={cn("shrink-0", className)} {...props} />
  );
}
