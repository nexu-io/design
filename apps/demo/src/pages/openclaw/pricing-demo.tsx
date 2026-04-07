import {
  Badge,
  Button,
  FilterPills,
  FilterPillsList,
  FilterPillTrigger,
  PricingCard,
  StatCard,
} from "@nexu-design/ui-web";
import {
  ArrowRight,
  Clock3,
  Crown,
  Gift,
  type LucideIcon,
  Rocket,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";

export type BillingPlanId = "free" | "plus" | "pro" | "ultimate";
export type UsageQuotaState = "healthy" | "warning" | "depleted";

type ModelAccess = {
  name: string;
  availability: string;
  tone: "success" | "warning" | "accent";
};

type BillingPlan = {
  id: BillingPlanId;
  name: string;
  description: string;
  price: string;
  promoPrice?: string;
  credits: number;
  badge?: string;
  featured?: boolean;
  icon: LucideIcon;
  benefits: string[];
  models: ModelAccess[];
};

type UsagePreset = {
  label: string;
  usedRatio: number;
  resetCountdown: string;
  statusLabel: string;
  upgradeHint: string;
};

type RewardItem = {
  label: string;
  amount: number;
  helper: string;
};

const badgeToneClassNames: Record<ModelAccess["tone"], string> = {
  success:
    "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20",
  warning:
    "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20",
  accent: "bg-accent/10 text-accent border-accent/20",
};

export const BILLING_PLANS: BillingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "For trying nexu workflows with shared capacity.",
    price: "$0",
    credits: 5000,
    icon: Sparkles,
    benefits: [
      "5,000 monthly credits",
      "Shared compute queue",
      "Community support",
      "Slack / Discord connect",
    ],
    models: [
      { name: "GPT-4.1 mini", availability: "Included", tone: "success" },
      { name: "Claude Sonnet", availability: "Limited", tone: "warning" },
    ],
  },
  {
    id: "plus",
    name: "Plus",
    description: "For solo builders shipping weekly product updates.",
    price: "$12",
    promoPrice: "$8",
    credits: 15000,
    icon: Zap,
    benefits: [
      "15,000 monthly credits",
      "Faster queue priority",
      "More workspace history",
      "Email support",
    ],
    models: [
      { name: "GPT-4.1", availability: "Included", tone: "success" },
      { name: "Claude Sonnet", availability: "Included", tone: "success" },
      { name: "Gemini 2.5 Pro", availability: "Preview", tone: "accent" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For creators and operators running daily AI production work.",
    price: "$29",
    promoPrice: "$19",
    credits: 50000,
    badge: "Most popular",
    featured: true,
    icon: Crown,
    benefits: [
      "50,000 monthly credits",
      "Priority compute",
      "Advanced automation",
      "Unlimited private channels",
    ],
    models: [
      { name: "Claude Opus 4.1", availability: "Included", tone: "success" },
      { name: "GPT-4.1", availability: "Included", tone: "success" },
      { name: "Gemini 2.5 Pro", availability: "Included", tone: "success" },
    ],
  },
  {
    id: "ultimate",
    name: "Ultimate",
    description: "For teams needing premium models, higher caps, and concierge support.",
    price: "$79",
    promoPrice: "$59",
    credits: 200000,
    icon: Rocket,
    benefits: [
      "200,000 monthly credits",
      "Top-priority capacity",
      "Premium support channel",
      "Early-access model releases",
    ],
    models: [
      { name: "Claude Opus 4.1", availability: "Priority", tone: "accent" },
      { name: "OpenAI o3", availability: "Included", tone: "success" },
      { name: "Gemini 2.5 Pro", availability: "Priority", tone: "accent" },
      { name: "Video / image tools", availability: "Included", tone: "success" },
    ],
  },
];

const USAGE_PRESETS: Record<UsageQuotaState, UsagePreset> = {
  healthy: {
    label: "Healthy",
    usedRatio: 0.34,
    resetCountdown: "12d 06h",
    statusLabel: "On track",
    upgradeHint: "No action needed — plenty of credits left for this cycle.",
  },
  warning: {
    label: "Warning",
    usedRatio: 0.82,
    resetCountdown: "03d 11h",
    statusLabel: "Running low",
    upgradeHint: "Upgrade now to avoid throttling before the next reset.",
  },
  depleted: {
    label: "Depleted",
    usedRatio: 1,
    resetCountdown: "06h 20m",
    statusLabel: "Credits exhausted",
    upgradeHint: "Upgrade or enable usage billing to keep workflows moving.",
  },
};

const REWARD_SPLITS: Record<"signedOut" | "signedIn", RewardItem[]> = {
  signedOut: [
    { label: "Welcome bonus", amount: 200, helper: "Available after sign in" },
    { label: "Referral rewards", amount: 0, helper: "Invite teammates to unlock" },
    { label: "Weekly streak", amount: 0, helper: "Use nexu 3 days in a row" },
  ],
  signedIn: [
    { label: "Welcome bonus", amount: 200, helper: "Already applied this month" },
    { label: "Referral rewards", amount: 900, helper: "3 invites converted" },
    { label: "Weekly streak", amount: 300, helper: "Current 4-day streak" },
  ],
};

const PLAN_SWITCH_OPTIONS: BillingPlanId[] = ["free", "plus", "pro", "ultimate"];
const QUOTA_OPTIONS: UsageQuotaState[] = ["healthy", "warning", "depleted"];

function getPlan(planId: BillingPlanId) {
  return BILLING_PLANS.find((plan) => plan.id === planId) ?? BILLING_PLANS[0];
}

function getUpgradeTarget(planId: BillingPlanId) {
  if (planId === "free") return getPlan("plus");
  if (planId === "plus") return getPlan("pro");
  if (planId === "pro") return getPlan("ultimate");
  return null;
}

function formatCredits(value: number) {
  return value.toLocaleString();
}

function getUsageBreakdown(planId: BillingPlanId, usageState: UsageQuotaState) {
  const plan = getPlan(planId);
  const preset = USAGE_PRESETS[usageState];
  const totalUsed = Math.round(plan.credits * preset.usedRatio);

  const allocations = [
    { label: "Agent chat", ratio: 0.54, tone: "bg-[var(--color-info)]", icon: Sparkles },
    { label: "Research runs", ratio: 0.29, tone: "bg-[var(--color-pink)]", icon: Zap },
    { label: "Automation tasks", ratio: 0.17, tone: "bg-[var(--color-success)]", icon: Rocket },
  ] as const;

  const items = allocations.map((item, index) => {
    const isLast = index === allocations.length - 1;
    const used = isLast
      ? totalUsed -
        allocations
          .slice(0, -1)
          .reduce((sum, current) => sum + Math.round(totalUsed * current.ratio), 0)
      : Math.round(totalUsed * item.ratio);

    return {
      ...item,
      used,
      percent: plan.credits === 0 ? 0 : (used / plan.credits) * 100,
    };
  });

  return {
    plan,
    preset,
    totalUsed,
    remaining: Math.max(plan.credits - totalUsed, 0),
    percent: plan.credits === 0 ? 0 : (totalUsed / plan.credits) * 100,
    items,
  };
}

function PromoPrice({ promoPrice, price }: { promoPrice?: string; price: string }) {
  if (!promoPrice) return <>{price}</>;

  return (
    <span className="inline-flex items-end gap-2">
      <span>{promoPrice}</span>
      <span className="text-sm font-medium text-text-muted line-through">{price}</span>
    </span>
  );
}

export function PricingDemoControls({
  isSignedIn,
  onSignedInChange,
  planId,
  onPlanChange,
  usageState,
  onUsageStateChange,
}: {
  isSignedIn: boolean;
  onSignedInChange: (value: boolean) => void;
  planId: BillingPlanId;
  onPlanChange: (value: BillingPlanId) => void;
  usageState: UsageQuotaState;
  onUsageStateChange: (value: UsageQuotaState) => void;
}) {
  return (
    <div className="mb-6 rounded-2xl border border-border bg-surface-1 p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-sm font-semibold text-text-primary">Demo control panel</div>
          <div className="mt-1 text-[12px] text-text-muted">
            Toggle account, plan, and quota state to preview the pricing / usage UX.
          </div>
        </div>
        <Badge variant="secondary">Prototype only</Badge>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ControlGroup
          label="Login state"
          options={[
            { id: "signedOut", label: "Signed out" },
            { id: "signedIn", label: "Signed in" },
          ]}
          value={isSignedIn ? "signedIn" : "signedOut"}
          onChange={(value) => onSignedInChange(value === "signedIn")}
        />
        <ControlGroup
          label="Current plan"
          options={PLAN_SWITCH_OPTIONS.map((value) => ({ id: value, label: getPlan(value).name }))}
          value={planId}
          onChange={(value) => onPlanChange(value as BillingPlanId)}
        />
        <ControlGroup
          label="Quota state"
          options={QUOTA_OPTIONS.map((value) => ({ id: value, label: USAGE_PRESETS[value].label }))}
          value={usageState}
          onChange={(value) => onUsageStateChange(value as UsageQuotaState)}
        />
      </div>
    </div>
  );
}

function ControlGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-[12px] font-medium text-text-secondary">{label}</div>
      <FilterPills value={value} onValueChange={onChange}>
        <FilterPillsList className="flex-wrap gap-2 bg-transparent p-0">
          {options.map((option) => (
            <FilterPillTrigger key={option.id} value={option.id} className="border border-border">
              {option.label}
            </FilterPillTrigger>
          ))}
        </FilterPillsList>
      </FilterPills>
    </div>
  );
}

