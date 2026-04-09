import {
  Card,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  PageHeader,
  SectionHeader,
  TextLink,
  ToggleGroup,
  ToggleGroupItem,
  cn,
} from "@nexu-design/ui-web";
import { ArrowUpRight, Check, Gift } from "lucide-react";
import { useEffect, useState } from "react";
import {
  REWARD_CHANNELS,
  type RewardChannel,
  type RewardGroup,
  useBudget,
} from "../../hooks/useBudget";
import { openExternal } from "../../utils/open-external";
import { ChannelIcon, CreditIcon } from "./iconHelpers";

const REWARD_GROUPS: { key: RewardGroup; labelKey: string }[] = [
  { key: "daily", labelKey: "rewards.group.daily" },
  { key: "opensource", labelKey: "rewards.group.opensource" },
  { key: "social", labelKey: "rewards.group.social" },
];

function formatRewardAmount(n: number): string {
  return String(Math.round(n));
}

function formatCreditsPlain(n: number): string {
  return formatRewardAmount(n);
}

function rewardsCreditsPlusLabel(n: number, t: (key: string) => string): string {
  return n === 1
    ? t("rewards.creditsPlusOne")
    : t("rewards.creditsPlusMany").replace("{n}", formatCreditsPlain(n));
}

function rewardsCreditsValueLabel(n: number, t: (key: string) => string): string {
  return n === 1
    ? t("rewards.creditsValueOne")
    : t("rewards.creditsValueMany").replace("{n}", formatCreditsPlain(n));
}

