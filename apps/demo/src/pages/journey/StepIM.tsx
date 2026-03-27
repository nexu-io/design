import {
  Check,
  Plus,
  Settings,
  MessageSquare,
  Link2,
  CheckCircle,
  RefreshCw,
  Globe,
  Phone,
  Sparkles,
} from "lucide-react";
import { Button } from "@nexu-design/ui-web";
import ChatCardGroup from "../product/ChatCards";
import type { ChatCard } from "../product/sessionsData";

type ChannelCategory = "native" | "im";

interface Channel {
  name: string;
  icon: string;
  status: "connected" | "pending" | "coming";
  desc: string;
  badge: string | null;
  category: ChannelCategory;
  stats: {
    rounds: number;
    files: number;
    memories: number;
    contacts: number;
  } | null;
  recent?: { type: string; label: string; time: string }[];
  highlight?: string;
  steps?: string[];
  stepsDone?: number;
}

const NATIVE_CHANNELS: Channel[] = [
  {
    name: "Email",
    icon: "📧",
    status: "connected",
    desc: "tom@refly.ai · IMAP/SMTP 已配置",
    badge: "零安装",
    category: "native",
    stats: { rounds: 342, files: 28, memories: 45, contacts: 8 },
    recent: [
      {
        type: "file",
        label: "分身回复了投资人 Alex 的 follow-up",
        time: "1 小时前",
      },
      { type: "memory", label: "从邮件中提取了合作意向备忘", time: "3 小时前" },
    ],
    highlight:
      "发邮件给分身 = 启动一个 Session。附件自动存入 artifacts，关键信息记入 memory。",
  },
  {
    name: "SMS / iMessage",
    icon: "💬",
    status: "connected",
    desc: "+86 138****7890 · Twilio 接入",
    badge: "零安装",
    category: "native",
    stats: { rounds: 87, files: 5, memories: 23, contacts: 3 },
    recent: [
      {
        type: "memory",
        label: "短信指令：帮我查下明天的日程",
        time: "30 分钟前",
      },
      { type: "file", label: "分身回复了日程摘要", time: "30 分钟前" },
    ],
    highlight:
      "给分身发短信，随时随地发指令。无需打开任何 App，最原生的交互方式。",
  },
  {
    name: "WhatsApp",
    icon: "📱",
    status: "pending",
    desc: "待绑定手机号 · Meta API",
    badge: "零安装",
    category: "native",
    stats: null,
    recent: [],
    highlight:
      "全球 20 亿用户的即时通讯。给分身的 WhatsApp 号发消息就能开始工作。",
  },
];

const IM_CHANNELS: Channel[] = [
  {
    name: "飞书",
    icon: "🐦",
    status: "connected",
    desc: "Bot 已上线 · WebSocket 活跃",
    badge: "主渠道",
    category: "im",
    stats: { rounds: 1247, files: 89, memories: 156, contacts: 5 },
    recent: [
      { type: "memory", label: "记录了 OAuth 选型决策", time: "20 分钟前" },
      { type: "file", label: "生成了注册流程 PRD", time: "2 小时前" },
    ],
    steps: [
      "创建飞书机器人",
      "填写 App ID + Secret",
      "选择权限范围",
      "部署完成",
    ],
    stepsDone: 4,
  },
  {
    name: "Slack",
    icon: "💼",
    status: "connected",
    desc: "OAuth 已授权 · 3 个 Channel",
    badge: null,
    category: "im",
    stats: { rounds: 523, files: 34, memories: 67, contacts: 3 },
    recent: [{ type: "file", label: "更新了竞品分析报告", time: "昨天" }],
    steps: ["安装 Slack App", "OAuth 授权", "选择 Channel", "部署完成"],
    stepsDone: 4,
  },
  {
    name: "Telegram",
    icon: "✈️",
    status: "pending",
    desc: "待配置 Bot Token",
    badge: null,
    category: "im",
    stats: null,
    recent: [],
    steps: ["创建 Telegram Bot", "填写 Bot Token", "设置 Webhook", "部署完成"],
    stepsDone: 0,
  },
  {
    name: "Discord",
    icon: "🎮",
    status: "coming",
    desc: "即将支持",
    badge: "敬请期待",
    category: "im",
    stats: null,
    recent: [],
    steps: [],
    stepsDone: 0,
  },
  {
    name: "企业微信",
    icon: "🏢",
    status: "coming",
    desc: "即将支持",
    badge: "敬请期待",
    category: "im",
    stats: null,
    recent: [],
    steps: [],
    stepsDone: 0,
  },
];

