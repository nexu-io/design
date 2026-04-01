import type * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--color-surface-0)",
          "--normal-text": "var(--color-text-primary)",
          "--normal-border": "var(--color-border)",
          "--success-bg": "var(--color-surface-0)",
          "--success-text": "var(--color-text-primary)",
          "--success-border": "var(--color-border)",
          "--error-bg": "var(--color-surface-0)",
          "--error-text": "var(--color-text-primary)",
          "--error-border": "var(--color-border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast items-start rounded-xl border shadow-md text-base",
          icon: "mt-0.5",
          title: "font-medium",
          description: "text-sm text-[var(--color-text-muted)]",
          actionButton:
            "bg-[var(--color-surface-2)] text-[var(--color-text-primary)] text-sm font-medium rounded-lg hover:bg-[var(--color-surface-3)]",
          cancelButton: "text-[var(--color-text-muted)] text-sm font-medium rounded-lg",
          success: "[&_[data-icon]]:text-[var(--color-success)]",
          error: "[&_[data-icon]]:text-[var(--color-danger)]",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
