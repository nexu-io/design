import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/cn";

type StepperOrientation = "horizontal" | "vertical";
type StepperStatus = "pending" | "current" | "completed";

const StepperContext = React.createContext<{ orientation: StepperOrientation }>({
  orientation: "horizontal",
});

export interface StepperProps extends React.OlHTMLAttributes<HTMLOListElement> {
  orientation?: StepperOrientation;
}

export interface StepperItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  status?: StepperStatus;
  step?: React.ReactNode;
  label?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
}

export interface StepperSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

export function Stepper({ className, orientation = "horizontal", ...props }: StepperProps) {
  return (
    <StepperContext.Provider value={{ orientation }}>
      <ol
        data-slot="stepper"
        data-orientation={orientation}
        className={cn(
          "w-full",
          orientation === "horizontal" ? "flex items-start gap-3" : "space-y-2",
          className,
        )}
        {...props}
      />
    </StepperContext.Provider>
  );
}

export function StepperItem({
  className,
  status = "pending",
  step,
  label,
  description,
  icon,
  trailing,
  children,
  ...props
}: StepperItemProps) {
  const { orientation } = React.useContext(StepperContext);

  return (
    <li
      data-slot="stepper-item"
      data-status={status}
      className={cn(orientation === "horizontal" ? "min-w-0 flex-1" : "w-full", className)}
      {...props}
    >
      <div
        className={cn(
          "flex gap-3",
          orientation === "horizontal" ? "flex-col items-center text-center" : "items-start",
        )}
      >
        <div
          data-slot="stepper-indicator"
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold font-[family-name:var(--font-mono)] transition-colors",
            status === "completed" && "border-success/20 bg-success-subtle text-success",
            status === "current" && "border-accent/30 bg-accent/10 text-accent",
            status === "pending" && "border-border bg-surface-1 text-text-muted",
          )}
        >
          {status === "completed" ? <Check className="h-4 w-4" /> : (icon ?? step)}
        </div>

        <div className={cn("min-w-0", orientation === "horizontal" ? "w-full" : "flex-1 pt-0.5")}>
          {label ? <div className="text-[12px] font-medium text-text-primary">{label}</div> : null}
          {description ? (
            <div className="mt-0.5 text-[11px] leading-relaxed text-text-muted">{description}</div>
          ) : null}
          {children ? <div className="mt-2">{children}</div> : null}
        </div>

        {trailing && orientation === "vertical" ? <div className="shrink-0">{trailing}</div> : null}
      </div>
    </li>
  );
}

export function StepperSeparator({ className, active = false, ...props }: StepperSeparatorProps) {
  const { orientation } = React.useContext(StepperContext);

  return (
    <div
      data-slot="stepper-separator"
      data-active={active ? "true" : "false"}
      aria-hidden="true"
      className={cn(
        "shrink-0 rounded-full",
        active ? "bg-accent/30" : "bg-border",
        orientation === "horizontal" ? "mt-4 h-px flex-1" : "ml-[15px] h-6 w-px",
        className,
      )}
      {...props}
    />
  );
}
