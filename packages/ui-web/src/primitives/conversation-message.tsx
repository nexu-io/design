import { Check } from "lucide-react";
import type * as React from "react";

import { cn } from "../lib/cn";

export type ConversationMessageVariant = "user" | "assistant" | "system" | "status";

export interface ConversationMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ConversationMessageVariant;
  avatar?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  bubbleClassName?: string;
  contentClassName?: string;
}

const rootStyles: Record<ConversationMessageVariant, string> = {
  user: "justify-end",
  assistant: "justify-start",
  system: "justify-start",
  status: "justify-center",
};

const bubbleStyles: Record<ConversationMessageVariant, string> = {
  user: "border-border-subtle bg-surface-2 text-text-primary rounded-br-sm",
  assistant: "border-border bg-surface-1 text-text-primary rounded-bl-sm",
  system: "border-border-subtle bg-surface-2/70 text-text-secondary rounded-xl",
  status: "border-border-subtle bg-surface-2/60 text-text-muted rounded-full px-3 py-1.5",
};

export function ConversationMessage({
  className,
  variant = "assistant",
  avatar,
  meta,
  actions,
  bubbleClassName,
  contentClassName,
  children,
  ...props
}: ConversationMessageProps) {
  const showAvatar = variant !== "status" && avatar != null;
  const avatarBeforeBubble = variant !== "user";

  const avatarNode = showAvatar ? (
    <div
      data-slot="conversation-message-avatar"
      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full"
    >
      {avatar}
    </div>
  ) : null;

  return (
    <div
      data-slot="conversation-message"
      data-variant={variant}
      className={cn("flex w-full items-start gap-2", rootStyles[variant], className)}
      {...props}
    >
      {avatarBeforeBubble ? avatarNode : null}
      <div className={cn("max-w-[85%]", variant === "status" && "max-w-full")}>
        <div
          data-slot="conversation-message-bubble"
          className={cn(
            "rounded-2xl border px-3 py-2 text-[12px] leading-relaxed shadow-xs whitespace-pre-line",
            bubbleStyles[variant],
            bubbleClassName,
          )}
        >
          <div data-slot="conversation-message-content" className={contentClassName}>
            {children}
          </div>
        </div>
        {(meta || actions) && variant !== "status" ? (
          <div className="mt-1 flex items-center gap-2 px-1 text-[10px] text-text-muted">
            {meta ? <div className="min-w-0 flex-1">{meta}</div> : null}
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
        ) : null}
      </div>
      {!avatarBeforeBubble ? avatarNode : null}
    </div>
  );
}

export function ConversationMessageStatusIcon({
  className,
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="conversation-message-status-icon"
      className={cn(
        "inline-flex h-4 w-4 items-center justify-center rounded-full bg-success-subtle text-success",
        className,
      )}
    >
      <Check className="h-3 w-3" />
    </span>
  );
}
