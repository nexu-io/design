import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { MessageSquare, Bot, UserPlus, Globe, AtSign, CircleDot } from "lucide-react";
import { cn } from "@nexu-design/ui-web";
import { useT } from "@/i18n";
import { useChatStore } from "@/stores/chat";
import { useWorkspaceStore } from "@/stores/workspace";
import { useAgentsStore } from "@/stores/agents";
import { mockMessages, mockChannels, resolveRef, getNexuIntroResponse } from "@/mock/data";
import { WindowChrome } from "@/components/layout/WindowChrome";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { AddMembersDialog } from "./AddMembersDialog";
import { TopicDrawer } from "./TopicDrawer";
import { ChannelIssuesPanel } from "./ChannelIssuesPanel";
import { useTopicsStore } from "@/stores/topics";

type Tab = "chat" | "issues";

export function ChatView(): React.ReactElement {
  const t = useT();
  const { channelId } = useParams();
  const channels = useChatStore((s) => s.channels);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const welcomeFired = useRef(false);
  const loadedChannels = useRef(new Set<string>());
  const [addMembersOpen, setAddMembersOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("chat");
  const topics = useTopicsStore((s) => s.topics);

  const channelIssueCount = useMemo(
    () =>
      Object.values(topics).filter(
        (t) => t.issue && t.issue.status !== "done" && t.rootChannelId === channelId,
      ).length,
    [topics, channelId],
  );

  useEffect(() => {
    setTab("chat");
  }, [channelId]);

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

      const fullContent = getNexuIntroResponse(agent.name, agent.description);
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
          <p className="text-lg font-medium">{t("chat.selectChannel")}</p>
        </div>
      </div>
    );
  }

  const channel =
    channels.find((c) => c.id === channelId) ?? mockChannels.find((c) => c.id === channelId);
  if (!channel) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        {t("chat.channelNotFound")}
      </div>
    );
  }

  const isDmWithAgent = channel.type === "dm" && channel.members.some((m) => m.kind === "agent");
  const isDmBetweenPeople =
    channel.type === "dm" && channel.members.every((m) => m.kind === "user");
  const showIssuesTab = !isDmBetweenPeople;
  const otherMember =
    channel.type === "dm" ? channel.members.find((m) => m.id !== "u-1") : undefined;
  const otherResolved = otherMember ? resolveRef(otherMember) : undefined;
  const activeTopicId = useTopicsStore((s) => s.activeTopicId);
  const activeTopicChannel = useTopicsStore((s) =>
    s.activeTopicId ? s.topics[s.activeTopicId]?.rootChannelId : undefined,
  );
  const showDrawer = !!activeTopicId && activeTopicChannel === channelId;

  return (
    <div className="flex h-full bg-background">
      <div className="flex min-w-0 flex-1 flex-col">
        <WindowChrome className="flex h-[52px] items-center gap-2 border-b border-border px-4 pt-2">
          <button
            type="button"
            className="no-drag flex items-center gap-1.5 rounded-md px-1.5 py-1 -ml-1.5 hover:bg-accent transition-colors text-left min-w-0"
          >
            {channel.type === "channel" ? (
              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : otherResolved?.isAgent ? (
              <Bot className="h-4 w-4 text-nexu-agent shrink-0" />
            ) : otherResolved ? (
              <img src={otherResolved.avatar} alt="" className="h-5 w-5 rounded-full shrink-0" />
            ) : (
              <AtSign className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <h2 className="font-semibold text-[15px] truncate">
              {channel.type === "dm" ? (otherResolved?.name ?? channel.name) : channel.name}
            </h2>
          </button>

          {channel.description && (
            <span className="text-xs text-muted-foreground truncate">{channel.description}</span>
          )}

          {channel.type === "channel" && (
            <button
              type="button"
              onClick={() => setAddMembersOpen(true)}
              className="no-drag ml-auto flex items-center gap-1.5 h-7 px-2 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
              title={t("chat.addPeopleOrAgents")}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>{channel.members.length}</span>
            </button>
          )}
        </WindowChrome>

        {showIssuesTab ? (
          <div className="no-drag flex h-10 shrink-0 items-center gap-0.5 border-b border-border px-2">
            <TabPill
              icon={<MessageSquare className="size-3.5" />}
              label={t("section.chat")}
              active={tab === "chat"}
              activeTint="bg-info-subtle text-info"
              onClick={() => setTab("chat")}
            />
            <TabPill
              icon={<CircleDot className="size-3.5" />}
              label={t("section.issues")}
              active={tab === "issues"}
              activeTint="bg-warning-subtle text-warning"
              count={channelIssueCount}
              onClick={() => setTab("issues")}
            />
          </div>
        ) : null}

        {tab === "chat" || !showIssuesTab ? (
          <>
            <MessageList channelId={channelId} channel={channel} />
            <MessageInput channelId={channelId} isDmWithAgent={isDmWithAgent} channel={channel} />
          </>
        ) : (
          <ChannelIssuesPanel channelId={channelId} />
        )}
        {channel.type === "channel" && (
          <AddMembersDialog
            open={addMembersOpen}
            onOpenChange={setAddMembersOpen}
            channel={channel}
          />
        )}
      </div>
      {showDrawer && <TopicDrawer />}
    </div>
  );
}

interface TabPillProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  activeTint: string;
  count?: number;
  onClick: () => void;
}

function TabPill({ icon, label, active, activeTint, count, onClick }: TabPillProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium transition-colors",
        active
          ? "bg-surface-2/60 text-text-primary"
          : "text-text-muted hover:bg-surface-2/40 hover:text-text-primary",
      )}
    >
      <span
        className={cn(
          "inline-flex size-[18px] items-center justify-center rounded",
          active ? activeTint : "text-text-tertiary",
        )}
      >
        {icon}
      </span>
      <span>{label}</span>
      {count != null && count > 0 ? (
        <span className="rounded-full bg-surface-2 px-1.5 text-[10px] font-semibold tabular-nums text-text-muted">
          {count}
        </span>
      ) : null}
    </button>
  );
}
