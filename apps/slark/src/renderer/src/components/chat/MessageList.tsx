import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Bot,
  Brain,
  Check,
  Clock,
  Hash,
  LogIn,
  Sparkles,
  UserPlus,
  Pencil,
  MessageSquarePlus,
  CircleDot,
  ArrowRight,
  RotateCw,
  Smile,
  Quote,
  Trash2,
  Undo2,
} from "lucide-react";
import {
  Button,
  ChatMessage,
  ConfirmDialog,
  EventNotice,
  Mention,
  Popover,
  PopoverAnchor,
  PopoverContent,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from "@nexu-design/ui-web";
import type { ChatSender } from "@nexu-design/ui-web";
import { useChatStore } from "@/stores/chat";
import { useWorkspaceStore } from "@/stores/workspace";
import { useAgentsStore } from "@/stores/agents";
import { useTopicsStore } from "@/stores/topics";
import { useMemoriesStore } from "@/stores/memories";
import { useT } from "@/i18n";
import { resolveRef } from "@/mock/data";
import { ContentBlockRenderer, type ApprovalResult } from "./ContentBlocks";
import { ContentDetailOverlay } from "./ContentDetailOverlay";
import { EmojiPicker } from "./EmojiPicker";
import type { Agent, Channel, ContentBlock, Message, Reaction } from "@/types";

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

function getAgentSuggestions(agent: Agent): string[] {
  const fromSkills: string[] = [];
  for (const s of agent.skills.slice(0, 3)) {
    fromSkills.push(`Can you help me with ${s.name.toLowerCase()}?`);
  }
  const generic = [
    `Hi ${agent.name}, what can you help me with?`,
    `${agent.name}, show me an example of what you can do.`,
    `Give me a quick overview of your capabilities.`,
  ];
  const combined = [...fromSkills, ...generic];
  return combined.slice(0, 3);
}

function DMEmptyState({ channel }: { channel: Channel }): React.ReactElement {
  const otherMember = channel.members.find((m) => m.id !== CURRENT_USER_ID);
  const resolved = otherMember ? resolveRef(otherMember) : undefined;
  const agents = useAgentsStore((s) => s.agents);
  const setPendingDraft = useChatStore((s) => s.setPendingDraft);

  const agent =
    otherMember?.kind === "agent" ? agents.find((a) => a.id === otherMember.id) : undefined;
  const suggestions = agent ? getAgentSuggestions(agent) : [];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
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
        {agent?.description ? (
          <p className="text-center text-xs text-text-tertiary">{agent.description}</p>
        ) : null}
      </div>
      {suggestions.length > 0 ? (
        <div className="mt-auto px-4 pb-3">
          <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPendingDraft(s)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-0 px-3 py-1.5 text-[12px] text-text-primary shadow-sm transition-colors hover:bg-surface-2"
                title="Click to use this as a draft"
              >
                <Sparkles className="size-3 text-brand-primary" />
                <span className="max-w-[320px] truncate">{s}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
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
                    className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-secondary ring-1 ring-inset ring-black/5"
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
  const t = useT();
  const messages = useChatStore((s) => s.messages[channelId] ?? EMPTY_MESSAGES);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const convertToTopic = useChatStore((s) => s.convertToTopic);
  const convertToIssue = useChatStore((s) => s.convertToIssue);
  const topics = useTopicsStore((s) => s.topics);
  const setActiveTopic = useTopicsStore((s) => s.setActiveTopic);
  const retryMessage = useChatStore((s) => s.retryMessage);
  const removeMessage = useChatStore((s) => s.removeMessage);
  const currentUserId = useWorkspaceStore((s) => s.currentUserId) ?? CURRENT_USER_ID;
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages[messages.length - 1]?.id;
  const [expandedBlock, setExpandedBlock] = useState<ContentBlock | null>(null);
  const [reactionPickerId, setReactionPickerId] = useState<string | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [recallTargetId, setRecallTargetId] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeExpanded = useCallback(() => setExpandedBlock(null), []);

  const pendingScrollToMessageId = useChatStore((s) => s.pendingScrollToMessageId);
  const pendingScrollFlashCount = useChatStore((s) => s.pendingScrollFlashCount);
  const setPendingScrollToMessage = useChatStore((s) => s.setPendingScrollToMessage);

  useEffect(() => {
    if (!pendingScrollToMessageId) return;
    const target = messages.find((m) => m.id === pendingScrollToMessageId);
    if (!target) return;
    const id = pendingScrollToMessageId;
    const flashCount = Math.max(1, pendingScrollFlashCount);
    const timers: ReturnType<typeof setTimeout>[] = [];
    const frame = requestAnimationFrame(() => {
      const el = document.querySelector(`[data-message-id="${id}"]`) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const FLASH_MS = 2400;
        const GAP_MS = 120;
        for (let i = 0; i < flashCount; i++) {
          timers.push(setTimeout(() => setHighlightedMessageId(id), i * (FLASH_MS + GAP_MS)));
          timers.push(
            setTimeout(() => setHighlightedMessageId(null), i * (FLASH_MS + GAP_MS) + FLASH_MS),
          );
        }
      }
      setPendingScrollToMessage(null);
    });
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
    };
  }, [pendingScrollToMessageId, pendingScrollFlashCount, messages, setPendingScrollToMessage]);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setReactionPickerId(null);
      closeTimerRef.current = null;
    }, 150);
  }, [cancelClose]);

  const openPicker = useCallback(
    (id: string) => {
      cancelClose();
      setReactionPickerId(id);
    },
    [cancelClose],
  );

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const toggleReaction = useCallback(
    (msg: Message, emoji: string) => {
      const existing = msg.reactions.find((r) => r.emoji === emoji);
      let next: Reaction[];
      if (existing) {
        const hasMe = existing.users.includes(currentUserId);
        const nextUsers = hasMe
          ? existing.users.filter((u) => u !== currentUserId)
          : [...existing.users, currentUserId];
        next =
          nextUsers.length === 0
            ? msg.reactions.filter((r) => r.emoji !== emoji)
            : msg.reactions.map((r) => (r.emoji === emoji ? { ...r, users: nextUsers } : r));
      } else {
        next = [...msg.reactions, { emoji, users: [currentUserId] }];
      }
      updateMessage(channelId, msg.id, { reactions: next });
    },
    [channelId, currentUserId, updateMessage],
  );

  const handleStartTopic = useCallback(
    (msgId: string) => {
      const topicId = convertToTopic(channelId, msgId);
      if (topicId) setActiveTopic(topicId);
    },
    [channelId, convertToTopic, setActiveTopic],
  );

  const handleConvertToIssue = useCallback(
    (msgId: string) => {
      const topicId = convertToIssue(channelId, msgId);
      if (topicId) setActiveTopic(topicId);
    },
    [channelId, convertToIssue, setActiveTopic],
  );

  const addMemory = useMemoriesStore((s) => s.addMemory);
  const proposals = useMemoriesStore((s) => s.proposals);
  const setProposalStatus = useMemoriesStore((s) => s.setProposalStatus);
  const allMemories = useMemoriesStore((s) => s.memories);

  // Derived: which message IDs in this channel already have at least one Memory backed by them.
  const savedMessageIds = useMemo(() => {
    const set = new Set<string>();
    for (const m of allMemories) {
      if (m.channelId === channelId && m.sourceMessageId) {
        set.add(m.sourceMessageId);
      }
    }
    return set;
  }, [allMemories, channelId]);

  const handleSaveToMemory = useCallback(
    (msg: Message) => {
      // Already saved: do nothing — the checkmark is the persistent state.
      if (savedMessageIds.has(msg.id)) return;
      const text = msg.content.trim();
      if (!text) return;
      const truncated = text.length > 280 ? `${text.slice(0, 280).trimEnd()}…` : text;
      addMemory({
        channelId,
        kind: "context",
        content: truncated,
        source: "user",
        method: "explicit",
        sourceMessageId: msg.id,
      });
    },
    [addMemory, channelId, savedMessageIds],
  );

  const recallMessage = useChatStore((s) => s.recallMessage);
  const setPendingQuote = useChatStore((s) => s.setPendingQuote);

  const handleRequestRecall = useCallback((msgId: string) => {
    setRecallTargetId(msgId);
  }, []);

  const handleConfirmRecall = useCallback(() => {
    if (recallTargetId) recallMessage(channelId, recallTargetId);
    setRecallTargetId(null);
  }, [channelId, recallMessage, recallTargetId]);

  const handleQuote = useCallback(
    (msg: Message) => {
      const resolved = resolveRef(msg.sender);
      const senderName = resolved?.name ?? "Unknown";
      const raw = msg.content.trim().replace(/\s+/g, " ");
      const snippet = raw
        ? raw.length > 140
          ? `${raw.slice(0, 140).trimEnd()}…`
          : raw
        : msg.blocks && msg.blocks.length > 0
          ? "[attachment]"
          : "";
      setPendingQuote({
        channelId,
        quote: { messageId: msg.id, senderName, content: snippet },
      });
    },
    [channelId, setPendingQuote],
  );

  const jumpToMessage = useCallback(
    (msgId: string) => {
      setPendingScrollToMessage(msgId);
    },
    [setPendingScrollToMessage],
  );
  const handleSaveExchange = useCallback(
    (userMsg: Message, agentMsg: Message) => {
      const q = userMsg.content.trim().replace(/\s+/g, " ");
      const a = agentMsg.content.trim().replace(/\s+/g, " ");
      const compact = (s: string, n: number): string =>
        s.length > n ? `${s.slice(0, n).trimEnd()}…` : s;
      const content = `Q: ${compact(q, 140)}\nA: ${compact(a, 220)}`;
      addMemory({
        channelId,
        kind: "context",
        content,
        source: "agent",
        authorId: agentMsg.sender.id,
        method: "agent_auto",
        sourceMessageId: agentMsg.id,
      });
      setProposalStatus(agentMsg.id, "saved");
    },
    [addMemory, channelId, setProposalStatus],
  );

  const handleOpenTopic = useCallback(
    (topicId: string) => {
      setActiveTopic(topicId);
    },
    [setActiveTopic],
  );

  const handleApproval = (
    msgId: string,
    blocks: ContentBlock[] | undefined,
    approvalId: string,
    result: ApprovalResult,
  ): void => {
    if (!blocks) return;
    const updated = blocks.map((b) => {
      if (b.type !== "approval" || b.id !== approvalId) return b;
      if (result.kind === "text") {
        return { ...b, status: "responded", response: { text: result.text } } as ContentBlock;
      }
      const status: "approved" | "rejected" | "responded" =
        result.choiceId === "approved"
          ? "approved"
          : result.choiceId === "rejected"
            ? "rejected"
            : "responded";
      return {
        ...b,
        status,
        response: { choiceId: result.choiceId, label: result.label },
      } as ContentBlock;
    });
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
                <EventNotice className="mt-4 py-2 text-[11px] font-semibold text-text-primary">
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

        if (msg.recalled) {
          const isMine = msg.sender.kind === "user" && msg.sender.id === currentUserId;
          const recallText = isMine
            ? t("chat.recalledByYou")
            : t("chat.recalledBy", { name: sender.name });
          return (
            <div key={msg.id}>
              {showDateSeparator && (
                <EventNotice className="mt-4 py-2 text-[11px] font-semibold text-text-primary">
                  {formatDateLabel(msg.createdAt)}
                </EventNotice>
              )}
              <EventNotice icon={<Undo2 className="size-2.5" />}>
                {recallText}
                <span className="ml-1.5 font-mono tabular-nums text-text-tertiary">
                  {formatClock(msg.recalledAt ?? msg.createdAt)}
                </span>
              </EventNotice>
            </div>
          );
        }

        const prevNonSystem = prev && !prev.system && !prev.recalled ? prev : undefined;
        const isConsecutive =
          !!prevNonSystem &&
          prevNonSystem.sender.kind === msg.sender.kind &&
          prevNonSystem.sender.id === msg.sender.id &&
          msg.createdAt - prevNonSystem.createdAt < CONSECUTIVE_WINDOW_MS &&
          !showDateSeparator;

        const isOwnMessage = msg.sender.kind === "user" && msg.sender.id === currentUserId;
        const isSavedToMemory = savedMessageIds.has(msg.id);

        const reactions = msg.reactions.map((r) => ({
          emoji: r.emoji,
          count: r.users.length,
          reacted: r.users.includes(currentUserId),
        }));

        const derivedTopic = msg.derivedTopicId ? topics[msg.derivedTopicId] : undefined;
        const isIssue = !!derivedTopic?.issue;
        const mentionsAgent = msg.mentions.some((m) => m.kind === "agent");
        const mentionsMe = msg.mentions.some((m) => m.kind === "user" && m.id === currentUserId);

        const isAgentReply = msg.sender.kind === "agent" && !msg.isStreaming;
        const precedingUserMsg =
          isAgentReply &&
          prevNonSystem &&
          prevNonSystem.sender.kind === "user" &&
          prevNonSystem.sender.id === currentUserId &&
          prevNonSystem.content.trim().length > 0
            ? prevNonSystem
            : undefined;
        const proposalStatus = proposals[msg.id];
        const showProposal = !!precedingUserMsg && !proposalStatus;

        const isHighlighted = highlightedMessageId === msg.id;

        /*
         * Delivery state (user messages only). `undefined` = historical/mock
         * data loaded from seed, treat as "sent". Agent messages use the
         * separate `isStreaming` track and never carry a deliveryStatus.
         */
        const deliveryStatus = msg.deliveryStatus;
        const isSending = deliveryStatus === "sending";
        const isFailed = deliveryStatus === "failed";

        /*
         * For failed bubbles the primary action (retry) is promoted into
         * the inline status chip — the red refresh button rendered in the
         * body. The hover toolbar keeps only the secondary `Delete`
         * action so we don't duplicate retry affordances across two
         * surfaces.
         */
        const rowActions = isFailed ? (
          <button
            type="button"
            onClick={() => removeMessage(channelId, msg.id)}
            aria-label="Delete message"
            title="Delete"
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </button>
        ) : undefined;

        return (
          <div key={msg.id}>
            {showDateSeparator && (
              <EventNotice className="mt-4 py-2 text-[11px] font-semibold text-text-primary">
                {formatDateLabel(msg.createdAt)}
              </EventNotice>
            )}
            <div
              data-message-id={msg.id}
              className={cn("group relative", isHighlighted && "message-flash")}
            >
              <ChatMessage
                sender={sender}
                time={formatClock(msg.createdAt)}
                compact={isConsecutive}
                highlighted={mentionsMe}
                reactions={reactions.length > 0 ? reactions : undefined}
                onReactionClick={(emoji) => toggleReaction(msg, emoji)}
                rowActions={rowActions}
                /*
                 * Only sending bubbles get a row-level tweak (faded, so
                 * the optimistic row reads as tentative). Failed rows sit
                 * on the normal feed background — the red retry chip +
                 * "Not delivered" caption carry the signal on their own,
                 * and tinting the whole row was reading as louder than
                 * intended against our light canvas.
                 */
                className={cn(isSending && "opacity-60")}
                blocks={
                  msg.blocks && msg.blocks.length > 0
                    ? msg.blocks.map((block) => (
                        <ContentBlockRenderer
                          key={blockKey(block)}
                          block={block}
                          isMe={msg.sender.id === currentUserId}
                          onApprovalAction={(aid, result) =>
                            handleApproval(msg.id, msg.blocks, aid, result)
                          }
                          onExpand={setExpandedBlock}
                        />
                      ))
                    : undefined
                }
              >
                {msg.quoted ? (
                  <button
                    type="button"
                    onClick={() => jumpToMessage(msg.quoted!.messageId)}
                    className="mb-1.5 block w-full max-w-[520px] rounded-md border-l-2 border-brand-primary bg-surface-2/50 px-2 py-1 text-left transition-colors hover:bg-surface-2"
                  >
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-text-secondary">
                      <Quote className="size-3 shrink-0 opacity-70" />
                      <span className="truncate">{msg.quoted.senderName}</span>
                    </div>
                    <div className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-text-muted">
                      {msg.quoted.content || t("chat.recalledOriginal")}
                    </div>
                  </button>
                ) : null}
                {msg.content ? (
                  <>
                    {renderContent(msg.content)}
                    {msg.isStreaming && (
                      <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse rounded-[1px] bg-current align-[-0.15em] opacity-80" />
                    )}
                    {/*
                     * Inline status glyph trailing the text. For sending
                     * we keep a quiet muted clock — it's passive
                     * information, nothing the user should act on. For
                     * failed we promote the indicator into the primary
                     * affordance: a filled-red chip with a refresh glyph
                     * that *is* the retry button. This collapses "see
                     * status" + "fix it" into one click, matching
                     * iMessage / Telegram conventions.
                     */}
                    {isSending && (
                      <Clock
                        className="ml-1 inline-block size-3 -translate-y-[1px] align-middle text-text-muted"
                        aria-label="Sending"
                      />
                    )}
                    {isFailed && (
                      <button
                        type="button"
                        onClick={() => retryMessage(channelId, msg.id)}
                        aria-label="Retry send"
                        title="Retry"
                        className="ml-1.5 inline-flex size-4 -translate-y-[2px] items-center justify-center rounded-full bg-destructive align-middle text-white transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                      >
                        <RotateCw className="size-2.5" strokeWidth={3} />
                      </button>
                    )}
                  </>
                ) : null}
              </ChatMessage>
              {derivedTopic ? (
                <div className="pl-[60px] pr-4 pb-1">
                  <button
                    type="button"
                    onClick={() => handleOpenTopic(derivedTopic.id)}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-border-subtle bg-surface-2/60 px-2 py-1 text-[11px] font-medium text-text-muted transition-colors hover:border-border hover:text-text-primary"
                  >
                    {isIssue ? (
                      <CircleDot className="size-3 shrink-0 text-brand-primary" />
                    ) : (
                      <MessageSquarePlus className="size-3 shrink-0" />
                    )}
                    <span className="truncate">
                      {isIssue ? "Issue" : "Topic"} · {derivedTopic.title}
                    </span>
                    <ArrowRight className="size-3 shrink-0 opacity-60" />
                  </button>
                </div>
              ) : null}
              {showProposal && precedingUserMsg ? (
                <div className="pl-[60px] pr-4 pb-1 pt-0.5">
                  <div className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-brand-primary/30 bg-brand-primary/5 px-2 py-1 text-[11px] font-medium text-brand-primary">
                    <Brain className="size-3 shrink-0" />
                    <span className="truncate">{t("memory.proposalPrompt")}</span>
                    <button
                      type="button"
                      onClick={() => handleSaveExchange(precedingUserMsg, msg)}
                      className="ml-1.5 inline-flex h-5 items-center gap-1 rounded bg-brand-primary px-1.5 text-[10.5px] font-semibold text-accent-fg transition-opacity hover:opacity-90"
                    >
                      {t("memory.proposalSave")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setProposalStatus(msg.id, "dismissed")}
                      className="inline-flex h-5 items-center rounded px-1.5 text-[10.5px] font-medium text-text-muted transition-colors hover:bg-surface-2 hover:text-text-primary"
                    >
                      {t("memory.proposalSkip")}
                    </button>
                  </div>
                </div>
              ) : null}
              {proposalStatus === "saved" ? (
                <div className="pl-[60px] pr-4 pb-1 pt-0.5">
                  <div className="inline-flex items-center gap-1 rounded-md bg-success-subtle px-1.5 py-0.5 text-[10.5px] font-medium text-success">
                    <Brain className="size-3 shrink-0" />
                    {t("memory.proposalSaved")}
                  </div>
                </div>
              ) : null}
              {!msg.isStreaming && (
                <div
                  className={cn(
                    "absolute right-3 -top-2.5 z-10 flex items-center gap-0.5 rounded-md border border-border-subtle bg-surface-0 px-0.5 py-0.5 shadow-sm transition-opacity",
                    reactionPickerId === msg.id
                      ? "pointer-events-auto opacity-100"
                      : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
                  )}
                >
                  <Popover
                    open={reactionPickerId === msg.id}
                    onOpenChange={(open) => setReactionPickerId(open ? msg.id : null)}
                  >
                    <Tooltip>
                      <PopoverAnchor asChild>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openPicker(msg.id)}
                            onMouseEnter={() => openPicker(msg.id)}
                            onMouseLeave={scheduleClose}
                          >
                            <Smile className="size-3.5" />
                          </Button>
                        </TooltipTrigger>
                      </PopoverAnchor>
                      <TooltipContent side="top">{t("chat.tooltipReact")}</TooltipContent>
                    </Tooltip>
                    <PopoverContent
                      align="end"
                      side="top"
                      sideOffset={6}
                      className="w-auto p-0"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                    >
                      <EmojiPicker
                        onSelect={(emoji) => {
                          toggleReaction(msg, emoji);
                          setReactionPickerId(null);
                          cancelClose();
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {!derivedTopic && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleStartTopic(msg.id)}
                        >
                          <MessageSquarePlus className="size-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">{t("chat.tooltipStartTopic")}</TooltipContent>
                    </Tooltip>
                  )}
                  {!isIssue && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleConvertToIssue(msg.id)}
                          className={mentionsAgent ? "text-brand-primary" : undefined}
                        >
                          <CircleDot className="size-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {mentionsAgent ? t("chat.tooltipConvertIssue") : t("chat.tooltipMarkIssue")}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleQuote(msg)}
                      >
                        <Quote className="size-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">{t("chat.tooltipQuote")}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleSaveToMemory(msg)}
                        className={isSavedToMemory ? "text-success" : undefined}
                        aria-pressed={isSavedToMemory}
                      >
                        {isSavedToMemory ? (
                          <Check className="size-3.5" />
                        ) : (
                          <Brain className="size-3.5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isSavedToMemory
                        ? t("chat.tooltipSavedToMemory")
                        : t("chat.tooltipSaveToMemory")}
                    </TooltipContent>
                  </Tooltip>
                  {isOwnMessage && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleRequestRecall(msg.id)}
                          className="text-text-muted hover:text-destructive"
                        >
                          <Undo2 className="size-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">{t("chat.tooltipRecall")}</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
      <ContentDetailOverlay block={expandedBlock} onClose={closeExpanded} />
      <ConfirmDialog
        open={recallTargetId !== null}
        onOpenChange={(open) => {
          if (!open) setRecallTargetId(null);
        }}
        title={t("chat.confirmRecallTitle")}
        description={t("chat.confirmRecallDesc")}
        confirmLabel={t("chat.confirmRecallAction")}
        cancelLabel={t("common.cancel")}
        confirmVariant="destructive"
        onConfirm={handleConfirmRecall}
      />
    </div>
  );
}
