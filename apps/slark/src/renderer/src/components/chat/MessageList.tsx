import { useEffect, useRef, useState, useCallback } from "react";
import { Bot, Hash, LogIn, Sparkles, UserPlus, Pencil } from "lucide-react";
import { Button, ChatMessage, EventNotice, Mention } from "@nexu-design/ui-web";
import type { ChatSender } from "@nexu-design/ui-web";
import { useChatStore } from "@/stores/chat";
import { useWorkspaceStore } from "@/stores/workspace";
import { useAgentsStore } from "@/stores/agents";
import { resolveRef } from "@/mock/data";
import { ContentBlockRenderer } from "./ContentBlocks";
import { ContentDetailOverlay } from "./ContentDetailOverlay";
import type { Channel, ContentBlock, Message } from "@/types";

const CURRENT_USER_ID = "u-1";
const CONSECUTIVE_WINDOW_MS = 5 * 60 * 1000;

function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameDay(d, today)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AGENT_ACCENTS = [
  "var(--color-brand-primary)",
  "var(--color-info)",
  "var(--color-warning)",
  "var(--color-success)",
];

function accentFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return AGENT_ACCENTS[Math.abs(hash) % AGENT_ACCENTS.length];
}

function toSender(msg: Message): ChatSender | undefined {
  const resolved = resolveRef(msg.sender);
  if (!resolved) return undefined;
  return {
    id: msg.sender.id,
    name: resolved.name,
    avatar: resolved.avatar,
    fallback: initialsOf(resolved.name),
    isAgent: resolved.isAgent,
    accent: resolved.isAgent ? accentFor(msg.sender.id) : undefined,
  };
}

/**
 * Render message text with inline `@name` tokens promoted to <Mention> pills, and a
 * minimal set of markdown-ish formatting (fenced code, inline code, bold).
 */
function renderContent(content: string): React.ReactNode {
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*|@[\w-]+)/g);
  let offset = 0;
  return parts.map((part) => {
    const key = `${offset}-${part}`;
    offset += part.length;
    if (!part) return null;
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).replace(/^\w+\n/, "");
      return (
        <pre
          key={key}
          className="my-2 overflow-x-auto rounded-lg bg-surface-2 p-3 text-[12px] font-mono"
        >
          <code>{code}</code>
        </pre>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={key} className="rounded-sm bg-surface-2 px-1 py-[1px] font-mono text-[12px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (/^@[\w-]+$/.test(part)) {
      return <Mention key={key} name={part.slice(1)} />;
    }
    return <span key={key}>{part}</span>;
  });
}

function isPresent<T>(value: T | null | undefined): value is T {
  return value != null;
}

function blockKey(block: ContentBlock): string {
  const maybeId = (block as { id?: unknown }).id;
  return typeof maybeId === "string" ? maybeId : JSON.stringify(block);
}

interface MessageListProps {
  channelId: string;
  channel?: Channel;
}

const EMPTY_MESSAGES: never[] = [];

function DMEmptyState({ channel }: { channel: Channel }): React.ReactElement {
  const otherMember = channel.members.find((m) => m.id !== CURRENT_USER_ID);
  const resolved = otherMember ? resolveRef(otherMember) : undefined;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-lg flex-col items-center space-y-3 px-6 py-16">
        {resolved && (
          <img src={resolved.avatar} alt={resolved.name} className="h-20 w-20 rounded-full" />
        )}
        <h3 className="text-xl font-semibold">{resolved?.name ?? channel.name}</h3>
        <p className="text-center text-sm text-text-muted">
          {resolved?.isAgent
            ? `This is the beginning of your conversation with ${resolved.name}.`
            : `This is the beginning of your direct message history with ${resolved?.name ?? channel.name}.`}
        </p>
      </div>
    </div>
  );
}

