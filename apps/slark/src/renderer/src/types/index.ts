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

export type ConnectorService = "figma" | "linear" | "notion" | "slack" | "github" | "gmail";

export interface Connector {
  service: ConnectorService;
  name: string;
  connected: boolean;
}

export type RoutineTriggerKind = "schedule" | "api" | "connector";

export interface RoutineTrigger {
  kind: RoutineTriggerKind;
  cron?: string;
  connectorService?: ConnectorService;
  connectorEvent?: string;
  connectorTarget?: string;
}

export interface RoutineRun {
  id: string;
  startedAt: number;
  completedAt?: number;
  kind: "scheduled" | "manual";
  status: "running" | "success" | "error";
  messageId?: string;
}

export interface Routine {
  id: string;
  channelId: string;
  name: string;
  description: string;
  agentId: string | null;
  trigger: RoutineTrigger;
  status: "active" | "paused" | "error";
  lastRunAt?: number;
  nextRunAt?: number;
  runs?: RoutineRun[];
  createdBy: string;
  createdAt: number;
}

/**
 * A task that the user asked an agent to do in a DM conversation. Created when
 * the user sends a message in an agent DM; transitions through running → success/error
 * as the agent produces its reply. Surfaces alongside RoutineRun entries in the
 * agent-DM "Session" panel.
 */
export interface ChatTaskSession {
  id: string;
  channelId: string;
  agentId: string;
  title: string;
  status: "running" | "success" | "error";
  startedAt: number;
  completedAt?: number;
  /** Message id of the user's ask. */
  sourceMessageId?: string;
  /** Message id of the agent's reply where the work landed. */
  replyMessageId?: string;
}

export type MemoryKind = "fact" | "decision" | "preference" | "context";
export type MemorySource = "agent" | "user";
export type MemoryMethod = "explicit" | "keyword" | "agent_auto" | "seed";

export interface Memory {
  id: string;
  channelId: string;
  kind: MemoryKind;
  content: string;
  source: MemorySource;
  authorId: string;
  method: MemoryMethod;
  sourceMessageId?: string;
  sourceTopicId?: string;
  createdAt: number;
  updatedAt: number;
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
  avatar?: string;
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
      type: "approval";
      id: string;
      title: string;
      description?: string;
      status: "pending" | "approved" | "rejected" | "responded";
      options?: { id: string; label: string; tone?: "primary" | "danger" | "neutral" }[];
      response?: { choiceId?: string; label?: string; text?: string };
    };

export interface QuotedMessage {
  /** Original message id, used for jump-to-source. */
  messageId: string;
  /** Snapshot of the original sender name (so display still works if the source changes). */
  senderName: string;
  /** Truncated snapshot of the original content. */
  content: string;
}

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
  system?: {
    kind: "join";
    members: MemberRef[];
  };
  derivedTopicId?: string;
  /** Reply-to / quoted message snapshot. */
  quoted?: QuotedMessage;
  /** Marks the message as recalled (withdrawn) by its sender. */
  recalled?: boolean;
  /** Timestamp at which the message was recalled. */
  recalledAt?: number;
}

export interface Reaction {
  emoji: string;
  users: string[];
}

export type IssueStatus = "todo" | "in_progress" | "in_review" | "blocked" | "done";

export interface IssueMeta {
  status: IssueStatus;
  assignee?: MemberRef;
  labels?: string[];
  createdAt: number;
}

export interface Topic {
  id: string;
  rootChannelId: string;
  rootMessageId: string;
  title: string;
  createdAt: number;
  participants: MemberRef[];
  issue?: IssueMeta;
}
