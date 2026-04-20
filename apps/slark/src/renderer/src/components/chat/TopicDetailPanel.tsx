import {
  DetailPanel,
  DetailPanelCloseButton,
  DetailPanelHeader,
  DetailPanelTitle,
  EmptyState,
  ImageAttachment,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from "@nexu-design/ui-web";
import { Bot, ExternalLink, Hash, MessageSquareMore, Paperclip, Pin, Users } from "lucide-react";

import type { ContentBlock, TopicThreadMessage } from "@/types";

type TopicBlock = Extract<ContentBlock, { type: "topic" }>;

interface TopicDetailPanelProps {
  topic: TopicBlock;
  onClose: () => void;
}

/**
 * Right-side detail panel for a clicked topic card.
 *
 * Layout contract (see PR #34 rationale, mirrored from the chat-side-panel
 * storybook prototype):
 * - Lives inline in the chat column via the parent's flex layout; the
 *   parent animates `width: 0 → 380px` so the message list is *pushed*,
 *   never overlaid. No backdrop, no scrim.
 * - Primary tab is Thread — the reply conversation under this topic,
 *   with inline images and link-preview cards. Files / Members / Pinned
 *   are secondary. Labels stay English regardless of locale (same rule
 *   as the chat header tabs).
 * - `bg-surface-0` via DetailPanel (one step below surface-1 chat bg)
 *   gives the panel a subtle depth cue without introducing a new
 *   surface token.
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
  const thread = topic.thread ?? [];

  // Aggregate shared media across the thread so the Files tab has
  // real content when available — matches the user's expectation that
  // "images and links from the conversation show up here".
  const sharedImages = thread.filter((m) => !!m.image) as (TopicThreadMessage & {
    image: NonNullable<TopicThreadMessage["image"]>;
  })[];
  const sharedLinks = thread.filter((m) => !!m.link) as (TopicThreadMessage & {
    link: NonNullable<TopicThreadMessage["link"]>;
  })[];
  const hasAnyFiles = sharedImages.length > 0 || sharedLinks.length > 0;

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

      <Tabs defaultValue="thread" className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 border-b border-border-subtle px-4 pt-2 pb-1.5">
          <TabsList className="h-7 rounded-md p-0.5">
            <TabsTrigger
              value="thread"
              className="h-6 gap-1 px-2 text-[12px] font-semibold leading-none"
            >
              <MessageSquareMore className="size-3" />
              Thread
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="h-6 gap-1 px-2 text-[12px] font-semibold leading-none"
            >
              <Paperclip className="size-3" />
              Files
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="h-6 gap-1 px-2 text-[12px] font-semibold leading-none"
            >
              <Users className="size-3" />
              Members
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

        <TabsContent value="thread" className="mt-0 min-h-0 flex-1 overflow-y-auto">
          <ThreadView topic={topic} thread={thread} />
        </TabsContent>

        <TabsContent value="files" className="mt-0 min-h-0 flex-1 overflow-y-auto">
          {hasAnyFiles ? (
            <div className="flex flex-col gap-4 p-4">
              {sharedImages.length > 0 && (
                <section className="flex flex-col gap-2">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                    Images ({sharedImages.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {sharedImages.map((m) => (
                      <ImageAttachment
                        key={m.id}
                        src={m.image.url}
                        alt={m.image.alt ?? ""}
                        width={160}
                        height={120}
                        className="w-full"
                      />
                    ))}
                  </div>
                </section>
              )}
              {sharedLinks.length > 0 && (
                <section className="flex flex-col gap-2">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                    Links ({sharedLinks.length})
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {sharedLinks.map((m) => (
                      <li key={m.id}>
                        <LinkPreviewCard link={m.link} />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          ) : (
            <div className="p-4">
              <EmptyState
                icon={<Paperclip className="size-8" />}
                title="No files"
                description="Files shared in this topic will appear here."
              />
            </div>
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

/**
 * Compact reply-thread renderer. Not the main ChatMessage primitive because
 * the 380px-wide detail panel needs tighter padding, smaller avatars, and
 * a different affordance for link previews — reusing ChatMessage here would
 * force us to override half its spacing via className, which is more
 * brittle than a small local component.
 *
 * Top card (optional) shows the topic's preview text as the "opening
 * context" of the thread when the first reply wasn't authored by the
 * topic starter. It mirrors how Slack / Linear surface the originating
 * message at the top of a thread view.
 */
function ThreadView({
  topic,
  thread,
}: {
  topic: TopicBlock;
  thread: TopicThreadMessage[];
}): React.ReactElement {
  if (thread.length === 0) {
    return (
      <div className="p-4">
        {topic.preview ? (
          <div className="rounded-lg border border-border-subtle bg-surface-1 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
              Opening context
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-text-primary">{topic.preview}</p>
          </div>
        ) : (
          <EmptyState
            icon={<MessageSquareMore className="size-8" />}
            title="No replies yet"
            description="When people reply to this topic, their messages will show up here."
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-6">
      {topic.preview ? (
        <div className="rounded-lg border border-border-subtle bg-surface-1 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
            Opening context
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-text-primary">{topic.preview}</p>
        </div>
      ) : null}

      <ul className="flex flex-col gap-3">
        {thread.map((msg) => (
          <li key={msg.id}>
            <ThreadReply message={msg} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThreadReply({ message }: { message: TopicThreadMessage }): React.ReactElement {
  const { author, initials, isAgent, accent, createdAtLabel, text, image, link } = message;

  return (
    <article className="flex gap-2.5">
      <div
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
          isAgent ? "bg-brand-subtle text-brand-primary" : "bg-surface-2 text-text-primary",
        )}
      >
        {isAgent ? <Bot className="size-3.5" /> : initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span
            className="truncate text-[12px] font-semibold text-text-heading"
            style={isAgent && accent ? { color: accent } : undefined}
          >
            {author}
          </span>
          {isAgent && (
            <span className="shrink-0 rounded-[4px] bg-success-subtle px-1.5 py-[1px] text-[9px] font-semibold uppercase leading-tight text-success">
              Agent
            </span>
          )}
          <span className="shrink-0 font-mono text-[10px] tabular-nums text-text-tertiary">
            {createdAtLabel}
          </span>
        </div>
        {text ? (
          <p className="mt-0.5 text-[12px] leading-relaxed text-text-primary">{text}</p>
        ) : null}
        {image ? (
          <div className="mt-2">
            <ImageAttachment
              src={image.url}
              alt={image.alt ?? ""}
              width={image.width ?? 300}
              height={image.height ?? 180}
              className="w-full"
            />
          </div>
        ) : null}
        {link ? (
          <div className="mt-2">
            <LinkPreviewCard link={link} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

function LinkPreviewCard({
  link,
}: {
  link: NonNullable<TopicThreadMessage["link"]>;
}): React.ReactElement {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-start gap-2.5 rounded-lg border border-border-subtle bg-surface-1 px-3 py-2.5 transition-colors hover:border-border hover:bg-surface-2"
    >
      <div
        aria-hidden="true"
        className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-surface-2 text-text-secondary"
      >
        <ExternalLink className="size-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-semibold text-text-heading">{link.title}</p>
        {link.description ? (
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-text-secondary">
            {link.description}
          </p>
        ) : null}
        {link.host ? (
          <p className="mt-1 truncate text-[10px] font-mono text-text-tertiary">{link.host}</p>
        ) : null}
      </div>
    </a>
  );
}
