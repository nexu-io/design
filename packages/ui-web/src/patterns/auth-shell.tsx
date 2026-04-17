import type * as React from "react";

import { cn } from "../lib/cn";

export interface AuthShellProps extends React.HTMLAttributes<HTMLDivElement> {
  rail?: React.ReactNode;
  railClassName?: string;
  contentClassName?: string;
  contentContainerClassName?: string;
  contentInnerClassName?: string;
  contentBackdrop?: React.ReactNode;
}

function DefaultAuthShellBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
  );
}

export function AuthShell({
  rail,
  children,
  className,
  railClassName,
  contentClassName,
  contentContainerClassName,
  contentInnerClassName,
  contentBackdrop,
  ...props
}: AuthShellProps) {
  return (
    <div className={cn("flex min-h-screen bg-background text-foreground", className)} {...props}>
      {rail ? (
        <div
          className={cn(
            "flex min-h-screen w-[46%] min-w-[320px] max-w-[560px] shrink-0",
            railClassName,
          )}
        >
          {rail}
        </div>
      ) : null}

      <div
        className={cn(
          "relative flex flex-1 flex-col overflow-hidden bg-surface-0",
          rail && "rounded-l-[12px]",
          contentClassName,
        )}
      >
        {contentBackdrop ?? <DefaultAuthShellBackdrop />}
        <div
          className={cn(
            'relative z-10 flex flex-1 items-start justify-center px-5 pt-0 pb-8',
            contentContainerClassName,
          )}
        >
          <div className={cn("w-full", contentInnerClassName)}>{children}</div>
        </div>
      </div>
    </div>
  );
}
