import { useCallback, useMemo, useState } from "react";

export type RewardGroup = "daily" | "opensource" | "social";
export type RewardRepeatable = "daily" | "weekly";
export type RewardShareMode = "link" | "image" | "tweet";

export interface RewardChannel {
  id: string;
  group: RewardGroup;
  icon: string;
  reward: number;
  shareMode: RewardShareMode;
  url?: string;
  requiresScreenshot: boolean;
  repeatable?: RewardRepeatable;
}

export const DAILY_CHECKIN_BONUS = 100;

const STORAGE_KEY = "nexu_reward_claims";
const GITHUB_URL = "https://github.com/refly-ai/nexu";
const X_SHARE_URL = `https://x.com/intent/tweet?text=${encodeURIComponent("Just discovered nexu — the simplest open-source openclaw desktop app. Bridge your Agent to WeChat, Feishu, Slack & Discord in one click. Try it free → https://github.com/refly-ai/nexu")}`;
const REDDIT_SHARE_URL = `https://www.reddit.com/submit?url=${encodeURIComponent("https://github.com/refly-ai/nexu")}&title=${encodeURIComponent("nexu — open-source openclaw desktop app for WeChat, Feishu, Slack & Discord")}`;
const LINKEDIN_SHARE_URL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://github.com/refly-ai/nexu")}`;
const FACEBOOK_SHARE_URL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://github.com/refly-ai/nexu")}`;
const WHATSAPP_SHARE_URL = `https://wa.me/?text=${encodeURIComponent("Just discovered nexu — open-source openclaw desktop for WeChat, Feishu, Slack & Discord. Try it free → https://github.com/refly-ai/nexu")}`;

export const REWARD_CHANNELS: RewardChannel[] = [
  {
    id: "daily_checkin",
    group: "daily",
    icon: "calendar",
    reward: DAILY_CHECKIN_BONUS,
    shareMode: "link",
    requiresScreenshot: false,
    repeatable: "daily",
  },
  {
    id: "github_star",
    group: "opensource",
    icon: "github",
    reward: 300,
    shareMode: "link",
    url: GITHUB_URL,
    requiresScreenshot: false,
  },
  {
    id: "x_share",
    group: "social",
    icon: "x",
    reward: 200,
    shareMode: "tweet",
    url: X_SHARE_URL,
    requiresScreenshot: false,
    repeatable: "weekly",
  },
  {
    id: "reddit",
    group: "social",
    icon: "reddit",
    reward: 200,
    shareMode: "link",
    url: REDDIT_SHARE_URL,
    requiresScreenshot: false,
    repeatable: "weekly",
  },
  {
    id: "xiaohongshu",
    group: "social",
    icon: "xiaohongshu",
    reward: 200,
    shareMode: "image",
    requiresScreenshot: true,
    repeatable: "weekly",
  },
  {
    id: "lingying",
    group: "social",
    icon: "lingying",
    reward: 200,
    shareMode: "link",
    url: LINKEDIN_SHARE_URL,
    requiresScreenshot: false,
    repeatable: "weekly",
  },
  {
    id: "jike",
    group: "social",
    icon: "jike",
    reward: 200,
    shareMode: "image",
    requiresScreenshot: true,
    repeatable: "weekly",
  },
  {
    id: "wechat",
    group: "social",
    icon: "wechat",
    reward: 100,
    shareMode: "image",
    requiresScreenshot: true,
    repeatable: "weekly",
  },
  {
    id: "feishu",
    group: "social",
    icon: "feishu",
    reward: 100,
    shareMode: "image",
    requiresScreenshot: true,
    repeatable: "weekly",
  },
  {
    id: "facebook",
    group: "social",
    icon: "facebook",
    reward: 200,
    shareMode: "link",
    url: FACEBOOK_SHARE_URL,
    requiresScreenshot: false,
    repeatable: "weekly",
  },
  {
    id: "whatsapp",
    group: "social",
    icon: "whatsapp",
    reward: 200,
    shareMode: "link",
    url: WHATSAPP_SHARE_URL,
    requiresScreenshot: false,
    repeatable: "weekly",
  },
];

