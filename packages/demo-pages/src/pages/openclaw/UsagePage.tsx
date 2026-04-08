import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Info,
  Package,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/* ── Mock data (mirrors useBudget values) ── */

/** Plus / Pro only — one-time add-on credits (prototype). Validity: 1 month. */
const CREDIT_PACKS = [
  { id: "s", credits: 2000, price: 20, label: "2,000 积分" },
  { id: "m", credits: 5200, price: 50, label: "5,200 积分", badge: "多送 4%" },
  { id: "l", credits: 11000, price: 100, label: "11,000 积分", badge: "多送 10%" },
  { id: "xl", credits: 55000, price: 500, label: "55,000 积分", badge: "多送 10%" },
] as const;

type PlanKey = "free" | "plus" | "pro";

const PLAN_META: Record<
  PlanKey,
  {
    label: string;
    accent: string;
    bg: string;
    upgradeLabel: string | null;
    total: number;
    baseRemaining: number;
    bonusRemaining: number;
    dailyHint: string;
  }
> = {
  free: {
    label: "Free",
    accent: "text-text-primary",
    bg: "bg-surface-2",
    upgradeLabel: "升级",
    total: 100,
    baseRemaining: 42,
    bonusRemaining: 300,
    dailyHint: "100 积分/天",
  },
  plus: {
    label: "Plus",
    accent: "text-[var(--color-info)]",
    bg: "bg-[var(--color-info)]/8",
    upgradeLabel: "升级至 Pro",
    total: 2000,
    baseRemaining: 1280,
    bonusRemaining: 300,
    dailyHint: "2,000 积分/月",
  },
  pro: {
    label: "Pro",
    accent: "text-[var(--color-brand-primary)]",
    bg: "bg-[var(--color-brand-primary)]/8",
    upgradeLabel: null,
    total: 11000,
    baseRemaining: 8750,
    bonusRemaining: 300,
    dailyHint: "11,000 积分/月",
  },
};

const PAGE_SIZE = 10;

