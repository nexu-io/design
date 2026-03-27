import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  StatCard,
  ToggleGroup,
  ToggleGroupItem,
} from "@nexu/ui-web";
import {
  AlertCircle,
  BarChart3,
  Bell,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  ExternalLink,
  FileText,
  FolderOpen,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Plus,
  Search,
  Send,
  Shield,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductLayout } from "./ProductLayoutContext";

type TabId = "schedules" | "proactive" | "logs";

const AUTOMATION_TEMPLATES = [
  {
    name: "每日邮件摘要",
    desc: "汇总过去 24h 未读邮件，按发件人和优先级分类",
    icon: Mail,
    color: "bg-info-subtle text-info",
  },
  {
    name: "竞品监测",
    desc: "每周扫描竞品动态、产品更新、融资消息",
    icon: Search,
    color: "bg-clone/10 text-clone",
  },
  {
    name: "周五 Sprint 回顾",
    desc: "汇总本周完成 vs 计划任务，计算 velocity",
    icon: BarChart3,
    color: "bg-success-subtle text-success",
  },
  {
    name: "安全自审",
    desc: "每晚 AI 审查系统日志、权限配置、异常行为检测",
    icon: Shield,
    color: "bg-error-subtle text-error",
  },
  {
    name: "联系人健康扫描",
    desc: "每周扫描联系人，标记 >30 天未互动的关键人脉",
    icon: Users,
    color: "bg-role-ops/10 text-role-ops",
  },
  {
    name: "行动项追踪",
    desc: "每天 3 次检查 action items 完成情况，追踪对方承诺",
    icon: CheckCircle,
    color: "bg-success-subtle text-success",
  },
  {
    name: "知识库自动整理",
    desc: "新入库内容去重、合并、打标签、生成每周摘要",
    icon: Database,
    color: "bg-role-designer/10 text-role-designer",
  },
  {
    name: "增长指标日报",
    desc: "每日汇总核心指标：DAU、转化率、留存、社交互动",
    icon: TrendingUp,
    color: "bg-warning-subtle text-warning",
  },
  {
    name: "灵感 → 方案",
    desc: "新想法入库后自动搜索关联历史、评估可行性、生成方案",
    icon: Sparkles,
    color: "bg-clone/10 text-clone",
  },
];

const SCHEDULED_TASKS = [
  {
    id: 6,
    name: "今日战况复盘",
    cron: "每天 22:00",
    desc: "扫荡信息流，评论互动，筛选有价值内容，生成战况报告发送到飞书",
    channel: "飞书",
    enabled: true,
    lastRun: "今天 22:00",
    icon: Brain,
    isHighlight: true,
    stats: "今日：扫荡 7,660 条 · 评论 21 次 · 发现 3 个潜在目标",
  },
  {
    id: 1,
    name: "早间日报",
    cron: "每天 08:30",
    desc: "汇总日程、待办、紧急事项，发送到飞书",
    channel: "飞书",
    enabled: true,
    lastRun: "今天 08:30",
    icon: Calendar,
  },
  {
    id: 8,
    name: "Action Item 完成检查",
    cron: "每天 10:00 / 15:00 / 20:00",
    desc: "检查会议行动项完成情况，追踪对方承诺，未完成的主动提醒",
    channel: "飞书",
    enabled: true,
    lastRun: "今天 15:00",
    icon: CheckCircle,
    stats: "今日：检查 7 项 · 已完成 3 · 追踪对方 4 · 到期 1",
  },
  {
    id: 7,
    name: "记忆周报",
    cron: "每周日 20:00",
    desc: "复盘本周新增记忆、碎片聚合为结构化洞察、对齐率变化",
    channel: "飞书",
    enabled: true,
    lastRun: "上周日 20:00",
    icon: Database,
    stats: "本周：新增 23 条记忆 · 聚合 5 条碎片为洞察 · 对齐率 +3%",
  },
  {
    id: 2,
    name: "周五回顾",
    cron: "每周五 17:00",
    desc: "总结本周完成事项、未完成任务、下周规划",
    channel: "飞书",
    enabled: true,
    lastRun: "上周五 17:00",
    icon: FileText,
  },
  {
    id: 3,
    name: "TODO 提醒",
    cron: "每天 10:00 / 15:00",
    desc: "检查临期和过期的待办事项并提醒",
    channel: "飞书",
    enabled: true,
    lastRun: "今天 10:00",
    icon: Bell,
  },
  {
    id: 9,
    name: "联系人健康扫描",
    cron: "每周一 09:00",
    desc: "扫描联系人互动频率，标记 >30 天未联系的重要人脉，生成关系报告",
    channel: "飞书",
    enabled: true,
    lastRun: "上周一 09:00",
    icon: Users,
    stats: "上周：扫描 24 人 · 标记 6 人需关注 · 2 人流失风险",
  },
  {
    id: 10,
    name: "安全自审",
    cron: "每晚 03:00",
    desc: "AI 多视角审查系统运行日志、权限配置、异常行为检测，发现问题立即告警",
    channel: "飞书",
    enabled: true,
    lastRun: "今天 03:00",
    icon: Shield,
  },
  {
    id: 5,
    name: "邮件摘要",
    cron: "每 30 分钟（工作时段）",
    desc: "扫描未读邮件，过滤营销/冷推销，保留有价值对话并摘要",
    channel: "飞书",
    enabled: false,
    lastRun: "从未运行",
    icon: Mail,
  },
];

