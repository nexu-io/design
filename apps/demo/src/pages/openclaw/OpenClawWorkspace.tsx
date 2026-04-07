import {
  Button,
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
  DiscordIcon,
  FeishuIcon,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  NavItem,
  PanelFooter,
  PanelFooterActions,
  ProviderLogo,
  ResizableHandle,
  ResizablePanel,
  ScrollArea,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SlackIcon,
  SplitView,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ToggleGroup,
  ToggleGroupItem,
} from "@nexu-design/ui-web";
import { openUrl } from "@tauri-apps/plugin-opener";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Cable,
  Check,
  ChevronDown,
  CircleHelp,
  Clock,
  Compass,
  Cpu,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  Globe,
  Home,
  Loader2,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  ScrollText,
  Search,
  Settings,
  Settings2,
  Sparkles,
  X,
} from "lucide-react";
import { Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useGitHubStars } from "../../hooks/useGitHubStars";
import { useLocale } from "../../hooks/useLocale";
import { usePageTitle } from "../../hooks/usePageTitle";
import ChannelDetailPage from "./ChannelDetailPage";
import ImportSkillModal from "./ImportSkillModal";
import {
  BILLING_PLANS,
  type BillingPlanId,
  type UsageQuotaState,
  UsageSummaryPanel,
} from "./pricing-demo";
import { MOCK_CHANNELS, MOCK_DEPLOYMENTS, type ModelProvider, getProviderDetails } from "./data";
import { SKILL_CATEGORIES, type SkillDef, type ToolTag } from "./skillData";

