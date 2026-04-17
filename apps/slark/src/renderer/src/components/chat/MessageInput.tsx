import { useState, useRef, useCallback, useLayoutEffect, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@nexu-design/ui-web";
import { useChatStore } from "@/stores/chat";
import { getRandomAgentResponse, mockAgents } from "@/mock/data";
import { MentionPicker } from "./MentionPicker";
import type { Channel, Message, MemberRef } from "@/types";

interface MessageInputProps {
  channelId: string;
  isDmWithAgent: boolean;
  channel: Channel;
}

const MIN_HEIGHT = 36;
const MAX_HEIGHT = 150;

export function MessageInput({
  channelId,
  isDmWithAgent,
  channel,
}: MessageInputProps): React.ReactElement {
  const [text, setText] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const pendingDraft = useChatStore((s) => s.pendingDraft);
  const setPendingDraft = useChatStore((s) => s.setPendingDraft);

  useEffect(() => {
    if (pendingDraft) {
      setText(pendingDraft);
      setPendingDraft(null);
      textareaRef.current?.focus();
    }
  }, [pendingDraft, setPendingDraft]);

  const adjustHeight = useCallback((textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.max(MIN_HEIGHT, Math.min(textarea.scrollHeight, MAX_HEIGHT))}px`;
  }, []);

  useLayoutEffect(() => {
    adjustHeight(textareaRef.current);
  }, [text, adjustHeight]);

  const simulateAgentReply = useCallback(
    (agentRef: MemberRef) => {
      const fullContent = getRandomAgentResponse();
      const msgId = `msg-${Date.now()}-agent`;
      const tokens = fullContent.split(/(?<=\s)|(?=\s)/);

      setTimeout(() => {
        addMessage(channelId, {
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
          updateMessage(channelId, msgId, {
            content: tokens.slice(0, idx).join(""),
          });
          if (idx >= tokens.length) {
            updateMessage(channelId, msgId, { isStreaming: false });
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
    let match: RegExpExecArray | null = null;
    while ((match = mentionPattern.exec(trimmed)) !== null) {
      const agent = mockAgents.find((a) => a.name.toLowerCase() === match![1].toLowerCase());
      if (agent) {
        mentionedAgents.push({ kind: "agent", id: agent.id });
      }
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
    addMessage(channelId, userMsg);
    setText("");
    setShowMentions(false);

    if (isDmWithAgent) {
      const agentMember = channel.members.find((m) => m.kind === "agent");
      if (agentMember) simulateAgentReply(agentMember);
    } else if (mentionedAgents.length > 0) {
      mentionedAgents.forEach((ref) => simulateAgentReply(ref));
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
            members={channel.members}
            query={mentionQuery}
            onSelect={handleMentionSelect}
            onClose={() => setShowMentions(false)}
          />
        )}
      </div>

      <div
        className={cn(
          "message-input-container flex items-end gap-2 rounded-xl border p-2 transition-all duration-200 ease-out",
          isFocused
            ? "border-ring/50 bg-background shadow-[0_0_0_1px_var(--color-ring)/0.15]"
            : "border-input bg-background",
        )}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={channel.type === "dm" ? `Message ${channel.name}...` : "Message channel..."}
          rows={1}
          className="message-textarea flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none px-2 py-1.5"
        />
        <button
          onClick={handleSend}
          disabled={!hasText}
          className={cn(
            "message-send-btn flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            "transition-all duration-200 ease-out",
            hasText
              ? "bg-foreground text-background hover:bg-foreground/90"
              : "bg-secondary text-muted-foreground",
          )}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
