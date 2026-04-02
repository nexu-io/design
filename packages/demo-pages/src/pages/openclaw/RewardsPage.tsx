import { Badge, Button, PageHeader, StatCard } from "@nexu-design/ui-web";
import { ArrowUpRight, CalendarDays, Check, Coins, Gift, Star } from "lucide-react";

import {
  REWARD_CHANNELS,
  type RewardChannel,
  type RewardGroup,
  daysUntilNextMondayLocal,
  useBudget,
} from "../../hooks/useBudget";
import { useLocale } from "../../hooks/useLocale";

const GROUPS: { key: RewardGroup; labelKey: string }[] = [
  { key: "daily", labelKey: "rewards.group.daily" },
  { key: "opensource", labelKey: "rewards.group.opensource" },
  { key: "social", labelKey: "rewards.group.social" },
];

function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

function actionLabel(t: (key: string) => string, channel: RewardChannel, claimed: boolean) {
  if (claimed) {
    return format(t("rewards.ctaDoneMany"), { n: channel.reward });
  }

  if (channel.id === "daily_checkin") return t("budget.cta.checked");
  if (channel.id === "github_star") return t("budget.cta.goStar");
  if (channel.shareMode === "image") return t("budget.cta.getMaterial");
  return t("budget.cta.post");
}

function RewardsPage() {
  const { t } = useLocale();
  const budget = useBudget("healthy");

  const handleClaim = (channel: RewardChannel) => {
    if (!budget.canClaimChannel(channel.id)) return;
    if (channel.url) window.open(channel.url, "_blank", "noopener,noreferrer");
    budget.claimChannel(channel.id);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8 space-y-6">
        <PageHeader title={t("rewards.title")} description={t("rewards.desc")} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label={t("rewards.creditsShort")}
            value={budget.totalRewardCredits.toLocaleString()}
            icon={Gift}
            tone="accent"
            meta={format(t("rewards.totalCredits"), { n: budget.totalRewardCredits })}
          />
          <StatCard
            label={t("rewards.tasksShort")}
            value={`${budget.completedRewardTasks}/${budget.totalRewardTasks}`}
            icon={Check}
            tone="info"
            meta={format(t("rewards.taskProgress"), {
              a: budget.completedRewardTasks,
              b: budget.totalRewardTasks,
            })}
          />
          <StatCard
            label={t("reward.daily_checkin.name")}
            value={budget.dailyCheckedInToday ? "Done" : "+100"}
            icon={CalendarDays}
            tone="success"
            meta={t("reward.daily_checkin.desc")}
          />
        </div>

        <div className="rounded-2xl border border-border bg-surface-1 p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-accent" />
                <h2 className="text-sm font-semibold text-text-primary">Reward balance</h2>
              </div>
              <p className="mt-1 text-sm text-text-muted">{t("budget.meterRewardsFootnote")}</p>
            </div>
            <Badge variant="accent">{budget.bonusRemaining.toLocaleString()} credits</Badge>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{
                width: `${Math.min((budget.totalRewardCredits / 1800) * 100, 100)}%`,
              }}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span>
              {format(t("rewards.progress"), { earned: budget.totalRewardCredits, total: 1800 })}
            </span>
            <span>{t("rewards.creditsMaxHint")}</span>
            <span>
              {daysUntilNextMondayLocal() === 1
                ? t("rewards.weeklyAvailableTomorrow")
                : format(t("rewards.weeklyAvailableIn"), { n: daysUntilNextMondayLocal() })}
            </span>
          </div>
        </div>

        {GROUPS.map((group) => {
          const channels = REWARD_CHANNELS.filter((channel) => channel.group === group.key);
          if (channels.length === 0) return null;

          return (
            <section key={group.key} className="space-y-3">
              <div className="flex items-center gap-2">
                {group.key === "opensource" ? (
                  <Star size={14} className="text-amber-500" />
                ) : (
                  <Gift size={14} className="text-accent" />
                )}
                <h2 className="text-sm font-semibold text-text-primary">{t(group.labelKey)}</h2>
              </div>

              <div className="space-y-3">
                {channels.map((channel) => {
                  const claimed = !budget.canClaimChannel(channel.id);
                  return (
                    <div
                      key={channel.id}
                      className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-1 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-text-primary">
                            {t(`reward.${channel.id}.name`)}
                          </span>
                          <Badge variant={claimed ? "outline" : "accent"}>
                            +{channel.reward} credits
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-text-muted">
                          {t(`reward.${channel.id}.desc`)}
                        </p>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant={claimed ? "outline" : "default"}
                        disabled={claimed}
                        onClick={() => handleClaim(channel)}
                        className="shrink-0"
                      >
                        {actionLabel(t, channel, claimed)}
                        {!claimed && <ArrowUpRight size={14} />}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default RewardsPage;
