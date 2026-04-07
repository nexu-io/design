import { PageHeader, Tabs, TabsContent, TabsList, TabsTrigger } from "@nexu-design/ui-web";
import { Crown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import {
  BillingDemoControls,
  type BillingPlanId,
  PlanComparisonGrid,
  type UsageQuotaState,
  UsageSummaryPanel,
} from "./billingDemo";

type BillingPageProps = {
  initialTab?: "usage" | "plans";
};

export default function BillingPage({ initialTab = "usage" }: BillingPageProps) {
  usePageTitle("Pricing & Usage");
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"usage" | "plans">(initialTab);
  const [activePlan, setActivePlan] = useState<BillingPlanId>("plus");
  const [usageState, setUsageState] = useState<UsageQuotaState>("warning");
  const [isSignedIn, setIsSignedIn] = useState(true);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8">
      <PageHeader
        title="Pricing / Usage"
        description="Preview plan comparison, credit usage, rewards, and upgrade states for the cloud prototype."
      />

      <BillingDemoControls
        isSignedIn={isSignedIn}
        onSignedInChange={setIsSignedIn}
        planId={activePlan}
        onPlanChange={setActivePlan}
        usageState={usageState}
        onUsageStateChange={setUsageState}
      />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "usage" | "plans")}>
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
            <UsageSummaryPanel
              planId={activePlan}
              usageState={usageState}
              isSignedIn={isSignedIn}
              onViewPlans={() => setActiveTab("plans")}
              onOpenRewards={() => navigate("/openclaw/rewards")}
            />

            <div className="card p-6">
              <h2 className="mb-4 text-sm font-semibold text-text-primary">Billing FAQ</h2>
              <div className="space-y-3 text-[13px]">
                <p>
                  <span className="font-medium">When do credits reset?</span> Credits refresh on
                  your monthly cycle and reward credits stack on top.
                </p>
                <p>
                  <span className="font-medium">Can I switch plans anytime?</span> Yes, upgrades
                  apply immediately and prorate the remaining cycle.
                </p>
                <p>
                  <span className="font-medium">Can I still use my own API keys?</span> Yes, BYOK
                  remains available in Settings → AI Model Providers.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plans">
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface-1 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-text-primary">Compare plans</div>
                  <div className="mt-1 text-[13px] text-text-muted">
                    Four tiers, launch promos, and model access badges aligned to the current PR
                    scope.
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-0 px-3 py-1.5 text-[12px] text-text-secondary">
                  <Crown size={14} className="text-accent" />
                  Current selection: {activePlan}
                </div>
              </div>
            </div>

            <PlanComparisonGrid activePlan={activePlan} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
