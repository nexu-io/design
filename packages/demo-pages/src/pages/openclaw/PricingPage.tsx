import {
  Card,
  PageHeader,
  UnderlineTabs,
  UnderlineTabsContent,
  UnderlineTabsList,
  UnderlineTabsTrigger,
} from "@nexu-design/ui-web";
import { Crown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useOpenClawDemoState } from "./demo-state";
import {
  type BillingPlanId,
  PlanComparisonGrid,
  PricingDemoControls,
  type UsageQuotaState,
  UsageSummaryPanel,
} from "./pricing-demo";

type PricingPageProps = {
  initialTab?: "usage" | "plans";
};

export default function PricingPage({ initialTab = "usage" }: PricingPageProps) {
  usePageTitle("Pricing & Usage");
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn, plan, setPlan } = useOpenClawDemoState();

  const [activeTab, setActiveTab] = useState<"usage" | "plans">(initialTab);
  const [usageState, setUsageState] = useState<UsageQuotaState>("warning");
  const activePlan: BillingPlanId = plan;

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    const hash = location.hash.replace(/^#/, "");

    if (tab === "plans" || hash === "plans" || hash === "credit-packs") {
      setActiveTab("plans");
      return;
    }

    if (tab === "usage" || hash === "usage") {
      setActiveTab("usage");
      return;
    }

    setActiveTab(initialTab);
  }, [initialTab, location.hash, location.search]);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8">
      <PageHeader
        title="Pricing / Usage"
        description="Preview plan comparison, credit usage, rewards, and upgrade states for the cloud prototype."
      />

      <PricingDemoControls
        isSignedIn={loggedIn}
        onSignedInChange={setLoggedIn}
        planId={activePlan}
        onPlanChange={(value) => {
          if (value === "free" || value === "plus" || value === "pro") {
            setPlan(value);
          }
        }}
        usageState={usageState}
        onUsageStateChange={setUsageState}
      />

      <UnderlineTabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "usage" | "plans")}
      >
        <UnderlineTabsList className="mb-6 w-full sm:w-fit">
          <UnderlineTabsTrigger value="usage">
            <TrendingUp size={14} /> Usage overview
          </UnderlineTabsTrigger>
          <UnderlineTabsTrigger value="plans">
            <Crown size={14} /> Plan comparison
          </UnderlineTabsTrigger>
        </UnderlineTabsList>

        <UnderlineTabsContent value="usage">
          <div className="space-y-6">
            <UsageSummaryPanel
              planId={activePlan}
              usageState={usageState}
              isSignedIn={loggedIn}
              onViewPlans={() => setActiveTab("plans")}
              onOpenRewards={() => navigate("/openclaw/rewards")}
            />

            <Card variant="static" padding="lg">
              <h2 className="mb-4 text-sm font-semibold text-text-primary">
                Pricing &amp; usage FAQ
              </h2>
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
            </Card>
          </div>
        </UnderlineTabsContent>

        <UnderlineTabsContent value="plans">
          <div id="credit-packs" className="space-y-4 scroll-mt-6">
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
        </UnderlineTabsContent>
      </UnderlineTabs>
    </div>
  );
}