type ClaimsState = Record<string, string>;

function localDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function currentWeekKey(): string {
  const now = new Date();
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function daysUntilNextMondayLocal(): number {
  const day = new Date().getDay();
  if (day === 1) return 7;
  if (day === 0) return 1;
  return 8 - day;
}

function readStoredClaims(): ClaimsState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ClaimsState;
    return parsed ?? {};
  } catch {
    return {};
  }
}

function writeStoredClaims(claims: ClaimsState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
}

function isClaimValid(channel: RewardChannel, stamp: string | undefined): boolean {
  if (!stamp) return false;
  if (channel.repeatable === "daily") return stamp === localDateString();
  if (channel.repeatable === "weekly") return stamp === currentWeekKey();
  return stamp === "done";
}

export interface BudgetState {
  total: number;
  used: number;
  remaining: number;
  percentage: number;
  resetsInDays: number;
  bonusTotal: number;
  bonusUsed: number;
  bonusRemaining: number;
  claimedChannels: Set<string>;
  dailyCheckedInToday: boolean;
  totalRewardCredits: number;
  totalRewardTasks: number;
  completedRewardTasks: number;
  claimChannel: (channelId: string) => void;
  canClaimChannel: (channelId: string) => boolean;
}

export function useBudget(scenario: "healthy" | "warning" | "depleted" = "healthy"): BudgetState {
  const [claims, setClaims] = useState<ClaimsState>(() => readStoredClaims());

  const claimChannel = useCallback((channelId: string) => {
    const channel = REWARD_CHANNELS.find((entry) => entry.id === channelId);
    if (!channel) return;

    const nextStamp =
      channel.repeatable === "daily"
        ? localDateString()
        : channel.repeatable === "weekly"
          ? currentWeekKey()
          : "done";

    setClaims((prev) => {
      const next = { ...prev, [channelId]: nextStamp };
      writeStoredClaims(next);
      return next;
    });
  }, []);

  const claimedChannels = useMemo(() => {
    return new Set(
      REWARD_CHANNELS.filter((channel) => isClaimValid(channel, claims[channel.id])).map(
        (channel) => channel.id,
      ),
    );
  }, [claims]);

  const totalRewardCredits = useMemo(
    () =>
      REWARD_CHANNELS.reduce(
        (sum, channel) => sum + (claimedChannels.has(channel.id) ? channel.reward : 0),
        0,
      ),
    [claimedChannels],
  );

  const totalRewardTasks = REWARD_CHANNELS.filter(
    (channel) => channel.id !== "daily_checkin",
  ).length;
  const completedRewardTasks = REWARD_CHANNELS.filter(
    (channel) => channel.id !== "daily_checkin" && claimedChannels.has(channel.id),
  ).length;

  const defaults = {
    healthy: { used: 900, resetsInDays: 6 },
    warning: { used: 1825, resetsInDays: 2 },
    depleted: { used: 2000, resetsInDays: 1 },
  }[scenario];

  const total = 2000;
  const remaining = Math.max(total - defaults.used + totalRewardCredits, 0);
  const percentage = Math.min(((defaults.used - totalRewardCredits) / total) * 100, 100);

  return {
    total,
    used: defaults.used,
    remaining,
    percentage: Math.max(0, percentage),
    resetsInDays: defaults.resetsInDays,
    bonusTotal: totalRewardCredits,
    bonusUsed: 0,
    bonusRemaining: totalRewardCredits,
    claimedChannels,
    dailyCheckedInToday: claimedChannels.has("daily_checkin"),
    totalRewardCredits,
    totalRewardTasks,
    completedRewardTasks,
    claimChannel,
    canClaimChannel: (channelId: string) => {
      const channel = REWARD_CHANNELS.find((entry) => entry.id === channelId);
      if (!channel) return false;
      return !isClaimValid(channel, claims[channelId]);
    },
  };
}