function ChannelEmptyState({ channel }: { channel: Channel }): React.ReactElement {
  const agents = useAgentsStore((s) => s.agents);
  const setPendingDraft = useChatStore((s) => s.setPendingDraft);

  const channelAgents = channel.members
    .filter((m) => m.kind === "agent")
    .map((m) => agents.find((a) => a.id === m.id))
    .filter(isPresent);

  const handleQuickAction = (text: string): void => {
    setPendingDraft(text);
  };

  const createdRaw = formatDateLabel(channel.createdAt);
  const createdPhrase =
    createdRaw === "Today"
      ? "today"
      : createdRaw === "Yesterday"
        ? "yesterday"
        : `on ${createdRaw}`;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-5 px-6 pt-10 pb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2">
              <Hash className="h-5 w-5 text-text-heading" />
            </div>
            <h2 className="text-[22px] font-bold tracking-tight">{channel.name}</h2>
          </div>
          <p className="text-[13px] leading-relaxed text-text-muted">
            <span className="font-medium text-text-heading">You</span> created this channel{" "}
            {createdPhrase}.{" "}
            {channel.description
              ? channel.description
              : `This is the very beginning of the #${channel.name} channel. Add a description to let others know what it's for.`}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-2"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Add people
            </Button>
            <Button
              type="button"
              variant="outline"
              className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-text-muted transition-colors hover:bg-surface-2 hover:text-text-primary"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit description
            </Button>
          </div>
        </div>

        {channelAgents.length > 0 && (
          <div className="space-y-3 rounded-xl border border-border-subtle bg-surface-2/30 p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              <Sparkles className="h-3 w-3" />
              Agents in this channel
            </div>
            <div className="space-y-2">
              {channelAgents.map((agent) => (
                <div key={agent.id} className="flex items-start gap-3">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="mt-0.5 h-8 w-8 shrink-0 rounded-full"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold">{agent.name}</span>
                      <span className="inline-flex items-center gap-1 rounded-[4px] bg-success-subtle px-1.5 py-[1px] text-[10px] font-medium leading-tight text-success">
                        <Bot className="h-2.5 w-2.5" />
                        Agent
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">
                      {agent.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {channelAgents.slice(0, 3).map((agent) => {
                const prompts = getQuickPrompts(agent.name, agent.templateId);
                return prompts.map((prompt) => (
                  <Button
                    key={`${agent.id}-${prompt}`}
                    type="button"
                    variant="outline"
                    onClick={() => handleQuickAction(prompt)}
                    className="rounded-md border border-border-subtle bg-surface-1 px-2.5 py-1 text-xs text-text-muted transition-colors hover:border-border hover:text-text-primary"
                  >
                    {prompt}
                  </Button>
                ));
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getQuickPrompts(name: string, templateId: string | null): string[] {
  switch (templateId) {
    case "tpl-1":
      return [`@${name} write a debounce hook`, `@${name} fix this bug`];
    case "tpl-2":
      return [`@${name} review my PR`, `@${name} check for security issues`];
    case "tpl-3":
      return [`@${name} check deployment status`, `@${name} run CI pipeline`];
    case "tpl-4":
      return [`@${name} summarize this thread`, `@${name} draft a doc`];
    default:
      return [`@${name} help me with something`];
  }
}

export function MessageList({ channelId, channel }: MessageListProps): React.ReactElement {
  const messages = useChatStore((s) => s.messages[channelId] ?? EMPTY_MESSAGES);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const currentUserId = useWorkspaceStore((s) => s.currentUserId) ?? CURRENT_USER_ID;
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages[messages.length - 1]?.id;
  const [expandedBlock, setExpandedBlock] = useState<ContentBlock | null>(null);
  const closeExpanded = useCallback(() => setExpandedBlock(null), []);

  const handleApproval = (
    msgId: string,
    blocks: ContentBlock[] | undefined,
    approvalId: string,
    action: "approved" | "rejected",
  ): void => {
    if (!blocks) return;
    const updated = blocks.map((b) =>
      b.type === "approval" && b.id === approvalId ? ({ ...b, status: action } as ContentBlock) : b,
    );
    updateMessage(channelId, msgId, { blocks: updated });
  };

  useEffect(() => {
    if (!lastMessageId) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lastMessageId]);

  if (messages.length === 0) {
    if (channel?.type === "dm") {
      return <DMEmptyState channel={channel} />;
    }
    if (channel) {
      return <ChannelEmptyState channel={channel} />;
    }
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-text-muted">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-3">
      {messages.map((msg, idx) => {
        const prev = messages[idx - 1];
        const showDateSeparator =
          !prev ||
          new Date(prev.createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

        if (msg.system?.kind === "join") {
          const resolved = msg.system.members.map((m) => resolveRef(m)).filter(Boolean) as {
            name: string;
            avatar: string;
            isAgent: boolean;
          }[];
          if (resolved.length === 0) return null;
          const names =
            resolved.length === 1
              ? resolved[0].name
              : resolved.length === 2
                ? `${resolved[0].name} and ${resolved[1].name}`
                : `${resolved[0].name}, ${resolved[1].name} and ${resolved.length - 2} other${resolved.length - 2 === 1 ? "" : "s"}`;
          return (
            <div key={msg.id}>
              {showDateSeparator && (
                <EventNotice className="py-2 text-[11px] font-semibold text-text-primary">
                  {formatDateLabel(msg.createdAt)}
                </EventNotice>
              )}
              <EventNotice icon={<LogIn className="size-2.5" />}>
                <span className="font-medium text-text-primary">{names}</span> joined the channel
                <span className="ml-1.5 font-mono tabular-nums text-text-tertiary">
                  {formatClock(msg.createdAt)}
                </span>
              </EventNotice>
            </div>
          );
        }

        const sender = toSender(msg);
        if (!sender) return null;

        const prevNonSystem = prev && !prev.system ? prev : undefined;
        const isConsecutive =
          !!prevNonSystem &&
          prevNonSystem.sender.kind === msg.sender.kind &&
          prevNonSystem.sender.id === msg.sender.id &&
          msg.createdAt - prevNonSystem.createdAt < CONSECUTIVE_WINDOW_MS &&
          !showDateSeparator;

        const reactions = msg.reactions.map((r) => ({
          emoji: r.emoji,
          count: r.users.length,
          reacted: r.users.includes(currentUserId),
        }));

        return (
          <div key={msg.id}>
            {showDateSeparator && (
              <EventNotice className="py-2 text-[11px] font-semibold text-text-primary">
                {formatDateLabel(msg.createdAt)}
              </EventNotice>
            )}
            <ChatMessage
              sender={sender}
              time={formatClock(msg.createdAt)}
              compact={isConsecutive}
              reactions={reactions.length > 0 ? reactions : undefined}
              blocks={
                msg.blocks && msg.blocks.length > 0
                  ? msg.blocks.map((block) => (
                      <ContentBlockRenderer
                        key={blockKey(block)}
                        block={block}
                        isMe={msg.sender.id === currentUserId}
                        onApprovalAction={(aid, action) =>
                          handleApproval(msg.id, msg.blocks, aid, action)
                        }
                        onExpand={setExpandedBlock}
                      />
                    ))
                  : undefined
              }
            >
              {msg.content ? (
                <>
                  {renderContent(msg.content)}
                  {msg.isStreaming && (
                    <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-current align-middle opacity-60" />
                  )}
                </>
              ) : null}
            </ChatMessage>
          </div>
        );
      })}
      <div ref={bottomRef} />
      <ContentDetailOverlay block={expandedBlock} onClose={closeExpanded} />
    </div>
  );
}
