import { Button, Popover, PopoverContent, PopoverTrigger, cn } from "@nexu-design/ui-web";
import { ArrowUp, Paperclip, Quote, Smile, Square, X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { useT } from "@/i18n";
import { getRandomAgentResponse } from "@/mock/data";
import { useAgentsStore } from "@/stores/agents";
import { useChatStore } from "@/stores/chat";
import { useMemoriesStore } from "@/stores/memories";
import { useSessionsStore } from "@/stores/sessions";
import { useTopicsStore } from "@/stores/topics";
import type { Channel, MemberRef, Message } from "@/types";
import { EmojiPicker } from "./EmojiPicker";
import { MentionPicker } from "./MentionPicker";

interface MessageInputProps {
  channelId: string;
  isDmWithAgent: boolean;
  channel: Channel;
  /** When provided, the input posts to the given topic instead of the channel. */
  topicId?: string;
}

/*
 * Match the line-box so the placeholder appears vertically centered at rest.
 * 13px text × 1.5 line-height ≈ 20px; doubled 8px vertical padding = 36px
 * total, which becomes the textarea's collapsed height without any extra
 * space above or below the caret.
 */
const MIN_HEIGHT = 36;
const MAX_HEIGHT = 150;

type TriggerMatch = { cleaned: string; kind: "context" | "preference" };

const PREF_KEYWORDS = /(?:以后(?:都)?|默认|默认都|always|from now on)/i;
const REMEMBER_KEYWORDS = /^(?:记住|记一下|请记住|remember)[\s:：,，]*/i;

function detectMemoryTrigger(content: string): TriggerMatch | null {
  const withoutMentions = content.replace(/@[\w-]+/g, "").trim();
  if (!withoutMentions) return null;
  if (REMEMBER_KEYWORDS.test(withoutMentions)) {
    const stripped = withoutMentions.replace(REMEMBER_KEYWORDS, "").trim();
    const body = stripped || withoutMentions;
    const kind = PREF_KEYWORDS.test(body) ? "preference" : "context";
    return { cleaned: body, kind };
  }
  if (PREF_KEYWORDS.test(withoutMentions)) {
    return { cleaned: withoutMentions, kind: "preference" };
  }
  return null;
}

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
  const [emojiOpen, setEmojiOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const savedSelectionRef = useRef<{ start: number; end: number } | null>(null);
  const addChannelMessage = useChatStore((s) => s.addMessage);
  const updateChannelMessage = useChatStore((s) => s.updateMessage);
  const sendChannelMessage = useChatStore((s) => s.sendMessage);
  const addTopicMessage = useTopicsStore((s) => s.addTopicMessage);
  const updateTopicMessage = useTopicsStore((s) => s.updateTopicMessage);
  const pendingDraft = useChatStore((s) => s.pendingDraft);
  const setPendingDraft = useChatStore((s) => s.setPendingDraft);
  const pendingQuoteState = useChatStore((s) => s.pendingQuote);
  const setPendingQuote = useChatStore((s) => s.setPendingQuote);
  const activeQuote =
    pendingQuoteState &&
    pendingQuoteState.channelId === channelId &&
    (pendingQuoteState.topicId ?? null) === (topicId ?? null)
      ? pendingQuoteState.quote
      : null;
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

  /*
   * Any in-flight agent reply in this channel flips the composer button
   * from "send" to "stop" (Cursor-style). Selecting on the derived boolean
   * avoids re-rendering the composer on every token tick — we only care
   * about the transition true→false.
   */
  const isStreaming = useChatStore((s) => (s.messages[channelId] ?? []).some((m) => m.isStreaming));

  useEffect(() => {
    if (topicId) return;
    if (pendingDraft) {
      setText(pendingDraft);
      setPendingDraft(null);
      textareaRef.current?.focus();
    }
  }, [pendingDraft, setPendingDraft, topicId]);

  // Focus the textarea whenever a new quote becomes active for this input.
  // We key off `activeQuote?.messageId` (not `activeQuote`) so refocus only
  // fires when the quoted message actually changes, not on every parent rerender.
  // biome-ignore lint/correctness/useExhaustiveDependencies: messageId is the intended trigger; activeQuote object identity would refocus too eagerly.
  useEffect(() => {
    if (activeQuote) textareaRef.current?.focus();
  }, [activeQuote?.messageId]);

  const cancelQuote = useCallback((): void => {
    setPendingQuote(null);
  }, [setPendingQuote]);

  const adjustHeight = useCallback((textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.max(MIN_HEIGHT, Math.min(textarea.scrollHeight, MAX_HEIGHT))}px`;
  }, []);

  useLayoutEffect(() => {
    adjustHeight(textareaRef.current);
  }, [adjustHeight]);

  const simulateAgentReply = useCallback(
    (agentRef: MemberRef, sessionTaskId?: string) => {
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
        if (sessionTaskId) {
          useSessionsStore.getState().setReplyMessage(sessionTaskId, msgId);
        }

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
          updateMessage(msgId, {
            content: tokens.slice(0, idx).join(""),
          });
          if (idx >= tokens.length) {
            updateMessage(msgId, { isStreaming: false });
            if (sessionTaskId) {
              useSessionsStore.getState().completeTask(sessionTaskId, "success");
            }
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
      quoted: activeQuote ?? undefined,
    };
    const dmAgentMember =
      !topicId && isDmWithAgent ? channel.members.find((m) => m.kind === "agent") : undefined;
    const targetedAgent: MemberRef | undefined = dmAgentMember ?? mentionedAgents[0];

    // Keyword-based memory capture: fires eagerly off the user's message
    // intent, not gated on send-simulation success — if the user typed
    // "remember that…" we want the memory even if the optimistic send
    // later flips to failed.
    if (!topicId && targetedAgent && useMemoriesStore.getState().keywordTriggerEnabled) {
      const trigger = detectMemoryTrigger(trimmed);
      if (trigger) {
        useMemoriesStore.getState().addMemory({
          channelId,
          kind: trigger.kind,
          content: trigger.cleaned,
          source: "user",
          authorId: "u-1",
          method: "keyword",
          sourceMessageId: userMsg.id,
        });
      }
    }

    if (topicId) {
      // Topic-scoped messages bypass the delivery-simulation wrapper
      // (`sendChannelMessage` is channel-only) and post directly through
      // the topics store. Agent replies fire immediately.
      addMessage(userMsg);
      if (mentionedAgents.length > 0) {
        for (const ref of mentionedAgents) simulateAgentReply(ref);
      }
    } else {
      /*
       * Channel path: kick off the simulated delivery. Agent replies —
       * including the DM-agent session bookkeeping — are deferred until
       * `onSent` fires so a failed send doesn't leave the agent awkwardly
       * responding to a message the UI is simultaneously marking as
       * undelivered. On `onFailed` we stay quiet — the retry affordance
       * on the failed bubble is the single place to re-trigger delivery.
       */
      sendChannelMessage(channelId, userMsg, {
        onSent: () => {
          if (dmAgentMember) {
            // Open a Session entry for this ask so it shows up in the
            // agent-DM Session panel.
            const firstLine = trimmed.split(/\n/)[0] ?? trimmed;
            const title = firstLine.length > 100 ? `${firstLine.slice(0, 100)}…` : firstLine;
            const taskId = useSessionsStore.getState().startTask({
              channelId,
              agentId: dmAgentMember.id,
              title,
              sourceMessageId: userMsg.id,
            });
            simulateAgentReply(dmAgentMember, taskId);
          } else if (mentionedAgents.length > 0) {
            for (const ref of mentionedAgents) simulateAgentReply(ref);
          }
        },
      });
    }

    setText("");
    setShowMentions(false);
    if (activeQuote) setPendingQuote(null);
    adjustHeight(textareaRef.current);
  };

  const handleStop = (): void => {
    // Flip every streaming message in this channel to done; each token-tick
    // worker will notice on its next iteration and exit (see `tick` above).
    const messages = useChatStore.getState().messages[channelId] ?? [];
    for (const msg of messages) {
      if (msg.isStreaming) {
        updateMessage(msg.id, { isStreaming: false });
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

  const handleStickerSelect = (url: string): void => {
    const msg: Message = {
      id: `msg-${Date.now()}`,
      channelId,
      sender: { kind: "user", id: "u-1" },
      content: "",
      blocks: [{ type: "image", url, alt: "sticker" }],
      mentions: [],
      reactions: [],
      createdAt: Date.now(),
    };
    addMessage(msg);
    setEmojiOpen(false);
  };

  const handleEmojiSelect = (emoji: string): void => {
    const sel = savedSelectionRef.current;
    const start = sel?.start ?? text.length;
    const end = sel?.end ?? text.length;
    const next = text.slice(0, start) + emoji + text.slice(end);
    setText(next);
    const nextPos = start + emoji.length;
    savedSelectionRef.current = { start: nextPos, end: nextPos };
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(nextPos, nextPos);
      adjustHeight(ta);
    });
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

      {activeQuote ? (
        <div className="mb-1.5 flex items-start gap-2 rounded-md border border-border-subtle bg-surface-2/50 px-2 py-1.5 text-[12px]">
          <Quote className="mt-0.5 size-3.5 shrink-0 text-brand-primary" />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-text-secondary">
              {t("chat.replyingTo", { name: activeQuote.senderName })}
            </div>
            <div className="mt-0.5 line-clamp-2 text-text-muted">
              {activeQuote.content || t("chat.recalledOriginal")}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={cancelQuote}
            aria-label={t("chat.cancelReply")}
            title={t("chat.cancelReply")}
            className="-mr-1 -mt-1 shrink-0"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ) : null}

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
          onBlur={(e) => {
            setIsFocused(false);
            savedSelectionRef.current = {
              start: e.target.selectionStart,
              end: e.target.selectionEnd,
            };
          }}
          placeholder={
            topicId
              ? t("chat.replyInTopic")
              : channel.type === "dm"
                ? t("chat.messagePerson", { name: channel.name })
                : t("chat.messageChannel")
          }
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
        <div className="flex shrink-0 items-center gap-0.5">
          <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Emoji"
                title="Emoji"
                className={cn(emojiOpen && "text-brand-primary")}
              >
                <Smile className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              side="top"
              sideOffset={8}
              className="w-auto p-0"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <EmojiPicker onSelect={handleEmojiSelect} onStickerSelect={handleStickerSelect} />
            </PopoverContent>
          </Popover>
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
