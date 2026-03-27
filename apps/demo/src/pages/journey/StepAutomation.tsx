import { Button } from "@nexu-design/ui-web";
import {
  BarChart3,
  Bell,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Code,
  Download,
  FileText,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Pause,
  Plus,
  Search,
  Shield,
  Sparkles,
  Star,
  ToggleRight,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";
import ChatCardGroup from "../product/ChatCards";
import type { ChatCard } from "../product/sessionsData";

type View = "automation" | "skills";

const TEMPLATES = [
  { name: "每日邮件摘要", icon: Mail, color: "bg-info-subtle text-info" },
  { name: "竞品监测", icon: Search, color: "bg-clone/10 text-clone" },
  { name: "周五回顾", icon: BarChart3, color: "bg-success-subtle text-success" },
  { name: "安全自审", icon: Shield, color: "bg-danger-subtle text-danger" },
  { name: "增长日报", icon: TrendingUp, color: "bg-warning-subtle text-warning" },
  { name: "灵感方案", icon: Sparkles, color: "bg-clone/10 text-clone" },
];

const TASKS = [
  {
    name: "今日战况复盘",
    cron: "每天 22:00",
    icon: Brain,
    enabled: true,
    lastRun: "今天 22:00",
    stats: "扫荡 7,660 条 · 评论 21 次",
  },
  { name: "早间日报", cron: "每天 08:30", icon: Calendar, enabled: true, lastRun: "今天 08:30" },
  {
    name: "Action Item 检查",
    cron: "每天 3 次",
    icon: CheckCircle,
    enabled: true,
    lastRun: "今天 15:00",
    stats: "检查 7 项 · 已完成 3",
  },
  { name: "记忆周报", cron: "每周日 20:00", icon: Brain, enabled: true, lastRun: "上周日" },
  { name: "TODO 提醒", cron: "每天 10:00/15:00", icon: Bell, enabled: true, lastRun: "今天 10:00" },
  { name: "联系人扫描", cron: "每周一 09:00", icon: Users, enabled: true, lastRun: "上周一" },
];

const PROACTIVE_RULES = [
  { name: "灵感关联", trigger: "用户记录新想法时", example: '"3 天前说的 X 跟这个想法很像"' },
  { name: "截止日预警", trigger: "待办距截止 < 24h", example: '"数据库迁移今天到期"' },
  { name: "上下文衔接", trigger: "新对话开始时", example: '"昨天的 PRD 还没完成，要继续吗？"' },
  { name: "知识沉淀", trigger: "对话中出现重要决策", example: "自动保存 PostgreSQL 选型决策" },
  { name: "对方承诺追踪", trigger: "会议中对方承诺行动项", example: '"王浩今天的 demo 还没更新"' },
];

const SKILLS = [
  {
    name: "Memory & Notes",
    desc: "自动记忆管理，知识沉淀",
    icon: FileText,
    installed: true,
    installs: "12.4k",
  },
  {
    name: "Task Manager",
    desc: "待办创建、追踪、提醒",
    icon: BarChart3,
    installed: true,
    installs: "11.2k",
  },
  {
    name: "Web Research",
    desc: "联网搜索 + 信息整理",
    icon: Search,
    installed: true,
    installs: "10.1k",
  },
  {
    name: "Code Automation",
    desc: "代码生成、PR、自动化",
    icon: Code,
    installed: true,
    installs: "8.3k",
  },
  {
    name: "Daily Digest",
    desc: "每日日程 + 待办汇总",
    icon: FileText,
    installed: true,
    installs: "9.8k",
  },
];

const RECOMMENDED = [
  {
    name: "Contact Intelligence",
    desc: "联系人健康评分 + 关系管理",
    icon: Users,
    installs: "7.2k",
  },
  { name: "Advisory Board", desc: "多 Agent 辩论 → 综合建议", icon: Brain, installs: "3.8k" },
  { name: "PRD Generator", desc: "需求文档生成与迭代", icon: FileText, installs: "6.7k" },
  { name: "Security Auditor", desc: "多视角安全审查 + 告警", icon: Shield, installs: "3.2k" },
];

const AUTOMATION_CARD_EXAMPLES: ChatCard[] = [
  {
    type: "automation",
    title: "今日战况复盘",
    status: "running",
    body: "正在扫描 7,660 条对话和 21 份文档...",
    path: "automation/daily-digest.yaml",
    meta: "定时触发 · 每天 22:00",
  },
  {
    type: "file",
    title: "日报已生成",
    status: "success",
    body: "完成 12 个任务 · 3 份文档 · 5 条新记忆",
    path: "artifacts/reports/daily-report-0223.md",
    diff: { added: 89, removed: 0 },
    actions: [{ label: "查看日报", primary: true }, { label: "推送飞书" }],
  },
];

const SKILL_CARD_EXAMPLE: ChatCard[] = [
  {
    type: "skill",
    title: "Web Research",
    status: "success",
    body: "联网搜索 + 信息整理 · 已安装",
    meta: "10.1k 安装 · 官方认证",
    actions: [{ label: "配置", primary: true }, { label: "查看文档" }],
  },
];

export default function StepAutomation() {
  const [view, setView] = useState<View>("automation");

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* View toggle */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setView("automation")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
            view === "automation"
              ? "bg-accent text-accent-fg"
              : "bg-surface-2 border border-border text-text-secondary hover:bg-surface-3"
          }`}
        >
          <Clock size={14} /> Automation
        </button>
        <button
          type="button"
          onClick={() => setView("skills")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
            view === "skills"
              ? "bg-accent text-accent-fg"
              : "bg-surface-2 border border-border text-text-secondary hover:bg-surface-3"
          }`}
        >
          <Sparkles size={14} /> Skills
        </button>
      </div>

      {view === "automation" ? (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "活跃任务", value: "8", icon: Clock, color: "text-info" },
              { label: "主动规则", value: "7", icon: Brain, color: "text-clone" },
              { label: "今日触发", value: "14", icon: Zap, color: "text-success" },
              { label: "成功率", value: "96%", icon: CheckCircle, color: "text-success" },
            ].map((s) => (
              <div key={s.label} className="bg-surface-2 border border-border rounded-xl p-3">
                <s.icon size={14} className={`${s.color} mb-1.5`} />
                <div className="text-base font-bold text-text-primary">{s.value}</div>
                <div className="text-[10px] text-text-muted">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Templates */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={12} className="text-clone" />
              <span className="text-[12px] font-medium text-text-secondary">
                Start with a template
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  type="button"
                  key={t.name}
                  className="p-2.5 bg-surface-2 border border-border rounded-xl hover:border-border-hover transition-colors text-left"
                >
                  <div
                    className={`w-6 h-6 rounded-lg ${t.color.split(" ")[0]} flex items-center justify-center mb-1.5`}
                  >
                    <t.icon size={12} className={t.color.split(" ")[1]} />
                  </div>
                  <div className="text-[11px] font-medium text-text-primary">{t.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Active tasks */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={12} className="text-text-muted" />
              <span className="text-[12px] font-medium text-text-secondary">
                Active automations
              </span>
              <span className="text-[9px] text-text-muted bg-surface-3 px-1.5 py-0.5 rounded-full">
                {TASKS.length}
              </span>
            </div>
            <div className="space-y-2">
              {TASKS.map((task) => (
                <div
                  key={task.name}
                  className="flex items-start gap-3 p-3 bg-surface-2 border border-border rounded-xl hover:border-border-hover transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-clone/10 flex items-center justify-center shrink-0">
                    <task.icon size={14} className="text-clone" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-text-primary">{task.name}</span>
                      <span className="text-[9px] px-1 py-0.5 bg-surface-3 rounded text-text-muted font-mono">
                        {task.cron}
                      </span>
                    </div>
                    <div className="text-[10px] text-text-muted mt-0.5">
                      上次运行：{task.lastRun}
                    </div>
                    {task.stats && (
                      <div className="mt-1 px-2 py-1 bg-surface-3 rounded text-[10px] text-text-secondary">
                        {task.stats}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      className="p-1 rounded-md hover:bg-surface-3 text-success"
                    >
                      <Pause size={12} />
                    </button>
                    <button
                      type="button"
                      className="p-1 rounded-md hover:bg-surface-3 text-text-muted"
                    >
                      <MoreHorizontal size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proactive rules */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Brain size={12} className="text-clone" />
              <span className="text-[12px] font-medium text-text-secondary">Proactive Rules</span>
            </div>
            <div className="space-y-1.5">
              {PROACTIVE_RULES.map((rule) => (
                <div
                  key={rule.name}
                  className="flex items-center gap-3 p-2.5 bg-surface-2 border border-border rounded-lg"
                >
                  <Zap size={12} className="text-clone shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-text-primary">{rule.name}</span>
                      <span className="text-[9px] text-text-muted">· {rule.trigger}</span>
                    </div>
                    <div className="text-[10px] text-text-tertiary italic mt-0.5">
                      {rule.example}
                    </div>
                  </div>
                  <ToggleRight size={16} className="text-clone shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Card preview — what automation outputs look like */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={12} className="text-text-muted" />
              <span className="text-[12px] font-medium text-text-secondary">
                Session 中的卡片产出
              </span>
              <span className="text-[9px] text-text-muted bg-surface-3 px-1.5 py-0.5 rounded-full">
                预览
              </span>
            </div>
            <div className="bg-surface-1 border border-border rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-clone/10 flex items-center justify-center text-[10px]">
                  😊
                </div>
                <span className="text-[10px] font-medium text-text-primary">
                  分身执行自动化后产出卡片 →
                </span>
              </div>
              <ChatCardGroup cards={AUTOMATION_CARD_EXAMPLES} />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Installed */}
          <div>
            <h2 className="text-base font-bold text-text-primary mb-1">Skills</h2>
            <p className="text-[12px] text-text-secondary mb-4">
              Give your clone superpowers — teach it new skills.
            </p>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-[12px] font-medium text-text-primary border-b-2 border-text-primary pb-1">
                Installed <span className="text-text-muted ml-1">{SKILLS.length}</span>
              </span>
              <span className="text-[12px] text-text-secondary pb-1">Featured</span>
              <span className="text-[12px] text-text-secondary pb-1">
                Explore <span className="text-text-muted ml-1">12</span>
              </span>
            </div>

            <div className="space-y-1">
              {SKILLS.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center gap-3 p-2.5 hover:bg-surface-3/50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center shrink-0">
                    <s.icon size={14} className="text-text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-medium text-text-primary">{s.name}</span>
                      <Shield size={10} className="text-success shrink-0" />
                    </div>
                    <div className="text-[10px] text-text-muted">{s.desc}</div>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-text-muted">
                    <Download size={9} /> {s.installs}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star size={12} className="text-clone" />
              <span className="text-[12px] font-medium text-text-secondary">
                Recommended for you
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {RECOMMENDED.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center gap-2.5 p-3 bg-surface-2 border border-border rounded-xl hover:border-border-hover transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center shrink-0">
                    <s.icon size={14} className="text-text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium text-text-primary">{s.name}</div>
                    <div className="text-[10px] text-text-muted truncate">{s.desc}</div>
                  </div>
                  <button
                    type="button"
                    className="p-1 rounded-md hover:bg-surface-3 text-text-muted"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Skill card preview */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={12} className="text-text-muted" />
              <span className="text-[12px] font-medium text-text-secondary">
                Session 中的技能卡片
              </span>
              <span className="text-[9px] text-text-muted bg-surface-3 px-1.5 py-0.5 rounded-full">
                预览
              </span>
            </div>
            <div className="bg-surface-1 border border-border rounded-xl p-3">
              <ChatCardGroup cards={SKILL_CARD_EXAMPLE} />
            </div>
          </div>

          {/* Builder tools */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto justify-start gap-3 p-3 bg-surface-2 border-border hover:border-border-hover text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-clone/10 flex items-center justify-center shrink-0">
                <Wrench size={16} className="text-clone" />
              </div>
              <div>
                <div className="text-[12px] font-semibold text-text-primary">Skill Creator</div>
                <div className="text-[10px] text-text-muted">Create or update a skill</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto justify-start gap-3 p-3 bg-surface-2 border-border hover:border-border-hover text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-info-subtle flex items-center justify-center shrink-0">
                <Zap size={16} className="text-info" />
              </div>
              <div>
                <div className="text-[12px] font-semibold text-text-primary">Workflow Editor</div>
                <div className="text-[10px] text-text-muted">Build visual skill workflows</div>
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