const openExternal = async (url: string) => {
  try {
    await openUrl(url);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

const GITHUB_URL = "https://github.com/refly-ai/nexu";
const BUDGET_BANNER_DISMISSED_KEY = "nexu_budget_banner_dismissed";

type SkillFilter = "all" | ToolTag;

function getModelIconProvider(modelName: string): string {
  const n = modelName.toLowerCase();
  if (n.includes("claude") || n.includes("sonnet") || n.includes("haiku") || n.includes("opus"))
    return "anthropic";
  if (n.includes("gpt") || n.includes("o1") || n.includes("o3") || n.includes("o4"))
    return "openai";
  if (n.includes("gemini") || n.includes("gemma")) return "google";
  if (n.includes("grok")) return "xai";
  if (n.includes("moonshot") || n.includes("kimi")) return "kimi";
  if (n.includes("glm") || n.includes("chatglm")) return "glm";
  if (n.includes("abab") || n.includes("minimax")) return "minimax";
  if (n.includes("deepseek")) return "deepseek";
  if (n.includes("qwen")) return "qwen";
  return "";
}

function SkillsPanel() {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [topTab, setTopTab] = useState<"explore" | "yours">("yours");
  const [filter, setFilter] = useState<SkillFilter>("all");
  const [disabledSkills, setDisabledSkills] = useState<Set<string>>(new Set());
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [installingSkills, setInstallingSkills] = useState<Set<string>>(new Set());
  const pillScrollRef = useRef<HTMLDivElement>(null);
  const [showPillFade, setShowPillFade] = useState(false);

  const [showPillFadeLeft, setShowPillFadeLeft] = useState(false);
  const checkPillOverflow = useCallback(() => {
    const el = pillScrollRef.current;
    if (!el) {
      setShowPillFade(false);
      setShowPillFadeLeft(false);
      return;
    }
    const hasOverflow = el.scrollWidth > el.clientWidth;
    setShowPillFade(hasOverflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    setShowPillFadeLeft(hasOverflow && el.scrollLeft > 2);
  }, []);

  useEffect(() => {
    checkPillOverflow();
    window.addEventListener("resize", checkPillOverflow);
    return () => window.removeEventListener("resize", checkPillOverflow);
  }, [checkPillOverflow]);

  const isEnabled = (skill: SkillDef) => !disabledSkills.has(skill.id);

  const handleToggleSkill = (skill: SkillDef, nextChecked?: boolean) => {
    setDisabledSkills((prev) => {
      const next = new Set(prev);
      const shouldEnable = nextChecked ?? prev.has(skill.id);

      if (shouldEnable) next.delete(skill.id);
      else next.add(skill.id);

      return next;
    });
  };

  const handleInstallSkill = (skill: SkillDef) => {
    setInstallingSkills((prev) => new Set(prev).add(skill.id));
    setTimeout(() => {
      setInstallingSkills((prev) => {
        const next = new Set(prev);
        next.delete(skill.id);
        return next;
      });
    }, 1800);
  };

  const allSkills = SKILL_CATEGORIES.flatMap((c) => c.skills);
  const installedSkills = allSkills.filter((s) => s.source === "custom");
  const exploreSkills = allSkills.filter((s) => s.source === "official");

  const baseSkills = (() => {
    if (topTab === "explore") return exploreSkills;
    return installedSkills;
  })();

  const filteredSkills = (() => {
    let list = baseSkills;
    if (filter !== "all") {
      const cat = SKILL_CATEGORIES.find((c) => c.id === filter);
      if (cat) list = list.filter((s) => cat.skills.some((cs) => cs.id === s.id));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q),
      );
    }
    return list;
  })();

  const categoryTabs: { id: SkillFilter; label: string; count: number }[] =
    topTab === "explore"
      ? [
          { id: "all" as SkillFilter, label: t("ws.common.all"), count: exploreSkills.length },
          ...SKILL_CATEGORIES.map((c) => ({
            id: c.id as ToolTag,
            label: c.label,
            count: exploreSkills.filter((s) => c.skills.some((cs) => cs.id === s.id)).length,
          })).filter((c) => c.count > 0),
        ]
      : [
          { id: "all" as SkillFilter, label: t("ws.common.all"), count: baseSkills.length },
          ...SKILL_CATEGORIES.map((c) => ({
            id: c.id as ToolTag,
            label: c.label,
            count: baseSkills.filter((s) => c.skills.some((cs) => cs.id === s.id)).length,
          })).filter((c) => c.count > 0),
        ];

  const renderCategoryPills = () => (
    <div className="relative mb-5">
      <ToggleGroup
        ref={pillScrollRef}
        type="single"
        value={filter}
        onValueChange={(value: string) => {
          if (value) setFilter(value as SkillFilter);
        }}
        variant="outline"
        size="sm"
        aria-label="Skill categories"
        onScroll={checkPillOverflow}
        className="overflow-x-auto no-scrollbar pb-0.5 min-w-max"
      >
        {categoryTabs.map((tab) => (
          <ToggleGroupItem
            key={tab.id}
            value={tab.id}
            variant="outline"
            className="shrink-0"
            ref={
              tab.id === categoryTabs[categoryTabs.length - 1].id
                ? () => {
                    setTimeout(checkPillOverflow, 0);
                  }
                : undefined
            }
          >
            {tab.label}
            <span className="ml-1 tabular-nums opacity-70">{tab.count}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {showPillFadeLeft && (
        <div className="pointer-events-none absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-[1]" />
      )}
      {showPillFade && (
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-[1]" />
      )}
    </div>
  );

  const renderSkillsGrid = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSkills.map((skill) => {
          const enabled = isEnabled(skill);
          const catInfo = SKILL_CATEGORIES.find((c) => c.skills.some((s) => s.id === skill.id));

          return (
            <div
              key={skill.id}
              className={`card flex flex-col p-4 ${skill.source === "custom" && !enabled ? "opacity-55" : ""}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-[10px] bg-white border border-border flex items-center justify-center shrink-0">
                  {skill.logo ? (
                    <img src={skill.logo} alt="" className="w-[18px] h-[18px] object-contain" />
                  ) : (
                    <skill.icon size={18} className="text-text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-text-heading truncate">
                    {skill.name}
                  </div>
                  {catInfo && <span className="text-[11px] text-text-muted">{catInfo.label}</span>}
                </div>
              </div>

              <p className="text-[12px] text-text-tertiary leading-[1.5] line-clamp-2 mb-3">
                {skill.desc}
              </p>

              <div className="mt-auto flex items-center justify-between">
                {skill.source === "custom" ? (
                  <>
                    <Switch
                      id={`skill-toggle-${skill.id}`}
                      size="sm"
                      checked={enabled}
                      aria-label={`${enabled ? "Disable" : "Enable"} ${skill.name}`}
                      onClick={(e) => e.stopPropagation()}
                      onCheckedChange={(checked) => handleToggleSkill(skill, checked)}
                    />
                    <Button
                      type="button"
                      size="inline"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="text-[12px] font-medium text-text-muted hover:text-[var(--color-danger)] transition-colors"
                    >
                      {t("ws.skills.uninstall")}
                    </Button>
                  </>
                ) : (
                  <>
                    <span />
                    {installingSkills.has(skill.id) ? (
                      <span className="inline-flex items-center gap-1.5 rounded-[8px] px-[14px] py-[5px] text-[12px] font-medium border border-border text-text-muted cursor-default">
                        <Loader2 size={12} className="animate-spin" />
                        {t("ws.skills.installing")}
                      </span>
                    ) : (
                      <Button
                        type="button"
                        size="inline"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInstallSkill(skill);
                        }}
                        className="rounded-[8px] px-[14px] py-[5px] text-[12px] font-medium border border-border text-text-primary hover:bg-surface-2 hover:border-border-hover transition-colors"
                      >
                        {t("ws.skills.install")}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <Search size={24} className="mx-auto text-text-muted mb-3" />
          <div className="text-[13px] text-text-muted">
            {topTab === "yours" && !searchQuery.trim()
              ? t("ws.skills.emptyYours")
              : t("ws.skills.emptySearch")}
          </div>
        </div>
      )}
    </>
  );

  return (
    <ScrollArea className="h-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="heading-page">{t("ws.skills.title")}</h1>
            <p className="heading-page-desc">{t("ws.skills.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-github-star group"
            >
              <Star
                size={13}
                className="text-amber-500 group-hover:fill-amber-500 transition-colors shrink-0"
              />
              {t("ws.common.starOnGitHub")}
              <ArrowUpRight size={11} className="shrink-0 translate-y-px" />
            </a>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("ws.common.search")}
                className="w-48 pl-9 pr-3 py-1.5 rounded-lg border border-border bg-surface-1 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-brand-primary)]/30 focus:ring-1 focus:ring-[var(--color-brand-primary)]/20 transition-colors"
              />
            </div>
            <Button
              size="inline"
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-text-primary text-white text-[12px] font-medium hover:opacity-85 transition-opacity"
            >
              <Plus size={12} />
              {t("ws.skills.import")}
            </Button>
          </div>
        </div>

        {/* Top-level tabs: Explore / Yours */}
        <Tabs
          value={topTab}
          onValueChange={(value) => {
            if (!value) return;
            setTopTab(value as typeof topTab);
            setFilter("all");
          }}
        >
          <div className="mb-4">
            <TabsList aria-label="Skills source" className="w-fit rounded-full">
              {[
                { id: "yours" as const, label: t("ws.skills.yours"), icon: Settings2 },
                { id: "explore" as const, label: t("ws.skills.explore"), icon: Compass },
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="gap-1.5 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    onClick={() => {
                      setTopTab(tab.id);
                      setFilter("all");
                    }}
                  >
                    <TabIcon size={14} />
                    {tab.label}
                    {tab.id === "yours" && installedSkills.length > 0 && (
                      <span className="tabular-nums text-[12px] text-text-tertiary data-[state=active]:text-text-secondary">
                        {installedSkills.length}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          <TabsContent value="yours" className="mt-0 outline-none">
            {renderCategoryPills()}
            {renderSkillsGrid()}
          </TabsContent>

          <TabsContent value="explore" className="mt-0 outline-none">
            {renderCategoryPills()}
            {renderSkillsGrid()}
          </TabsContent>
        </Tabs>
      </div>

      <ImportSkillModal open={importModalOpen} onClose={() => setImportModalOpen(false)} />
    </ScrollArea>
  );
}

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

/* ── Channel icons for onboarding ── */

const ONBOARDING_CHANNELS = [
  {
    id: "feishu",
    name: "Feishu",
    shortName: "Feishu",
    icon: FeishuIcon,
    color: "#FFFFFF",
    recommended: true,
    docUrl: "https://docs.nexu.ai/channels/feishu",
    chatUrl: "https://www.feishu.cn/",
  },
  {
    id: "slack",
    name: "Slack",
    shortName: "Slack",
    icon: SlackIcon,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/slack",
    chatUrl: "https://slack.com/",
  },
  {
    id: "discord",
    name: "Discord",
    shortName: "Discord",
    icon: DiscordIcon,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/discord",
    chatUrl: "https://discord.com/",
  },
];

const CHANNELS_CONNECTED_KEY = "nexu_channels_connected";
const CHANNEL_ACTIVE_KEY = "nexu_channel_active";
const SEEDANCE_BANNER_DISMISSED_KEY = "nexu_seedance_banner_dismissed";

const SEEDANCE_COUNTDOWN_CYCLE_MS = 2 * 24 * 60 * 60 * 1000;
const SEEDANCE_COUNTDOWN_LOOP_END_MS = Date.now() + SEEDANCE_COUNTDOWN_CYCLE_MS - 1000;

function getSeedanceCountdown(now: number) {
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
    compactLabel: `${String(days).padStart(2, "0")}天 ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    days,
    hours,
    minutes,
    seconds,
  };
}

function SeedanceCountdownBlocks({ now, compact = false }: { now: number; compact?: boolean }) {
  const countdown = getSeedanceCountdown(now);

  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold leading-none shadow-sm"
        style={{
          color: "white",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--color-warning) 82%, white), color-mix(in srgb, var(--color-danger) 78%, var(--color-warning) 22%))",
          borderColor:
            "color-mix(in srgb, var(--color-danger) 56%, var(--color-warning) 32%, white)",
          boxShadow: "var(--shadow-focus)",
        }}
      >
        <Clock size={10} />
        <span className="tabular-nums">{countdown.compactLabel}</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {[
        { label: "天", value: countdown.days },
        { label: "时", value: countdown.hours },
        { label: "分", value: countdown.minutes },
        { label: "秒", value: countdown.seconds },
      ].map((item) => (
        <div
          key={item.label}
          className="rounded-[12px] border px-2 py-2 text-center shadow-sm"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in srgb, white 42%, var(--color-warning) 58%), color-mix(in srgb, white 58%, var(--color-danger) 42%))",
            borderColor:
              "color-mix(in srgb, var(--color-danger) 42%, var(--color-warning) 38%, white)",
            boxShadow: "var(--shadow-focus)",
          }}
        >
          <div
            className="text-[18px] font-semibold tabular-nums"
            style={{
              color: "color-mix(in srgb, var(--color-danger) 58%, var(--color-warning) 42%)",
            }}
          >
            {String(item.value).padStart(2, "0")}
          </div>
          <div
            className="mt-0.5 text-[10px] leading-none"
            style={{
              color: "color-mix(in srgb, var(--color-danger) 46%, var(--color-warning) 54%)",
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

type SeedanceStep = "star" | "feishu";

const FEISHU_GROUP_URL =
  "https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=98drf9e0-928f-4706-b0af-e515abfb12c0";
const SEEDANCE_TUTORIAL_URL = "https://powerformer.feishu.cn/wiki/OFxFw2MpyiFWKpk9n2Dc7joEngc";

function SeedancePromoModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<SeedanceStep>("star");
  const [starred, setStarred] = useState(false);
  const [countdownNow, setCountdownNow] = useState(Date.now());

  const handleStar = () => {
    openExternal(GITHUB_URL);
    setStarred(true);
  };

  const stepDots: SeedanceStep[] = ["star", "feishu"];
  const stepMeta: Record<SeedanceStep, string> = {
    star: "第一步：GitHub Star 并截图",
    feishu: "第二步：加入飞书群并填写问卷",
  };

  useEffect(() => {
    const timer = window.setInterval(() => setCountdownNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[4px]"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-[348px] mx-4 rounded-2xl border border-border bg-surface-1 shadow-[0_24px_64px_rgba(0,0,0,0.24),0_0_0_1px_rgba(0,0,0,0.06)] overflow-hidden"
        style={{ animation: "scaleIn 220ms cubic-bezier(0.16,1,0.3,1)" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-6 h-6 flex items-center justify-center rounded-full text-text-muted hover:text-text-primary hover:bg-white/70 transition-colors"
        >
          <X size={13} />
        </button>

        <div
          className="relative border-b"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--color-warning) 16%, white), color-mix(in srgb, var(--color-brand-primary) 8%, white))",
            borderColor: "color-mix(in srgb, var(--color-warning) 18%, white)",
          }}
        >
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(circle at top right, color-mix(in srgb, var(--color-brand-primary) 12%, transparent), transparent 45%)",
            }}
          />
          <div className="relative px-5 pt-5 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/75 px-2.5 py-1 text-[10px] font-semibold text-[var(--color-warning)] leading-none shadow-sm">
                <Sparkles size={10} />
                限时体验
              </div>
              <SeedanceCountdownBlocks now={countdownNow} compact />
            </div>
            <div className="mt-3">
              <h2 className="text-[18px] leading-tight font-semibold text-text-primary">
                领取 Seedance 2.0 体验 Key
              </h2>
            </div>
          </div>
        </div>

        <div className="px-5 pt-4 pb-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[14px] font-semibold text-text-primary">{stepMeta[step]}</div>
            <div className="flex items-center gap-1.5 shrink-0">
              {stepDots.map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step
                      ? "w-5 bg-[var(--color-brand-primary)]"
                      : stepDots.indexOf(s) < stepDots.indexOf(step)
                        ? "w-2 bg-[var(--color-brand-primary)]/40"
                        : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          {step === "star" && (
            <>
              <div
                className="rounded-[12px] border px-4 py-3 mb-4"
                style={{
                  background: "color-mix(in srgb, var(--color-warning) 7%, white)",
                  borderColor: "color-mix(in srgb, var(--color-warning) 16%, white)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-[12px] border shrink-0"
                    style={{
                      background: "color-mix(in srgb, var(--color-warning) 12%, white)",
                      borderColor: "color-mix(in srgb, var(--color-warning) 18%, white)",
                    }}
                  >
                    <Star
                      size={18}
                      className="text-[var(--color-warning)] fill-[var(--color-warning)]"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] text-text-muted leading-relaxed">
                      在 GitHub 为 nexu star；并将点完后的仓库页面进行截图。
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleStar}
                className={`w-full h-[40px] rounded-[10px] text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors mb-2.5 ${
                  starred
                    ? "border border-border bg-surface-1 text-text-secondary hover:bg-surface-2"
                    : "bg-[#24292f] hover:bg-[#1c2026] text-white"
                }`}
              >
                {starred ? (
                  <Check size={13} className="text-[var(--color-success)]" />
                ) : (
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                )}
                {starred ? "已点 Star" : "去 GitHub Star"}
              </button>
              <button
                type="button"
                onClick={() => setStep("feishu")}
                disabled={!starred}
                className={`w-full rounded-[10px] text-[12px] font-medium transition-colors ${
                  starred
                    ? "h-[40px] bg-[#24292f] hover:bg-[#1c2026] text-white"
                    : "h-[38px] border border-border text-text-secondary hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed"
                }`}
              >
                我已经截图，去进群填问卷
              </button>
            </>
          )}

          {step === "feishu" && (
            <>
              <p className="text-[12px] text-text-secondary leading-relaxed mb-4">
                加入飞书群并填写问卷后，我们会联系并发送 Key。拿到 Key 后，将其输入到 nexu Bot
                即可开始体验。
              </p>
              <button
                type="button"
                onClick={() => openExternal(SEEDANCE_TUTORIAL_URL)}
                className="w-full mb-3 inline-flex items-center justify-center gap-1.5 text-[12px] font-medium text-[var(--color-brand-primary)] hover:underline"
              >
                <ArrowUpRight size={12} />
                查看教程：如何在 nexu Bot 中体验 Seedance 2.0
              </button>

              <button
                type="button"
                onClick={() => openExternal(FEISHU_GROUP_URL)}
                className="w-full h-[40px] rounded-[10px] bg-[var(--color-brand-primary)] hover:opacity-90 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-opacity mb-2.5"
              >
                <ExternalLink size={13} />
                点击链接加入飞书群
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full h-[36px] rounded-[10px] text-[12px] text-text-muted hover:text-text-secondary hover:bg-surface-2 transition-colors"
              >
                好的，已了解
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const CHANNEL_CONFIG_FIELDS: Record<
  string,
  { id: string; label: string; placeholder: string; helpText: string }[]
> = {
  feishu: [
    {
      id: "appId",
      label: "App ID",
      placeholder: "cli_xxxxxxxxxxxxxxxx",
      helpText: "Found in Feishu Open Platform > App Credentials",
    },
    {
      id: "appSecret",
      label: "App Secret",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      helpText: "Found in Feishu Open Platform > App Credentials",
    },
  ],
  slack: [
    {
      id: "botToken",
      label: "Bot User OAuth Token",
      placeholder: "xoxb-...",
      helpText: "Found in Slack App > OAuth & Permissions",
    },
    {
      id: "signingSecret",
      label: "Signing Secret",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      helpText: "Found in Slack App > Basic Information",
    },
  ],
  discord: [
    {
      id: "appId",
      label: "App ID",
      placeholder: "000000000000000000",
      helpText: "Found in Discord Developer Portal > General Information",
    },
    {
      id: "botToken",
      label: "Bot Token",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      helpText: "Found in Discord Developer Portal > Bot",
    },
  ],
};

function HomeDashboard({
  onNavigate,
  onRequestSeedanceModal,
  plan,
  quotaState,
  onOpenPricing,
  showTyping: _showTyping,
  onTypingComplete: _onTypingComplete,
  stars,
}: {
  onNavigate: (view: View) => void;
  onRequestSeedanceModal: () => void;
  plan: BillingPlanId;
  quotaState: UsageQuotaState;
  onOpenPricing: (target?: "plans" | "credit-packs") => void;
  showTyping?: boolean;
  onTypingComplete?: () => void;
  stars?: number | null;
}) {
  const { t } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoHover, setVideoHover] = useState(false);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(() => {
    try {
      const v = localStorage.getItem(CHANNELS_CONNECTED_KEY);
      return v ? new Set(JSON.parse(v)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [activeChannelId, setActiveChannelId] = useState(
    () => localStorage.getItem(CHANNEL_ACTIVE_KEY) || "",
  );
  const [configChannel, setConfigChannel] = useState<string | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [selectedModelId, setSelectedModelId] = useState("nexu-claude-opus-4-6");
  const [showSeedanceBanner, setShowSeedanceBanner] = useState(() => {
    try {
      return localStorage.getItem(SEEDANCE_BANNER_DISMISSED_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [dismissedBudgetBanner, setDismissedBudgetBanner] = useState(() => {
    try {
      return localStorage.getItem(BUDGET_BANNER_DISMISSED_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [seedanceNow, setSeedanceNow] = useState(Date.now());
  const hasChannel = connectedIds.size > 0;
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
  const currentPlan = BILLING_PLANS.find((item) => item.id === plan) ?? BILLING_PLANS[0];
  const proPlan = BILLING_PLANS.find((item) => item.id === "pro") ?? BILLING_PLANS[0];
  const budgetBannerSignature = `${plan}:${quotaState}`;
  const quotaAlert = quotaState === "warning" || quotaState === "depleted";

  const dismissBudgetBanner = () => {
    setDismissedBudgetBanner(budgetBannerSignature);
    try {
      localStorage.setItem(BUDGET_BANNER_DISMISSED_KEY, budgetBannerSignature);
    } catch {
      // noop
    }
  };

  const budgetBanner =
    quotaAlert &&
    dismissedBudgetBanner !== budgetBannerSignature &&
    selectedModel?.providerId === "nexu"
      ? (() => {
          const isDepleted = quotaState === "depleted";
          const accentClass = isDepleted
            ? "border-[var(--color-danger)]/25 bg-[var(--color-danger)]/6"
            : "border-[var(--color-warning)]/25 bg-[var(--color-warning)]/6";
          const iconClass = isDepleted
            ? "bg-[var(--color-danger)]/12 text-[var(--color-danger)]"
            : "bg-[var(--color-warning)]/12 text-[var(--color-warning)]";
          const headline = isDepleted
            ? `${currentPlan.name} credits are exhausted`
            : `${currentPlan.name} credits are running low`;
          const proCapacityMultiple = Math.max(
            1,
            Math.round(proPlan.credits / Math.max(currentPlan.credits, 1)),
          );
          const planSpecificCopy =
            plan === "free"
              ? "Switch to BYOK now, or upgrade to unlock more included nexu credits."
              : plan === "plus"
                ? `Upgrade to Pro for ${proCapacityMultiple}x more monthly credits, or top up with credit packs.`
                : plan === "pro"
                  ? "Top up with credit packs now, or switch to BYOK while this cycle resets."
                  : "Top up with credit packs now, or review higher-cap options for your workspace.";

          return (
            <div
              className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 ${accentClass}`}
            >
              <button
                type="button"
                aria-label="Dismiss budget banner"
                onClick={dismissBudgetBanner}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white/70 hover:text-text-primary"
              >
                <X size={14} />
              </button>

              <div className="pr-8">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                  >
                    <AlertCircle size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[15px] font-semibold text-text-primary">
                        {headline}
                      </span>
                      <span className="rounded-full border border-white/70 bg-white/80 px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                        {currentPlan.name}
                      </span>
                      <span className="rounded-full border border-white/70 bg-white/60 px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                        {isDepleted ? "Depleted" : "Warning"}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                      You’re using nexu-managed models in Home. {planSpecificCopy}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {plan === "plus" && (
                    <>
                      <Button size="sm" onClick={() => onOpenPricing("plans")}>
                        Upgrade to Pro · {proPlan.credits.toLocaleString()} credits / month
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenPricing("credit-packs")}
                      >
                        Browse credit packs
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onNavigate({ type: "settings", tab: "providers" })}
                      >
                        Use BYOK
                      </Button>
                    </>
                  )}

                  {plan === "pro" && (
                    <>
                      <Button size="sm" onClick={() => onOpenPricing("credit-packs")}>
                        Buy credit packs
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onNavigate({ type: "settings", tab: "providers" })}
                      >
                        Use BYOK
                      </Button>
                    </>
                  )}

                  {plan === "ultimate" && (
                    <>
                      <Button size="sm" onClick={() => onOpenPricing("credit-packs")}>
                        Buy credit packs
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onOpenPricing("plans")}>
                        Review plan options
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onNavigate({ type: "settings", tab: "providers" })}
                      >
                        Use BYOK
                      </Button>
                    </>
                  )}

                  {plan === "free" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => onNavigate({ type: "settings", tab: "providers" })}
                      >
                        Use BYOK
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onOpenPricing("plans")}>
                        Upgrade plan
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })()
      : null;

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
    setShowSecrets({});
  };

  const handleOpenConfig = (channelId: string) => {
    setConfigChannel(channelId);
    setConfigValues({});
    setShowSecrets({});
  };

  const handleCloseConfig = () => {
    setConfigChannel(null);
    setConfigValues({});
    setShowSecrets({});
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
      // noop
    }
  }, []);

  useEffect(() => {
    const handleReset = () => {
      setShowSeedanceBanner(true);
      try {
        localStorage.removeItem(SEEDANCE_BANNER_DISMISSED_KEY);
      } catch {
        // noop
      }
    };
    window.addEventListener("seedance-banner-reset", handleReset);
    return () => window.removeEventListener("seedance-banner-reset", handleReset);
  }, []);

  const dismissSeedanceBanner = () => {
    setShowSeedanceBanner(false);
    try {
      localStorage.setItem(SEEDANCE_BANNER_DISMISSED_KEY, "1");
    } catch {
      // noop
    }
  };

  const seedanceBanner = showSeedanceBanner ? (
    <button
      type="button"
      onClick={onRequestSeedanceModal}
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
              Seedance 2.0 体验 Key
            </span>
            <SeedanceCountdownBlocks now={seedanceNow} compact />
          </div>
          <p className="mt-1 text-[12px] text-text-secondary leading-relaxed">
            nexu 已支持 Seedance 2.0。Star 后加入飞书群并填写问卷，我们会联系并发送 Key。
          </p>
        </div>
        <ArrowRight
          size={14}
          className="shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5"
        />
      </div>
      <button
        type="button"
        aria-label="关闭活动横幅"
        onClick={(e) => {
          e.stopPropagation();
          dismissSeedanceBanner();
        }}
        className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white/70 hover:text-text-primary"
      >
        <X size={12} />
      </button>
    </button>
  ) : null;

  /* ── Scene A: First-run — Top (Hero) + Middle (Channels) only ── */
  if (!hasChannel) {
    return (
      <ScrollArea className="h-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
          {/* ═══ TOP: Hero — Bot idle, waiting to be activated ═══ */}
          <div className="flex flex-col items-center text-center">
            <button
              type="button"
              className="relative w-32 h-32 mb-1 cursor-default"
              onMouseEnter={() => setVideoHover(true)}
              onMouseLeave={() => setVideoHover(false)}
              aria-label="Preview nexu animation"
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
            </button>
            <h2
              className="text-[32px] font-normal tracking-tight text-text-primary mb-1.5"
              style={{ fontFamily: "var(--font-script)" }}
            >
              nexu alpha
            </h2>
            <div className="flex items-center gap-3 text-[11px] text-text-muted">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning)] leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)] animate-pulse shrink-0" />
                {t("ws.home.idle")}
              </span>
              <span>{t("ws.home.waitingForActivation")}</span>
            </div>

            {/* Speech bubble — minimal pill */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-1 border border-border/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] animate-pulse shrink-0" />
              <span className="text-[12px] text-text-secondary">
                {t("ws.home.connectToActivate")}
              </span>
            </div>
          </div>

          {budgetBanner}

          {/* ═══ MIDDLE: Channels — default open, Feishu highlighted ═══ */}
          <div className="card overflow-visible">
            <div className="px-5 pt-4 pb-3">
              <span className="text-[12px] font-medium text-text-primary">
                {t("ws.home.chooseChannel")}
              </span>
            </div>
            <div className="px-5 pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {ONBOARDING_CHANNELS.map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <button
                      type="button"
                      key={ch.id}
                      onClick={() => handleOpenConfig(ch.id)}
                      className={`group relative rounded-xl border px-3 py-3 text-left transition-all cursor-pointer active:scale-[0.98] border-border bg-surface-0 hover:border-border-hover hover:bg-surface-1 ${
                        ch.recommended ? "animate-breathe" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-border bg-white shrink-0">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-medium text-text-primary">{ch.name}</div>
                          <div className="mt-0.5 text-[11px] text-text-muted">
                            {t("ws.home.addNexuBot")}
                          </div>
                        </div>
                        <ArrowRight
                          size={13}
                          className="text-text-muted group-hover:text-text-secondary transition-colors shrink-0 mt-0.5"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {seedanceBanner}
          {import.meta.env.DEV && !showSeedanceBanner ? (
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("seedance-banner-reset"))}
              className="w-full rounded-lg border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/12 py-1.5 text-[11px] font-medium text-[var(--color-warning)] transition-colors hover:bg-[var(--color-warning)]/18"
            >
              恢复 Seedance Banner
            </button>
          ) : null}
        </div>

        {/* Channel config modal */}
        {configChannel &&
          (() => {
            const ch = ONBOARDING_CHANNELS.find((c) => c.id === configChannel);
            if (!ch) return null;
            const fields = CHANNEL_CONFIG_FIELDS[configChannel] || [];
            const Icon = ch.icon;
            const allFilled = fields.every((f) => (configValues[f.id] || "").trim().length > 0);
            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={handleCloseConfig}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleCloseConfig();
                  }}
                />
                <div className="relative w-full max-w-md mx-4 rounded-2xl border border-border bg-white shadow-2xl">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-border bg-white">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-semibold text-text-primary">
                          {t("ws.common.connect")} {ch.name}
                        </h3>
                        <p className="text-[11px] text-text-muted">
                          {t("ws.home.configureCredentials")}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseConfig}
                      className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted hover:text-text-secondary transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {/* Fields */}
                  <div className="px-6 py-5 space-y-4">
                    {fields.map((field) => (
                      <div key={field.id}>
                        <label
                          htmlFor={field.id}
                          className="block text-[12px] font-medium text-text-primary mb-1.5"
                        >
                          {field.label}
                        </label>
                        <div className="relative">
                          <input
                            type={showSecrets[field.id] ? "text" : "password"}
                            value={configValues[field.id] || ""}
                            onChange={(e) =>
                              setConfigValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                            }
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 pr-9 rounded-lg border border-border bg-surface-0 text-[13px] text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)]/30 transition-colors font-mono"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowSecrets((prev) => ({ ...prev, [field.id]: !prev[field.id] }))
                            }
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                          >
                            {showSecrets[field.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                        <p className="text-[11px] text-text-muted mt-1">{field.helpText}</p>
                      </div>
                    ))}
                    {/* Doc link */}
                    <a
                      href={ch.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link mt-1"
                    >
                      <FileText size={13} />
                      {t("ws.home.viewSetupGuide").replace("{name}", ch.name)}
                    </a>
                  </div>
                  <PanelFooter className="px-6 py-4">
                    <PanelFooterActions className="ml-auto">
                      <Button
                        size="inline"
                        variant="ghost"
                        onClick={handleCloseConfig}
                        className="px-4 py-2 rounded-lg text-[13px] font-medium text-text-secondary hover:bg-surface-2 transition-colors"
                      >
                        {t("ws.common.cancel")}
                      </Button>
                      <Button
                        size="inline"
                        onClick={() => handleConnectChannel(configChannel)}
                        disabled={!allFilled}
                        className="px-4 py-2 rounded-lg text-[13px] font-medium bg-accent text-accent-fg hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {t("ws.common.connect")}
                      </Button>
                    </PanelFooterActions>
                  </PanelFooter>
                </div>
              </div>
            );
          })()}
      </ScrollArea>
    );
  }

  /* ── Scene C: Operational — compact hero, efficiency-first ── */
  return (
    <ScrollArea className="h-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* ═══ TOP: Compact Hero — Bot + CTA ═══ */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative w-28 h-28 shrink-0 cursor-default"
            onMouseEnter={() => setVideoHover(true)}
            onMouseLeave={() => setVideoHover(false)}
            aria-label="Preview nexu animation"
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
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 w-full">
              <h2
                className="text-[32px] font-normal tracking-tight text-text-primary leading-none m-0"
                style={{ fontFamily: "var(--font-script)" }}
              >
                nexu alpha
              </h2>
              <span className="flex items-center gap-1 px-1.5 py-1 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] text-[10px] font-medium leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] shrink-0" />
                {t("ws.home.running")}
              </span>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="link-github-star group ml-auto shrink-0"
              >
                <Star
                  size={12}
                  className="text-amber-500 group-hover:fill-amber-500 transition-colors shrink-0"
                />
                {t("ws.common.starOnGitHub")}
                {stars && stars > 0 && (
                  <span className="tabular-nums text-text-muted text-[10px]">
                    ({stars.toLocaleString()})
                  </span>
                )}
                <ArrowUpRight size={11} className="shrink-0 translate-y-px" />
              </a>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <Combobox value={selectedModelId} onValueChange={setSelectedModelId}>
                <ComboboxTrigger className="w-[280px] bg-surface-0 text-[12px]">
                  <span className="flex items-center gap-1.5 text-left">
                    {selectedModel ? (
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                        <ProviderLogo
                          provider={
                            getModelIconProvider(selectedModel.name) || selectedModel.providerId
                          }
                          size={14}
                        />
                      </span>
                    ) : (
                      <Cpu size={13} className="text-text-muted" />
                    )}
                    <span className="truncate font-medium">
                      {selectedModel?.name ?? t("ws.home.notSelected")}
                    </span>
                  </span>
                </ComboboxTrigger>
                <ComboboxContent className="w-[320px]">
                  <ComboboxInput
                    placeholder={t("ws.home.searchModels")}
                    leadingIcon={<Search size={12} />}
                  />
                  <ScrollArea
                    className="max-h-[280px] p-1"
                    style={{ overscrollBehavior: "contain" }}
                  >
                    <div className="space-y-1">
                      {allEnabledModels.map((model) => (
                        <ComboboxItem
                          key={model.id}
                          value={model.id}
                          textValue={`${model.name} ${model.providerName} ${model.contextWindow}`}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-2">
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                              <ProviderLogo
                                provider={getModelIconProvider(model.name) || model.providerId}
                                size={13}
                              />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[12px] font-medium text-text-primary">
                                {model.name}
                              </div>
                              <div className="truncate text-[10px] text-text-muted/70">
                                {model.providerName} · {model.contextWindow}
                              </div>
                            </div>
                          </div>
                        </ComboboxItem>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="border-t border-border px-2 py-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-2.5 text-[11px] text-text-primary"
                      onClick={() => onNavigate({ type: "settings" })}
                    >
                      <Settings size={11} className="text-text-primary" />
                      {t("ws.home.configureProviders")}
                    </Button>
                  </div>
                </ComboboxContent>
              </Combobox>
              <div className="flex items-center gap-2 text-[11px] text-text-muted ml-3">
                <span>{t("ws.home.messagesToday")}</span>
                <span className="text-border">·</span>
                <span>{t("ws.home.activeAgo")}</span>
              </div>
            </div>
          </div>
        </div>

        {budgetBanner}

        {/* ═══ MIDDLE: Channels Panel ═══ */}
        <div className="card card-static">
          <div className="px-5 pt-4 pb-3">
            <h2 className="text-[14px] font-semibold text-text-primary">{t("ws.home.channels")}</h2>
          </div>
          <div className="px-5 pb-5">
            {true && (
              <div className="space-y-3">
                {/* Connected channels — click to switch active */}
                {connectedChannels.length > 0 && (
                  <div className="space-y-1.5">
                    {connectedChannels.map((ch) => {
                      const Icon = ch.icon;
                      return (
                        <InteractiveRow
                          key={ch.id}
                          onClick={() => openExternal(ch.chatUrl)}
                          className="items-center rounded-xl bg-white px-4 py-3"
                        >
                          <InteractiveRowLeading className="w-8 h-8 rounded-[10px] flex items-center justify-center border border-border bg-white">
                            <Icon size={16} />
                          </InteractiveRowLeading>
                          <InteractiveRowContent className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-text-primary">
                              {ch.name}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] shrink-0" />
                          </InteractiveRowContent>
                          <Button
                            size="inline"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDisconnectChannel(ch.id);
                            }}
                            className="rounded-[8px] px-[14px] py-[5px] text-[12px] font-medium bg-surface-2 text-text-secondary hover:text-[var(--color-danger)] hover:bg-surface-3 transition-colors shrink-0"
                          >
                            {t("ws.home.connected")}
                          </Button>
                          <InteractiveRowTrailing className="inline-flex items-center gap-1 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors ml-3 leading-none">
                            {t("ws.home.chat")}
                            <ArrowUpRight size={12} className="-mt-px" />
                          </InteractiveRowTrailing>
                        </InteractiveRow>
                      );
                    })}
                  </div>
                )}

                {/* Not-yet-connected channels */}
                {ONBOARDING_CHANNELS.filter((ch) => !connectedIds.has(ch.id)).length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ONBOARDING_CHANNELS.filter((ch) => !connectedIds.has(ch.id)).map((ch) => {
                      const Icon = ch.icon;
                      return (
                        <button
                          type="button"
                          key={ch.id}
                          onClick={() => handleOpenConfig(ch.id)}
                          className="group flex items-center gap-2.5 rounded-lg border border-dashed border-border bg-surface-0 px-3 py-2 text-left hover:border-solid hover:border-border-hover hover:bg-surface-1 transition-all"
                        >
                          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-surface-1 shrink-0">
                            <Icon size={13} />
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
                )}
              </div>
            )}
          </div>
        </div>

        {seedanceBanner}
        {import.meta.env.DEV && !showSeedanceBanner ? (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("seedance-banner-reset"))}
            className="w-full rounded-lg border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/12 py-1.5 text-[11px] font-medium text-[var(--color-warning)] transition-colors hover:bg-[var(--color-warning)]/18"
          >
            恢复 Seedance Banner
          </button>
        ) : null}

        {/* ═══ BOTTOM: GitHub Star Banner — echoes link-github-star, disappears after star ═══ */}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-rest)] transition-all hover:scale-[1.01] hover:border-border-hover hover:shadow-[var(--shadow-refine)] cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0">
              <Star
                size={20}
                className="text-amber-500 group-hover:fill-amber-500 transition-colors"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-text-primary">
                {t("ws.home.starNexu")}
              </div>
              <div className="text-[12px] text-text-secondary mt-0.5">{t("ws.home.starCta")}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {stars && stars > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50/80 border border-amber-200/50 text-[12px] font-medium text-[#92400e]">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="tabular-nums">{stars.toLocaleString()}</span>
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(251,191,36,0.12)] border border-amber-200/60 text-[12px] font-medium text-[#b45309] group-hover:bg-[rgba(251,191,36,0.2)] group-hover:border-amber-300/60 transition-colors">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>{t("ws.home.github")}</span>
                <ArrowUpRight size={11} className="shrink-0 translate-y-px" />
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Channel config modal — shared across scenes */}
      {configChannel &&
        (() => {
          const ch = ONBOARDING_CHANNELS.find((c) => c.id === configChannel);
          if (!ch) return null;
          const fields = CHANNEL_CONFIG_FIELDS[configChannel] || [];
          const Icon = ch.icon;
          const allFilled = fields.every((f) => (configValues[f.id] || "").trim().length > 0);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={handleCloseConfig}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleCloseConfig();
                }}
              />
              <div className="relative w-full max-w-md mx-4 rounded-2xl border border-border bg-white shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-border bg-white">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-semibold text-text-primary">
                        {t("ws.common.connect")} {ch.name}
                      </h3>
                      <p className="text-[11px] text-text-muted">
                        {t("ws.home.configureCredentials")}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseConfig}
                    className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted hover:text-text-secondary transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                  {fields.map((field) => (
                    <div key={field.id}>
                      <label
                        htmlFor={field.id}
                        className="block text-[12px] font-medium text-text-primary mb-1.5"
                      >
                        {field.label}
                      </label>
                      <div className="relative">
                        <input
                          type={showSecrets[field.id] ? "text" : "password"}
                          value={configValues[field.id] || ""}
                          onChange={(e) =>
                            setConfigValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                          }
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 pr-9 rounded-lg border border-border bg-surface-0 text-[13px] text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)]/30 transition-colors font-mono"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowSecrets((prev) => ({ ...prev, [field.id]: !prev[field.id] }))
                          }
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                        >
                          {showSecrets[field.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      <p className="text-[11px] text-text-muted mt-1">{field.helpText}</p>
                    </div>
                  ))}
                  <a
                    href={ch.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link mt-1"
                  >
                    <FileText size={13} />
                    {t("ws.home.viewSetupGuide").replace("{name}", ch.name)}
                  </a>
                </div>
                <PanelFooter className="px-6 py-4">
                  <PanelFooterActions className="ml-auto">
                    <Button
                      size="inline"
                      variant="ghost"
                      onClick={handleCloseConfig}
                      className="px-4 py-2 rounded-lg text-[13px] font-medium text-text-secondary hover:bg-surface-2 transition-colors"
                    >
                      {t("ws.common.cancel")}
                    </Button>
                    <Button
                      size="inline"
                      onClick={() => handleConnectChannel(configChannel)}
                      disabled={!allFilled}
                      className="px-4 py-2 rounded-lg text-[13px] font-medium bg-accent text-accent-fg hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {t("ws.common.connect")}
                    </Button>
                  </PanelFooterActions>
                </PanelFooter>
              </div>
            </div>
          );
        })()}
    </ScrollArea>
  );
}

/* ------------------------------------------------------------------ */
/*  Conversations View                                                 */
/* ------------------------------------------------------------------ */

function ConversationsView({ initialChannelId }: { initialChannelId?: string }) {
  const { t } = useLocale();
  const channels = MOCK_CHANNELS;
  const channelId = initialChannelId ?? channels[0]?.id ?? "";

  if (!channelId) {
    return (
      <div className="flex items-center justify-center h-full w-full text-[13px] text-text-muted">
        {t("ws.conversations.selectFromSidebar")}
      </div>
    );
  }

  return <ChannelDetailPage channelId={channelId} />;
}

/* ------------------------------------------------------------------ */
/*  Deployments View                                                   */
/* ------------------------------------------------------------------ */

function DeploymentsView() {
  const { t } = useLocale();
  const deployments = MOCK_DEPLOYMENTS;
  const channelMap = Object.fromEntries(MOCK_CHANNELS.map((c) => [c.id, c.name]));

  const statusDot: Record<string, string> = {
    live: "status-dot-live",
    building: "status-dot-building",
    failed: "status-dot-failed",
  };
  const statusLabel: Record<string, { textKey: string; color: string }> = {
    live: { textKey: "ws.deployments.statusLive", color: "text-[var(--color-success)]" },
    building: { textKey: "ws.deployments.statusBuilding", color: "text-[var(--color-warning)]" },
    failed: { textKey: "ws.deployments.statusFailed", color: "text-[var(--color-danger)]" },
  };

  const colStyle = { gridTemplateColumns: "1fr 88px 112px 140px 40px" };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="heading-page">{t("ws.deployments.title")}</h1>
          <p className="heading-page-desc">{t("ws.deployments.subtitle")}</p>
        </div>

        <div className="data-table">
          <div className="data-table-header" style={colStyle}>
            <span>{t("ws.deployments.colName")}</span>
            <span>{t("ws.deployments.colStatus")}</span>
            <span>{t("ws.deployments.colChannel")}</span>
            <span>{t("ws.deployments.colDeployed")}</span>
            <span />
          </div>
          {deployments.map((d) => {
            const channelName = d.channelId ? channelMap[d.channelId] : null;
            const sl = statusLabel[d.status] ?? statusLabel.live;
            return (
              <div key={d.id} className="data-table-row" style={colStyle}>
                <span
                  className="text-[13px] font-medium text-text-primary truncate"
                  title={d.title}
                >
                  {d.title}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className={`status-dot ${statusDot[d.status] ?? ""}`} />
                  <span className={`text-[12px] font-medium ${sl.color}`}>{t(sl.textKey)}</span>
                </span>
                <span>
                  {channelName && (
                    <span className="text-[11px] leading-none px-2 py-0.5 rounded-full bg-surface-2 text-text-muted">
                      {channelName}
                    </span>
                  )}
                </span>
                <span className="text-[12px] tabular-nums text-text-muted">{d.createdAt}</span>
                <span>
                  {d.url && (
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link w-6 h-6 rounded-md flex items-center justify-center text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors relative"
                      title={d.url.replace(/^https?:\/\//, "")}
                    >
                      <ArrowUpRight size={12} />
                    </a>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings View                                                      */
/* ------------------------------------------------------------------ */

type SettingsTab = "general" | "usage" | "providers";

function isSettingsTab(value: string | null): value is SettingsTab {
  return value === "general" || value === "usage" || value === "providers";
}

function getAccountInitials(email: string) {
  return email
    .split("@")[0]
    .split(/[._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function isModelProvider(value: string | null): value is ModelProvider {
  return (
    value === "nexu" ||
    value === "anthropic" ||
    value === "openai" ||
    value === "google" ||
    value === "xai" ||
    value === "kimi" ||
    value === "glm" ||
    value === "minimax" ||
    value === "openrouter" ||
    value === "siliconflow" ||
    value === "ppio" ||
    value === "xiaoxiang"
  );
}

function SettingsView({
  initialTab = "general",
  initialProviderId = "anthropic",
  appVersion,
  updateStatus,
  onCheckForUpdates,
  onOpenChangelog,
  onOpenPricing,
  usagePlan,
  onUsagePlanChange,
  usageQuotaState,
  onUsageQuotaStateChange,
}: {
  initialTab?: SettingsTab;
  initialProviderId?: ModelProvider;
  appVersion: string;
  updateStatus: "idle" | "checking" | "available" | "ready" | "error";
  onCheckForUpdates: () => void;
  onOpenChangelog: () => void;
  onOpenPricing: () => void;
  usagePlan: BillingPlanId;
  onUsagePlanChange: (plan: BillingPlanId) => void;
  usageQuotaState: UsageQuotaState;
  onUsageQuotaStateChange: (state: UsageQuotaState) => void;
}) {
  const { t } = useLocale();
  const [settingsTab, setSettingsTab] = useState<SettingsTab>(initialTab);
  const providers = getProviderDetails();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [launchAtLogin, setLaunchAtLogin] = useState(true);
  const [showInDock, setShowInDock] = useState(true);
  const [usageAnalytics, setUsageAnalytics] = useState(true);
  const [crashReports, setCrashReports] = useState(true);
  const [configuredProviders, setConfiguredProviders] = useState<Set<string>>(
    () => new Set(["nexu"]),
  );
  const availableModels = providers
    .filter((p) => p.id === "nexu" || configuredProviders.has(p.id))
    .flatMap((p) => p.models.map((m) => ({ ...m, providerName: p.name, providerId: p.id })));
  const [activeProviderId, setActiveProviderId] = useState<ModelProvider>(initialProviderId);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(() => {
    const nexu = providers.find((p) => p.id === "nexu");
    return nexu?.models[0]?.id ?? null;
  });
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [formValues, setFormValues] = useState<
    Record<string, { apiKey: string; proxyUrl: string }>
  >({});
  const [savedValues, setSavedValues] = useState<
    Record<string, { apiKey: string; proxyUrl: string }>
  >({});
  const [saveStates, setSaveStates] = useState<Record<string, "idle" | "saving" | "saved">>({});
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});
  const [showSavedBannerFor, setShowSavedBannerFor] = useState<string | null>(null);
  const [checkStates, setCheckStates] = useState<
    Record<string, "idle" | "checking" | "success" | "error">
  >({});
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const signedInEmail = "ralph.wiggum@nexu.ai";

  const activeProvider = providers.find((p) => p.id === activeProviderId) ?? providers[0];
  const selectedModel = selectedModelId
    ? (availableModels.find((m) => m.id === selectedModelId) ?? null)
    : null;

  useEffect(() => {
    setSettingsTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!showModelDropdown) return;
    const handler = (e: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setShowModelDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showModelDropdown]);

  const getFormValues = (providerId: string) => {
    const p = providers.find((x) => x.id === providerId);
    return formValues[providerId] ?? { apiKey: "", proxyUrl: p?.proxyUrl ?? "" };
  };

  const isDirty = (providerId: string) => {
    const saved = savedValues[providerId];
    if (!saved) return true;
    const curr = getFormValues(providerId);
    return curr.apiKey !== saved.apiKey || curr.proxyUrl !== saved.proxyUrl;
  };

  const setFormField = (providerId: string, field: "apiKey" | "proxyUrl", value: string) => {
    setFormValues((prev) => {
      const curr = prev[providerId] ?? {
        apiKey: "",
        proxyUrl: providers.find((p) => p.id === providerId)?.proxyUrl ?? "",
      };
      return { ...prev, [providerId]: { ...curr, [field]: value } };
    });
    if (savedValues[providerId]) setSaveStates((prev) => ({ ...prev, [providerId]: "idle" }));
  };

  // Save = verify + save in one step
  const handleSave = (providerId: string) => {
    setSaveErrors((prev) => ({ ...prev, [providerId]: "" }));
    setSaveStates((prev) => ({ ...prev, [providerId]: "saving" }));
    const curr = getFormValues(providerId);
    setTimeout(() => {
      const verifyOk = Math.random() > 0.2; // 80% success for prototype
      if (verifyOk) {
        setSaveStates((prev) => ({ ...prev, [providerId]: "saved" }));
        setSavedValues((prev) => ({ ...prev, [providerId]: { ...curr } }));
        setConfiguredProviders((prev) => new Set([...prev, providerId]));
        const p = providers.find((x) => x.id === providerId);
        if (p?.models[0]) setSelectedModelId(p.models[0].id);
        setShowSavedBannerFor(providerId);
        setTimeout(() => setShowSavedBannerFor(null), 2500);
      } else {
        setSaveErrors((prev) => ({ ...prev, [providerId]: "ws.settings.connectionFailedShort" }));
        setSaveStates((prev) => ({ ...prev, [providerId]: "idle" }));
      }
    }, 1200);
  };

  const handleCheck = (providerId: string) => {
    setCheckStates((prev) => ({ ...prev, [providerId]: "checking" }));
    setTimeout(() => {
      setCheckStates((prev) => ({
        ...prev,
        [providerId]: Math.random() > 0.3 ? "success" : "error",
      }));
      setTimeout(() => setCheckStates((prev) => ({ ...prev, [providerId]: "idle" })), 3000);
    }, 1500);
  };

  const saveState = saveStates[activeProvider.id] ?? "idle";
  const saveError = saveErrors[activeProvider.id] ?? "";
  const checkState = checkStates[activeProvider.id] ?? "idle";
  const providerDirty = activeProvider.id !== "nexu" && isDirty(activeProvider.id);
  const showSaved = saveState === "saved" && !providerDirty;
  const updateStatusLabel =
    updateStatus === "checking"
      ? t("ws.update.checking")
      : updateStatus === "ready"
        ? t("ws.update.ready").replace("{{version}}", appVersion)
        : updateStatus === "error"
          ? t("ws.update.failed")
          : updateStatus === "available"
            ? t("ws.update.available").replace("{{version}}", appVersion)
            : t("ws.update.upToDateSub").replace("{{version}}", appVersion);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="heading-page">{t("ws.settings.title")}</h2>
            <p className="heading-page-desc">{t("ws.settings.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-github-star group"
            >
              <Star
                size={13}
                className="text-amber-500 group-hover:fill-amber-500 transition-colors shrink-0"
              />
              {t("ws.common.starOnGitHub")}
              <ArrowUpRight size={11} className="shrink-0 translate-y-px" />
            </a>
            <Button
              size="inline"
              variant="outline"
              onClick={() =>
                openExternal("file:///Users/chaoxiaoche/Desktop/agent-digital-cowork/clone/")
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[12px] font-medium text-text-primary hover:border-border-hover hover:bg-surface-1 transition-colors"
            >
              <FolderOpen size={13} />
              {t("ws.settings.workspace")}
              <ArrowUpRight size={12} className="text-text-muted" />
            </Button>
          </div>
        </div>

        <div className="mb-6" role="tablist" aria-label={t("ws.settings.title")}>
          <div className="inline-flex rounded-xl border border-border bg-surface-1 p-1">
            {[
              { id: "general" as const, label: t("ws.settings.tab.general") },
              { id: "usage" as const, label: "Usage" },
              { id: "providers" as const, label: t("ws.settings.tab.providers") },
            ].map((tab) => {
              const active = settingsTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSettingsTab(tab.id)}
                  className={`rounded-lg px-4 py-2 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-surface-0 text-text-primary shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {settingsTab === "general" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface-1 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[15px] font-semibold text-text-primary">
                    {t("ws.settings.account.title")}
                  </div>
                  <div className="mt-1 text-[12px] text-text-secondary">
                    {isSignedIn
                      ? t("ws.settings.account.signedInDesc")
                      : t("ws.settings.account.signedOutDesc")}
                  </div>
                </div>

                {isSignedIn ? (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-0 px-3 py-3 sm:min-w-[280px] sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-semibold text-accent-fg">
                        {getAccountInitials(signedInEmail)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-text-primary">
                          {t("ws.settings.account.connected")}
                        </div>
                        <div className="truncate text-[12px] text-text-secondary">
                          {signedInEmail}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="inline"
                      variant="ghost"
                      onClick={() => setIsSignedIn(false)}
                      className="text-[12px] text-text-secondary hover:text-text-primary"
                    >
                      {t("ws.settings.account.signOut")}
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    size="inline"
                    onClick={() => setIsSignedIn(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-[12px] font-medium text-accent-fg transition-colors hover:bg-accent/90"
                  >
                    {t("ws.settings.account.signIn")}
                    <ArrowUpRight size={12} />
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface-1 p-5">
                <div className="mb-4">
                  <div className="text-[15px] font-semibold text-text-primary">
                    {t("ws.settings.behavior.title")}
                  </div>
                  <div className="mt-1 text-[12px] text-text-secondary">
                    {t("ws.settings.behavior.subtitle")}
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      key: "launch-at-login",
                      title: t("ws.settings.behavior.launchAtLogin"),
                      description: t("ws.settings.behavior.launchAtLoginDesc"),
                      checked: launchAtLogin,
                      onCheckedChange: setLaunchAtLogin,
                    },
                    {
                      key: "show-in-dock",
                      title: t("ws.settings.behavior.showInDock"),
                      description: t("ws.settings.behavior.showInDockDesc"),
                      checked: showInDock,
                      onCheckedChange: setShowInDock,
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-0 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-text-primary">
                          {item.title}
                        </div>
                        <div className="mt-1 text-[12px] text-text-secondary">
                          {item.description}
                        </div>
                      </div>
                      <Switch
                        size="sm"
                        checked={item.checked}
                        aria-label={item.title}
                        onCheckedChange={item.onCheckedChange}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface-1 p-5">
                <div className="mb-4">
                  <div className="text-[15px] font-semibold text-text-primary">
                    {t("ws.settings.privacy.title")}
                  </div>
                  <div className="mt-1 text-[12px] text-text-secondary">
                    {t("ws.settings.privacy.subtitle")}
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      key: "usage-analytics",
                      title: t("ws.settings.privacy.usageAnalytics"),
                      description: t("ws.settings.privacy.usageAnalyticsDesc"),
                      checked: usageAnalytics,
                      onCheckedChange: setUsageAnalytics,
                    },
                    {
                      key: "crash-reports",
                      title: t("ws.settings.privacy.crashReports"),
                      description: t("ws.settings.privacy.crashReportsDesc"),
                      checked: crashReports,
                      onCheckedChange: setCrashReports,
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-0 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-text-primary">
                          {item.title}
                        </div>
                        <div className="mt-1 text-[12px] text-text-secondary">
                          {item.description}
                        </div>
                      </div>
                      <Switch
                        size="sm"
                        checked={item.checked}
                        aria-label={item.title}
                        onCheckedChange={item.onCheckedChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface-1 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-[15px] font-semibold text-text-primary">
                    {t("ws.settings.about.title")}
                  </div>
                  <div className="mt-1 text-[12px] text-text-secondary">
                    {t("ws.settings.about.subtitle")}
                  </div>
                </div>
                <div className="min-w-[220px] rounded-xl border border-border bg-surface-0 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-wider text-text-tertiary">
                    {t("ws.settings.about.version")}
                  </div>
                  <div className="mt-1 text-[15px] font-semibold text-text-primary">
                    v{appVersion}
                  </div>
                  <div className="mt-1 text-[12px] text-text-secondary">{updateStatusLabel}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="inline"
                  onClick={onCheckForUpdates}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-[12px] font-medium text-accent-fg transition-colors hover:bg-accent/90"
                >
                  {updateStatus === "checking" && <Loader2 size={12} className="animate-spin" />}
                  {t("ws.settings.about.checkForUpdates")}
                </Button>
                <Button
                  type="button"
                  size="inline"
                  variant="ghost"
                  onClick={onOpenChangelog}
                  className="text-[12px] text-text-secondary hover:text-text-primary"
                >
                  {t("ws.update.changelog")}
                </Button>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[12px] font-medium text-text-secondary transition-colors hover:bg-surface-0 hover:text-text-primary"
                >
                  {t("ws.common.starOnGitHub")}
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </div>
        )}

        {settingsTab === "usage" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface-1 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-[15px] font-semibold text-text-primary">Usage & billing</div>
                  <div className="mt-1 text-[12px] text-text-secondary">
                    Review current plan benefits, reset countdown, rewards credits, and upgrade
                    paths.
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["free", "plus", "pro", "ultimate"] as const).map((plan) => (
                    <Button
                      key={plan}
                      size="inline"
                      variant={usagePlan === plan ? "default" : "outline"}
                      onClick={() => onUsagePlanChange(plan)}
                    >
                      {plan}
                    </Button>
                  ))}
                  {(["healthy", "warning", "depleted"] as const).map((state) => (
                    <Button
                      key={state}
                      size="inline"
                      variant={usageQuotaState === state ? "default" : "outline"}
                      onClick={() => onUsageQuotaStateChange(state)}
                    >
                      {state}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <UsageSummaryPanel
              planId={usagePlan}
              usageState={usageQuotaState}
              isSignedIn={isSignedIn}
              onViewPlans={onOpenPricing}
              compact
            />
          </div>
        )}

        {settingsTab === "providers" && (
          <>
            <div className="relative mb-8" ref={modelDropdownRef}>
              <div className="rounded-xl border border-border bg-surface-1 px-4 py-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center shrink-0">
                      <img src="/brand/nexu logo-black1.svg" alt="nexu" className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-text-primary">
                        {t("ws.settings.nexuBotModel")}
                      </div>
                      <div className="text-[11px] text-text-tertiary">
                        {t("ws.settings.nexuBotModelDesc")}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowModelDropdown((v) => !v)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-0 hover:bg-surface-2 hover:border-border-hover transition-all text-[12px] font-medium text-text-primary"
                  >
                    {selectedModel ? (
                      <>
                        <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                          <ProviderLogo provider={selectedModel.providerId} size={14} />
                        </span>
                        {selectedModel.name}
                      </>
                    ) : (
                      <span className="text-text-muted">{t("ws.settings.select")}</span>
                    )}
                    <ChevronDown size={13} className="text-text-muted" />
                  </button>
                </div>
              </div>

              {showModelDropdown && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 rounded-xl border border-border bg-surface-0 shadow-lg overflow-hidden max-h-[320px] overflow-y-auto">
                  {providers
                    .filter((p) => p.id === "nexu" || configuredProviders.has(p.id))
                    .map((p) => (
                      <div key={p.id}>
                        <div className="px-3 pt-2.5 pb-1 text-[10px] font-semibold text-text-tertiary uppercase tracking-wider sticky top-0 bg-surface-0">
                          {p.name}
                        </div>
                        {p.models.map((m) => {
                          const isSelected = m.id === selectedModelId;
                          return (
                            <button
                              type="button"
                              key={m.id}
                              onClick={() => {
                                setSelectedModelId(m.id);
                                setShowModelDropdown(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${isSelected ? "bg-accent/5" : "hover:bg-surface-2"}`}
                            >
                              <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                                <ProviderLogo provider={p.id} size={14} />
                              </span>
                              <div className="flex-1 min-w-0">
                                <div
                                  className={`text-[12px] truncate ${isSelected ? "font-semibold text-accent" : "font-medium text-text-primary"}`}
                                >
                                  {m.name}
                                </div>
                                <div className="text-[10px] text-text-tertiary">{p.name}</div>
                              </div>
                              {isSelected && <Check size={14} className="text-accent shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div
              className="flex gap-0 rounded-xl border border-border bg-surface-1 overflow-hidden"
              style={{ minHeight: 520 }}
            >
              {/* Left: Provider list — flat, no enabled/disabled split */}
              <div className="w-56 shrink-0 bg-surface-0 overflow-y-auto">
                <div className="p-2 space-y-0.5">
                  {providers.map((p) => {
                    const active = p.id === activeProviderId;
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setActiveProviderId(p.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                          active ? "bg-surface-3" : "hover:bg-surface-2"
                        }`}
                      >
                        <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                          <ProviderLogo provider={p.id} size={16} />
                        </span>
                        <span
                          className={`flex-1 text-[12px] font-medium truncate ${active ? "text-accent" : "text-text-primary"}`}
                        >
                          {p.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Provider detail */}
              <div className="flex-1 overflow-y-auto p-5">
                {/* Header — no enable/disable switch */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-2 shrink-0">
                      <ProviderLogo provider={activeProvider.id} size={20} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold text-text-primary">
                        {activeProvider.name}
                      </div>
                      <div className="text-[11px] text-text-tertiary">
                        {activeProvider.description}
                      </div>
                    </div>
                  </div>
                  {activeProvider.apiDocsUrl && (
                    <a
                      href={activeProvider.apiDocsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-[11px] text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] no-underline hover:no-underline inline-flex items-center gap-1 leading-none"
                    >
                      {t("ws.settings.getApiKey")}
                      <ExternalLink size={10} className="shrink-0" />
                    </a>
                  )}
                </div>

                {/* Nexu login card */}
                {activeProvider.id === "nexu" && (
                  <div className="rounded-xl border border-[var(--color-brand-primary)]/25 bg-[var(--color-brand-subtle)] px-4 py-4 mb-6">
                    <div className="text-[13px] font-semibold text-[var(--color-brand-primary)]">
                      {t("ws.settings.signInTitle")}
                    </div>
                    <div className="text-[12px] leading-[1.7] text-text-secondary mt-1.5">
                      {t("ws.settings.signInDesc")}
                    </div>
                    <Button
                      size="inline"
                      onClick={() =>
                        openExternal(`${window.location.origin}/openclaw/auth?desktop=1`)
                      }
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-[12px] font-medium text-accent-fg transition-colors hover:bg-accent/90 cursor-pointer"
                    >
                      {t("ws.settings.signInBtn")}
                      <ArrowUpRight size={12} />
                    </Button>
                  </div>
                )}

                {/* API Key + Proxy URL + Save (hidden for nexu) */}
                {activeProvider.id !== "nexu" && (
                  <div className="space-y-4 mb-6">
                    <div className="text-[10px] uppercase tracking-wider text-text-muted mb-3">
                      {t("ws.settings.apiKeySteps")}
                    </div>
                    <div>
                      <label
                        htmlFor={`${activeProvider.id}-api-key`}
                        className="block text-[13px] font-semibold text-text-primary mb-3"
                      >
                        {t("ws.settings.apiKey")}
                      </label>
                      <input
                        id={`${activeProvider.id}-api-key`}
                        type="password"
                        placeholder={activeProvider.apiKeyPlaceholder}
                        value={getFormValues(activeProvider.id).apiKey}
                        onChange={(e) => setFormField(activeProvider.id, "apiKey", e.target.value)}
                        className="w-full rounded-lg border border-border bg-surface-0 px-3 py-2 text-[12px] text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)]/30"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`${activeProvider.id}-proxy-url`}
                        className="block text-[13px] font-semibold text-text-primary mb-3"
                      >
                        {t("ws.settings.apiProxyUrl")}
                      </label>
                      <input
                        id={`${activeProvider.id}-proxy-url`}
                        type="text"
                        value={getFormValues(activeProvider.id).proxyUrl}
                        onChange={(e) =>
                          setFormField(activeProvider.id, "proxyUrl", e.target.value)
                        }
                        className="w-full rounded-lg border border-border bg-surface-0 px-3 py-2 text-[12px] text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)]/30"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3 flex-wrap">
                      <Button
                        size="inline"
                        variant="ghost"
                        type="button"
                        onClick={() => handleCheck(activeProvider.id)}
                        disabled={checkState === "checking" || saveState === "saving"}
                        className="text-[11px] text-text-muted hover:text-text-secondary disabled:opacity-50"
                      >
                        {checkState === "checking" && t("ws.settings.testing")}
                        {checkState === "success" && t("ws.settings.connectedStatus")}
                        {checkState === "error" && t("ws.settings.retryTest")}
                        {checkState === "idle" && t("ws.settings.testConnection")}
                      </Button>
                      <Button
                        size="inline"
                        onClick={() => handleSave(activeProvider.id)}
                        disabled={saveState === "saving" || showSaved}
                        className={`w-[120px] shrink-0 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-[12px] font-medium transition-all ${
                          showSaved
                            ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20"
                            : "bg-accent text-accent-fg hover:bg-accent-hover"
                        } disabled:opacity-50`}
                      >
                        {saveState === "saving" && (
                          <Loader2 size={13} className="animate-spin shrink-0" />
                        )}
                        {showSaved && <Check size={13} className="shrink-0" />}
                        {!showSaved && saveState !== "saving" && t("ws.common.save")}
                        {saveState === "saving" && t("ws.common.saving")}
                        {showSaved && t("ws.common.saved")}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Model list — flat, no switches */}
                <div>
                  {showSaved && showSavedBannerFor === activeProvider.id && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-[var(--color-success)]/8 text-[11px] text-[var(--color-success)]">
                      <Check size={12} className="shrink-0" />
                      {t("ws.settings.savedSelectModel")}
                    </div>
                  )}
                  {saveError && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-[var(--color-error)]/8 text-[11px] text-[var(--color-error)]">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{t("ws.settings.connectionFailed")}</span>
                    </div>
                  )}
                  <div className="text-[13px] font-semibold text-text-primary mb-3">
                    {t("ws.settings.model")}{" "}
                    <span className="text-text-tertiary font-normal">
                      {activeProvider.models.length}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {activeProvider.models.map((model) => {
                      const isActive = model.id === selectedModelId;
                      return (
                        <button
                          type="button"
                          key={model.id}
                          onClick={() => setSelectedModelId(model.id)}
                          className={`w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-all border-none ${
                            isActive
                              ? "ring-1 ring-[var(--color-brand-primary)]/50 bg-[var(--color-brand-subtle)]"
                              : "bg-surface-2 hover:bg-surface-3"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-6 h-6 rounded-md flex items-center justify-center shrink-0">
                              <ProviderLogo provider={activeProvider.id} size={16} />
                            </span>
                            <div className="min-w-0">
                              <div
                                className={`text-[13px] truncate ${isActive ? "font-semibold text-text-primary" : "font-medium text-text-secondary"}`}
                              >
                                {model.name}
                              </div>
                              <div className="text-[10px] text-text-tertiary">
                                {activeProvider.name}
                              </div>
                            </div>
                          </div>
                          {isActive && (
                            <Check
                              size={14}
                              className="text-[var(--color-brand-primary)] shrink-0"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Workspace Shell                                               */
/* ------------------------------------------------------------------ */
type View =
  | { type: "home" }
  | { type: "conversations"; channelId?: string }
  | { type: "deployments" }
  | { type: "skills" }
  | { type: "settings"; tab?: SettingsTab; providerId?: ModelProvider };

function getInitialWorkspaceView(search: string): View {
  const params = new URLSearchParams(search);
  if (params.get("view") === "settings") {
    const tab = params.get("tab");
    const provider = params.get("provider");
    return {
      type: "settings",
      tab: isSettingsTab(tab) ? tab : "general",
      providerId: isModelProvider(provider) ? provider : "anthropic",
    };
  }

  return { type: "home" };
}

const NAV_ITEMS: { id: View["type"]; labelKey: string; icon: typeof Home }[] = [
  { id: "home", labelKey: "ws.nav.home", icon: Home },
  { id: "skills", labelKey: "ws.nav.skills", icon: Sparkles },
  { id: "settings", labelKey: "ws.nav.settings", icon: Settings },
];

export default function OpenClawWorkspace() {
  usePageTitle("Workspace");
  const navigate = useNavigate();
  const location = useLocation();
  const { stars } = useGitHubStars();
  const { locale, setLocale, t } = useLocale();
  const isWindowsDesktop =
    typeof window !== "undefined" && /windows/i.test(window.navigator.userAgent);
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("nexu_sidebar_collapsed");
    return saved !== null ? saved === "true" : true;
  });
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
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
  const langRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(() => getInitialWorkspaceView(location.search));
  const [showTyping, setShowTyping] = useState(shouldShowTypingEffect);
  const [showSeedanceModal, setShowSeedanceModal] = useState(false);
  const [usagePlan, setUsagePlan] = useState<BillingPlanId>("plus");
  const [usageQuotaState, setUsageQuotaState] = useState<UsageQuotaState>("warning");

  const setWorkspaceRoute = useCallback(
    (nextView: View) => {
      setView(nextView);

      if (nextView.type !== "settings") {
        navigate("/openclaw/workspace");
        return;
      }

      const params = new URLSearchParams();
      params.set("view", "settings");
      params.set("tab", nextView.tab ?? "general");
      if (nextView.providerId) {
        params.set("provider", nextView.providerId);
      }

      navigate(`/openclaw/workspace?${params.toString()}`);
    },
    [navigate],
  );

  const SIDEBAR_MIN = 160;
  const SIDEBAR_MAX = 320;
  const SIDEBAR_DEFAULT = 192;
  const MAIN_MIN = 480;
  const sidebarTopClearanceClass = isWindowsDesktop ? "h-10" : "h-14";
  const mainTopPaddingClass = isWindowsDesktop ? "pt-3" : "pt-8";
  const sidebarToggleTop = isWindowsDesktop ? 10 : 8;
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem("nexu_sidebar_width");
    return saved ? Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, Number(saved))) : SIDEBAR_DEFAULT;
  });
  const isResizing = useRef(false);

  const openChangelog = useCallback(() => {
    void openExternal("https://github.com/nexu-io/nexu/releases");
  }, []);

  const handleCheckForUpdates = useCallback(() => {
    setCheckingUpdate(true);
    setShowUpToDate(false);
    setTimeout(() => {
      setCheckingUpdate(false);
      if (hasUpdate && !updateDismissed) {
        return;
      }
      setShowUpToDate(true);
    }, 1500);
  }, [hasUpdate, updateDismissed]);

  const settingsUpdateStatus: "idle" | "checking" | "available" | "ready" | "error" = checkingUpdate
    ? "checking"
    : updateReady
      ? "ready"
      : updateError
        ? "error"
        : hasUpdate && !updateDismissed
          ? "available"
          : "idle";

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

  useEffect(() => {
    setView(getInitialWorkspaceView(location.search));
  }, [location.search]);

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
    if (!showLangMenu) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showLangMenu]);

  useEffect(() => {
    return () => {
      if (downloadTimer.current) clearInterval(downloadTimer.current);
    };
  }, []);

  const allSkillsCount = SKILL_CATEGORIES.flatMap((c) => c.skills).length;

  return (
    <SplitView className="relative h-full">
      {/* Sidebar toggle — fixed position, same spot for expand/collapse */}
      <button
        type="button"
        onClick={() => {
          const next = !collapsed;
          setCollapsed(next);
          localStorage.setItem("nexu_sidebar_collapsed", String(next));
        }}
        className="absolute z-50 inline-flex items-center justify-center rounded-full border border-border/70 bg-surface-0/90 p-1.5 text-text-tertiary shadow-sm backdrop-blur-sm transition-[left,top,transform,color,background-color] duration-200 hover:bg-surface-0 hover:text-text-primary"
        style={
          {
            top: sidebarToggleTop,
            left: collapsed ? 12 : sidebarWidth,
            transform: collapsed ? "none" : "translateX(-50%)",
            WebkitAppRegion: "no-drag",
          } as React.CSSProperties
        }
        title={collapsed ? t("ws.sidebar.expand") : t("ws.sidebar.collapse")}
      >
        {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      {/* Sidebar — frosted glass + fully hidden when collapsed */}
      <ResizablePanel
        size={collapsed ? 0 : sidebarWidth}
        collapsed={collapsed}
        className="overflow-hidden"
      >
        <Sidebar
          className="h-full border-r border-border/60 bg-surface-0/90 backdrop-blur-sm"
          style={
            {
              transition: isResizing.current ? "none" : "width 200ms",
              WebkitAppRegion: "drag",
            } as React.CSSProperties
          }
        >
          {/* Traffic light clearance */}
          <SidebarHeader className={`${sidebarTopClearanceClass} shrink-0`} />

          {/* Brand */}
          <SidebarHeader
            className="px-3 pb-2 flex items-center justify-between"
            style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          >
            <img src="/brand/logo-black-1.svg" alt="nexu" className="h-6 object-contain" />
            {hasUpdate && updateDismissed && (
              <button
                type="button"
                onClick={() => setUpdateDismissed(false)}
                className="rounded-full px-2 py-1 text-[10px] leading-none font-semibold bg-[var(--color-brand-primary)] text-white hover:opacity-85 transition-opacity"
              >
                {t("ws.sidebar.update")}
              </button>
            )}
          </SidebarHeader>

          {/* Nav items */}
          <SidebarContent
            className="flex-1 overflow-y-auto"
            style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          >
            <div className="px-2 pt-3 space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const active = view.type === item.id;
                return (
                  <NavItem
                    key={item.id}
                    onClick={() => setWorkspaceRoute({ type: item.id } as View)}
                    selected={active}
                  >
                    <item.icon size={16} />
                    {t(item.labelKey)}
                    {item.id === "skills" && (
                      <span className="ml-auto text-[10px] text-text-tertiary font-normal">
                        {allSkillsCount}
                      </span>
                    )}
                  </NavItem>
                );
              })}
            </div>

            {/* Conversations section */}
            <div className="px-2 pt-6">
              <div className="sidebar-section-label">{t("ws.nav.conversations")}</div>
              <div className="space-y-0.5">
                {MOCK_CHANNELS.map((ch) => {
                  const active =
                    view.type === "conversations" &&
                    (view as { type: "conversations"; channelId?: string }).channelId === ch.id;
                  const ChannelIcon =
                    (
                      {
                        slack: SlackIcon,
                        feishu: FeishuIcon,
                        discord: DiscordIcon,
                      } as Record<string, typeof SlackIcon>
                    )[ch.platform] || SlackIcon;
                  return (
                    <NavItem
                      key={ch.id}
                      size="compact"
                      onClick={() => setWorkspaceRoute({ type: "conversations", channelId: ch.id })}
                      selected={active}
                    >
                      <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                        <ChannelIcon size={14} />
                      </span>
                      <span className={`truncate text-[12px] ${active ? "" : "text-text-primary"}`}>
                        {ch.name}
                      </span>
                    </NavItem>
                  );
                })}
              </div>
            </div>
          </SidebarContent>

          {/* Update banner — available / downloading / ready / error */}
          {hasUpdate && !updateDismissed && (
            <SidebarFooter>
              <div
                className="mx-3 mb-2 px-3 py-2.5 rounded-[10px] border border-border bg-surface-0/80 backdrop-blur-sm animate-float shrink-0"
                style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
              >
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
                      type="button"
                      onClick={() => setUpdateDismissed(true)}
                      className="text-text-muted hover:text-text-primary transition-colors -mr-1"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Downloading — progress bar + percent right-aligned below */}
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

                {/* Available — Download + Changelog */}
                {!updating && !updateReady && !updateError && (
                  <div className="flex items-center gap-2 pl-4">
                    <Button
                      type="button"
                      size="inline"
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
                      className="inline-flex items-center justify-center rounded-[6px] h-7 px-2.5 text-[11px] leading-none font-medium bg-[var(--color-accent)] text-white hover:opacity-85 transition-opacity"
                    >
                      {t("ws.update.download")}
                    </Button>
                    <Button
                      type="button"
                      size="inline"
                      variant="ghost"
                      onClick={() => void openExternal("https://github.com/nexu-io/nexu/releases")}
                      className="inline-flex items-center justify-center rounded-[6px] h-7 px-2 text-[11px] leading-none font-medium text-text-muted hover:text-text-primary transition-colors"
                    >
                      {t("ws.update.changelog")}
                    </Button>
                  </div>
                )}

                {/* Ready — Restart + Changelog */}
                {updateReady && (
                  <div className="flex items-center gap-2 pl-4">
                    <Button
                      type="button"
                      size="inline"
                      onClick={() => {
                        setUpdateReady(false);
                        setHasUpdate(false);
                      }}
                      className="inline-flex items-center justify-center rounded-[6px] h-7 px-2.5 text-[11px] leading-none font-medium bg-[var(--color-accent)] text-white hover:opacity-85 transition-opacity"
                    >
                      {t("ws.update.restart")}
                    </Button>
                    <Button
                      type="button"
                      size="inline"
                      variant="ghost"
                      onClick={() => void openExternal("https://github.com/nexu-io/nexu/releases")}
                      className="inline-flex items-center justify-center rounded-[6px] h-7 px-2 text-[11px] leading-none font-medium text-text-muted hover:text-text-primary transition-colors"
                    >
                      {t("ws.update.changelog")}
                    </Button>
                  </div>
                )}

                {/* Error — Retry + Changelog */}
                {updateError && (
                  <div className="flex items-center gap-2 pl-4">
                    <Button
                      type="button"
                      size="inline"
                      onClick={() => {
                        setUpdateError(false);
                        setHasUpdate(true);
                      }}
                      className="inline-flex items-center justify-center rounded-[6px] h-7 px-2.5 text-[11px] leading-none font-medium bg-[var(--color-accent)] text-white hover:opacity-85 transition-opacity"
                    >
                      {t("ws.update.retry")}
                    </Button>
                    <Button
                      type="button"
                      size="inline"
                      variant="ghost"
                      onClick={() => void openExternal("https://github.com/nexu-io/nexu/releases")}
                      className="inline-flex items-center justify-center rounded-[6px] h-7 px-2 text-[11px] leading-none font-medium text-text-muted hover:text-text-primary transition-colors"
                    >
                      {t("ws.update.changelog")}
                    </Button>
                  </div>
                )}
              </div>
            </SidebarFooter>
          )}

          {/* Icon row — above account bar */}
          <SidebarFooter
            className="px-3 pb-1.5 flex items-center gap-1"
            style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          >
            <div className="relative" ref={helpRef}>
              {showHelpMenu && (
                <div className="absolute z-20 bottom-full left-0 mb-2 w-44">
                  <div className="rounded-xl border bg-surface-1 border-border shadow-xl shadow-black/10 overflow-hidden">
                    <div className="p-1.5">
                      <a
                        href="https://docs.nexu.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-black/5 transition-all"
                      >
                        <BookOpen size={14} />
                        {t("ws.help.documentation")}
                      </a>
                      <a
                        href="mailto:hi@nexu.ai"
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-black/5 transition-all"
                      >
                        <Mail size={14} />
                        {t("ws.help.contactUs")}
                      </a>
                    </div>
                    <div className="border-t border-border p-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setShowHelpMenu(false);
                          handleCheckForUpdates();
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-black/5 transition-all"
                      >
                        <Loader2 size={14} />
                        Check for Updates…
                      </button>
                      <a
                        href="https://nexu.ai/changelog"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-black/5 transition-all"
                      >
                        <ScrollText size={14} />
                        {t("ws.help.changelog")}
                      </a>
                    </div>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowHelpMenu(!showHelpMenu)}
                className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors cursor-pointer ${showHelpMenu ? "text-text-primary bg-black/5" : "text-text-secondary hover:text-text-primary hover:bg-black/5"}`}
                title={t("ws.help.title")}
              >
                <CircleHelp size={16} />
              </button>
            </div>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-black/5 transition-colors"
              title={t("ws.help.github")}
              aria-label={t("ws.help.github")}
            >
              <span className="sr-only">{t("ws.help.github")}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            {stars && stars > 0 && (
              <span className="text-[10px] tabular-nums text-text-tertiary ml-0.5">
                {stars.toLocaleString()}
              </span>
            )}
            <div className="relative ml-auto" ref={langRef}>
              {showLangMenu && (
                <div className="absolute z-20 bottom-full right-0 mb-2 w-36">
                  <div className="rounded-xl border bg-surface-1 border-border shadow-xl shadow-black/10 overflow-hidden p-1.5">
                    {[
                      { value: "en" as const, label: "English" },
                      { value: "zh" as const, label: "简体中文" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setLocale(opt.value);
                          setShowLangMenu(false);
                        }}
                        className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${
                          locale === opt.value
                            ? "text-text-primary bg-black/5"
                            : "text-text-secondary hover:text-text-primary hover:bg-black/5"
                        }`}
                      >
                        {opt.label}
                        {locale === opt.value && <Check size={12} className="ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`h-7 flex items-center gap-1.5 px-1.5 rounded-md transition-colors cursor-pointer ${showLangMenu ? "text-text-primary bg-black/5" : "text-text-secondary hover:text-text-primary hover:bg-black/5"}`}
                title={t("ws.help.language")}
              >
                <Globe size={14} />
                <span className="text-[11px] font-medium leading-none">
                  {locale === "en" ? "EN" : "中文"}
                </span>
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>
      </ResizablePanel>

      {/* Mobile header — hidden in desktop client */}
      <div className="hidden">
        <button
          type="button"
          onClick={() => navigate("/openclaw")}
          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex justify-center items-center w-6 h-6 rounded-md bg-accent shrink-0">
            <span className="text-[9px] font-bold text-accent-fg">N</span>
          </div>
          <span className="text-sm font-semibold text-text-primary truncate">nexu</span>
        </div>
        <LanguageSwitcher variant="muted" />
        <button
          type="button"
          onClick={() => setWorkspaceRoute({ type: "settings" })}
          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Resize handle */}
      {!collapsed && (
        <ResizableHandle
          onMouseDown={handleResizeStart}
          className="group relative z-20 -ml-px w-2 cursor-col-resize"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <div className="absolute inset-y-0 left-0 w-px bg-border/50 transition-colors group-hover:bg-text-tertiary/40" />
        </ResizableHandle>
      )}

      {/* Main content */}
      <main
        className={`-ml-px flex-1 overflow-hidden min-h-0 rounded-l-[14px] border-l border-white/70 bg-surface-1 shadow-[-12px_0_28px_-20px_rgba(15,23,42,0.4)] ${mainTopPaddingClass}`}
      >
        {view.type === "home" && (
          <HomeDashboard
            onNavigate={setWorkspaceRoute}
            onRequestSeedanceModal={() => setShowSeedanceModal(true)}
            plan={usagePlan}
            quotaState={usageQuotaState}
            onOpenPricing={(target) =>
              navigate(
                target === "credit-packs"
                  ? "/openclaw/pricing?tab=plans#credit-packs"
                  : "/openclaw/pricing?tab=plans",
              )
            }
            showTyping={showTyping}
            onTypingComplete={handleTypingComplete}
            stars={stars}
          />
        )}
        {view.type === "conversations" && <ConversationsView initialChannelId={view.channelId} />}
        {view.type === "deployments" && <DeploymentsView />}
        {view.type === "skills" && <SkillsPanel />}
        {view.type === "settings" && (
          <SettingsView
            initialTab={view.tab}
            initialProviderId={view.providerId}
            appVersion={MOCK_VERSION}
            updateStatus={settingsUpdateStatus}
            onCheckForUpdates={handleCheckForUpdates}
            onOpenChangelog={openChangelog}
            onOpenPricing={() => navigate("/openclaw/pricing")}
            usagePlan={usagePlan}
            onUsagePlanChange={setUsagePlan}
            usageQuotaState={usageQuotaState}
            onUsageQuotaStateChange={setUsageQuotaState}
          />
        )}
      </main>

      {showSeedanceModal && <SeedancePromoModal onClose={() => setShowSeedanceModal(false)} />}

      {/* Update check dialog — checking / up-to-date */}
      {(checkingUpdate || showUpToDate) && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: "transparent",
            animation: "fadeIn 150ms ease-out",
          }}
        >
          {showUpToDate && (
            <button
              type="button"
              className="absolute inset-0"
              onClick={() => setShowUpToDate(false)}
              aria-label="Dismiss update dialog"
            />
          )}
          <dialog
            className="flex flex-col items-center w-[260px] px-6 py-6 rounded-[14px] bg-white text-center"
            style={{
              boxShadow: "0 24px 48px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
              animation: "scaleIn 200ms cubic-bezier(0.16,1,0.3,1)",
            }}
            aria-modal="true"
            open
          >
            <div className="flex items-center justify-center w-11 h-11 mb-3.5 rounded-[10px] bg-[#f5f5f5]">
              <img
                src="/brand/logo-black-1.svg"
                alt="nexu"
                className="w-[26px] h-[26px] object-contain"
              />
            </div>

            <h2 className="text-[14px] font-semibold text-[#1c1f23] mb-1">
              {checkingUpdate ? t("ws.update.checking") : t("ws.update.upToDate")}
            </h2>

            {showUpToDate && (
              <p className="text-[12px] text-[#6b7280] leading-[1.4] mb-4">
                {t("ws.update.upToDateSub").replace("{{version}}", MOCK_VERSION)}
              </p>
            )}

            {checkingUpdate && (
              <div className="w-full mt-1 mb-2">
                <div className="h-1 w-full rounded-full bg-[rgba(0,0,0,0.06)] overflow-hidden">
                  <div
                    className="h-full w-[35%] rounded-full"
                    style={{
                      background: "#1c1f23",
                      animation: "indeterminateSlide 1.4s ease-in-out infinite",
                    }}
                  />
                </div>
              </div>
            )}

            {showUpToDate && (
              <Button
                size="inline"
                onClick={() => setShowUpToDate(false)}
                className="w-full py-[7px] rounded-lg bg-[#3478f6] text-white text-[13px] font-medium hover:bg-[#2563eb] transition-colors border-none cursor-pointer mt-1"
                type="button"
              >
                OK
              </Button>
            )}
          </dialog>
        </div>
      )}
    </SplitView>
  );
}
