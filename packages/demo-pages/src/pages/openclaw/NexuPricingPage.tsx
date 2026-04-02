import { Badge, Button, Tabs, TabsList, TabsTrigger } from "@nexu-design/ui-web";
import {
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Crown,
  HelpCircle,
  Mail,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { usePageTitle } from "../../hooks/usePageTitle";

type BillingMode = "monthly" | "yearly";

const PLANS = [
  {
    id: "free",
    name: "Free",
    icon: Sparkles,
    tagline: "Try nexu with BYOK or light hosted usage",
    monthlyPrice: 0,
    yearlyPrice: 0,
    firstMonthPrice: null,
    firstMonthDiscount: null,
    yearSavings: null,
    credits: { simple: "10–30 simple tasks / day", complex: "1–3 complex tasks / day" },
    creditsRaw: "100 credits / day",
    highlight: false,
    badge: null,
    ctaLabel: "Start free",
    ctaVariant: "outline" as const,
    features: [
      { label: "BYOK model keys", included: true, note: null },
      { label: "Extra credit packs", included: false, note: "Upgrade to Plus first" },
      { label: "Priority queue", included: false, note: null },
      { label: "Community support", included: true, note: null },
    ],
  },
  {
    id: "plus",
    name: "Plus",
    icon: Zap,
    tagline: "For independent builders shipping every week",
    monthlyPrice: 19,
    yearlyPrice: 16,
    firstMonthPrice: null,
    firstMonthDiscount: null,
    yearSavings: 36,
    credits: { simple: "200–600 simple tasks / month", complex: "20–60 complex tasks / month" },
    creditsRaw: "2,000 credits / month",
    highlight: false,
    badge: null,
    ctaLabel: "Upgrade to Plus",
    ctaVariant: "outline" as const,
    features: [
      { label: "BYOK model keys", included: true, note: null },
      { label: "Extra credit packs", included: true, note: null },
      { label: "Priority queue", included: false, note: null },
      { label: "Email support", included: true, note: null },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    icon: Crown,
    tagline: "Heavy daily usage with premium models included",
    monthlyPrice: 99,
    yearlyPrice: 49,
    firstMonthPrice: 76,
    firstMonthDiscount: "23% Off",
    yearSavings: 600,
    credits: {
      simple: "1,100–3,300 simple tasks / month",
      complex: "110–330 complex tasks / month",
    },
    creditsRaw: "11,000 credits / month",
    highlight: true,
    badge: "Most popular",
    ctaLabel: "Upgrade to Pro",
    ctaVariant: "default" as const,
    features: [
      { label: "BYOK model keys", included: true, note: null },
      { label: "Extra credit packs", included: true, note: null },
      { label: "Priority queue", included: true, note: null },
      { label: "Priority email support", included: true, note: null },
    ],
  },
];

const FAQS = [
  {
    q: "What are credits?",
    a: "Credits are the hosted usage allowance for nexu Official models. 100 credits ≈ $1 of hosted usage. BYOK traffic does not consume hosted credits.",
  },
  {
    q: "What are credit packs?",
    a: "Credit packs are one-time top-ups outside your subscription. They become available immediately, expire after 30 days, and are consumed after your plan allowance.",
  },
  {
    q: "What is different about yearly billing?",
    a: "Yearly billing unlocks the biggest savings: Plus goes to $16/month and Pro to $49/month. You pay upfront for the year.",
  },
  {
    q: "Can Free or Plus use premium models?",
    a: "Pro includes premium hosted model allowance. Plus can still reach premium models with extra credit packs, or you can use BYOK with any plan.",
  },
];

function useCountdown() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return useMemo(() => {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    const diff = Math.max(0, endOfMonth.getTime() - now);
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins: Math.floor((diff % 3600000) / 60000),
      secs: Math.floor((diff % 60000) / 1000),
    };
  }, [now]);
}

