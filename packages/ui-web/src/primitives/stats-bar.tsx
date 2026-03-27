import type * as React from "react";

import { cn } from "../lib/cn";

const toneStyles = {
  default: "text-text-primary",
  info: "text-info",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
} as const;

export type StatsBarTone = keyof typeof toneStyles;

export interface StatsBarItem {
  id: string;
  label: React.ReactNode;
  value: React.ReactNode;
  tone?: StatsBarTone;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  className?: string;
}

export interface StatsBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: StatsBarItem[];
}

export function StatsBar({ className, items, ...props }: StatsBarProps) {
  return (
    <div
      data-slot="stats-bar"
      className={cn(
        "flex flex-wrap items-center gap-2 border-b border-border bg-surface-1 px-5 py-2.5",
        className,
      )}
      {...props}
    >
      {items.map((item, index) => {
        const interactive = typeof item.onSelect === "function";
        const content = (
          <>
            {index > 0 ? <div aria-hidden="true" className="mr-1 h-3 w-px bg-border" /> : null}
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors",
                interactive && "hover:bg-surface-2",
                item.selected && "bg-accent/5",
                item.className,
              )}
            >
              <span
                className={cn(
                  "text-[13px] font-bold tabular-nums",
                  toneStyles[item.tone ?? "default"],
                )}
              >
                {item.value}
              </span>
              <span className="text-[10px] text-text-muted">{item.label}</span>
            </div>
          </>
        );

        if (!interactive) {
          return (
            <div key={item.id} className="flex items-center">
              {content}
            </div>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onSelect}
            disabled={item.disabled}
            aria-pressed={item.selected}
            className="flex items-center rounded-md"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
