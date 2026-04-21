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
          orientation === "horizontal" ? "flex items-start justify-center gap-3" : "space-y-2",
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
  onClick,
  onKeyDown,
  ...props
}: StepperItemProps) {
  const { orientation } = React.useContext(StepperContext);
  const isInteractive = typeof onClick === "function";

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>): void => {
    onKeyDown?.(event);
    if (!isInteractive || event.defaultPrevented) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      (onClick as React.MouseEventHandler<HTMLLIElement>)?.(
        event as unknown as React.MouseEvent<HTMLLIElement>,
      );
    }
  };

  return (
    <li
      data-slot="stepper-item"
      data-status={status}
      data-interactive={isInteractive ? "true" : undefined}
      aria-current={status === "current" ? "step" : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        orientation === "horizontal" ? "shrink-0" : "w-full",
        isInteractive &&
          "cursor-pointer rounded-md outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-text-heading)] [&:hover_[data-slot=stepper-indicator]]:brightness-95",
        className,
      )}
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
            "flex size-9 shrink-0 items-center justify-center rounded-full transition-[box-shadow,background-color,color] duration-200",
            status === "completed" && "bg-[var(--color-text-heading)] text-white",
            status === "current" &&
              "bg-[var(--color-text-heading)] text-white shadow-[0_0_0_5px_rgba(0,0,0,0.04),0_8px_20px_-6px_rgba(0,0,0,0.22)]",
            status === "pending" &&
              "bg-white border border-[var(--color-border)] text-[var(--color-text-muted)]",
          )}
        >
          {icon ?? (
            <span className="text-[13px] font-semibold font-[family-name:var(--font-mono)]">
              {step}
            </span>
          )}
        </div>

        <div
          className={cn("min-w-0", orientation === "horizontal" ? "w-full px-1" : "flex-1 pt-1")}
        >
          {label ? (
            <div
              className={cn(
                "text-xs font-normal leading-tight",
                status === "current"
                  ? "text-text-heading"
                  : status === "completed"
                    ? "text-text-secondary"
                    : "text-text-muted",
              )}
            >
              {label}
            </div>
          ) : null}
          {description ? (
            <div className="mt-0.5 text-xs leading-relaxed text-text-muted">{description}</div>
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

  if (orientation === "vertical") {
    return (
      <div
        data-slot="stepper-separator"
        data-active={active ? "true" : "false"}
        aria-hidden="true"
        className={cn(
          "ml-[17px] h-6 w-px shrink-0 rounded-full bg-[var(--color-text-heading)]/15",
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <div
      data-slot="stepper-separator"
      data-active={active ? "true" : "false"}
      aria-hidden="true"
      className={cn(
        "mt-[18px] h-px w-12 shrink-0 rounded-full bg-[var(--color-text-heading)]/15",
        className,
      )}
      {...props}
    />
  );
}