export default function NexuPricingPage() {
  usePageTitle("Pricing");
  const [billing, setBilling] = useState<BillingMode>("yearly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const countdown = useCountdown();

  return (
    <div className="min-h-screen bg-surface-0">
      <div className="w-full bg-text-primary text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 px-6 py-2.5 text-center">
          <Clock size={13} className="shrink-0 text-white/70" />
          <span className="text-[12px] font-medium">
            Limited-time offer · Pro yearly{" "}
            <span className="text-[var(--color-warning)]">50% Off</span>
          </span>
          <div className="flex items-center gap-1">
            {[
              { label: "days", value: countdown.days },
              { label: "hours", value: countdown.hours },
              { label: "mins", value: countdown.mins },
              { label: "secs", value: countdown.secs },
            ].map((segment, index) => (
              <div key={segment.label} className="flex items-center gap-1">
                {index > 0 && <span className="text-white/30">:</span>}
                <span className="inline-flex h-[22px] w-[26px] items-center justify-center rounded bg-white/15 text-[12px] font-bold">
                  {String(segment.value).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-16 pt-12">
        <div className="text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[11px] font-medium text-accent">
            <Zap size={12} /> Cloud Edition pricing
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            Hosted credits for teams that want to move fast
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary">
            Monthly credits for hosted usage, extra credit packs when you need a burst, and BYOK
            when you want full control.
          </p>

          <div className="mt-7 flex items-center justify-center">
            <Tabs value={billing} onValueChange={(value) => setBilling(value as BillingMode)}>
              <TabsList>
                <TabsTrigger value="yearly" className="gap-1.5">
                  Yearly
                  <span className="rounded-full bg-[var(--color-success)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-success)]">
                    Save up to 50%
                  </span>
                </TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 items-stretch sm:grid-cols-3">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const price = billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            const discountTag =
              billing === "yearly" && plan.monthlyPrice > 0
                ? `${Math.floor((1 - plan.yearlyPrice / plan.monthlyPrice) * 100)}% Off`
                : billing === "monthly"
                  ? plan.firstMonthDiscount
                  : null;

            return (
              <div
                key={plan.id}
                className={[
                  "rounded-3xl border p-6 text-left shadow-sm",
                  plan.highlight
                    ? "border-accent bg-accent/5 shadow-[0_20px_60px_rgba(92,99,255,0.15)]"
                    : "border-border bg-surface-1",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-0">
                    <Icon size={16} className="text-text-secondary" />
                  </div>
                  <span className="text-base font-semibold text-text-primary">{plan.name}</span>
                  {plan.badge ? <Badge variant="accent">{plan.badge}</Badge> : null}
                  {discountTag ? <Badge variant="outline">{discountTag}</Badge> : null}
                </div>

                <p className="mt-3 text-sm text-text-muted">{plan.tagline}</p>

                <div className="mt-5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-text-primary">${price}</span>
                    <span className="text-sm text-text-muted">/ month</span>
                  </div>
                  {billing === "yearly" && plan.yearSavings ? (
                    <div className="mt-2 text-xs text-[var(--color-success)]">
                      Save ${plan.yearSavings} / year
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 rounded-2xl bg-surface-0 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                    Hosted credits
                  </div>
                  <div className="mt-2 text-sm font-medium text-text-primary">
                    {plan.creditsRaw}
                  </div>
                  <div className="mt-2 text-sm text-text-secondary">{plan.credits.simple}</div>
                  <div className="text-sm text-text-secondary">{plan.credits.complex}</div>
                </div>

                <ul className="mt-6 space-y-3 text-sm text-text-secondary">
                  {plan.features.map((feature) => (
                    <li key={feature.label} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-surface-0">
                        <Check
                          size={12}
                          className={feature.included ? "text-accent" : "text-text-muted"}
                        />
                      </span>
                      <span>
                        {feature.label}
                        {feature.note ? (
                          <span className="text-text-muted"> · {feature.note}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button className="mt-6 w-full" variant={plan.ctaVariant}>
                  {plan.ctaLabel}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-border bg-surface-1 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Zap size={16} className="text-accent" />
              <h2 className="text-lg font-semibold text-text-primary">Credit packs</h2>
            </div>
            <p className="text-sm text-text-muted">
              One-time top-ups for launches, demos, or a heavy sprint. Packs are available on Plus
              and Pro.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { credits: "5,000", price: "$5", savings: "Starter" },
                { credits: "20,000", price: "$15", savings: "Save 25%" },
                { credits: "50,000", price: "$30", savings: "Save 40%" },
              ].map((pack) => (
                <div
                  key={pack.credits}
                  className="rounded-2xl border border-border bg-surface-0 p-4"
                >
                  <div className="text-lg font-semibold text-text-primary">{pack.credits}</div>
                  <div className="text-sm text-text-muted">credits</div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-text-primary">{pack.price}</div>
                    <Badge variant="outline">{pack.savings}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface-1 p-6">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-text-primary" />
              <h2 className="text-lg font-semibold text-text-primary">Need enterprise billing?</h2>
            </div>
            <p className="mt-3 text-sm text-text-muted">
              Custom invoicing, committed usage, and rollout support for larger teams.
            </p>
            <div className="mt-5 space-y-2 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-text-muted" /> Invoice workflows
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle size={14} className="text-text-muted" /> Migration planning
              </div>
              <div className="flex items-center gap-2">
                <Crown size={14} className="text-text-muted" /> Priority support
              </div>
            </div>
            <Button asChild className="mt-6 w-full" variant="outline">
              <Link to="/openclaw/usage">See hosted usage details</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-border bg-surface-1 p-6">
          <h2 className="text-lg font-semibold text-text-primary">FAQ</h2>
          <div className="mt-4 space-y-3">
            {FAQS.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div key={faq.q} className="rounded-2xl border border-border bg-surface-0 p-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <span className="text-sm font-semibold text-text-primary">{faq.q}</span>
                    {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {open ? (
                    <p className="mt-3 text-sm leading-6 text-text-secondary">{faq.a}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
