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
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Cable,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock,
  Compass,
  Cpu,
  Database,
  Download,
  ExternalLink,
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
  Plus,
  RefreshCw,
  ScrollText,
  Search,
  Settings,
  Settings2,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  User,
  Users,
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
import { SKILL_CATEGORIES, TOOL_TAG_LABELS, type ToolTag } from "./skillData";

const GITHUB_URL = "https://github.com/refly-ai/nexu";

/** Reward share modal: selectable stamp previews (paths under `public/share-material/`). */
const SHARE_MATERIAL_STAMP_OPTIONS = [
  "/share-material/stamp-1.png",
  "/share-material/stamp-2.png",
  "/share-material/stamp-3.png",
  "/share-material/stamp-4.png",
  "/share-material/stamp-6.png",
] as const;

function downloadShareCard() {
  const W = 1080,
    H = 1080,
    PAD = 80;
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

function ProviderLogo({ provider, size = 16 }: { provider: string; size?: number }) {
  const s = { width: size, height: size };
  switch (provider) {
    case "nexu":
      return <img src="/logo.svg" alt="nexu" style={s} className="object-contain" />;
    case "anthropic":
      return (
        <svg aria-hidden="true" style={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.767L16.906 20.48h-3.674l-1.476-3.914H5.036l-1.466 3.914H0L6.569 3.52zm.658 10.418h4.543L9.548 7.04l-2.32 6.898z" />
        </svg>
      );
    case "openai":
      return (
        <svg aria-hidden="true" style={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.042 6.042 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
        </svg>
      );
    case "google":
      return (
        <svg aria-hidden="true" style={s} viewBox="0 0 24 24" fill="none">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      );
    case "xai":
      return (
        <svg aria-hidden="true" style={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 2l8.6 12.24L3 22h1.95l7.56-6.8L18.06 22H21L12.12 9.36 19.8 2h-1.95l-6.66 6.42L5.94 2H3zm2.76 1.4h2.46l9.96 15.2h-2.46L5.76 3.4z" />
        </svg>
      );
    case "kimi":
      return (
        <svg aria-hidden="true" style={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.846 0a1.923 1.923 0 110 3.846H20.15a.226.226 0 01-.227-.226V1.923C19.923.861 20.784 0 21.846 0z" />
          <path d="M11.065 11.199l7.257-7.2c.137-.136.06-.41-.116-.41H14.3a.164.164 0 00-.117.051l-7.82 7.756c-.122.12-.302.013-.302-.179V3.82c0-.127-.083-.23-.185-.23H3.186c-.103 0-.186.103-.186.23V19.77c0 .128.083.23.186.23h2.69c.103 0 .186-.102.186-.23v-3.25c0-.069.025-.135.069-.178l2.424-2.406a.158.158 0 01.205-.023l6.484 4.772a7.677 7.677 0 003.453 1.283c.108.012.2-.095.2-.23v-3.06c0-.117-.07-.212-.164-.227a5.028 5.028 0 01-2.027-.807l-5.613-4.064c-.117-.078-.132-.279-.028-.381z" />
        </svg>
      );
    case "glm":
      return (
        <svg
          aria-hidden="true"
          style={s}
          viewBox="0 0 24 24"
          fill="currentColor"
          fillRule="evenodd"
        >
          <path d="M11.991 23.503a.24.24 0 00-.244.248.24.24 0 00.244.249.24.24 0 00.245-.249.24.24 0 00-.22-.247l-.025-.001zM9.671 5.365a1.697 1.697 0 011.099 2.132l-.071.172-.016.04-.018.054c-.07.16-.104.32-.104.498-.035.71.47 1.279 1.186 1.314h.366c1.309.053 2.338 1.173 2.286 2.523-.052 1.332-1.152 2.38-2.478 2.327h-.174c-.715.018-1.274.64-1.239 1.368 0 .124.018.23.053.337.209.373.54.658.96.8.75.23 1.517-.125 1.9-.782l.018-.035c.402-.64 1.17-.96 1.92-.711.854.284 1.378 1.226 1.099 2.167a1.661 1.661 0 01-2.077 1.102 1.711 1.711 0 01-.907-.711l-.017-.035c-.2-.323-.463-.58-.851-.711l-.056-.018a1.646 1.646 0 00-1.954.746 1.66 1.66 0 01-1.065.764 1.677 1.677 0 01-1.989-1.279c-.209-.906.332-1.83 1.257-2.043a1.51 1.51 0 01.296-.035h.018c.68-.071 1.151-.622 1.116-1.333a1.307 1.307 0 00-.227-.693 2.515 2.515 0 01-.366-1.403 2.39 2.39 0 01.366-1.208c.14-.195.21-.444.227-.693.018-.71-.506-1.261-1.186-1.332l-.07-.018a1.43 1.43 0 01-.299-.07l-.05-.019a1.7 1.7 0 01-1.047-2.114 1.68 1.68 0 012.094-1.101zm-5.575 10.11c.26-.264.639-.367.994-.27.355.096.633.379.728.74.095.362-.007.748-.267 1.013-.402.41-1.053.41-1.455 0a1.062 1.062 0 010-1.482zm14.845-.294c.359-.09.738.024.992.297.254.274.344.665.237 1.025-.107.36-.396.634-.756.718-.551.128-1.1-.22-1.23-.781a1.05 1.05 0 01.757-1.26zm-.064-4.39c.314.32.49.753.49 1.206 0 .452-.176.886-.49 1.206-.315.32-.74.5-1.185.5-.444 0-.87-.18-1.184-.5a1.727 1.727 0 010-2.412 1.654 1.654 0 012.369 0zm-11.243.163c.364.484.447 1.128.218 1.691a1.665 1.665 0 01-2.188.923c-.855-.36-1.26-1.358-.907-2.228a1.68 1.68 0 011.33-1.038c.593-.08 1.183.169 1.547.652zm11.545-4.221c.368 0 .708.2.892.524.184.324.184.724 0 1.048a1.026 1.026 0 01-.892.524c-.568 0-1.03-.47-1.03-1.048 0-.579.462-1.048 1.03-1.048zm-14.358 0c.368 0 .707.2.891.524.184.324.184.724 0 1.048a1.026 1.026 0 01-.891.524c-.569 0-1.03-.47-1.03-1.048 0-.579.461-1.048 1.03-1.048zm10.031-1.475c.925 0 1.675.764 1.675 1.706s-.75 1.705-1.675 1.705-1.674-.763-1.674-1.705c0-.942.75-1.706 1.674-1.706zM12.226 4.574c.362-.082.653-.356.761-.718a1.062 1.062 0 00-.238-1.028 1.017 1.017 0 00-.996-.294c-.547.14-.881.7-.752 1.257.13.558.675.907 1.225.783zm0 16.876c.359-.087.644-.36.75-.72a1.062 1.062 0 00-.237-1.019 1.018 1.018 0 00-.985-.301 1.037 1.037 0 00-.762.717c-.108.361-.017.754.239 1.028.245.263.606.377.953.305l.043-.01zM17.19 3.5a.631.631 0 00.628-.64c0-.355-.279-.64-.628-.64a.631.631 0 00-.628.64c0 .355.28.64.628.64zm-10.38 0a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64a.631.631 0 00-.628.64c0 .355.279.64.628.64zm-5.182 7.852a.631.631 0 00-.628.64c0 .354.28.639.628.639a.63.63 0 00.627-.606l.001-.034a.62.62 0 00-.628-.64zm5.182 9.13a.631.631 0 00-.628.64c0 .355.279.64.628.64a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64zm10.38.018a.631.631 0 00-.628.64c0 .355.28.64.628.64a.631.631 0 00.628-.64c0-.355-.279-.64-.628-.64zm5.182-9.148a.631.631 0 00-.628.64c0 .354.279.639.628.639a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64zm-.384-4.992a.24.24 0 00.244-.249.24.24 0 00-.244-.249.24.24 0 00-.244.249c0 .142.122.249.244.249zM11.991.497a.24.24 0 00.245-.248A.24.24 0 0011.99 0a.24.24 0 00-.244.249c0 .133.108.236.223.247l.021.001zM2.011 6.36a.24.24 0 00.245-.249.24.24 0 00-.244-.249.24.24 0 00-.244.249.24.24 0 00.244.249zm0 11.263a.24.24 0 00-.243.248.24.24 0 00.244.249.24.24 0 00.244-.249.252.252 0 00-.244-.248zm19.995-.018a.24.24 0 00-.245.248.24.24 0 00.245.25.24.24 0 00.244-.25.252.252 0 00-.244-.248z" />
        </svg>
      );
    case "minimax":
      return (
        <svg
          aria-hidden="true"
          style={s}
          viewBox="0 0 24 24"
          fill="currentColor"
          fillRule="evenodd"
        >
          <path d="M16.278 2c1.156 0 2.093.927 2.093 2.07v12.501a.74.74 0 00.744.709.74.74 0 00.743-.709V9.099a2.06 2.06 0 012.071-2.049A2.06 2.06 0 0124 9.1v6.561a.649.649 0 01-.652.645.649.649 0 01-.653-.645V9.1a.762.762 0 00-.766-.758.762.762 0 00-.766.758v7.472a2.037 2.037 0 01-2.048 2.026 2.037 2.037 0 01-2.048-2.026v-12.5a.785.785 0 00-.788-.753.785.785 0 00-.789.752l-.001 15.904A2.037 2.037 0 0113.441 22a2.037 2.037 0 01-2.048-2.026V18.04c0-.356.292-.645.652-.645.36 0 .652.289.652.645v1.934c0 .263.142.506.372.638.23.131.514.131.744 0a.734.734 0 00.372-.638V4.07c0-1.143.937-2.07 2.093-2.07zm-5.674 0c1.156 0 2.093.927 2.093 2.07v11.523a.648.648 0 01-.652.645.648.648 0 01-.652-.645V4.07a.785.785 0 00-.789-.78.785.785 0 00-.789.78v14.013a2.06 2.06 0 01-2.07 2.048 2.06 2.06 0 01-2.071-2.048V9.1a.762.762 0 00-.766-.758.762.762 0 00-.766.758v3.8a2.06 2.06 0 01-2.071 2.049A2.06 2.06 0 010 12.9v-1.378c0-.357.292-.646.652-.646.36 0 .653.29.653.646V12.9c0 .418.343.757.766.757s.766-.339.766-.757V9.099a2.06 2.06 0 012.07-2.048 2.06 2.06 0 012.071 2.048v8.984c0 .419.343.758.767.758.423 0 .766-.339.766-.758V4.07c0-1.143.937-2.07 2.093-2.07z" />
        </svg>
      );
    case "openrouter":
      return (
        <svg
          aria-hidden="true"
          style={s}
          viewBox="0 0 24 24"
          fill="currentColor"
          fillRule="evenodd"
        >
          <path d="M16.804 1.957l7.22 4.105v.087L16.73 10.21l.017-2.117-.821-.03c-1.059-.028-1.611.002-2.268.11-1.064.175-2.038.577-3.147 1.352L8.345 11.03c-.284.195-.495.336-.68.455l-.515.322-.397.234.385.23.53.338c.476.314 1.17.796 2.701 1.866 1.11.775 2.083 1.177 3.147 1.352l.3.045c.694.091 1.375.094 2.825.033l.022-2.159 7.22 4.105v.087L16.589 22l.014-1.862-.635.022c-1.386.042-2.137.002-3.138-.162-1.694-.28-3.26-.926-4.881-2.059l-2.158-1.5a21.997 21.997 0 00-.755-.498l-.467-.28a55.927 55.927 0 00-.76-.43C2.908 14.73.563 14.116 0 14.116V9.888l.14.004c.564-.007 2.91-.622 3.809-1.124l1.016-.58.438-.274c.428-.28 1.072-.726 2.686-1.853 1.621-1.133 3.186-1.78 4.881-2.059 1.152-.19 1.974-.213 3.814-.138l.02-1.907z" />
        </svg>
      );
    case "siliconflow":
      return (
        <svg
          aria-hidden="true"
          style={s}
          viewBox="0 0 24 24"
          fill="currentColor"
          fillRule="evenodd"
        >
          <path
            clipRule="evenodd"
            d="M22.956 6.521H12.522c-.577 0-1.044.468-1.044 1.044v3.13c0 .577-.466 1.044-1.043 1.044H1.044c-.577 0-1.044.467-1.044 1.044v4.174C0 17.533.467 18 1.044 18h10.434c.577 0 1.044-.467 1.044-1.043v-3.13c0-.578.466-1.044 1.043-1.044h9.391c.577 0 1.044-.467 1.044-1.044V7.565c0-.576-.467-1.044-1.044-1.044z"
          />
        </svg>
      );
    case "ppio":
      return (
        <svg
          aria-hidden="true"
          style={s}
          viewBox="0 0 24 24"
          fill="currentColor"
          fillRule="evenodd"
        >
          <path
            clipRule="evenodd"
            d="M12.002 0C5.377 0 0 5.37 0 11.994c0 3.266 1.309 6.232 3.43 8.395v-8.383c0-2.288.893-4.447 2.51-6.063a8.513 8.513 0 016.066-2.509h.07l-.074.008c4.735 0 8.575 3.84 8.575 8.571 0 .413-.03.818-.087 1.219l-4.844-4.86A5.12 5.12 0 0012.01 6.87a5.126 5.126 0 00-3.637 1.503 5.107 5.107 0 00-1.507 3.641c0 1.376.536 2.666 1.507 3.64a5.12 5.12 0 003.637 1.504 5.126 5.126 0 003.637-1.503 5.114 5.114 0 001.496-3.348l2.842 2.853c-1.256 3.18-4.353 5.433-7.978 5.433-1.879 0-3.671-.6-5.145-1.714v3.967c1.56.742 3.3 1.155 5.137 1.155C18.623 24 24 18.63 24 12.006 24.008 5.373 18.635.004 12.006.004L12.002 0z"
          />
        </svg>
      );
    case "xiaoxiang":
      return (
        <svg aria-hidden="true" style={s} viewBox="0 0 24 24" fill="currentColor">
          <rect width="24" height="24" rx="4" fill="#10B981" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="#fff"
            fontSize="9"
            fontWeight="bold"
            fontFamily="system-ui"
          >
            XM
          </text>
        </svg>
      );
    default:
      return (
        <span
          className="flex items-center justify-center rounded text-[9px] font-bold bg-surface-3 text-text-muted"
          style={s}
        >
          {(provider[0] ?? "?").toUpperCase()}
        </span>
      );
  }
}

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

/* ------------------------------------------------------------------ */
/*  Schedule Panel — single nexu agent, timed automations (OPC)          */
/* ------------------------------------------------------------------ */

interface ScheduleTask {
  id: string;
  name: string;
  time: string;
  timeSlot: "morning" | "afternoon" | "evening" | "night";
  cron: string;
  status: "completed" | "running" | "upcoming" | "idle";
  result?: string;
  icon: React.ElementType;
  channel: string;
}

const SCHEDULE_ICON_COLOR = "var(--color-brand-primary)";

const TODAY_SCHEDULE: ScheduleTask[] = [
  {
    id: "s1",
    name: "Morning Briefing",
    time: "08:30",
    timeSlot: "morning",
    cron: "Daily 08:30",
    status: "completed",
    result: "3 meetings · 5 todos · 1 urgent",
    icon: FileText,
    channel: "Feishu",
  },
  {
    id: "s2",
    name: "Social Media Sweep",
    time: "09:00",
    timeSlot: "morning",
    cron: "Daily 09:00",
    status: "completed",
    result: "Scanned 2,340 posts · engaged 8 · found 2 leads",
    icon: TrendingUp,
    channel: "Slack",
  },
  {
    id: "s3",
    name: "TODO Check #1",
    time: "10:00",
    timeSlot: "morning",
    cron: "Daily 10:00 / 15:00",
    status: "completed",
    result: "Reminded 3 items · 1 overdue",
    icon: Bell,
    channel: "Feishu",
  },
  {
    id: "s4",
    name: "Action Item Tracker",
    time: "10:00",
    timeSlot: "morning",
    cron: "Daily 10:00 / 15:00 / 20:00",
    status: "completed",
    result: "Checked 7 items · 3 done · tracking 4",
    icon: CheckCircle,
    channel: "Feishu",
  },
  {
    id: "s5",
    name: "Email Digest",
    time: "12:00",
    timeSlot: "afternoon",
    cron: "Every 30min (work hours)",
    status: "completed",
    result: "Filtered 23 emails · 4 worth reading",
    icon: Mail,
    channel: "Feishu",
  },
  {
    id: "s6",
    name: "Competitor Monitor",
    time: "14:00",
    timeSlot: "afternoon",
    cron: "Daily 14:00",
    status: "running",
    result: "Scanning product updates…",
    icon: Search,
    channel: "Slack",
  },
  {
    id: "s7",
    name: "TODO Check #2",
    time: "15:00",
    timeSlot: "afternoon",
    cron: "Daily 10:00 / 15:00",
    status: "upcoming",
    icon: Bell,
    channel: "Feishu",
  },
  {
    id: "s8",
    name: "Growth Metrics Report",
    time: "17:00",
    timeSlot: "evening",
    cron: "Daily 17:00",
    status: "upcoming",
    icon: BarChart3,
    channel: "Feishu",
  },
  {
    id: "s9",
    name: "Action Item Tracker #3",
    time: "20:00",
    timeSlot: "evening",
    cron: "Daily 10:00 / 15:00 / 20:00",
    status: "upcoming",
    icon: CheckCircle,
    channel: "Feishu",
  },
  {
    id: "s10",
    name: "Daily Debrief",
    time: "22:00",
    timeSlot: "night",
    cron: "Daily 22:00",
    status: "upcoming",
    icon: Brain,
    channel: "Feishu",
  },
  {
    id: "s11",
    name: "Security Audit",
    time: "03:00",
    timeSlot: "night",
    cron: "Daily 03:00",
    status: "upcoming",
    icon: Shield,
    channel: "Feishu",
  },
];

const WEEKLY_TASKS: { name: string; day: string; time: string; icon: React.ElementType }[] = [
  { name: "Contact Health Scan", day: "Mon", time: "09:00", icon: Users },
  { name: "Competitor Weekly Brief", day: "Wed", time: "14:00", icon: Search },
  { name: "Sprint Review", day: "Fri", time: "17:00", icon: FileText },
  { name: "Memory Consolidation", day: "Sun", time: "20:00", icon: Database },
];

type SkillTagFilter = "all" | ToolTag;
type SkillTopTab = "explore" | "yours";

function SkillsPanel() {
  const [query, setQuery] = useState("");
  const [topTab, setTopTab] = useState<SkillTopTab>("yours");
  const [tagFilter, setTagFilter] = useState<SkillTagFilter>("all");

  const allSkills = SKILL_CATEGORIES.flatMap((cat) =>
    cat.skills.map((skill) => ({ skill, category: cat })),
  );
  const yourSkills = allSkills.filter((s) => s.skill.source === "custom");
  const exploreSkills = allSkills.filter((s) => s.skill.source === "official");

  const base = topTab === "yours" ? yourSkills : exploreSkills;
  let filtered = base;
  if (topTab === "explore" && tagFilter !== "all") {
    filtered = filtered.filter((item) => item.skill.tag === tagFilter);
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.skill.name.toLowerCase().includes(q) || item.skill.desc.toLowerCase().includes(q),
    );
  }

  const tagTabs: { id: SkillTagFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: exploreSkills.length },
    ...Object.entries(TOOL_TAG_LABELS).map(([id, label]) => ({
      id: id as SkillTagFilter,
      label,
      count: exploreSkills.filter((s) => s.skill.tag === id).length,
    })),
  ];

  const { t } = useLocale();

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="heading-page">{t("ws.skills.title")}</h2>
            <p className="heading-page-desc">{t("ws.skills.subtitle")}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <ToggleGroup
            type="single"
            value={topTab}
            onValueChange={(value: string) => {
              if (!value) return;
              setTopTab(value as SkillTopTab);
              setTagFilter("all");
            }}
            variant="default"
            aria-label="Skills source"
          >
            {[
              { id: "yours" as SkillTopTab, label: "Yours", icon: Settings2 },
              { id: "explore" as SkillTopTab, label: "Explore", icon: Compass },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <ToggleGroupItem key={tab.id} value={tab.id} className="gap-1.5 text-[13px]">
                  <TabIcon size={14} />
                  {tab.label}
                  {tab.id === "yours" && yourSkills.length > 0 && (
                    <span className="tabular-nums text-[11px] text-text-tertiary data-[state=on]:text-text-secondary">
                      {yourSkills.length}
                    </span>
                  )}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>

          <div className="ml-auto relative" style={{ width: 220 }}>
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--color-text-placeholder)" }}
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills..."
              className="pl-9 h-9 text-[12px]"
            />
          </div>
        </div>

        {topTab === "explore" && (
          <div className="mb-5 overflow-x-auto pb-0.5">
            <ToggleGroup
              type="single"
              value={tagFilter}
              onValueChange={(value: string) => {
                if (value) setTagFilter(value as SkillTagFilter);
              }}
              variant="underline"
              aria-label="Skill categories"
              className="min-w-max"
            >
              {tagTabs.map((tab) => (
                <ToggleGroupItem
                  key={tab.id}
                  value={tab.id}
                  variant="underline"
                  className="shrink-0 text-[13px]"
                >
                  {tab.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}

        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        >
          {filtered.map(({ skill, category }) => {
            const Icon = skill.icon;
            const isCustom = skill.source === "custom";

            return (
              <div
                key={skill.id}
                className="p-4 rounded-lg transition-shadow hover:shadow-[var(--shadow-card)]"
                style={{
                  background: "var(--color-surface-1)",
                  border: "1px solid var(--color-border-card)",
                  cursor: isCustom ? "default" : "pointer",
                }}
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div
                    className="flex items-center justify-center shrink-0 border border-border bg-white"
                    style={{ width: 40, height: 40, borderRadius: 8 }}
                  >
                    {skill.logo ? (
                      <img src={skill.logo} alt="" className="w-[18px] h-[18px] object-contain" />
                    ) : (
                      <Icon size={18} style={{ color: "var(--color-text-secondary)" }} />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                        lineHeight: 1.3,
                      }}
                    >
                      {skill.name}
                    </span>
                    {isCustom && (
                      <Badge variant="default" className="text-[10px] px-[5px] py-[1px]">
                        Custom
                      </Badge>
                    )}
                  </div>
                </div>
                <p
                  className="line-clamp-2 mb-3"
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: "var(--color-text-secondary)",
                    margin: 0,
                    marginBottom: 12,
                  }}
                >
                  {skill.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="tag">{category.label}</span>
                  {!isCustom && (
                    <span
                      className="inline-flex items-center gap-1"
                      style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)" }}
                    >
                      View details <ArrowRight size={12} />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div
            className="text-center py-16"
            style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}
          >
            No matching skills found
          </div>
        )}
      </div>
    </div>
  );
}

function SchedulePanel() {
  const { t } = useLocale();
  const [tab, setTab] = useState<"today" | "week">("today");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const currentHour = 14;
  const completedCount = TODAY_SCHEDULE.filter((tk) => tk.status === "completed").length;
  const runningCount = TODAY_SCHEDULE.filter((tk) => tk.status === "running").length;
  const upcomingCount = TODAY_SCHEDULE.filter((tk) => tk.status === "upcoming").length;

  const timeSlots: { key: ScheduleTask["timeSlot"]; labelKey: string; range: string }[] = [
    { key: "morning", labelKey: "ws.schedule.morning", range: "06:00 – 12:00" },
    { key: "afternoon", labelKey: "ws.schedule.afternoon", range: "12:00 – 17:00" },
    { key: "evening", labelKey: "ws.schedule.evening", range: "17:00 – 22:00" },
    { key: "night", labelKey: "ws.schedule.night", range: "22:00 – 06:00" },
  ];

  const statusDot = (status: ScheduleTask["status"]) => {
    switch (status) {
      case "completed":
        return "bg-[var(--color-success)]";
      case "running":
        return "bg-[var(--color-warning)] animate-pulse";
      case "upcoming":
        return "bg-[var(--color-text-muted)]";
      default:
        return "bg-[var(--color-text-placeholder)]";
    }
  };

  const statusLabel = (status: ScheduleTask["status"]) => {
    switch (status) {
      case "completed":
        return t("ws.schedule.completed");
      case "running":
        return t("ws.schedule.running");
      case "upcoming":
        return t("ws.schedule.upcoming");
      default:
        return t("ws.schedule.idle");
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="heading-page">{t("ws.schedule.title")}</h1>
            <p className="heading-page-desc">{t("ws.schedule.subtitle")}</p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-[8px] px-[14px] py-[5px] text-[12px] font-medium border border-border text-text-primary hover:bg-surface-2 transition-colors">
            <Plus size={14} />
            {t("ws.schedule.addTask")}
          </button>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
            <span className="text-[12px] text-text-secondary">
              {completedCount} {t("ws.schedule.completed")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--color-warning)] animate-pulse" />
            <span className="text-[12px] text-text-secondary">
              {runningCount} {t("ws.schedule.running")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-text-muted" />
            <span className="text-[12px] text-text-secondary">
              {upcomingCount} {t("ws.schedule.upcoming")}
            </span>
          </div>
          <span className="text-[11px] text-text-tertiary ml-auto">
            {t("ws.schedule.taskSummary").replace("{{tasks}}", String(TODAY_SCHEDULE.length))}
          </span>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-surface-2 mb-5">
          {[
            { id: "today" as const, label: t("ws.schedule.today") },
            { id: "week" as const, label: t("ws.schedule.thisWeek") },
          ].map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                  active
                    ? "bg-surface-1 text-text-primary shadow-[var(--shadow-rest)]"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Today view — timeline grouped by time slot */}
        {tab === "today" && (
          <div className="space-y-6">
            {timeSlots.map((slot) => {
              const tasks = TODAY_SCHEDULE.filter((tk) => tk.timeSlot === slot.key);
              if (tasks.length === 0) return null;
              const isCurrentSlot =
                (slot.key === "morning" && currentHour >= 6 && currentHour < 12) ||
                (slot.key === "afternoon" && currentHour >= 12 && currentHour < 17) ||
                (slot.key === "evening" && currentHour >= 17 && currentHour < 22) ||
                (slot.key === "night" && (currentHour >= 22 || currentHour < 6));

              return (
                <div key={slot.key}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[13px] font-semibold ${isCurrentSlot ? "text-text-primary" : "text-text-tertiary"}`}
                      >
                        {t(slot.labelKey)}
                      </span>
                      <span className="text-[11px] text-text-placeholder">{slot.range}</span>
                    </div>
                    {isCurrentSlot && (
                      <span className="text-[10px] leading-none font-medium px-2 py-1 rounded-full bg-[var(--color-brand-primary)] text-white">
                        {t("ws.schedule.now")}
                      </span>
                    )}
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div className="space-y-2 pl-1">
                    {tasks.map((task) => {
                      const Icon = task.icon;
                      const expanded = expandedId === task.id;
                      return (
                        <div key={task.id}>
                          <button
                            onClick={() => setExpandedId(expanded ? null : task.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] border transition-all text-left group ${
                              task.status === "running"
                                ? "border-[var(--color-warning)]/30 bg-[var(--color-warning)]/[0.04]"
                                : "border-border hover:border-border-hover bg-surface-0"
                            }`}
                          >
                            <span className="text-[12px] tabular-nums text-text-tertiary w-10 shrink-0 font-mono">
                              {task.time}
                            </span>
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${statusDot(task.status)}`}
                            />
                            <span className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 border border-border bg-surface-1">
                              <Icon size={14} style={{ color: SCHEDULE_ICON_COLOR }} />
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] font-medium text-text-primary truncate">
                                  {task.name}
                                </span>
                                <span className="text-[10px] leading-none font-medium px-1.5 py-0.5 rounded-full border border-border text-text-muted shrink-0">
                                  {task.channel}
                                </span>
                              </div>
                              {task.result && (
                                <p className="text-[11px] text-text-tertiary mt-0.5 truncate">
                                  {task.result}
                                </p>
                              )}
                            </div>
                            <span
                              className={`text-[11px] shrink-0 ${
                                task.status === "completed"
                                  ? "text-[var(--color-success)]"
                                  : task.status === "running"
                                    ? "text-[var(--color-warning)]"
                                    : "text-text-muted"
                              }`}
                            >
                              {statusLabel(task.status)}
                            </span>
                          </button>

                          {expanded && (
                            <div className="ml-14 mt-1 px-4 py-3 rounded-[8px] bg-surface-2 border border-border text-[12px] text-text-secondary space-y-1.5">
                              <div className="flex items-center gap-2">
                                <Clock size={12} className="text-text-muted" />
                                <span>
                                  {t("ws.schedule.recurring")}: {task.cron}
                                </span>
                              </div>
                              {task.result && (
                                <div className="flex items-center gap-2">
                                  <CheckCircle size={12} className="text-[var(--color-success)]" />
                                  <span>{task.result}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Week view */}
        {tab === "week" && (
          <div className="space-y-2">
            <p className="text-[12px] text-text-tertiary mb-3">{t("ws.schedule.weekIntro")}</p>
            {WEEKLY_TASKS.map((task, i) => {
              const Icon = task.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-[10px] border border-border bg-surface-0 hover:border-border-hover transition-colors"
                >
                  <span className="text-[12px] tabular-nums text-text-tertiary w-8 shrink-0 font-mono font-medium">
                    {task.day}
                  </span>
                  <span className="text-[12px] tabular-nums text-text-tertiary w-10 shrink-0 font-mono">
                    {task.time}
                  </span>
                  <span className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 border border-border bg-surface-1">
                    <Icon size={14} style={{ color: SCHEDULE_ICON_COLOR }} />
                  </span>
                  <span className="text-[13px] font-medium text-text-primary flex-1 truncate">
                    {task.name}
                  </span>
                </div>
              );
            })}

            <div className="mt-6 card px-4 py-3">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[13px] font-semibold text-text-primary">
                  {t("ws.schedule.dailyOverview")}
                </span>
                <div className="flex-1 h-px bg-border" />
                <span className="text-[11px] text-text-tertiary tabular-nums">
                  {TODAY_SCHEDULE.length}
                </span>
              </div>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                {t("ws.schedule.singleAgentNote")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
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
function FeishuIconSetup({ size = 20, light }: { size?: number; light?: boolean }) {
  return (
    <img
      src="/feishu-logo.png"
      width={size}
      height={size}
      alt="Feishu"
      style={{ objectFit: "contain", ...(light ? { filter: "brightness(0) invert(1)" } : {}) }}
    />
  );
}
function SlackIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
        fill="#E01E5A"
      />
      <path
        d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
        fill="#36C5F0"
      />
      <path
        d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.163 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
        fill="#2EB67D"
      />
      <path
        d="M15.163 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.163 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.315A2.528 2.528 0 0 1 24 15.163a2.528 2.528 0 0 1-2.522 2.523h-6.315z"
        fill="#ECB22E"
      />
    </svg>
  );
}
function DiscordIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#5865F2">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
function TelegramIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 32 32" fill="#26A5E4">
      <path d="m29.919 6.163l-4.225 19.925c-.319 1.406-1.15 1.756-2.331 1.094l-6.438-4.744l-3.106 2.988c-.344.344-.631.631-1.294.631l.463-6.556L24.919 8.72c.519-.462-.113-.719-.806-.256l-14.75 9.288l-6.35-1.988c-1.381-.431-1.406-1.381.288-2.044l24.837-9.569c1.15-.431 2.156.256 1.781 2.013z" />
    </svg>
  );
}
function WhatsAppIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
function WeChatIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#07C160">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z" />
    </svg>
  );
}
function DingTalkIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="140 50 730 920" fill="#0089FF">
      <path d="M573.7 252.5C422.5 197.4 201.3 96.7 201.3 96.7c-15.7-4.1-17.9 11.1-17.9 11.1c-5 61.1 33.6 160.5 53.6 182.8c19.9 22.3 319.1 113.7 319.1 113.7S326 357.9 270.5 341.9c-55.6-16-37.9 17.8-37.9 17.8c11.4 61.7 64.9 131.8 107.2 138.4c42.2 6.6 220.1 4 220.1 4s-35.5 4.1-93.2 11.9c-42.7 5.8-97 12.5-111.1 17.8c-33.1 12.5 24 62.6 24 62.6c84.7 76.8 129.7 50.5 129.7 50.5c33.3-10.7 61.4-18.5 85.2-24.2L565 743.1h84.6L603 928l205.3-271.9H700.8l22.3-38.7c.3.5.4.8.4.8S799.8 496.1 829 433.8l.6-1h-.1c5-10.8 8.6-19.7 10-25.8c17-71.3-114.5-99.4-265.8-154.5" />
    </svg>
  );
}
function QQBotIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="150 70 720 860" fill="#12B7F5">
      <path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112C331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3c-34 109.5-23 154.8-14.6 155.8c18 2.2 70.1-82.4 70.1-82.4c0 49 25.2 112.9 79.8 159c-26.4 8.1-85.7 29.9-71.6 53.8c11.4 19.3 196.2 12.3 249.5 6.3c53.3 6 238.1 13 249.5-6.3c14.1-23.8-45.3-45.7-71.6-53.8c54.6-46.2 79.8-110.1 79.8-159c0 0 52.1 84.6 70.1 82.4c8.5-1.1 19.5-46.4-14.5-155.8" />
    </svg>
  );
}
function WeComIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="-0.5 1.5 25 21" fill="#2B7CE9">
      <path d="m17.326 8.158l-.003-.007a6.6 6.6 0 0 0-1.178-1.674c-1.266-1.307-3.067-2.19-5.102-2.417a9.3 9.3 0 0 0-2.124 0h-.001c-2.061.228-3.882 1.107-5.14 2.405a6.7 6.7 0 0 0-1.194 1.682A5.7 5.7 0 0 0 2 10.657c0 1.106.332 2.218.988 3.201l.006.01c.391.594 1.092 1.39 1.637 1.83l.983.793l-.208.875l.527-.267l.708-.358l.761.225c.467.137.955.227 1.517.29h.005q.515.06 1.026.059c.355 0 .724-.02 1.095-.06a9 9 0 0 0 1.346-.258c.095.7.43 1.337.932 1.81c-.658.208-1.352.358-2.061.436c-.442.048-.883.072-1.312.072q-.627 0-1.253-.072a10.7 10.7 0 0 1-1.861-.36l-2.84 1.438s-.29.131-.44.131c-.418 0-.702-.285-.702-.704c0-.252.067-.598.128-.84l.394-1.653c-.728-.586-1.563-1.544-2.052-2.287A7.76 7.76 0 0 1 0 10.658a7.7 7.7 0 0 1 .787-3.39a8.7 8.7 0 0 1 1.551-2.19c1.61-1.665 3.878-2.73 6.359-3.006a11.3 11.3 0 0 1 2.565 0c2.47.275 4.712 1.353 6.323 3.017a8.6 8.6 0 0 1 1.539 2.192c.466.945.769 1.937.769 2.978a3.06 3.06 0 0 0-2-.005c-.001-.644-.189-1.329-.564-2.09zm4.125 6.977l-.024-.024l-.024-.018l-.024-.018l-.096-.095a4.24 4.24 0 0 1-1.169-2.192q0-.038-.006-.075l-.006-.056l-.035-.144a1.3 1.3 0 0 0-.358-.61a1.386 1.386 0 0 0-1.957 0a1.4 1.4 0 0 0 0 1.963c.191.191.418.311.668.371c.024.012.06.012.084.012q.019 0 .041.006q.023.005.042.006a4.24 4.24 0 0 1 2.231 1.186c.048.048.096.095.131.143a.323.323 0 0 0 .466 0a.35.35 0 0 0 .036-.455m-1.05 4.37l-.025.025c-.119.096-.31.096-.453-.036a.326.326 0 0 1 0-.467c.047-.036.094-.083.141-.13l.002-.002a4.27 4.27 0 0 0 1.187-2.28q.005-.024.006-.043c0-.024 0-.06.012-.084a1.386 1.386 0 0 1 2.326-.67a1.4 1.4 0 0 1 0 1.964c-.167.18-.382.299-.608.359l-.143.036l-.057.005q-.035.006-.075.007a4.2 4.2 0 0 0-2.183 1.173l-.095.096q-.009.01-.018.024t-.018.024m-4.392-1.053l.024.024l.024.018q.015.009.024.018l.096.096a4.25 4.25 0 0 1 1.169 2.19q0 .04.006.076q.005.03.006.057l.035.143c.06.228.18.443.358.611c.537.539 1.42.539 1.957 0a1.4 1.4 0 0 0 0-1.964a1.4 1.4 0 0 0-.668-.371c-.024-.012-.06-.012-.084-.012q-.018 0-.041-.006l-.042-.006a4.25 4.25 0 0 1-2.231-1.185a1.4 1.4 0 0 1-.131-.144a.323.323 0 0 0-.466 0a.325.325 0 0 0-.036.455m1.039-4.358l.024-.024a.32.32 0 0 1 .453.035a.326.326 0 0 1 0 .467c-.047.036-.094.083-.141.13l-.002.002a4.27 4.27 0 0 0-1.187 2.281l-.006.042c0 .024 0 .06-.012.084a1.386 1.386 0 0 1-2.326.67a1.4 1.4 0 0 1 0-1.963c.166-.18.381-.3.608-.36l.143-.035q.026 0 .056-.006q.037-.005.075-.006a4.2 4.2 0 0 0 2.183-1.174l.096-.095l.018-.025z" />
    </svg>
  );
}

const ONBOARDING_CHANNELS = [
  {
    id: "feishu",
    name: "Feishu",
    shortName: "Feishu",
    icon: FeishuIconSetup,
    color: "#FFFFFF",
    recommended: true,
    docUrl: "https://docs.nexu.ai/channels/feishu",
    chatUrl: "https://www.feishu.cn/",
  },
  {
    id: "slack",
    name: "Slack",
    shortName: "Slack",
    icon: SlackIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/slack",
    chatUrl: "https://slack.com/",
  },
  {
    id: "discord",
    name: "Discord",
    shortName: "Discord",
    icon: DiscordIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/discord",
    chatUrl: "https://discord.com/",
  },
  {
    id: "telegram",
    name: "Telegram",
    shortName: "Telegram",
    icon: TelegramIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/telegram",
    chatUrl: "https://telegram.org/",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    shortName: "WhatsApp",
    icon: WhatsAppIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/whatsapp",
    chatUrl: "https://web.whatsapp.com/",
  },
  {
    id: "wechat",
    name: "WeChat",
    shortName: "WeChat",
    icon: WeChatIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/wechat",
    chatUrl: "https://web.wechat.com/",
  },
  {
    id: "dingtalk",
    name: "DingTalk",
    shortName: "DingTalk",
    icon: DingTalkIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/dingtalk",
    chatUrl: "https://www.dingtalk.com/",
  },
  {
    id: "qqbot",
    name: "QQ Bot",
    shortName: "QQ Bot",
    icon: QQBotIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/qqbot",
    chatUrl: "https://bot.q.qq.com/",
  },
  {
    id: "wecom",
    name: "WeCom",
    shortName: "WeCom",
    icon: WeComIconSetup,
    color: "#FFFFFF",
    docUrl: "https://docs.nexu.ai/channels/wecom",
    chatUrl: "https://work.weixin.qq.com/",
  },
];

const CHANNELS_CONNECTED_KEY = "nexu_channels_connected";
const CHANNEL_ACTIVE_KEY = "nexu_channel_active";
const SEEDANCE_BANNER_DISMISSED_KEY = "nexu_seedance_banner_dismissed";

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
  telegram: [
    {
      id: "botToken",
      label: "Bot Token",
      placeholder: "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
      helpText: "Obtain from @BotFather on Telegram",
    },
  ],
  whatsapp: [
    {
      id: "phoneNumberId",
      label: "Phone Number ID",
      placeholder: "000000000000000",
      helpText: "Found in Meta Business Suite > WhatsApp > API Setup",
    },
    {
      id: "accessToken",
      label: "Access Token",
      placeholder: "EAAxxxxxxxxxxxxxxxx",
      helpText: "Found in Meta Business Suite > WhatsApp > API Setup",
    },
  ],
  wechat: [
    {
      id: "appId",
      label: "App ID",
      placeholder: "wx0000000000000000",
      helpText: "Found in WeChat Official Accounts Platform > Basic Configuration",
    },
    {
      id: "appSecret",
      label: "App Secret",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      helpText: "Found in WeChat Official Accounts Platform > Basic Configuration",
    },
  ],
  dingtalk: [
    {
      id: "appKey",
      label: "App Key",
      placeholder: "dingxxxxxxxxxxxxxxxxxx",
      helpText: "Found in DingTalk Open Platform > App Credentials",
    },
    {
      id: "appSecret",
      label: "App Secret",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      helpText: "Found in DingTalk Open Platform > App Credentials",
    },
  ],
  qqbot: [
    {
      id: "appId",
      label: "App ID",
      placeholder: "000000000",
      helpText: "Found in QQ Bot Open Platform > App Management",
    },
    {
      id: "appSecret",
      label: "App Secret",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      helpText: "Found in QQ Bot Open Platform > App Management",
    },
  ],
  wecom: [
    {
      id: "corpId",
      label: "Corp ID",
      placeholder: "ww0000000000000000",
      helpText: "Found in WeCom Admin Console > My Enterprise > Enterprise Info",
    },
    {
      id: "agentSecret",
      label: "Agent Secret",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      helpText: "Found in WeCom Admin Console > App Management > App Secret",
    },
  ],
};

type RewardType = string | null;

function CreditIcon({ size = 12, className }: { size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      className={className}
    >
      <path
        d="M5.6 0C5.8427 0 6.05776 0.156339 6.13266 0.387188C6.85244 2.60692 8.59308 4.34756 10.8128 5.06734C11.0437 5.14224 11.2 5.3573 11.2 5.6C11.2 5.8427 11.0437 6.05776 10.8128 6.13266C8.59308 6.85244 6.85244 8.59308 6.13266 10.8128C6.05776 11.0437 5.8427 11.2 5.6 11.2C5.3573 11.2 5.14224 11.0437 5.06734 10.8128C4.34756 8.59308 2.60692 6.85244 0.387188 6.13266C0.156339 6.05776 0 5.8427 0 5.6C0 5.3573 0.156339 5.14224 0.387188 5.06734C2.60692 4.34756 4.34756 2.60692 5.06734 0.387188L5.1018 0.304063C5.19649 0.119587 5.3877 0 5.6 0ZM5.6 2.00539C4.80209 3.54566 3.54566 4.80209 2.00539 5.6C3.54552 6.39784 4.80208 7.65399 5.6 9.19406C6.39785 7.65414 7.65414 6.39785 9.19406 5.6C7.65399 4.80208 6.39784 3.54552 5.6 2.00539Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChannelIcon({
  icon,
  size = 16,
  accent,
}: {
  icon: string;
  size?: number;
  /** `brand`: calendar / daily-check-in style (stroke uses brand primary). */
  accent?: "default" | "brand";
}) {
  switch (icon) {
    case "github":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#181717">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      );
    case "x":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#000000">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "reddit":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#FF4500">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 0-.463.327.327 0 0 0-.462 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.231-.094z" />
        </svg>
      );
    case "xiaohongshu":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#FF2442">
          <path d="M22.405 9.879c.002.016.01.02.07.019h.725a.797.797 0 0 0 .78-.972a.794.794 0 0 0-.884-.618a.795.795 0 0 0-.692.794c0 .101-.002.666.001.777m-11.509 4.808c-.203.001-1.353.004-1.685.003a2.5 2.5 0 0 1-.766-.126a.025.025 0 0 0-.03.014L7.7 16.127a.025.025 0 0 0 .01.032c.111.06.336.124.495.124c.66.01 1.32.002 1.981 0q.017 0 .023-.015l.712-1.545a.025.025 0 0 0-.024-.036zM.477 9.91c-.071 0-.076.002-.076.01l-.01.08c-.027.397-.038.495-.234 3.06c-.012.24-.034.389-.135.607c-.026.057-.033.042.003.112c.046.092.681 1.523.787 1.74c.008.015.011.02.017.02c.008 0 .033-.026.047-.044q.219-.282.371-.606c.306-.635.44-1.325.486-1.706c.014-.11.021-.22.03-.33l.204-2.616l.022-.293c.003-.029 0-.033-.03-.034zm7.203 3.757a1.4 1.4 0 0 1-.135-.607c-.004-.084-.031-.39-.235-3.06a.4.4 0 0 0-.01-.082c-.004-.011-.052-.008-.076-.008h-1.48c-.03.001-.034.005-.03.034l.021.293q.114 1.473.233 2.946c.05.4.186 1.085.487 1.706c.103.215.223.419.37.606c.015.018.037.051.048.049c.02-.003.742-1.642.804-1.765c.036-.07.03-.055.003-.112m3.861-.913h-.872a.126.126 0 0 1-.116-.178l1.178-2.625a.025.025 0 0 0-.023-.035l-1.318-.003a.148.148 0 0 1-.135-.21l.876-1.954a.025.025 0 0 0-.023-.035h-1.56q-.017 0-.024.015l-.926 2.068c-.085.169-.314.634-.399.938a.5.5 0 0 0-.02.191a.46.46 0 0 0 .23.378a1 1 0 0 0 .46.119h.59c.041 0-.688 1.482-.834 1.972a.5.5 0 0 0-.023.172a.47.47 0 0 0 .23.398c.15.092.342.12.475.12l1.66-.001q.017 0 .023-.015l.575-1.28a.025.025 0 0 0-.024-.035m-6.93-4.937H3.1a.032.032 0 0 0-.034.033c0 1.048-.01 2.795-.01 6.829c0 .288-.269.262-.28.262h-.74c-.04.001-.044.004-.04.047c.001.037.465 1.064.555 1.263c.01.02.03.033.051.033c.157.003.767.009.938-.014c.153-.02.3-.06.438-.132c.3-.156.49-.419.595-.765c.052-.172.075-.353.075-.533q.003-3.495-.007-6.991a.03.03 0 0 0-.032-.032zm11.784 6.896q-.002-.02-.024-.022h-1.465c-.048-.001-.049-.002-.05-.049v-4.66c0-.072-.005-.07.07-.07h.863c.08 0 .075.004.075-.074V8.393c0-.082.006-.076-.08-.076h-3.5c-.064 0-.075-.006-.075.073v1.445c0 .083-.006.077.08.077h.854c.075 0 .07-.004.07.07v4.624c0 .095.008.084-.085.084c-.37 0-1.11-.002-1.304 0c-.048.001-.06.03-.06.03l-.697 1.519s-.014.025-.008.036s.013.008.058.008q2.622.003 5.243.002c.03-.001.034-.006.035-.033zm4.177-3.43q0 .021-.02.024c-.346.006-.692.004-1.037.004q-.021-.003-.022-.024q-.006-.651-.01-1.303c0-.072-.006-.071.07-.07l.733-.003c.041 0 .081.002.12.015c.093.025.16.107.165.204c.006.431.002 1.153.001 1.153m2.67.244a1.95 1.95 0 0 0-.883-.222h-.18c-.04-.001-.04-.003-.042-.04V10.21q.001-.198-.025-.394a1.8 1.8 0 0 0-.153-.53a1.53 1.53 0 0 0-.677-.71a2.2 2.2 0 0 0-1-.258c-.153-.003-.567 0-.72 0c-.07 0-.068.004-.068-.065V7.76c0-.031-.01-.041-.046-.039H17.93s-.016 0-.023.007q-.008.008-.008.023v.546c-.008.036-.057.015-.082.022h-.95c-.022.002-.028.008-.03.032v1.481c0 .09-.004.082.082.082h.913c.082 0 .072.128.072.128v1.148s.003.117-.06.117h-1.482c-.068 0-.06.082-.06.082v1.445s-.01.068.064.068h1.457c.082 0 .076-.006.076.079v3.225c0 .088-.007.081.082.081h1.43c.09 0 .082.007.082-.08v-3.27c0-.029.006-.035.033-.035l2.323-.003a.7.7 0 0 1 .28.061a.46.46 0 0 1 .274.407c.008.395.003.79.003 1.185c0 .259-.107.367-.33.367h-1.218c-.023.002-.029.008-.028.033q.276.655.57 1.303a.05.05 0 0 0 .04.026c.17.005.34.002.51.003c.15-.002.517.004.666-.01a2 2 0 0 0 .408-.075c.59-.18.975-.698.976-1.313v-1.981q.001-.191-.034-.38c0 .078-.029-.641-.724-.998" />
        </svg>
      );
    case "lingying":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "jike":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 46 46" fill="none">
          <mask
            id="jk0"
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="2"
            y="2"
            width="43"
            height="43"
          >
            <path d="M2 2H44.09V44.09H2V2Z" fill="white" />
          </mask>
          <g mask="url(#jk0)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M34.63 44.09H11.46C8.951 44.09 6.545 43.093 4.771 41.319C2.997 39.545 2 37.139 2 34.63V11.46C2 8.951 2.997 6.545 4.771 4.771C6.545 2.997 8.951 2 11.46 2H34.63C37.139 2 39.545 2.997 41.319 4.771C43.093 6.545 44.09 8.951 44.09 11.46V34.63C44.09 37.139 43.093 39.545 41.319 41.319C39.545 43.093 37.139 44.09 34.63 44.09Z"
              fill="#FFE411"
            />
          </g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.423 36.39L15.328 32.012C15.298 31.97 15.277 31.923 15.266 31.873C15.255 31.823 15.253 31.771 15.262 31.721C15.271 31.67 15.29 31.622 15.317 31.578C15.344 31.535 15.38 31.498 15.422 31.468L17.468 30.022C19.585 28.525 20.849 26.449 20.849 23.492V10.161C20.849 10.058 20.89 9.958 20.963 9.885C21.036 9.812 21.136 9.771 21.239 9.771H26.701V23.491C26.701 28.874 25.201 31.561 20.788 34.718L18.423 36.39Z"
            fill="#FEFEFE"
          />
          <mask
            id="jk1"
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="18"
            y="9"
            width="11"
            height="29"
          >
            <path
              d="M26.54 9.773V23.263C26.54 28.647 25.04 31.333 20.626 34.49L18.26 36.16L19.386 37.753C19.416 37.795 19.453 37.831 19.496 37.858C19.54 37.886 19.588 37.904 19.639 37.913C19.689 37.922 19.741 37.92 19.791 37.909C19.841 37.898 19.888 37.877 19.93 37.847L21.987 36.393C24.604 34.52 26.244 32.799 27.302 30.811C28.393 28.765 28.879 26.436 28.879 23.261V10.163C28.879 10.06 28.838 9.96 28.765 9.887C28.692 9.814 28.592 9.773 28.489 9.773H26.54Z"
              fill="white"
            />
          </mask>
          <g mask="url(#jk1)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M26.54 9.773V23.263C26.54 28.647 25.04 31.333 20.626 34.49L18.26 36.16L19.386 37.753C19.416 37.795 19.453 37.831 19.496 37.858C19.54 37.886 19.588 37.904 19.639 37.913C19.689 37.922 19.741 37.92 19.791 37.909C19.841 37.898 19.888 37.877 19.93 37.847L21.987 36.393C24.604 34.52 26.244 32.799 27.302 30.811C28.393 28.765 28.879 26.436 28.879 23.261V10.163C28.879 10.06 28.838 9.96 28.765 9.887C28.692 9.814 28.592 9.773 28.489 9.773H26.54Z"
              fill="url(#jkGrad)"
            />
          </g>
          <defs>
            <linearGradient
              id="jkGrad"
              x1="23.57"
              y1="9.773"
              x2="23.57"
              y2="37.92"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#E9FFFF" />
              <stop offset="1" stopColor="#01B1E7" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "wechat":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#07C160">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z" />
        </svg>
      );
    case "feishu":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="7 7 26 26" fill="none">
          <path
            d="M21.069 20.504l.063-.06.125-.122.085-.084.256-.254.348-.344.299-.296.281-.278.293-.289.269-.266.374-.37.218-.206.419-.359.404-.306.598-.386.617-.33.606-.265.348-.127.177-.058a14.78 14.78 0 0 0-2.793-5.603c-.252-.318-.639-.502-1.047-.502H12.221c-.196 0-.277.249-.119.364a31.49 31.49 0 0 1 8.943 10.162c.008-.007.016-.015.025-.023z"
            fill="#00d6b9"
          />
          <path
            d="M16.791 30c5.57 0 10.423-3.074 12.955-7.618.089-.159.175-.321.258-.484a6.12 6.12 0 0 1-.425.699c-.055.078-.111.155-.17.23a6.29 6.29 0 0 1-.225.274c-.062.07-.123.138-.188.206a5.61 5.61 0 0 1-.407.384 5.53 5.53 0 0 1-.24.195 7.12 7.12 0 0 1-.292.21c-.063.043-.126.084-.191.122s-.134.081-.204.119c-.14.078-.282.149-.428.215a5.53 5.53 0 0 1-.385.157 5.81 5.81 0 0 1-.43.138 5.91 5.91 0 0 1-.661.143c-.162.025-.325.044-.491.055-.173.012-.348.016-.525.014-.193-.003-.388-.015-.585-.037-.144-.015-.289-.037-.433-.062-.126-.022-.252-.049-.38-.079l-.2-.051-.555-.155-.275-.081-.41-.125-.334-.107-.317-.104-.215-.073-.26-.091-.186-.066-.367-.134-.212-.081-.284-.11-.299-.119-.193-.079-.24-.1-.185-.078-.192-.084-.166-.073-.152-.067-.153-.07-.159-.073-.2-.093-.208-.099-.222-.108-.189-.093c-3.335-1.668-6.295-3.89-8.822-6.583-.126-.134-.349-.045-.349.138l.005 9.52v.773c0 .448.222.87.595 1.118C10.946 29.092 13.762 30 16.791 30z"
            fill="#3370ff"
          />
          <path
            d="M33.151 16.582c-1.129-.556-2.399-.869-3.744-.869a8.45 8.45 0 0 0-2.303.317l-.252.075-.177.058-.348.127-.606.265-.617.33-.598.386-.404.306-.419.359-.218.206-.374.37-.269.266-.293.289-.281.278-.299.296-.348.344-.256.254-.085.084-.125.122-.063.06-.095.09-.105.099c-.924.848-1.956 1.581-3.072 2.175l.2.093.159.073.153.07.152.067.166.073.192.084.185.078.24.1.193.079.299.119.284.11.212.081.367.134.186.066.26.09.215.073.317.104.334.107.41.125.275.081.555.155.2.051.379.079.433.062.585.037.525-.014.491-.055a5.61 5.61 0 0 0 .66-.143l.43-.138.385-.158.427-.215.204-.119.191-.122.292-.21.24-.195.407-.384.188-.206.225-.274.17-.23a6.13 6.13 0 0 0 .421-.693l.144-.288 1.305-2.599-.003.006a8.07 8.07 0 0 1 1.697-2.439z"
            fill="#133c9a"
          />
        </svg>
      );
    case "facebook":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "telegram":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#26A5E4">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.654 8.22-1.84 8.67c-.138.616-.5.768-.994.478l-2.78-2.048-1.34 1.29c-.148.148-.273.273-.56.273l.2-2.82 5.13-4.636c.224-.198-.048-.308-.348-.11l-6.34 3.99-2.73-.852c-.594-.186-.606-.594.124-.88l10.67-4.11c.494-.178.926.12.764.88z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      );
    case "calendar": {
      const useBrand = accent === "brand";
      return (
        <svg
          aria-hidden="true"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={useBrand ? "var(--color-brand-primary)" : "#F59E0B"}
          strokeWidth={useBrand ? 2.35 : 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
        </svg>
      );
    }
    default:
      return <Gift size={size} />;
  }
}

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
                <ExternalLink size={13} />
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
      return v ? new Set(JSON.parse(v)) : new Set();
    } catch {
      return new Set();
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
  }, [hasChannel]);

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

  /* ── Scene A: First-run — Top (Hero) + Middle (Channels) only ── */
  if (!hasChannel) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
          {/* ═══ TOP: Hero — Bot idle, waiting to be activated ═══ */}
          <div className="flex flex-col items-center text-center">
            <div
              className="relative w-32 h-32 mb-1 cursor-default"
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
                      key={ch.id}
                      onClick={() => handleOpenConfig(ch.id)}
                      className={`group relative rounded-xl border px-3 py-3 text-left transition-all cursor-pointer active:scale-[0.98] border-border bg-surface-0 hover:border-border-hover hover:bg-surface-1 ${
                        ch.recommended ? "animate-breathe" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-border bg-surface-1 shrink-0">
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
        </div>

        {/* Channel config modal */}
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
                  {/* Header */}
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
                  {/* Fields */}
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
                  {/* Footer */}
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
              <div className="relative" ref={modelDropdownRef}>
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-surface-0 hover:border-border-hover hover:bg-surface-1 transition-all text-[12px] text-text-primary"
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
                    <Cpu size={13} className="text-text-muted" />
                  )}
                  <span className="font-medium">
                    {selectedModel?.name ?? t("ws.home.notSelected")}
                  </span>
                  <ChevronDown
                    size={10}
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
                          <div className="flex items-center gap-2.5 rounded-lg bg-surface-0 border border-border px-3 py-1.5">
                            <Search size={12} className="text-text-muted shrink-0" />
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
                              className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted/50 outline-none"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="relative">
                          <div
                            className="max-h-[280px] overflow-y-auto py-1"
                            style={{ overscrollBehavior: "contain" }}
                          >
                            {filteredProviders.length === 0 ? (
                              <div className="px-4 py-6 text-center text-[12px] text-text-muted">
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
                                      className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-2/50 transition-colors"
                                    >
                                      <ChevronDown
                                        size={10}
                                        className={`text-text-muted/50 transition-transform ${isExpanded ? "" : "-rotate-90"}`}
                                      />
                                      <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                                        <ProviderLogo provider={provider.id} size={13} />
                                      </span>
                                      <span className="text-[11px] font-medium text-text-secondary">
                                        {provider.name}
                                      </span>
                                      <span className="text-[10px] text-text-muted/40 ml-auto tabular-nums">
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
                                          className={`w-full flex items-center gap-2 pl-8 pr-3 py-1.5 text-left transition-colors hover:bg-surface-2 ${model.id === selectedModelId ? "bg-accent/5" : ""}`}
                                        >
                                          {model.id === selectedModelId ? (
                                            <Check size={11} className="text-accent shrink-0" />
                                          ) : (
                                            <span className="w-[11px] shrink-0" />
                                          )}
                                          <span className="text-[12px] font-medium text-text-primary truncate flex-1">
                                            {model.name}
                                          </span>
                                          <span className="text-[10px] text-text-muted/50 tabular-nums shrink-0">
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
                        <div className="border-t border-border px-2 py-1.5">
                          <button
                            onClick={() => {
                              setShowModelDropdown(false);
                              onNavigate({ type: "settings" });
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors hover:bg-surface-2"
                          >
                            <Settings size={11} className="text-text-primary" />
                            <span className="text-[11px] font-medium text-text-primary">
                              {t("ws.home.configureProviders")}
                            </span>
                            <ArrowRight size={10} className="text-text-secondary ml-auto" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-text-muted ml-3">
                <span>{t("ws.home.messagesToday")}</span>
                <span className="text-border">·</span>
                <span>{t("ws.home.activeAgo")}</span>
              </div>
            </div>
          </div>
        </div>

        {seedanceBanner}

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
                          className="flex items-center gap-3 rounded-xl border border-border bg-surface-1 px-4 py-3 cursor-pointer transition-all hover:bg-surface-1"
                        >
                          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center border border-border bg-surface-1 shrink-0">
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-text-primary">
                              {ch.name}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] shrink-0" />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDisconnectChannel(ch.id);
                            }}
                            className="rounded-[8px] px-[14px] py-[5px] text-[12px] font-medium bg-surface-2 text-text-secondary hover:text-[var(--color-danger)] hover:bg-surface-3 transition-colors shrink-0"
                          >
                            {t("ws.home.connected")}
                          </button>
                          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors ml-3 shrink-0 leading-none">
                            {t("ws.home.chat")}
                            <ArrowUpRight size={12} className="-mt-px" />
                          </span>
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
      <SelectPrimitive.ItemText asChild>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[13px] font-normal leading-snug">{nativeLabel}</span>
          <span className="text-[11px] leading-snug text-text-tertiary">{englishLabel}</span>
        </div>
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
        <div className="flex items-center justify-between mb-4">
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
          </div>
        </div>

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
                    { labelKey: "ws.settings.about.github", url: GITHUB_URL, icon: ExternalLink },
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
                      <input
                        type="password"
                        placeholder={activeProvider.apiKeyPlaceholder}
                        value={getFormValues(activeProvider.id).apiKey}
                        onChange={(e) => setFormField(activeProvider.id, "apiKey", e.target.value)}
                        className="w-full rounded-lg border border-border bg-surface-0 px-3 py-2 text-[12px] text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)]/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-text-primary mb-3">
                        {t("ws.settings.apiProxyUrl")}
                      </label>
                      <input
                        type="text"
                        value={getFormValues(activeProvider.id).proxyUrl}
                        onChange={(e) =>
                          setFormField(activeProvider.id, "proxyUrl", e.target.value)
                        }
                        className="w-full rounded-lg border border-border bg-surface-0 px-3 py-2 text-[12px] text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)]/30"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleCheck(activeProvider.id)}
                        disabled={checkState === "checking" || saveState === "saving"}
                        className="text-[11px] text-text-muted hover:text-text-secondary disabled:opacity-50"
                      >
                        {checkState === "checking" && t("ws.settings.testing")}
                        {checkState === "success" && t("ws.settings.connectedStatus")}
                        {checkState === "error" && t("ws.settings.retryTest")}
                        {checkState === "idle" && t("ws.settings.testConnection")}
                      </button>
                      <button
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
                      </button>
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
          <Button
            size="sm"
            className="min-w-[120px]"
            {...buttonPropsForRow(ch)}
            onClick={(e) => {
              e.stopPropagation();
              onRowAction(ch);
            }}
          >
            {weeklyCooldown ? weeklyCooldownButtonLabel() : ctaForRow(ch)}
          </Button>
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
        className="absolute top-2 left-[88px] z-50 p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-black/5 transition-colors"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        title={collapsed ? t("ws.sidebar.expand") : t("ws.sidebar.collapse")}
      >
        {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      {/* Sidebar — frosted glass + fully hidden when collapsed */}
      <div
        className={`flex flex-col shrink-0 overflow-hidden ${collapsed ? "w-0" : ""}`}
        style={
          {
            ...(!collapsed ? { width: sidebarWidth } : {}),
            transition: isResizing.current ? "none" : "width 200ms",
            WebkitAppRegion: "drag",
            background: "transparent",
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
              className="rounded-full px-2 py-1 text-[10px] leading-none font-semibold bg-[var(--color-brand-primary)] text-white hover:opacity-85 transition-opacity"
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
                  className={`flex items-center gap-2.5 w-full rounded-[var(--radius-6)] text-[13px] transition-colors cursor-pointer px-3 py-2 ${
                    active ? "nav-item-active" : "nav-item"
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
                    className={`flex items-center gap-2.5 w-full rounded-[var(--radius-6)] text-[13px] transition-colors cursor-pointer px-3 py-1.5 ${
                      active ? "nav-item-active" : "nav-item"
                    }`}
                  >
                    <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                      <ChannelIcon size={14} />
                    </span>
                    <span className={`truncate text-[12px] ${active ? "" : "text-text-primary"}`}>
                      {ch.name}
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
          className="shrink-0 border-t border-border/60 pt-1.5 pb-2 px-2 flex items-center gap-0.5"
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
                          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${
                            locale === opt.value
                              ? "text-text-primary bg-black/5"
                              : "text-text-secondary hover:text-text-primary hover:bg-black/5"
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
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-black/5 transition-colors"
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
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2.5 text-[11px] leading-none font-medium bg-[var(--color-accent)] text-white hover:opacity-85 transition-opacity"
                >
                  {t("ws.update.download")}
                </button>
                <button
                  onClick={() => void openExternal("https://github.com/nexu-io/nexu/releases")}
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2 text-[11px] leading-none font-medium text-text-muted hover:text-text-primary transition-colors"
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
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2.5 text-[11px] leading-none font-medium bg-[var(--color-accent)] text-white hover:opacity-85 transition-opacity"
                >
                  {t("ws.update.restart")}
                </button>
                <button
                  onClick={() => void openExternal("https://github.com/nexu-io/nexu/releases")}
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2 text-[11px] leading-none font-medium text-text-muted hover:text-text-primary transition-colors"
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
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2.5 text-[11px] leading-none font-medium bg-[var(--color-accent)] text-white hover:opacity-85 transition-opacity"
                >
                  {t("ws.update.retry")}
                </button>
                <button
                  onClick={() => void openExternal("https://github.com/nexu-io/nexu/releases")}
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2 text-[11px] leading-none font-medium text-text-muted hover:text-text-primary transition-colors"
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
                    className="flex items-center justify-center size-7 rounded-full bg-[var(--color-accent)] text-white text-[11px] font-semibold leading-none cursor-pointer hover:opacity-90 transition-opacity shrink-0"
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
                        <TooltipTrigger asChild>
                          <InteractiveRow
                            tone="subtle"
                            type="button"
                            className="!rounded-lg !gap-2 !px-0 !py-0 !border-0 items-center cursor-default"
                          >
                            <InteractiveRowContent>
                              <div className="flex items-center gap-1 cursor-help">
                                <span className="text-[12px] text-[var(--color-text-muted)]">
                                  Plan credits
                                </span>
                                <Info
                                  size={10}
                                  className="text-[var(--color-text-muted)] shrink-0"
                                />
                              </div>
                            </InteractiveRowContent>
                            <InteractiveRowTrailing>
                              <span className="text-[12px] text-[var(--color-text-secondary)] tabular-nums">
                                {baseCredits}
                                <span className="text-[var(--color-text-muted)]">
                                  /{Math.round(budget.total)}
                                </span>
                              </span>
                            </InteractiveRowTrailing>
                          </InteractiveRow>
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
                        <TooltipTrigger asChild>
                          <InteractiveRow
                            tone="subtle"
                            type="button"
                            className="!rounded-lg !gap-2 !px-0 !py-0 !border-0 items-center cursor-default"
                          >
                            <InteractiveRowContent>
                              <div className="flex items-center gap-1 cursor-help">
                                <span className="text-[12px] text-[var(--color-text-muted)]">
                                  Bonus credits
                                </span>
                                <Info
                                  size={10}
                                  className="text-[var(--color-text-muted)] shrink-0"
                                />
                              </div>
                            </InteractiveRowContent>
                            <InteractiveRowTrailing>
                              <span className="text-[12px] text-[var(--color-text-secondary)] tabular-nums">
                                {bonusCredits}
                              </span>
                            </InteractiveRowTrailing>
                          </InteractiveRow>
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
                          <TooltipTrigger asChild>
                            <InteractiveRow
                              tone="subtle"
                              type="button"
                              className="!rounded-lg !gap-2 !px-0 !py-0 !border-0 items-center cursor-default"
                            >
                              <InteractiveRowContent>
                                <div className="flex items-center gap-1 cursor-help">
                                  <span className="text-[12px] text-[var(--color-text-muted)]">
                                    Credit pack balance
                                  </span>
                                  <Info
                                    size={10}
                                    className="text-[var(--color-text-muted)] shrink-0"
                                  />
                                </div>
                              </InteractiveRowContent>
                              <InteractiveRowTrailing>
                                <span className="text-[12px] text-[var(--color-text-secondary)] tabular-nums">
                                  {packCredits.toLocaleString()}
                                </span>
                              </InteractiveRowTrailing>
                            </InteractiveRow>
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
                      className={`py-1 rounded-lg text-[11px] font-medium transition-colors capitalize ${
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
                      className={`py-1 rounded-lg text-[11px] font-medium transition-colors ${
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
                      className={`py-1 rounded-md text-[10px] font-medium transition-colors ${
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
                    className="w-full py-1.5 rounded-lg text-[11px] font-medium bg-surface-2 text-text-secondary hover:bg-surface-0 border border-border transition-colors"
                  >
                    GitHub Star 引导弹窗
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSeedanceModal(true)}
                    className="w-full py-1.5 rounded-lg text-[11px] font-medium bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 border border-violet-200/60 transition-colors"
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
                    className="w-full py-1.5 rounded-lg text-[11px] font-medium bg-[var(--color-warning)]/12 text-[var(--color-warning)] hover:bg-[var(--color-warning)]/18 border border-[var(--color-warning)]/30 transition-colors"
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