function formatCountdownToLocalMidnight(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  const ms = next.getTime() - now.getTime();
  if (ms <= 0) return "00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function useNextLocalMidnightCountdown(): string {
  const [label, setLabel] = useState(() => formatCountdownToLocalMidnight());
  useEffect(() => {
    const id = window.setInterval(() => setLabel(formatCountdownToLocalMidnight()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return label;
}

function sortChannelsForRewards(
  channels: RewardChannel[],
  budget: ReturnType<typeof useBudget>,
): RewardChannel[] {
  const isDone = (ch: RewardChannel) =>
    ch.repeatable === "daily" ? budget.dailyCheckedInToday : budget.claimedChannels.has(ch.id);
  const rank = (ch: RewardChannel): number => {
    if (!isDone(ch)) return 0;
    if (ch.repeatable === "daily") return 0;
    if (ch.repeatable === "weekly") return 1;
    return 2;
  };
  return channels
    .map((ch, order) => ({ ch, order }))
    .sort((a, b) => {
      const ra = rank(a.ch);
      const rb = rank(b.ch);
      if (ra !== rb) return ra - rb;
      return a.order - b.order;
    })
    .map(({ ch }) => ch);
}

export function RewardsCenter({
  budget,
  onDailyCheckIn,
  onOpenMaterial,
  onRequestConfirm,
  t,
}: {
  budget: ReturnType<typeof useBudget>;
  onDailyCheckIn: () => void;
  onOpenMaterial: (channel: RewardChannel) => void;
  onRequestConfirm: (channel: RewardChannel) => void;
  t: (key: string) => string;
}) {
  const dailyResetCountdown = useNextLocalMidnightCountdown();
  const allTasks = REWARD_CHANNELS;
  const completedCount = budget.claimedCount + (budget.dailyCheckedInToday ? 1 : 0);
  const totalCount = budget.channelCount + 1;
  const creditsCapBaseline = budget.totalRewardAvailable + 100;
  const earnedCredits = budget.totalRewardClaimed;
  const weeklyWaitDays =
    typeof window !== "undefined"
      ? (() => {
          const day = new Date().getDay();
          if (day === 1) return 7;
          if (day === 0) return 1;
          return 8 - day;
        })()
      : 7;

  const weeklyCooldownLabel = () =>
    weeklyWaitDays === 1
      ? t("rewards.weeklyCooldownOneDay")
      : t("rewards.weeklyCooldownLeft").replace("{n}", String(weeklyWaitDays));

  const weeklyCooldownButtonLabel = () => "Done";

  const ctaForRow = (ch: RewardChannel) => {
    const isDaily = ch.repeatable === "daily";
    const done = isDaily ? budget.dailyCheckedInToday : budget.claimedChannels.has(ch.id);
    if (done) return "Done";
    if (isDaily) return t("budget.cta.checkin");
    if (ch.id === "github_star") return t("budget.cta.goStar");
    if (ch.shareMode === "image") return t("budget.cta.getMaterial");
    return t("budget.cta.post");
  };

  const buttonPropsForRow = (ch: RewardChannel) => {
    const isDaily = ch.repeatable === "daily";
    const done = isDaily ? budget.dailyCheckedInToday : budget.claimedChannels.has(ch.id);
    const weeklyCooldown = ch.repeatable === "weekly" && done;
    if (done || weeklyCooldown) {
      return { variant: "outline" as const, disabled: true };
    }
    if (isDaily) {
      return { variant: "default" as const, disabled: false };
    }
    return { variant: "outline" as const, disabled: false };
  };

  const onRowAction = (ch: RewardChannel) => {
    const isDaily = ch.repeatable === "daily";
    const done = isDaily ? budget.dailyCheckedInToday : budget.claimedChannels.has(ch.id);
    if (done) return;
    if (isDaily) {
      onDailyCheckIn();
      return;
    }
    if (ch.shareMode === "image") {
      onOpenMaterial(ch);
      return;
    }
    if (ch.url) void openExternal(ch.url);
    onRequestConfirm(ch);
  };

  type RewardSectionBlock = { key: RewardGroup; labelKey: string; channels: RewardChannel[] };

  const buildRewardSections = (keys: RewardGroup[]): RewardSectionBlock[] =>
    REWARD_GROUPS.filter((g) => keys.includes(g.key)).flatMap((group) => {
      const channels = sortChannelsForRewards(
        allTasks.filter((c) => c.group === group.key),
        budget,
      );
      if (channels.length === 0) return [];
      return [{ key: group.key, labelKey: group.labelKey, channels }];
    });

  const topRewardSections = buildRewardSections(["daily", "opensource"]);
  const socialRewardSections = buildRewardSections(["social"]);

  type SocialTab = "mobile" | "web";
  const [socialTab, setSocialTab] = useState<SocialTab>("web");

  const socialWebChannels = socialRewardSections.flatMap((s) =>
    s.channels.filter((ch) => ch.shareMode !== "image"),
  );

  const mobileScanDone = budget.claimedChannels.has("wechat");
  const mobileScanReward = 200;

  const renderRewardRow = (ch: RewardChannel) => {
    const isDaily = ch.repeatable === "daily";
    const done = isDaily ? budget.dailyCheckedInToday : budget.claimedChannels.has(ch.id);
    const weeklyCooldown = ch.repeatable === "weekly" && done;
    const actionProps = buttonPropsForRow(ch);

    return (
      <InteractiveRow
        key={ch.id}
        tone="default"
        onClick={() => onRowAction(ch)}
        className={cn("items-center rounded-xl px-4 py-3", done && "opacity-75")}
      >
        <InteractiveRowLeading
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-[10px] border",
            isDaily
              ? "border-[var(--color-brand-primary)]/28 bg-[var(--color-brand-subtle)] ring-1 ring-inset ring-[var(--color-brand-primary)]/12"
              : "border-transparent bg-surface-2",
            done && isDaily && "opacity-55",
          )}
        >
          <ChannelIcon icon={ch.icon} size={20} accent={isDaily ? "brand" : "default"} />
        </InteractiveRowLeading>

        <InteractiveRowContent className="flex items-center gap-2 py-0.5">
          <div className="flex min-w-0 items-center gap-4">
            <p
              className={cn(
                "min-w-0 truncate text-[14px] font-semibold leading-tight",
                done ? "text-text-tertiary" : "text-text-primary",
              )}
            >
              {t(`reward.${ch.id}.name`)}
            </p>
            {!done ? (
              <span className="shrink-0 text-[14px] font-semibold tabular-nums leading-none whitespace-nowrap text-[var(--color-brand-primary)]">
                {rewardsCreditsPlusLabel(ch.reward, t)}
              </span>
            ) : (
              <span className="inline-flex shrink-0 items-center gap-0.5 text-[14px] font-semibold tabular-nums leading-none whitespace-nowrap text-text-tertiary">
                <Check
                  size={13}
                  strokeWidth={2.5}
                  className="shrink-0 text-[var(--color-brand-primary)]"
                  aria-hidden
                />
                {rewardsCreditsValueLabel(ch.reward, t)}
              </span>
            )}
          </div>
        </InteractiveRowContent>

        <InteractiveRowTrailing className="flex items-center gap-3">
          {weeklyCooldown ? (
            <span className="text-[12px] font-medium leading-none whitespace-nowrap text-text-tertiary tabular-nums">
              {weeklyCooldownLabel()}
            </span>
          ) : null}
          {isDaily && done ? (
            <span className="text-[12px] font-medium leading-none whitespace-nowrap text-text-tertiary tabular-nums">
              {dailyResetCountdown}
            </span>
          ) : null}
          <span
            className={cn(
              "inline-flex min-w-[120px] items-center justify-center rounded-lg px-3 text-sm font-semibold h-8",
              actionProps.variant === "default"
                ? "bg-[var(--color-accent)] text-[var(--color-accent-fg,white)] shadow-sm"
                : "border border-input bg-background text-foreground shadow-xs",
              actionProps.disabled && "pointer-events-none opacity-50",
            )}
          >
            {weeklyCooldown ? weeklyCooldownButtonLabel() : ctaForRow(ch)}
          </span>
        </InteractiveRowTrailing>
      </InteractiveRow>
    );
  };

  const renderRewardSectionGroups = (
    sections: RewardSectionBlock[],
    opts: {
      showGroupTitles: boolean;
      sectionGapClass: string;
      listGapClass: string;
      titleAside?: string;
      sectionHeaderClassName?: string;
    },
  ) =>
    sections.map((section, sectionIndex) => (
      <div key={section.key} className={sectionIndex > 0 ? opts.sectionGapClass : ""}>
        {opts.showGroupTitles ? (
          <SectionHeader
            title={t(section.labelKey)}
            action={
              opts.titleAside ? (
                <span className="text-[12px] font-normal leading-none text-text-tertiary">
                  {opts.titleAside}
                </span>
              ) : undefined
            }
            className={cn("mb-3", opts.sectionHeaderClassName)}
          />
        ) : null}
        <div className={opts.listGapClass}>{section.channels.map(renderRewardRow)}</div>
      </div>
    ));

  return (
    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-5 md:px-6">
      <div className="w-full max-w-[840px] mx-auto">
        <PageHeader
          density="shell"
          title={t("rewards.title")}
          description={
            <>
              {t("rewards.desc")}{" "}
              <TextLink
                href="https://docs.nexu.io/rewards"
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                className="inline-flex items-center gap-1 leading-none text-[var(--color-link)]"
              >
                {t("budget.viral.rules")}
                <ArrowUpRight size={12} className="shrink-0" aria-hidden />
              </TextLink>
            </>
          }
        />

        <div className="mt-8 mb-8" title={t("rewards.creditsMaxHint")}>
          <Card variant="outline" padding="none" className="relative overflow-hidden px-5 py-4">
            <Gift
              size={64}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-heading/[0.06]"
            />
            <div className="relative">
              <div className="text-sm font-semibold text-text-secondary">
                {t("rewards.creditsShort")}
              </div>
              <div className="mt-2.5 flex items-center gap-3">
                <div className="flex items-center text-xl font-bold tracking-tight text-text-primary">
                  <CreditIcon size={14} className="text-text-heading mr-1.5 shrink-0" />
                  {formatCreditsPlain(earnedCredits)}
                  <span className="text-text-muted font-normal">
                    {" "}
                    / {formatCreditsPlain(creditsCapBaseline)}
                  </span>
                </div>
                <span className="text-[12px] text-text-muted">
                  {totalCount - completedCount} earnable{" "}
                  {totalCount - completedCount === 1 ? "task" : "tasks"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-10">
          {topRewardSections.length > 0 ? (
            <div className="flex flex-col gap-3">
              {renderRewardSectionGroups(topRewardSections, {
                showGroupTitles: false,
                sectionGapClass: "",
                listGapClass: "flex flex-col gap-3",
              })}
            </div>
          ) : null}
          {socialRewardSections.length > 0 && (
            <div>
              <ToggleGroup
                type="single"
                value={socialTab}
                onValueChange={(v: string) => {
                  if (v) setSocialTab(v as SocialTab);
                }}
                variant="compact"
                aria-label="Share platform"
                className="mb-4 bg-surface-2"
              >
                <ToggleGroupItem value="web" variant="compact">
                  Share on Web
                </ToggleGroupItem>
                <ToggleGroupItem value="mobile" variant="compact">
                  Share on Mobile
                </ToggleGroupItem>
              </ToggleGroup>
              <div className="grid">
                <div
                  className={cn(
                    "col-start-1 row-start-1 relative flex flex-col rounded-xl border border-border bg-surface-0",
                    socialTab !== "mobile" && "invisible",
                  )}
                  role="region"
                  aria-label={t("rewards.shareMobile.qrRegion")}
                >
                  <div
                    className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl opacity-30"
                    aria-hidden
                  >
                    <span className="absolute top-[34%] left-[22%] -rotate-12">
                      <ChannelIcon icon="wechat" size={40} />
                    </span>
                    <span className="absolute top-[36%] right-[22%] rotate-12">
                      <ChannelIcon icon="xiaohongshu" size={44} />
                    </span>
                    <span className="absolute bottom-[36%] left-[32%] rotate-6">
                      <ChannelIcon icon="feishu" size={38} />
                    </span>
                    <span className="absolute bottom-[38%] right-[30%] -rotate-6">
                      <ChannelIcon icon="jike" size={34} />
                    </span>
                  </div>
                  <div className="relative flex flex-1 flex-col items-center justify-center gap-4 px-5 py-5">
                    <div className="max-w-md space-y-1 text-center">
                      <h3 className="text-[15px] font-semibold leading-snug text-text-primary">
                        {t("rewards.shareMobile.title")}
                      </h3>
                      <p className="text-xs font-normal leading-snug text-text-tertiary">
                        {t("rewards.shareMobile.subtitle")}
                      </p>
                    </div>
                    <img
                      src="/rewards/mobile-share-qr.png"
                      alt={t("rewards.shareMobile.qrRegion")}
                      width={176}
                      height={176}
                      className="size-[176px] object-contain rounded-lg"
                      decoding="async"
                    />
                    {mobileScanDone ? (
                      <span className="inline-flex shrink-0 items-center gap-1 text-[14px] font-semibold tabular-nums leading-none whitespace-nowrap text-text-tertiary">
                        <Check
                          size={13}
                          strokeWidth={2.5}
                          className="shrink-0 text-[var(--color-brand-primary)]"
                          aria-hidden
                        />
                        {rewardsCreditsValueLabel(mobileScanReward, t)}
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center justify-center rounded-full",
                          "bg-[var(--color-brand-subtle)] px-2.5 py-1",
                          "text-[14px] font-semibold tabular-nums leading-none whitespace-nowrap",
                          "text-[var(--color-brand-primary)]",
                        )}
                      >
                        {rewardsCreditsPlusLabel(mobileScanReward, t)}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={cn(
                    "col-start-1 row-start-1 flex flex-col gap-3",
                    socialTab !== "web" && "invisible",
                  )}
                >
                  {socialWebChannels.map(renderRewardRow)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
