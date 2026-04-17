import {
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  cn,
} from "@nexu-design/ui-web";
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  Cable,
  Check,
  ChevronDown,
  Code2,
  Cpu,
  Diamond,
  Globe,
  HelpCircle,
  MousePointer2,
  Paperclip,
  Search,
  Settings,
  Sparkles,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useBudget } from "../../hooks/useBudget";
import { useLocale } from "../../hooks/useLocale";
import { openExternal } from "../../utils/open-external";
import type { ChannelId } from "./ChannelsView";
import { ONBOARDING_CHANNELS, SEEDANCE_BANNER_DISMISSED_KEY } from "./channelSetup";
import { getProviderDetails } from "./data";
import {
  CreditIcon,
  ProviderLogo,
  TierPlusBadge,
  TierProBadge,
  getModelIconProvider,
} from "./iconHelpers";

const SEEDANCE_COUNTDOWN_CYCLE_MS = 2 * 24 * 60 * 60 * 1000;
const SEEDANCE_COUNTDOWN_LOOP_END_MS = Date.now() + SEEDANCE_COUNTDOWN_CYCLE_MS - 1000;

function formatSeedanceCompactLabel(
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  locale: "en" | "zh",
) {
  const paddedDays = String(days).padStart(2, "0");
  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  if (locale === "zh") {
    return `${paddedDays}天 ${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${paddedDays}d ${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

function getSeedanceCountdown(now: number, locale: "en" | "zh") {
  const cycleRemainingMs =
    (((SEEDANCE_COUNTDOWN_LOOP_END_MS - now) % SEEDANCE_COUNTDOWN_CYCLE_MS) +
      SEEDANCE_COUNTDOWN_CYCLE_MS) %
    SEEDANCE_COUNTDOWN_CYCLE_MS;
  const remainingMs =
    cycleRemainingMs === 0 ? SEEDANCE_COUNTDOWN_CYCLE_MS - 1000 : cycleRemainingMs;
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    compactLabel: formatSeedanceCompactLabel(days, hours, minutes, seconds, locale),
  };
}

function SeedanceCountdownBlocks({
  now,
  locale,
  compact = false,
}: {
  now: number;
  locale: "en" | "zh";
  compact?: boolean;
}) {
  const countdown = getSeedanceCountdown(now, locale);
  if (!compact) return null;
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold leading-none shadow-sm tabular-nums"
      style={{
        color: "white",
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--color-warning) 82%, white), color-mix(in srgb, var(--color-danger) 78%, var(--color-warning) 22%))",
        borderColor: "color-mix(in srgb, var(--color-danger) 56%, var(--color-warning) 32%, white)",
        boxShadow: "var(--shadow-focus)",
      }}
    >
      <span>{countdown.compactLabel}</span>
    </div>
  );
}

const HARNESS_LIST = [
  { id: "pi", name: "Pi", desc: "Built-in Code Agent", icon: Terminal },
  { id: "claude-code", name: "Claude Code", desc: "Anthropic CLI", icon: Sparkles },
  { id: "codex", name: "Codex", desc: "OpenAI CLI", icon: Code2 },
  { id: "cursor", name: "Cursor", desc: "Cursor IDE", icon: MousePointer2 },
  { id: "gemini-cli", name: "Gemini CLI", desc: "Google CLI", icon: Diamond },
];

const QUICK_ACTIONS = [
  { labelKey: "ws.home.actionCron", icon: Cable, promptKey: "ws.home.actionCronPrompt" },
  { labelKey: "ws.home.actionDesktop", icon: Cpu, promptKey: "ws.home.actionDesktopPrompt" },
  {
    labelKey: "ws.home.actionAnalysis",
    icon: BarChart3,
    promptKey: "ws.home.actionAnalysisPrompt",
  },
  { labelKey: "ws.home.actionWebsite", icon: Globe, promptKey: "ws.home.actionWebsitePrompt" },
] as const;

type HomeView = { type: "settings"; tab?: "general" | "providers" } | { type: "channels" };

type HomeDashboardProps = {
  onNavigate: (view: HomeView) => void;
  showTyping?: boolean;
  onTypingComplete?: () => void;
  stars?: number | null;
  budgetStatus?: "healthy" | "warning" | "depleted";
  demoPlan?: "free" | "plus" | "pro";
  onRequestStarOnboarding: () => void;
  onRequestSeedanceModal: () => void;
  githubUrl: string;
  showBudgetDialog?: boolean;
  onBudgetDialogChange?: (open: boolean) => void;
  connectedChannels?: Set<ChannelId>;
};

export function HomeDashboard({
  onNavigate,
  showTyping: _showTyping,
  onTypingComplete: _onTypingComplete,
  stars: _stars,
  budgetStatus,
  demoPlan = "pro",
  onRequestStarOnboarding: _onRequestStarOnboarding,
  onRequestSeedanceModal,
  githubUrl: _githubUrl,
  showBudgetDialog = false,
  onBudgetDialogChange,
  connectedChannels,
}: HomeDashboardProps) {
  const { locale, t } = useLocale();
  const budget = useBudget(budgetStatus);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoHover, setVideoHover] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "bot"; content: string }[]>([]);
  const [activeHarness, setActiveHarness] = useState("pi");
  const [showHarnessDropdown, setShowHarnessDropdown] = useState(false);
  const harnessDropdownRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const handleSendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      {
        role: "bot",
        content:
          "📋 工作流初始化\n\n收到你的需求，让我来分析一下具体要做什么：\n\n1. **理解任务** — 解析你的需求，明确目标和约束\n2. **制定方案** — 根据上下文设计执行方案\n3. **开始执行** — 调用相关 Skills 完成任务\n\n我这就开始处理，请稍等...",
      },
    ]);
    setChatInput("");
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };
  const [showSeedanceBanner, setShowSeedanceBanner] = useState(() => {
    try {
      return localStorage.getItem(SEEDANCE_BANNER_DISMISSED_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [seedanceNow, setSeedanceNow] = useState(Date.now());
  const [selectedModelId, setSelectedModelId] = useState("nexu-claude-opus-4-6");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(new Set());
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const providerDetails = getProviderDetails();
  const enabledProviders = providerDetails.filter((p) => p.enabled);
  const allEnabledModels = enabledProviders.flatMap((p) =>
    p.models
      .filter((m) => m.enabled)
      .map((m) => ({ ...m, providerId: p.id, providerName: p.name })),
  );
  const selectedModel =
    allEnabledModels.find((m) => m.id === selectedModelId) ?? allEnabledModels[0];

  useEffect(() => {
    if (!showModelDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setShowModelDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModelDropdown]);

  useEffect(() => {
    if (!showHarnessDropdown) return;
    const handler = (e: MouseEvent) => {
      if (harnessDropdownRef.current && !harnessDropdownRef.current.contains(e.target as Node)) {
        setShowHarnessDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showHarnessDropdown]);

  useEffect(() => {
    if (showModelDropdown) {
      setModelSearch("");
      const selectedProvider = enabledProviders.find((p) =>
        p.models.some((m) => m.id === selectedModelId),
      );
      setExpandedProviders(
        new Set(
          selectedProvider
            ? [selectedProvider.id]
            : enabledProviders.length > 0
              ? [enabledProviders[0].id]
              : [],
        ),
      );
    }
  }, [showModelDropdown]);

  useEffect(() => {
    const timer = window.setInterval(() => setSeedanceNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    setShowSeedanceBanner(true);
    try {
      localStorage.removeItem(SEEDANCE_BANNER_DISMISSED_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const resetSeedanceBanner = () => {
    setShowSeedanceBanner(true);
    try {
      localStorage.removeItem(SEEDANCE_BANNER_DISMISSED_KEY);
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    const handleReset = () => resetSeedanceBanner();
    window.addEventListener("seedance-banner-reset", handleReset);
    return () => window.removeEventListener("seedance-banner-reset", handleReset);
  }, []);

  const dismissSeedanceBanner = () => {
    setShowSeedanceBanner(false);
    try {
      localStorage.setItem(SEEDANCE_BANNER_DISMISSED_KEY, "1");
    } catch {
      /* noop */
    }
  };

  void (showSeedanceBanner ? (
    <div
      role="button"
      tabIndex={0}
      onClick={onRequestSeedanceModal}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onRequestSeedanceModal();
      }}
      className="group relative w-full overflow-hidden rounded-xl border border-[var(--color-warning)]/25 text-left transition-all hover:shadow-[var(--shadow-card)]"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--color-warning) 16%, white), color-mix(in srgb, var(--color-brand-primary) 10%, white))",
      }}
    >
      <div className="flex items-start gap-3 px-4 py-3.5 pr-11">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/50 bg-white/80 shrink-0">
          <span className="text-[18px] leading-none">🎬</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-semibold text-text-primary">
              {t("ws.home.seedanceBannerTitle")}
            </span>
            <SeedanceCountdownBlocks now={seedanceNow} locale={locale} compact />
          </div>
          <p className="mt-1 text-[12px] text-text-secondary leading-relaxed">
            {t("ws.home.seedanceBannerSubtitle")}
          </p>
        </div>
        <ArrowRight
          size={14}
          className="shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5"
        />
      </div>
      <button
        type="button"
        aria-label={t("ws.home.seedanceBannerDismiss")}
        onClick={(e) => {
          e.stopPropagation();
          dismissSeedanceBanner();
        }}
        className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white/70 hover:text-text-primary"
      >
        <X size={12} />
      </button>
    </div>
  ) : null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.loop = false;
    v.play().catch(() => {});
    const onEnded = () => {
      v.pause();
    };
    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (videoHover) {
      v.currentTime = 0;
      v.loop = true;
      v.play().catch(() => {});
    } else {
      v.loop = false;
    }
  }, [videoHover]);

  /* ── Scene C: Operational — compact hero, efficiency-first ── */
  return (
    <div
      className={cn(
        "h-full",
        chatMessages.length > 0 ? "flex flex-col overflow-hidden" : "overflow-y-auto",
      )}
    >
      <div
        className={cn(
          "max-w-[800px] mx-auto px-4 sm:px-6",
          chatMessages.length > 0
            ? "flex flex-col flex-1 min-h-0 pt-2 pb-2"
            : "pt-2 pb-6 sm:pb-8 space-y-6",
        )}
      >
        {/* ── Budget warning / depleted card — below Bot, nexu Official only ── */}
        {/* Budget warning dialog */}
        {(budget.status === "depleted" || budget.status === "warning") &&
          (() => {
            const isDepleted = budget.status === "depleted";
            const resetText =
              budget.resetsInDays === 1 ? "tomorrow" : `in ${budget.resetsInDays} days`;
            const isPro = demoPlan === "pro";
            const isPlus = demoPlan === "plus";

            const headline = isDepleted
              ? `Plan credits depleted (resets ${resetText}). Choose an option below to continue.`
              : "Plan credits running low. Take action to avoid interruptions.";

            return (
              <Dialog open={showBudgetDialog} onOpenChange={(open) => onBudgetDialogChange?.(open)}>
                <DialogContent size="md" className="max-w-[480px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold text-text-primary">
                      <Zap
                        size={16}
                        className={
                          isDepleted ? "text-[var(--color-danger)]" : "text-[var(--color-warning)]"
                        }
                      />
                      {headline}
                    </DialogTitle>
                  </DialogHeader>
                  <DialogBody className="space-y-5 py-2">
                    {isPlus && (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="default"
                          leadingIcon={<ArrowUp className="size-3.5" />}
                          onClick={() => openExternal(`${window.location.origin}/openclaw/pricing`)}
                        >
                          Upgrade to Pro
                        </Button>
                        <span className="text-[12px] text-text-muted">
                          11,000 credits/mo · 5.5x more than Plus
                        </span>
                      </div>
                    )}

                    {(isPlus || isPro) && (
                      <div>
                        <p className="text-[12px] text-text-tertiary mb-1.5">
                          {isPro ? "Top up credits" : "Or top up credits"}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(
                            [
                              { credits: "2,000", price: 20 },
                              { credits: "5,200", price: 50 },
                              { credits: "11,000", price: 100 },
                              { credits: "55,000", price: 500 },
                            ] as const
                          ).map((pack) => (
                            <Button
                              key={pack.price}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-[140px] gap-1 !bg-[hsl(var(--accent)/0.06)] !border-[hsl(var(--accent)/0.25)] hover:!bg-[hsl(var(--accent)/0.12)] hover:!border-[hsl(var(--accent)/0.4)] shadow-none hover:shadow-sm transition-all"
                              onClick={() =>
                                openExternal(
                                  `${window.location.origin}/openclaw/usage?plan=${demoPlan}#credit-packs`,
                                )
                              }
                            >
                              <CreditIcon size={12} className="shrink-0 text-text-muted" />
                              <span className="tabular-nums">{pack.credits}</span>
                              <span className="text-text-muted font-normal tabular-nums">
                                ${pack.price}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      {(isPlus || isPro) && (
                        <p className="text-[12px] text-text-tertiary mb-1.5">
                          Or switch to BYOK (Bring Your Own Key)
                        </p>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          leadingIcon={<Cpu className="size-3.5" />}
                          onClick={() => {
                            onBudgetDialogChange?.(false);
                            onNavigate({ type: "settings", tab: "providers" });
                          }}
                        >
                          Use your own API Key
                        </Button>
                        {!(isPlus || isPro) && (
                          <Button
                            type="button"
                            variant={isDepleted ? "destructive" : "default"}
                            size="sm"
                            leadingIcon={<ArrowUp className="size-3.5" />}
                            onClick={() =>
                              openExternal(`${window.location.origin}/openclaw/pricing`)
                            }
                          >
                            Upgrade plan
                          </Button>
                        )}
                      </div>
                    </div>
                  </DialogBody>
                </DialogContent>
              </Dialog>
            );
          })()}

        {/* ═══ MIDDLE: Welcome + Chat ═══ */}
        <div
          className={cn(
            "flex flex-col items-center",
            chatMessages.length > 0 ? "flex-1 min-h-0 overflow-hidden py-2" : "flex-1 py-6",
          )}
        >
          {/* Welcome greeting — hide when chatting */}
          {chatMessages.length === 0 && (
            <div className="flex flex-col items-center text-center mb-8">
              <div
                className="relative w-20 h-20 shrink-0 cursor-default mb-4"
                onMouseEnter={() => setVideoHover(true)}
                onMouseLeave={() => setVideoHover(false)}
              >
                <video
                  ref={videoRef}
                  src="/nexu-alpha.mp4"
                  poster="/nexu-alpha-poster.jpg"
                  preload="auto"
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-[22px] text-text-primary mb-2">
                <span className="font-bold">{t("ws.home.welcomeTitle")}</span>
                <span className="font-normal text-text-muted">
                  : {t("ws.home.welcomeSubtitle")}
                </span>
              </h2>
            </div>
          )}

          {/* Chat thread */}
          {chatMessages.length > 0 && (
            <div className="w-full max-w-[640px] flex-1 min-h-0 overflow-y-auto space-y-5 px-2 pb-4">
              {chatMessages.map((msg, i) => {
                const isBot = msg.role === "bot";
                return (
                  <div key={i} className={`flex gap-3 ${isBot ? "" : "flex-row-reverse"}`}>
                    {isBot ? (
                      <img
                        src="/brand/ip-nexu.svg"
                        alt=""
                        className="w-8 h-8 shrink-0 object-contain mt-0.5"
                      />
                    ) : (
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-surface-3 flex items-center justify-center text-[11px] font-semibold text-text-secondary mt-0.5">
                        U
                      </div>
                    )}
                    <div className={`max-w-[75%] ${isBot ? "" : "text-right"}`}>
                      <div
                        className={cn(
                          "inline-block px-4 py-3 rounded-xl text-[13px] leading-relaxed whitespace-pre-line",
                          isBot
                            ? "bg-surface-1 border border-border text-text-primary rounded-tl-sm"
                            : "bg-surface-3 text-text-primary rounded-tr-sm",
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* ── Compact input — sticky bottom ── */}
          {chatMessages.length > 0 && (
            <div className="w-full max-w-[640px] shrink-0 px-2 pb-2">
              <Card variant="static" padding="none" className="w-full">
                <div className="px-4 pt-3 pb-2">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask me anything..."
                    rows={2}
                    className="w-full resize-none bg-transparent text-[14px] text-text-primary placeholder:text-text-muted/50 outline-none leading-relaxed"
                  />
                </div>
                <div className="flex items-center justify-between px-4 pb-3 pt-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
                    >
                      <Paperclip size={16} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
                    >
                      <Sparkles size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-2 text-[11px] text-text-muted cursor-default"
                      title="Current Harness: Claude Code"
                    >
                      <Sparkles size={11} />
                      Claude Code
                    </span>
                    {selectedModel && (
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-text-muted">
                        <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                          <ProviderLogo
                            provider={
                              getModelIconProvider(selectedModel.name) || selectedModel.providerId
                            }
                            size={14}
                          />
                        </span>
                        <span className="truncate max-w-[120px]">{selectedModel.name}</span>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                        chatInput.trim()
                          ? "bg-[var(--color-accent)] text-white hover:opacity-85"
                          : "bg-surface-2 text-text-muted cursor-default",
                      )}
                    >
                      <ArrowUp size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ── Full input when idle ── */}
          {chatMessages.length === 0 && (
            <>
              <Card variant="static" padding="none" className="w-full max-w-[640px]">
                <div className="px-4 pt-4 pb-2">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={t("ws.home.chatPlaceholder")}
                    rows={3}
                    className="w-full resize-none bg-transparent text-[14px] text-text-primary placeholder:text-text-muted/50 outline-none leading-relaxed"
                  />
                </div>
                <div className="flex items-center justify-between px-4 pb-3 pt-1">
                  <div className="flex items-center gap-1">
                    {/* 1. Harness */}
                    <div className="relative" ref={harnessDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setShowHarnessDropdown(!showHarnessDropdown)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium text-text-muted hover:text-text-secondary hover:bg-surface-2 transition-colors"
                      >
                        <Terminal size={13} />
                        <span>
                          {
                            (HARNESS_LIST.find((h) => h.id === activeHarness) ?? HARNESS_LIST[0])
                              .name
                          }
                        </span>
                        <ChevronDown
                          size={10}
                          className={cn(
                            "transition-transform",
                            showHarnessDropdown && "rotate-180",
                          )}
                        />
                      </button>
                      {showHarnessDropdown && (
                        <div className="absolute bottom-full left-0 mb-1 w-[200px] rounded-xl border border-border bg-surface-1 shadow-xl z-50 p-1">
                          <div className="px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                            Harness
                          </div>
                          {HARNESS_LIST.map((h) => (
                            <button
                              key={h.id}
                              type="button"
                              onClick={() => {
                                setActiveHarness(h.id);
                                setShowHarnessDropdown(false);
                              }}
                              className={cn(
                                "w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors",
                                h.id === activeHarness ? "bg-surface-2" : "hover:bg-surface-2",
                              )}
                            >
                              <h.icon size={13} className="text-text-secondary shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-[11px] font-medium text-text-primary">
                                  {h.name}
                                </div>
                                <div className="text-[9px] text-text-muted">{h.desc}</div>
                              </div>
                              {h.id === activeHarness && (
                                <Check size={12} className="text-accent shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* 2. Model */}
                    <div className="relative" ref={modelDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setShowModelDropdown(!showModelDropdown)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-text-secondary hover:bg-surface-2 transition-colors"
                      >
                        {selectedModel && (
                          <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                            <ProviderLogo
                              provider={
                                getModelIconProvider(selectedModel.name) || selectedModel.providerId
                              }
                              size={14}
                            />
                          </span>
                        )}
                        <span className="truncate max-w-[120px]">
                          {selectedModel?.name ?? t("ws.home.notSelected")}
                        </span>
                        <ChevronDown
                          size={10}
                          className={`text-text-muted transition-transform ${showModelDropdown ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* Model dropdown */}
                      {showModelDropdown &&
                        (() => {
                          const query = modelSearch.toLowerCase().trim();
                          const filteredProviders = enabledProviders
                            .map((p) => ({
                              ...p,
                              models: p.models.filter(
                                (m) =>
                                  m.enabled &&
                                  (!query ||
                                    m.name.toLowerCase().includes(query) ||
                                    p.name.toLowerCase().includes(query)),
                              ),
                            }))
                            .filter((p) => p.models.length > 0);

                          return (
                            <div className="absolute z-50 top-full mt-2 left-0 w-[320px] rounded-xl border border-border bg-surface-1 shadow-xl">
                              <div className="px-3 pt-3 pb-2">
                                <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-0 px-3 py-2">
                                  <Search size={14} className="text-text-muted shrink-0" />
                                  <input
                                    type="text"
                                    value={modelSearch}
                                    onChange={(e) => {
                                      setModelSearch(e.target.value);
                                      if (e.target.value.trim()) {
                                        setExpandedProviders(
                                          new Set(enabledProviders.map((p) => p.id)),
                                        );
                                      }
                                    }}
                                    placeholder={t("ws.home.searchModels")}
                                    className="flex-1 bg-transparent text-xs font-normal text-text-primary placeholder:text-text-muted/50 outline-none"
                                  />
                                </div>
                              </div>
                              <div className="relative px-3 pb-2">
                                <div
                                  className="max-h-[280px] overflow-y-auto py-1"
                                  style={{ overscrollBehavior: "contain" }}
                                >
                                  {filteredProviders.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-xs text-text-muted">
                                      {t("ws.home.noMatchingModels")}
                                    </div>
                                  ) : (
                                    filteredProviders.map((provider) => {
                                      const isExpanded =
                                        expandedProviders.has(provider.id) || !!query;
                                      return (
                                        <div key={provider.id}>
                                          <div className="flex items-center">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                if (query) return;
                                                setExpandedProviders((prev) => {
                                                  const next = new Set(prev);
                                                  if (next.has(provider.id))
                                                    next.delete(provider.id);
                                                  else next.add(provider.id);
                                                  return next;
                                                });
                                              }}
                                              className="flex min-h-9 flex-1 items-center gap-2 rounded-lg pl-4 pr-3 py-2 transition-colors hover:bg-surface-2"
                                            >
                                              <ChevronDown
                                                size={12}
                                                className={`text-text-secondary transition-transform ${isExpanded ? "" : "-rotate-90"}`}
                                              />
                                              <span className="flex size-4 shrink-0 items-center justify-center">
                                                <ProviderLogo provider={provider.id} size={14} />
                                              </span>
                                              <span className="text-xs font-normal text-text-secondary">
                                                {provider.name}
                                              </span>
                                            </button>
                                            {provider.id === "nexu" && (
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  openExternal(
                                                    "https://docs.nexu.io/zh/guide/model-pricing",
                                                  )
                                                }
                                                className="flex size-7 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-2 hover:text-text-primary"
                                                title={
                                                  locale === "zh"
                                                    ? "模型积分消耗说明"
                                                    : "Model credits info"
                                                }
                                              >
                                                <HelpCircle size={12} />
                                              </button>
                                            )}
                                          </div>
                                          {isExpanded &&
                                            provider.models.map((model) => (
                                              <button
                                                type="button"
                                                key={model.id}
                                                onClick={() => {
                                                  setSelectedModelId(model.id);
                                                  setShowModelDropdown(false);
                                                }}
                                                className={`flex min-h-9 w-full items-center gap-2.5 rounded-lg pl-7 pr-3 py-2 text-left transition-colors hover:bg-surface-2 ${model.id === selectedModelId ? "bg-accent/10 font-medium" : ""}`}
                                              >
                                                <span className="flex size-4 shrink-0 items-center justify-center">
                                                  <ProviderLogo
                                                    provider={
                                                      getModelIconProvider(model.name) ||
                                                      provider.id
                                                    }
                                                    size={14}
                                                  />
                                                </span>
                                                <span className="flex flex-1 items-center gap-1.5 min-w-0">
                                                  <span
                                                    className={`truncate text-xs ${model.id === selectedModelId ? "font-semibold text-text-heading" : "font-normal text-text-primary"}`}
                                                  >
                                                    {model.name}
                                                  </span>
                                                  {model.tier === "pro" && (
                                                    <TierProBadge
                                                      height={14}
                                                      className="shrink-0"
                                                    />
                                                  )}
                                                  {model.tier === "plus" && (
                                                    <TierPlusBadge
                                                      height={14}
                                                      className="shrink-0"
                                                    />
                                                  )}
                                                  {provider.id === "nexu" && !model.tier && (
                                                    <span className="shrink-0 rounded-[4px] bg-gradient-to-r from-[#3DB9CE] to-[#34D399] px-1.5 py-[2px] text-[9px] font-bold text-white">
                                                      Unlimited
                                                    </span>
                                                  )}
                                                </span>
                                                {provider.id === "nexu" ? (
                                                  <span className="shrink-0 text-[9px] font-normal tabular-nums text-text-muted/60">
                                                    {"~"}
                                                    {model.creditsPerConversation}
                                                    {locale === "zh" ? " 积分/次" : " credits/conv"}
                                                  </span>
                                                ) : (
                                                  <span className="shrink-0 text-[9px] font-normal tabular-nums text-text-muted/60">
                                                    {model.inputPrice
                                                      .replace(/\.00/g, "")
                                                      .replace(/\/M$/, "")}
                                                    {" / "}
                                                    {model.outputPrice
                                                      .replace(/\.00/g, "")
                                                      .replace(/\/M$/, "")}
                                                  </span>
                                                )}
                                              </button>
                                            ))}
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              </div>
                              <div className="border-t border-border px-3 py-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowModelDropdown(false);
                                    onNavigate({ type: "settings" });
                                  }}
                                  className="flex min-h-9 w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-2"
                                >
                                  <Settings size={14} className="text-text-primary" />
                                  <span className="text-sm font-medium text-text-primary">
                                    {t("ws.home.configureProviders")}
                                  </span>
                                  <ArrowRight size={12} className="ml-auto text-text-secondary" />
                                </button>
                              </div>
                            </div>
                          );
                        })()}
                    </div>
                    {/* 3. File upload */}
                    <button
                      type="button"
                      className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
                    >
                      <Paperclip size={16} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                      chatInput.trim()
                        ? "bg-[var(--color-accent)] text-white hover:opacity-85"
                        : "bg-surface-2 text-text-muted cursor-default",
                    )}
                  >
                    <ArrowUp size={16} />
                  </button>
                </div>
              </Card>

              {/* Quick action chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-[640px]">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.labelKey}
                    type="button"
                    onClick={() => setChatInput(t(action.promptKey))}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border bg-surface-0 text-[12px] font-medium text-text-secondary hover:bg-surface-1 hover:border-border-hover transition-all"
                  >
                    <action.icon size={14} />
                    <span>{t(action.labelKey)}</span>
                  </button>
                ))}
              </div>

              {/* Channel section */}
              {(() => {
                const connected = connectedChannels
                  ? ONBOARDING_CHANNELS.filter((c) => connectedChannels.has(c.id as ChannelId))
                  : [];
                if (connected.length > 0) {
                  return (
                    <div className="mt-12 flex items-center gap-2 opacity-60 hover:opacity-90 transition-opacity">
                      {connected.map((ch) => (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => onNavigate({ type: "channels" })}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-accent/30 hover:shadow-md"
                          title={ch.name}
                        >
                          <ch.icon size={18} />
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => onNavigate({ type: "channels" })}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-dashed border-border/60 text-text-muted/40 transition-all hover:border-accent/30 hover:text-accent hover:bg-accent/5"
                        title={t("ws.home.channelGuideTitle")}
                      >
                        <Cable size={16} />
                      </button>
                    </div>
                  );
                }
                return (
                  <button
                    type="button"
                    onClick={() => onNavigate({ type: "channels" })}
                    className="mt-12 flex items-center gap-3 px-5 py-3 rounded-xl border border-dashed border-border/50 bg-transparent text-left transition-all hover:border-accent/30 hover:bg-accent/5 max-w-[480px] group opacity-50 hover:opacity-80"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-1 group-hover:bg-accent/10 transition-colors">
                      <Cable
                        size={16}
                        className="text-text-muted/60 group-hover:text-accent transition-colors"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-text-muted group-hover:text-accent transition-colors">
                        {t("ws.home.channelGuideTitle")}
                      </div>
                      <div className="text-[11px] text-text-muted/60 mt-0.5">
                        {t("ws.home.channelGuideDesc")}
                      </div>
                    </div>
                    <ArrowRight
                      size={12}
                      className="text-text-muted/40 shrink-0 group-hover:text-accent transition-colors"
                    />
                  </button>
                );
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
