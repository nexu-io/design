import {
  Alert,
  AlertDescription,
  Badge,
  BrandLogo,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EntityCardMedia,
  GitHubIcon,
  Input,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  PageHeader,
  PlatformLogo,
  ScrollArea,
  SectionHeader,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  Switch,
  TextLink,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from "@nexu-design/ui-web";
import * as SelectPrimitive from "@radix-ui/react-select";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Cable,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock,
  Cpu,
  Download,
  Eye,
  EyeOff,
  FileText,
  Gift,
  Globe,
  Home,
  Info,
  Loader2,
  LoaderCircle,
  LogOut,
  Mail,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  ScrollText,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  User,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import {
  REWARD_CHANNELS,
  type RewardChannel,
  type RewardGroup,
  useBudget,
} from "../../hooks/useBudget";
import { useGitHubStars } from "../../hooks/useGitHubStars";
import { type Locale, useLocale } from "../../hooks/useLocale";
import { usePageTitle } from "../../hooks/usePageTitle";
import { openExternal } from "../../utils/open-external";
import ChannelDetailPage from "./ChannelDetailPage";
import { MOCK_CHANNELS, MOCK_DEPLOYMENTS, type ModelProvider, getProviderDetails } from "./data";
import { SchedulePanel } from "./SchedulePanel";
import { SKILL_CATEGORIES } from "./skillData";
import { SkillsPanel } from "./SkillsPanel";
import {
  CHANNELS_CONNECTED_KEY,
  CHANNEL_ACTIVE_KEY,
  CHANNEL_CONFIG_FIELDS,
  DingTalkIconSetup,
  DiscordIconSetup,
  FeishuIconSetup,
  ONBOARDING_CHANNELS,
  QQBotIconSetup,
  SlackIconSetup,
  SEEDANCE_BANNER_DISMISSED_KEY,
  TelegramIconSetup,
  WeChatIconSetup,
  WeComIconSetup,
  WhatsAppIconSetup,
} from "./channelSetup";
import { ChannelIcon, CreditIcon, ProviderLogo, getModelIconProvider } from "./iconHelpers";

const GITHUB_URL = "https://github.com/nexu-io/nexu";

/** Reward share modal: selectable stamp previews (paths under `public/share-material/`). */
const SHARE_MATERIAL_STAMP_OPTIONS = [
  "/share-material/stamp-1.png",
  "/share-material/stamp-2.png",
  "/share-material/stamp-3.png",
  "/share-material/stamp-4.png",
  "/share-material/stamp-6.png",
] as const;

function downloadShareCard() {
  const W = 1080;
  const H = 1080;
  const PAD = 80;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#f8fafc");
  grad.addColorStop(1, "#e2e8f0");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 64px system-ui, -apple-system, sans-serif";
  ctx.fillText("nexu", PAD, 160);

  ctx.fillStyle = "#475569";
  ctx.font = "32px system-ui, -apple-system, sans-serif";
  const tagline = "The simplest open-source openclaw desktop app";
  ctx.fillText(tagline, PAD, 220);

  ctx.fillStyle = "#64748b";
  ctx.font = "28px system-ui, -apple-system, sans-serif";
  const lines = [
    "Bridge your Agent to WeChat, Feishu,",
    "Slack & Discord in one click.",
    "",
    "Works with Claude Code, Codex & any LLM.",
    "BYOK, OAuth, local-first.",
  ];
  let y = 320;
  for (const line of lines) {
    if (line) ctx.fillText(line, PAD, y);
    y += 42;
  }

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
  ctx.fillText("github.com/refly-ai/nexu", PAD, H - 120);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "24px system-ui, -apple-system, sans-serif";
  ctx.fillText("Star ⭐ & try it free", PAD, H - 76);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexu-share.png";
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

function getRewardMaterialLaunchUrl(channelId: string): string | null {
  switch (channelId) {
    case "xiaohongshu":
      return "https://www.xiaohongshu.com/explore";
    case "jike":
      return "https://web.okjike.com";
    case "feishu":
      return "https://www.feishu.cn";
    case "wechat":
      return null;
    default:
      return null;
  }
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

type RewardType = string | null;

const REWARD_GROUPS: { key: RewardGroup; labelKey: string }[] = [
  { key: "daily", labelKey: "rewards.group.daily" },
  { key: "opensource", labelKey: "rewards.group.opensource" },
  { key: "social", labelKey: "rewards.group.social" },
];

function formatRewardAmount(n: number): string {
  return String(Math.round(n));
}

function formatCreditsPlain(n: number): string {
  return formatRewardAmount(n);
}

function rewardsCreditsPlusLabel(n: number, t: (key: string) => string): string {
  return n === 1
    ? t("rewards.creditsPlusOne")
    : t("rewards.creditsPlusMany").replace("{n}", formatCreditsPlain(n));
}

function rewardsCreditsValueLabel(n: number, t: (key: string) => string): string {
  return n === 1
    ? t("rewards.creditsValueOne")
    : t("rewards.creditsValueMany").replace("{n}", formatCreditsPlain(n));
}

function formatCountdownToLocalMidnight(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  const ms = next.getTime() - now.getTime();
  if (ms <= 0) return "00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function useNextLocalMidnightCountdown(): string {
  const [label, setLabel] = useState(() => formatCountdownToLocalMidnight());
  useEffect(() => {
    const id = window.setInterval(() => setLabel(formatCountdownToLocalMidnight()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return label;
}

function sortChannelsForRewards(
  channels: RewardChannel[],
  budget: ReturnType<typeof useBudget>,
): RewardChannel[] {
  const isDone = (ch: RewardChannel) =>
    ch.repeatable === "daily" ? budget.dailyCheckedInToday : budget.claimedChannels.has(ch.id);
  const rank = (ch: RewardChannel): number => {
    if (!isDone(ch)) return 0;
    if (ch.repeatable === "daily") return 0;
    if (ch.repeatable === "weekly") return 1;
    return 2;
  };
  return channels
    .map((ch, order) => ({ ch, order }))
    .sort((a, b) => {
      const ra = rank(a.ch);
      const rb = rank(b.ch);
      if (ra !== rb) return ra - rb;
      return a.order - b.order;
    })
    .map(({ ch }) => ch);
}

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
    remainingMs,
    days,
    hours,
    minutes,
    seconds,
    compactLabel: `${String(days).padStart(2, "0")}天 ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
  };
}

function SeedanceCountdownBlocks({ now, compact = false }: { now: number; compact?: boolean }) {
  const countdown = getSeedanceCountdown(now);

  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold leading-none shadow-sm tabular-nums"
        style={{
          color: "white",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--color-warning) 82%, white), color-mix(in srgb, var(--color-danger) 78%, var(--color-warning) 22%))",
          borderColor:
            "color-mix(in srgb, var(--color-danger) 56%, var(--color-warning) 32%, white)",
          boxShadow: "var(--shadow-focus)",
        }}
      >
        <Clock size={10} className="shrink-0" />
        <span>{countdown.compactLabel}</span>
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

/* ── GitHub Star Onboarding Modal ── */
function StarModal({
  step,
  onStar,
  onConfirm,
  onSkip,
}: {
  step: "prompt" | "confirm";
  onStar: () => void;
  onConfirm: () => void;
  onSkip: () => void;
}) {
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<"idle" | "success" | "fail">("idle");

  const handleVerify = () => {
    setVerifying(true);
    setVerifyResult("idle");
    // Simulate API verification (prototype: random 70% success)
    setTimeout(() => {
      const passed = Math.random() < 0.7;
      setVerifying(false);
      if (passed) {
        setVerifyResult("success");
        onConfirm();
      } else {
        setVerifyResult("fail");
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"
        onClick={verifying ? undefined : onSkip}
      />
      <div
        className="relative w-full max-w-[360px] mx-4 rounded-2xl border border-border bg-surface-1 shadow-[0_24px_64px_rgba(0,0,0,0.22),0_0_0_1px_rgba(0,0,0,0.06)] overflow-hidden"
        style={{ animation: "scaleIn 220ms cubic-bezier(0.16,1,0.3,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-5">
          {step === "prompt" ? (
            <>
              <div className="flex items-center justify-center w-12 h-12 rounded-[14px] bg-amber-50 border border-amber-200/60 mb-4 mx-auto">
                <Star size={24} className="text-amber-500 fill-amber-400" />
              </div>
              <h2 className="text-[15px] font-bold text-text-primary text-center mb-1.5">
                🎉 Channel 连接成功！
              </h2>
              <p className="text-[13px] text-text-secondary text-center leading-relaxed mb-1">
                如果 nexu 对你有帮助，给我们一个 GitHub Star 吧
              </p>
              <p className="text-[12px] text-text-muted text-center leading-relaxed mb-4">
                Star 后可领取 <span className="font-semibold text-amber-500">+300 积分</span>
                奖励，用于调用 AI 模型
              </p>
              <div className="flex items-center justify-center gap-1.5 mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/60">
                  <Star size={12} className="text-amber-500 fill-amber-400" />
                  <span className="text-[12px] font-semibold text-amber-600 tabular-nums leading-none">
                    +300 积分
                  </span>
                </div>
              </div>
              <button
                onClick={onStar}
                className="w-full h-[40px] rounded-[10px] bg-[#24292f] hover:bg-[#1c2026] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors mb-2.5"
              >
                <Star size={14} className="fill-amber-400 text-amber-400" />去 GitHub Star
              </button>
              <button
                onClick={onSkip}
                className="w-full h-[36px] rounded-[10px] text-[12px] text-text-muted hover:text-text-secondary hover:bg-surface-2 transition-colors"
              >
                稍后再说
              </button>
            </>
          ) : (
            <>
              {/* Confirm step — with verification */}
              {verifying ? (
                <>
                  <div className="flex items-center justify-center w-12 h-12 rounded-[14px] bg-surface-2 mb-4 mx-auto">
                    <Loader2 size={22} className="text-text-muted animate-spin" />
                  </div>
                  <h2 className="text-[15px] font-bold text-text-primary text-center mb-1.5">
                    正在验证…
                  </h2>
                  <p className="text-[12px] text-text-muted text-center leading-relaxed mb-2">
                    正在检查你的 GitHub Star 状态，请稍候
                  </p>
                </>
              ) : verifyResult === "fail" ? (
                <>
                  <div className="flex items-center justify-center w-12 h-12 rounded-[14px] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 mb-4 mx-auto">
                    <AlertCircle size={24} className="text-[var(--color-danger)]" />
                  </div>
                  <h2 className="text-[15px] font-bold text-text-primary text-center mb-1.5">
                    未检测到 Star
                  </h2>
                  <p className="text-[12px] text-text-secondary text-center leading-relaxed mb-1">
                    抱歉，暂未检测到你对该仓库的 Star 操作，无法发放奖励。
                  </p>
                  <p className="text-[12px] text-text-muted text-center leading-relaxed mb-4">
                    你也可以通过左下角「奖励」入口，在社交平台分享领取更多积分。
                  </p>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={onSkip}
                      className="flex-1 h-[38px] rounded-[10px] border border-border text-[12px] font-medium text-text-secondary hover:bg-surface-2 transition-colors"
                    >
                      关闭
                    </button>
                    <button
                      onClick={handleVerify}
                      className="flex-1 h-[38px] rounded-[10px] bg-[#24292f] hover:bg-[#1c2026] text-white text-[12px] font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw size={12} />
                      重新检测
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center w-12 h-12 rounded-[14px] bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 mb-4 mx-auto">
                    <Check size={24} className="text-[var(--color-success)]" />
                  </div>
                  <h2 className="text-[15px] font-bold text-text-primary text-center mb-1.5">
                    已经 Star 了吗？
                  </h2>
                  <p className="text-[12px] text-text-secondary text-center leading-relaxed mb-4">
                    确认后我们将为你发放{" "}
                    <span className="font-semibold text-[var(--color-success)]">+300 积分</span>
                  </p>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={onSkip}
                      className="flex-1 h-[38px] rounded-[10px] border border-border text-[12px] font-medium text-text-secondary hover:bg-surface-2 transition-colors"
                    >
                      还没有
                    </button>
                    <button
                      onClick={handleVerify}
                      className="flex-1 h-[38px] rounded-[10px] bg-[var(--color-success)] hover:opacity-90 text-white text-[12px] font-semibold transition-opacity"
                    >
                      已完成，领取积分
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Seedance 2.0 Promo Modal ── */
type SeedanceStep = "star" | "feishu";

const FEISHU_GROUP_URL =
  "https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=98drf9e0-928f-4706-b0af-e515abfb12c0";
const SEEDANCE_TUTORIAL_URL = "https://powerformer.feishu.cn/wiki/OFxFw2MpyiFWKpk9n2Dc7joEngc";

function SeedancePromoModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<SeedanceStep>("star");
  const [starred, setStarred] = useState(false);
  const [countdownNow, setCountdownNow] = useState(Date.now());

  const handleStar = () => {
    openExternal("https://github.com/refly-ai/nexu");
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" onClick={onClose} />
      <div
        className="relative w-full max-w-[348px] mx-4 rounded-2xl border border-border bg-surface-1 shadow-[0_24px_64px_rgba(0,0,0,0.24),0_0_0_1px_rgba(0,0,0,0.06)] overflow-hidden"
        style={{ animation: "scaleIn 220ms cubic-bezier(0.16,1,0.3,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
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
                onClick={() => openExternal(SEEDANCE_TUTORIAL_URL)}
                className="w-full mb-3 inline-flex items-center justify-center gap-1.5 text-[12px] font-medium text-[var(--color-brand-primary)] hover:underline"
              >
                <ArrowUpRight size={12} />
                查看教程：如何在 nexu Bot 中体验 Seedance 2.0
              </button>

              <button
                onClick={() => openExternal(FEISHU_GROUP_URL)}
                className="w-full h-[40px] rounded-[10px] bg-[var(--color-brand-primary)] hover:opacity-90 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-opacity mb-2.5"
              >
                <ArrowUpRight size={14} className="shrink-0" />
                点击链接加入飞书群
              </button>
              <button
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

/** Reward confirm: `EntityCardMedia` + library `PlatformLogo` / `BrandLogo` (official colors). */
function RewardConfirmLead({ channel }: { channel: RewardChannel }) {
  const isDaily = channel.repeatable === "daily";
  const logoSize = 22;
  /* No `title` on logos: tile is decorative (`aria-hidden`); dialog title already names the channel. */

  const inner =
    channel.icon === "github" ? (
      <BrandLogo brand="github" size={logoSize} className="text-text-primary" />
    ) : channel.icon === "wechat" ? (
      <PlatformLogo platform="wechat" size={logoSize} />
    ) : channel.icon === "whatsapp" ? (
      <PlatformLogo platform="whatsapp" size={logoSize} />
    ) : channel.icon === "feishu" ? (
      <PlatformLogo platform="feishu" size={logoSize} />
    ) : (
      <ChannelIcon icon={channel.icon} size={logoSize} accent={isDaily ? "brand" : "default"} />
    );

  return (
    <EntityCardMedia
      className={cn(
        "mb-4",
        isDaily &&
          "border-[var(--color-brand-primary)]/28 bg-[var(--color-brand-subtle)] ring-1 ring-inset ring-[var(--color-brand-primary)]/12",
      )}
      aria-hidden
    >
      {inner}
    </EntityCardMedia>
  );
}

function RewardConfirmModal({
  channel,
  onConfirm,
  onCancel,
  t,
}: {
  channel: RewardChannel;
  onConfirm: () => void;
  onCancel: () => void;
  t: (key: string) => string;
}) {
  const isDaily = channel.repeatable === "daily";
  const isImage = channel.shareMode === "image";
  const isSocialShare = !isDaily && !isImage && channel.id !== "github_star";
  const [imageDownloaded, setImageDownloaded] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [linkStatus, setLinkStatus] = useState<"idle" | "verifying" | "valid" | "invalid">("idle");

  const descKey = isDaily
    ? "budget.confirm.checkinDesc"
    : isImage
      ? "budget.confirm.imageDesc"
      : channel.requiresScreenshot
        ? "budget.confirm.screenshotDesc"
        : "budget.confirm.desc";
  const amt = formatRewardAmount(channel.reward);
  const creditsBadge =
    channel.reward === 1
      ? t("rewards.creditsPlusOne")
      : t("rewards.creditsPlusMany").replace("{n}", amt);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent
        size="sm"
        className={cn(
          "max-w-[min(100vw-2rem,380px)] gap-0 border-border-subtle bg-surface-0 p-6 shadow-[var(--shadow-dropdown)] sm:p-8",
          "[&>button.absolute]:hidden",
        )}
      >
        <div className="flex flex-col items-center text-center">
          <DialogHeader className="w-full items-center gap-0 space-y-0 text-center">
            <RewardConfirmLead channel={channel} />
            <DialogTitle className="text-base font-semibold leading-tight text-text-primary">
              {t("budget.confirm.title").replace("{channel}", t(`reward.${channel.id}.name`))}
            </DialogTitle>
            <DialogDescription className="pt-1.5 text-sm leading-relaxed text-text-secondary">
              {t(descKey).replaceAll("{n}", amt)}
            </DialogDescription>
          </DialogHeader>

          <Badge
            variant="outline"
            size="default"
            radius="full"
            className="mb-5 mt-4 border-[var(--color-brand-primary)]/25 bg-[var(--color-brand-subtle)] tabular-nums text-sm font-semibold text-[var(--color-brand-primary)]"
          >
            {creditsBadge}
          </Badge>

          {isImage && !imageDownloaded ? (
            <Button
              type="button"
              variant="brand"
              size="sm"
              className="mb-4 w-full"
              onClick={() => {
                downloadShareCard();
                setImageDownloaded(true);
              }}
            >
              <Download size={14} className="shrink-0" aria-hidden />
              {t("budget.confirm.downloadImage")}
            </Button>
          ) : null}
          {isImage && imageDownloaded ? (
            <div className="mb-4 flex w-full items-center justify-center gap-1.5 text-sm font-medium text-[var(--color-brand-primary)]">
              <Check size={14} className="shrink-0" aria-hidden />
              {t("budget.confirm.downloadImage")} ✓
            </div>
          ) : null}

          {isSocialShare && (
            <div className="mb-4 w-full">
              <label className="block text-[12px] font-medium text-text-secondary mb-1.5 text-left">
                Paste your share link to verify
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={shareLink}
                  onChange={(e) => {
                    setShareLink(e.target.value);
                    setLinkStatus("idle");
                  }}
                  placeholder="https://..."
                  className={cn(
                    "w-full rounded-lg border bg-surface-0 px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 transition-colors",
                    linkStatus === "invalid"
                      ? "border-destructive focus:ring-destructive/20 focus:border-destructive/30"
                      : linkStatus === "valid"
                        ? "border-[var(--color-success)] focus:ring-[var(--color-success)]/20"
                        : "border-border focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)]/30",
                  )}
                />
                {linkStatus === "verifying" && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <LoaderCircle size={14} className="animate-spin text-text-muted" />
                  </div>
                )}
                {linkStatus === "valid" && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <Check size={14} className="text-[var(--color-success)]" />
                  </div>
                )}
              </div>
              {linkStatus === "invalid" && (
                <p className="mt-1 text-[12px] text-destructive text-left">
                  Invalid link. Please paste the URL of your shared post.
                </p>
              )}
              {linkStatus === "valid" && (
                <p className="mt-1 text-[12px] text-[var(--color-success)] text-left">
                  Link verified successfully!
                </p>
              )}
            </div>
          )}

          <DialogFooter className="mt-1 w-full flex-row gap-2 p-0 sm:flex-row sm:justify-stretch [&>button]:min-h-9 [&>button]:flex-1">
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              {t("budget.confirm.cancel")}
            </Button>
            {isSocialShare ? (
              linkStatus === "valid" ? (
                <Button
                  type="button"
                  variant="brand"
                  size="sm"
                  className="bg-[var(--color-text-heading)] text-white hover:bg-[var(--color-text-heading)]/90"
                  onClick={onConfirm}
                >
                  {t("budget.confirm.done")}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="brand"
                  size="sm"
                  className="bg-[var(--color-text-heading)] text-white hover:bg-[var(--color-text-heading)]/90"
                  disabled={!shareLink.trim() || linkStatus === "verifying"}
                  loading={linkStatus === "verifying"}
                  onClick={() => {
                    setLinkStatus("verifying");
                    setTimeout(() => {
                      try {
                        const url = new URL(shareLink.trim());
                        const valid = /^https?:/.test(url.protocol);
                        setLinkStatus(valid ? "valid" : "invalid");
                      } catch {
                        setLinkStatus("invalid");
                      }
                    }, 1200);
                  }}
                >
                  Verify link
                </Button>
              )
            ) : (
              <Button
                type="button"
                variant="brand"
                size="sm"
                className="bg-[var(--color-text-heading)] text-white hover:bg-[var(--color-text-heading)]/90"
                onClick={onConfirm}
              >
                {t("budget.confirm.done")}
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RewardMaterialModal({
  channel,
  onClose,
  onClaim,
  t,
}: {
  channel: RewardChannel;
  onClose: () => void;
  onClaim: () => void;
  t: (key: string) => string;
}) {
  const [completed, setCompleted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [stampIndex, setStampIndex] = useState(0);
  const launchUrl = getRewardMaterialLaunchUrl(channel.id);
  const previewSrc = SHARE_MATERIAL_STAMP_OPTIONS[stampIndex] ?? SHARE_MATERIAL_STAMP_OPTIONS[0];

  const handleSaveCopyAll = async () => {
    if (busy || completed) return;
    setBusy(true);
    setActionError(null);
    try {
      downloadShareCard();
      await navigator.clipboard.writeText(t("rewards.shareBioClip"));
      onClaim();
      const place = t(`reward.${channel.id}.toastPlace`);
      toast.success(t("rewards.material.toastPublish").replace("{place}", place));
      setCompleted(true);
      if (launchUrl) void openExternal(launchUrl);
    } catch {
      setActionError(t("rewards.material.actionError"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className="relative w-full max-w-[min(96vw,620px)] rounded-[var(--radius-16)] border border-border bg-surface-1 shadow-[var(--shadow-dropdown)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-6 py-4">
          <h3 className="text-[14px] font-semibold text-text-primary truncate pr-2">
            {t(`reward.${channel.id}.name`)}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="shrink-0 text-text-tertiary"
            aria-label="Close"
          >
            <X size={16} />
          </Button>
        </div>
        <div className="flex flex-col gap-4 px-6 pb-4 pt-4 sm:flex-row sm:items-stretch sm:gap-5">
          <div className="flex min-w-0 flex-col gap-1 sm:w-12 sm:min-w-12 sm:self-stretch">
            <p className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
              {t("rewards.material.styleLabel")}
            </p>
            <ToggleGroup
              type="single"
              value={String(stampIndex)}
              onValueChange={(v) => {
                if (v !== "") setStampIndex(Number(v));
              }}
              className="flex flex-row gap-1.5 overflow-x-auto pb-0.5 !border-0 !bg-transparent !p-0 shadow-none [-webkit-overflow-scrolling:touch] sm:flex-col sm:gap-1.5 sm:overflow-visible sm:pb-0"
              aria-label={t("rewards.material.stylePickerAria")}
            >
              {SHARE_MATERIAL_STAMP_OPTIONS.map((src, i) => (
                <ToggleGroupItem
                  key={src}
                  value={String(i)}
                  aria-label={t("rewards.material.styleOptionAria")
                    .replace("{n}", String(i + 1))
                    .replace("{total}", String(SHARE_MATERIAL_STAMP_OPTIONS.length))}
                  className={cn(
                    "relative size-12 shrink-0 overflow-hidden !rounded-[8px] border-2 border-border !px-0 !py-0 !shadow-none",
                    "bg-white !shadow-[var(--shadow-rest)] hover:!bg-white hover:text-inherit",
                    "data-[state=on]:border-[var(--color-brand-primary)] data-[state=on]:!bg-white data-[state=on]:!shadow-md",
                    "data-[state=on]:ring-2 data-[state=on]:ring-[var(--color-brand-primary)]/25",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "sm:h-auto sm:w-full sm:aspect-square sm:flex-none sm:shrink-0",
                  )}
                >
                  <img
                    src={src}
                    alt=""
                    className="pointer-events-none h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="pointer-events-none absolute left-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded bg-black/45 px-0.5 text-[8px] font-bold tabular-nums leading-none text-white">
                    {i + 1}
                  </span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex min-w-0 flex-1 justify-center sm:justify-start">
            <div className="aspect-[3/4] w-full max-w-[220px] overflow-hidden rounded-[var(--radius-12)] border border-border bg-white shadow-[var(--shadow-rest)]">
              <img
                key={previewSrc}
                src={previewSrc}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col sm:h-[calc(220px*4/3)] sm:min-h-[calc(220px*4/3)]">
            <AnimatePresence mode="wait">
              {completed ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="flex h-full min-h-0 flex-col"
                >
                  <div className="min-h-0 flex-1 overflow-y-auto">
                    <Alert
                      variant="default"
                      className="flex flex-col !items-stretch gap-2 border-[var(--color-brand-primary)]/25 bg-[var(--color-brand-subtle)] text-sm"
                    >
                      <div className="flex w-full min-w-0 items-center justify-start gap-3">
                        <CheckCircle2
                          className="size-6 shrink-0 text-[var(--color-brand-primary)]"
                          strokeWidth={2}
                          aria-hidden
                        />
                        <span className="inline-flex min-w-0 shrink-0 items-baseline gap-1">
                          <span className="text-[18px] font-bold tabular-nums leading-none text-[var(--color-brand-primary)]">
                            {channel.reward === 1 ? "+1" : `+${formatCreditsPlain(channel.reward)}`}
                          </span>
                          <span className="text-sm font-semibold leading-none text-[var(--color-brand-primary)]">
                            {channel.reward === 1
                              ? t("rewards.material.successCreditsWordOne")
                              : t("rewards.material.successCreditsWordMany")}
                          </span>
                        </span>
                      </div>
                      <AlertDescription className="mb-0 text-[13px] leading-relaxed">
                        {t("rewards.material.successPublishHint")}
                      </AlertDescription>
                    </Alert>
                  </div>
                  <div className="mt-auto flex w-full shrink-0 flex-col gap-3 pt-3">
                    {launchUrl ? (
                      <TextLink
                        href={launchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        className="w-fit max-w-full justify-start py-0.5"
                        onClick={(e) => {
                          e.preventDefault();
                          void openExternal(launchUrl);
                        }}
                      >
                        {t("rewards.material.openPlatformAgain")}
                        <ArrowUpRight size={14} className="shrink-0" aria-hidden />
                      </TextLink>
                    ) : null}
                    <Button
                      type="button"
                      variant="default"
                      size="default"
                      className="w-full text-sm font-semibold"
                      onClick={onClose}
                    >
                      {t("rewards.material.gotIt")}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-0 flex-col"
                >
                  <div className="flex min-h-0 flex-1 flex-col gap-3">
                    <SectionHeader
                      title={t("rewards.material.stepsTitle")}
                      className="shrink-0 w-full !gap-0 [&>div]:min-w-0 [&>div]:space-y-0 [&_h2]:mb-0 [&_h2]:text-[13px] [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:tracking-tight"
                    />
                    <ScrollArea className="min-h-0 min-w-0 flex-1">
                      <ol className="m-0 list-none space-y-3 p-0 pb-1">
                        {[
                          t("rewards.material.step1"),
                          t(`reward.${channel.id}.name`),
                          channel.reward === 1
                            ? t("rewards.material.step3One")
                            : t("rewards.material.step3Many").replace(
                                "{n}",
                                formatCreditsPlain(channel.reward),
                              ),
                        ].map((body, idx) => (
                          <li key={idx} className="flex min-w-0 gap-3 items-start">
                            <span
                              className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-[var(--color-brand-primary)]/25 bg-[var(--color-brand-subtle)] text-[10px] font-semibold tabular-nums leading-none text-[var(--color-brand-primary)]"
                              aria-hidden
                            >
                              {idx + 1}
                            </span>
                            <span className="min-w-0 flex-1 text-[14px] text-text-secondary leading-relaxed">
                              {body}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </ScrollArea>
                  </div>
                  <div className="mt-auto flex w-full shrink-0 flex-col gap-2 pt-3">
                    <Button
                      type="button"
                      size="default"
                      className="w-full text-sm font-semibold"
                      loading={busy}
                      leadingIcon={<Download size={16} />}
                      onClick={() => void handleSaveCopyAll()}
                    >
                      {t("rewards.material.downloadAndPost")}
                    </Button>
                    {actionError ? (
                      <Alert variant="destructive" className="px-3 py-2 text-sm">
                        <AlertCircle className="size-4 shrink-0" aria-hidden />
                        <AlertDescription className="text-[12px] text-destructive">
                          {actionError}
                        </AlertDescription>
                      </Alert>
                    ) : null}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeDashboard({
  onNavigate,
  showTyping: _showTyping,
  onTypingComplete: _onTypingComplete,
  stars,
  budgetStatus,
  demoPlan = "pro",
  onRequestStarOnboarding,
  onRequestSeedanceModal,
}: {
  onNavigate: (view: View) => void;
  showTyping?: boolean;
  onTypingComplete?: () => void;
  stars?: number | null;
  budgetStatus?: "healthy" | "warning" | "depleted";
  demoPlan?: "free" | "plus" | "pro";
  onRequestStarOnboarding: () => void;
  onRequestSeedanceModal: () => void;
}) {
  const { t } = useLocale();
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
  const [rewardConfirm, setRewardConfirm] = useState<RewardType>(null);
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
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
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
    setShowSecrets({});
    // Show GitHub Star prompt whenever a channel is connected and star not yet claimed
    if (!budget.starClaimed) {
      onRequestStarOnboarding();
    }
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

  /* ── Scene C: Operational — compact hero, efficiency-first ── */
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ONBOARDING_CHANNELS.filter((ch) => !connectedIds.has(ch.id)).map((ch) => {
                      const Icon = ch.icon;
                      return (
                        <button
                          key={ch.id}
                          onClick={() => handleOpenConfig(ch.id)}
                          className="group flex items-center gap-2.5 rounded-lg border border-dashed border-border bg-surface-0 px-3 py-2 text-left hover:border-solid hover:border-border-hover hover:bg-surface-1 transition-all"
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
                )}
              </div>
            )}
          </div>
        </div>

        {/* ═══ Recent Activity ═══ */}
        <div className="card card-static">
          <div className="px-5 pt-4 pb-3">
            <h2 className="text-[14px] font-semibold text-text-primary">Recent Activity</h2>
          </div>
          <div className="px-5 pb-5 space-y-4">
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
                <div key={ch.id} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-success)] shrink-0 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-medium text-text-primary block truncate">
                      {ch.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      {ch.platform && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-text-secondary">
                          <ChannelIcon size={10} />
                          {ch.platform}
                        </span>
                      )}
                      <span className="text-[11px] text-text-muted">Active {ch.lastMessage}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ Star Nexu on GitHub CTA ═══ */}
        <div className="card card-static">
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
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-github-star group shrink-0"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
              <ArrowUpRight size={11} className="shrink-0 translate-y-px" />
            </a>
          </div>
        </div>
      </div>

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

      {/* Channel config modal — shared across scenes */}
      {configChannel &&
        (() => {
          const ch = ONBOARDING_CHANNELS.find((c) => c.id === configChannel)!;
          const fields = CHANNEL_CONFIG_FIELDS[configChannel] || [];
          const Icon = ch.icon;
          const allFilled = fields.every((f) => (configValues[f.id] || "").trim().length > 0);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={handleCloseConfig}
              />
              <div className="relative w-full max-w-md mx-4 rounded-2xl border border-border bg-surface-1 shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-border bg-surface-1">
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
                    onClick={handleCloseConfig}
                    className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted hover:text-text-secondary transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                  {fields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-[12px] font-medium text-text-primary mb-1.5">
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
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
                  <button
                    onClick={handleCloseConfig}
                    className="px-4 py-2 rounded-lg text-[13px] font-medium text-text-secondary hover:bg-surface-2 transition-colors"
                  >
                    {t("ws.common.cancel")}
                  </button>
                  <button
                    onClick={() => handleConnectChannel(configChannel)}
                    disabled={!allFilled}
                    className="px-4 py-2 rounded-lg text-[13px] font-medium bg-accent text-accent-fg hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {t("ws.common.connect")}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
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
        <PageHeader
          density="shell"
          title={t("ws.deployments.title")}
          description={t("ws.deployments.subtitle")}
        />

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
            const sl = statusLabel[d.status] ?? statusLabel.live!;
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

const WORKSPACE_LOCALE_OPTIONS: { value: Locale; nativeLabel: string; englishLabel: string }[] = [
  { value: "en", nativeLabel: "English", englishLabel: "English" },
  { value: "zh", nativeLabel: "简体中文", englishLabel: "Chinese (Simplified)" },
];

function WorkspaceLocaleSelectItem({
  value,
  nativeLabel,
  englishLabel,
}: {
  value: Locale;
  nativeLabel: string;
  englishLabel: string;
}) {
  return (
    <SelectPrimitive.Item
      value={value}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-10 text-left outline-none",
        "text-text-primary hover:bg-[var(--color-surface-2)] focus:bg-[var(--color-surface-2)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      )}
    >
      <SelectPrimitive.ItemText>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[13px] font-normal leading-snug">{nativeLabel}</span>
          <span className="text-[11px] leading-snug text-text-tertiary">{englishLabel}</span>
        </span>
      </SelectPrimitive.ItemText>
      <span className="pointer-events-none absolute right-2 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check size={14} className="text-text-primary" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

type SettingsTab = "general" | "providers";

function isSettingsTab(value: string | null): value is SettingsTab {
  return value === "general" || value === "providers";
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

function initialsFromEmail(email: string): string {
  if (!email.trim()) return "?";
  const local = email.split("@")[0]?.trim() ?? "";
  if (!local) return "?";
  const parts = local
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  }
  return local.slice(0, 2).toUpperCase();
}

function SettingsView({
  initialTab = "general",
  initialProviderId = "anthropic",
  signedIn = false,
  accountEmail = "",
  onSignOut,
  onNavigate: _onNavigate,
  demoPlan: _demoPlan = "pro",
  demoBudgetStatus: _demoBudgetStatus = "healthy",
}: {
  initialTab?: SettingsTab;
  initialProviderId?: ModelProvider;
  signedIn?: boolean;
  accountEmail?: string;
  onSignOut?: () => void;
  onNavigate?: (view: View) => void;
  demoPlan?: "free" | "plus" | "pro";
  demoBudgetStatus?: "healthy" | "warning" | "depleted";
}) {
  const { t, locale, setLocale } = useLocale();
  const [settingsTab, setSettingsTab] = useState<SettingsTab>(initialTab);
  const [analytics, setAnalytics] = useState(() => {
    try {
      const v = localStorage.getItem("nexu_analytics");
      if (v === "0") return false;
      if (v === "1") return true;
      return true;
    } catch {
      return true;
    }
  });
  const setAnalyticsPersist = useCallback((v: boolean) => {
    setAnalytics(v);
    try {
      localStorage.setItem("nexu_analytics", v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);
  const [crashReports, setCrashReports] = useState(true);
  const [launchAtLogin, setLaunchAtLogin] = useState(() => {
    try {
      return localStorage.getItem("nexu_launch_at_login") === "1";
    } catch {
      return false;
    }
  });
  const setLaunchAtLoginPersist = useCallback((v: boolean) => {
    setLaunchAtLogin(v);
    try {
      localStorage.setItem("nexu_launch_at_login", v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const [showInDock, setShowInDock] = useState(() => {
    try {
      return localStorage.getItem("nexu_show_in_dock") !== "0";
    } catch {
      return true;
    }
  });
  const setShowInDockPersist = useCallback((v: boolean) => {
    setShowInDock(v);
    try {
      localStorage.setItem("nexu_show_in_dock", v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);
  const providers = getProviderDetails();
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

  const activeProvider = providers.find((p) => p.id === activeProviderId) ?? providers[0];
  const selectedModel = selectedModelId
    ? (availableModels.find((m) => m.id === selectedModelId) ?? null)
    : null;

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

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8">
        <PageHeader
          density="shell"
          title={t("ws.settings.title")}
          description={t("ws.settings.subtitle")}
          actions={
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
          }
        />

        {/* Tab switcher */}
        <div className="flex items-center gap-0 mb-6 border-b border-border">
          {[
            { id: "general" as SettingsTab, labelKey: "ws.settings.tab.general" },
            { id: "providers" as SettingsTab, labelKey: "ws.settings.tab.providers" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSettingsTab(tab.id)}
              className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors ${
                settingsTab === tab.id
                  ? "text-text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {t(tab.labelKey)}
              {settingsTab === tab.id && (
                <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-accent rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ── General Tab ── */}
        {settingsTab === "general" && (
          <div className="space-y-6">
            {/* Account */}
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-text-secondary" />
                  <h3 className="text-[13px] font-semibold text-text-primary">
                    {t("ws.settings.account")}
                  </h3>
                </div>
              </div>
              <div className="px-5 py-4 space-y-4">
                {signedIn ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-border bg-white text-[11px] font-semibold text-text-primary"
                        aria-hidden
                      >
                        {initialsFromEmail(accountEmail)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className="text-[12px] font-medium text-text-primary truncate"
                          title={accountEmail || undefined}
                        >
                          {accountEmail || "—"}
                        </div>
                        <div className="mt-0.5 text-[11px] text-text-tertiary">
                          {t("ws.settings.account.signedInDesc")}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSignOut?.()}
                      className="rounded-[8px] border border-border bg-surface-0 px-[14px] py-[5px] text-[12px] font-medium text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors shrink-0"
                    >
                      {t("ws.settings.account.signOut")}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-medium text-text-primary">
                        {t("ws.settings.account.notSignedIn")}
                      </div>
                      <div className="text-[11px] text-text-tertiary mt-0.5">
                        {t("ws.settings.account.signInDesc")}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        openExternal(`${window.location.origin}/openclaw/auth?desktop=1`)
                      }
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-[8px] px-[14px] py-[5px] text-[12px] font-medium bg-accent text-accent-fg hover:bg-accent-hover transition-colors"
                    >
                      {t("ws.settings.account.signIn")}
                      <ArrowUpRight size={11} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Language */}
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-text-secondary" />
                  <h3 className="text-[13px] font-semibold text-text-primary">
                    {t("ws.settings.languageSection")}
                  </h3>
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-medium text-text-primary">
                      {t("ws.settings.appearance.language")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.appearance.languageDesc")}
                    </div>
                  </div>
                  <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
                    <SelectTrigger
                      className="h-auto min-h-9 w-full min-w-0 shrink-0 py-2 sm:w-[220px]"
                      aria-label={t("ws.settings.appearance.language")}
                    >
                      <SelectValue>
                        {WORKSPACE_LOCALE_OPTIONS.find((o) => o.value === locale)?.nativeLabel ??
                          locale}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={6} align="end">
                      {WORKSPACE_LOCALE_OPTIONS.map((opt) => (
                        <WorkspaceLocaleSelectItem
                          key={opt.value}
                          value={opt.value}
                          nativeLabel={opt.nativeLabel}
                          englishLabel={opt.englishLabel}
                        />
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Application behavior — launch at login + Dock (native reads nexu_launch_at_login, nexu_show_in_dock) */}
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Monitor size={14} className="text-text-secondary" />
                  <h3 className="text-[13px] font-semibold text-text-primary">
                    {t("ws.settings.behavior")}
                  </h3>
                </div>
              </div>
              <div className="px-5 py-4 divide-y divide-border">
                <div className="flex items-start justify-between gap-4 pb-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-medium text-text-primary">
                      {t("ws.settings.behavior.launchAtLogin")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.behavior.launchAtLoginDesc")}
                    </div>
                  </div>
                  <Switch
                    checked={launchAtLogin}
                    onCheckedChange={setLaunchAtLoginPersist}
                    className="shrink-0 mt-0.5"
                  />
                </div>
                <div className="flex items-start justify-between gap-4 pt-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-medium text-text-primary">
                      {t("ws.settings.behavior.showInDock")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.behavior.showInDockDesc")}
                    </div>
                  </div>
                  <Switch
                    checked={showInDock}
                    onCheckedChange={setShowInDockPersist}
                    className="shrink-0 mt-0.5"
                  />
                </div>
              </div>
            </div>

            {/* Data & Privacy */}
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-text-secondary" />
                  <h3 className="text-[13px] font-semibold text-text-primary">
                    {t("ws.settings.data")}
                  </h3>
                </div>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-medium text-text-primary">
                      {t("ws.settings.data.analytics")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.data.analyticsDesc")}
                    </div>
                  </div>
                  <Switch checked={analytics} onCheckedChange={setAnalyticsPersist} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-medium text-text-primary">
                      {t("ws.settings.data.crashReports")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.data.crashReportsDesc")}
                    </div>
                  </div>
                  <Switch checked={crashReports} onCheckedChange={setCrashReports} />
                </div>
              </div>
            </div>

            {/* Updates */}
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <RefreshCw size={14} className="text-text-secondary" />
                  <h3 className="text-[13px] font-semibold text-text-primary">
                    {t("ws.settings.updates")}
                  </h3>
                </div>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-medium text-text-primary">
                      {t("ws.settings.updates.version")}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {t("ws.settings.about.versionNumber")}
                    </div>
                  </div>
                  <button className="rounded-[8px] px-[14px] py-[5px] text-[12px] font-medium border border-border bg-surface-0 text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors">
                    {t("ws.settings.updates.checkNow")}
                  </button>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Info size={14} className="text-text-secondary" />
                  <h3 className="text-[13px] font-semibold text-text-primary">
                    {t("ws.settings.about")}
                  </h3>
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center shrink-0">
                    <img src="/brand/nexu logo-black1.svg" alt="nexu" className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-text-primary">
                      {t("ws.settings.about.version")}
                    </div>
                    <div className="text-[11px] text-text-tertiary">
                      {t("ws.settings.about.versionNumber")} · {t("ws.settings.about.licenseValue")}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  {[
                    {
                      labelKey: "ws.settings.about.docs",
                      url: "https://docs.nexu.io",
                      icon: BookOpen,
                    },
                    { labelKey: "ws.settings.about.github", url: GITHUB_URL, icon: GitHubIcon },
                    {
                      labelKey: "ws.settings.about.changelog",
                      url: "https://docs.nexu.io/changelog",
                      icon: ScrollText,
                    },
                    {
                      labelKey: "ws.settings.about.feedback",
                      url: `${GITHUB_URL}/issues/new`,
                      icon: Mail,
                    },
                  ].map((link) => (
                    <a
                      key={link.labelKey}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors -mx-2"
                    >
                      <link.icon size={13} className="text-text-muted shrink-0" />
                      {t(link.labelKey)}
                      <ArrowUpRight size={10} className="text-text-muted ml-auto shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Providers Tab ── */}
        {settingsTab === "providers" && (
          <>
            {/* Nexu Bot model selector */}
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
                    onClick={() => setShowModelDropdown((v) => !v)}
                    className="inline-flex min-h-9 items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface-0 text-base font-medium text-text-primary transition-all hover:border-border-hover hover:bg-surface-2"
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
                    <ChevronDown size={14} className="text-text-muted" />
                  </button>
                </div>
              </div>

              {showModelDropdown && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 rounded-xl border border-border bg-surface-0 shadow-lg overflow-hidden max-h-[320px] overflow-y-auto">
                  {providers
                    .filter((p) => p.id === "nexu" || configuredProviders.has(p.id))
                    .map((p) => (
                      <div key={p.id}>
                        <div className="sticky top-0 bg-surface-0 px-3 pt-2.5 pb-1 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                          {p.name}
                        </div>
                        {p.models.map((m) => {
                          const isSelected = m.id === selectedModelId;
                          return (
                            <button
                              key={m.id}
                              onClick={() => {
                                setSelectedModelId(m.id);
                                setShowModelDropdown(false);
                              }}
                              className={`flex min-h-9 w-full items-center gap-2.5 px-3 py-2 text-left transition-colors ${isSelected ? "bg-accent/5" : "hover:bg-surface-2"}`}
                            >
                              <span className="flex size-4 shrink-0 items-center justify-center">
                                <ProviderLogo provider={p.id} size={14} />
                              </span>
                              <span
                                className={`min-w-0 flex-1 truncate text-base ${isSelected ? "font-semibold text-accent" : "font-medium text-text-primary"}`}
                              >
                                {m.name}
                              </span>
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
                <SectionHeader
                  className="mb-5 items-start"
                  title={
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2">
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
                  }
                  action={
                    activeProvider.apiDocsUrl ? (
                      <a
                        href={activeProvider.apiDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] leading-none text-[var(--color-link)] no-underline hover:no-underline"
                      >
                        {t("ws.settings.getApiKey")}
                        <ArrowUpRight size={12} className="shrink-0" />
                      </a>
                    ) : undefined
                  }
                />

                {/* Nexu login card */}
                {activeProvider.id === "nexu" && (
                  <div className="rounded-xl border border-[var(--color-brand-primary)]/25 bg-[var(--color-brand-subtle)] px-4 py-4 mb-6">
                    <div className="text-[13px] font-semibold text-[var(--color-brand-primary)]">
                      {t("ws.settings.signInTitle")}
                    </div>
                    <div className="text-[12px] leading-[1.7] text-text-secondary mt-1.5">
                      {t("ws.settings.signInDesc")}
                    </div>
                    <button
                      onClick={() =>
                        openExternal(`${window.location.origin}/openclaw/auth?desktop=1`)
                      }
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-[12px] font-medium text-accent-fg transition-colors hover:bg-accent/90 cursor-pointer"
                    >
                      {t("ws.settings.signInBtn")}
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                )}

                {/* API Key + Proxy URL + Save (hidden for nexu) */}
                {activeProvider.id !== "nexu" && (
                  <div className="space-y-4 mb-6">
                    <div className="text-[10px] uppercase tracking-wider text-text-muted mb-3">
                      {t("ws.settings.apiKeySteps")}
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-text-primary mb-3">
                        {t("ws.settings.apiKey")}
                      </label>
                      <Input
                        type="password"
                        placeholder={activeProvider.apiKeyPlaceholder}
                        value={getFormValues(activeProvider.id).apiKey}
                        onChange={(e) => setFormField(activeProvider.id, "apiKey", e.target.value)}
                        className="w-full text-[12px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-text-primary mb-3">
                        {t("ws.settings.apiProxyUrl")}
                      </label>
                      <Input
                        type="text"
                        value={getFormValues(activeProvider.id).proxyUrl}
                        onChange={(e) =>
                          setFormField(activeProvider.id, "proxyUrl", e.target.value)
                        }
                        className="w-full text-[12px]"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleCheck(activeProvider.id)}
                        disabled={checkState === "checking" || saveState === "saving"}
                        className="text-[12px] text-text-muted hover:text-text-secondary disabled:opacity-50"
                      >
                        {checkState === "checking" && t("ws.settings.testing")}
                        {checkState === "success" && t("ws.settings.connectedStatus")}
                        {checkState === "error" && t("ws.settings.retryTest")}
                        {checkState === "idle" && t("ws.settings.testConnection")}
                      </button>
                      <Button
                        onClick={() => handleSave(activeProvider.id)}
                        disabled={showSaved}
                        loading={saveState === "saving"}
                        size="sm"
                        className={cn(
                          "w-[120px] shrink-0",
                          showSaved &&
                            "border border-[var(--color-success)]/20 bg-[var(--color-success)]/10 text-[var(--color-success)] hover:bg-[var(--color-success)]/10",
                        )}
                      >
                        {showSaved ? t("ws.common.saved") : t("ws.common.save")}
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
                  <SectionHeader
                    className="mb-3"
                    title={
                      <div className="text-[13px] font-semibold text-text-primary">
                        {t("ws.settings.model")}{" "}
                        <span className="font-normal text-text-tertiary">
                          {activeProvider.models.length}
                        </span>
                      </div>
                    }
                  />
                  <div className="space-y-1.5">
                    {activeProvider.models.map((model) => {
                      const isActive = model.id === selectedModelId;
                      return (
                        <button
                          key={model.id}
                          onClick={() => setSelectedModelId(model.id)}
                          className={`w-full min-h-9 flex items-center justify-between gap-3 rounded-lg border-none px-3 py-2.5 text-left transition-all ${
                            isActive
                              ? "ring-1 ring-[var(--color-brand-primary)]/50 bg-[var(--color-brand-subtle)]"
                              : "bg-surface-2 hover:bg-surface-3"
                          }`}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-2.5">
                            <span className="flex size-4 shrink-0 items-center justify-center rounded-md">
                              <ProviderLogo provider={activeProvider.id} size={14} />
                            </span>
                            <div
                              className={`truncate text-base ${isActive ? "font-semibold text-text-primary" : "font-medium text-text-secondary"}`}
                            >
                              {model.name}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="text-sm text-text-tertiary tabular-nums">
                              {model.contextWindow}
                            </span>
                            {isActive && (
                              <Check
                                size={14}
                                className="shrink-0 text-[var(--color-brand-primary)]"
                              />
                            )}
                          </div>
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

/* UsageTab removed — usage details moved to Web dashboard (app.nexu.io/usage). */
/* ------------------------------------------------------------------ */
/*  Rewards Center                                                      */
/* ------------------------------------------------------------------ */

function RewardsCenter({
  budget,
  onDailyCheckIn,
  onOpenMaterial,
  onRequestConfirm,
  t,
}: {
  budget: ReturnType<typeof useBudget>;
  onDailyCheckIn: () => void;
  onOpenMaterial: (channel: RewardChannel) => void;
  onRequestConfirm: (channel: RewardChannel) => void;
  t: (key: string) => string;
}) {
  const dailyResetCountdown = useNextLocalMidnightCountdown();
  const allTasks = REWARD_CHANNELS;
  const completedCount = budget.claimedCount + (budget.dailyCheckedInToday ? 1 : 0);
  const totalCount = budget.channelCount + 1;
  const creditsCapBaseline = budget.totalRewardAvailable + 100;
  const earnedCredits = budget.totalRewardClaimed;
  const weeklyWaitDays =
    typeof window !== "undefined"
      ? (() => {
          const day = new Date().getDay();
          if (day === 1) return 7;
          if (day === 0) return 1;
          return 8 - day;
        })()
      : 7;

  const weeklyCooldownLabel = () =>
    weeklyWaitDays === 1
      ? t("rewards.weeklyCooldownOneDay")
      : t("rewards.weeklyCooldownLeft").replace("{n}", String(weeklyWaitDays));

  const weeklyCooldownButtonLabel = () => "Done";

  const ctaForRow = (ch: RewardChannel) => {
    const isDaily = ch.repeatable === "daily";
    const done = isDaily ? budget.dailyCheckedInToday : budget.claimedChannels.has(ch.id);
    if (done) return "Done";
    if (isDaily) return t("budget.cta.checkin");
    if (ch.id === "github_star") return t("budget.cta.goStar");
    if (ch.shareMode === "image") return t("budget.cta.getMaterial");
    return t("budget.cta.post");
  };

  const buttonPropsForRow = (ch: RewardChannel) => {
    const isDaily = ch.repeatable === "daily";
    const done = isDaily ? budget.dailyCheckedInToday : budget.claimedChannels.has(ch.id);
    const weeklyCooldown = ch.repeatable === "weekly" && done;
    if (done || weeklyCooldown) {
      return { variant: "outline" as const, disabled: true };
    }
    if (isDaily) {
      return { variant: "default" as const, disabled: false };
    }
    return { variant: "outline" as const, disabled: false };
  };

  const onRowAction = (ch: RewardChannel) => {
    const isDaily = ch.repeatable === "daily";
    const done = isDaily ? budget.dailyCheckedInToday : budget.claimedChannels.has(ch.id);
    if (done) return;
    if (isDaily) {
      onDailyCheckIn();
      return;
    }
    if (ch.shareMode === "image") {
      onOpenMaterial(ch);
      return;
    }
    if (ch.url) void openExternal(ch.url);
    onRequestConfirm(ch);
  };

  type RewardSectionBlock = { key: RewardGroup; labelKey: string; channels: RewardChannel[] };

  const buildRewardSections = (keys: RewardGroup[]): RewardSectionBlock[] =>
    REWARD_GROUPS.filter((g) => keys.includes(g.key)).flatMap((group) => {
      const channels = sortChannelsForRewards(
        allTasks.filter((c) => c.group === group.key),
        budget,
      );
      if (channels.length === 0) return [];
      return [{ key: group.key, labelKey: group.labelKey, channels }];
    });

  const topRewardSections = buildRewardSections(["daily", "opensource"]);
  const socialRewardSections = buildRewardSections(["social"]);

  type SocialTab = "mobile" | "web";
  const [socialTab, setSocialTab] = useState<SocialTab>("web");

  const socialWebChannels = socialRewardSections.flatMap((s) =>
    s.channels.filter((ch) => ch.shareMode !== "image"),
  );

  const mobileScanDone = budget.claimedChannels.has("wechat");
  const mobileScanReward = 200;

  const renderRewardRow = (ch: RewardChannel) => {
    const isDaily = ch.repeatable === "daily";
    const done = isDaily ? budget.dailyCheckedInToday : budget.claimedChannels.has(ch.id);
    const weeklyCooldown = ch.repeatable === "weekly" && done;
    const actionProps = buttonPropsForRow(ch);

    return (
      <InteractiveRow
        key={ch.id}
        tone="default"
        onClick={() => onRowAction(ch)}
        className={cn("items-center rounded-xl px-4 py-3", done && "opacity-75")}
      >
        <InteractiveRowLeading
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-[10px] border",
            isDaily
              ? "border-[var(--color-brand-primary)]/28 bg-[var(--color-brand-subtle)] ring-1 ring-inset ring-[var(--color-brand-primary)]/12"
              : "border-transparent bg-surface-2",
            done && isDaily && "opacity-55",
          )}
        >
          <ChannelIcon icon={ch.icon} size={20} accent={isDaily ? "brand" : "default"} />
        </InteractiveRowLeading>

        <InteractiveRowContent className="flex items-center gap-2 py-0.5">
          <div className="flex min-w-0 items-center gap-4">
            <p
              className={cn(
                "min-w-0 truncate text-[14px] font-semibold leading-tight",
                done ? "text-text-tertiary" : "text-text-primary",
              )}
            >
              {t(`reward.${ch.id}.name`)}
            </p>
            {!done ? (
              <span className="shrink-0 text-[14px] font-semibold tabular-nums leading-none whitespace-nowrap text-[var(--color-brand-primary)]">
                {rewardsCreditsPlusLabel(ch.reward, t)}
              </span>
            ) : (
              <span className="inline-flex shrink-0 items-center gap-0.5 text-[14px] font-semibold tabular-nums leading-none whitespace-nowrap text-text-tertiary">
                <Check
                  size={13}
                  strokeWidth={2.5}
                  className="shrink-0 text-[var(--color-brand-primary)]"
                  aria-hidden
                />
                {rewardsCreditsValueLabel(ch.reward, t)}
              </span>
            )}
          </div>
        </InteractiveRowContent>

        <InteractiveRowTrailing className="flex items-center gap-3">
          {weeklyCooldown ? (
            <span className="text-[12px] font-medium leading-none whitespace-nowrap text-text-tertiary tabular-nums">
              {weeklyCooldownLabel()}
            </span>
          ) : null}
          {isDaily && done ? (
            <span className="text-[12px] font-medium leading-none whitespace-nowrap text-text-tertiary tabular-nums">
              {dailyResetCountdown}
            </span>
          ) : null}
          <span
            className={cn(
              "inline-flex min-w-[120px] items-center justify-center rounded-lg px-3 text-sm font-semibold h-8",
              actionProps.variant === "default"
                ? "bg-[var(--color-accent)] text-[var(--color-accent-fg,white)] shadow-sm"
                : "border border-input bg-background text-foreground shadow-xs",
              actionProps.disabled && "pointer-events-none opacity-50",
            )}
          >
            {weeklyCooldown ? weeklyCooldownButtonLabel() : ctaForRow(ch)}
          </span>
        </InteractiveRowTrailing>
      </InteractiveRow>
    );
  };

  const renderRewardSectionGroups = (
    sections: RewardSectionBlock[],
    opts: {
      showGroupTitles: boolean;
      sectionGapClass: string;
      listGapClass: string;
      titleAside?: string;
      sectionHeaderClassName?: string;
    },
  ) =>
    sections.map((section, sectionIndex) => (
      <div key={section.key} className={sectionIndex > 0 ? opts.sectionGapClass : ""}>
        {opts.showGroupTitles ? (
          <SectionHeader
            title={t(section.labelKey)}
            action={
              opts.titleAside ? (
                <span className="text-[12px] font-normal leading-none text-text-tertiary">
                  {opts.titleAside}
                </span>
              ) : undefined
            }
            className={cn("mb-3", opts.sectionHeaderClassName)}
          />
        ) : null}
        <div className={opts.listGapClass}>{section.channels.map(renderRewardRow)}</div>
      </div>
    ));

  return (
    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-5 md:px-6">
      <div className="w-full max-w-[840px] mx-auto">
        <PageHeader
          density="shell"
          title={t("rewards.title")}
          description={
            <>
              {t("rewards.desc")}{" "}
              <TextLink
                href="https://docs.nexu.io/rewards"
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                className="inline-flex items-center gap-1 leading-none text-[var(--color-link)]"
              >
                {t("budget.viral.rules")}
                <ArrowUpRight size={12} className="shrink-0" aria-hidden />
              </TextLink>
            </>
          }
        />

        <div className="mt-8 mb-8" title={t("rewards.creditsMaxHint")}>
          <Card variant="outline" padding="none" className="relative overflow-hidden px-5 py-4">
            <Gift
              size={64}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-heading/[0.06]"
            />
            <div className="relative">
              <div className="text-sm font-semibold text-text-secondary">
                {t("rewards.creditsShort")}
              </div>
              <div className="mt-2.5 flex items-center gap-3">
                <div className="flex items-center text-xl font-bold tracking-tight text-text-primary">
                  <CreditIcon size={14} className="text-text-heading mr-1.5 shrink-0" />
                  {formatCreditsPlain(earnedCredits)}
                  <span className="text-text-muted font-normal">
                    {" "}
                    / {formatCreditsPlain(creditsCapBaseline)}
                  </span>
                </div>
                <span className="text-[12px] text-text-muted">
                  {totalCount - completedCount} earnable{" "}
                  {totalCount - completedCount === 1 ? "task" : "tasks"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-10">
          {topRewardSections.length > 0 ? (
            <div className="flex flex-col gap-3">
              {renderRewardSectionGroups(topRewardSections, {
                showGroupTitles: false,
                sectionGapClass: "",
                listGapClass: "flex flex-col gap-3",
              })}
            </div>
          ) : null}
          {socialRewardSections.length > 0 && (
            <div>
              <ToggleGroup
                type="single"
                value={socialTab}
                onValueChange={(v: string) => {
                  if (v) setSocialTab(v as SocialTab);
                }}
                variant="compact"
                aria-label="Share platform"
                className="mb-4 bg-surface-2"
              >
                <ToggleGroupItem value="web" variant="compact">
                  Share on Web
                </ToggleGroupItem>
                <ToggleGroupItem value="mobile" variant="compact">
                  Share on Mobile
                </ToggleGroupItem>
              </ToggleGroup>
              <div className="grid">
                <div
                  className={cn(
                    "col-start-1 row-start-1 relative flex flex-col rounded-xl border border-border bg-surface-0",
                    socialTab !== "mobile" && "invisible",
                  )}
                  role="region"
                  aria-label={t("rewards.shareMobile.qrRegion")}
                >
                  <div
                    className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl opacity-30"
                    aria-hidden
                  >
                    <span className="absolute top-[34%] left-[22%] -rotate-12">
                      <ChannelIcon icon="wechat" size={40} />
                    </span>
                    <span className="absolute top-[36%] right-[22%] rotate-12">
                      <ChannelIcon icon="xiaohongshu" size={44} />
                    </span>
                    <span className="absolute bottom-[36%] left-[32%] rotate-6">
                      <ChannelIcon icon="feishu" size={38} />
                    </span>
                    <span className="absolute bottom-[38%] right-[30%] -rotate-6">
                      <ChannelIcon icon="jike" size={34} />
                    </span>
                  </div>
                  <div className="relative flex flex-1 flex-col items-center justify-center gap-4 px-5 py-5">
                    <div className="max-w-md space-y-1 text-center">
                      <h3 className="text-[15px] font-semibold leading-snug text-text-primary">
                        {t("rewards.shareMobile.title")}
                      </h3>
                      <p className="text-xs font-normal leading-snug text-text-tertiary">
                        {t("rewards.shareMobile.subtitle")}
                      </p>
                    </div>
                    <img
                      src="/rewards/mobile-share-qr.png"
                      alt={t("rewards.shareMobile.qrRegion")}
                      width={176}
                      height={176}
                      className="size-[176px] object-contain rounded-lg"
                      decoding="async"
                    />
                    {mobileScanDone ? (
                      <span className="inline-flex shrink-0 items-center gap-1 text-[14px] font-semibold tabular-nums leading-none whitespace-nowrap text-text-tertiary">
                        <Check
                          size={13}
                          strokeWidth={2.5}
                          className="shrink-0 text-[var(--color-brand-primary)]"
                          aria-hidden
                        />
                        {rewardsCreditsValueLabel(mobileScanReward, t)}
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center justify-center rounded-full",
                          "bg-[var(--color-brand-subtle)] px-2.5 py-1",
                          "text-[14px] font-semibold tabular-nums leading-none whitespace-nowrap",
                          "text-[var(--color-brand-primary)]",
                        )}
                      >
                        {rewardsCreditsPlusLabel(mobileScanReward, t)}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={cn(
                    "col-start-1 row-start-1 flex flex-col gap-3",
                    socialTab !== "web" && "invisible",
                  )}
                >
                  {socialWebChannels.map(renderRewardRow)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Workspace Shell                                               */
/* ------------------------------------------------------------------ */

/** Body-portaled credits popover — must sit above demo panel, toasts, and in-page CTAs. */
const CREDITS_USAGE_TRIGGER_Z = 2_147_483_646;
const CREDITS_USAGE_PANEL_Z = 2_147_483_647;
const CREDITS_USAGE_TOOLTIP_Z = 2_147_483_647;

type View =
  | { type: "home" }
  | { type: "conversations"; channelId?: string }
  | { type: "deployments" }
  | { type: "skills" }
  | { type: "schedule" }
  | { type: "rewards" }
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

  return (
    <div className="relative flex flex-row h-full">
      {/* Sidebar toggle — fixed position, same spot for expand/collapse */}
      <button
        onClick={() => {
          const next = !collapsed;
          setCollapsed(next);
          localStorage.setItem("nexu_sidebar_collapsed", String(next));
        }}
        className="absolute top-2 left-[88px] z-50 rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-black/5 hover:text-text-primary"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        title={collapsed ? t("ws.sidebar.expand") : t("ws.sidebar.collapse")}
      >
        {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      {/* Sidebar — frosted glass + fully hidden when collapsed */}
      <div
        className={`sidebar-vibrancy flex shrink-0 flex-col overflow-hidden ${collapsed ? "w-0" : ""}`}
        style={
          {
            ...(!collapsed ? { width: sidebarWidth } : {}),
            transition: isResizing.current ? "none" : "width 200ms",
            WebkitAppRegion: "drag",
          } as React.CSSProperties
        }
      >
        {/* Traffic light clearance */}
        <div className="h-14 shrink-0" />

        {/* Brand */}
        <div
          className="px-3 pb-2 flex items-center justify-between"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <img src="/brand/logo-black-1.svg" alt="nexu" className="h-6 object-contain" />
          {hasUpdate && updateDismissed && (
            <button
              onClick={() => setUpdateDismissed(false)}
              className="rounded-full px-2 py-1 text-[12px] leading-none font-semibold bg-[var(--color-brand-primary)] text-white hover:opacity-85 transition-opacity"
            >
              {t("ws.sidebar.update")}
            </button>
          )}
        </div>

        {/* Nav items */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <div className="px-2 pt-3 space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const active = view.type === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView({ type: item.id } as View)}
                  className={`nav-item flex w-full items-center gap-2.5 whitespace-nowrap rounded-[var(--radius-6)] px-2.5 py-[7px] text-[13px] transition-colors ${
                    active ? "nav-item-active" : ""
                  }`}
                >
                  <item.icon size={16} />
                  {t(item.labelKey)}
                  {item.id === "skills" && (
                    <span className="ml-auto text-[10px] text-text-tertiary font-normal">
                      {capabilitiesNavCount}
                    </span>
                  )}
                </button>
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
                  <button
                    key={ch.id}
                    onClick={() => setView({ type: "conversations", channelId: ch.id })}
                    className={`nav-item flex w-full items-center gap-2.5 rounded-[var(--radius-6)] px-2.5 py-[7px] text-[13px] transition-colors ${
                      active ? "nav-item-active" : ""
                    }`}
                  >
                    <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                      <ChannelIcon size={14} />
                    </span>
                    <span className={`truncate text-[12px] ${active ? "" : "text-text-primary"}`}>
                      {ch.name}
                    </span>
                    <span className="ml-auto text-[10px] font-normal tabular-nums text-text-tertiary">
                      {ch.messageCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Update banner moved to canvas bottom-right */}

        {/* Rewards float banner — only when logged in (BYOK uses the login prompt below instead) */}
        {nexuLoggedIn && budget.claimedCount < budget.channelCount && (
          <div className="px-3 mb-2" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
            <InteractiveRow
              tone="subtle"
              onClick={() => {
                if (nexuLoggedIn) {
                  setView({ type: "rewards" });
                } else {
                  openExternal(`${window.location.origin}/openclaw/auth?desktop=1`);
                }
              }}
              className="!rounded-[10px] !bg-[var(--color-brand-subtle)] !border !border-[var(--color-brand-primary)]/12 hover:!border-[var(--color-brand-primary)]/20 hover:!bg-[var(--color-brand-primary)]/[0.06] px-3 py-3 items-center"
            >
              <InteractiveRowLeading className="flex items-center justify-center">
                <Gift
                  size={15}
                  className="text-[var(--color-brand-primary)] animate-[wiggle_2s_ease-in-out_infinite]"
                />
              </InteractiveRowLeading>
              <InteractiveRowContent className="overflow-hidden">
                {nexuLoggedIn ? (
                  <span className="block text-[12px] font-semibold text-[var(--color-brand-primary)] leading-[1.3] truncate">
                    {t("budget.viral.title")}
                  </span>
                ) : (
                  <span className="block text-[12px] font-semibold text-[var(--color-brand-primary)] leading-[1.4] truncate">
                    {t("budget.viral.loginFirst")}
                  </span>
                )}
              </InteractiveRowContent>
              <InteractiveRowTrailing className="inline-flex items-center shrink-0 ml-1">
                <ChevronRight size={13} className="text-[var(--color-brand-primary)]/40" />
              </InteractiveRowTrailing>
            </InteractiveRow>
          </div>
        )}

        {!nexuLoggedIn && <div className="hidden" />}

        {/* Sidebar footer — help · GitHub */}
        <div
          className="flex shrink-0 items-center gap-0.5 px-2 pb-2 pt-1.5"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <div className="flex-1" />
          <div className="relative shrink-0" ref={helpRef}>
            {showHelpMenu && (
              <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-[200px]">
                <div className="rounded-xl border bg-surface-1 border-border shadow-xl shadow-black/10 overflow-hidden">
                  <div className="p-1.5">
                    <a
                      href="https://docs.nexu.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium text-text-secondary transition-all hover:bg-black/5 hover:text-text-primary"
                    >
                      <BookOpen size={14} />
                      {t("ws.help.documentation")}
                    </a>
                    <a
                      href="mailto:hi@nexu.ai"
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium text-text-secondary transition-all hover:bg-black/5 hover:text-text-primary"
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
                        setCheckingUpdate(true);
                        setTimeout(() => {
                          setCheckingUpdate(false);
                          if (hasUpdate && !updateDismissed) {
                            /* new version → sidebar card already visible */
                          } else {
                            setShowUpToDate(true);
                          }
                        }, 1500);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium text-text-secondary transition-all hover:bg-black/5 hover:text-text-primary"
                    >
                      <Loader2 size={14} />
                      Check for Updates…
                    </button>
                    <a
                      href="https://nexu.ai/changelog"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all"
                    >
                      <ScrollText size={14} />
                      {t("ws.help.changelog")}
                    </a>
                  </div>
                  <div className="border-t border-border p-1.5">
                    <div className="px-2 pt-0.5 pb-1.5 text-[10px] font-medium text-text-tertiary uppercase tracking-wider">
                      {t("ws.help.language")}
                    </div>
                    <div className="space-y-0.5">
                      {[
                        { value: "en" as const, label: "English" },
                        { value: "zh" as const, label: "简体中文" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setLocale(opt.value);
                            setShowHelpMenu(false);
                          }}
                          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium transition-all ${
                            locale === opt.value
                              ? "bg-black/5 text-text-primary"
                              : "text-text-secondary hover:bg-black/5 hover:text-text-primary"
                          }`}
                        >
                          <Globe size={14} className="shrink-0 opacity-60" />
                          <span className="flex-1 text-left">{opt.label}</span>
                          {locale === opt.value && <Check size={12} className="shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowHelpMenu(!showHelpMenu)}
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors cursor-pointer ${showHelpMenu ? "text-text-primary bg-surface-2" : "text-text-secondary hover:text-text-primary hover:bg-surface-2"}`}
              title={t("ws.help.title")}
            >
              <CircleHelp size={16} />
            </button>
          </div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
            title={
              stars && stars > 0
                ? `${t("ws.help.github")} · ${stars.toLocaleString()} stars`
                : t("ws.help.github")
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Mobile header — hidden in desktop client */}
      <div className="hidden">
        <button
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
          onClick={() => setView({ type: "settings" })}
          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Resize handle */}
      {!collapsed && (
        <div
          onMouseDown={handleResizeStart}
          className="w-[3px] shrink-0 cursor-col-resize group relative z-10"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <div className="absolute inset-y-0 -left-[2px] -right-[2px]" />
        </div>
      )}

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
                onNavigate={setView}
                demoPlan={demoPlan}
                demoBudgetStatus={demoBudgetStatus}
              />
            )}
          </div>
        )}
      </main>

      {/* Not logged in — sign-in button in top-right, same position as avatar */}
      {!nexuLoggedIn && (
        <div
          className="absolute top-5 right-5"
          style={
            {
              WebkitAppRegion: "no-drag",
              zIndex: CREDITS_USAGE_TRIGGER_Z,
            } as React.CSSProperties
          }
        >
          <button
            type="button"
            onClick={() => openExternal(`${window.location.origin}/openclaw/auth?desktop=1`)}
            className="flex items-center gap-2 h-7 pl-3 pr-1 rounded-full bg-surface-0 border border-border cursor-pointer hover:border-border-subtle hover:shadow-sm transition-all shrink-0"
            title="Sign in to nexu"
          >
            <span className="text-[12px] font-medium text-text-secondary leading-none">
              Sign in
            </span>
            <span className="flex items-center justify-center size-5 rounded-full bg-surface-2">
              <img src="/brand/nexu logo-black1.svg" alt="nexu" className="size-3" />
            </span>
          </button>
        </div>
      )}

      {/* Credits trigger + dropdown — OUTSIDE main to escape its overflow-hidden stacking context */}
      {nexuLoggedIn &&
        (() => {
          const planKey = demoPlan;
          const isFree = planKey === "free";
          const isPlus = planKey === "plus";
          const PLAN_META: Record<string, { label: string; color: string }> = {
            free: { label: "Free", color: "text-[var(--color-text-muted)]" },
            plus: { label: "Plus", color: "text-[var(--color-info)]" },
            pro: { label: "Pro", color: "text-[var(--color-brand-primary)]" },
          };
          const CREDITS_PILL_STYLES: Record<
            string,
            { shell: string; icon: string; value: string }
          > = {
            free: {
              shell:
                "bg-surface-0 border border-border-subtle hover:border-border transition-colors",
              icon: "text-text-secondary",
              value: "text-text-primary font-medium",
            },
            plus: {
              shell:
                "bg-[var(--color-info-subtle)] border border-[var(--color-info)]/35 hover:border-[var(--color-info)]/55 transition-colors",
              icon: "text-[var(--color-info)]",
              value: "text-[var(--color-info)] font-semibold",
            },
            pro: {
              shell: cn(
                "relative overflow-hidden border border-[var(--color-brand-primary)]/50",
                "bg-gradient-to-br from-[hsl(var(--accent)/0.24)] via-[var(--color-surface-0)] to-[hsl(var(--accent)/0.11)]",
                "shadow-[0_2px_16px_-4px_hsl(var(--accent)/0.42),inset_0_1px_0_rgba(255,255,255,0.72)]",
                "hover:border-[var(--color-brand-primary)]/70 hover:shadow-[0_4px_22px_-5px_hsl(var(--accent)/0.5),inset_0_1px_0_rgba(255,255,255,0.8)]",
                "transition-[box-shadow,border-color] duration-200",
              ),
              icon: "text-[var(--color-brand-primary)] drop-shadow-[0_0_10px_hsl(var(--accent)/0.5)]",
              value: "text-text-primary font-semibold",
            },
          };
          const plan = PLAN_META[planKey];
          const pillStyle = CREDITS_PILL_STYLES[planKey] ?? CREDITS_PILL_STYLES.free;
          const baseCredits = Math.round(budget.remaining);
          const bonusCredits = Math.round(budget.bonusRemaining);
          const packCredits = creditPackInfo.remaining;
          const totalCredits = baseCredits + bonusCredits + packCredits;

          return (
            <>
              <div
                ref={creditsShellRef}
                className="absolute top-5 right-5"
                style={
                  {
                    WebkitAppRegion: "no-drag",
                    zIndex: CREDITS_USAGE_TRIGGER_Z,
                  } as React.CSSProperties
                }
              >
                <div className="flex items-center gap-2.5">
                  <div
                    onMouseEnter={() => {
                      openUsagePanel();
                      clearAccountLeaveTimer();
                      setShowAccountPanel(false);
                    }}
                    onMouseLeave={scheduleCloseUsagePanel}
                    className={cn(
                      "flex items-center gap-1 h-7 pl-3 pr-3 rounded-full cursor-default text-[13px]",
                      pillStyle.shell,
                    )}
                  >
                    <CreditIcon size={12} className={pillStyle.icon} />
                    <span className={cn("text-[13px] tabular-nums leading-none", pillStyle.value)}>
                      {totalCredits.toLocaleString()}
                    </span>
                    {(isFree || isPlus) && (
                      <>
                        <span className="w-px h-3 bg-border-subtle mx-1.5" />
                        <button
                          type="button"
                          className={cn(
                            "text-[13px] font-semibold leading-none cursor-pointer hover:opacity-75 transition-opacity",
                            isPlus
                              ? "text-[var(--color-info)]"
                              : "text-[var(--color-text-heading)]",
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            openExternal(`${window.location.origin}/openclaw/pricing`);
                          }}
                        >
                          Upgrade
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    ref={avatarRef}
                    type="button"
                    onClick={() => setView({ type: "settings" })}
                    onMouseEnter={() => {
                      openAccountPanel();
                      clearUsageLeaveTimer();
                      setShowUsagePanel(false);
                    }}
                    onMouseLeave={scheduleCloseAccountPanel}
                    className="flex items-center justify-center size-7 rounded-full bg-[var(--color-accent)] text-white text-[12px] font-semibold leading-none cursor-pointer hover:opacity-90 transition-opacity shrink-0"
                    title={nexuAccountEmail}
                  >
                    {initialsFromEmail(nexuAccountEmail)}
                  </button>
                </div>
              </div>

              {showUsagePanel && usagePanelLayout && (
                <div
                  className="fixed pointer-events-auto"
                  style={
                    {
                      top: usagePanelLayout.top,
                      left: usagePanelLayout.left,
                      width: usagePanelLayout.width,
                      zIndex: CREDITS_USAGE_PANEL_Z,
                    } as React.CSSProperties
                  }
                  onMouseEnter={openUsagePanel}
                  onMouseLeave={scheduleCloseUsagePanel}
                >
                  <Card
                    variant="static"
                    padding="none"
                    className="overflow-visible bg-white shadow-[var(--shadow-dropdown)]"
                  >
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 border-b border-border-subtle px-4 py-3">
                      <CardTitle className={cn("text-sm font-bold leading-none", plan.color)}>
                        {plan.label}
                      </CardTitle>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="shrink-0 text-text-muted hover:text-text-secondary"
                          onClick={() => setShowUsagePanel(false)}
                          onMouseDown={(e) => e.stopPropagation()}
                          aria-label="Close"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="mt-0 flex flex-col gap-3 px-4 py-3">
                      <InteractiveRow
                        tone="subtle"
                        className="!items-center !rounded-lg !gap-2 !px-0 !py-0 !border-0 pointer-events-none"
                      >
                        <InteractiveRowLeading className="flex shrink-0 items-center justify-center">
                          <CreditIcon size={12} className={cn("block shrink-0", pillStyle.icon)} />
                        </InteractiveRowLeading>
                        <InteractiveRowContent className="flex min-h-0 min-w-0 flex-1 items-center">
                          <span className="text-[13px] font-semibold leading-none text-[var(--color-text-primary)]">
                            Total credits
                          </span>
                        </InteractiveRowContent>
                        <InteractiveRowTrailing className="flex shrink-0 items-center">
                          <span className="text-[13px] font-bold leading-none tabular-nums text-[var(--color-text-primary)]">
                            {totalCredits}
                          </span>
                        </InteractiveRowTrailing>
                      </InteractiveRow>

                      <Tooltip>
                        <TooltipTrigger className="w-full">
                          <div className="flex w-full items-center gap-2 rounded-lg px-0 py-0 text-left">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1 cursor-help">
                                <span className="text-[12px] text-[var(--color-text-muted)]">
                                  Plan credits
                                </span>
                                <Info
                                  size={10}
                                  className="text-[var(--color-text-muted)] shrink-0"
                                />
                              </div>
                            </div>
                            <div className="shrink-0">
                              <span className="text-[12px] text-[var(--color-text-secondary)] tabular-nums">
                                {baseCredits}
                                <span className="text-[var(--color-text-muted)]">
                                  /{Math.round(budget.total)}
                                </span>
                              </span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          align="start"
                          className={cn("max-w-[220px] text-[10px] leading-relaxed")}
                          style={{ zIndex: CREDITS_USAGE_TOOLTIP_Z }}
                        >
                          Included with your plan each cycle; resets when the period ends.
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger className="w-full">
                          <div className="flex w-full items-center gap-2 rounded-lg px-0 py-0 text-left">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1 cursor-help">
                                <span className="text-[12px] text-[var(--color-text-muted)]">
                                  Bonus credits
                                </span>
                                <Info
                                  size={10}
                                  className="text-[var(--color-text-muted)] shrink-0"
                                />
                              </div>
                            </div>
                            <div className="shrink-0">
                              <span className="text-[12px] text-[var(--color-text-secondary)] tabular-nums">
                                {bonusCredits}
                              </span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          align="start"
                          className={cn("max-w-[240px] text-[10px] leading-relaxed")}
                          style={{ zIndex: CREDITS_USAGE_TOOLTIP_Z }}
                        >
                          From signup rewards, tasks, and promos. Usage order: plan credits → credit
                          pack → bonus credits.
                        </TooltipContent>
                      </Tooltip>

                      {packCredits > 0 && (
                        <Tooltip>
                          <TooltipTrigger className="w-full">
                            <div className="flex w-full items-center gap-2 rounded-lg px-0 py-0 text-left">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1 cursor-help">
                                  <span className="text-[12px] text-[var(--color-text-muted)]">
                                    Credit pack balance
                                  </span>
                                  <Info
                                    size={10}
                                    className="text-[var(--color-text-muted)] shrink-0"
                                  />
                                </div>
                              </div>
                              <div className="shrink-0">
                                <span className="text-[12px] text-[var(--color-text-secondary)] tabular-nums">
                                  {packCredits.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            align="start"
                            className={cn("max-w-[240px] text-[10px] leading-relaxed")}
                            style={{ zIndex: CREDITS_USAGE_TOOLTIP_Z }}
                          >
                            Your purchased {creditPackInfo.label}, valid for 1 month. Usage order:
                            plan credits → credit pack → bonus credits.
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {showAccountPanel && accountPanelLayout && (
                <div
                  className="fixed pointer-events-auto"
                  style={
                    {
                      top: accountPanelLayout.top,
                      right: accountPanelLayout.right,
                      zIndex: CREDITS_USAGE_PANEL_Z,
                    } as React.CSSProperties
                  }
                  onMouseEnter={openAccountPanel}
                  onMouseLeave={scheduleCloseAccountPanel}
                >
                  <Card
                    variant="static"
                    padding="none"
                    className="overflow-visible bg-white shadow-[var(--shadow-dropdown)] min-w-[200px]"
                  >
                    <div className="px-4 py-3 flex items-center gap-2.5">
                      <span className="flex items-center justify-center size-8 rounded-full bg-[var(--color-accent)] text-white text-[12px] font-semibold leading-none shrink-0">
                        {initialsFromEmail(nexuAccountEmail)}
                      </span>
                      <span className="text-[13px] font-medium text-text-primary truncate">
                        {nexuAccountEmail}
                      </span>
                    </div>
                    <div className="border-t border-border-subtle px-4 py-2.5">
                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-[12px] text-text-muted hover:text-destructive cursor-pointer transition-colors"
                        onClick={() => {
                          setShowAccountPanel(false);
                          setDemoLoggedIn(false);
                        }}
                      >
                        <LogOut size={12} />
                        Sign out
                      </button>
                    </div>
                  </Card>
                </div>
              )}
            </>
          );
        })()}

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

      {/* Update check dialog — checking / up-to-date */}
      {(checkingUpdate || showUpToDate) && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: "transparent",
            pointerEvents: "none",
            animation: "fadeIn 150ms ease-out",
          }}
          onClick={showUpToDate ? () => setShowUpToDate(false) : undefined}
        >
          <div
            className="flex flex-col items-center w-[260px] px-6 py-6 rounded-[14px] bg-surface-1 text-center"
            style={{
              pointerEvents: "auto",
              boxShadow: "0 24px 48px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
              animation: "scaleIn 200ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onClick={(e) => e.stopPropagation()}
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
              <button
                onClick={() => setShowUpToDate(false)}
                className="w-full py-[7px] rounded-lg bg-[#3478f6] text-white text-[13px] font-medium hover:bg-[#2563eb] transition-colors border-none cursor-pointer mt-1"
                type="button"
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Demo Control Panel ── */}
      <div
        className="fixed bottom-4 right-4 z-[9999]"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        {showDemoPanel ? (
          <div className="w-[220px] rounded-[14px] border border-border bg-surface-1 shadow-[var(--shadow-dropdown)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-surface-2">
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">
                Demo Controls
              </span>
              <button
                onClick={() => setShowDemoPanel(false)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={13} />
              </button>
            </div>

            <div className="px-3.5 py-3 space-y-3">
              {/* Login toggle */}
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-text-secondary">登录状态</span>
                <button
                  onClick={() => setDemoLoggedIn((v) => !v)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${demoLoggedIn ? "bg-[var(--color-brand-primary)]" : "bg-border"}`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${demoLoggedIn ? "translate-x-4" : "translate-x-0.5"}`}
                  />
                </button>
              </div>

              {/* Plan selector */}
              <div>
                <div className="text-[11px] text-text-muted mb-1.5">套餐</div>
                <div className="grid grid-cols-2 gap-1">
                  {(["free", "plus", "pro"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setDemoPlan(p)}
                      className={`py-1 rounded-lg text-[12px] font-medium transition-colors capitalize ${
                        demoPlan === p
                          ? "bg-[var(--color-brand-primary)] text-white"
                          : "bg-surface-2 text-text-secondary hover:bg-surface-0"
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget status */}
              <div>
                <div className="text-[11px] text-text-muted mb-1.5">额度状态</div>
                <div className="grid grid-cols-3 gap-1">
                  {(
                    [
                      { key: "healthy", label: "充足", color: "var(--color-success)" },
                      { key: "warning", label: "预警", color: "var(--color-warning)" },
                      { key: "depleted", label: "耗尽", color: "var(--color-danger)" },
                    ] as const
                  ).map(({ key, label, color }) => (
                    <button
                      key={key}
                      onClick={() => setDemoBudgetStatus(key)}
                      className={`py-1 rounded-lg text-[12px] font-medium transition-colors ${
                        demoBudgetStatus === key
                          ? "text-white"
                          : "bg-surface-2 text-text-secondary hover:bg-surface-0"
                      }`}
                      style={demoBudgetStatus === key ? { background: color } : {}}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Credit pack demo */}
              <div>
                <div className="text-[11px] text-text-muted mb-1.5">积分包</div>
                <div className="grid grid-cols-2 gap-1">
                  {(["none", "2000", "5200", "11000", "55000"] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDemoCreditPack(key)}
                      className={`py-1 rounded-md text-[12px] font-medium transition-colors ${
                        demoCreditPack === key
                          ? "bg-text-primary text-white"
                          : "bg-surface-2 text-text-secondary hover:bg-surface-0"
                      }`}
                    >
                      {key === "none" ? "无" : `${Number(key).toLocaleString()}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* GitHub Star onboarding — manual trigger for demos */}
              <div>
                <div className="text-[11px] text-text-muted mb-1.5">引导</div>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStarModalStep("prompt");
                      setShowStarModal(true);
                    }}
                    className="w-full py-1.5 rounded-lg text-[12px] font-medium bg-surface-2 text-text-secondary hover:bg-surface-0 border border-border transition-colors"
                  >
                    GitHub Star 引导弹窗
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSeedanceModal(true)}
                    className="w-full py-1.5 rounded-lg text-[12px] font-medium bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 border border-violet-200/60 transition-colors"
                  >
                    🎬 Seedance 2.0 推广弹窗
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        localStorage.removeItem(SEEDANCE_BANNER_DISMISSED_KEY);
                      } catch {
                        /* noop */
                      }
                      window.dispatchEvent(new Event("seedance-banner-reset"));
                    }}
                    className="w-full py-1.5 rounded-lg text-[12px] font-medium bg-[var(--color-warning)]/12 text-[var(--color-warning)] hover:bg-[var(--color-warning)]/18 border border-[var(--color-warning)]/30 transition-colors"
                  >
                    恢复 Seedance Banner
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDemoPanel(true)}
            className="w-8 h-8 rounded-full bg-surface-1 border border-border shadow-[var(--shadow-card)] flex items-center justify-center text-text-muted hover:text-text-primary hover:shadow-[var(--shadow-dropdown)] transition-all"
            title="Demo Controls"
          >
            <Settings size={14} />
          </button>
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-[300] -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-medium shadow-[0_8px_32px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.06)]"
          style={{
            background: toast.type === "success" ? "var(--color-success)" : "var(--color-danger)",
            color: "#fff",
            animation: "scaleIn 200ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {toast.type === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
