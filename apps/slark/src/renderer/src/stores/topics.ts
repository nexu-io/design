import { create } from "zustand";
import type { IssueMeta, IssueStatus, MemberRef, Message, Topic } from "@/types";

export type TopicViewMode = "drawer" | "main";

interface TopicsState {
  topics: Record<string, Topic>;
  messages: Record<string, Message[]>;
  activeTopicId: string | null;
  activeTopicMode: TopicViewMode;
  readAt: Record<string, number>;
  archived: Record<string, boolean>;

  createTopic: (input: {
    rootChannelId: string;
    rootMessageId: string;
    title: string;
    participants: MemberRef[];
    issue?: IssueMeta;
  }) => string;
  addTopicMessage: (topicId: string, message: Message) => void;
  updateTopicMessage: (topicId: string, messageId: string, updates: Partial<Message>) => void;
  setActiveTopic: (topicId: string | null, mode?: TopicViewMode) => void;
  updateTopic: (topicId: string, updates: Partial<Topic>) => void;
  setIssueMeta: (topicId: string, issue: IssueMeta | undefined) => void;
  setIssueStatus: (topicId: string, status: IssueStatus) => void;
  setIssueAssignee: (topicId: string, agentId: string | undefined) => void;
  markTopicRead: (topicId: string) => void;
  markAllRead: (topicIds: string[]) => void;
  archiveTopics: (topicIds: string[]) => void;
  unarchiveTopic: (topicId: string) => void;
  seedDemoIssues: () => void;
  clearDemoIssues: () => void;
}

const DEMO_ISSUE_PREFIX = "tp-demo-";

type DemoSpeaker = "u1" | "u2" | "u3" | "a1" | "a2";

interface DemoMessageSpec {
  from: DemoSpeaker;
  content: string;
  minutesAgo: number;
}

interface DemoIssueSpec {
  slug: string;
  title: string;
  status: IssueStatus;
  messages: DemoMessageSpec[];
}

