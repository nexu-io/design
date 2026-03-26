import {
  Badge,
  Button,
  PricingCard,
  StatCard,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@nexu/ui-web";
import { ArrowRight, ChevronRight, Code2, Crown, Globe, Sparkles, TrendingUp } from "lucide-react";
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

export default function BillingPage() {
  usePageTitle("Billing");
  const totalUsed = USAGE.reduce((s, u) => s + u.used, 0);
  const totalCredits = 5000;

  return (
    <div className="max-w-4xl p-4 sm:p-8 mx-auto">
      <div className="mb-8">
        <h1 className="heading-page">Billing & Credits</h1>
        <p className="heading-page-desc">Manage your plan and credit usage.</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList variant="default" className="mb-6 w-fit">
          <TabsTrigger value="overview">
            <TrendingUp size={14} /> Usage overview
          </TabsTrigger>
          <TabsTrigger value="plans">
            <Crown size={14} /> Plan comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
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
                trend={{ label: "Free plan", variant: "brand" }}
              />
              <StatCard
                label="Usage rate"
                value={`${((totalUsed / totalCredits) * 100).toFixed(1)}%`}
                icon={Sparkles}
                tone="accent"
                progress={(totalUsed / totalCredits) * 100}
                progressVariant="accent"
              />
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-text-primary">Usage this month</h2>
                <Badge>Free Plan</Badge>
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
                    <h3 className="text-sm font-semibold text-text-primary">Upgrade to Pro</h3>
                  </div>
                  <p className="text-[13px] text-text-muted">
                    Get 10x credits, priority compute, custom domain, and advanced Workflows
                  </p>
                </div>
                <Button asChild>
                  <a href="#plans">
                    View plans <ArrowRight size={14} />
                  </a>
                </Button>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-sm font-semibold text-text-primary mb-4">Extra credit packs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { credits: "5,000", price: "$5", savings: "" },
                  { credits: "20,000", price: "$15", savings: "Save 25%" },
                  { credits: "50,000", price: "$30", savings: "Save 40%" },
                ].map((pack) => (
                  <button
                    key={pack.credits}
                    type="button"
                    className="p-4 rounded-[12px] border border-border-subtle hover:border-accent/30 hover:bg-accent/5 transition-all cursor-pointer text-left group"
                  >
                    <div className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors">
                      {pack.credits}
                    </div>
                    <div className="text-[12px] text-text-muted">credits</div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[14px] font-semibold text-text-primary">
                        {pack.price}
                      </span>
                      {pack.savings && <Badge variant="success">{pack.savings}</Badge>}
                    </div>
                  </button>
                ))}
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
