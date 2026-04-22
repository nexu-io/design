import { Button, cn } from "@nexu-design/ui-web";
import { ArrowUp, Paperclip, Square } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { getRandomAgentResponse, mockAgents } from "@/mock/data";
import { useChatStore } from "@/stores/chat";
import type { Channel, MemberRef, Message } from "@/types";
import { MentionPicker } from "./MentionPicker";

interface MessageInputProps {
  channelId: string;
  isDmWithAgent: boolean;
  channel: Channel;
}

/*
 * Match the line-box so the placeholder appears vertically centered at rest.
 * 13px text × 1.5 line-height ≈ 20px; doubled 8px vertical padding = 36px
 * total, which becomes the textarea's collapsed height without any extra
 * space above or below the caret.
 */
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
  const sendMessage = useChatStore((s) => s.sendMessage);
  const pendingDraft = useChatStore((s) => s.pendingDraft);
  const setPendingDraft = useChatStore((s) => s.setPendingDraft);

  /*
   * Any in-flight agent reply in this channel flips the composer button
   * from "send" to "stop" (Cursor-style). Selecting on the derived boolean
   * avoids re-rendering the composer on every token tick — we only care
   * about the transition true→false.
   */
  const isStreaming = useChatStore((s) => (s.messages[channelId] ?? []).some((m) => m.isStreaming));

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
  }, [adjustHeight]);

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
          /*
           * Cooperative cancellation: the "stop" button flips this message's
           * isStreaming to false externally. Each tick re-reads the store
           * and bails early if the flag has flipped, so further tokens
           * stop being appended.
           */
          const current = useChatStore.getState().messages[channelId]?.find((m) => m.id === msgId);
          if (!current?.isStreaming) return;

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
    let match = mentionPattern.exec(trimmed);
    while (match) {
      const mentionName = match[1]?.toLowerCase();
      const agent = mentionName
        ? mockAgents.find((a) => a.name.toLowerCase() === mentionName)
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

    /*
     * Kick off the simulated delivery. Agent replies are deferred until
     * `onSent` fires so a failed send doesn't leave the agent awkwardly
     * responding to a message the UI is simultaneously marking as
     * undelivered. On `onFailed` we stay quiet — the retry affordance on
     * the failed bubble is the single place to re-trigger delivery.
     */
    sendMessage(channelId, userMsg, {
      onSent: () => {
        if (isDmWithAgent) {
          const agentMember = channel.members.find((m) => m.kind === "agent");
          if (agentMember) simulateAgentReply(agentMember);
        } else if (mentionedAgents.length > 0) {
          for (const ref of mentionedAgents) {
            simulateAgentReply(ref);
          }
        }
      },
    });
    setText("");
    setShowMentions(false);

    adjustHeight(textareaRef.current);
  };

  const handleStop = (): void => {
    // Flip every streaming message in this channel to done; each token-tick
    // worker will notice on its next iteration and exit (see `tick` above).
    const messages = useChatStore.getState().messages[channelId] ?? [];
    for (const msg of messages) {
      if (msg.isStreaming) {
        updateMessage(channelId, msg.id, { isStreaming: false });
      }
    }
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
  const sendEnabled = hasText || isStreaming;
  const placeholder =
    channel.type === "dm" ? `Message ${channel.name}` : `Message #${channel.name}`;

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
          "flex items-center gap-2 rounded-lg border bg-surface-0 px-2 py-1 transition-colors",
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
          placeholder={placeholder}
          rows={1}
          /*
           * py-2 matches the 20px line-box so the placeholder sits visually
           * centered in a 36px collapsed composer. Earlier py-1.5 made the
           * placeholder float above center because the line-box was shorter
           * than the min-height. Left/right stay at px-1.5 for a subtle
           * inset against the border.
           */
          className="flex-1 resize-none bg-transparent px-1.5 py-2 text-[13px] leading-[1.5] text-text-primary placeholder:text-text-muted/50 focus:outline-none"
        />
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Attach" title="Attach">
            <Paperclip className="size-4" />
          </Button>
          {/*
           * Send / Stop button — Cursor-style single affordance that flips
           * icon + handler based on whether an agent reply is currently
           * streaming. Three visual states:
           *   - disabled (no text, nothing streaming): surface-3 fill, muted
           *     arrow — reads as "nothing to send".
           *   - enabled (has text):              accent (near-black) fill, white arrow up.
           *   - streaming:                       accent fill, white stop square.
           * All three use the same circular 28px footprint so the composer
           * baseline never shifts when the state changes.
           */}
          <button
            type="button"
            onClick={isStreaming ? handleStop : handleSend}
            disabled={!sendEnabled}
            aria-label={isStreaming ? "Stop generating" : "Send"}
            title={isStreaming ? "Stop generating" : "Send"}
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
              /* Near-black primary fill — matches Button's `default` variant.
                 Reserve the teal `--accent` for links / focus, never primary CTA. */
              sendEnabled
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-surface-3 text-text-muted cursor-not-allowed",
            )}
          >
            {isStreaming ? (
              <Square className="size-3 fill-current" strokeWidth={0} />
            ) : (
              <ArrowUp className="size-4" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
