import type * as React from "react";

import { cn } from "../lib/cn";
import { Popover, PopoverContent, PopoverTrigger } from "../primitives/popover";

export interface BudgetPopoverItem {
  id: string;
  label: React.ReactNode;
  value?: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
  dotClassName?: string;
}

export interface BudgetPopoverProps {
  trigger: React.ReactElement;
  title: React.ReactNode;
  description?: React.ReactNode;
  items?: BudgetPopoverItem[];
  summary?: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
  align?: React.ComponentProps<typeof PopoverContent>["align"];
  sideOffset?: React.ComponentProps<typeof PopoverContent>["sideOffset"];
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BudgetPopover({
  trigger,
  title,
  description,
  items = [],
  summary,
  footer,
  contentClassName,
  align = "end",
  sideOffset = 8,
  defaultOpen,
  open,
  onOpenChange,
}: BudgetPopoverProps) {
  return (
    <Popover defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={sideOffset}
        className={cn("w-80 space-y-4", contentClassName)}
      >
        <div>
          <div className="text-sm font-semibold text-text-primary">{title}</div>
          {description ? (
            <p className="mt-1 text-[12px] leading-5 text-text-muted">{description}</p>
          ) : null}
        </div>

        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2.5"
                >
                  {item.dotClassName ? (
                    <span className={cn("h-2 w-2 shrink-0 rounded-full", item.dotClassName)} />
                  ) : null}
                  {Icon ? (
                    <Icon size={14} className="shrink-0 text-text-secondary" aria-hidden={true} />
                  ) : null}
                  <span className="min-w-0 flex-1 text-[13px] text-text-secondary">
                    {item.label}
                  </span>
                  {item.value ? (
                    <span className="shrink-0 text-[13px] font-semibold text-text-primary">
                      {item.value}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {summary ? (
          <div className="rounded-xl border border-dashed border-border px-3 py-3 text-[12px] text-text-muted">
            {summary}
          </div>
        ) : null}
        {footer ? <div className="flex flex-col gap-2">{footer}</div> : null}
      </PopoverContent>
    </Popover>
  );
}