const PROACTIVE_RULES = [
  {
    id: 1,
    name: "灵感关联",
    trigger: "用户记录新想法时",
    action: "自动搜索相关历史记忆，发现关联并主动推送",
    enabled: true,
    example: '"你 3 天前说的 X 跟这个想法很像，要合并思考吗？"',
  },
  {
    id: 2,
    name: "截止日预警",
    trigger: "待办距截止 < 24h",
    action: "主动提醒用户并建议优先处理",
    enabled: true,
    example: '"数据库迁移今天到期，建议优先处理。需要帮你拆解步骤吗？"',
  },
  {
    id: 3,
    name: "上下文衔接",
    trigger: "新对话开始时",
    action: "自动加载最近相关记忆和未完成任务",
    enabled: true,
    example: '"你昨天让我帮你写的 PRD 还没完成，要继续吗？"',
  },
  {
    id: 4,
    name: "知识沉淀",
    trigger: "对话中出现重要决策",
    action: "自动提取并保存到记忆系统，更新分身认知",
    enabled: true,
    example: "自动保存：用户决定使用 PostgreSQL 替代 MongoDB",
  },
  {
    id: 5,
    name: "对方承诺追踪",
    trigger: "会议中对方承诺了行动项",
    action: '标记为"waiting on"，到期未完成时提醒用户跟进',
    enabled: true,
    example: '"王浩承诺今天提交飞书扫码 demo，但还没更新。需要帮你发消息跟进吗？"',
  },
  {
    id: 6,
    name: "跨模块智能关联",
    trigger: "正在做 A 任务时，B 模块有相关信息",
    action: "主动插入关联信息，打通模块间数据",
    enabled: true,
    example: '"你在写定价方案，刘强上次聊过类似话题——他关注单位经济模型。"',
  },
  {
    id: 7,
    name: "自动化推荐",
    trigger: "用户重复做同一件事 3+ 次",
    action: "分身主动推荐自动化规则，用户一键确认",
    enabled: true,
    example: '"你每周一上午都在整理上周 Todo，要我帮你自动化吗？"',
  },
  {
    id: 8,
    name: "依赖风险检测",
    trigger: "团队成员任务进度变更时",
    action: "检测跨成员任务依赖风险，自动推送对齐请求卡片到 IM",
    enabled: true,
    example: '"张三的前端集成依赖李四的 Gateway，后者进度偏慢，建议提前对齐。"',
  },
  {
    id: 9,
    name: "站会自动化",
    trigger: "每日 09:00",
    action: "汇总团队分身任务进度，生成站会 IM 卡片推送到群",
    enabled: true,
    example: "自动生成 Sprint 3 进度 58%，风险项 1 个，推送到 #product-team",
  },
];

