import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AtSign, Bot, FolderOpen, Globe, MessageSquare, Sparkles, Users } from "lucide-react";
import { EmptyState, Tabs, TabsContent, TabsList, TabsTrigger } from "@nexu-design/ui-web";

import { useT } from "@/i18n";
import { useChatStore } from "@/stores/chat";
import { useWorkspaceStore } from "@/stores/workspace";
import { useAgentsStore } from "@/stores/agents";
import { mockMessages, mockChannels, resolveRef, getNexuIntroResponse } from "@/mock/data";
import { WindowChrome } from "@/components/layout/WindowChrome";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { AddMembersDialog } from "./AddMembersDialog";

export function ChatView(): React.ReactElement {
  const t = useT();
  const { channelId } = useParams();
  const channels = useChatStore((s) => s.channels);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const welcomeFired = useRef(false);
  const loadedChannels = useRef(new Set<string>());
  const [addMembersOpen, setAddMembersOpen] = useState(false);

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
  const otherMember =
    channel.type === "dm" ? channel.members.find((m) => m.id !== "u-1") : undefined;
  const otherResolved = otherMember ? resolveRef(otherMember) : undefined;

  // DMs don't carry a roster / files / artifacts story the same way a channel does, so
  // we keep the old single-pane layout for them and only show tabs for channels.
  const showTabs = channel.type === "channel";

  // Title-row content is reused by both the tabbed (channel) and DM layouts.
  // - Hover fill uses surface-2 (neutral) — never bg-accent, which maps to teal
  //   in Tailwind's color vars and would flood the row with brand color on hover.
  // - Channels show a members chip (Users icon + count) inline right after the
  //   title; it opens the add-members dialog. Descriptions are not rendered in
  //   the header — if a channel needs description context, surface it elsewhere.
  const headerRow = (
    <>
      <button
        type="button"
        className="no-drag flex items-center gap-1.5 rounded-md px-1.5 py-1 -ml-1.5 hover:bg-surface-2 transition-colors text-left min-w-0"
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

      {channel.type === "channel" && (
        <button
          type="button"
          onClick={() => setAddMembersOpen(true)}
          className="no-drag flex items-center gap-1 h-6 px-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors shrink-0"
          title="Members"
        >
          <Users className="h-3.5 w-3.5" />
          <span>{channel.members.length}</span>
        </button>
      )}
    </>
  );

  return (
    <div className="flex h-full flex-col bg-surface-1">
      {showTabs ? (
        <Tabs defaultValue="messages" className="flex h-full min-h-0 flex-col">
          {/*
            Unified chat header: title row + tabs row share one border-b block,
            with no divider between them. Reads as a single chrome surface
            instead of two stacked bars.

            Tab labels are intentionally hardcoded English regardless of locale,
            following the same convention as sidebar section headers
            (CHANNELS / PINNED). Tabs are for orientation, not user content.
          */}
          <div className="border-b border-border px-4 pt-2 pb-1.5">
            <WindowChrome className="flex h-9 items-center gap-2">{headerRow}</WindowChrome>

            <TabsList className="mt-0.5 h-7 rounded-md p-0.5">
              <TabsTrigger
                value="messages"
                className="h-6 gap-1 px-2 text-[12px] font-semibold leading-none"
              >
                <MessageSquare className="size-3" />
                Messages
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="h-6 gap-1 px-2 text-[12px] font-semibold leading-none"
              >
                <FolderOpen className="size-3" />
                Files
              </TabsTrigger>
              <TabsTrigger
                value="artifacts"
                className="h-6 gap-1 px-2 text-[12px] font-semibold leading-none"
              >
                <Sparkles className="size-3" />
                Artifacts
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="messages" className="mt-0 flex min-h-0 flex-1 flex-col">
            <MessageList channelId={channelId} channel={channel} />
            <MessageInput channelId={channelId} isDmWithAgent={isDmWithAgent} channel={channel} />
          </TabsContent>

          <TabsContent value="files" className="mt-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[800px] px-4 pt-6 pb-6 sm:px-6 sm:pb-8">
              <EmptyState
                icon={<FolderOpen className="size-10" />}
                title="Files"
                description="No files shared in this channel yet."
              />
            </div>
          </TabsContent>

          <TabsContent value="artifacts" className="mt-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[800px] px-4 pt-6 pb-6 sm:px-6 sm:pb-8">
              <EmptyState
                icon={<Sparkles className="size-10" />}
                title="Artifacts"
                description="Agent artifacts will appear here as your team runs workflows."
              />
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <WindowChrome className="flex h-[52px] items-center gap-2 border-b border-border px-4 pt-2">
            {headerRow}
          </WindowChrome>
          <MessageList channelId={channelId} channel={channel} />
          <MessageInput channelId={channelId} isDmWithAgent={isDmWithAgent} channel={channel} />
        </>
      )}

      {channel.type === "channel" && (
        <AddMembersDialog
          open={addMembersOpen}
          onOpenChange={setAddMembersOpen}
          channel={channel}
        />
      )}
    </div>
  );
}
