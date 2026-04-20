import * as React from "react";

import { cn } from "../lib/cn";

export interface EventNoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Decorative leading icon (e.g. `<LogIn className="size-2.5" />`). */
  icon?: React.ReactNode;
  /** Hides the flanking hairlines; useful when stacking multiple notices. */
  plain?: boolean;
}

/**
 * Low-emphasis, centered notice for meta events in a feed — joins, pins, folded events.
 *
 * @example
 * <EventNotice icon={<LogIn className="size-2.5" />}>Bob Li joined #backend-platform</EventNotice>
 */
export const EventNotice = React.forwardRef<HTMLDivElement, EventNoticeProps>(
  ({ className, icon, plain = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="event-notice"
        className={cn("flex items-center gap-3 px-4 py-1.5 text-[11px] text-text-muted", className)}
        {...props}
      >
        {!plain ? <span aria-hidden className="h-px flex-1 bg-border-subtle" /> : null}
        <span className="inline-flex items-center gap-1.5">
          {icon}
          {children}
        </span>
        {!plain ? <span aria-hidden className="h-px flex-1 bg-border-subtle" /> : null}
      </div>
    );
  },
);

EventNotice.displayName = "EventNotice";
