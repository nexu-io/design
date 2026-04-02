import { useCallback, useMemo, useState } from "react";

/* ── Reward Channel Config ── */

export type RewardGroup = "daily" | "opensource" | "social";

/**
 * How the user shares on this channel:
 *  - 'link'  → open a URL in browser (GitHub, Reddit, LinkedIn)
 *  - 'tweet' → open X intent URL with pre-filled text
 *  - 'image' → download a share card image, user posts it manually (WeChat, Xiaohongshu, Jike)
 */
export type ShareMode = "link" | "tweet" | "image";

/**
 * Claim cadence:
 *  - undefined → one-time (permanent, e.g. GitHub Star)
 *  - 'daily'  → once per calendar day
 *  - 'weekly' → once per calendar week (resets every Monday)
 */
export type RepeatMode = "daily" | "weekly";

export interface RewardChannel {
  id: string;
  group: RewardGroup;
  icon: string;
  reward: number;
  shareMode: ShareMode;
  url?: string;
  requiresScreenshot: boolean;
  repeatable?: RepeatMode;
}

const GITHUB_URL = "https://github.com/refly-ai/nexu";
const X_SHARE_URL = `https://x.com/intent/tweet?text=${encodeURIComponent("Just discovered nexu — the simplest open-source openclaw desktop app. Bridge your Agent to WeChat, Feishu, Slack & Discord in one click. Try it free → https://github.com/refly-ai/nexu")}`;
const REDDIT_SHARE_URL = `https://www.reddit.com/submit?url=${encodeURIComponent("https://github.com/refly-ai/nexu")}&title=${encodeURIComponent("nexu — open-source openclaw desktop app for WeChat, Feishu, Slack & Discord")}`;
const LINKEDIN_SHARE_URL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://github.com/refly-ai/nexu")}`;
const FACEBOOK_SHARE_URL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://github.com/refly-ai/nexu")}`;
const WHATSAPP_SHARE_TEXT =
  "Just discovered nexu — open-source openclaw desktop for WeChat, Feishu, Slack & Discord. Try it free → https://github.com/refly-ai/nexu";
const WHATSAPP_SHARE_URL = `https://wa.me/?text=${encodeURIComponent(WHATSAPP_SHARE_TEXT)}`;

export const DAILY_CHECKIN_BONUS = 100;

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

/** Channels that appear in the task list (excludes daily check-in) */
const TASK_CHANNELS = REWARD_CHANNELS.filter((c) => c.repeatable !== "daily");

/** Max one-time + weekly reward per cycle (if all tasks completed once) */
export const TOTAL_REWARD_AVAILABLE = TASK_CHANNELS.reduce((s, c) => s + c.reward, 0);

const STORAGE_DAILY_LAST = "nexu_daily_checkin_last";
const STORAGE_DAILY_TOTAL = "nexu_daily_checkin_total";

/* ── Storage helpers ── */

function storageKey(channelId: string) {
  return `nexu_reward_${channelId}`;
}
function weeklyStorageKey(channelId: string) {
  return `nexu_reward_weekly_${channelId}`;
}

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}
function writeFlag(key: string) {
  try {
    localStorage.setItem(key, "1");
  } catch {
    /* noop */
  }
}

function localDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Days until next calendar Monday (local). Used for weekly reward cooldown copy (1–7).
 * If today is Monday, returns 7 (next week’s window).
 */
export function daysUntilNextMondayLocal(): number {
  const day = new Date().getDay();
  if (day === 1) return 7;
  if (day === 0) return 1;
  return 8 - day;
}