export function UsageSummaryPanel({
  planId,
  usageState,
  isSignedIn,
  onViewPlans,
  onOpenRewards,
  compact = false,
}: {
  planId: BillingPlanId;
  usageState: UsageQuotaState;
  isSignedIn: boolean;
  onViewPlans?: () => void;
  onOpenRewards?: () => void;
  compact?: boolean;
}) {
  const summary = getUsageBreakdown(planId, usageState);
  const upgradeTarget = getUpgradeTarget(planId);
  const rewards = REWARD_SPLITS[isSignedIn ? "signedIn" : "signedOut"];
  const rewardTotal = rewards.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Credits used"
          value={formatCredits(summary.totalUsed)}
          meta={`of ${formatCredits(summary.plan.credits)} this cycle`}
          icon={Sparkles}
          tone="info"
        />
        <StatCard
          label="Credits remaining"
          value={formatCredits(summary.remaining)}
          trend={{
            label: summary.preset.statusLabel,
            variant:
              usageState === "healthy"
                ? "success"
                : usageState === "warning"
                  ? "warning"
                  : "danger",
          }}
          icon={Crown}
          tone={
            usageState === "healthy" ? "success" : usageState === "warning" ? "warning" : "danger"
          }
        />
        <StatCard
          label="Reset countdown"
          value={summary.preset.resetCountdown}
          meta="Until monthly credits refresh"
          icon={Clock3}
          tone="accent"
        />
      </div>

      <div
        className={`grid gap-4 ${compact ? "xl:grid-cols-[1.4fr_1fr]" : "lg:grid-cols-[1.45fr_1fr]"}`}
      >
        <div className="card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-text-primary">Current package</h2>
                <Badge>{summary.plan.name}</Badge>
              </div>
              <p className="mt-2 text-[13px] text-text-muted">{summary.plan.description}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-2 px-3 py-2 text-right">
              <div className="text-[11px] uppercase tracking-wide text-text-muted">Reset in</div>
              <div className="text-lg font-semibold text-text-primary">
                {summary.preset.resetCountdown}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface-2 p-4">
              <div className="text-[12px] text-text-muted">Included credits</div>
              <div className="mt-1 text-2xl font-semibold text-text-primary">
                {formatCredits(summary.plan.credits)}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-surface-2 p-4">
              <div className="text-[12px] text-text-muted">Usage status</div>
              <div className="mt-1 text-2xl font-semibold text-text-primary">
                {summary.preset.statusLabel}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-[12px] text-text-muted">
              <span>This cycle</span>
              <span>{summary.percent.toFixed(1)}% used</span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-surface-3">
              {summary.items.map((item, index) => {
                const left = summary.items
                  .slice(0, index)
                  .reduce((sum, current) => sum + current.percent, 0);
                return (
                  <div
                    key={item.label}
                    className={`absolute inset-y-0 rounded-full ${item.tone}`}
                    style={{ left: `${left}%`, width: `${item.percent}%` }}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {summary.items.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.tone}`} />
                <item.icon size={14} className="text-text-secondary" />
                <span className="flex-1 text-[13px] text-text-secondary">{item.label}</span>
                <span className="text-[13px] font-semibold text-text-primary">
                  {formatCredits(item.used)}
                </span>
                <span className="w-14 text-right text-[11px] text-text-muted">
                  {item.percent.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-accent/20 bg-accent/5 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-text-primary">
                  {upgradeTarget
                    ? `Upgrade to ${upgradeTarget.name}`
                    : "Top-tier benefits already unlocked"}
                </div>
                <p className="mt-1 text-[13px] text-text-muted">{summary.preset.upgradeHint}</p>
              </div>
              {upgradeTarget ? (
                <Button onClick={onViewPlans}>
                  See {upgradeTarget.name} plan <ArrowRight size={14} />
                </Button>
              ) : (
                <Button variant="outline">Talk to us about annual billing</Button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 text-sm font-semibold text-text-primary">Benefits included</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {summary.plan.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-xl border border-border bg-surface-2 px-3 py-3 text-[13px] text-text-secondary"
                >
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <Gift size={16} className="text-accent" />
              <h2 className="text-sm font-semibold text-text-primary">Rewards credits split</h2>
            </div>
            <div className="mt-4 space-y-3">
              {rewards.map((reward) => (
                <div
                  key={reward.label}
                  className="rounded-xl border border-border bg-surface-2 px-3 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] font-medium text-text-primary">
                      {reward.label}
                    </span>
                    <span className="text-[13px] font-semibold text-text-primary">
                      +{reward.amount}
                    </span>
                  </div>
                  <div className="mt-1 text-[12px] text-text-muted">{reward.helper}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-border px-3 py-3 text-[12px] text-text-muted">
              Reward credits available this cycle:{" "}
              <span className="font-semibold text-text-primary">{formatCredits(rewardTotal)}</span>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2">
              <UserRound size={16} className="text-accent" />
              <h2 className="text-sm font-semibold text-text-primary">
                Share nexu for extra credits
              </h2>
            </div>
            <p className="mt-2 text-[13px] text-text-muted">
              {isSignedIn
                ? "Invite teammates or post your workflow to unlock another +500 credits per successful share."
                : "Sign in first to generate your referral link and start collecting bonus credits."}
            </p>
            <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
              <div className="text-[12px] text-text-muted">Share reward</div>
              <div className="mt-1 text-lg font-semibold text-text-primary">
                +500 credits / teammate
              </div>
            </div>
            <Button
              className="mt-4 w-full"
              variant={isSignedIn ? "default" : "outline"}
              onClick={onOpenRewards}
            >
              {isSignedIn ? "Open share rewards" : "Sign in to unlock sharing"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlanComparisonGrid({ activePlan }: { activePlan: BillingPlanId }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
      {BILLING_PLANS.map((plan) => (
        <PricingCard
          key={plan.id}
          name={plan.name}
          description={plan.description}
          price={<PromoPrice promoPrice={plan.promoPrice} price={plan.price} />}
          period={plan.promoPrice ? "first month" : "/ month"}
          icon={plan.icon}
          badge={plan.badge}
          featured={plan.featured}
          features={[
            `${formatCredits(plan.credits)} credits / month`,
            ...plan.models.map((model) => (
              <div
                key={`${plan.id}-${model.name}`}
                className="flex w-full items-center justify-between gap-2"
              >
                <span>{model.name}</span>
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${badgeToneClassNames[model.tone]}`}
                >
                  {model.availability}
                </span>
              </div>
            )),
          ]}
          footer={
            activePlan === plan.id ? (
              <Button variant="outline" className="w-full cursor-default" disabled>
                Current plan
              </Button>
            ) : (
              <Button variant={plan.featured ? "default" : "outline"} className="w-full">
                Upgrade to {plan.name}
              </Button>
            )
          }
        />
      ))}
    </div>
  );
}
