import { Button, Tabs, TabsList, TabsTrigger } from "@nexu-design/ui-web";
import {
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Crown,
  HelpCircle,
  Info,
  Mail,
  Minus,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useOpenClawDemoState } from "./demo-state";

// ── Plan data ──────────────────────────────────────────────────────────────────
const STANDARD_MODELS = [
  { name: "Kimi K2.5" },
  { name: "MiniMax M2.7" },
  { name: "GLM-5" },
  { name: "Gemini 3.1 Flash" },
  { name: "GPT-5.4 mini" },
];

const PREMIUM_MODELS = [
  { name: "Claude Opus 4.6" },
  { name: "Claude Sonnet 4.6" },
  { name: "Gemini 3.1 Pro" },
  { name: "GPT-5.4" },
];

const PLANS = [
  {
    id: "free",
    name: "Free",
    icon: Zap,
    tagline: "开发者 & BYOK",
    monthlyPrice: 0,
    yearlyPrice: 0,
    firstMonthPrice: null as number | null,
    firstMonthDiscount: null as string | null,
    yearSavings: null as number | null,
    credits: { simple: "约 10–30 个 / 天", complex: "约 1–3 个 / 天" },
    creditsRaw: "100 积分/天",
    highlight: false,
    badge: null as string | null,
    ctaLabel: "免费开始",
    ctaVariant: "outline" as const,
    features: [
      { label: "BYOK 自带密钥", included: true, note: null as string | null },
      { label: "额外积分包", included: false, note: "升级 Plus 后可购" as string | null },
      { label: "优先队列", included: false, note: null as string | null },
      { label: "社区支持", included: true, note: null as string | null },
    ],
    standardModels: "included" as "included" | "unlimited",
    premiumModels: false as boolean,
  },
  {
    id: "plus",
    name: "Plus",
    icon: Star,
    tagline: "个人轻度用户",
    monthlyPrice: 19,
    yearlyPrice: 16,
    firstMonthPrice: null as number | null,
    firstMonthDiscount: null as string | null,
    yearSavings: 36,
    credits: { simple: "约 200–600 个 / 月", complex: "约 20–60 个 / 月" },
    creditsRaw: "2,000 积分/月",
    highlight: false,
    badge: null as string | null,
    ctaLabel: "升级 Plus",
    ctaVariant: "outline" as const,
    features: [
      { label: "BYOK 自带密钥", included: true, note: null as string | null },
      { label: "额外积分包", included: true, note: null as string | null },
      { label: "优先队列", included: false, note: null as string | null },
      { label: "邮件支持", included: true, note: null as string | null },
    ],
    standardModels: "included" as "included" | "unlimited",
    premiumModels: false as boolean,
  },
  {
    id: "pro",
    name: "Pro",
    icon: Crown,
    tagline: "个人重度用户",
    monthlyPrice: 99,
    yearlyPrice: 49,
    firstMonthPrice: 76 as number | null,
    firstMonthDiscount: "23% Off" as string | null,
    yearSavings: 600,
    credits: { simple: "约 1,100–3,300 个 / 月", complex: "约 110–330 个 / 月" },
    creditsRaw: "11,000 积分/月",
    highlight: true,
    badge: "最受欢迎",
    ctaLabel: "升级 Pro",
    ctaVariant: "default" as const,
    features: [
      { label: "BYOK 自带密钥", included: true, note: null as string | null },
      { label: "额外积分包", included: true, note: null as string | null },
      { label: "优先队列", included: true, note: null as string | null },
      { label: "优先邮件支持", included: true, note: null as string | null },
    ],
    standardModels: "included" as "included" | "unlimited",
    premiumModels: true as boolean,
  },
];

