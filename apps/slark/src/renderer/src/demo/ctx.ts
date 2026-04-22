import type { NavigateFunction } from "react-router-dom";
import type { Channel, ContentBlock, MemberRef, Message } from "@/types";
import { useChatStore } from "@/stores/chat";
import { useAgentsStore } from "@/stores/agents";
import { useMemoriesStore } from "@/stores/memories";
import { useRoutinesStore } from "@/stores/routines";
import { useRuntimesStore } from "@/stores/runtimes";
import { useTopicsStore } from "@/stores/topics";
import { useWorkspaceStore } from "@/stores/workspace";
import { mockAgents, mockChannels, mockRuntimes } from "@/mock/data";
import { DemoAbortError, useDemoPlayer } from "./player";

/** Per-run context passed to each script. All actions respect the runKey for cancellation. */
export interface ScriptCtx {
  /** Async sleep that throws DemoAbortError if the run is cancelled. */
  wait(ms: number): Promise<void>;
  /** Show a caption (narration) and optionally hold for `holdMs` before returning. */
  say(text: string, holdMs?: number): Promise<void>;
  /** Navigate to a route. */
  go(path: string): void;
  /** Send a message instantly (user-style). */
  send(channelId: string, opts: SendOpts): Message;
  /** Stream a message word-by-word (agent-style). */
  streamReply(channelId: string, opts: SendOpts, fullText: string, cps?: number): Promise<Message>;
  /** Bring store back to a clean "just-onboarded" baseline. */
  resetToAppState(): void;
  /** Bring store back to a clean "pre-onboarded" baseline. */
  resetToWelcome(): void;
  /** Poll the DOM for an element matching a CSS selector. */
  find<T extends HTMLElement = HTMLElement>(
    selector: string,
    opts?: { timeout?: number; root?: ParentNode },
  ): Promise<T>;
  /** Poll the DOM for a clickable element whose visible text contains any of the given strings. */
  findByText<T extends HTMLElement = HTMLElement>(
    text: string | string[],
    opts?: { selector?: string; timeout?: number; root?: ParentNode },
  ): Promise<T>;
  /** Type into an input/textarea one character at a time so React sees each onChange. */
  type(el: HTMLInputElement | HTMLTextAreaElement, text: string, cps?: number): Promise<void>;
  /** Clear the current value of an input/textarea (visible to React). */
  clearInput(el: HTMLInputElement | HTMLTextAreaElement): void;
  /** Click an element (no-op if null). */
  click(el: HTMLElement | null): void;
  /** Press a key on an element (keydown+keyup). Useful for Enter submission. */
  press(el: HTMLElement, key: string): void;
}

export interface SendOpts {
  sender: MemberRef;
  content?: string;
  blocks?: ContentBlock[];
  mentions?: MemberRef[];
}

interface BuildCtxArgs {
  runKey: number;
  navigate: NavigateFunction;
}

