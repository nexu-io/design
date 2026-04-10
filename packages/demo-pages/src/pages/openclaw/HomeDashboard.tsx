import {
  Alert,
  AlertDescription,
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  TextLink,
  cn,
} from "@nexu-design/ui-web";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Cable,
  Check,
  ChevronDown,
  Cpu,
  KeyRound,
  MessageCircle,
  Search,
  Settings,
  Star,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useBudget } from "../../hooks/useBudget";
import { useLocale } from "../../hooks/useLocale";
import { openExternal } from "../../utils/open-external";
import { GitHubStarButton } from "./GitHubStarButton";
import {
  CHANNELS_CONNECTED_KEY,
  CHANNEL_ACTIVE_KEY,
  CHANNEL_CONFIG_FIELDS,
  DingTalkIconSetup,
  DiscordIconSetup,
  FeishuIconSetup,
  ONBOARDING_CHANNELS,
  QQBotIconSetup,
  SEEDANCE_BANNER_DISMISSED_KEY,
  SlackIconSetup,
  TelegramIconSetup,
  WeChatIconSetup,
  WeComIconSetup,
  WhatsAppIconSetup,
} from "./channelSetup";
import { MOCK_CHANNELS, getProviderDetails } from "./data";
import { CreditIcon, ProviderLogo, getModelIconProvider } from "./iconHelpers";

const SEEDANCE_COUNTDOWN_CYCLE_MS = 2 * 24 * 60 * 60 * 1000;
const SEEDANCE_COUNTDOWN_LOOP_END_MS = Date.now() + SEEDANCE_COUNTDOWN_CYCLE_MS - 1000;

const RECENT_ACTIVITY_CHANNEL_LABELS: Record<string, string> = {
  feishu: "飞书",
  dingtalk: "钉钉",
  wecom: "企微",
  qqbot: "QQ",
  slack: "Slack",
  discord: "Discord",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  wechat: "WeChat",
  web: "Web",
};

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

type HomeView = { type: "settings"; tab?: "general" | "providers" };

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
};

