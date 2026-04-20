import * as React from "react";
import { Archive, AtSign, ChevronRight, Hash, MessageSquareMore } from "lucide-react";

import { cn } from "../lib/cn";
import { Avatar, AvatarFallback } from "./avatar";

export type TopicStatus = "active" | "needs-review" | "blocked" | "done" | "archived";

export interface TopicAssignee {
  name: string;
  /** 1–2 letter fallback shown when avatar is missing. */
  fallback?: string;
  isAgent?: boolean;
  /** Accent color used for the assignee name (typically agent accent). */
  accent?: string;
}

export interface TopicCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  author: string;
  /** Defaults to `"active"`. */
  status?: TopicStatus;
  /** Human-friendly "last activity" line, e.g. `"2 min ago"`. */
  lastActivity: string;
  replies: number;
  /** Short labels / initials used for the participant avatar stack. Up to 5 visible. */
  participants: string[];
  /** Optional 2-line preview of the latest reply. */
  preview?: string;
  assignee?: TopicAssignee;
}

const statusStyle: Record<TopicStatus, string> = {
  active: "bg-info-subtle text-info",
  "needs-review": "bg-warning-subtle text-warning",
  blocked: "bg-error-subtle text-error",
  done: "bg-success-subtle text-success",
  archived: "bg-surface-2 text-text-tertiary",
};

/**
 * Mixed-feed "topic" entry — one visual tier above chat messages. Shows title,
 * status, author, preview, participants, and reply count. Acts as a button so
 * the whole card is clickable.
 *
 * @example
 * <TopicCard
 *   title="Billing API retry storms"
 *   author="Alice Chen"
 *   status="needs-review"
 *   lastActivity="2 min ago"
 *   replies={14}
 *   participants={["AC", "BL", "MN"]}
 *   preview="Root cause looks like the new exponential-backoff config…"
 *   assignee={{ name: "Coder", isAgent: true, accent: "var(--color-brand-primary)" }}
 * />
 */
export const TopicCard = React.forwardRef<HTMLButtonElement, TopicCardProps>(
  (
    {
      className,
      title,
      author,
      status = "active",
      lastActivity,
      replies,
      participants,
      preview,
      assignee,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const archived = status === "archived";

    return (
      <button
        ref={ref}
        type={type}
        data-slot="topic-card"
        data-status={status}
        className={cn(
          "group flex w-full max-w-[580px] flex-col gap-2 rounded-lg border px-3.5 py-3 text-left transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          archived
            ? "border-border-subtle bg-surface-1 opacity-70 hover:opacity-100"
            : "border-border bg-surface-1 hover:border-border-hover hover:shadow-sm",
          className,
        )}
        {...rest}
      >
        <div className="flex items-start gap-2.5">
          <div
            className={cn(
              "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-surface-2",
              archived ? "text-text-tertiary" : "text-text-secondary",
            )}
            aria-hidden
          >
            <Hash className="size-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p
                className={cn(
                  "min-w-0 truncate text-[13px] font-semibold",
                  archived ? "text-text-secondary" : "text-text-heading",
                )}
              >
                {title}
              </p>
              <span
                className={cn(
                  "shrink-0 rounded-[4px] px-1.5 py-[1px] text-[9px] font-semibold uppercase leading-tight",
                  statusStyle[status],
                )}
              >
                {status === "needs-review" ? (
                  <>
                    <AtSign className="mr-0.5 inline-block size-2.5 align-[-1px]" />
                    Needs review
                  </>
                ) : status === "archived" ? (
                  <>
                    <Archive className="mr-0.5 inline-block size-2.5 align-[-1px]" />
                    Archived
                  </>
                ) : (
                  status.replace("-", " ")
                )}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-text-muted">
              Started by <span className="text-text-secondary">{author}</span> · {lastActivity}
              {assignee ? (
                <>
                  {" · assigned to "}
                  <span
                    className="font-medium"
                    style={{
                      color: assignee.isAgent ? assignee.accent : undefined,
                    }}
                  >
                    {assignee.name}
                  </span>
                </>
              ) : null}
            </p>
          </div>
        </div>

        {preview ? (
          <p className="line-clamp-2 pl-[34px] text-[12px] leading-relaxed text-text-secondary">
            {preview}
          </p>
        ) : null}

        <div className="flex items-center justify-between pl-[34px]">
          <div className="flex -space-x-1.5">
            {participants.slice(0, 5).map((p) => (
              <Avatar key={p} className="size-5 border-2 border-surface-1">
                <AvatarFallback className="bg-surface-2 text-[9px] font-semibold text-text-primary">
                  {p}
                </AvatarFallback>
              </Avatar>
            ))}
            {participants.length > 5 ? (
              <span className="flex size-5 items-center justify-center rounded-full border-2 border-surface-1 bg-surface-2 text-[9px] font-semibold text-text-secondary">
                +{participants.length - 5}
              </span>
            ) : null}
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary">
            <MessageSquareMore className="size-3" />
            <span className="font-mono tabular-nums">{replies}</span> replies
            <ChevronRight className="ml-0.5 size-3 text-text-muted transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </button>
    );
  },
);

TopicCard.displayName = "TopicCard";