export function buildCtx({ runKey, navigate }: BuildCtxArgs): ScriptCtx {
  const isLive = (): boolean => useDemoPlayer.getState().runKey === runKey;
  const assertLive = (): void => {
    if (!isLive()) throw new DemoAbortError();
  };

  const wait = (ms: number): Promise<void> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        if (isLive()) resolve();
        else reject(new DemoAbortError());
      }, ms);
      // Also poll for abort roughly every 120ms so long waits can be cut short.
      const poll = setInterval(() => {
        if (!isLive()) {
          clearTimeout(t);
          clearInterval(poll);
          reject(new DemoAbortError());
        }
      }, 120);
      // Clear the poll when the timeout resolves naturally.
      setTimeout(() => clearInterval(poll), ms + 10);
    });

  const pickVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;
    // Prefer zh-CN female-ish voices (captions are mostly Simplified Chinese).
    const prefer = [
      (v: SpeechSynthesisVoice) => v.lang === "zh-CN" && /Tingting|Meijia|Siri|Huihui/i.test(v.name),
      (v: SpeechSynthesisVoice) => v.lang === "zh-CN",
      (v: SpeechSynthesisVoice) => v.lang.startsWith("zh"),
      () => true,
    ];
    for (const pick of prefer) {
      const v = voices.find(pick);
      if (v) return v;
    }
    return voices[0] ?? null;
  };

  /**
   * Speak a caption and resolve when the utterance finishes (or errors, or is
   * cancelled). If the browser has no SpeechSynthesis, returns a fallback
   * promise that resolves after `fallbackMs` so the demo still paces nicely.
   */
  const speakCaption = (text: string, fallbackMs: number): Promise<void> => {
    // Strip markdown / emoji / step prefixes so the speech sounds natural.
    const spoken = text
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
      .replace(/\*\*/g, "")
      .replace(/[`~]/g, "")
      .replace(/^[①②③④⑤⑥⑦⑧⑨⑩·\s]+/, "")
      .trim();

    const hasTTS = typeof window !== "undefined" && "speechSynthesis" in window;
    if (!hasTTS || !spoken) {
      return new Promise((resolve) => setTimeout(resolve, fallbackMs));
    }

    const tts = window.speechSynthesis;
    tts.cancel();

    return new Promise<void>((resolve) => {
      const utter = new SpeechSynthesisUtterance(spoken);
      const v = pickVoice();
      if (v) utter.voice = v;
      utter.lang = v?.lang ?? "zh-CN";
      utter.rate = 1.05;
      utter.pitch = 1;
      utter.volume = 1;

      let settled = false;
      const settle = (): void => {
        if (settled) return;
        settled = true;
        resolve();
      };
      utter.onend = settle;
      utter.onerror = settle;

      // Chrome sometimes drops an utterance without firing onend; cap at 10s
      // as a hard safety net so the demo never hangs on a stuck utterance.
      const safety = setTimeout(settle, 10_000);
      const origSettle = settle;
      utter.onend = () => {
        clearTimeout(safety);
        origSettle();
      };
      utter.onerror = () => {
        clearTimeout(safety);
        origSettle();
      };

      tts.speak(utter);
    });
  };

  /**
   * Show a caption, speak it, and wait until the TTS finishes before
   * returning. `holdMs` acts as a **minimum** pause after the speech ends so
   * silent moments still breathe. If TTS is unavailable, falls back to a 10s
   * per-caption pace (tunable via `holdMs`).
   */
  const say = async (text: string, holdMs = 400): Promise<void> => {
    assertLive();
    useDemoPlayer.getState().setCaption(text);

    // Race speech-end against abort: if the demo is stopped we bail out.
    const speechDone = speakCaption(text, 10_000);
    const abortWatch = new Promise<void>((_, reject) => {
      const iv = setInterval(() => {
        if (!isLive()) {
          clearInterval(iv);
          reject(new DemoAbortError());
        }
      }, 120);
      void speechDone.finally(() => clearInterval(iv));
    });
    await Promise.race([speechDone, abortWatch]);

    if (holdMs > 0) await wait(holdMs);
  };

  const go = (path: string): void => {
    assertLive();
    navigate(path);
  };

  const send = (channelId: string, opts: SendOpts): Message => {
    assertLive();
    const msg: Message = {
      id: `msg-demo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      channelId,
      sender: opts.sender,
      content: opts.content ?? "",
      blocks: opts.blocks,
      mentions: opts.mentions ?? [],
      reactions: [],
      createdAt: Date.now(),
    };
    useChatStore.getState().addMessage(channelId, msg);
    useChatStore.getState().updateChannel(channelId, { lastMessageAt: Date.now() });
    return msg;
  };

  const streamReply = async (
    channelId: string,
    opts: SendOpts,
    fullText: string,
    cps = 55,
  ): Promise<Message> => {
    assertLive();
    const msg: Message = {
      id: `msg-demo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      channelId,
      sender: opts.sender,
      content: "",
      blocks: opts.blocks,
      mentions: opts.mentions ?? [],
      reactions: [],
      createdAt: Date.now(),
      isStreaming: true,
    };
    useChatStore.getState().addMessage(channelId, msg);

    const tokens = fullText.split(/(?<=\s)|(?=\s)/);
    const msPerToken = Math.max(20, Math.round(1000 / Math.max(cps / 4, 4)));

    let idx = 0;
    while (idx < tokens.length) {
      assertLive();
      const chunk = Math.random() < 0.3 ? 2 : 1;
      idx = Math.min(idx + chunk, tokens.length);
      useChatStore.getState().updateMessage(channelId, msg.id, {
        content: tokens.slice(0, idx).join(""),
      });
      await wait(msPerToken);
    }
    useChatStore.getState().updateMessage(channelId, msg.id, { isStreaming: false });
    useChatStore.getState().updateChannel(channelId, { lastMessageAt: Date.now() });
    return { ...msg, content: fullText, isStreaming: false };
  };

  const clearAllChatState = (): void => {
    useChatStore.setState({
      channels: [],
      messages: {},
      activeChannelId: null,
      pendingDraft: null,
      pendingScrollToMessageId: null,
      pendingQuote: null,
      pinnedIds: [],
      hiddenIds: [],
    });
    useTopicsStore.setState({
      topics: {},
      messages: {},
      activeTopicId: null,
      readAt: {},
      archived: {},
    });
    useMemoriesStore.getState().clearAllMemories();
    useRoutinesStore.setState({ routines: [], selectedRoutineId: null });
  };

  const resetToWelcome = (): void => {
    useWorkspaceStore.getState().reset();
    useRuntimesStore.getState().setRuntimes([]);
    useAgentsStore.setState({ agents: [], selectedAgentId: null });
    clearAllChatState();
  };

  const resetToAppState = (): void => {
    useWorkspaceStore.getState().switchWorkspace("ws-1");
    useWorkspaceStore.getState().completeOnboarding();
    useRuntimesStore.getState().setRuntimes(mockRuntimes);
    useAgentsStore.setState({ agents: mockAgents, selectedAgentId: null });
    clearAllChatState();
    // Re-seed baseline channels so the sidebar isn't empty.
    const baseline: Channel[] = mockChannels.map((c) => ({ ...c, unreadCount: 0 }));
    useChatStore.getState().setChannels(baseline);
    useChatStore.getState().setActiveChannel("ch-welcome");
  };

  // ── DOM helpers ───────────────────────────────────────────────────────────
  // These drive the real UI (typing, clicking) so captions and page actions stay in sync.

  const findWithin = <T extends HTMLElement = HTMLElement>(
    selector: string,
    root: ParentNode = document,
  ): T | null => root.querySelector<T>(selector);

  const find = async <T extends HTMLElement = HTMLElement>(
    selector: string,
    opts: { timeout?: number; root?: ParentNode } = {},
  ): Promise<T> => {
    const timeout = opts.timeout ?? 5000;
    const root = opts.root ?? document;
    const start = Date.now();
    // eslint-disable-next-line no-constant-condition
    while (true) {
      assertLive();
      const el = findWithin<T>(selector, root);
      if (el) return el;
      if (Date.now() - start > timeout) {
        throw new Error(`[demo] find timeout: ${selector}`);
      }
      await wait(80);
    }
  };

  const isVisible = (el: Element): boolean => {
    const rect = (el as HTMLElement).getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;
    const style = window.getComputedStyle(el as HTMLElement);
    return style.visibility !== "hidden" && style.display !== "none";
  };

  const findByText = async <T extends HTMLElement = HTMLElement>(
    text: string | string[],
    opts: { selector?: string; timeout?: number; root?: ParentNode } = {},
  ): Promise<T> => {
    const selector = opts.selector ?? "button, a, [role='button'], [role='tab']";
    const timeout = opts.timeout ?? 5000;
    const root = opts.root ?? document;
    const needles = (Array.isArray(text) ? text : [text]).map((s) => s.trim().toLowerCase());
    const start = Date.now();
    // eslint-disable-next-line no-constant-condition
    while (true) {
      assertLive();
      const nodes = Array.from(root.querySelectorAll<T>(selector));
      const hit = nodes.find((n) => {
        if (!isVisible(n)) return false;
        const haystack = (n.textContent ?? "").trim().toLowerCase();
        return needles.some((needle) => haystack.includes(needle));
      });
      if (hit) return hit;
      if (Date.now() - start > timeout) {
        throw new Error(
          `[demo] findByText timeout: ${JSON.stringify(text)} (selector="${selector}")`,
        );
      }
      await wait(80);
    }
  };

  const setNativeValue = (el: HTMLInputElement | HTMLTextAreaElement, value: string): void => {
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    if (setter) setter.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const type = async (
    el: HTMLInputElement | HTMLTextAreaElement,
    text: string,
    cps = 28,
  ): Promise<void> => {
    assertLive();
    el.focus();
    const delay = Math.max(20, Math.round(1000 / Math.max(cps, 4)));
    let acc = el.value ?? "";
    for (const ch of Array.from(text)) {
      assertLive();
      acc += ch;
      setNativeValue(el, acc);
      await wait(delay);
    }
  };

  const clearInput = (el: HTMLInputElement | HTMLTextAreaElement): void => {
    el.focus();
    setNativeValue(el, "");
  };

  const click = (el: HTMLElement | null): void => {
    if (!el) return;
    assertLive();
    // Radix primitives (Tabs.Trigger, Select, Dialog, Popover…) bind onMouseDown
    // or onPointerDown, not onClick — so `.click()` alone often doesn't activate
    // them. Synthetic PointerEvent dispatch also doesn't auto-fire MouseEvents
    // the way a real user click does, so we dispatch everything explicitly.
    const common = { bubbles: true, cancelable: true, composed: true, button: 0 } as const;
    try {
      el.dispatchEvent(new PointerEvent("pointerdown", { ...common, pointerType: "mouse" }));
    } catch {
      /* older browsers */
    }
    el.dispatchEvent(new MouseEvent("mousedown", common));
    try {
      el.dispatchEvent(new PointerEvent("pointerup", { ...common, pointerType: "mouse" }));
    } catch {
      /* older browsers */
    }
    el.dispatchEvent(new MouseEvent("mouseup", common));
    el.click();
  };

  const press = (el: HTMLElement, key: string): void => {
    assertLive();
    const opts: KeyboardEventInit = { key, bubbles: true, cancelable: true };
    el.dispatchEvent(new KeyboardEvent("keydown", opts));
    el.dispatchEvent(new KeyboardEvent("keyup", opts));
  };

  return {
    wait,
    say,
    go,
    send,
    streamReply,
    resetToAppState,
    resetToWelcome,
    find,
    findByText,
    type,
    clearInput,
    click,
    press,
  };
}
