import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  DetailPanel,
  DetailPanelCloseButton,
  DetailPanelContent,
  DetailPanelHeader,
  DetailPanelTitle,
  EntityCard,
  EntityCardContent,
  EntityCardDescription,
  EntityCardFooter,
  EntityCardHeader,
  EntityCardMedia,
  EntityCardMeta,
  EntityCardTitle,
  FollowUpInput,
  PageHeader,
  PanelFooter,
  PanelFooterActions,
  ScrollArea,
  StatCard,
  ToggleGroup,
  ToggleGroupItem,
} from "@nexu-design/ui-web";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Bell,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Database,
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
  Shield,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type * as React from "react";
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

interface ActivityLog {
  time: string;
  type: "schedule" | "proactive";
  name: string;
  status: RunLog["status"];
  detail: string;
}

function getCardActionProps(action: () => void) {
  return {
    role: "button" as const,
    tabIndex: 0,
    onClick: action,
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        action();
      }
    },
  };
}

function getLogStatusBadgeVariant(status: RunLog["status"]) {
  switch (status) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    default:
      return "destructive";
  }
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
    <DetailPanel width={400} className="animate-slide-in-right border-l border-border shadow-2xl">
      <DetailPanelHeader>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-clone/10">
          <item.icon size={16} className="text-clone" />
        </div>
        <div className="min-w-0 flex-1">
          <DetailPanelTitle className="text-[13px]">{item.name}</DetailPanelTitle>
          <div className="mt-1 flex flex-wrap items-center gap-1">
            <Badge
              variant={item.type === "schedule" ? "secondary" : "accent"}
              size="xs"
              radius="md"
            >
              {item.type === "schedule" ? "定时任务" : "主动规则"}
            </Badge>
            <Badge variant={item.enabled ? "success" : "outline"} size="xs" radius="md">
              {item.enabled ? "运行中" : "已暂停"}
            </Badge>
          </div>
        </div>
        <DetailPanelCloseButton onClick={onClose} srLabel="关闭自动化详情" />
      </DetailPanelHeader>

      <DetailPanelContent className="p-0">
        <ScrollArea className="h-full">
          {/* Config info */}
          <div className="shrink-0 border-b border-border px-4 py-3">
            {task && (
              <div className="space-y-2 text-[12px]">
                <div className="flex items-center gap-2">
                  <Clock size={12} className="shrink-0 text-text-muted" />
                  <span className="text-text-muted">频率</span>
                  <Badge variant="secondary" size="xs" radius="md" className="ml-auto font-mono">
                    {task.cron}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare size={12} className="shrink-0 text-text-muted" />
                  <span className="text-text-muted">推送到</span>
                  <Badge variant="outline" size="xs" radius="md" className="ml-auto">
                    {task.channel}
                  </Badge>
                </div>
                <div className="mt-1 text-[11px] text-text-secondary">{task.desc}</div>
              </div>
            )}
            {rule && (
              <div className="space-y-2 text-[12px]">
                <div className="flex items-start gap-2">
                  <Zap size={12} className="mt-0.5 shrink-0 text-text-muted" />
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="accent" size="xs" radius="md">
                      触发
                    </Badge>
                    <span className="text-text-primary">{rule.trigger}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" size="xs" radius="md">
                    动作
                  </Badge>
                  <span className="text-[11px] text-text-secondary">{rule.action}</span>
                </div>
                <div className="rounded-md bg-surface-3 px-2.5 py-1.5 text-[11px] italic text-text-tertiary">
                  {rule.example}
                </div>
              </div>
            )}
          </div>

          {/* Run history */}
          <div>
            <div className="px-4 pt-3 pb-1">
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                运行记录
              </div>
            </div>
            {logs.length > 0 ? (
              <div className="space-y-1.5 px-4 pb-3">
                {logs.map((log) => (
                  <div
                    key={`${log.time}-${log.summary}`}
                    className="flex items-start gap-2.5 rounded-lg border border-border bg-surface-2 p-2.5"
                  >
                    <div className="mt-0.5 shrink-0">
                      {log.status === "success" ? (
                        <CheckCircle size={13} className="text-success" />
                      ) : log.status === "warning" ? (
                        <AlertCircle size={13} className="text-warning" />
                      ) : (
                        <AlertCircle size={13} className="text-error" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getLogStatusBadgeVariant(log.status)} size="xs" radius="md">
                          {log.status === "success"
                            ? "成功"
                            : log.status === "warning"
                              ? "注意"
                              : "失败"}
                        </Badge>
                        <div className="text-[10px] text-text-muted">{log.time}</div>
                      </div>
                      <div className="mt-1 text-[11px] text-text-primary">{log.summary}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-[12px] text-text-muted">暂无运行记录</div>
            )}
          </div>
        </ScrollArea>
      </DetailPanelContent>

      <PanelFooter align="start" className="flex-col items-stretch p-3">
        <div className="space-y-2 w-full">
          <FollowUpInput
            value={followUp}
            onValueChange={setFollowUp}
            onSend={handleFollowUp}
            placeholder="调整配置、查看详情、追问结果..."
            sendLabel="发送自动化追问"
          />
          <PanelFooterActions className="w-full gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/app/sessions")}
              className="flex-1"
            >
              <ArrowUpRight size={14} className="shrink-0" />在 Session 中编辑
            </Button>
            <Button type="button" variant="outline" size="sm" className="flex-1">
              {item.enabled ? <Pause size={14} /> : <Play size={14} />}
              {item.enabled ? "暂停" : "启动"}
            </Button>
          </PanelFooterActions>
        </div>
      </PanelFooter>
    </DetailPanel>
  );
}

