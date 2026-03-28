import type * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--color-surface-1)",
          "--normal-text": "var(--color-text-primary)",
          "--normal-border": "var(--color-border)",
          "--success-bg": "var(--color-success-subtle)",
          "--success-text": "var(--color-success)",
          "--success-border": "var(--color-success)",
          "--error-bg": "var(--color-danger-subtle)",
          "--error-text": "var(--color-danger)",
          "--error-border": "var(--color-danger)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast rounded-xl border shadow-lg text-[13px]",
          title: "font-medium",
          description: "text-[12px] opacity-70",
          actionButton:
            "bg-[var(--color-accent)] text-[var(--color-accent-fg)] text-[12px] font-medium rounded-lg",
          cancelButton: "text-[var(--color-text-muted)] text-[12px] font-medium rounded-lg",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
