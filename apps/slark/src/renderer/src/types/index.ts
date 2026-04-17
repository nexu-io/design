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
    };

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
}

export interface Reaction {
  emoji: string;
  users: string[];
}