const ACTIVITY_LOGS = [
  { time: "08:30", type: "schedule", name: "早间日报", status: "success", detail: "已发送到飞书" },
  {
    time: "08:32",
    type: "proactive",
    name: "灵感关联",
    status: "success",
    detail: "发现 2 条相关记忆",
  },
  {
    time: "10:00",
    type: "schedule",
    name: "TODO 提醒",
    status: "success",
    detail: "提醒 3 条待办",
  },
  {
    time: "10:15",
    type: "proactive",
    name: "截止日预警",
    status: "warning",
    detail: "1 条任务今日到期",
  },
  {
    time: "11:30",
    type: "proactive",
    name: "知识沉淀",
    status: "success",
    detail: "自动保存 1 条决策",
  },
];

interface AutomationDetail {
  type: "schedule" | "proactive";
  id: number;
  name: string;
  icon: React.ElementType;
  enabled: boolean;
}

interface RunLog {
  time: string;
  status: "success" | "warning" | "error";
  summary: string;
}

const AUTOMATION_RUN_LOGS: Record<number, RunLog[]> = {
  6: [
    {
      time: "今天 22:00",
      status: "success",
      summary: "扫荡 7,660 条 · 评论 21 次 · 发现 3 个目标",
    },
    {
      time: "昨天 22:00",
      status: "success",
      summary: "扫荡 5,320 条 · 评论 15 次 · 发现 1 个目标",
    },
    {
      time: "前天 22:00",
      status: "success",
      summary: "扫荡 6,100 条 · 评论 18 次 · 发现 2 个目标",
    },
    {
      time: "2/18 22:00",
      status: "warning",
      summary: "扫荡 4,200 条 · 评论 12 次 · API 限流 1 次",
    },
  ],
  1: [
    { time: "今天 08:30", status: "success", summary: "汇总 3 个日程 · 5 个待办 · 1 个紧急事项" },
    { time: "昨天 08:30", status: "success", summary: "汇总 2 个日程 · 3 个待办" },
    { time: "前天 08:30", status: "success", summary: "汇总 4 个日程 · 6 个待办 · 2 个紧急事项" },
  ],
  8: [
    {
      time: "今天 15:00",
      status: "success",
      summary: "检查 7 项 · 已完成 3 · 追踪对方 4 · 王浩 demo 到期",
    },
    { time: "今天 10:00", status: "success", summary: "检查 7 项 · 已完成 1 · 新增对方承诺 2" },
    { time: "昨天 20:00", status: "warning", summary: "1 项过期：数据库 Schema 初稿（陈杰）" },
  ],
  7: [
    {
      time: "上周日 20:00",
      status: "success",
      summary: "新增 23 条记忆 · 聚合 5 条碎片 · 默契度 +3%",
    },
    { time: "2/9 20:00", status: "success", summary: "新增 18 条记忆 · 合并 2 条 · 默契度 +2%" },
  ],
  2: [
    { time: "上周五 17:00", status: "success", summary: "完成 15 / 18 任务 · 生成周报推送到飞书" },
    { time: "2/7 17:00", status: "success", summary: "完成 12 / 15 任务 · 生成周报推送到飞书" },
  ],
  3: [
    { time: "今天 10:00", status: "success", summary: "提醒 3 条待办 · 1 条即将到期" },
    { time: "今天 15:00", status: "success", summary: "提醒 2 条待办" },
    { time: "昨天 10:00", status: "warning", summary: "1 条任务已过期：数据库迁移 PR Review" },
  ],
  9: [
    {
      time: "上周一 09:00",
      status: "success",
      summary: "扫描 24 人 · 6 人需关注 · 2 人流失风险 · 已发提醒",
    },
    { time: "2/10 09:00", status: "success", summary: "扫描 22 人 · 3 人需关注 · 全部健康度正常" },
  ],
  10: [
    {
      time: "今天 03:00",
      status: "success",
      summary: "审查 12 个 automation 日志 · 无异常 · 权限正常",
    },
    {
      time: "昨天 03:00",
      status: "success",
      summary: "审查完成 · 发现 1 条建议：优化 API 限流策略",
    },
    {
      time: "前天 03:00",
      status: "warning",
      summary: "检测到 1 个权限异常：邮件 skill 请求了写权限",
    },
  ],
};

