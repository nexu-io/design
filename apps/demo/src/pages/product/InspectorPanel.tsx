import { X } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface InspectorPanelProps {
  width?: number;
  title?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  leading?: ReactNode;
  badges?: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  onClose?: () => void;
  closeButtonProps?: {
    srLabel?: string;
    className?: string;
  } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick">;
  children?: ReactNode;
}

export default function InspectorPanel({
  width = 400,
  title,
  description,
  meta,
  leading,
  badges,
  footer,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  onClose,
  closeButtonProps,
  children,
}: InspectorPanelProps) {
  return (
    <aside
      className={`flex h-full max-w-full flex-col border-l border-border bg-surface-0 ${className ?? ""}`.trim()}
      style={{ width }}
    >
      <header
        className={`flex items-start gap-3 border-b border-border px-4 py-3 ${headerClassName ?? ""}`.trim()}
      >
        {leading}
        <div className="min-w-0 flex-1">
          {title ? (
            <div className="text-[13px] font-semibold text-text-primary">{title}</div>
          ) : null}
          {description ? (
            <div className="mt-0.5 text-[11px] text-text-secondary">{description}</div>
          ) : null}
          {meta ? (
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-text-muted">
              {meta}
            </div>
          ) : null}
        </div>
        {badges ? <div className="flex shrink-0 items-center gap-1">{badges}</div> : null}
        {onClose ? (
          <button
            type="button"
            aria-label={closeButtonProps?.srLabel ?? "Close panel"}
            className={`rounded p-1 transition-colors hover:bg-surface-3 ${closeButtonProps?.className ?? ""}`.trim()}
            onClick={onClose}
            {...closeButtonProps}
          >
            <X size={14} />
          </button>
        ) : null}
      </header>

      <div className={`min-h-0 flex-1 ${contentClassName ?? ""}`.trim()}>{children}</div>

      {footer ? (
        <footer className={`border-t border-border ${footerClassName ?? "px-4 py-3"}`.trim()}>
          {footer}
        </footer>
      ) : null}
    </aside>
  );
}