// Sample card for email/SMS session preview
const EMAIL_SESSION_CARDS: ChatCard[] = [
  {
    type: "file",
    title: "投资人 Alex follow-up 回复",
    status: "success",
    body: "已根据你的记忆起草回复，附上最新产品进展和 demo 链接。",
    path: "artifacts/emails/investor-alex-followup.md",
    meta: "来自 Email · 1 小时前",
    actions: [{ label: "查看邮件", primary: true }],
  },
];

function StatBadge({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-1 text-[10px] text-text-secondary">
      <span className="text-[9px]">{icon}</span>
      <span className="tabular-nums font-medium text-text-primary">
        {value.toLocaleString()}
      </span>
      <span className="text-text-muted">{label}</span>
    </div>
  );
}

function ChannelCard({ ch }: { ch: Channel }) {
  return (
    <div className="bg-surface-2 border border-border rounded-xl hover:border-border-hover transition-colors overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <div className="text-xl w-9 h-9 flex items-center justify-center bg-surface-3 rounded-lg shrink-0">
          {ch.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-text-primary">
              {ch.name}
            </span>
            {ch.badge && (
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                  ch.badge === "主渠道"
                    ? "bg-clone/10 text-clone"
                    : ch.badge === "零安装"
                    ? "bg-success-subtle text-success"
                    : "bg-surface-3 text-text-muted"
                }`}
              >
                {ch.badge}
              </span>
            )}
          </div>
          <div className="text-[11px] text-text-secondary mt-0.5">
            {ch.desc}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ch.status === "connected" && (
            <span className="flex items-center gap-1 text-[11px] text-success bg-success-subtle px-2 py-1 rounded-md">
              <Check size={11} /> 已连接
            </span>
          )}
          {ch.status === "pending" && (
            <Button variant="ghost" size="xs" className="h-auto gap-1 bg-accent-subtle px-2.5 py-1 text-[11px] font-medium text-accent hover:bg-accent-glow">
              <Settings size={11} /> 配置
            </Button>
          )}
          {ch.status === "coming" && (
            <span className="text-[11px] text-text-muted">即将支持</span>
          )}
        </div>
      </div>

      {/* Native channel highlight */}
      {ch.highlight && (
        <div className="mx-4 mb-3 p-2.5 bg-success-subtle/30 border border-success/10 rounded-lg">
          <div className="text-[11px] text-text-secondary leading-relaxed flex items-start gap-2">
            <Sparkles size={12} className="text-success shrink-0 mt-0.5" />
            {ch.highlight}
          </div>
        </div>
      )}

      {ch.stats && (
        <div className="px-4 pb-3 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <StatBadge icon="💬" label="轮次" value={ch.stats.rounds} />
            <StatBadge icon="📄" label="文件" value={ch.stats.files} />
            <StatBadge icon="🧠" label="记忆" value={ch.stats.memories} />
            <StatBadge icon="👤" label="联系人" value={ch.stats.contacts} />
          </div>
          {ch.recent && ch.recent.length > 0 && (
            <div className="pt-2 border-t border-border-subtle space-y-1">
              {ch.recent.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-[10px] text-text-secondary"
                >
                  <span className="text-[9px]">
                    {r.type === "memory" ? "🧠" : "📄"}
                  </span>
                  <span className="truncate">{r.label}</span>
                  <span className="text-text-muted ml-auto shrink-0">
                    {r.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {ch.status === "pending" && ch.steps && ch.steps.length > 0 && (
        <div className="px-4 pb-3">
          <div className="p-3 bg-surface-3/50 rounded-lg">
            <div className="text-[10px] text-text-muted mb-2">配置步骤</div>
            <div className="space-y-1">
              {ch.steps.map((step, i) => (
                <div key={step} className="flex items-center gap-2 text-[10px]">
                  {i < (ch.stepsDone ?? 0) ? (
                    <CheckCircle size={11} className="text-success shrink-0" />
                  ) : (
                    <div className="w-[11px] h-[11px] rounded-full border border-border shrink-0" />
                  )}
                  <span
                    className={
                      i < (ch.stepsDone ?? 0)
                        ? "text-text-muted line-through"
                        : "text-text-primary"
                    }
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <Button size="sm" className="mt-2 w-full gap-1 px-3 text-[11px]">
              <Link2 size={11} /> 开始配置
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StepIM() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-text-primary">接入 IM / 飞书</h1>
        <p className="text-[13px] text-text-secondary mt-1">
          让分身住在你常用的工具里 — 在哪都能用，记忆跨平台同步
        </p>
      </div>

      {/* Integration flow diagram */}
      <div className="bg-surface-1 border border-border rounded-xl p-5 mb-6">
        <div className="text-[11px] font-medium text-text-secondary mb-3">
          接入流程（以飞书为例）
        </div>
        <div className="flex items-center gap-2">
          {["创建机器人", "配置权限", "填写凭证", "测试连接", "上线运行"].map(
            (step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      i < 4
                        ? "bg-success text-white"
                        : "bg-clone text-white animate-pulse"
                    }`}
                  >
                    {i < 4 ? <Check size={10} /> : i + 1}
                  </div>
                  <span
                    className={`text-[10px] ${
                      i <= 4
                        ? "text-text-primary font-medium"
                        : "text-text-muted"
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {i < 4 && (
                  <div
                    className={`w-8 h-px ${i < 4 ? "bg-success" : "bg-border"}`}
                  />
                )}
              </div>
            )
          )}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[10px]">
          <CheckCircle size={12} className="text-success" />
          <span className="text-success font-medium">飞书已连接</span>
          <span className="text-text-muted">
            · Bot 名称：Refly 分身 · WebSocket 活跃 · 延迟 &lt; 200ms
          </span>
        </div>
      </div>

      {/* Native channels section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-success-subtle flex items-center justify-center">
            <Phone size={11} className="text-success" />
          </div>
          <span className="text-[13px] font-semibold text-text-primary">
            原生渠道
          </span>
          <span className="text-[10px] text-success bg-success-subtle px-1.5 py-0.5 rounded-full font-medium">
            零安装
          </span>
        </div>
        <div className="text-[12px] text-text-secondary mb-3 pl-7">
          无需下载任何 App —
          每个手机都有短信和邮件。发一条消息就能启动分身工作。
        </div>
        <div className="space-y-3">
          {NATIVE_CHANNELS.map((ch) => (
            <ChannelCard key={ch.name} ch={ch} />
          ))}
        </div>
      </div>

      {/* IM platforms section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-clone/10 flex items-center justify-center">
            <MessageSquare size={11} className="text-clone" />
          </div>
          <span className="text-[13px] font-semibold text-text-primary">
            IM 平台
          </span>
          <span className="text-[10px] text-text-muted">
            团队协作 · 群聊 · 卡片交互
          </span>
        </div>
        <div className="space-y-3">
          {IM_CHANNELS.map((ch) => (
            <ChannelCard key={ch.name} ch={ch} />
          ))}
        </div>
      </div>

      {/* Card preview: session from email/SMS */}
      <div className="mb-6">
        <div className="text-[11px] font-medium text-text-secondary mb-2">
          邮件/短信 会话示例
        </div>
        <div className="max-w-72">
          <ChatCardGroup cards={EMAIL_SESSION_CARDS} interactive={false} />
        </div>
      </div>

      <Button variant="outline" className="mb-6 h-auto w-full gap-2 border-dashed p-3 text-[12px] text-text-secondary hover:text-text-primary hover:border-border-hover">
        <Plus size={14} />
        添加渠道
      </Button>

      {/* Key features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: RefreshCw,
            label: "跨平台同步",
            desc: "飞书说的话，网页也记得",
          },
          { icon: Globe, label: "多端同时在线", desc: "网页 + IM 同时使用" },
          {
            icon: MessageSquare,
            label: "群聊协作",
            desc: "在群里帮你汇总进度",
          },
          { icon: Phone, label: "零安装接入", desc: "邮件/短信 发一条即启动" },
        ].map((f) => (
          <div
            key={f.label}
            className="bg-surface-1 border border-border rounded-lg p-3 text-center"
          >
            <f.icon size={16} className="text-clone mx-auto mb-1.5" />
            <div className="text-[11px] font-medium text-text-primary">
              {f.label}
            </div>
            <div className="text-[10px] text-text-muted mt-0.5">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
