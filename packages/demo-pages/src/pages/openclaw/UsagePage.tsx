import {
  Badge,
  Button,
  PageHeader,
  StatCard,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@nexu-design/ui-web";
import { ArrowRight, Crown, Gift, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";

import { useBudget } from "../../hooks/useBudget";
import { usePageTitle } from "../../hooks/usePageTitle";

const PACKS = [
  { credits: "5,000", price: "$5", note: "Starter refill" },
  { credits: "20,000", price: "$15", note: "Save 25%" },
  { credits: "50,000", price: "$30", note: "Save 40%" },
];

const CATEGORIES = [
  { label: "AI coding", used: 1280 },
  { label: "Content automation", used: 620 },
  { label: "Deployments", used: 100 },
];

export default function UsagePage() {
  usePageTitle("Usage");
  const budget = useBudget("healthy");

  return (
    <div className="min-h-screen bg-surface-0">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <PageHeader
          title="Usage & credit packs"
          description="Track monthly credits, top up with packs, and unlock extra usage through rewards."
          actions={
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/openclaw/workspace?view=rewards">
                  <Gift size={14} /> Rewards
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/openclaw/pricing">
                  <Crown size={14} /> Compare plans
                </Link>
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Credits remaining"
            value={budget.remaining.toLocaleString()}
            icon={Zap}
            tone="warning"
            meta={`Resets in ${budget.resetsInDays} days`}
          />
          <StatCard
            label="Credits used"
            value={budget.used.toLocaleString()}
            icon={TrendingUp}
            tone="info"
            progress={budget.percentage}
            progressVariant="accent"
          />
          <StatCard
            label="Reward balance"
            value={budget.bonusRemaining.toLocaleString()}
            icon={Gift}
            tone="accent"
            meta="Daily check-ins and community sharing stack here"
          />
        </div>

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList variant="default" className="w-fit">
            <TabsTrigger value="overview">
              <TrendingUp size={14} /> Overview
            </TabsTrigger>
            <TabsTrigger value="packs">
              <Sparkles size={14} /> Credit packs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="mt-4 space-y-6">
              <div className="rounded-2xl border border-border bg-surface-1 p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-text-primary">Current month</h2>
                    <p className="mt-1 text-sm text-text-muted">
                      Reward credits are consumed after your monthly plan allowance.
                    </p>
                  </div>
                  <Badge variant="accent">2,000 monthly credits</Badge>
                </div>

                <div className="mb-5 h-3 overflow-hidden rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>

                <div className="space-y-3">
                  {CATEGORIES.map((category) => (
                    <div key={category.label} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-text-secondary">{category.label}</span>
                      <span className="text-sm font-semibold text-text-primary">
                        {category.used.toLocaleString()} credits
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      Extra usage, without changing plans
                    </h3>
                    <p className="mt-1 text-sm text-text-muted">
                      Pick up a one-time credit pack, or earn extra usage by starring and sharing
                      nexu.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/openclaw/workspace?view=rewards">Open rewards</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link to="/openclaw/pricing">
                        Upgrade plan <ArrowRight size={14} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="packs">
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {PACKS.map((pack) => (
                <div
                  key={pack.credits}
                  className="rounded-2xl border border-border bg-surface-1 p-5"
                >
                  <div className="text-lg font-semibold text-text-primary">
                    {pack.credits} credits
                  </div>
                  <div className="mt-1 text-sm text-text-muted">{pack.note}</div>
                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                      <div className="text-2xl font-bold text-text-primary">{pack.price}</div>
                      <div className="text-xs text-text-muted">One-time pack · 30 day validity</div>
                    </div>
                    <Button size="sm">Buy pack</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