export function HomeDashboard({
  onNavigate,
  showTyping: _showTyping,
  onTypingComplete: _onTypingComplete,
  stars,
  budgetStatus,
  demoPlan = "pro",
  onRequestStarOnboarding,
  onRequestSeedanceModal,
  githubUrl,
}: HomeDashboardProps) {
  const { locale, t } = useLocale();
  const budget = useBudget(budgetStatus);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoHover, setVideoHover] = useState(false);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(() => {
    try {
      const v = localStorage.getItem(CHANNELS_CONNECTED_KEY);
      return v ? new Set(JSON.parse(v)) : new Set(["wechat", "feishu"]);
    } catch {
      return new Set(["wechat", "feishu"]);
    }
  });
  const [activeChannelId, setActiveChannelId] = useState(
    () => localStorage.getItem(CHANNEL_ACTIVE_KEY) || "",
  );
  const [budgetBannerDismissed, setBudgetBannerDismissed] = useState(false);
  const [showSeedanceBanner, setShowSeedanceBanner] = useState(() => {
    try {
      return localStorage.getItem(SEEDANCE_BANNER_DISMISSED_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [seedanceNow, setSeedanceNow] = useState(Date.now());
  const [configChannel, setConfigChannel] = useState<string | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [selectedModelId, setSelectedModelId] = useState("nexu-claude-opus-4-6");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(new Set());
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const connectedChannels = ONBOARDING_CHANNELS.filter((c) => connectedIds.has(c.id));
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

  const seedanceBanner = showSeedanceBanner ? (
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
  ) : null;

  const persistChannels = (ids: Set<string>, active: string) => {
    localStorage.setItem(CHANNELS_CONNECTED_KEY, JSON.stringify([...ids]));
    localStorage.setItem(CHANNEL_ACTIVE_KEY, active);
  };

  const handleDisconnectChannel = (channelId: string) => {
    const next = new Set(connectedIds);
    next.delete(channelId);
    const nextActive = activeChannelId === channelId ? [...next][0] || "" : activeChannelId;
    setConnectedIds(next);
    setActiveChannelId(nextActive);
    persistChannels(next, nextActive);
  };

  const handleConnectChannel = (channelId: string) => {
    const next = new Set(connectedIds);
    next.add(channelId);
    setConnectedIds(next);
    setActiveChannelId(channelId);
    persistChannels(next, channelId);
    setConfigChannel(null);
    setConfigValues({});
    // Show GitHub Star prompt whenever a channel is connected and star not yet claimed
    if (!budget.starClaimed) {
      onRequestStarOnboarding();
    }
  };

  const handleOpenConfig = (channelId: string) => {
    setConfigChannel(channelId);
    setConfigValues({});
  };

  const handleCloseConfig = () => {
    setConfigChannel(null);
    setConfigValues({});
  };

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
    <div className="h-full overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8 space-y-6">
        {/* ═══ TOP: Compact Hero — Bot + CTA ═══ */}
        <div className="flex items-center gap-4">
          <div
            className="relative w-28 h-28 shrink-0 cursor-default"
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <h2
                className="font-normal tracking-tight text-text-primary"
                style={{ fontFamily: "var(--font-script)", fontSize: "26px" }}
              >
                nexu alpha
              </h2>
              <span
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--color-success) 10%, transparent)",
                  color: "var(--color-success)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--color-success)" }}
                />
                {t("ws.home.running")}
              </span>
              <GitHubStarButton
                href={githubUrl}
                label={t("ws.common.starOnGitHub")}
                stars={stars ?? undefined}
                iconSize={12}
                className="ml-auto"
              />
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="relative" ref={modelDropdownRef}>
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="inline-flex min-h-9 items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-0 text-xs font-normal text-text-primary transition-all hover:border-border-hover hover:bg-surface-1"
                >
                  {selectedModel ? (
                    <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                      <ProviderLogo
                        provider={
                          getModelIconProvider(selectedModel.name) || selectedModel.providerId
                        }
                        size={14}
                      />
                    </span>
                  ) : (
                    <Cpu size={14} className="text-text-muted" />
                  )}
                  <span className="font-medium">
                    {selectedModel?.name ?? t("ws.home.notSelected")}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`text-text-muted transition-transform ${showModelDropdown ? "rotate-180" : ""}`}
                  />
                </button>

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
                      <div className="absolute z-50 mt-2 left-0 w-[280px] rounded-xl border border-border bg-surface-1 shadow-xl">
                        <div className="px-3 pt-3 pb-2">
                          <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-0 px-3 py-2">
                            <Search size={14} className="text-text-muted shrink-0" />
                            <input
                              type="text"
                              value={modelSearch}
                              onChange={(e) => {
                                setModelSearch(e.target.value);
                                if (e.target.value.trim()) {
                                  setExpandedProviders(new Set(enabledProviders.map((p) => p.id)));
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
                                const isExpanded = expandedProviders.has(provider.id) || !!query;
                                return (
                                  <div key={provider.id}>
                                    <button
                                      onClick={() => {
                                        if (query) return;
                                        setExpandedProviders((prev) => {
                                          const next = new Set(prev);
                                          if (next.has(provider.id)) next.delete(provider.id);
                                          else next.add(provider.id);
                                          return next;
                                        });
                                      }}
                                      className="flex min-h-9 w-full items-center gap-2 rounded-lg pl-4 pr-3 py-2 transition-colors hover:bg-surface-2/50"
                                    >
                                      <ChevronDown
                                        size={12}
                                        className={`text-text-muted/50 transition-transform ${isExpanded ? "" : "-rotate-90"}`}
                                      />
                                      <span className="flex size-4 shrink-0 items-center justify-center">
                                        <ProviderLogo provider={provider.id} size={14} />
                                      </span>
                                      <span className="text-xs font-normal text-text-secondary">
                                        {provider.name}
                                      </span>
                                      <span className="ml-auto text-[10px] font-normal text-text-muted/60 tabular-nums">
                                        {provider.models.length}
                                      </span>
                                    </button>
                                    {isExpanded &&
                                      provider.models.map((model) => (
                                        <button
                                          key={model.id}
                                          onClick={() => {
                                            setSelectedModelId(model.id);
                                            setShowModelDropdown(false);
                                          }}
                                          className={`flex min-h-9 w-full items-center gap-2.5 pl-10 pr-3 py-2 text-left transition-colors hover:bg-surface-2 ${model.id === selectedModelId ? "bg-accent/5" : ""}`}
                                        >
                                          {model.id === selectedModelId ? (
                                            <Check size={14} className="text-accent shrink-0" />
                                          ) : (
                                            <span className="size-4 shrink-0" />
                                          )}
                                          <span className="flex-1 truncate text-xs font-normal text-text-primary">
                                            {model.name}
                                          </span>
                                          <span className="shrink-0 text-[10px] font-normal text-text-muted/60 tabular-nums">
                                            {model.contextWindow}
                                          </span>
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
              <span
                className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium"
                title="Agent running"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
                Agent running
              </span>
              <div className="flex items-center gap-2 text-[11px] text-text-muted ml-3">
                <span>{t("ws.home.messagesToday")}</span>
                <span className="text-border">·</span>
                <span>{t("ws.home.activeAgo")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Budget warning / depleted card — below Bot, nexu Official only ── */}
        {(budget.status === "depleted" || budget.status === "warning") &&
          !budgetBannerDismissed &&
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
              <Alert
                variant={isDepleted ? "destructive" : "default"}
                className={cn(
                  "relative rounded-xl px-5 py-4",
                  !isDepleted &&
                    "border-[hsl(var(--accent)/0.2)] bg-[hsl(var(--accent)/0.05)] [&>svg]:text-[var(--color-brand-primary)]",
                )}
              >
                <Zap size={14} />
                <div className="flex-1 min-w-0">
                  <AlertDescription className="text-[13px] font-semibold leading-snug">
                    {headline}
                  </AlertDescription>

                  {isPlus && (
                    <div className="mt-5 flex items-center gap-2">
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
                    <div className="mt-5">
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

                  <div className="mt-5">
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
                        onClick={() => onNavigate({ type: "settings", tab: "providers" })}
                      >
                        Use your own API Key
                      </Button>
                      {!(isPlus || isPro) && (
                        <Button
                          type="button"
                          variant={isDepleted ? "destructive" : "default"}
                          size="sm"
                          leadingIcon={<ArrowUp className="size-3.5" />}
                          onClick={() => openExternal(`${window.location.origin}/openclaw/pricing`)}
                        >
                          Upgrade plan
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-3 right-3 text-text-muted hover:text-text-secondary"
                  onClick={() => setBudgetBannerDismissed(true)}
                  aria-label="Dismiss"
                >
                  <X size={12} />
                </Button>
              </Alert>
            );
          })()}

        {seedanceBanner}

        {/* ═══ MIDDLE: Channels Panel ═══ */}
        <Card variant="static" padding="none">
          <div className="px-5 pt-4 pb-3">
            <h2 className="text-[14px] font-semibold text-text-primary">{t("ws.home.channels")}</h2>
          </div>
          <div className="px-5 pb-5">
            {true && (
              <div className="space-y-3">
                {/* Connected channels — click to switch active */}
                {connectedChannels.length > 0 && (
                  <div role="group" aria-label="Connected channels" className="space-y-1.5">
                    {connectedChannels.map((ch) => {
                      const Icon = ch.icon;
                      return (
                        <div
                          key={ch.id}
                          onClick={() => openExternal(ch.chatUrl)}
                          className="flex w-full items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 cursor-pointer transition-all hover:bg-surface-1"
                        >
                          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center border border-border bg-white shrink-0">
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-text-primary">
                              {ch.name}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] shrink-0" />
                          </div>
                          <button
                            type="button"
                            aria-label={t("ws.home.connected")}
                            title={t("ws.home.connected")}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDisconnectChannel(ch.id);
                            }}
                            className="group rounded-[8px] bg-surface-2 px-[14px] py-[5px] text-[12px] font-medium text-text-secondary transition-colors shrink-0 hover:bg-surface-3 hover:text-[var(--color-danger)]"
                          >
                            <span className="group-hover:hidden">{t("ws.home.connected")}</span>
                            <span className="hidden group-hover:inline">
                              {t("ws.home.disconnect")}
                            </span>
                          </button>
                          <a
                            href={ch.chatUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="ml-3 inline-flex shrink-0 items-center gap-1 text-[12px] font-medium leading-none text-text-secondary transition-colors hover:text-text-primary"
                          >
                            {t("ws.home.chat")}
                            <ArrowUpRight size={12} className="-mt-px" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Not-yet-connected channels */}
                {ONBOARDING_CHANNELS.filter((ch) => !connectedIds.has(ch.id)).length > 0 && (
                  <div role="group" aria-label="Available channels" className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {ONBOARDING_CHANNELS.filter((ch) => !connectedIds.has(ch.id)).map((ch) => {
                        const Icon = ch.icon;
                        return (
                          <button
                            key={ch.id}
                            onClick={() => handleOpenConfig(ch.id)}
                            aria-label={`Connect ${ch.name}`}
                            className="group flex h-full items-center gap-2.5 rounded-lg border border-dashed border-border bg-surface-0 px-3 py-2 text-left transition-all hover:border-solid hover:border-border-hover hover:bg-surface-1"
                          >
                            <div className="w-6 h-6 rounded-md flex items-center justify-center bg-surface-1 shrink-0">
                              <Icon size={16} />
                            </div>
                            <span className="text-[12px] font-medium text-text-muted group-hover:text-text-secondary flex-1 truncate">
                              {ch.name}
                            </span>
                            <Cable
                              size={12}
                              className="text-text-muted group-hover:text-text-primary transition-colors shrink-0"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* ═══ Recent Activity ═══ */}
        <Card variant="static" padding="md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-text-primary">Recent Activity</h2>
          </div>
          <div className="space-y-5">
            {MOCK_CHANNELS.slice(0, 3).map((ch) => {
              const ChannelIcon =
                (
                  {
                    slack: SlackIconSetup,
                    feishu: FeishuIconSetup,
                    discord: DiscordIconSetup,
                    telegram: TelegramIconSetup,
                    whatsapp: WhatsAppIconSetup,
                    wechat: WeChatIconSetup,
                    dingtalk: DingTalkIconSetup,
                    qqbot: QQBotIconSetup,
                    wecom: WeComIconSetup,
                  } as Record<string, typeof SlackIconSetup>
                )[ch.platform] || SlackIconSetup;
              return (
                <div
                  key={ch.id}
                  className="group -mx-2 rounded-xl px-2 py-2 transition-colors hover:bg-surface-1"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full",
                        ch.status === "active" ? "bg-[var(--color-success)]" : "bg-surface-4",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] leading-relaxed text-text-primary transition-colors group-hover:text-accent">
                        {ch.name}
                      </span>
                      <div className="mt-1.5 flex items-center gap-2">
                        {ch.platform && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-text-muted">
                            <ChannelIcon size={12} />
                            {RECENT_ACTIVITY_CHANNEL_LABELS[ch.platform] ?? ch.platform}
                          </span>
                        )}
                        <span className="text-[10px] text-text-muted">Active {ch.lastMessage}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ═══ Star Nexu on GitHub CTA ═══ */}
        <Card variant="static" padding="none">
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 shrink-0">
              <Star size={20} className="text-amber-500 fill-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-semibold text-text-primary">
                {t("ws.home.starNexu")}
              </h3>
              <p className="text-[12px] text-text-muted mt-0.5">{t("ws.home.starCta")}</p>
            </div>
            <GitHubStarButton href={githubUrl} label="GitHub" iconSize={14} />
          </div>
        </Card>
      </div>

      {/* Channel config modal — shared across scenes */}
      {configChannel &&
        (() => {
          const ch = ONBOARDING_CHANNELS.find((c) => c.id === configChannel)!;
          const fields = CHANNEL_CONFIG_FIELDS[configChannel] || [];
          const allFilled = fields.every((f) => (configValues[f.id] || "").trim().length > 0);
          const isTelegramModal = configChannel === "telegram";
          const botTokenField = fields.find((field) => field.id === "botToken");
          return (
            <Dialog open onOpenChange={(open) => !open && handleCloseConfig()}>
              <DialogContent size="md" className="max-w-[560px]">
                <DialogHeader>
                  <DialogTitle className="text-[14px] font-semibold text-text-primary">
                    {t("ws.common.connect")} {ch.name}
                  </DialogTitle>
                  <DialogDescription className="text-[12px] text-text-muted">
                    {isTelegramModal
                      ? t("ws.home.telegramSetupDesc")
                      : t("ws.home.configureCredentials")}
                  </DialogDescription>
                </DialogHeader>

                {isTelegramModal && botTokenField ? (
                  <DialogBody className="space-y-4 py-2">
                    <div className="rounded-xl border border-border bg-surface-0 p-4">
                      <div className="mb-4 flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
                          <MessageCircle size={18} />
                        </div>
                        <div>
                          <h3 className="text-[14px] font-semibold text-text-primary">
                            {t("ws.common.connect")} {ch.name}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-xl border border-border bg-surface-1 p-4">
                          <div className="mb-2 text-[12px] font-medium text-text-primary">
                            {t("ws.home.telegramQuickSetup")}
                          </div>
                          <ol className="list-decimal space-y-1 pl-4 text-[12px] text-text-muted">
                            <li>{t("ws.home.telegramStep1")}</li>
                            <li>{t("ws.home.telegramStep2")}</li>
                            <li>{t("ws.home.telegramStep3")}</li>
                            <li>{t("ws.home.telegramStep4")}</li>
                          </ol>
                        </div>

                        <div>
                          <label className="mb-2 block text-[12px] font-medium text-text-primary">
                            {botTokenField.label}
                          </label>
                          <Input
                            type="password"
                            value={configValues[botTokenField.id] || ""}
                            onChange={(e) =>
                              setConfigValues((prev) => ({
                                ...prev,
                                [botTokenField.id]: e.target.value,
                              }))
                            }
                            placeholder="1234567890:AA..."
                            autoComplete="off"
                            spellCheck={false}
                            leadingIcon={<KeyRound size={14} />}
                            inputClassName="font-mono text-[13px]"
                          />
                        </div>

                        <Button
                          type="button"
                          onClick={() => handleConnectChannel(configChannel)}
                          disabled={!allFilled}
                          leadingIcon={<MessageCircle size={14} />}
                        >
                          {t("ws.common.connect")} {ch.name}
                        </Button>
                      </div>
                    </div>
                  </DialogBody>
                ) : (
                  <>
                    <DialogBody className="space-y-4 py-2">
                      {fields.map((field) => (
                        <div key={field.id}>
                          <label className="mb-1.5 block text-[12px] font-medium text-text-primary">
                            {field.label}
                          </label>
                          <Input
                            type="password"
                            value={configValues[field.id] || ""}
                            onChange={(e) =>
                              setConfigValues((prev) => ({
                                ...prev,
                                [field.id]: e.target.value,
                              }))
                            }
                            placeholder={field.placeholder}
                            autoComplete="off"
                            spellCheck={false}
                            inputClassName="font-mono text-[13px]"
                          />
                          <p className="mt-1 text-[11px] text-text-muted">{field.helpText}</p>
                        </div>
                      ))}
                      <TextLink
                        href={ch.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        showArrowUpRight
                        className="mt-1 w-fit items-center gap-1 text-[12px] leading-none text-[var(--color-link)]"
                      >
                        {t("ws.home.viewSetupGuide").replace("{name}", ch.name)}
                      </TextLink>
                    </DialogBody>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={handleCloseConfig}>
                        {t("ws.common.cancel")}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleConnectChannel(configChannel)}
                        disabled={!allFilled}
                      >
                        {t("ws.common.connect")}
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          );
        })()}
    </div>
  );
}
