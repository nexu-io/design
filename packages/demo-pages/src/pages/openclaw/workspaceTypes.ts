import type { ModelProvider } from "./data";
import type { ToolTag } from "./skillData";

export type RewardType = string | null;

export type SettingsTab = "general" | "providers";

export type View =
  | { type: "home" }
  | { type: "conversations"; channelId?: string }
  | { type: "deployments" }
  | { type: "skills"; tab?: "yours" | "explore"; tag?: ToolTag }
  | { type: "schedule" }
  | { type: "rewards" }
  | { type: "settings"; tab?: SettingsTab; providerId?: ModelProvider };

export function isToolTag(value: string | null): value is ToolTag {
  return (
    value === "office-collab" ||
    value === "file-knowledge" ||
    value === "creative-design" ||
    value === "biz-analysis" ||
    value === "av-generation" ||
    value === "info-content" ||
    value === "dev-tools"
  );
}

export function isSettingsTab(value: string | null): value is SettingsTab {
  return value === "general" || value === "providers";
}

export function isModelProvider(value: string | null): value is ModelProvider {
  return (
    value === "nexu" ||
    value === "anthropic" ||
    value === "openai" ||
    value === "google" ||
    value === "xai" ||
    value === "kimi" ||
    value === "glm" ||
    value === "minimax" ||
    value === "openrouter" ||
    value === "siliconflow" ||
    value === "ppio" ||
    value === "xiaoxiang"
  );
}

export function getInitialWorkspaceView(search: string): View {
  const params = new URLSearchParams(search);
  if (params.get("view") === "skills") {
    const tab = params.get("tab");
    const tag = params.get("tag");
    return {
      type: "skills",
      tab: tab === "explore" ? "explore" : "yours",
      tag: isToolTag(tag) ? tag : undefined,
    };
  }

  if (params.get("view") === "settings") {
    const tab = params.get("tab");
    const provider = params.get("provider");
    return {
      type: "settings",
      tab: isSettingsTab(tab) ? tab : "general",
      providerId: isModelProvider(provider) ? provider : "anthropic",
    };
  }

  return { type: "home" };
}

export function initialsFromEmail(email: string): string {
  if (!email.trim()) return "?";
  const local = email.split("@")[0]?.trim() ?? "";
  if (!local) return "?";
  const parts = local
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  }
  return local.slice(0, 2).toUpperCase();
}