const FAQS = [
  {
    q: "积分是什么？怎么消耗？",
    a: "积分是 nexu Official 模型的使用额度。每次调用 nexu 托管的 AI 模型时消耗积分，100 积分 = $1。BYOK（自带 API Key）不消耗积分，不受套餐限制。",
  },
  {
    q: "积分包是什么？怎么购买？",
    a: "积分包是套餐之外的「一次性补充包」，付款后积分立即到账，有效期 1 个月，按调用消耗。消耗顺序为：套餐积分 → 积分包 → 赠送积分。Plus 与 Pro 用户可在定价页选购不同档位；Free 用户需先升级至 Plus。100 积分 = $1，与套餐积分规则一致。",
  },
  {
    q: "免费版可以永久使用吗？",
    a: "可以。Free 套餐永久有效，每天约可执行 5 个任务（100 积分）。新用户注册额外赠送 1000 积分。",
  },
  {
    q: "BYOK 是什么？所有套餐都支持吗？",
    a: "BYOK（Bring Your Own Key）是指你自己填入 Anthropic、OpenAI、Google 等厂商的 API Key，直接调用原厂模型，不经过 nexu 积分系统。所有套餐（包括 Free）均支持 BYOK。",
  },
  {
    q: "年付和月付有什么区别？",
    a: "年付享受折扣：Plus 年付 $16/月（省 $36/年），Pro 年付 $49/月（50% Off，省 $600/年）。年付一次性扣除全年费用，不支持中途退款。",
  },
  {
    q: "Free 和 Plus 可以使用高级模型吗？",
    a: "Pro 套餐包含高级模型的套餐额度。Plus 用户可购买积分包补充额度后调用高级模型（按积分扣减），或升级至 Pro。Free 用户可先升级套餐或购买积分包（需 Plus 起）。BYOK 不受套餐模型列表限制。",
  },
  {
    q: "升级套餐后，原来的积分怎么处理？",
    a: "升级后原套餐积分立即清零，以新套餐的月度额度重新开始计算。升级费用按实际已使用时长补差价，不按整月计算——例如月付套餐已用 10 天，只需补剩余 20 天的差价。升级立即生效，订阅周期从升级当天重置。",
  },
  {
    q: "可以随时取消订阅吗？",
    a: "可以。取消后当前周期内仍可正常使用，到期不再续费。年付套餐取消后不退还剩余月份费用。",
  },
  {
    q: "优先队列是什么意思？",
    a: "在高峰时段，Pro 用户的请求会优先处理，响应速度更快。Free 和 Plus 用户在高峰期可能会有短暂排队。",
  },
];

// ── Model badge ────────────────────────────────────────────────────────────────
function StandardModelBadge({ type }: { type: "included" | "unlimited" }) {
  if (type === "unlimited") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[6px] bg-[var(--color-accent)] text-[var(--color-accent-fg)] text-[11px] font-semibold leading-none whitespace-nowrap shadow-sm">
        <span className="text-[9px]">✦</span>
        无限使用
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] bg-[var(--color-surface-3)] text-text-secondary text-[10px] font-medium leading-none whitespace-nowrap">
      套餐额度内
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
function useCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
  const diff = Math.max(0, endOfMonth.getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return { days, hours, mins, secs };
}

