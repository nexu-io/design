import { Button, cn } from "@nexu-design/ui-web";
import { Paperclip, Send } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { useT } from "@/i18n";
import { getRandomAgentResponse } from "@/mock/data";
import { useAgentsStore } from "@/stores/agents";
import { useChatStore } from "@/stores/chat";
import { useTopicsStore } from "@/stores/topics";
import type { Channel, MemberRef, Message } from "@/types";
import { MentionPicker } from "./MentionPicker";

interface MessageInputProps {
  channelId: string;
  isDmWithAgent: boolean;
  channel: Channel;
  /** When provided, the input posts to the given topic instead of the channel. */
  topicId?: string;
}

const MIN_HEIGHT = 36;
const MAX_HEIGHT = 150;

export function MessageInput({
  channelId,
  isDmWithAgent,
  channel,
  topicId,
}: MessageInputProps): React.ReactElement {
  const t = useT();
  const [text, setText] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addChannelMessage = useChatStore((s) => s.addMessage);
  const updateChannelMessage = useChatStore((s) => s.updateMessage);
  const addTopicMessage = useTopicsStore((s) => s.addTopicMessage);
  const updateTopicMessage = useTopicsStore((s) => s.updateTopicMessage);
  const pendingDraft = useChatStore((s) => s.pendingDraft);
  const setPendingDraft = useChatStore((s) => s.setPendingDraft);
  const allAgents = useAgentsStore((s) => s.agents);

  // Mention pool = channel members + all workspace agents (user-created ones always available).
  const mentionPool: MemberRef[] = (() => {
    const seen = new Set<string>();
    const out: MemberRef[] = [];
    for (const m of channel.members) {
      const key = `${m.kind}:${m.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(m);
    }
    for (const a of allAgents) {
      const key = `agent:${a.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ kind: "agent", id: a.id });
    }
    return out;
  })();

  const addMessage = useCallback(
    (msg: Message): void => {
      if (topicId) addTopicMessage(topicId, msg);
      else addChannelMessage(channelId, msg);
    },
    [topicId, addTopicMessage, addChannelMessage, channelId],
  );

  const updateMessage = useCallback(
    (msgId: string, updates: Partial<Message>): void => {
      if (topicId) updateTopicMessage(topicId, msgId, updates);
      else updateChannelMessage(channelId, msgId, updates);
    },
    [topicId, updateTopicMessage, updateChannelMessage, channelId],
  );

  useEffect(() => {
    if (topicId) return;
    if (pendingDraft) {
      setText(pendingDraft);
      setPendingDraft(null);
      textareaRef.current?.focus();
    }
  }, [pendingDraft, setPendingDraft, topicId]);

  const adjustHeight = useCallback((textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.max(MIN_HEIGHT, Math.min(textarea.scrollHeight, MAX_HEIGHT))}px`;
  }, []);

  useLayoutEffect(() => {
    adjustHeight(textareaRef.current);
  }, [adjustHeight]);

  const simulateAgentReply = useCallback(
    (agentRef: MemberRef) => {
      const fullContent = getRandomAgentResponse();
      const msgId = `msg-${Date.now()}-agent`;
      const tokens = fullContent.split(/(?<=\s)|(?=\s)/);

      setTimeout(() => {
        addMessage({
          id: msgId,
          channelId,
          sender: agentRef,
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
          updateMessage(msgId, {
            content: tokens.slice(0, idx).join(""),
          });
          if (idx >= tokens.length) {
            updateMessage(msgId, { isStreaming: false });
          } else {
            setTimeout(tick, 25 + Math.random() * 35);
          }
        };
        setTimeout(tick, 80);
      }, 400);
    },
    [channelId, addMessage, updateMessage],
  );

  const handleSend = (): void => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const mentionedAgents: MemberRef[] = [];
    const mentionPattern = /@(\w+)/g;
    let match = mentionPattern.exec(trimmed);
    while (match) {
      const mentionName = match[1]?.toLowerCase();
      const agent = mentionName
        ? allAgents.find((a) => a.name.toLowerCase() === mentionName)
        : undefined;
      if (agent) {
        mentionedAgents.push({ kind: "agent", id: agent.id });
      }
      match = mentionPattern.exec(trimmed);
    }

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      channelId,
      sender: { kind: "user", id: "u-1" },
      content: trimmed,
      mentions: mentionedAgents,
      reactions: [],
      createdAt: Date.now(),
    };
    addMessage(userMsg);
    setText("");
    setShowMentions(false);

    if (!topicId && isDmWithAgent) {
      const agentMember = channel.members.find((m) => m.kind === "agent");
      if (agentMember) simulateAgentReply(agentMember);
    } else if (mentionedAgents.length > 0) {
      for (const ref of mentionedAgents) {
        simulateAgentReply(ref);
      }
    }

    adjustHeight(textareaRef.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const val = e.target.value;
    setText(val);

    const textarea = e.target;
    adjustHeight(textarea);
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = val.slice(0, cursorPos);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);
    if (atMatch) {
      setShowMentions(true);
      setMentionQuery(atMatch[1]);
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (_ref: MemberRef, name: string): void => {
    const cursorPos = textareaRef.current?.selectionStart ?? text.length;
    const textBeforeCursor = text.slice(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf("@");
    const before = text.slice(0, atIndex);
    const after = text.slice(cursorPos);
    setText(`${before}@${name} ${after}`);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  const hasText = text.trim().length > 0;

  return (
    <div className="relative px-4 pb-4">
      <div
        className={cn(
          "transition-all duration-200 ease-out",
          showMentions
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none",
        )}
      >
        {showMentions && (
          <MentionPicker
            members={mentionPool}
            query={mentionQuery}
            onSelect={handleMentionSelect}
            onClose={() => setShowMentions(false)}
          />
        )}
      </div>

      <div
        className={cn(
          "flex items-center gap-1 rounded-lg border bg-surface-0 px-2 py-1 transition-colors",
          isFocused ? "border-accent ring-2 ring-accent/20" : "border-input",
        )}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={
            topicId
              ? t("chat.replyInTopic")
              : channel.type === "dm"
                ? t("chat.messagePerson", { name: channel.name })
                : t("chat.messageChannel")
          }
          rows={1}
          className="flex-1 resize-none bg-transparent px-1.5 py-1.5 text-[13px] leading-[1.5] text-text-primary placeholder:text-text-muted focus:outline-none"
        />
        <div className="flex shrink-0 items-center gap-0.5">
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Attach" title="Attach">
            <Paperclip className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleSend}
            disabled={!hasText}
            aria-label="Send"
            className={cn(hasText && "text-brand-primary hover:text-brand-primary")}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
