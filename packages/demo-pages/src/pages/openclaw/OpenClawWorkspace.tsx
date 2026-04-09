import {
  ChevronRight,
  Gift,
  Home,
  Settings,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { REWARD_CHANNELS, useBudget } from "../../hooks/useBudget";
import { useGitHubStars } from "../../hooks/useGitHubStars";
import { useLocale } from "../../hooks/useLocale";
import { usePageTitle } from "../../hooks/usePageTitle";
import { openExternal } from "../../utils/open-external";
import { ConversationsView } from "./ConversationsView";
import { DeploymentsView } from "./DeploymentsView";
import { OpenClawSidebarShell } from "./OpenClawSidebarShell";
import { SchedulePanel } from "./SchedulePanel";
import { RewardConfirmModal } from "./RewardConfirmModal";
import { RewardMaterialModal } from "./RewardMaterialModal";
import { SeedancePromoModal } from "./SeedancePromoModal";
import { SKILL_CATEGORIES } from "./skillData";
import { SkillsPanel } from "./SkillsPanel";
import { StarModal } from "./StarModal";
import { HomeDashboard } from "./HomeDashboard";
import { RewardsCenter } from "./RewardsCenter";
import { SettingsView } from "./SettingsView";
import { WorkspaceTopRightControls } from "./WorkspaceTopRightControls";
import {
  getInitialWorkspaceView,
  type RewardType,
  type View,
} from "./workspaceTypes";
import { WorkspaceUtilityOverlays } from "./WorkspaceUtilityOverlays";

const GITHUB_URL = "https://github.com/nexu-io/nexu";



/* ------------------------------------------------------------------ */
/*  Home Dashboard                                                     */
/* ------------------------------------------------------------------ */

const WELCOME_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours
const WELCOME_STORAGE_KEY = "nexu_welcome_last_shown";

function shouldShowTypingEffect(): boolean {
  const fromSetup = !!sessionStorage.getItem("nexu_from_setup");
  if (fromSetup) return true;
  const lastShown = localStorage.getItem(WELCOME_STORAGE_KEY);
  if (!lastShown) return true;
  const elapsed = Date.now() - Number.parseInt(lastShown, 10);
  return elapsed >= WELCOME_INTERVAL_MS;
}

function formatRewardAmount(n: number): string {
  return String(Math.round(n));
}

/* UsageTab removed — usage details moved to Web dashboard (app.nexu.io/usage). */

const NAV_ITEMS: { id: View["type"]; labelKey: string; icon: typeof Home }[] = [
  { id: "home", labelKey: "ws.nav.home", icon: Home },
  { id: "skills", labelKey: "ws.nav.skills", icon: Sparkles },
  { id: "settings", labelKey: "ws.nav.settings", icon: Settings },
];

export default function OpenClawWorkspace() {
  usePageTitle("Workspace");
  const location = useLocation();
  const { stars } = useGitHubStars();
  const { locale, setLocale, t } = useLocale();
  // ── Demo Control State (for presentation/review) ──────────────────────
  type DemoPlan = "free" | "plus" | "pro";
  type DemoBudget = "healthy" | "warning" | "depleted";
  type DemoCreditPack = "none" | "2000" | "5200" | "11000" | "55000";
  const CREDIT_PACK_MAP: Record<DemoCreditPack, { label: string; remaining: number }> = {
    none: { label: "无", remaining: 0 },
    "2000": { label: "2,000 积分包", remaining: 1620 },
    "5200": { label: "5,200 积分包", remaining: 3840 },
    "11000": { label: "11,000 积分包", remaining: 8200 },
    "55000": { label: "55,000 积分包", remaining: 41500 },
  };
  const [demoLoggedIn, setDemoLoggedIn] = useState(true);
  const [demoPlan, setDemoPlan] = useState<DemoPlan>("pro");
  const [demoBudgetStatus, setDemoBudgetStatus] = useState<DemoBudget>("healthy");
  const [demoCreditPack, setDemoCreditPack] = useState<DemoCreditPack>("none");
  const [showDemoPanel, setShowDemoPanel] = useState(false);
  const [showUsagePanel, setShowUsagePanel] = useState(false);
  const creditPackInfo = CREDIT_PACK_MAP[demoCreditPack];
  // ── End Demo Control ───────────────────────────────────────────────────

  const nexuLoggedIn = demoLoggedIn;
  const budget = useBudget(demoBudgetStatus);
  const [rewardConfirm, setRewardConfirm] = useState<RewardType>(null);
  const [materialChannelId, setMaterialChannelId] = useState<string | null>(null);
  const [showStarModal, setShowStarModal] = useState(false);
  const [starModalStep, setStarModalStep] = useState<"prompt" | "confirm">("prompt");
  const [showSeedanceModal, setShowSeedanceModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("nexu_sidebar_collapsed");
    return saved !== null ? saved === "true" : true;
  });
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const nexuAccountEmail = "hello@nexu.ai";
  const [hasUpdate, setHasUpdate] = useState(true);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [updateError, setUpdateError] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [showUpToDate, setShowUpToDate] = useState(false);
  const downloadTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const MOCK_VERSION = "0.2.0";
  const helpRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(() => getInitialWorkspaceView(location.search));
  const [showTyping, setShowTyping] = useState(shouldShowTypingEffect);

  const SIDEBAR_MIN = 160;
  const SIDEBAR_MAX = 320;
  const SIDEBAR_DEFAULT = 192;
  const MAIN_MIN = 480;
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem("nexu_sidebar_width");
    return saved ? Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, Number(saved))) : SIDEBAR_DEFAULT;
  });
  const isResizing = useRef(false);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isResizing.current = true;
      const startX = e.clientX;
      const startW = sidebarWidth;

      const onMove = (ev: MouseEvent) => {
        if (!isResizing.current) return;
        const containerWidth = window.innerWidth;
        const newW = Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, startW + (ev.clientX - startX)));
        if (containerWidth - newW >= MAIN_MIN) {
          setSidebarWidth(newW);
        }
      };

      const onUp = () => {
        isResizing.current = false;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        setSidebarWidth((w) => {
          localStorage.setItem("nexu_sidebar_width", String(w));
          return w;
        });
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [sidebarWidth],
  );

  const creditsShellRef = useRef<HTMLDivElement>(null);
  const [usagePanelLayout, setUsagePanelLayout] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const usageLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearUsageLeaveTimer = useCallback(() => {
    if (usageLeaveTimerRef.current) {
      clearTimeout(usageLeaveTimerRef.current);
      usageLeaveTimerRef.current = null;
    }
  }, []);

  const openUsagePanel = useCallback(() => {
    clearUsageLeaveTimer();
    setShowUsagePanel(true);
  }, [clearUsageLeaveTimer]);

  const scheduleCloseUsagePanel = useCallback(() => {
    clearUsageLeaveTimer();
    usageLeaveTimerRef.current = setTimeout(() => {
      setShowUsagePanel(false);
      usageLeaveTimerRef.current = null;
    }, 160);
  }, [clearUsageLeaveTimer]);

  useEffect(
    () => () => {
      clearUsageLeaveTimer();
    },
    [clearUsageLeaveTimer],
  );

  const [showAccountPanel, setShowAccountPanel] = useState(false);
  const accountLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const [accountPanelLayout, setAccountPanelLayout] = useState<{
    top: number;
    right: number;
  } | null>(null);

  const clearAccountLeaveTimer = useCallback(() => {
    if (accountLeaveTimerRef.current) {
      clearTimeout(accountLeaveTimerRef.current);
      accountLeaveTimerRef.current = null;
    }
  }, []);

  const openAccountPanel = useCallback(() => {
    clearAccountLeaveTimer();
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setAccountPanelLayout({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
    setShowAccountPanel(true);
  }, [clearAccountLeaveTimer]);

  const scheduleCloseAccountPanel = useCallback(() => {
    clearAccountLeaveTimer();
    accountLeaveTimerRef.current = setTimeout(() => {
      setShowAccountPanel(false);
      accountLeaveTimerRef.current = null;
    }, 160);
  }, [clearAccountLeaveTimer]);

  useEffect(
    () => () => {
      clearAccountLeaveTimer();
    },
    [clearAccountLeaveTimer],
  );

  useLayoutEffect(() => {
    if (!showUsagePanel || !nexuLoggedIn) {
      setUsagePanelLayout(null);
      return;
    }
    const updateLayout = () => {
      const el = creditsShellRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const w = Math.min(280, Math.max(200, window.innerWidth - 32));
      const left = Math.min(Math.max(16, r.right - w), window.innerWidth - w - 16);
      setUsagePanelLayout({ top: r.bottom + 6, left, width: w });
    };
    updateLayout();
    window.addEventListener("scroll", updateLayout, true);
    window.addEventListener("resize", updateLayout);
    return () => {
      window.removeEventListener("scroll", updateLayout, true);
      window.removeEventListener("resize", updateLayout);
    };
  }, [showUsagePanel, nexuLoggedIn, collapsed, sidebarWidth, view.type]);

  useEffect(() => {
    if (view.type === "home") {
      setShowTyping((prev) => prev || shouldShowTypingEffect());
    }
  }, [view.type]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && view.type === "home") {
        setShowTyping((prev) => prev || shouldShowTypingEffect());
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [view.type]);

  const handleTypingComplete = () => {
    sessionStorage.removeItem("nexu_from_setup");
    localStorage.setItem(WELCOME_STORAGE_KEY, Date.now().toString());
    setShowTyping(false);
  };

  useEffect(() => {
    if (!showHelpMenu) return;
    const handler = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setShowHelpMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showHelpMenu]);

  useEffect(() => {
    return () => {
      if (downloadTimer.current) clearInterval(downloadTimer.current);
    };
  }, []);

  const allSkillsCount = SKILL_CATEGORIES.flatMap((c) => c.skills).length;
  const capabilitiesNavCount = allSkillsCount;

  const handleCheckUpdates = () => {
    setShowHelpMenu(false);
    setCheckingUpdate(true);
    setTimeout(() => {
      setCheckingUpdate(false);
      if (!hasUpdate || updateDismissed) {
        setShowUpToDate(true);
      }
    }, 1500);
  };

  return (
    <div className="relative flex flex-row h-full">
      <OpenClawSidebarShell
        t={t}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        sidebarWidth={sidebarWidth}
        isResizing={isResizing.current}
        hasUpdate={hasUpdate}
        updateDismissed={updateDismissed}
        onReopenUpdate={() => setUpdateDismissed(false)}
        view={view}
        setView={setView}
        capabilitiesNavCount={capabilitiesNavCount}
        nexuLoggedIn={nexuLoggedIn}
        budgetClaimedCount={budget.claimedCount}
        budgetChannelCount={budget.channelCount}
        showHelpMenu={showHelpMenu}
        setShowHelpMenu={setShowHelpMenu}
        helpRef={helpRef}
        locale={locale}
        setLocale={setLocale}
        onCheckUpdates={handleCheckUpdates}
        stars={stars ?? undefined}
        githubUrl={GITHUB_URL}
        navItems={NAV_ITEMS}
        onResizeStart={handleResizeStart}
      />

      {/* Main content */}
      <main className="relative flex-1 overflow-hidden min-h-0 bg-surface-1 rounded-l-[12px] pt-20 flex flex-col">
        {/* Update banner — floating bottom-right of canvas */}
        {hasUpdate && !updateDismissed && (
          <div className="absolute bottom-4 right-4 z-30 w-[280px] px-3 py-2.5 rounded-[10px] border border-border bg-surface-0/90 backdrop-blur-md shadow-[var(--shadow-dropdown)] animate-float">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${updateError ? "bg-red-500" : "bg-[var(--color-success)]"}`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${updateError ? "bg-red-500" : "bg-[var(--color-success)]"}`}
                  />
                </span>
                <span className="text-[12px] font-medium text-text-primary whitespace-nowrap">
                  {updating && t("ws.update.downloading")}
                  {updateReady && t("ws.update.ready").replace("{{version}}", MOCK_VERSION)}
                  {updateError && t("ws.update.failed")}
                  {!updating &&
                    !updateReady &&
                    !updateError &&
                    t("ws.update.available").replace("{{version}}", MOCK_VERSION)}
                </span>
              </div>
              {!updating && (
                <button
                  onClick={() => setUpdateDismissed(true)}
                  className="text-text-muted hover:text-text-primary transition-colors -mr-1"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            {updating && (
              <div className="pl-4 pr-1">
                <div className="h-[6px] w-full rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${downloadProgress}%`, background: "#1c1f23" }}
                  />
                </div>
                <div className="flex justify-end mt-1.5">
                  <span className="text-[10px] tabular-nums text-text-muted">
                    {downloadProgress}%
                  </span>
                </div>
              </div>
            )}
            {!updating && !updateReady && !updateError && (
              <div className="flex items-center gap-2 pl-4">
                <button
                  onClick={() => {
                    setUpdating(true);
                    setDownloadProgress(0);
                    let progress = 0;
                    downloadTimer.current = setInterval(() => {
                      const remaining = 100 - progress;
                      const step = Math.max(1, Math.floor(Math.random() * remaining * 0.15));
                      progress = Math.min(100, progress + step);
                      setDownloadProgress(progress);
                      if (progress >= 100) {
                        if (downloadTimer.current) clearInterval(downloadTimer.current);
                        setTimeout(() => {
                          setUpdating(false);
                          setUpdateReady(true);
                        }, 600);
                      }
                    }, 200);
                  }}
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2.5 text-[12px] leading-none font-medium bg-[var(--color-accent)] text-white hover:opacity-85 transition-opacity"
                >
                  {t("ws.update.download")}
                </button>
                <button
                  onClick={() => void openExternal("https://github.com/nexu-io/nexu/releases")}
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2 text-[12px] leading-none font-medium text-text-muted hover:text-text-primary transition-colors"
                >
                  {t("ws.update.changelog")}
                </button>
              </div>
            )}
            {updateReady && (
              <div className="flex items-center gap-2 pl-4">
                <button
                  onClick={() => {
                    setUpdateReady(false);
                    setHasUpdate(false);
                  }}
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2.5 text-[12px] leading-none font-medium bg-[var(--color-accent)] text-white hover:opacity-85 transition-opacity"
                >
                  {t("ws.update.restart")}
                </button>
                <button
                  onClick={() => void openExternal("https://github.com/nexu-io/nexu/releases")}
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2 text-[12px] leading-none font-medium text-text-muted hover:text-text-primary transition-colors"
                >
                  {t("ws.update.changelog")}
                </button>
              </div>
            )}
            {updateError && (
              <div className="flex items-center gap-2 pl-4">
                <button
                  onClick={() => {
                    setUpdateError(false);
                    setHasUpdate(true);
                  }}
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2.5 text-[12px] leading-none font-medium bg-[var(--color-accent)] text-white hover:opacity-85 transition-opacity"
                >
                  {t("ws.update.retry")}
                </button>
                <button
                  onClick={() => void openExternal("https://github.com/nexu-io/nexu/releases")}
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2 text-[12px] leading-none font-medium text-text-muted hover:text-text-primary transition-colors"
                >
                  {t("ws.update.changelog")}
                </button>
              </div>
            )}
          </div>
        )}
        {budget.status === "depleted" && view.type === "conversations" ? (
          <div className="relative z-0 flex-1 flex items-center justify-center min-h-0">
            <div className="flex flex-col items-center text-center max-w-[360px]">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
                <Zap size={28} className="text-neutral-400" />
              </div>
              <h2 className="text-[22px] font-bold text-text-primary mb-2">
                {t("budget.depleted.title")}
              </h2>
              <p className="text-[13px] text-text-secondary mb-1">
                {budget.resetsInDays === 1
                  ? t("budget.depleted.desc1")
                  : t("budget.depleted.desc").replace("{n}", String(budget.resetsInDays))}
              </p>
              <p className="text-[13px] text-text-muted mb-6">{t("budget.depleted.byok")}</p>
              <button
                onClick={() =>
                  setView({ type: "settings", tab: "providers", providerId: "anthropic" })
                }
                className="flex items-center justify-center gap-2 h-[42px] px-6 rounded-full bg-neutral-900 text-white text-[13px] font-medium hover:bg-neutral-800 active:scale-[0.98] transition-all cursor-pointer"
              >
                {t("budget.depleted.cta")}
              </button>
              <div className="mt-8 w-full max-w-[320px]">
                <button
                  onClick={() => setView({ type: "rewards" })}
                  className="flex items-center gap-3 w-full py-3 px-4 rounded-xl border border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-orange-50/40 hover:from-amber-50 hover:to-orange-50/60 transition-all group"
                >
                  <Gift size={16} className="text-amber-500 shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="text-[13px] font-medium text-text-primary">
                      {t("budget.depleted.earnMore")}
                    </div>
                    <div className="text-[11px] text-text-muted tabular-nums">
                      {budget.claimedCount}/{budget.channelCount} · +
                      {formatRewardAmount(budget.totalRewardClaimed)} 积分
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-text-muted group-hover:text-text-secondary transition-colors shrink-0"
                  />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-0 flex-1 flex flex-col overflow-hidden min-h-0">
            {view.type === "home" && (
              <HomeDashboard
                onNavigate={setView}
                showTyping={showTyping}
                onTypingComplete={handleTypingComplete}
                stars={stars}
                budgetStatus={budget.status}
                demoPlan={demoPlan}
                onRequestStarOnboarding={() => {
                  setStarModalStep("prompt");
                  setShowStarModal(true);
                }}
                onRequestSeedanceModal={() => setShowSeedanceModal(true)}
                githubUrl={GITHUB_URL}
              />
            )}
            {view.type === "conversations" && (
              <ConversationsView initialChannelId={view.channelId} />
            )}
            {view.type === "deployments" && <DeploymentsView />}
            {view.type === "skills" && <SkillsPanel />}
            {view.type === "schedule" && <SchedulePanel />}
            {view.type === "rewards" && (
              <RewardsCenter
                budget={budget}
                onDailyCheckIn={() => budget.claimChannel("daily_checkin")}
                onOpenMaterial={(ch) => setMaterialChannelId(ch.id)}
                onRequestConfirm={(ch) => setRewardConfirm(ch.id)}
                t={t}
              />
            )}
            {view.type === "settings" && (
              <SettingsView
                initialTab={view.tab}
                initialProviderId={view.providerId}
                signedIn={nexuLoggedIn}
                accountEmail={nexuAccountEmail}
                onSignOut={() => setDemoLoggedIn(false)}
                demoPlan={demoPlan}
                demoBudgetStatus={demoBudgetStatus}
                githubUrl={GITHUB_URL}
              />
            )}
          </div>
        )}
      </main>

      <WorkspaceTopRightControls
        nexuLoggedIn={nexuLoggedIn}
        demoPlan={demoPlan}
        budget={budget}
        creditPackInfo={creditPackInfo}
        nexuAccountEmail={nexuAccountEmail}
        setView={setView}
        openExternal={openExternal}
        showUsagePanel={showUsagePanel}
        usagePanelLayout={usagePanelLayout}
        openUsagePanel={openUsagePanel}
        scheduleCloseUsagePanel={scheduleCloseUsagePanel}
        clearUsageLeaveTimer={clearUsageLeaveTimer}
        showAccountPanel={showAccountPanel}
        accountPanelLayout={accountPanelLayout}
        openAccountPanel={openAccountPanel}
        scheduleCloseAccountPanel={scheduleCloseAccountPanel}
        clearAccountLeaveTimer={clearAccountLeaveTimer}
        setShowUsagePanel={setShowUsagePanel}
        setShowAccountPanel={setShowAccountPanel}
        setDemoLoggedIn={setDemoLoggedIn}
        creditsShellRef={creditsShellRef}
        avatarRef={avatarRef}
      />

      {rewardConfirm &&
        (() => {
          const ch = REWARD_CHANNELS.find((c) => c.id === rewardConfirm);
          return ch ? (
            <RewardConfirmModal
              channel={ch}
              t={t}
              onCancel={() => setRewardConfirm(null)}
              onConfirm={() => {
                budget.claimChannel(rewardConfirm);
                setRewardConfirm(null);
              }}
            />
          ) : null;
        })()}

      {materialChannelId &&
        (() => {
          const ch = REWARD_CHANNELS.find((c) => c.id === materialChannelId);
          return ch ? (
            <RewardMaterialModal
              channel={ch}
              t={t}
              onClose={() => setMaterialChannelId(null)}
              onClaim={() => {
                budget.claimChannel(materialChannelId);
              }}
            />
          ) : null;
        })()}

      {/* Seedance 2.0 promo modal */}
      {showSeedanceModal && <SeedancePromoModal onClose={() => setShowSeedanceModal(false)} />}

      {/* GitHub Star onboarding modal — shown after first channel connection */}
      {showStarModal && (
        <StarModal
          step={starModalStep}
          onStar={() => {
            openExternal("https://github.com/refly-ai/nexu");
            setStarModalStep("confirm");
          }}
          onConfirm={() => {
            budget.claimChannel("github_star");
            setShowStarModal(false);
            setToast({ message: "🎉 +300 积分已发放到你的账户！", type: "success" });
            setTimeout(() => setToast(null), 3500);
            setTimeout(() => setShowSeedanceModal(true), 2000);
          }}
          onSkip={() => {
            setShowStarModal(false);
            if (starModalStep === "confirm") {
              setTimeout(() => setShowSeedanceModal(true), 2000);
            }
          }}
        />
      )}

      <WorkspaceUtilityOverlays
        checkingUpdate={checkingUpdate}
        showUpToDate={showUpToDate}
        setShowUpToDate={setShowUpToDate}
        t={t}
        mockVersion={MOCK_VERSION}
        showDemoPanel={showDemoPanel}
        setShowDemoPanel={setShowDemoPanel}
        demoLoggedIn={demoLoggedIn}
        setDemoLoggedIn={setDemoLoggedIn}
        demoPlan={demoPlan}
        setDemoPlan={setDemoPlan}
        demoBudgetStatus={demoBudgetStatus}
        setDemoBudgetStatus={setDemoBudgetStatus}
        demoCreditPack={demoCreditPack}
        setDemoCreditPack={setDemoCreditPack}
        setStarModalStep={setStarModalStep}
        setShowStarModal={setShowStarModal}
        setShowSeedanceModal={setShowSeedanceModal}
        toast={toast}
      />
    </div>
  );
}
