import { create } from "zustand";
import type { Channel, Message } from "@/types";

/*
 * Pure-visual send-state demo. Real send latency varies wildly so we
 * just roll a uniform value in the ~600–1300ms window — fast enough to
 * feel snappy, slow enough that the `sending` affordance is visible.
 */
const SIMULATED_DELIVERY_MIN_MS = 600;
const SIMULATED_DELIVERY_SPREAD_MS = 700;
/* Random failure rate for the demo. 35% is noticeably higher than
 * a real chat app would tolerate, but keeps the "failed" treatment
 * easy to stumble into during a 30-second walkthrough. */
const SIMULATED_FAILURE_RATE = 0.35;
/* Deterministic demo triggers: any message whose content includes
 * `/fail` is guaranteed to fail (so reviewers can reproduce the
 * error state on demand), and `/ok` is guaranteed to succeed (useful
 * when recording happy-path videos). Case-insensitive substring match
 * so it works whether the token sits mid-sentence or on its own. */
const FORCE_FAIL_TOKEN = "/fail";
const FORCE_OK_TOKEN = "/ok";

interface SimulateOptions {
  onSent?: () => void;
  onFailed?: () => void;
}

interface ChatState {
  channels: Channel[];
  activeChannelId: string | null;
  messages: Record<string, Message[]>;
  pendingDraft: string | null;
  pinnedIds: string[];

  setChannels: (channels: Channel[]) => void;
  setActiveChannel: (id: string) => void;
  addChannel: (channel: Channel) => void;
  updateChannel: (channelId: string, updates: Partial<Channel>) => void;
  removeChannel: (channelId: string) => void;
  addMessage: (channelId: string, message: Message) => void;
  updateMessage: (channelId: string, messageId: string, updates: Partial<Message>) => void;
  removeMessage: (channelId: string, messageId: string) => void;
  /**
   * Optimistically insert a user message with `deliveryStatus: "sending"` and
   * schedule a random transition to `sent` / `failed` for the demo. The
   * supplied `onSent` / `onFailed` callbacks fire after the transition, which
   * is where callers should kick off downstream work (e.g. agent replies).
   */
  sendMessage: (
    channelId: string,
    message: Omit<Message, "deliveryStatus">,
    options?: SimulateOptions,
  ) => void;
  /** Re-roll delivery for a previously failed message. Uses the same demo
   *  simulator as the initial send, so retries can themselves fail. */
  retryMessage: (channelId: string, messageId: string, options?: SimulateOptions) => void;
  setPendingDraft: (text: string | null) => void;
  togglePin: (channelId: string) => void;
}

function simulateDelivery(
  channelId: string,
  messageId: string,
  options?: SimulateOptions,
): void {
  const latency = SIMULATED_DELIVERY_MIN_MS + Math.random() * SIMULATED_DELIVERY_SPREAD_MS;
  setTimeout(() => {
    /*
     * Re-read the message from the store at resolution time: it may
     * have been deleted while in-flight (user hit "Delete" on the
     * sending bubble), or — more importantly — the content lets us
     * honour the `/fail` / `/ok` demo triggers so retries of the same
     * message stay deterministic.
     */
    const current = (useChatStore.getState().messages[channelId] ?? []).find(
      (m) => m.id === messageId,
    );
    if (!current) return;
    const content = current.content.toLowerCase();
    const forceFail = content.includes(FORCE_FAIL_TOKEN);
    const forceOk = content.includes(FORCE_OK_TOKEN);
    const failed = forceFail || (!forceOk && Math.random() < SIMULATED_FAILURE_RATE);
    useChatStore
      .getState()
      .updateMessage(channelId, messageId, { deliveryStatus: failed ? "failed" : "sent" });
    if (failed) options?.onFailed?.();
    else options?.onSent?.();
  }, latency);
}

export const useChatStore = create<ChatState>((set) => ({
  channels: [],
  activeChannelId: null,
  messages: {},
  pendingDraft: null,
  pinnedIds: [],

  setChannels: (channels) => set({ channels }),

  setActiveChannel: (id) => set({ activeChannelId: id }),

  addChannel: (channel) => set((s) => ({ channels: [...s.channels, channel] })),

  updateChannel: (channelId, updates) =>
    set((s) => ({
      channels: s.channels.map((c) => (c.id === channelId ? { ...c, ...updates } : c)),
    })),

  removeChannel: (channelId) =>
    set((s) => ({
      channels: s.channels.filter((c) => c.id !== channelId),
      activeChannelId: s.activeChannelId === channelId ? null : s.activeChannelId,
      messages: Object.fromEntries(Object.entries(s.messages).filter(([id]) => id !== channelId)),
    })),

  addMessage: (channelId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [...(state.messages[channelId] ?? []), message],
      },
    })),

  updateMessage: (channelId, messageId, updates) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: (state.messages[channelId] ?? []).map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg,
        ),
      },
    })),

  removeMessage: (channelId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: (state.messages[channelId] ?? []).filter((msg) => msg.id !== messageId),
      },
    })),

  sendMessage: (channelId, message, options) => {
    const optimistic: Message = { ...message, deliveryStatus: "sending" };
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [...(state.messages[channelId] ?? []), optimistic],
      },
    }));
    simulateDelivery(channelId, message.id, options);
  },

  retryMessage: (channelId, messageId, options) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: (state.messages[channelId] ?? []).map((msg) =>
          msg.id === messageId ? { ...msg, deliveryStatus: "sending" } : msg,
        ),
      },
    }));
    simulateDelivery(channelId, messageId, options);
  },

  setPendingDraft: (text) => set({ pendingDraft: text }),

  togglePin: (channelId) =>
    set((s) => ({
      pinnedIds: s.pinnedIds.includes(channelId)
        ? s.pinnedIds.filter((id) => id !== channelId)
        : [...s.pinnedIds, channelId],
    })),
}));