const DEMO_ISSUES: DemoIssueSpec[] = [
  {
    slug: "todo-a",
    title: "Empty state copy — sign-in page",
    status: "todo",
    messages: [
      {
        from: "u1",
        content:
          "Current empty state just says \"No account found\" — feels abrupt. Want to rewrite with a softer tone and a clear CTA.",
        minutesAgo: 180,
      },
      {
        from: "a2",
        content:
          "Happy to draft 3 options leaning friendly-professional. Should I reference the onboarding illustration style?",
        minutesAgo: 170,
      },
    ],
  },
  {
    slug: "todo-b",
    title: "Add keyboard shortcut cheat sheet",
    status: "todo",
    messages: [
      {
        from: "u2",
        content:
          "Power users keep asking for a ⌘/ overlay. Let's scope it — list existing shortcuts, group by surface, and add a search box.",
        minutesAgo: 240,
      },
      {
        from: "u1",
        content: "👍 — @Coder can you enumerate current bindings from the keybindings registry?",
        minutesAgo: 232,
      },
    ],
  },
  {
    slug: "wip-a",
    title: "Refactor routing layer to react-router v7",
    status: "in_progress",
    messages: [
      {
        from: "u1",
        content:
          "Branch `refactor/router-v7` is up. Migrated `/chat`, `/agents`, `/settings`. `/onboarding` flow still on the old API.",
        minutesAgo: 95,
      },
      {
        from: "a1",
        content:
          "Running a sweep for deprecated `useHistory` usages. 4 remaining — I'll open small PRs stacked on your branch.",
        minutesAgo: 80,
      },
      {
        from: "u1",
        content: "Perfect. Target for review: EOD tomorrow.",
        minutesAgo: 72,
      },
    ],
  },
  {
    slug: "wip-b",
    title: "Webhook retry policy — exponential backoff",
    status: "in_progress",
    messages: [
      {
        from: "a1",
        content:
          "Implemented `withRetry(fn, { max: 5, base: 250 })` with ±20% jitter. Unit tests cover ceiling + jitter bounds.",
        minutesAgo: 140,
      },
      {
        from: "u3",
        content:
          "Nice. Make sure we log attempt count + last error on final failure — ops needs that for the runbook.",
        minutesAgo: 125,
      },
      {
        from: "a1",
        content: "On it. Adding structured log fields now.",
        minutesAgo: 118,
      },
    ],
  },
  {
    slug: "review-a",
    title: "Chart tooltip — hover affordance polish",
    status: "in_review",
    messages: [
      {
        from: "u2",
        content:
          "PR #482 up. Added a 120ms delay before showing and a subtle scale-in. Also fixed the flicker on mobile tap.",
        minutesAgo: 60,
      },
      {
        from: "a2",
        content:
          "Visual review: delay feels good. One nit — the arrow tail on left-edge charts clips slightly. Screenshot attached in the PR.",
        minutesAgo: 48,
      },
      {
        from: "u1",
        content: "Approving once the clip is fixed.",
        minutesAgo: 32,
      },
    ],
  },
  {
    slug: "review-b",
    title: "Topic drawer — right rail layout tweaks",
    status: "in_review",
    messages: [
      {
        from: "u1",
        content:
          "Right panel now collapses to 40px rail with icons only. Tried 48px first — felt too heavy next to the drawer.",
        minutesAgo: 110,
      },
      {
        from: "u3",
        content:
          "Love it. One question — on a narrow window, should the panel auto-collapse? Right now it just overflows.",
        minutesAgo: 92,
      },
      {
        from: "u1",
        content: "Good catch. Adding a container-query threshold at 1200px.",
        minutesAgo: 70,
      },
    ],
  },
  {
    slug: "blocked-a",
    title: "Safari IndexedDB quota regression",
    status: "blocked",
    messages: [
      {
        from: "u2",
        content:
          "Safari 17.1 throws QuotaExceededError on a dry-run migration at ~48MB. Chrome and Firefox both fine at 200MB+.",
        minutesAgo: 420,
      },
      {
        from: "a1",
        content:
          "Confirmed on a MBP M2. Chunking at 4MB still trips it on cold start. Looks like a Safari-specific accounting bug.",
        minutesAgo: 360,
      },
      {
        from: "u1",
        content:
          "Filing with Apple's Feedback Assistant. Parking this issue until we hear back or 17.2 ships.",
        minutesAgo: 300,
      },
    ],
  },
  {
    slug: "blocked-b",
    title: "OAuth callback — third-party cookie fallout",
    status: "blocked",
    messages: [
      {
        from: "u3",
        content:
          "Post-Chrome-120 3P cookies rollout, our callback loses session on first redirect. Happens ~30% of the time.",
        minutesAgo: 520,
      },
      {
        from: "a1",
        content:
          "We need to move the session exchange to a first-party domain. Requires DNS + cert work from infra.",
        minutesAgo: 480,
      },
      {
        from: "u3",
        content: "Ticket filed with infra — waiting on cert issuance. ETA next week.",
        minutesAgo: 400,
      },
    ],
  },
  {
    slug: "done-a",
    title: "Auth rotation — 24h cutover complete",
    status: "done",
    messages: [
      {
        from: "u1",
        content:
          "All services rotated. Ephemeral tokens now mandatory for internal RPC. Old static tokens revoked at 02:00 UTC.",
        minutesAgo: 1440,
      },
      {
        from: "a1",
        content:
          "Monitoring dashboards look clean — no auth-related 5xx spikes in the last 12h. Closing.",
        minutesAgo: 1200,
      },
    ],
  },
  {
    slug: "done-b",
    title: "Release notes — v2.4 published",
    status: "done",
    messages: [
      {
        from: "u2",
        content:
          "Notes published to the changelog + announcement in #welcome. Highlights: topic drawer, retry policy, Safari fixes (partial).",
        minutesAgo: 2880,
      },
      {
        from: "u1",
        content: "🚀",
        minutesAgo: 2820,
      },
    ],
  },
];