export default function NexuPricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const [showUpgradeDetails, setShowUpgradeDetails] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { loggedIn, setLoggedIn, plan: currentPlan, setPlan } = useOpenClawDemoState();
  const countdown = useCountdown();

  const planOrder = { free: 0, plus: 1, pro: 2 } as const;

  function getPlanCta(planId: "free" | "plus" | "pro") {
    if (!loggedIn) {
      if (planId === "free") {
        return { label: "登录并开始", variant: "default" as const, disabled: false };
      }
      return { label: "登录后升级", variant: "outline" as const, disabled: false };
    }

    if (planId === currentPlan) {
      return { label: "当前套餐", variant: "outline" as const, disabled: true };
    }

    if (planOrder[planId] < planOrder[currentPlan]) {
      return { label: "已包含", variant: "ghost" as const, disabled: true };
    }

    return { label: `升级 ${planId === "plus" ? "Plus" : "Pro"}`, variant: "default" as const, disabled: false };
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-0)]">
      {/* ── Limited-time banner ── */}
      <div className="w-full bg-text-primary text-white">
        <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-center gap-3">
          <Clock size={13} className="text-white/70 shrink-0" />
          <span className="text-[12px] font-medium">
            限时优惠 · Pro 年付{" "}
            <span className="font-bold text-[var(--color-warning)]">50% Off</span> · 仅剩
          </span>
          <div className="flex items-center gap-1">
            {[
              { val: countdown.days, label: "天" },
              { val: countdown.hours, label: "时" },
              { val: countdown.mins, label: "分" },
              { val: countdown.secs, label: "秒" },
            ].map((seg, i) => (
              <div key={seg.label} className="flex items-center gap-1">
                {i > 0 && <span className="text-[11px] text-white/40 font-mono">:</span>}
                <span className="inline-flex items-center justify-center w-[26px] h-[22px] rounded-[4px] bg-white/15 text-[12px] font-bold tabular-nums leading-none">
                  {String(seg.val).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-white/50">{seg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Header ── */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-brand-subtle)] border border-[var(--color-brand-primary)]/20 mb-5">
          <Zap size={12} className="text-[var(--color-brand-primary)]" />
          <span className="text-[11px] font-medium text-[var(--color-brand-primary)]">
            Cloud Edition
          </span>
        </div>
        <h1 className="text-[32px] font-bold text-text-primary leading-tight mb-3">
          选择适合你的方案
        </h1>
        <p className="text-[14px] text-text-secondary max-w-md mx-auto">
          从免费开始，随时升级。所有方案均支持 BYOK 自带密钥。
        </p>
        <div className="flex items-center justify-center mt-7">
          <Tabs value={billing} onValueChange={(v) => setBilling(v as "monthly" | "yearly")}>
            <TabsList>
              <TabsTrigger value="yearly" className="gap-1.5">
                年付
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] leading-none">
                  省最多 50%
                </span>
              </TabsTrigger>
              <TabsTrigger value="monthly">月付</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* ── Plan cards ── */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-stretch">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const price = billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            const yearHint =
              billing === "yearly" && plan.yearSavings ? `年付省 $${plan.yearSavings}` : null;
            const cta = getPlanCta(plan.id as "free" | "plus" | "pro");

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-[16px] border p-5 ${
                  plan.highlight
                    ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.03] shadow-[var(--shadow-card)] ring-1 ring-[var(--color-accent)]/10"
                    : "border-[var(--color-border-card)] bg-[var(--color-surface-1)]"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-fg)] text-[10px] font-medium leading-none whitespace-nowrap shadow-sm">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-[8px] bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-text-secondary" />
                  </div>
                  <span className="text-[14px] font-semibold text-text-primary">{plan.name}</span>
                  {(() => {
                    const tag =
                      billing === "yearly" && plan.monthlyPrice > 0
                        ? `${Math.floor((1 - plan.yearlyPrice / plan.monthlyPrice) * 100)}% Off`
                        : billing === "monthly" && plan.firstMonthDiscount
                          ? plan.firstMonthDiscount
                          : null;
                    return tag ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-[var(--color-brand-primary)]/10 text-[9px] font-bold text-[var(--color-brand-primary)] leading-none whitespace-nowrap">
                        {tag}
                      </span>
                    ) : null;
                  })()}
                </div>
                <p className="text-[11px] text-text-muted mb-4">{plan.tagline}</p>

                {/* Price + Credits — fixed-height zone so CTA aligns across columns */}
                <div className="min-h-[120px]">
                  <div className="mb-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[30px] font-bold text-text-primary leading-none">
                        {billing === "monthly" && plan.firstMonthPrice
                          ? `$${plan.firstMonthPrice}`
                          : price === 0
                            ? "$0"
                            : `$${price}`}
                      </span>
                      <span className="text-[12px] text-text-muted">/ 月</span>
                      {(billing === "monthly" ? plan.firstMonthPrice : plan.monthlyPrice > 0) && (
                        <span className="text-[13px] text-text-muted line-through">
                          ${plan.monthlyPrice}
                        </span>
                      )}
                    </div>
                    <div className="h-5 mt-1">
                      {yearHint && (
                        <span className="text-[11px] text-[var(--color-success)]">{yearHint}</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-text-muted">nexu Official 额度</span>
                      <span className="text-[11px] font-semibold text-text-primary tabular-nums">
                        {plan.creditsRaw}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-text-muted">简单任务</span>
                      <span className="text-[11px] font-medium text-text-secondary tabular-nums">
                        {plan.credits.simple}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-text-muted">复杂任务</span>
                      <span className="text-[11px] font-medium text-text-secondary tabular-nums">
                        {plan.credits.complex}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  variant={cta.variant}
                  size="sm"
                  className="w-full my-5 text-[12px]"
                  disabled={cta.disabled}
                  onClick={() => {
                    if (cta.disabled) return;
                    setLoggedIn(true);
                    setPlan(plan.id as "free" | "plus" | "pro");
                  }}
                >
                  {cta.label}
                </Button>

                {/* Divider */}
                <div className="border-t border-[var(--color-border-subtle)] mb-4" />

                {/* Features */}
                <div className="space-y-2.5 mb-5">
                  {plan.features.map((f) => (
                    <div key={f.label} className="flex items-center gap-2.5">
                      {f.included ? (
                        <Check size={13} className="text-[var(--color-success)] shrink-0" />
                      ) : (
                        <Minus size={13} className="text-text-muted shrink-0" />
                      )}
                      <span
                        className={`text-[12px] ${f.included ? "text-text-secondary" : "text-text-muted"}`}
                      >
                        {f.label}
                      </span>
                      {f.note && (
                        <span className="text-[10px] text-[var(--color-brand-primary)] ml-auto leading-none">
                          {f.note}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--color-border-subtle)] mb-4" />

                {/* Standard models */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                      标准模型
                    </span>
                    <StandardModelBadge type={plan.standardModels} />
                  </div>
                  <div className="space-y-1.5">
                    {STANDARD_MODELS.map((m) => (
                      <div key={m.name} className="flex items-center gap-2">
                        <Check size={11} className="text-[var(--color-success)] shrink-0" />
                        <span className="text-[11px] text-text-secondary">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Premium models */}
                <div>
                  <div className="mb-2">
                    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                      高级模型
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {PREMIUM_MODELS.map((m) => (
                      <div key={m.name} className="flex items-center gap-2">
                        {plan.premiumModels ? (
                          <Crown size={11} className="text-[var(--color-warning)] shrink-0" />
                        ) : (
                          <Minus size={11} className="text-text-muted shrink-0" />
                        )}
                        <span
                          className={`text-[11px] ${plan.premiumModels ? "text-text-secondary font-medium" : "text-text-muted line-through"}`}
                        >
                          {m.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── Enterprise column ── */}
          <div className="relative flex flex-col rounded-[16px] border border-[var(--color-border-card)] bg-[var(--color-surface-1)] p-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-[8px] bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                <Building2 size={14} className="text-text-secondary" />
              </div>
              <span className="text-[14px] font-semibold text-text-primary">Enterprise</span>
            </div>
            <p className="text-[11px] text-text-muted mb-4">团队 & 企业定制</p>

            {/* Price + Credits — same min-h as other columns */}
            <div className="min-h-[120px]">
              <div className="mb-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[30px] font-bold text-text-primary leading-none">定制</span>
                </div>
                <div className="h-5 mt-1">
                  <span className="text-[11px] text-text-muted">按需定价</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] text-text-muted">根据团队规模和用量</div>
                <div className="text-[11px] text-text-muted">定制专属方案</div>
              </div>
            </div>

            {/* CTA */}
            <Button
              variant="outline"
              size="sm"
              className="w-full my-5 text-[12px] gap-1.5"
              onClick={() => {
                window.location.assign("mailto:support@nexu.io?subject=Nexu Enterprise 咨询");
              }}
            >
              <Mail size={13} />
              联系我们
            </Button>

            <div className="border-t border-[var(--color-border-subtle)] mb-4" />

            <div className="flex-1 space-y-2.5">
              {[
                "包含 Pro 全部功能",
                "团队成员管理与权限控制",
                "统一账单 & 用量仪表盘",
                "自定义模型路由策略",
                "私有化部署选项",
                "SSO / SAML 单点登录",
                "SLA 保障 & 优先技术支持",
                "专属客户成功经理",
                "自定义积分额度与计费",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2.5">
                  <Check size={13} className="text-[var(--color-success)] shrink-0" />
                  <span className="text-[12px] text-text-secondary">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* New user gift note */}
        <p className="text-center text-[12px] text-text-muted mt-5">
          所有套餐新用户注册均赠送{" "}
          <span className="font-medium text-text-secondary">1,000 积分</span>
        </p>
      </div>

      {/* ── Credit packs (Plus / Pro) ── */}
      <div
        id="credit-packs"
        className="max-w-4xl mx-auto px-6 py-12 border-t border-[var(--color-border-subtle)] scroll-mt-24"
      >
        <h2 className="text-[18px] font-semibold text-text-primary mb-1">积分包</h2>
        <p className="text-[13px] text-text-secondary mb-6">
          额外积分一次性到账，有效期 1 个月，与套餐月度额度叠加使用。
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { credits: "2,000", price: "$20", hint: "" as string },
            { credits: "5,200", price: "$50", hint: "多送 4%" },
            { credits: "11,000", price: "$100", hint: "多送 10%" },
            { credits: "55,000", price: "$500", hint: "多送 10%" },
          ].map((row) => (
            <div
              key={row.credits}
              className="rounded-[14px] border border-[var(--color-border-card)] bg-[var(--color-surface-1)] p-5 flex flex-col"
            >
              <div className="text-[22px] font-bold text-text-primary tabular-nums leading-none">
                {row.credits}
              </div>
              <div className="text-[11px] text-text-muted mt-1">积分 · 有效期 1 个月</div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-[15px] font-semibold text-text-primary">{row.price}</span>
                {row.hint && (
                  <span className="text-[10px] font-medium text-[var(--color-success)] leading-none px-1.5 py-0.5 rounded-md bg-[var(--color-success)]/10">
                    {row.hint}
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 text-[12px]"
                disabled={!loggedIn || currentPlan === "free"}
              >
                {!loggedIn ? "登录后购买" : currentPlan === "free" ? "升级后购买" : "购买"}
              </Button>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-muted mt-5 text-center">
          仅 Plus / Pro 订阅用户可购买 · 100 积分 = $1 · 有效期自购买日起 1 个月
        </p>
      </div>

      {/* ── FAQ ── */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={16} className="text-text-muted" />
          <h2 className="text-[16px] font-semibold text-text-primary">常见问题</h2>
        </div>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={faq.q}
              className="rounded-[12px] border border-[var(--color-border-card)] bg-[var(--color-surface-1)] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--color-surface-2)] transition-colors"
              >
                <span className="text-[13px] font-medium text-text-primary pr-4">{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp size={14} className="text-text-muted shrink-0" />
                ) : (
                  <ChevronDown size={14} className="text-text-muted shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 border-t border-[var(--color-border-subtle)]">
                  <p className="text-[13px] text-text-secondary leading-relaxed pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Upgrade policy ── */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <button
          type="button"
          onClick={() => setShowUpgradeDetails(!showUpgradeDetails)}
          className="w-full flex items-center justify-between p-4 rounded-[12px] border border-[var(--color-border-card)] bg-[var(--color-surface-1)] hover:bg-[var(--color-surface-2)] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info size={14} className="text-text-muted" />
            <span className="text-[13px] font-medium text-text-primary">升级策略说明</span>
          </div>
          {showUpgradeDetails ? (
            <ChevronUp size={14} className="text-text-muted" />
          ) : (
            <ChevronDown size={14} className="text-text-muted" />
          )}
        </button>

        {showUpgradeDetails && (
          <div className="mt-2 p-5 rounded-[12px] border border-[var(--color-border-card)] bg-[var(--color-surface-1)] space-y-5">
            <div>
              <div className="text-[12px] font-semibold text-text-primary mb-3">
                升级费用计算（按使用时长补差价）
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    from: "月付",
                    to: "月付",
                    formula: "（升级后月费 − 升级前月费）× 剩余天数 / 当月总天数",
                  },
                  {
                    from: "月付",
                    to: "年付",
                    formula: "升级后年费 − 升级前月费 × 已使用天数 / 当月总天数",
                  },
                  {
                    from: "年付",
                    to: "年付",
                    formula: "（升级后年费 − 升级前年费）× 剩余天数 / 365",
                  },
                ].map((row) => (
                  <div
                    key={row.from + row.to}
                    className="p-3 rounded-[8px] bg-[var(--color-surface-2)]"
                  >
                    <div className="text-[11px] text-text-muted mb-1">
                      {row.from} → {row.to}
                    </div>
                    <div className="text-[12px] text-text-secondary font-medium">{row.formula}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "生效时机", desc: "升级成功后立即生效" },
                {
                  label: "补差价规则",
                  desc: "按当前订阅周期的实际已使用时长折算，只需支付剩余时段的差价，不按整月计算",
                },
                {
                  label: "计费周期",
                  desc: "升级当天成为新套餐 Day 1，下次扣费日 = 升级日 + 1 个订阅周期",
                },
                { label: "原订阅", desc: "自动停止续费，无需手动取消" },
                { label: "原套餐积分", desc: "升级后立即清零，以新套餐的月度额度重新开始计算" },
              ].map((rule) => (
                <div key={rule.label} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] mt-1.5 shrink-0" />
                  <div>
                    <span className="text-[12px] font-medium text-text-primary">
                      {rule.label}：
                    </span>
                    <span className="text-[12px] text-text-secondary">{rule.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="max-w-5xl mx-auto px-6 pt-4 pb-16 text-center">
        <p className="text-[12px] text-text-muted">所有价格均以美元计价。100 积分 = $1。</p>
        <p className="text-[11px] text-text-muted mt-2">© 2026 Powerformer, Inc.</p>
      </div>
    </div>
  );
}
