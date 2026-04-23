import * as React from "react";

import { cn } from "../lib/cn";

/**
 * Props for `InteractiveRow`; adds `selected` and `tone` on top of native button attributes.
 */
export interface InteractiveRowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  tone?: "default" | "subtle";
}

/**
 * Full-width interactive row for lists and settings; compose with leading, content, and trailing slots.
 *
 * @example
 * <InteractiveRow onClick={handleClick}>
 *   <InteractiveRowLeading><Icon size={16} /></InteractiveRowLeading>
 *   <InteractiveRowContent>Label text</InteractiveRowContent>
 *   <InteractiveRowTrailing><ChevronRight size={14} /></InteractiveRowTrailing>
 * </InteractiveRow>
 */
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
            : // `subtle` hover previously used `bg-surface-2/60`, which
              // assumed the row sat on a surface-0 / surface-1 parent.
              // After PR #57 lifted Dialog / Popover / DropdownMenu to
              // `surface-2` in dark mode, 60% of surface-2 composited on
              // top of surface-2 collapses to no colour change, so the row
              // appears unresponsive to hover in any of those overlays.
              // Switch to the translucent `foreground` tint used by the
              // outline / secondary buttons — it borrows value contrast
              // from the text colour and therefore reads on any surface.
              "border-transparent bg-transparent hover:bg-foreground/[0.04] dark:hover:bg-foreground/[0.06]",
          selected && "border-accent/40 bg-accent/5 ring-2 ring-accent/20",
          className,
        )}
        {...props}
      />
    );
  },
);

InteractiveRow.displayName = "InteractiveRow";

/** Icon or avatar column; does not shrink. */
export function InteractiveRowLeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="interactive-row-leading" className={cn("shrink-0", className)} {...props} />
  );
}

/** Primary text and details; grows and truncates in a flex row. */
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

/** Meta, chevron, or actions; does not shrink. */
export function InteractiveRowTrailing({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="interactive-row-trailing" className={cn("shrink-0", className)} {...props} />
  );
}
