import {
  DetailPanel,
  DetailPanelCloseButton,
  DetailPanelHeader,
  DetailPanelTitle,
  EmptyState,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from "@nexu-design/ui-web";
import { Hash, Paperclip, Pin, Sparkles, Users } from "lucide-react";

import type { ContentBlock } from "@/types";

type TopicBlock = Extract<ContentBlock, { type: "topic" }>;

interface TopicDetailPanelProps {
  topic: TopicBlock;
  onClose: () => void;
}

/**
 * Right-side detail panel for a clicked topic card.
 *
 * Layout contract (see PR #34 rationale, mirrored from the
 * chat-side-panel storybook prototype):
 * - Lives inline in the chat column via the parent's flex layout; the
 *   parent container animates `width: 0 → 400px` so the message list is
 *   *pushed*, never overlaid. No backdrop, no scrim.
 * - Four tabs (Artifacts / Members / Files / Pinned) match the storybook
 *   scenario and the product review. Labels stay English regardless of
 *   locale — same rule as the chat header tabs.
 * - `bg-surface-0` (one step below `surface-1` chat bg) gives the panel a
 *   slight depth cue without introducing a new surface token.
 */

const STATUS_BADGE: Record<
  NonNullable<TopicBlock["status"]>,
  { label: string; className: string }
> = {
  active: { label: "Active", className: "bg-info-subtle text-info" },
  "needs-review": { label: "Needs review", className: "bg-warning-subtle text-warning" },
  blocked: { label: "Blocked", className: "bg-error-subtle text-error" },
  done: { label: "Done", className: "bg-success-subtle text-success" },
  archived: { label: "Archived", className: "bg-surface-2 text-text-tertiary" },
};

export function TopicDetailPanel({ topic, onClose }: TopicDetailPanelProps): React.ReactElement {
  const status = topic.status ? STATUS_BADGE[topic.status] : null;

  return (
    <DetailPanel width="100%" className="h-full">
      <DetailPanelHeader className="items-start gap-2.5">
        <div
          aria-hidden="true"
          className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-surface-2 text-text-secondary"
        >
          <Hash className="size-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <DetailPanelTitle className="min-w-0 truncate text-[14px] text-text-heading">
              {topic.title}
            </DetailPanelTitle>
            {status && (
              <span
                className={cn(
                  "shrink-0 rounded-[4px] px-1.5 py-[1px] text-[9px] font-semibold uppercase leading-tight",
                  status.className,
                )}
              >
                {status.label}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-text-muted">
            Started by <span className="text-text-secondary">{topic.author}</span> ·{" "}
            {topic.lastActivity}
            {topic.assignee ? (
              <>
                {" · assigned to "}
                <span
                  className="font-medium"
                  style={{
                    color: topic.assignee.isAgent ? topic.assignee.accent : undefined,
                  }}
                >
                  {topic.assignee.name}
                </span>
              </>
            ) : null}
          </p>
        </div>
        <DetailPanelCloseButton onClick={onClose} srLabel="Close topic panel" />
      </DetailPanelHeader>

      <Tabs defaultValue="artifacts" className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 border-b border-border-subtle px-4 pt-2 pb-1.5">
          <TabsList className="h-7 rounded-md p-0.5">
            <TabsTrigger
              value="artifacts"
              className="h-6 gap-1 px-2 text-[12px] font-semibold leading-none"
            >
              <Sparkles className="size-3" />
              Artifacts
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="h-6 gap-1 px-2 text-[12px] font-semibold leading-none"
            >
              <Users className="size-3" />
              Members
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="h-6 gap-1 px-2 text-[12px] font-semibold leading-none"
            >
              <Paperclip className="size-3" />
              Files
            </TabsTrigger>
            <TabsTrigger
              value="pinned"
              className="h-6 gap-1 px-2 text-[12px] font-semibold leading-none"
            >
              <Pin className="size-3" />
              Pinned
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="artifacts" className="mt-0 min-h-0 flex-1 overflow-y-auto p-4">
          {topic.preview ? (
            <div className="rounded-lg border border-border-subtle bg-surface-1 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                Summary
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-text-primary">
                {topic.preview}
              </p>
            </div>
          ) : (
            <EmptyState
              icon={<Sparkles className="size-8" />}
              title="No artifacts yet"
              description="As this topic produces outputs, they'll appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="members" className="mt-0 min-h-0 flex-1 overflow-y-auto">
          {topic.participants.length > 0 ? (
            <ul className="flex flex-col">
              {topic.participants.map((initials, idx) => (
                <li
                  // biome-ignore lint/suspicious/noArrayIndexKey: participants is a static string[] of initials that can contain duplicates ("AC" twice if two Alice Chens are on the topic) and never reorders within a topic, so combining value + index is both safe and necessary.
                  key={`${initials}-${idx}`}
                  className="flex items-center gap-3 border-b border-border-subtle px-4 py-2.5 last:border-b-0"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[11px] font-semibold text-text-primary">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1 text-[13px] font-medium text-text-primary">
                    {initials}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4">
              <EmptyState
                icon={<Users className="size-8" />}
                title="No members"
                description="This topic has no participants yet."
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="files" className="mt-0 min-h-0 flex-1 overflow-y-auto p-4">
          <EmptyState
            icon={<Paperclip className="size-8" />}
            title="No files"
            description="Files shared in this topic will appear here."
          />
        </TabsContent>

        <TabsContent value="pinned" className="mt-0 min-h-0 flex-1 overflow-y-auto p-4">
          <EmptyState
            icon={<Pin className="size-8" />}
            title="Nothing pinned"
            description="Pin a message in this topic to keep it handy."
          />
        </TabsContent>
      </Tabs>
    </DetailPanel>
  );
}
