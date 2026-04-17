import { TitleBarSpacer } from "@/components/layout/WindowChrome";
import { getSlarkIntroResponse, mockChannels, mockMessages, resolveRef } from "@/mock/data";
import { useAgentsStore } from "@/stores/agents";
import { useChatStore } from "@/stores/chat";
import { useWorkspaceStore } from "@/stores/workspace";
import { Badge } from "@nexu-design/ui-web";
import { Bot, Hash, MessageSquare } from "lucide-react";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

export function ChatView(): React.ReactElement {
  const { channelId } = useParams();
  const channels = useChatStore((s) => s.channels);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const welcomeFired = useRef(false);
  const loadedChannels = useRef(new Set<string>());

  useEffect(() => {
    if (!channelId) return;
    if (useChatStore.getState().activeChannelId !== channelId) {
      useChatStore.getState().setActiveChannel(channelId);
    }
    const skipMock =
      channelId === "ch-welcome" && !!useWorkspaceStore.getState().pendingWelcomeAgentId;
    if (!loadedChannels.current.has(channelId) && mockMessages[channelId] && !skipMock) {
      loadedChannels.current.add(channelId);
      for (const msg of mockMessages[channelId]) {
        addMessage(channelId, msg);
      }
    }
  }, [channelId, addMessage]);

  useEffect(() => {
    if (welcomeFired.current || channelId !== "ch-welcome") return;
    const pendingAgentId = useWorkspaceStore.getState().pendingWelcomeAgentId;
    if (!pendingAgentId) return;

    const timer = setTimeout(() => {
      if (welcomeFired.current) return;
      welcomeFired.current = true;
      loadedChannels.current.add("ch-welcome");
      useWorkspaceStore.getState().setPendingWelcomeAgent(null);

      const agent = useAgentsStore.getState().agents.find((a) => a.id === pendingAgentId);
      if (!agent) return;

      const fullContent = getSlarkIntroResponse(agent.name, agent.description);
      const replyId = `msg-onboard-reply-${Date.now()}`;
      const tokens = fullContent.split(/(?<=\s)|(?=\s)/);

      addMessage("ch-welcome", {
        id: replyId,
        channelId: "ch-welcome",
        sender: { kind: "agent", id: agent.id },
        content: "",
        mentions: [],
        reactions: [],
        createdAt: Date.now(),
        isStreaming: true,
      });

      let idx = 0;
      const tick = (): void => {
        const chunk = Math.floor(Math.random() * 2) + 1;
        idx = Math.min(idx + chunk, tokens.length);
        updateMessage("ch-welcome", replyId, {
          content: tokens.slice(0, idx).join(""),
        });
        if (idx >= tokens.length) {
          updateMessage("ch-welcome", replyId, { isStreaming: false });
        } else {
          setTimeout(tick, 25 + Math.random() * 35);
        }
      };
      setTimeout(tick, 80);
    }, 800);

    return () => clearTimeout(timer);
  }, [channelId, addMessage, updateMessage]);

  if (!channelId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <MessageSquare className="h-10 w-10" />
          <p className="text-lg font-medium">Select a channel to start chatting</p>
        </div>
      </div>
    );
  }

  const channel =
    channels.find((c) => c.id === channelId) ?? mockChannels.find((c) => c.id === channelId);
  if (!channel) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Channel not found
      </div>
    );
  }

  const isDmWithAgent = channel.type === "dm" && channel.members.some((m) => m.kind === "agent");
  const otherMember =
    channel.type === "dm" ? channel.members.find((m) => m.id !== "u-1") : undefined;
  const otherResolved = otherMember ? resolveRef(otherMember) : undefined;

  return (
    <div className="flex h-full flex-col">
      <TitleBarSpacer />
      <div className="flex items-center gap-2 px-4 h-12 border-b border-border shrink-0">
        {channel.type === "channel" ? (
          <Hash className="h-4 w-4 text-text-tertiary" />
        ) : otherResolved?.isAgent ? (
          <Bot className="h-4 w-4 text-slark-agent" />
        ) : null}
        <h2 className="text-sm font-semibold text-text-primary">
          {channel.type === "dm" ? (otherResolved?.name ?? channel.name) : channel.name}
        </h2>
        {channel.description && (
          <span className="ml-2 truncate text-xs text-text-secondary">{channel.description}</span>
        )}
        {channel.type === "dm" && otherResolved?.isAgent ? (
          <Badge variant="accent" size="xs" className="ml-auto">
            Agent
          </Badge>
        ) : null}
        {channel.type === "channel" && (
          <Badge variant="outline" size="xs" className="ml-auto">
            {channel.members.length} members
          </Badge>
        )}
      </div>
      <MessageList channelId={channelId} channel={channel} />
      <MessageInput channelId={channelId} isDmWithAgent={isDmWithAgent} channel={channel} />
    </div>
  );
}