function SchedulesTab({ onSelectItem }: { onSelectItem: (item: AutomationDetail) => void }) {
  const navigate = useNavigate();

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
            <EntityCard
              key={t.name}
              interactive
              className="group h-full"
              {...getCardActionProps(() => navigate("/app/sessions"))}
            >
              <EntityCardHeader className="px-3 pt-3 pb-0">
                <EntityCardMedia className={`h-7 w-7 rounded-lg border-0 ${t.color.split(" ")[0]}`}>
                  <t.icon size={14} className={t.color.split(" ")[1]} />
                </EntityCardMedia>
              </EntityCardHeader>
              <EntityCardContent className="px-3 pt-2 pb-3">
                <EntityCardTitle className="text-[12px] font-medium">{t.name}</EntityCardTitle>
                <EntityCardDescription className="line-clamp-2 text-[10px] leading-relaxed">
                  {t.desc}
                </EntityCardDescription>
              </EntityCardContent>
              <EntityCardFooter className="justify-end border-0 px-3 pt-0 pb-3">
                <Badge variant="outline" size="xs" radius="md">
                  使用模板
                </Badge>
              </EntityCardFooter>
            </EntityCard>
          ))}
        </div>
      </div>

      {/* Active automations */}
      <div className="flex items-center gap-2 mb-3">
        <Clock size={13} className="text-text-muted" />
        <span className="text-[12px] font-medium text-text-secondary">Active automations</span>
        <Badge variant="secondary" size="xs">
          {SCHEDULED_TASKS.filter((t) => t.enabled).length}
        </Badge>
      </div>
      {SCHEDULED_TASKS.map((task) => {
        const selectTask = () =>
          onSelectItem({
            type: "schedule",
            id: task.id,
            name: task.name,
            icon: task.icon,
            enabled: task.enabled,
          });

        return (
          <EntityCard
            key={task.id}
            interactive
            className={task.enabled ? undefined : "opacity-60"}
            {...getCardActionProps(selectTask)}
          >
            <EntityCardHeader>
              <EntityCardMedia
                className={task.enabled ? "bg-clone/10 text-clone" : "bg-surface-3 text-text-muted"}
              >
                <task.icon size={16} />
              </EntityCardMedia>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <EntityCardTitle className="text-[13px] font-medium">{task.name}</EntityCardTitle>
                  <Badge variant="secondary" size="xs" radius="md" className="font-mono">
                    {task.cron}
                  </Badge>
                  <Badge variant={task.enabled ? "success" : "outline"} size="xs" radius="md">
                    {task.enabled ? "运行中" : "已暂停"}
                  </Badge>
                </div>
                <EntityCardDescription className="mt-1 text-xs">{task.desc}</EntityCardDescription>
                <EntityCardMeta className="mt-2 gap-3 text-[11px]">
                  <Badge variant="outline" size="xs" radius="md">
                    {task.channel}
                  </Badge>
                  <span>上次运行：{task.lastRun}</span>
                </EntityCardMeta>
              </div>
            </EntityCardHeader>
            <EntityCardContent>
              {task.stats && (
                <div className="rounded-md bg-surface-2 px-2.5 py-1.5 text-[11px] text-text-secondary">
                  {task.stats}
                </div>
              )}
            </EntityCardContent>
            <EntityCardFooter className="justify-end pt-0">
              <Badge variant={task.enabled ? "success" : "outline"} size="xs" radius="md">
                {task.enabled ? (
                  <span className="inline-flex items-center gap-1">
                    <Pause size={12} /> 暂停
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <Play size={12} /> 启动
                  </span>
                )}
              </Badge>
              <Badge variant="outline" size="xs" radius="md">
                <span className="inline-flex items-center gap-1">
                  <MoreHorizontal size={12} /> 更多
                </span>
              </Badge>
            </EntityCardFooter>
          </EntityCard>
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-dashed text-text-secondary hover:text-text-primary"
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

      {PROACTIVE_RULES.map((rule) => {
        const selectRule = () =>
          onSelectItem({
            type: "proactive",
            id: rule.id,
            name: rule.name,
            icon: Zap,
            enabled: rule.enabled,
          });

        return (
          <EntityCard key={rule.id} interactive {...getCardActionProps(selectRule)}>
            <EntityCardHeader>
              <EntityCardMedia
                className={rule.enabled ? "bg-clone/10 text-clone" : "bg-surface-3 text-text-muted"}
              >
                <Zap size={16} />
              </EntityCardMedia>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <EntityCardTitle className="text-[13px] font-medium">
                      {rule.name}
                    </EntityCardTitle>
                    <Badge variant="accent" size="xs" radius="md">
                      主动规则
                    </Badge>
                    <Badge variant={rule.enabled ? "success" : "outline"} size="xs" radius="md">
                      {rule.enabled ? "启用中" : "已关闭"}
                    </Badge>
                  </div>
                  {rule.enabled ? (
                    <ToggleRight size={20} className="shrink-0 text-clone" />
                  ) : (
                    <ToggleLeft size={20} className="shrink-0 text-text-muted" />
                  )}
                </div>
                <EntityCardMeta className="mt-2 gap-1.5 text-[11px]">
                  <Badge variant="secondary" size="xs" radius="md">
                    触发
                  </Badge>
                  <span>{rule.trigger}</span>
                </EntityCardMeta>
              </div>
            </EntityCardHeader>
            <EntityCardContent>
              <EntityCardDescription className="mt-0 text-xs">{rule.action}</EntityCardDescription>
              <div className="mt-2 rounded-md bg-surface-2 px-3 py-2 text-[11px] italic text-text-tertiary">
                {rule.example}
              </div>
            </EntityCardContent>
          </EntityCard>
        );
      })}
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
      {(ACTIVITY_LOGS as ActivityLog[]).map((log) => (
        <div
          key={`${log.time}-${log.name}`}
          className="flex items-center gap-3 px-3 py-2.5 bg-surface-2 border border-border rounded-lg text-[13px]"
        >
          <span className="w-12 text-text-muted font-mono text-xs">{log.time}</span>
          <span className="w-14">
            <Badge variant={log.type === "schedule" ? "secondary" : "accent"} size="xs" radius="md">
              {log.type === "schedule" ? "定时" : "主动"}
            </Badge>
          </span>
          <span className="flex-1 text-text-primary">{log.name}</span>
          <span className="w-20">
            <Badge variant={getLogStatusBadgeVariant(log.status)} size="xs" radius="md">
              <span className="inline-flex items-center gap-1">
                {log.status === "success" ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                {log.status === "success" ? "成功" : log.status === "warning" ? "注意" : "失败"}
              </span>
            </Badge>
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
    <div className="flex h-full min-h-0 bg-surface-0">
      <div className={`${selectedItem ? "min-w-0 flex-1" : "w-full"}`}>
        <ScrollArea className="h-full">
          <div className="mx-auto max-w-3xl px-6 py-8">
            <PageHeader
              density="shell"
              className="mb-4"
              title="Automation"
              description={
                <>
                  设置自动任务，让分身帮你全天候工作。
                  <Button
                    type="button"
                    size="inline"
                    onClick={expandFileTree}
                    className="ml-1 inline-flex items-center gap-1 font-mono text-text-primary transition-colors hover:text-accent"
                  >
                    <FolderOpen size={12} />
                    ~/clone/automation/
                  </Button>
                </>
              }
              actions={
                <Button type="button" size="sm" onClick={() => navigate("/app/sessions")}>
                  <Plus size={14} />
                  New automation
                </Button>
              }
            />

            {/* Stats */}
            <div className="mb-6 grid grid-cols-4 gap-3">
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
                    <Badge variant="secondary" size="xs" className="ml-1">
                      {t.count}
                    </Badge>
                  )}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            {activeTab === "schedules" && <SchedulesTab onSelectItem={setSelectedItem} />}
            {activeTab === "proactive" && <ProactiveTab onSelectItem={setSelectedItem} />}
            {activeTab === "logs" && <LogsTab />}

            {/* Bottom note */}
            <Alert className="mt-8 p-3 text-xs">
              <Pencil size={12} aria-hidden="true" className="shrink-0 text-text-muted" />
              <AlertTitle className="text-xs font-medium text-text-secondary">
                所有自动任务配置透明可查看，活动日志实时更新。
              </AlertTitle>
            </Alert>
          </div>
        </ScrollArea>
      </div>

      {selectedItem && (
        <AutomationDetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
