import {
  Badge,
  Button,
  PageHeader,
  PricingCard,
  StatCard,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@nexu-design/ui-web";
import { ArrowRight, ChevronRight, Code2, Crown, Globe, Sparkles, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "For getting started with AI workflows",
    credits: 5000,
    icon: Sparkles,
    current: true,
    features: [
      "5,000 credits / month",
      "Slack / Discord connect",
      "AI coding + content automation",
      "Shared compute",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    description: "For independent builders shipping faster",
    credits: 50000,
    icon: Crown,
    recommended: true,
    features: [
      "50,000 credits / month",
      "Priority compute",
      "Custom domain",
      "Advanced Workflows",
      "Team collaboration",
    ],
  },
  {
    id: "team",
    name: "Team",
    price: "$99",
    description: "For teams coordinating delivery together",
    credits: 200000,
    icon: Globe,
    features: [
      "200,000 credits / month",
      "Dedicated compute",
      "Unlimited Workflows",
      "SSO integration",
      "Dedicated support",
    ],
  },
];

const USAGE = [
  {
    label: "AI coding",
    used: 1280,
    icon: Code2,
    color: "text-[var(--color-info)]",
    bg: "bg-[var(--color-info)]",
  },
  {
    label: "Content automation",
    used: 620,
    icon: Sparkles,
    color: "text-[var(--color-pink)]",
    bg: "bg-[var(--color-pink)]",
  },
  {
    label: "Deployments",
    used: 100,
    icon: Globe,
    color: "text-[var(--color-success)]",
    bg: "bg-[var(--color-success)]",
  },
];

type BillingPageProps = {
  initialTab?: "usage" | "plans";
};

export default function BillingPage({ initialTab = "usage" }: BillingPageProps) {
  usePageTitle("Billing");
  const [activePlan, setActivePlan] = useState<"free" | "pro" | "team">("free");
  const [billingMode, setBillingMode] = useState<"fixed" | "unlimited" | "disabled">("fixed");
  const totalUsed = USAGE.reduce((s, u) => s + u.used, 0);
  const totalCredits = activePlan === "free" ? 5000 : activePlan === "pro" ? 50000 : 200000;
  const usagePercent = (totalUsed / totalCredits) * 100;

  const primaryCta = useMemo(() => {
    if (activePlan === "free")
      return {
        title: "Upgrade to Pro",
        copy: "Get 10x credits and priority compute",
        action: "See Pro plan",
      };
    if (activePlan === "pro")
      return {
        title: "Upgrade to Team",
        copy: "Scale with shared workspaces and dedicated support",
        action: "See Team plan",
      };
    return {
      title: "Enable on-demand billing",
      copy: "Keep work running after monthly credits are used",
      action: "Configure usage billing",
    };
  }, [activePlan]);

  return (
    <div className="max-w-4xl p-4 sm:p-8 mx-auto">
      <PageHeader
        title="Billing & Credits"
        description="Manage your plan, usage, and billing controls."
      />

      <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[12px] text-text-muted">Current plan</div>
            <div className="text-sm font-semibold text-text-primary capitalize">{activePlan}</div>
          </div>
          <div className="flex gap-2">
            {(["free", "pro", "team"] as const).map((plan) => (
              <Button
                key={plan}
                size="sm"
                variant={activePlan === plan ? "default" : "outline"}
                onClick={() => setActivePlan(plan)}
              >
                {plan}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue={initialTab}>
        <TabsList variant="default" className="mb-6 w-fit">
          <TabsTrigger value="usage">
            <TrendingUp size={14} /> Usage overview
          </TabsTrigger>
          <TabsTrigger value="plans">
            <Crown size={14} /> Plan comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usage">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Credits used"
                value={totalUsed.toLocaleString()}
                icon={TrendingUp}
                tone="info"
                meta={`of ${totalCredits.toLocaleString()} this month`}
              />
              <StatCard
                label="Credits remaining"
                value={(totalCredits - totalUsed).toLocaleString()}
                icon={Crown}
                tone="success"
                trend={{ label: "Free plan", variant: "accent" }}
              />
              <StatCard
                label="Usage rate"
                value={`${usagePercent.toFixed(1)}%`}
                icon={Sparkles}
                tone="accent"
                progress={(totalUsed / totalCredits) * 100}
                progressVariant="accent"
              />
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-text-primary">Usage this month</h2>
                <Badge>{activePlan.toUpperCase()} plan</Badge>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-text-primary">
                    {totalUsed.toLocaleString()}
                  </div>
                  <div className="text-[12px] text-text-muted mt-0.5">
                    / {totalCredits.toLocaleString()} credits used
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[var(--color-success)]">
                    {(totalCredits - totalUsed).toLocaleString()}
                  </div>
                  <div className="text-[12px] text-text-muted mt-0.5">credits remaining</div>
                </div>
              </div>
              <div className="relative h-3 rounded-full bg-surface-3 overflow-hidden mb-6">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-info)]/80"
                  style={{ width: `${(1280 / totalCredits) * 100}%` }}
                />
                <div
                  className="absolute inset-y-0 rounded-full bg-[var(--color-pink)]/80"
                  style={{
                    left: `${(1280 / totalCredits) * 100}%`,
                    width: `${(620 / totalCredits) * 100}%`,
                  }}
                />
                <div
                  className="absolute inset-y-0 rounded-full bg-[var(--color-success)]/80"
                  style={{
                    left: `${((1280 + 620) / totalCredits) * 100}%`,
                    width: `${(100 / totalCredits) * 100}%`,
                  }}
                />
              </div>
              <div className="space-y-3">
                {USAGE.map((cat) => (
                  <div key={cat.label} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${cat.bg} shrink-0`} />
                    <cat.icon size={14} className={cat.color} />
                    <span className="text-[13px] text-text-secondary flex-1">{cat.label}</span>
                    <span className="text-[13px] font-semibold text-text-primary">
                      {cat.used.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-text-muted w-16 text-right">
                      {((cat.used / totalCredits) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-[12px] border border-accent/20 bg-accent/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Crown size={16} className="text-accent" />
                    <h3 className="text-sm font-semibold text-text-primary">{primaryCta.title}</h3>
                  </div>
                  <p className="text-[13px] text-text-muted">{primaryCta.copy}</p>
                </div>
                <Button asChild>
                  <a href="#plans">
                    {primaryCta.action} <ArrowRight size={14} />
                  </a>
                </Button>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-sm font-semibold text-text-primary mb-4">On-demand billing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {[
                  { id: "fixed", title: "Fixed cap", desc: "Stop at monthly cap" },
                  { id: "unlimited", title: "Unlimited", desc: "Continue with usage billing" },
                  { id: "disabled", title: "Disabled", desc: "Pause when credits end" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setBillingMode(mode.id as typeof billingMode)}
                    className={`rounded-[12px] border p-4 text-left transition-all ${billingMode === mode.id ? "border-accent bg-accent/5" : "border-border-subtle"}`}
                  >
                    <div className="text-[13px] font-semibold text-text-primary">{mode.title}</div>
                    <div className="mt-1 text-[12px] text-text-muted">{mode.desc}</div>
                  </button>
                ))}
              </div>
              <p className="text-[12px] text-text-muted">
                Current mode:{" "}
                <span className="font-medium text-text-primary capitalize">{billingMode}</span>
              </p>
            </div>

            <div className="card p-6">
              <h2 className="text-sm font-semibold text-text-primary mb-4">Billing FAQ</h2>
              <div className="space-y-3 text-[13px]">
                <p>
                  <span className="font-medium">When do credits reset?</span> Monthly on your
                  billing cycle.
                </p>
                <p>
                  <span className="font-medium">Can I switch plans anytime?</span> Yes, upgrades
                  apply immediately.
                </p>
                <p>
                  <span className="font-medium">Can I use my own API keys?</span> Yes, BYOK remains
                  available in settings.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plans">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <PricingCard
                key={plan.id}
                name={plan.name}
                description={plan.description}
                price={plan.price}
                period="/ month"
                icon={plan.icon}
                iconClassName={
                  "recommended" in plan && plan.recommended ? "text-accent" : undefined
                }
                badge={"recommended" in plan && plan.recommended ? "Recommended" : undefined}
                featured={Boolean("recommended" in plan && plan.recommended)}
                features={plan.features}
                footer={
                  "current" in plan && plan.current ? (
                    <Button variant="outline" className="w-full cursor-default" disabled>
                      Current plan
                    </Button>
                  ) : (
                    <Button
                      variant={"recommended" in plan && plan.recommended ? "default" : "outline"}
                      className="w-full"
                    >
                      Upgrade <ChevronRight size={14} />
                    </Button>
                  )
                }
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
