export type MemberRef = { kind: "user"; id: string } | { kind: "agent"; id: string };

export interface Repository {
  id: string;
  url: string;
  name: string;
  description: string;
  addedAt: number;
}

export interface Workspace {
  id: string;
  name: string;
  avatar?: string;
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "online" | "away" | "dnd" | "offline";
  role: "owner" | "member";
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  description: string;
  systemPrompt: string;
  status: "online" | "offline" | "busy";
  skills: Skill[];
  runtimeId: string | null;
  templateId: string | null;
  createdBy: string;
  createdAt: number;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  avatar: string;
  defaultPrompt: string;
  defaultSkills: string[];
  category: "development" | "ops" | "general";
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: "bundled" | "custom";
  config: Record<string, unknown>;
}

export interface Runtime {
  id: string;
  name: string;
  type: "claude-code" | "cursor" | "opencode" | "hermes" | "codex" | "gemini-cli";
  status: "connected" | "disconnected" | "error";
  version?: string;
  config: Record<string, unknown>;
  ownerId: string;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: "channel" | "dm";
  members: MemberRef[];
  lastMessageAt: number;
  unreadCount: number;
  createdAt: number;
}

export type ContentBlock =
  | { type: "image"; url: string; alt?: string }
  | {
      type: "gallery";
      images: { url: string; alt?: string }[];
    }
  | {
      type: "video";
      url?: string;
      thumbnail: string;
      duration: string;
      title: string;
      size?: number;
    }
  | {
      type: "voice";
      duration: string;
      transcript?: string;
      waveform?: number[];
    }
  | { type: "file"; name: string; size: number; url: string; mimeType?: string }
  | { type: "code"; code: string; language?: string; filename?: string }
  | {
      type: "action";
      title: string;
      description?: string;
      status: "running" | "success" | "failed";
      tool?: string;
    }
  | {
      type: "tool-result";
      tool: string;
      input?: string;
      output: string;
      status: "success" | "failed";
    }
  | {
      type: "diff";
      filename: string;
      content: string;
      additions: number;
      deletions: number;
    }
  | {
      type: "approval";
      id: string;
      title: string;
      description?: string;
      status: "pending" | "approved" | "rejected";
    }
  | {
      type: "progress";
      title: string;
      current: number;
      total: number;
      steps?: { label: string; status: "done" | "active" | "pending" }[];
    }
  | {
      /**
       * Agent work-run: a single collapsible module that wraps a sequence of
       * work artifacts (code, diffs, actions, tool results, progress) produced
       * by one agent as it executes a task. Default render shows only the
       * last/current step; earlier steps collapse behind a "Show N earlier
       * steps" toggle so the chat stays quiet. Approval / review blocks are
       * intentionally NOT allowed inside a run — they need their own card
       * outside this container so they still interrupt the reader.
       */
      type: "agent-run";
      id: string;
      steps: AgentRunStep[];
    }
  | {
      type: "topic";
      id: string;
      title: string;
      author: string;
      status?: "active" | "needs-review" | "blocked" | "done" | "archived";
      lastActivity: string;
      replies: number;
      participants: string[];
      preview?: string;
      assignee?: { name: string; isAgent?: boolean; accent?: string };
      /**
       * Conversation under this topic — the reply thread that will be
       * surfaced in the right-side topic detail panel (deferred to a later
       * release on `feature/chat-tabs-and-topic-panel`). Kept on the type
       * today so mock data stays valid and the feature branch merges
       * cleanly. The shape is pre-baked for mocks: `createdAtLabel` is
       * already the display string ("2 min ago") instead of a timestamp,
       * since this mock data doesn't drive any time-sensitive logic.
       */
      thread?: TopicThreadMessage[];
    };

/**
 * One item inside an `agent-run` block. Each step wraps a work artifact
 * (code / diff / action / tool-result / progress) and optionally a short
 * description rendered above it — typically the lead-in sentence the agent
 * would otherwise say in chat ("On it…", "Wiring it into the billing client…").
 * We intentionally narrow the block union here so callers can't smuggle
 * approval or topic cards inside a run; those belong at the message level.
 */
export interface AgentRunStep {
  id: string;
  description?: string;
  block: Extract<
    ContentBlock,
    | { type: "code" }
    | { type: "diff" }
    | { type: "action" }
    | { type: "tool-result" }
    | { type: "progress" }
  >;
}

export interface TopicThreadMessage {
  id: string;
  author: string;
  initials: string;
  isAgent?: boolean;
  accent?: string;
  createdAtLabel: string;
  text?: string;
  image?: { url: string; alt?: string; width?: number; height?: number };
  link?: { url: string; title: string; description?: string; host?: string };
}

/*
 * User-message lifecycle (agent replies use `isStreaming` instead).
 * Historical messages loaded from mock data intentionally leave this
 * field undefined — treat `undefined` as "sent" when rendering.
 */
export type MessageDeliveryStatus = "sending" | "sent" | "failed";

export interface Message {
  id: string;
  channelId: string;
  sender: MemberRef;
  content: string;
  blocks?: ContentBlock[];
  mentions: MemberRef[];
  reactions: Reaction[];
  createdAt: number;
  isStreaming?: boolean;
  deliveryStatus?: MessageDeliveryStatus;
  system?: {
    kind: "join";
    members: MemberRef[];
  };
}

export interface Reaction {
  emoji: string;
  users: string[];
}