/** ISO week number (Mon=start). Used to detect weekly reset. */
function currentWeekKey(): string {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((d.getTime() - jan1.getTime()) / 86400000) + 1;
  const weekNum = Math.ceil((dayOfYear + jan1.getDay()) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function readDailyCheckin(): { checkedInToday: boolean; cumulativeBonus: number } {
  const today = localDateString();
  let last = "";
  let cumulative = 0;
  try {
    last = localStorage.getItem(STORAGE_DAILY_LAST) || "";
    cumulative = Number.parseFloat(localStorage.getItem(STORAGE_DAILY_TOTAL) || "0") || 0;
  } catch {
    /* noop */
  }
  return { checkedInToday: last === today, cumulativeBonus: cumulative };
}

function readAllClaimed(): Set<string> {
  const set = new Set<string>();
  const week = currentWeekKey();

  for (const ch of REWARD_CHANNELS) {
    if (ch.repeatable === "daily") continue;

    if (ch.repeatable === "weekly") {
      try {
        const stored = localStorage.getItem(weeklyStorageKey(ch.id));
        if (stored === week) set.add(ch.id);
      } catch {
        /* noop */
      }
    } else {
      if (readFlag(storageKey(ch.id))) set.add(ch.id);
    }
  }
  return set;
}

/* ── Budget State ── */

export type BudgetStatus = "healthy" | "warning" | "depleted";

export interface BudgetState {
  total: number;
  used: number;
  remaining: number;
  percentage: number;
  resetsInDays: number;
  bonusTotal: number;
  bonusUsed: number;
  bonusRemaining: number;
  bonusExpiresInDays: number;
  status: BudgetStatus;
  starClaimed: boolean;
  shareClaimed: boolean;
  claimedChannels: Set<string>;
  claimChannel: (channelId: string) => void;
  claimDailyCheckIn: () => void;
  totalRewardAvailable: number;
  totalRewardClaimed: number;
  /** One-time task progress (excludes daily) */
  claimedCount: number;
  channelCount: number;
  dailyCheckedInToday: boolean;
  dailyCheckinBonusTotal: number;
  oneTimeRewardClaimed: number;
}

export function useBudget(scenario: "healthy" | "warning" | "depleted" = "healthy"): BudgetState {
  const baseTotal = 2000;

  const defaults: Record<
    typeof scenario,
    { used: number; resetsInDays: number; bonusUsed: number }
  > = {
    healthy: { used: 300, resetsInDays: 5, bonusUsed: 0 },
    warning: { used: 1800, resetsInDays: 2, bonusUsed: 50 },
    depleted: { used: 2000, resetsInDays: 1, bonusUsed: 0 },
  };

  const d = defaults[scenario];

  const [claimedChannels, setClaimedChannels] = useState<Set<string>>(() => readAllClaimed());
  const [dailyState, setDailyState] = useState(() => readDailyCheckin());

  const claimDailyCheckIn = useCallback(() => {
    const today = localDateString();
    setDailyState((prev) => {
      if (prev.checkedInToday) return prev;
      const nextCumulative = prev.cumulativeBonus + DAILY_CHECKIN_BONUS;
      try {
        localStorage.setItem(STORAGE_DAILY_LAST, today);
        localStorage.setItem(STORAGE_DAILY_TOTAL, String(nextCumulative));
      } catch {
        /* noop */
      }
      return { checkedInToday: true, cumulativeBonus: nextCumulative };
    });
  }, []);

  const claimChannel = useCallback(
    (channelId: string) => {
      if (channelId === "daily_checkin") {
        claimDailyCheckIn();
        return;
      }
      const ch = REWARD_CHANNELS.find((c) => c.id === channelId);
      if (!ch) return;

      if (ch.repeatable === "weekly") {
        try {
          localStorage.setItem(weeklyStorageKey(channelId), currentWeekKey());
        } catch {
          /* noop */
        }
      } else {
        writeFlag(storageKey(channelId));
      }
      setClaimedChannels((prev) => new Set([...prev, channelId]));
    },
    [claimDailyCheckIn],
  );

  const taskRewardClaimed = useMemo(
    () => TASK_CHANNELS.reduce((s, ch) => s + (claimedChannels.has(ch.id) ? ch.reward : 0), 0),
    [claimedChannels],
  );

  const bonusTotal = useMemo(
    () => taskRewardClaimed + dailyState.cumulativeBonus,
    [taskRewardClaimed, dailyState.cumulativeBonus],
  );

  const totalRewardClaimed = bonusTotal;
  const claimedCount = useMemo(
    () => TASK_CHANNELS.filter((ch) => claimedChannels.has(ch.id)).length,
    [claimedChannels],
  );
  const channelCount = TASK_CHANNELS.length;

  const bonusRemaining = Math.max(0, bonusTotal - d.bonusUsed);
  const bonusExpiresInDays = bonusTotal > 0 ? 6 : 0;

  const remaining = Math.max(0, baseTotal - d.used);
  const percentage = Math.round((remaining / baseTotal) * 100);

  let status: BudgetStatus = "healthy";
  if (remaining <= 0 && bonusRemaining <= 0) status = "depleted";
  else if (remaining <= 0 && bonusRemaining > 0) status = "warning";
  else if (percentage <= 20) status = "warning";

  return {
    total: baseTotal,
    used: d.used,
    remaining,
    percentage,
    bonusTotal,
    bonusUsed: d.bonusUsed,
    bonusRemaining,
    bonusExpiresInDays,
    resetsInDays: d.resetsInDays,
    status,
    starClaimed: claimedChannels.has("github_star"),
    shareClaimed: claimedChannels.has("x_share"),
    claimedChannels,
    claimChannel,
    claimDailyCheckIn,
    totalRewardAvailable: TOTAL_REWARD_AVAILABLE,
    totalRewardClaimed,
    claimedCount,
    channelCount,
    dailyCheckedInToday: dailyState.checkedInToday,
    dailyCheckinBonusTotal: dailyState.cumulativeBonus,
    oneTimeRewardClaimed: taskRewardClaimed,
  };
}