const PROACTIVE_RUN_LOGS: Record<number, RunLog[]> = {
  1: [
    { time: "今天 11:30", status: "success", summary: "发现 2 条相关记忆：搜索推荐 + 用户反馈" },
    { time: "昨天 14:20", status: "success", summary: "关联了 1 条历史决策：技术选型偏好" },
  ],
  2: [
    { time: "今天 10:15", status: "warning", summary: "提醒：数据库迁移 PR 今日到期" },
    { time: "昨天 09:00", status: "success", summary: "提醒：竞品分析报告明天截止" },
  ],
  4: [
    { time: "今天 11:30", status: "success", summary: "保存决策：使用 PostgreSQL + TypeORM" },
    { time: "昨天 16:00", status: "success", summary: "保存偏好：深色主题 + Linear 风格 UI" },
  ],
  5: [
    {
      time: "今天 16:30",
      status: "warning",
      summary: "王浩承诺今天提交 demo，但截至 16:30 未更新",
    },
    { time: "昨天 10:00", status: "success", summary: "陈杰已提交 Schema 初稿，标记为已完成" },
  ],
  6: [
    {
      time: "今天 14:20",
      status: "success",
      summary: "你在写定价方案时，关联了刘强上次讨论的单位经济模型",
    },
    {
      time: "昨天 16:00",
      status: "success",
      summary: "在竞品分析中，插入了知识库中 3 天前保存的 Cursor 资料",
    },
  ],
  7: [
    {
      time: "今天 09:00",
      status: "success",
      summary: "检测到你本周 3 次手动整理 Todo，推荐自动化规则",
    },
    { time: "上周三", status: "success", summary: '推荐的"每日邮件摘要"已被确认并激活' },
  ],
};

