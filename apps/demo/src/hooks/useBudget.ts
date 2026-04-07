import { useMemo, useState } from "react";

export type RewardTaskGroup = "daily" | "community" | "social";
export type RewardCadence = "daily" | "weekly" | "once";
export type SharePlatform = "xiaohongshu" | "jike" | "feishu";

export type RewardTask = {
  id: string;
  title: string;
  description: string;
  helper: string;
  credits: number;
  group: RewardTaskGroup;
  cadence: RewardCadence;
  platform?: SharePlatform;
  requiresMaterial?: boolean;
  materialTitle?: string;
  materialBody?: string;
  caption?: string;
};

export type RewardTaskStatus = "available" | "claimed" | "cooldown" | "locked";

export type RewardTaskState = RewardTask & {
  status: RewardTaskStatus;
  cooldownLabel?: string;
  claimedLabel?: string;
};

type RewardClaimState = Record<string, string>;

const ONE_DAY = 1000 * 60 * 60 * 24;

const INITIAL_CLAIMS: RewardClaimState = {
  "github-star": "2026-04-05T09:00:00.000Z",
  "discord-feedback": "2026-04-06T09:00:00.000Z",
  xiaohongshu: "2026-04-05T09:00:00.000Z",
};

export const REWARD_TASKS: RewardTask[] = [
  {
    id: "daily-check-in",
    title: "Daily usage check-in",
    description: "Open your usage dashboard and collect a small daily refill.",
    helper: "Resets every day",
    credits: 100,
    group: "daily",
    cadence: "daily",
  },
  {
    id: "github-star",
    title: "Star nexu on GitHub",
    description: "Support the open-source repo to unlock a one-time bonus.",
    helper: "One-time reward",
    credits: 300,
    group: "community",
    cadence: "once",
  },
  {
    id: "discord-feedback",
    title: "Share a workflow in Discord",
    description: "Post one useful workflow screenshot in the community channel.",
    helper: "One-time reward",
    credits: 250,
    group: "community",
    cadence: "once",
  },
  {
    id: "xiaohongshu",
    title: "Post on 小红书",
    description: "Download the campaign card and publish your setup publicly.",
    helper: "Once per week",
    credits: 500,
    group: "social",
    cadence: "weekly",
    platform: "xiaohongshu",
    requiresMaterial: true,
    materialTitle: "Launch your Agent to 小红书 creators",
    materialBody: "Highlight fast onboarding, premium model access, and referral credits.",
    caption:
      "Just shipped a new nexu workflow — connect your agent to WeChat, Feishu, Slack, and Discord in minutes. https://github.com/refly-ai/nexu",
  },
  {
    id: "jike",
    title: "Post on 即刻",
    description: "Share your favorite automation loop with the Jike maker crowd.",
    helper: "Once per week",
    credits: 350,
    group: "social",
    cadence: "weekly",
    platform: "jike",
    requiresMaterial: true,
    materialTitle: "Show your weekly agent stack",
    materialBody: "Focus on the channels you connected and the credits you earned.",
    caption:
      "Been testing nexu this week — open-source desktop agent bridge for Feishu, Slack, Discord, and more. Worth a look: https://github.com/refly-ai/nexu",
  },
  {
    id: "feishu",
    title: "Share to 飞书",
    description: "Bring the launch card into your team chat and invite collaborators.",
    helper: "Once per week",
    credits: 400,
    group: "social",
    cadence: "weekly",
    platform: "feishu",
    requiresMaterial: true,
    materialTitle: "Invite your team into nexu",
    materialBody: "Use the team-facing card with rollout highlights and reward callouts.",
    caption:
      "We are testing nexu for team workflows — lightweight open-source desktop bridge for Feishu, Slack, Discord, and more. Join the pilot: https://github.com/refly-ai/nexu",
  },
];

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function getDaysSince(timestamp: string, now: Date) {
  const claimedAt = new Date(timestamp);
  return Math.floor((startOfDay(now).getTime() - startOfDay(claimedAt).getTime()) / ONE_DAY);
}

function getWeeklyCooldownLabel(daysSince: number) {
  const daysLeft = Math.max(7 - daysSince, 0);
  if (daysLeft <= 0) return undefined;
  if (daysLeft === 1) return "Available tomorrow";
  return `Available in ${daysLeft} days`;
}

export function useBudget() {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [claims, setClaims] = useState<RewardClaimState>(INITIAL_CLAIMS);

  const tasks = useMemo<RewardTaskState[]>(() => {
    const now = new Date();

    return REWARD_TASKS.map((task) => {
      if (!isSignedIn && task.group === "social") {
        return { ...task, status: "locked" };
      }

      const claimedAt = claims[task.id];
      if (!claimedAt) {
        return { ...task, status: "available" };
      }

      if (task.cadence === "once") {
        return { ...task, status: "claimed", claimedLabel: "Completed" };
      }

      const daysSince = getDaysSince(claimedAt, now);
      if (task.cadence === "daily") {
        return daysSince >= 1
          ? { ...task, status: "available" }
          : { ...task, status: "claimed", claimedLabel: "Claimed today" };
      }

      const cooldownLabel = getWeeklyCooldownLabel(daysSince);
      return cooldownLabel
        ? { ...task, status: "cooldown", cooldownLabel }
        : { ...task, status: "available" };
    });
  }, [claims, isSignedIn]);

  const totalEarned = tasks.reduce((sum, task) => {
    const claimed = task.status === "claimed" || task.status === "cooldown";
    return claimed ? sum + task.credits : sum;
  }, 0);

  const oneTimeTasks = tasks.filter((task) => task.cadence === "once");
  const oneTimeCompleted = oneTimeTasks.filter((task) => task.status === "claimed").length;
  const socialTasks = tasks.filter((task) => task.group === "social");
  const nextWeeklyReward = socialTasks.find((task) => task.status === "available");

  return {
    isSignedIn,
    setIsSignedIn,
    tasks,
    totalEarned,
    oneTimeCompleted,
    oneTimeTotal: oneTimeTasks.length,
    nextWeeklyReward,
    reset() {
      setClaims(INITIAL_CLAIMS);
      setIsSignedIn(true);
    },
    claimTask(taskId: string) {
      setClaims((current) => ({
        ...current,
        [taskId]: new Date().toISOString(),
      }));
    },
  };
}