const USAGE_LOG = [
  { id: 1, detail: "每日签到", date: "2026-03-30", delta: +100 },
  { id: 2, detail: "竞品分析报告生成", date: "2026-03-28", delta: -210 },
  { id: 3, detail: "每日签到", date: "2026-03-27", delta: +100 },
  { id: 4, detail: "周报自动撰写", date: "2026-03-25", delta: -135 },
  { id: 5, detail: "每日签到", date: "2026-03-24", delta: +100 },
  { id: 6, detail: "小红书笔记批量生成", date: "2026-03-22", delta: -88 },
  { id: 7, detail: "Agents", date: "2026-03-01", delta: -92 },
  { id: 8, detail: "AI 热门帖子的整理与分析", date: "2026-02-22", delta: -148 },
  { id: 9, detail: "每日签到", date: "2026-02-20", delta: +100 },
  { id: 10, detail: "用户访谈记录整理", date: "2026-02-18", delta: -176 },
  { id: 11, detail: "邮件营销文案优化", date: "2026-02-15", delta: -62 },
  { id: 12, detail: "积分包购买 (5,200)", date: "2026-02-10", delta: +5200 },
  { id: 13, detail: "如何制作 TikTok 商品营销视频", date: "2026-01-29", delta: -65 },
  { id: 14, detail: "推荐奖励", date: "2026-01-28", delta: +500 },
  { id: 15, detail: "产品路线图梳理", date: "2026-01-26", delta: -203 },
  { id: 16, detail: "客户成功案例撰写", date: "2026-01-24", delta: -154 },
  { id: 17, detail: "分析付费用户数据中与电商相关的内容", date: "2026-01-21", delta: -167 },
  { id: 18, detail: "SEO 关键词分析", date: "2026-01-19", delta: -91 },
  { id: 19, detail: "GitHub Star 奖励", date: "2026-01-15", delta: +300 },
  { id: 20, detail: "注册赠送积分", date: "2026-01-15", delta: +1000 },
  { id: 21, detail: "社交媒体分享奖励 (X)", date: "2026-01-16", delta: +200 },
  { id: 22, detail: "社交媒体分享奖励 (小红书)", date: "2026-01-17", delta: +200 },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function UsagePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planFromQuery = searchParams.get("plan") as PlanKey | null;
  const planKey: PlanKey =
    planFromQuery === "free" || planFromQuery === "plus" || planFromQuery === "pro"
      ? planFromQuery
      : "pro";
  const plan = PLAN_META[planKey];
  const packParam = searchParams.get("pack");
  const PACK_REMAINING: Record<string, { label: string; remaining: number }> = {
    "2000": { label: "2,000 积分包", remaining: 1620 },
    "5200": { label: "5,200 积分包", remaining: 3840 },
    "11000": { label: "11,000 积分包", remaining: 8200 },
    "55000": { label: "55,000 积分包", remaining: 41500 },
  };
  const activePack = packParam && PACK_REMAINING[packParam] ? PACK_REMAINING[packParam] : null;
  const totalRemaining = plan.baseRemaining + plan.bonusRemaining + (activePack?.remaining ?? 0);
  const showCreditPackBlock = planKey === "plus" || planKey === "pro";
  const [showPlanTip, setShowPlanTip] = useState(false);
  const [showBonusTip, setShowBonusTip] = useState(false);
  const [showPackTip, setShowPackTip] = useState(false);
  const [page, setPage] = useState(0);

  const [autoEnabled, setAutoEnabled] = useState(false);
  const [autoThreshold, setAutoThreshold] = useState(500);
  const [autoPackId, setAutoPackId] = useState<string>("s");
  const [showThresholdDropdown, setShowThresholdDropdown] = useState(false);
  const [showPackDropdown, setShowPackDropdown] = useState(false);
  const THRESHOLD_OPTIONS = [100, 200, 500, 1000, 2000];
  const [paymentBound, setPaymentBound] = useState(false);
  const mockCard = { brand: "Visa", last4: "4242" };
  const totalPages = Math.ceil(USAGE_LOG.length / PAGE_SIZE);
  const pageData = USAGE_LOG.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div
      className="min-h-screen bg-[var(--color-bg)] text-text-primary"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div className="flex items-start justify-center min-h-screen py-16 px-4">
        <div className="w-full max-w-[520px]">
          {/* ── Header ── */}
          <div className="mb-6">
            <h1
              className="text-[20px] font-semibold text-text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              使用情况
            </h1>
          </div>

          {/* ── Credits overview card ── */}
          <div className="rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] overflow-visible">
            {/* Plan badge + upgrade */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${plan.bg}`}>
                  <Zap size={13} className={plan.accent} />
                </div>
                <span className={`text-[15px] font-bold ${plan.accent}`}>{plan.label}</span>
              </div>
              {plan.upgradeLabel && (
                <button
                  type="button"
                  onClick={() => navigate("/openclaw/pricing")}
                  className="px-3.5 py-1.5 rounded-full bg-text-primary text-white text-[11px] font-semibold leading-none hover:opacity-85 transition-opacity"
                >
                  {plan.upgradeLabel}
                </button>
              )}
            </div>

            <div className="mx-5 border-t border-border/50" />

            {/* Credits breakdown */}
            <div className="px-5 py-4 space-y-3.5">
              {/* Total remaining */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[var(--color-brand-primary)] text-[13px]">✦</span>
                  <span className="text-[14px] font-semibold text-text-primary">剩余积分总量</span>
                </div>
                <span
                  className="text-[18px] font-bold text-text-primary tabular-nums"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {totalRemaining.toLocaleString()}
                </span>
              </div>

              <div className="border-t border-border/40" />

              {/* Plan credits */}
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-1 cursor-help"
                    onMouseEnter={() => setShowPlanTip(true)}
                    onMouseLeave={() => setShowPlanTip(false)}
                  >
                    <span className="text-[12px] text-text-muted">套餐积分余额</span>
                    <Info size={11} className="text-text-muted/60" />
                  </div>
                  <span
                    className="text-[13px] text-text-secondary tabular-nums"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {plan.baseRemaining.toLocaleString()}
                    <span className="text-text-muted">/{plan.total.toLocaleString()}</span>
                  </span>
                </div>
                {showPlanTip && (
                  <div className="mt-1.5 text-[11px] text-text-muted leading-relaxed bg-surface-2 rounded-lg px-3 py-2">
                    {planKey === "free"
                      ? "每天发放 100 积分，次日重置。"
                      : `每月随套餐发放 ${plan.total.toLocaleString()} 积分，周期结束后重置。`}
                  </div>
                )}
              </div>

              <div className="border-t border-border/40" />

              {/* Bonus credits */}
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-1 cursor-help"
                    onMouseEnter={() => setShowBonusTip(true)}
                    onMouseLeave={() => setShowBonusTip(false)}
                  >
                    <span className="text-[12px] text-text-muted">赠送积分余额</span>
                    <Info size={11} className="text-text-muted/60" />
                  </div>
                  <span
                    className="text-[13px] text-text-secondary tabular-nums"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {plan.bonusRemaining.toLocaleString()}
                  </span>
                </div>
                {showBonusTip && (
                  <div className="mt-1.5 text-[11px] text-text-muted leading-relaxed bg-surface-2 rounded-lg px-3 py-2">
                    来自注册奖励、完成任务等活动。消耗顺序：套餐积分 → 积分包 → 赠送积分。
                  </div>
                )}
              </div>

              {/* Credit pack balance */}
              {activePack && (
                <>
                  <div className="border-t border-border/40" />
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center gap-1 cursor-help"
                        onMouseEnter={() => setShowPackTip(true)}
                        onMouseLeave={() => setShowPackTip(false)}
                      >
                        <span className="text-[12px] text-text-muted">积分包余额</span>
                        <Info size={11} className="text-text-muted/60" />
                      </div>
                      <span
                        className="text-[13px] text-text-secondary tabular-nums"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {activePack.remaining.toLocaleString()}
                      </span>
                    </div>
                    {showPackTip && (
                      <div className="mt-1.5 text-[11px] text-text-muted leading-relaxed bg-surface-2 rounded-lg px-3 py-2">
                        已购买的{activePack.label}，有效期 1 个月。消耗顺序：套餐积分 → 积分包 →
                        赠送积分。
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Credit packs (Plus / Pro) ── */}
          {showCreditPackBlock && (
            <div className="mt-3 rounded-2xl border border-border bg-white shadow-[var(--shadow-rest)] overflow-visible px-5 py-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
                  <Package size={13} className="text-text-secondary" />
                </div>
                <div>
                  <span className="text-[13px] font-semibold text-text-primary">积分包</span>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                    额外积分一次性到账，有效期 1 个月。100 积分 = $1。
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
                {CREDIT_PACKS.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    className="group relative rounded-xl border border-border px-3 py-3 text-left hover:border-[var(--color-brand-primary)]/40 hover:shadow-[0_0_0_1px_var(--color-brand-primary)]/10 transition-all cursor-pointer bg-transparent w-full"
                    onClick={() =>
                      window.open(`https://buy.stripe.com/nexu_credits_${pack.price}`, "_blank")
                    }
                  >
                    <div
                      className="text-[13px] font-bold text-text-primary tabular-nums"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {pack.label}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[12px] font-semibold text-text-secondary">
                        ${pack.price}
                      </span>
                      {"badge" in pack && pack.badge && (
                        <span className="text-[10px] font-medium text-[var(--color-success)] leading-none px-1.5 py-0.5 rounded-md bg-[var(--color-success)]/10">
                          {pack.badge}
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-x-3 bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="w-full py-1 rounded-md bg-[var(--color-brand-primary)] text-white text-[11px] font-semibold text-center leading-none">
                        购买
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate("/openclaw/pricing#credit-packs")}
                className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-medium text-text-secondary hover:text-text-primary border border-border hover:bg-surface-2/40 transition-colors"
              >
                查看全部套餐与说明
                <ChevronRight size={14} className="text-text-muted" />
              </button>
            </div>
          )}

          {/* ── Auto-purchase (Plus / Pro) ── */}
          {showCreditPackBlock && (
            <div className="mt-3 rounded-2xl border border-border bg-white shadow-[var(--shadow-rest)] overflow-visible px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
                    <RefreshCw size={13} className="text-text-secondary" />
                  </div>
                  <div>
                    <span className="text-[13px] font-semibold text-text-primary">自动购买</span>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                      积分不足时自动补充，避免任务中断
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoEnabled(!autoEnabled)}
                  className={`relative w-[36px] h-[20px] rounded-full transition-colors shrink-0 ${
                    autoEnabled ? "bg-[var(--color-brand-primary)]" : "bg-[var(--color-border)]"
                  }`}
                >
                  <span
                    className={`absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white shadow-sm transition-transform ${
                      autoEnabled ? "left-[18px]" : "left-[2px]"
                    }`}
                  />
                </button>
              </div>

              {autoEnabled && (
                <div className="mt-4 pt-3.5 border-t border-border/40 space-y-3">
                  {/* Payment method — gate for auto-purchase */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-text-muted">支付方式</span>
                    {paymentBound ? (
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-surface-1 text-[12px] font-medium text-text-primary">
                          <CreditCard size={12} className="text-text-muted" />
                          {mockCard.brand} •••• {mockCard.last4}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            window.open("https://billing.stripe.com/p/login/nexu", "_blank")
                          }
                          className="text-[11px] text-[var(--color-brand-primary)] font-medium hover:opacity-80 transition-opacity"
                        >
                          更换
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          window.open("https://billing.stripe.com/p/login/nexu", "_blank");
                          setTimeout(() => setPaymentBound(true), 2000);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--color-brand-primary)]/30 bg-[var(--color-brand-primary)]/5 text-[12px] font-medium text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/10 transition-colors"
                      >
                        <CreditCard size={12} />
                        绑定支付方式
                        <ArrowUpRight size={12} className="shrink-0 opacity-60" />
                      </button>
                    )}
                  </div>

                  {!paymentBound && (
                    <div className="rounded-lg bg-[var(--color-warning)]/6 border border-[var(--color-warning)]/15 px-3 py-2">
                      <p className="text-[11px] text-[var(--color-warning)] leading-relaxed font-medium">
                        需要先绑定支付方式才能启用自动购买。点击上方按钮前往 Stripe 安全绑定银行卡。
                      </p>
                    </div>
                  )}

                  {paymentBound && (
                    <>
                      {/* Threshold */}
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-text-muted">当积分低于</span>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setShowThresholdDropdown(!showThresholdDropdown);
                              setShowPackDropdown(false);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-surface-1 text-[12px] font-medium text-text-primary tabular-nums hover:bg-surface-2 transition-colors"
                          >
                            {autoThreshold.toLocaleString()} 积分
                            <ChevronDown size={12} className="text-text-muted" />
                          </button>
                          {showThresholdDropdown && (
                            <div className="absolute right-0 top-full mt-1 z-30 w-[140px] rounded-lg border border-border bg-surface-1 shadow-[var(--shadow-dropdown)] py-1">
                              {THRESHOLD_OPTIONS.map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => {
                                    setAutoThreshold(val);
                                    setShowThresholdDropdown(false);
                                  }}
                                  className={`w-full px-3 py-1.5 text-left text-[12px] tabular-nums transition-colors ${
                                    val === autoThreshold
                                      ? "text-[var(--color-brand-primary)] font-semibold bg-[var(--color-brand-primary)]/5"
                                      : "text-text-secondary hover:bg-surface-2"
                                  }`}
                                >
                                  {val.toLocaleString()} 积分
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pack selection */}
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-text-muted">自动购买</span>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setShowPackDropdown(!showPackDropdown);
                              setShowThresholdDropdown(false);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-surface-1 text-[12px] font-medium text-text-primary tabular-nums hover:bg-surface-2 transition-colors"
                          >
                            {CREDIT_PACKS.find((p) => p.id === autoPackId)?.label ?? "2,000 积分"} ·
                            ${CREDIT_PACKS.find((p) => p.id === autoPackId)?.price ?? 20}
                            <ChevronDown size={12} className="text-text-muted" />
                          </button>
                          {showPackDropdown && (
                            <div className="absolute right-0 top-full mt-1 z-30 w-[200px] rounded-lg border border-border bg-surface-1 shadow-[var(--shadow-dropdown)] py-1">
                              {CREDIT_PACKS.map((pack) => (
                                <button
                                  key={pack.id}
                                  type="button"
                                  onClick={() => {
                                    setAutoPackId(pack.id);
                                    setShowPackDropdown(false);
                                  }}
                                  className={`w-full px-3 py-1.5 text-left text-[12px] tabular-nums flex items-center justify-between transition-colors ${
                                    pack.id === autoPackId
                                      ? "text-[var(--color-brand-primary)] font-semibold bg-[var(--color-brand-primary)]/5"
                                      : "text-text-secondary hover:bg-surface-2"
                                  }`}
                                >
                                  <span>{pack.label}</span>
                                  <span className="text-text-muted">${pack.price}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="rounded-lg bg-surface-2/60 px-3 py-2">
                        <p className="text-[11px] text-text-muted leading-relaxed">
                          当总积分低于{" "}
                          <span className="font-medium text-text-secondary">
                            {autoThreshold.toLocaleString()}
                          </span>{" "}
                          时，自动购买{" "}
                          <span className="font-medium text-text-secondary">
                            {CREDIT_PACKS.find((p) => p.id === autoPackId)?.label}
                          </span>
                          （${CREDIT_PACKS.find((p) => p.id === autoPackId)?.price}），从{" "}
                          <span className="font-medium text-text-secondary">
                            {mockCard.brand} •••• {mockCard.last4}
                          </span>{" "}
                          扣款。
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Usage log ── */}
          <div className="mt-6">
            <h2 className="text-[14px] font-semibold text-text-primary mb-3">使用记录</h2>

            <div className="rounded-2xl border border-border bg-white shadow-[var(--shadow-rest)] overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_100px_72px] gap-x-4 px-5 py-2.5 bg-surface-2/50 border-b border-border/50">
                <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide">
                  详情
                </span>
                <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide text-right">
                  日期
                </span>
                <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide text-right">
                  积分变更
                </span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border/40">
                {pageData.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[1fr_100px_72px] gap-x-4 px-5 py-3 items-center hover:bg-surface-2/30 transition-colors"
                  >
                    <span className="text-[13px] text-text-primary truncate">{row.detail}</span>
                    <span className="text-[12px] text-text-muted whitespace-nowrap tabular-nums text-right">
                      {formatDate(row.date)}
                    </span>
                    <span
                      className={`text-[13px] font-semibold tabular-nums text-right ${
                        row.delta > 0 ? "text-[var(--color-success)]" : "text-text-secondary"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {row.delta > 0
                        ? `+${row.delta.toLocaleString()}`
                        : row.delta.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-2.5 border-t border-border/50 bg-surface-2/30">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className={`inline-flex items-center gap-1 text-[12px] font-medium transition-colors ${
                      page === 0
                        ? "text-text-muted/30 cursor-not-allowed"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <ChevronLeft size={14} />
                    上一页
                  </button>
                  <span className="text-[11px] text-text-muted tabular-nums">
                    第 {page + 1}/{totalPages} 页
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className={`inline-flex items-center gap-1 text-[12px] font-medium transition-colors ${
                      page >= totalPages - 1
                        ? "text-text-muted/30 cursor-not-allowed"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    下一页
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="mt-8 text-center">
            <span className="text-[11px] text-text-muted">© 2026 Powerformer, Inc.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