function randomId(): string {
  return `tp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const useTopicsStore = create<TopicsState>((set) => ({
  topics: {},
  messages: {},
  activeTopicId: null,
  activeTopicMode: "drawer",
  readAt: {},
  archived: {},

  createTopic: ({ rootChannelId, rootMessageId, title, participants, issue }) => {
    const id = randomId();
    set((s) => ({
      topics: {
        ...s.topics,
        [id]: {
          id,
          rootChannelId,
          rootMessageId,
          title,
          createdAt: Date.now(),
          participants,
          issue,
        },
      },
      messages: { ...s.messages, [id]: [] },
    }));
    return id;
  },

  addTopicMessage: (topicId, message) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [topicId]: [...(s.messages[topicId] ?? []), message],
      },
    })),

  updateTopicMessage: (topicId, messageId, updates) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [topicId]: (s.messages[topicId] ?? []).map((m) =>
          m.id === messageId ? { ...m, ...updates } : m,
        ),
      },
    })),

  setActiveTopic: (topicId, mode) =>
    set(() => ({
      activeTopicId: topicId,
      activeTopicMode: topicId ? (mode ?? "drawer") : "drawer",
    })),

  updateTopic: (topicId, updates) =>
    set((s) =>
      s.topics[topicId]
        ? { topics: { ...s.topics, [topicId]: { ...s.topics[topicId], ...updates } } }
        : s,
    ),

  setIssueMeta: (topicId, issue) =>
    set((s) =>
      s.topics[topicId]
        ? { topics: { ...s.topics, [topicId]: { ...s.topics[topicId], issue } } }
        : s,
    ),

  setIssueStatus: (topicId, status) =>
    set((s) => {
      const topic = s.topics[topicId];
      if (!topic?.issue) return s;
      const nextIssue: IssueMeta = { ...topic.issue, status };
      return { topics: { ...s.topics, [topicId]: { ...topic, issue: nextIssue } } };
    }),

  setIssueAssignee: (topicId, agentId) =>
    set((s) => {
      const topic = s.topics[topicId];
      if (!topic?.issue) return s;
      const nextIssue: IssueMeta = { ...topic.issue, assigneeAgentId: agentId };
      return { topics: { ...s.topics, [topicId]: { ...topic, issue: nextIssue } } };
    }),

  markTopicRead: (topicId) =>
    set((s) => ({ readAt: { ...s.readAt, [topicId]: Date.now() } })),

  markAllRead: (topicIds) =>
    set((s) => {
      const now = Date.now();
      const next = { ...s.readAt };
      for (const id of topicIds) next[id] = now;
      return { readAt: next };
    }),

  archiveTopics: (topicIds) =>
    set((s) => {
      const next = { ...s.archived };
      for (const id of topicIds) next[id] = true;
      return { archived: next };
    }),

  unarchiveTopic: (topicId) =>
    set((s) => {
      if (!s.archived[topicId]) return s;
      const next = { ...s.archived };
      delete next[topicId];
      return { archived: next };
    }),

  seedDemoIssues: () =>
    set((s) => {
      const now = Date.now();
      const speakerMap: Record<DemoSpeaker, MemberRef> = {
        u1: { kind: "user", id: "u-1" },
        u2: { kind: "user", id: "u-2" },
        u3: { kind: "user", id: "u-3" },
        a1: { kind: "agent", id: "a-1" },
        a2: { kind: "agent", id: "a-2" },
      };
      const nextTopics = { ...s.topics };
      const nextMessages = { ...s.messages };
      DEMO_ISSUES.forEach((demo, idx) => {
        const id = `${DEMO_ISSUE_PREFIX}${demo.slug}`;
        const topicCreatedAt = now - (DEMO_ISSUES.length - idx) * 60_000;
        // Collect unique participants from the scripted dialogue.
        const seen = new Set<string>();
        const participants: MemberRef[] = [];
        for (const m of demo.messages) {
          const ref = speakerMap[m.from];
          const key = `${ref.kind}:${ref.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            participants.push(ref);
          }
        }
        nextTopics[id] = {
          id,
          rootChannelId: "ch-showcase",
          rootMessageId: "sc-1",
          title: demo.title,
          createdAt: topicCreatedAt,
          participants,
          issue: {
            status: demo.status,
            assigneeAgentId: "a-1",
            createdAt: topicCreatedAt,
          },
        };
        nextMessages[id] = demo.messages.map((m, mIdx) => ({
          id: `${id}-m${mIdx + 1}`,
          channelId: id,
          sender: speakerMap[m.from],
          content: m.content,
          mentions: [],
          reactions: [],
          createdAt: now - m.minutesAgo * 60_000,
        }));
      });
      return { topics: nextTopics, messages: nextMessages };
    }),

  clearDemoIssues: () =>
    set((s) => {
      const nextTopics = { ...s.topics };
      const nextMessages = { ...s.messages };
      const nextReadAt = { ...s.readAt };
      const nextArchived = { ...s.archived };
      for (const key of Object.keys(nextTopics)) {
        if (key.startsWith(DEMO_ISSUE_PREFIX)) {
          delete nextTopics[key];
          delete nextMessages[key];
          delete nextReadAt[key];
          delete nextArchived[key];
        }
      }
      return {
        topics: nextTopics,
        messages: nextMessages,
        readAt: nextReadAt,
        archived: nextArchived,
      };
    }),
}));
