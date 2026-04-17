import { formatRelativeTime } from "@/hooks/useRelativeTime";
import { resolveRef } from "@/mock/data";
import { useAgentsStore } from "@/stores/agents";
import { useChatStore } from "@/stores/chat";
import type { Channel, ContentBlock } from "@/types";
import { cn } from "@nexu-design/ui-web";
import { Bot, Hash, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ContentBlockRenderer } from "./ContentBlocks";
import { ContentDetailOverlay } from "./ContentDetailOverlay";

const CURRENT_USER_ID = "u-1";

function renderContent(content: string): React.ReactNode {
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*)/g);
  const partCounts = new Map<string, number>();

  return parts.map((part, i) => {
    const occurrence = partCounts.get(part) ?? 0;
    partCounts.set(part, occurrence + 1);
    const key = `${part}-${occurrence}-${i}`;

    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).replace(/^\w+\n/, "");
      return (
        <pre
          key={key}
          className="my-2 rounded-lg bg-black/10 dark:bg-white/10 p-3 text-xs overflow-x-auto"
        >
          <code>{code}</code>
        </pre>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={key} className="rounded bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-xs">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    return <span key={key}>{part}</span>;
  });
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
      <div className="flex flex-col items-center px-6 py-12 max-w-lg mx-auto space-y-3">
        {resolved && (
          <img src={resolved.avatar} alt={resolved.name} className="h-16 w-16 rounded-full" />
        )}
        <h3 className="text-lg font-semibold">{resolved?.name ?? channel.name}</h3>
        <p className="text-sm text-muted-foreground text-center">
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

  const memberAvatars = channel.members.map((m) => resolveRef(m)).filter(Boolean) as {
    name: string;
    avatar: string;
    isAgent: boolean;
  }[];

  const channelAgents = channel.members
    .filter((m) => m.kind === "agent")
    .map((m) => agents.find((a) => a.id === m.id))
    .filter(Boolean);

  const handleQuickAction = (text: string): void => {
    setPendingDraft(text);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col items-center px-6 py-12 max-w-lg mx-auto space-y-8">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-secondary">
            <Hash className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">#{channel.name}</h3>
            {channel.description && (
              <p className="text-sm text-muted-foreground mt-0.5">{channel.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1 mt-2">
            {memberAvatars.slice(0, 8).map((m, i) => (
              <img
                key={`${m.name}-${m.avatar}`}
                src={m.avatar}
                alt={m.name}
                title={m.name}
                className={cn("h-7 w-7 rounded-full border-2 border-background", i > 0 && "-ml-2")}
              />
            ))}
            {memberAvatars.length > 8 && (
              <span className="flex items-center justify-center h-7 w-7 rounded-full bg-secondary text-xs font-medium -ml-2 border-2 border-background">
                +{memberAvatars.length - 8}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{channel.members.length} members</p>
        </div>

        {channelAgents.length > 0 && (
          <div className="w-full space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground px-1">
              <Sparkles className="h-3 w-3" />
              Agents in this channel
            </div>
            <div className="grid gap-2">
              {channelAgents.map((agent) => (
                <div
                  key={agent?.id}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3"
                >
                  <img
                    src={agent?.avatar}
                    alt={agent?.name}
                    className="h-9 w-9 rounded-full shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold">{agent?.name}</span>
                      <span className="flex items-center gap-0.5 text-[10px] font-medium text-slark-agent bg-slark-agent/10 px-1.5 py-0.5 rounded-full">
                        <Bot className="h-2.5 w-2.5" />
                        Agent
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {agent?.description}
                    </p>
                    {agent?.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {agent?.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill.id}
                            className="text-[10px] text-muted-foreground bg-secondary rounded-md px-1.5 py-0.5"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {channelAgents.length > 0 && (
          <div className="w-full space-y-2">
            <p className="text-xs font-medium text-muted-foreground px-1">Try asking</p>
            <div className="flex flex-wrap gap-2">
              {channelAgents.slice(0, 3).map((agent) => {
                const prompts = getQuickPrompts(agent?.name, agent?.templateId);
                return prompts.map((prompt, i) => (
                  <button
                    type="button"
                    key={`${agent?.id}-${i}`}
                    onClick={() => handleQuickAction(prompt)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                  >
                    {prompt}
                  </button>
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
  const bottomRef = useRef<HTMLDivElement>(null);
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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  if (messages.length === 0) {
    if (channel?.type === "dm") {
      return <DMEmptyState channel={channel} />;
    }
    if (channel) {
      return <ChannelEmptyState channel={channel} />;
    }
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.map((msg, idx) => {
        const sender = resolveRef(msg.sender);
        if (!sender) return null;

        const isMe = msg.sender.kind === "user" && msg.sender.id === CURRENT_USER_ID;
        const prevMsg = messages[idx - 1];
        const isSameSender =
          prevMsg && prevMsg.sender.kind === msg.sender.kind && prevMsg.sender.id === msg.sender.id;
        const isConsecutive = isSameSender && msg.createdAt - prevMsg.createdAt < 120000;

        return (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2.5 max-w-[85%]",
              isMe ? "ml-auto flex-row-reverse" : "mr-auto",
              isConsecutive && !isMe && "pl-[42px]",
            )}
          >
            {!isMe &&
              (isConsecutive ? (
                <div className="w-8 shrink-0" />
              ) : (
                <img src={sender.avatar} alt="" className="h-8 w-8 rounded-full shrink-0 mt-1" />
              ))}

            <div className={cn("min-w-0 flex flex-col", isMe ? "items-end" : "items-start")}>
              {!isMe && !isConsecutive && (
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="font-semibold text-xs text-muted-foreground">{sender.name}</span>
                  {sender.isAgent && (
                    <span className="flex items-center gap-0.5 text-[10px] font-medium text-slark-agent bg-slark-agent/10 px-1.5 py-0.5 rounded-full">
                      <Bot className="h-2.5 w-2.5" />
                      Agent
                    </span>
                  )}
                </div>
              )}

              {msg.content && (
                <div
                  className={cn(
                    "relative rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                    isMe
                      ? "bg-slark-primary text-white rounded-tr-sm"
                      : sender.isAgent
                        ? "bg-slark-agent/10 text-foreground rounded-tl-sm"
                        : "bg-secondary text-foreground rounded-tl-sm",
                  )}
                >
                  {renderContent(msg.content)}
                  {msg.isStreaming && (
                    <span className="inline-block w-1.5 h-4 bg-current opacity-60 ml-0.5 animate-pulse align-middle" />
                  )}
                </div>
              )}

              {msg.blocks && msg.blocks.length > 0 && (
                <div className="flex flex-col gap-2 mt-1 max-w-full">
                  {msg.blocks.map((block, bi) => (
                    <ContentBlockRenderer
                      key={`${block.type}-${JSON.stringify(block)}-${bi}`}
                      block={block}
                      isMe={isMe}
                      onApprovalAction={(aid, action) =>
                        handleApproval(msg.id, msg.blocks, aid, action)
                      }
                      onExpand={setExpandedBlock}
                    />
                  ))}
                </div>
              )}

              {msg.reactions.length > 0 && (
                <div className={cn("flex gap-1 mt-1", isMe ? "pr-1" : "pl-1")}>
                  {msg.reactions.map((r) => (
                    <span
                      key={r.emoji}
                      className="flex items-center gap-1 text-xs bg-secondary rounded-full px-2 py-0.5"
                    >
                      {r.emoji} {r.users.length}
                    </span>
                  ))}
                </div>
              )}

              <span
                className={cn(
                  "text-[10px] text-muted-foreground mt-0.5 px-1",
                  isConsecutive && "hidden",
                )}
              >
                {formatRelativeTime(msg.createdAt)}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
      <ContentDetailOverlay block={expandedBlock} onClose={closeExpanded} />
    </div>
  );
}