function AutomationDetailPanel({ item, onClose }: { item: AutomationDetail; onClose: () => void }) {
  const navigate = useNavigate();
  const [followUp, setFollowUp] = useState("");

  const task = SCHEDULED_TASKS.find((t) => t.id === item.id);
  const rule = PROACTIVE_RULES.find((r) => r.id === item.id);
  const logs =
    item.type === "schedule"
      ? AUTOMATION_RUN_LOGS[item.id] || []
      : PROACTIVE_RUN_LOGS[item.id] || [];

  const handleFollowUp = () => {
    if (!followUp.trim()) return;
    navigate("/app/sessions");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-[400px] h-full bg-surface-1 border-l border-border shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-clone/10 flex items-center justify-center">
            <item.icon size={16} className="text-clone" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                  item.type === "schedule" ? "bg-info-subtle text-info" : "bg-clone/10 text-clone"
                }`}
              >
                {item.type === "schedule" ? "定时任务" : "主动规则"}
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded ${
                  item.enabled ? "bg-success-subtle text-success" : "bg-surface-3 text-text-muted"
                }`}
              >
                {item.enabled ? "运行中" : "已暂停"}
              </span>
            </div>
            <h3 className="text-[13px] font-semibold text-text-primary truncate">{item.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-surface-3 text-text-muted transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Config info */}
        <div className="px-4 py-3 border-b border-border shrink-0">
          {task && (
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-text-muted shrink-0" />
                <span className="text-text-muted">频率</span>
                <span className="text-text-primary font-medium ml-auto">{task.cron}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare size={12} className="text-text-muted shrink-0" />
                <span className="text-text-muted">推送到</span>
                <span className="text-text-primary ml-auto">{task.channel}</span>
              </div>
              <div className="text-[11px] text-text-secondary mt-1">{task.desc}</div>
            </div>
          )}
          {rule && (
            <div className="space-y-2 text-[12px]">
              <div className="flex items-start gap-2">
                <Zap size={12} className="text-text-muted shrink-0 mt-0.5" />
                <div>
                  <span className="text-text-muted">触发：</span>
                  <span className="text-text-primary">{rule.trigger}</span>
                </div>
              </div>
              <div className="text-[11px] text-text-secondary">{rule.action}</div>
              <div className="px-2.5 py-1.5 bg-surface-3 rounded-md text-[11px] text-text-tertiary italic">
                {rule.example}
              </div>
            </div>
          )}
        </div>

        {/* Run history */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-4 pt-3 pb-1">
            <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
              运行记录
            </div>
          </div>
          {logs.length > 0 ? (
            <div className="px-4 pb-3 space-y-1.5">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-2.5 bg-surface-2 border border-border rounded-lg"
                >
                  <div className="mt-0.5 shrink-0">
                    {log.status === "success" ? (
                      <CheckCircle size={13} className="text-success" />
                    ) : log.status === "warning" ? (
                      <AlertCircle size={13} className="text-warning" />
                    ) : (
                      <AlertCircle size={13} className="text-danger" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-text-primary">{log.summary}</div>
                    <div className="text-[10px] text-text-muted mt-0.5">{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-[12px] text-text-muted">暂无运行记录</div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-border p-3 space-y-2 shrink-0">
          <div className="flex items-end gap-2 bg-surface-2 border border-border rounded-xl px-3 py-2">
            <textarea
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleFollowUp();
                }
              }}
              placeholder="调整配置、查看详情、追问结果..."
              rows={1}
              className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted resize-none focus:outline-none leading-relaxed"
            />
            <Button
              type="button"
              size="inline"
              onClick={handleFollowUp}
              className="p-1.5 bg-accent text-accent-fg rounded-lg shrink-0 hover:bg-accent-hover transition-colors"
            >
              <Send size={12} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="inline"
              onClick={() => navigate("/app/sessions")}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-surface-2 border border-border rounded-lg text-[11px] text-text-primary hover:bg-surface-3 transition-colors"
            >
              <ExternalLink size={11} />在 Session 中编辑
            </Button>
            <Button
              type="button"
              size="inline"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-surface-2 border border-border rounded-lg text-[11px] text-text-primary hover:bg-surface-3 transition-colors"
            >
              {item.enabled ? <Pause size={11} /> : <Play size={11} />}
              {item.enabled ? "暂停" : "启动"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SchedulesTab({ onSelectItem }: { onSelectItem: (item: AutomationDetail) => void }) {
  return (
    <div className="space-y-3">
      {/* Template grid */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={13} className="text-clone" />
          <span className="text-[12px] font-medium text-text-secondary">Start with a template</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {AUTOMATION_TEMPLATES.map((t) => (
            <button
              key={t.name}
              className="p-3 bg-surface-2 border border-border rounded-xl hover:border-border-hover transition-colors text-left group"
            >
              <div
                className={`w-7 h-7 rounded-lg ${t.color.split(" ")[0]} flex items-center justify-center mb-2`}
              >
                <t.icon size={14} className={t.color.split(" ")[1]} />
              </div>
              <div className="text-[12px] font-medium text-text-primary mb-0.5">{t.name}</div>
              <div className="text-[10px] text-text-muted leading-relaxed line-clamp-2">
                {t.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active automations */}
      <div className="flex items-center gap-2 mb-3">
        <Clock size={13} className="text-text-muted" />
        <span className="text-[12px] font-medium text-text-secondary">Active automations</span>
        <span className="text-[10px] text-text-muted bg-surface-3 px-1.5 py-0.5 rounded-full">
          {SCHEDULED_TASKS.filter((t) => t.enabled).length}
        </span>
      </div>
      {SCHEDULED_TASKS.map((task) => (
        <div
          key={task.id}
          role="button"
          tabIndex={0}
          onClick={() =>
            onSelectItem({
              type: "schedule",
              id: task.id,
              name: task.name,
              icon: task.icon,
              enabled: task.enabled,
            })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter")
              onSelectItem({
                type: "schedule",
                id: task.id,
                name: task.name,
                icon: task.icon,
                enabled: task.enabled,
              });
          }}
          className={`flex items-start gap-4 p-4 bg-surface-2 border border-border rounded-xl transition-colors cursor-pointer ${
            task.enabled ? "hover:border-border-hover" : "opacity-60"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              task.enabled ? "bg-clone/10" : "bg-surface-3"
            }`}
          >
            <task.icon size={16} className={task.enabled ? "text-clone" : "text-text-muted"} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-text-primary">{task.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-surface-3 rounded text-text-muted font-mono">
                {task.cron}
              </span>
            </div>
            <div className="text-xs text-text-secondary mt-1">{task.desc}</div>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-text-muted">
              <span>📍 {task.channel}</span>
              <span>· 上次运行：{task.lastRun}</span>
            </div>
            {(task as any).stats && (
              <div className="mt-2 px-2.5 py-1.5 bg-surface-3 rounded-md text-[11px] text-text-secondary">
                {(task as any).stats}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {task.enabled ? (
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-md hover:bg-surface-3 text-success transition-colors"
              >
                <Pause size={14} />
              </button>
            ) : (
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-md hover:bg-surface-3 text-text-muted transition-colors"
              >
                <Play size={14} />
              </button>
            )}
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-md hover:bg-surface-3 text-text-muted transition-colors"
            >
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        size="inline"
        className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-border rounded-xl text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
      >
        <Plus size={16} />
        新建定时任务
      </Button>
    </div>
  );
}

function ProactiveTab({ onSelectItem }: { onSelectItem: (item: AutomationDetail) => void }) {
  return (
    <div className="space-y-3">
      <Alert variant="info" className="mb-4 border-clone/20 bg-clone/5 [&>svg]:text-clone">
        <Brain size={16} aria-hidden="true" className="text-clone" />
        <AlertDescription className="text-[13px] leading-relaxed">
          主动规则让分身<span className="text-text-primary font-medium">不等你开口就主动帮你</span>
          。 分身会根据上下文触发规则，在合适的时机推送信息或执行操作。
        </AlertDescription>
      </Alert>

      {PROACTIVE_RULES.map((rule) => (
        <div
          key={rule.id}
          role="button"
          tabIndex={0}
          onClick={() =>
            onSelectItem({
              type: "proactive",
              id: rule.id,
              name: rule.name,
              icon: Zap,
              enabled: rule.enabled,
            })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter")
              onSelectItem({
                type: "proactive",
                id: rule.id,
                name: rule.name,
                icon: Zap,
                enabled: rule.enabled,
              });
          }}
          className="p-4 bg-surface-2 border border-border rounded-xl hover:border-border-hover transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap size={14} className={rule.enabled ? "text-clone" : "text-text-muted"} />
              <span className="text-[13px] font-medium text-text-primary">{rule.name}</span>
            </div>
            <button
              onClick={(e) => e.stopPropagation()}
              className="text-text-muted hover:text-text-secondary transition-colors"
            >
              {rule.enabled ? (
                <ToggleRight size={20} className="text-clone" />
              ) : (
                <ToggleLeft size={20} />
              )}
            </button>
          </div>
          <div className="text-xs text-text-secondary">
            <span className="text-text-muted">触发：</span>
            {rule.trigger}
          </div>
          <div className="text-xs text-text-secondary mt-1">
            <span className="text-text-muted">动作：</span>
            {rule.action}
          </div>
          <div className="mt-2 px-3 py-2 bg-surface-3 rounded-md text-[11px] text-text-tertiary italic">
            {rule.example}
          </div>
        </div>
      ))}
    </div>
  );
}

function LogsTab() {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3 px-3 py-2 text-[11px] text-text-muted font-medium uppercase tracking-wider">
        <span className="w-12">时间</span>
        <span className="w-14">类型</span>
        <span className="flex-1">名称</span>
        <span className="w-20">状态</span>
        <span className="flex-1">详情</span>
      </div>
      {ACTIVITY_LOGS.map((log, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2.5 bg-surface-2 border border-border rounded-lg text-[13px]"
        >
          <span className="w-12 text-text-muted font-mono text-xs">{log.time}</span>
          <span className="w-14">
            {log.type === "schedule" ? (
              <span className="text-[10px] px-1.5 py-0.5 bg-info-subtle text-info rounded">
                定时
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 bg-clone/10 text-clone rounded">主动</span>
            )}
          </span>
          <span className="flex-1 text-text-primary">{log.name}</span>
          <span className="w-20">
            {log.status === "success" ? (
              <span className="flex items-center gap-1 text-success text-xs">
                <CheckCircle size={12} /> 成功
              </span>
            ) : (
              <span className="flex items-center gap-1 text-warning text-xs">
                <AlertCircle size={12} /> 注意
              </span>
            )}
          </span>
          <span className="flex-1 text-text-secondary text-xs">{log.detail}</span>
        </div>
      ))}
    </div>
  );
}

const TABS_CONFIG = [
  { id: "schedules" as const, label: "定时任务", icon: Clock, count: 8 },
  { id: "proactive" as const, label: "Proactive", icon: Brain, count: 7 },
  { id: "logs" as const, label: "活动日志", icon: Zap, count: null },
];

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState<TabId>("schedules");
  const [selectedItem, setSelectedItem] = useState<AutomationDetail | null>(null);
  const { expandFileTree } = useProductLayout();
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Automation</h1>
            <p className="text-sm text-text-secondary mt-1">
              设置自动任务，让分身帮你全天候工作。
              <Button
                type="button"
                size="inline"
                onClick={expandFileTree}
                className="font-mono text-text-primary hover:text-accent transition-colors ml-1 inline-flex items-center gap-1"
              >
                <FolderOpen size={12} />
                ~/clone/automation/
              </Button>
            </p>
          </div>
          <Button
            type="button"
            size="inline"
            onClick={() => navigate("/app/sessions")}
            className="flex items-center gap-1.5 px-4 py-2 bg-accent text-accent-fg rounded-lg text-[13px] font-medium hover:bg-accent-hover transition-colors"
          >
            <Plus size={14} />
            New automation
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "活跃任务", value: "8", icon: Clock, tone: "info" as const },
            { label: "主动规则", value: "7", icon: Brain, tone: "accent" as const },
            { label: "今日触发", value: "14", icon: Zap, tone: "success" as const },
            {
              label: "成功率",
              value: "96%",
              icon: CheckCircle,
              tone: "success" as const,
              progress: 96,
              progressVariant: "success" as const,
            },
          ].map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              icon={s.icon}
              tone={s.tone}
              progress={s.progress}
              progressVariant={s.progressVariant}
              className="p-4"
            />
          ))}
        </div>

        {/* Tabs */}
        <ToggleGroup
          type="single"
          value={activeTab}
          onValueChange={(value: string) => {
            if (value) setActiveTab(value as TabId);
          }}
          variant="underline"
          aria-label="Automation views"
          className="mb-6"
        >
          {TABS_CONFIG.map((t) => (
            <ToggleGroupItem
              key={t.id}
              value={t.id}
              variant="underline"
              className="gap-1.5 text-[13px]"
            >
              <t.icon size={14} />
              {t.label}
              {t.count && (
                <span className="text-[10px] text-text-muted bg-surface-3 px-1.5 py-0.5 rounded-full ml-1">
                  {t.count}
                </span>
              )}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {activeTab === "schedules" && <SchedulesTab onSelectItem={setSelectedItem} />}
        {activeTab === "proactive" && <ProactiveTab onSelectItem={setSelectedItem} />}
        {activeTab === "logs" && <LogsTab />}

        {/* Bottom note */}
        <Alert className="mt-8 p-3 text-xs">
          <Pencil size={12} aria-hidden="true" className="text-text-muted shrink-0" />
          <AlertTitle className="text-xs font-medium text-text-secondary">
            所有自动任务配置透明可查看，活动日志实时更新。
          </AlertTitle>
        </Alert>
      </div>

      {selectedItem && (
        <AutomationDetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
