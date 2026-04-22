import * as React from "react";
import { Bot } from "lucide-react";

import { cn } from "../lib/cn";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

export interface ChatSender {
  id: string;
  name: string;
  avatar?: string;
  /** 1–2 letter fallback shown when `avatar` is missing. */
  fallback: string;
  /** Renders the "Agent" pill next to the name. */
  isAgent?: boolean;
  /** Accent color used *only* to tint the agent avatar fallback. */
  accent?: string;
  /** Subtle secondary line after the time (e.g. "Product lead"). */
  role?: string;
}

export interface ChatMessageReaction {
  emoji: string;
  count: number;
  /** Highlights the pill when the current user has reacted. */
  reacted?: boolean;
}

export interface ChatMessageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  sender: ChatSender;
  /** Formatted timestamp (e.g. "09:02"). */
  time: string;
  /** Collapses avatar/name when the previous row is from the same sender. */
  compact?: boolean;
  /** Renders an `@name` token at the start of the body (gray mono pill). */
  mention?: string;
  /** Main message body. Rich text friendly: inline `<a>`, `<strong>`, `<em>` are styled. */
  children?: React.ReactNode;
  /** Attachment cards / content blocks rendered under the text. */
  blocks?: React.ReactNode;
  reactions?: ChatMessageReaction[];
  /** Subtle row-level background — for "mentions me" / unread / highlighted states. */
  highlighted?: boolean;
  /** Right-aligned hover toolbar; rendered only when hovering the row. */
  rowActions?: React.ReactNode;
  /** Handler invoked when the `+` reaction chip is clicked (only visible with reactions). */
  onAddReaction?: () => void;
  /** Handler invoked when a reaction chip is clicked. Receives the clicked emoji. */
  onReactionClick?: (emoji: string) => void;
}

/**
 * Inline `@name` token — compact gray mono pill. Safe to use anywhere text flows.
 *
 * @example
 * <Mention name="design-review" />
 */
export function Mention({ name }: { name: string }): React.ReactElement {
  return (
    <span className="rounded-sm bg-surface-2 px-1 py-[1px] font-mono text-[12px] text-text-primary">
      @{name}
    </span>
  );
}

/**
 * Slack-style, bubble-less feed row for chat. Avatar on the left, name + time header,
 * free-flow body, optional attachment stack and reactions.
 *
 * @example
 * <ChatMessage sender={alice} time="09:02">
 *   Shipped the new <strong>FormField</strong> API.
 * </ChatMessage>
 *
 * @example
 * <ChatMessage sender={reviewer} time="09:14" mention="Coder" highlighted>
 *   please run the regression suite.
 * </ChatMessage>
 */
export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  (
    {
      sender,
      time,
      compact = false,
      mention,
      children,
      blocks,
      reactions,
      highlighted = false,
      rowActions,
      onAddReaction,
      onReactionClick,
      className,
      ...rest
    },
    ref,
  ) => {
    const accent = sender.accent ?? "var(--color-brand-primary)";

    return (
      <div
        ref={ref}
        data-slot="chat-message"
        data-highlighted={highlighted ? "" : undefined}
        data-compact={compact ? "" : undefined}
        className={cn(
          "group relative flex gap-3 px-4 transition-colors",
          highlighted && "bg-surface-2/60",
          compact ? "py-[3px]" : "pt-4 pb-1",
          className,
        )}
        {...rest}
      >
        <div className="w-8 shrink-0">
          {compact ? null : (
            <Avatar className="size-8 rounded-full">
              {sender.avatar ? <AvatarImage src={sender.avatar} alt={sender.name} /> : null}
              <AvatarFallback
                className={cn(
                  "rounded-full text-[10px] font-semibold",
                  !sender.isAgent && "bg-surface-2 text-text-primary",
                )}
                style={
                  sender.isAgent
                    ? {
                        background: `color-mix(in srgb, ${accent} 14%, transparent)`,
                        color: accent,
                      }
                    : undefined
                }
              >
                {sender.fallback}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {!compact && (
            <div className="mb-0.5 flex items-baseline gap-1.5">
              <span className="text-[13px] font-semibold text-text-heading">{sender.name}</span>
              {sender.isAgent && (
                <span className="inline-flex items-center gap-1 rounded-[4px] bg-success-subtle px-1.5 py-[1px] text-[10px] font-medium leading-tight text-success">
                  <Bot className="size-2.5" aria-hidden />
                  Agent
                </span>
              )}
              <span
                className="font-mono text-[11px] tabular-nums text-text-muted"
                aria-label={`Sent at ${time}`}
              >
                {time}
              </span>
              {sender.role ? (
                <span className="text-[11px] text-text-tertiary">· {sender.role}</span>
              ) : null}
            </div>
          )}

          {children ? (
            <div
              className={cn(
                "text-[13px] leading-[1.6] text-text-primary whitespace-pre-wrap break-words",
                "[&_strong]:font-semibold [&_strong]:text-text-heading",
                "[&_em]:italic",
                "[&_a]:font-medium [&_a]:text-[var(--color-link)] [&_a]:underline-offset-2 [&_a:hover]:underline",
              )}
            >
              {mention ? (
                <>
                  <Mention name={mention} />{" "}
                </>
              ) : null}
              {children}
            </div>
          ) : null}

          {blocks ? <div className="mt-2 flex max-w-[580px] flex-col gap-2">{blocks}</div> : null}

          {reactions && reactions.length > 0 ? (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {reactions.map((r) => (
                <button
                  type="button"
                  key={r.emoji}
                  data-reacted={r.reacted ? "" : undefined}
                  onClick={onReactionClick ? () => onReactionClick(r.emoji) : undefined}
                  className={cn(
                    // Monochrome pill. Reacted state carries the same surface-2
                    // wash + border as the hover preview, so hovering an
                    // un-reacted pill visually foreshadows what clicking will
                    // do. Brand teal was over-weighting emoji reactions in the
                    // feed — they'd read louder than the message itself.
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition-colors",
                    r.reacted
                      ? "border-border bg-surface-2 text-text-primary"
                      : "border-border-subtle bg-surface-1 text-text-secondary hover:border-border hover:bg-surface-2 hover:text-text-primary",
                  )}
                >
                  <span>{r.emoji}</span>
                  <span className="font-mono tabular-nums">{r.count}</span>
                </button>
              ))}
              {onAddReaction ? (
                <button
                  type="button"
                  onClick={onAddReaction}
                  aria-label="Add reaction"
                  className="inline-flex items-center rounded-full border border-dashed border-border-subtle px-1.5 py-[1px] text-[11px] text-text-muted opacity-0 transition-opacity hover:border-border-hover hover:bg-surface-2 group-hover:opacity-100"
                >
                  +
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        {rowActions ? (
          <div className="pointer-events-none absolute right-4 top-1 hidden items-center gap-0.5 rounded-lg border border-border bg-surface-1 p-0.5 shadow-[var(--shadow-dropdown)] group-hover:pointer-events-auto group-hover:flex">
            {rowActions}
          </div>
        ) : null}
      </div>
    );
  },
);

ChatMessage.displayName = "ChatMessage";
