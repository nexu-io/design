import { Briefcase, Clipboard, Code, type LucideIcon, Palette, Shield } from "lucide-react";

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  level: number;
  alignmentRate: number;
  status: "online" | "busy" | "away" | "offline";
  tasksInProgress: number;
  tasksCompleted: number;
  lastActive: string;
  channel: string;
  icon: LucideIcon;
}

export type IMCardType =
  | "status_query"
  | "alignment_request"
  | "event_notification"
  | "summary_report"
  | "growth_trigger";

export interface TaskProgress {
  name: string;
  progress: number;
  status: string;
  risk?: boolean;
}

export interface StandupMember {
  name: string;
  avatar: string;
  summary: string;
  risk?: string;
  done?: boolean;
}

export interface IMCardBase {
  id: number;
  type: IMCardType;
  from: string;
  fromAvatar: string;
  channel: string;
  time: string;
  read: boolean;
}

export interface StatusQueryCard extends IMCardBase {
  type: "status_query";
  target: string;
  tasks: TaskProgress[];
  note: string;
}

export interface AlignmentRequestCard extends IMCardBase {
  type: "alignment_request";
  topic: string;
  reason: string;
  suggestion: string;
  urgency: "low" | "medium" | "high";
  status: "pending" | "accepted" | "rejected";
}

export interface EventNotificationCard extends IMCardBase {
  type: "event_notification";
  event: string;
  impact: string;
  updates: string[];
}

export interface SummaryReportCard extends IMCardBase {
  type: "summary_report";
  sprintName: string;
  progress: number;
  members: StandupMember[];
  risks: string[];
}

export interface GrowthTriggerCard extends IMCardBase {
  type: "growth_trigger";
  taskTitle: string;
  timeSaved: string;
  manualEstimate: string;
  weeklyStats: { tasks: number; hours: number };
}

export type IMCard =
  | StatusQueryCard
  | AlignmentRequestCard
  | EventNotificationCard
  | SummaryReportCard
  | GrowthTriggerCard;

export interface SprintTask {
  id: string;
  title: string;
  assignee: string;
  status: "done" | "in_progress" | "blocked" | "todo";
  progress: number;
  dependency?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "张三",
    role: "前端工程师",
    avatar: "👨‍💻",
    level: 3,
    alignmentRate: 87,
    status: "online",
    tasksInProgress: 2,
    tasksCompleted: 14,
    lastActive: "刚刚",
    channel: "飞书",
    icon: Code,
  },
  {
    name: "李四",
    role: "后端工程师",
    avatar: "🧑‍💻",
    level: 2,
    alignmentRate: 73,
    status: "online",
    tasksInProgress: 1,
    tasksCompleted: 9,
    lastActive: "5 分钟前",
    channel: "飞书",
    icon: Shield,
  },
  {
    name: "王五",
    role: "UI/UX 设计师",
    avatar: "👩‍🎨",
    level: 3,
    alignmentRate: 91,
    status: "busy",
    tasksInProgress: 3,
    tasksCompleted: 18,
    lastActive: "20 分钟前",
    channel: "Slack",
    icon: Palette,
  },
  {
    name: "赵六",
    role: "产品经理",
    avatar: "👩‍💼",
    level: 4,
    alignmentRate: 95,
    status: "online",
    tasksInProgress: 2,
    tasksCompleted: 22,
    lastActive: "刚刚",
    channel: "飞书",
    icon: Briefcase,
  },
  {
    name: "孙七",
    role: "QA 工程师",
    avatar: "🧑‍🔬",
    level: 1,
    alignmentRate: 45,
    status: "away",
    tasksInProgress: 0,
    tasksCompleted: 3,
    lastActive: "2 小时前",
    channel: "飞书",
    icon: Clipboard,
  },
];

export const IM_CARDS: IMCard[] = [
  {
    id: 1,
    type: "summary_report",
    from: "赵六的分身",
    fromAvatar: "👩‍💼",
    channel: "飞书",
    time: "09:05",
    read: true,
    sprintName: "Sprint 3",
    progress: 58,
    members: [
      {
        name: "张三",
        avatar: "👨‍💻",
        summary: "前端集成(等Gateway) + 单元测试 85%",
        risk: undefined,
      },
      {
        name: "李四",
        avatar: "🧑‍💻",
        summary: "Gateway 重构刚启动",
        risk: "Gateway 进度偏慢",
      },
      { name: "王五", avatar: "👩‍🎨", summary: "设计稿 v2 完成 90%", done: true },
    ],
    risks: ["Gateway 重构进度偏慢，可能影响前端集成"],
  },
  {
    id: 2,
    type: "status_query",
    from: "你的分身",
    fromAvatar: "😊",
    channel: "飞书",
    time: "10:30",
    read: true,
    target: "设计组",
    tasks: [
      { name: "设计稿 v2", progress: 90, status: "周三前完成" },
      { name: "暗色主题", progress: 100, status: "已完成" },
      { name: "交互原型", progress: 60, status: "周三评审" },
    ],
    note: "周三下午可以评审交互原型，提前发你 Figma 链接",
  },
  {
    id: 3,
    type: "event_notification",
    from: "系统通知",
    fromAvatar: "🔔",
    channel: "飞书",
    time: "11:20",
    read: false,
    event: "阻塞解除",
    impact: "你的「前端集成」可以启动了",
    updates: ["任务状态：blocked → ready", "预计完成：周五"],
  },
  {
    id: 4,
    type: "alignment_request",
    from: "张三的分身",
    fromAvatar: "👨‍💻",
    channel: "飞书",
    time: "14:00",
    read: false,
    topic: "Gateway 重构排期提前",
    reason: "前端集成依赖 Gateway 重构，当前尚未开始，整体可能延期 2 天。",
    suggestion: "提前启动 Gateway 重构",
    urgency: "high",
    status: "pending",
  },
  {
    id: 5,
    type: "growth_trigger",
    from: "张三的分身",
    fromAvatar: "👨‍💻",
    channel: "飞书",
    time: "17:30",
    read: true,
    taskTitle: "Sprint 3 周报",
    timeSaved: "2 分钟",
    manualEstimate: "45 分钟",
    weeklyStats: { tasks: 12, hours: 6.5 },
  },
];

// ─── Detail Data ─────────────────────────────────────────

export interface BIPStep {
  label: string;
  status: "done" | "active" | "pending";
  detail?: string;
}

export interface FileOp {
  action: "read" | "write" | "create";
  path: string;
  time?: string;
}

export interface ActivityItem {
  time: string;
  content: string;
  type: "card" | "task" | "alignment" | "session";
}

export interface TaskChangeLog {
  time: string;
  from: string;
  to: string;
}

export const CARD_BIP_FLOWS: Record<number, BIPStep[]> = {
  1: [
    {
      label: "每日 09:00 触发站会汇总",
      status: "done",
      detail: "cron: 0 9 * * 1-5",
    },
    {
      label: "BIP query → 张三、李四、王五的分身",
      status: "done",
      detail: "并行查询 3 个分身的 workspace",
    },
    {
      label: "各分身检索 Sprint 任务记忆",
      status: "done",
      detail: "读取任务状态、进度、风险标注",
    },
    {
      label: "汇总数据 + 风险分析",
      status: "done",
      detail: "聚合进度、检测依赖风险",
    },
    {
      label: "生成 IM 卡片 → 推送飞书 #product-team",
      status: "done",
      detail: "Interactive Card JSON",
    },
  ],
  2: [
    {
      label: '你发起"查询设计组进度"',
      status: "done",
      detail: "用户在 Session 中输入",
    },
    {
      label: "BIP query → 王五的分身",
      status: "done",
      detail: "路由到 /bip/query",
    },
    {
      label: "王五分身检索 Sprint 任务记忆",
      status: "done",
      detail: "读取设计相关任务",
    },
    {
      label: "组装回复 + 分身备注",
      status: "done",
      detail: "附加周三评审时间提醒",
    },
    {
      label: "返回结果 → 渲染 IM 卡片",
      status: "done",
      detail: "自动回复，无需打扰王五",
    },
  ],
  3: [
    {
      label: "李四完成 API 路由层重构",
      status: "done",
      detail: "任务 T-003 进度变更",
    },
    {
      label: "依赖图检测：T-001 阻塞解除",
      status: "done",
      detail: "T-001 依赖 T-003",
    },
    {
      label: "BIP event → 通知张三的分身",
      status: "done",
      detail: "推送阻塞解除事件",
    },
    { label: "生成事件通知卡片", status: "done" },
    { label: "推送飞书 #product-team", status: "done" },
  ],
  4: [
    {
      label: "张三分身检测到依赖风险",
      status: "done",
      detail: "T-001 依赖 T-003，T-003 进度 15%",
    },
    { label: "分析影响：前端集成可能延期 2 天", status: "done" },
    {
      label: "BIP action → 发起对齐请求",
      status: "done",
      detail: "路由到 /bip/action/alignment",
    },
    { label: "生成对齐请求 IM 卡片", status: "done" },
    { label: "推送卡片 → 等待李四确认", status: "active", detail: "⏳ 待回复" },
  ],
  5: [
    {
      label: '张三分身完成"Sprint 3 周报"',
      status: "done",
      detail: "耗时 2 分钟",
    },
    {
      label: "计算效率对比",
      status: "done",
      detail: "手动预估 45 分钟 → 实际 2 分钟",
    },
    { label: "汇总本周数据：12 任务 / 6.5h 节省", status: "done" },
    { label: "生成裂变触发卡片", status: "done" },
    {
      label: "推送到 #product-team（含 CTA）",
      status: "done",
      detail: '"我也想要一个分身"',
    },
  ],
};

export const CARD_FILE_OPS: Record<number, FileOp[]> = {
  1: [
    { action: "read", path: "team/sprint.md", time: "09:05" },
    { action: "create", path: "team/standup/2026-02-23.md", time: "09:05" },
    { action: "write", path: "team/sprint.md", time: "09:05" },
  ],
  2: [
    { action: "read", path: "contacts/王五-设计.md", time: "10:30" },
    { action: "read", path: "team/sprint.md", time: "10:30" },
  ],
  3: [{ action: "write", path: "team/sprint.md", time: "11:20" }],
  4: [
    { action: "read", path: "team/sprint.md", time: "14:00" },
    {
      action: "create",
      path: "team/decisions/2026-02-23-gateway-priority.md",
      time: "14:00",
    },
  ],
  5: [
    {
      action: "create",
      path: "artifacts/reports/sprint-3-weekly.md",
      time: "17:30",
    },
  ],
};

export const MEMBER_ACTIVITIES: Record<string, ActivityItem[]> = {
  张三: [
    {
      time: "14:00",
      content: "发起对齐请求：Gateway 重构排期提前",
      type: "alignment",
    },
    { time: "10:30", content: "被查询任务进度（设计组）", type: "card" },
    {
      time: "09:05",
      content: "站会汇总：前端集成(等Gateway) + 测试 85%",
      type: "card",
    },
    { time: "昨天 16:00", content: "完成单元测试 80% → 85%", type: "task" },
    { time: "昨天 10:00", content: "代问：李四 Gateway 计划", type: "session" },
  ],
  李四: [
    {
      time: "14:00",
      content: "收到对齐请求：Gateway 重构排期",
      type: "alignment",
    },
    { time: "09:05", content: "站会汇总：Gateway 重构刚启动 ⚠️", type: "card" },
    { time: "昨天 18:00", content: "完成 API 路由层重构", type: "task" },
    {
      time: "昨天 14:00",
      content: "接收代问：Gateway 进度查询",
      type: "session",
    },
  ],
  王五: [
    { time: "10:30", content: "分身自动回复：设计组任务进度", type: "card" },
    { time: "09:05", content: "站会汇总：设计稿 v2 完成 90% ✓", type: "card" },
    { time: "昨天 20:00", content: "完成暗色主题适配 100%", type: "task" },
    {
      time: "昨天 16:30",
      content: "对齐通过：设计稿评审时间调整",
      type: "alignment",
    },
  ],
  赵六: [
    { time: "09:05", content: "分身生成站会汇总卡片", type: "card" },
    { time: "昨天 17:00", content: "需求评审进度更新 60% → 70%", type: "task" },
    { time: "昨天 09:05", content: "分身生成昨日站会汇总", type: "card" },
  ],
  孙七: [
    { time: "2 小时前", content: "分身初始化中（Lv.1）", type: "session" },
    { time: "昨天 15:00", content: "创建分身账号", type: "session" },
  ],
};

export const TASK_CHANGE_LOGS: Record<string, TaskChangeLog[]> = {
  "T-001": [
    { time: "11:20 今天", from: "blocked", to: "blocked（部分解除）" },
    { time: "02-22 14:00", from: "in_progress", to: "blocked" },
    { time: "02-20 10:00", from: "todo", to: "in_progress" },
  ],
  "T-002": [
    { time: "昨天 16:00", from: "80%", to: "85%" },
    { time: "02-21 10:00", from: "60%", to: "80%" },
    { time: "02-20 14:00", from: "todo", to: "in_progress" },
  ],
  "T-003": [
    { time: "今天 08:00", from: "todo", to: "in_progress（15%）" },
    { time: "02-22 09:00", from: "—", to: "todo" },
  ],
  "T-005": [
    { time: "今天 09:00", from: "85%", to: "90%" },
    { time: "02-21 14:00", from: "70%", to: "85%" },
    { time: "02-19 10:00", from: "todo", to: "in_progress" },
  ],
  "T-006": [
    { time: "昨天 20:00", from: "in_progress", to: "done（100%）" },
    { time: "02-20 10:00", from: "todo", to: "in_progress" },
  ],
};

export const ALIGNMENT_HISTORY = [
  {
    id: "a1",
    topic: "设计稿评审时间调整",
    from: "王五",
    fromAvatar: "👩‍🎨",
    status: "accepted" as const,
    time: "昨天 16:30",
    reason: "设计稿 v2 需要更多时间打磨暗色主题细节",
    response: "同意，评审推迟到周三",
  },
  {
    id: "a2",
    topic: "API 版本升级方案",
    from: "李四",
    fromAvatar: "🧑‍💻",
    status: "accepted" as const,
    time: "2 天前",
    reason: "v2 API 可以向后兼容，建议逐步迁移",
    response: "同意渐进式升级",
  },
  {
    id: "a3",
    topic: "测试环境部署窗口",
    from: "孙七",
    fromAvatar: "🧑‍🔬",
    status: "rejected" as const,
    time: "3 天前",
    reason: "希望每天下午固定部署窗口",
    response: "当前开发节奏不适合固定窗口",
  },
];

// ─── OKR Data ──────────────────────────────────────────────

export interface KeyResult {
  id: string;
  title: string;
  target: string;
  current: string;
  progress: number;
  owner: string;
  linkedTasks: string[];
  unit?: string;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  owner: string;
  ownerAvatar: string;
  quarter: string;
  progress: number;
  status: "on_track" | "at_risk" | "behind" | "achieved";
  keyResults: KeyResult[];
  tags: string[];
}

export const OBJECTIVES: Objective[] = [
  {
    id: "O-1",
    title: "建立完整的分身协作网络，实现团队效率 2x 提升",
    description:
      "通过 BIP 协议实现分身间自动通信和任务协调，减少人工协调成本，让每个成员的分身成为其 24/7 数字代理",
    owner: "赵六",
    ownerAvatar: "👩‍💼",
    quarter: "2026-Q1",
    progress: 52,
    status: "on_track",
    keyResults: [
      {
        id: "KR-1-1",
        title: "分身网络覆盖率达到 100%",
        target: "5/5 成员",
        current: "4/5 成员",
        progress: 80,
        owner: "赵六",
        linkedTasks: [],
      },
      {
        id: "KR-1-2",
        title: "代问 Session 日均使用量 ≥ 10 次",
        target: "10 次/天",
        current: "6 次/天",
        progress: 60,
        owner: "张三",
        linkedTasks: ["T-001", "T-003"],
        unit: "次/天",
      },
      {
        id: "KR-1-3",
        title: "对齐请求自动发起率 ≥ 70%",
        target: "70%",
        current: "45%",
        progress: 64,
        owner: "李四",
        linkedTasks: ["T-003"],
        unit: "%",
      },
      {
        id: "KR-1-4",
        title: "站会汇总自动化替代率达到 100%",
        target: "100%",
        current: "100%",
        progress: 100,
        owner: "赵六",
        linkedTasks: ["T-008"],
      },
    ],
    tags: ["分身网络", "BIP 协议", "效率"],
  },
  {
    id: "O-2",
    title: "完成 nexu v3 核心产品交付，达到 Demo Day 水准",
    description:
      "前端 + 后端 + 设计系统完成 MVP，具备可展示的端到端用户体验，覆盖 Onboarding → 对话 → 自动化 → 团队 全流程",
    owner: "赵六",
    ownerAvatar: "👩‍💼",
    quarter: "2026-Q1",
    progress: 48,
    status: "at_risk",
    keyResults: [
      {
        id: "KR-2-1",
        title: "前端核心页面完成度 ≥ 90%",
        target: "90%",
        current: "65%",
        progress: 72,
        owner: "张三",
        linkedTasks: ["T-001", "T-002"],
      },
      {
        id: "KR-2-2",
        title: "Gateway API 重构完成并通过集成测试",
        target: "100%",
        current: "15%",
        progress: 15,
        owner: "李四",
        linkedTasks: ["T-003", "T-004"],
      },
      {
        id: "KR-2-3",
        title: "设计系统组件覆盖率 ≥ 85%",
        target: "85%",
        current: "90%",
        progress: 100,
        owner: "王五",
        linkedTasks: ["T-005", "T-006", "T-007"],
      },
      {
        id: "KR-2-4",
        title: "端到端用户旅程可走通（Onboarding → Team）",
        target: "完成",
        current: "70%",
        progress: 70,
        owner: "赵六",
        linkedTasks: ["T-009"],
      },
    ],
    tags: ["产品交付", "v3", "Demo Day"],
  },
  {
    id: "O-3",
    title: "构建数据驱动的团队健康度系统",
    description: "通过分身网络收集任务进度、依赖关系、沟通频率等数据，自动生成团队健康度指标和预警",
    owner: "赵六",
    ownerAvatar: "👩‍💼",
    quarter: "2026-Q1",
    progress: 30,
    status: "behind",
    keyResults: [
      {
        id: "KR-3-1",
        title: "依赖风险自动检测准确率 ≥ 80%",
        target: "80%",
        current: "50%",
        progress: 62,
        owner: "李四",
        linkedTasks: ["T-003"],
      },
      {
        id: "KR-3-2",
        title: "团队负载均衡指数达标（无人超 120%）",
        target: "≤ 120%",
        current: "王五 135%",
        progress: 40,
        owner: "赵六",
        linkedTasks: [],
      },
      {
        id: "KR-3-3",
        title: "周报/月报自动生成功能上线",
        target: "上线",
        current: "开发中",
        progress: 25,
        owner: "张三",
        linkedTasks: ["T-002"],
      },
    ],
    tags: ["数据驱动", "团队健康度", "预警"],
  },
];

// ─── Sprint Enhanced Data (for Gantt) ──────────────────────

export interface SprintTaskGantt extends SprintTask {
  startDate: string;
  endDate: string;
  color?: string;
}

export const SPRINT_META = {
  name: "Sprint 3",
  startDate: "2026-02-17",
  endDate: "2026-03-02",
  totalDays: 14,
};

export const SPRINT_TASKS_GANTT: SprintTaskGantt[] = [
  {
    id: "T-001",
    title: "前端集成",
    assignee: "张三",
    status: "blocked",
    progress: 30,
    dependency: "T-003",
    startDate: "2026-02-20",
    endDate: "2026-02-28",
    color: "bg-danger",
  },
  {
    id: "T-002",
    title: "单元测试",
    assignee: "张三",
    status: "in_progress",
    progress: 85,
    startDate: "2026-02-18",
    endDate: "2026-02-25",
  },
  {
    id: "T-003",
    title: "Gateway 重构",
    assignee: "李四",
    status: "in_progress",
    progress: 15,
    startDate: "2026-02-23",
    endDate: "2026-03-01",
    color: "bg-warning",
  },
  {
    id: "T-004",
    title: "用户鉴权模块",
    assignee: "李四",
    status: "todo",
    progress: 0,
    dependency: "T-005",
    startDate: "2026-02-26",
    endDate: "2026-03-02",
  },
  {
    id: "T-005",
    title: "设计稿 v2",
    assignee: "王五",
    status: "in_progress",
    progress: 90,
    startDate: "2026-02-17",
    endDate: "2026-02-25",
  },
  {
    id: "T-006",
    title: "暗色主题适配",
    assignee: "王五",
    status: "done",
    progress: 100,
    startDate: "2026-02-17",
    endDate: "2026-02-22",
  },
  {
    id: "T-007",
    title: "交互原型",
    assignee: "王五",
    status: "in_progress",
    progress: 60,
    startDate: "2026-02-19",
    endDate: "2026-02-26",
  },
  {
    id: "T-008",
    title: "Sprint 规划",
    assignee: "赵六",
    status: "done",
    progress: 100,
    startDate: "2026-02-17",
    endDate: "2026-02-18",
  },
  {
    id: "T-009",
    title: "需求评审",
    assignee: "赵六",
    status: "in_progress",
    progress: 70,
    startDate: "2026-02-18",
    endDate: "2026-02-24",
  },
];

// ─── Insights Chat Data ────────────────────────────────────

export interface InsightMessage {
  id: string;
  from: "user" | "agent";
  content: string;
  time: string;
  references?: {
    type: "task" | "member" | "okr" | "card";
    label: string;
    id: string;
  }[];
  chart?: {
    type: "bar" | "metric";
    data: { label: string; value: number; color?: string }[];
  };
}

export const INSIGHT_SUGGESTIONS = [
  "本周 Sprint 有什么风险？",
  "谁的任务负载最重？",
  "OKR 哪些 KR 落后了？",
  "张三和李四之间的依赖关系是什么？",
  "帮我生成本周周报",
  "对比上周和本周的进度变化",
];

export const INSIGHT_CONVERSATIONS: InsightMessage[] = [
  {
    id: "i1",
    from: "user",
    content: "Sprint 3 目前有什么风险？",
    time: "14:35",
  },
  {
    id: "i2",
    from: "agent",
    content:
      "分析了 Sprint 3 的 9 个任务，发现 **2 个关键风险**：\n\n1. **Gateway 重构（T-003）进度偏慢** — 当前 15%，预期本周应达 50%。这会直接阻塞张三的前端集成（T-001），影响链路：T-003 → T-001。建议李四优先处理。\n\n2. **王五任务负载过高** — 同时进行 3 个任务（设计稿 v2、交互原型、暗色主题），负载约 135%。虽然暗色主题已完成，但交互原型仅 60% 可能延期。",
    time: "14:35",
    references: [
      { type: "task", label: "T-003 Gateway 重构", id: "T-003" },
      { type: "task", label: "T-001 前端集成", id: "T-001" },
      { type: "member", label: "王五", id: "王五" },
    ],
    chart: {
      type: "bar",
      data: [
        { label: "张三", value: 57, color: "bg-clone" },
        { label: "李四", value: 8, color: "bg-danger" },
        { label: "王五", value: 83, color: "bg-warning" },
        { label: "赵六", value: 85, color: "bg-success" },
      ],
    },
  },
  {
    id: "i3",
    from: "user",
    content: "OKR 进展怎么样？哪些 KR 需要关注？",
    time: "14:38",
  },
  {
    id: "i4",
    from: "agent",
    content:
      "当前 3 个 Objective 的整体健康度：\n\n- **O-1 分身协作网络** (52%) — ✅ On Track，站会汇总已 100% 自动化，但代问使用量和对齐自动率还需提升\n- **O-2 产品交付** (48%) — ⚠️ At Risk，主要瓶颈是 Gateway API 重构仅 15%，拖累整体\n- **O-3 团队健康度** (30%) — 🔴 Behind，负载均衡和自动报告功能均未达标\n\n**最需关注的 KR**：\n1. KR-2-2 Gateway API (15%) — 直接影响产品交付目标\n2. KR-3-2 负载均衡（王五 135%） — 需重新分配任务\n3. KR-1-2 代问使用量（6/10 次/天） — 需推广使用习惯",
    time: "14:38",
    references: [
      { type: "okr", label: "O-2 产品交付", id: "O-2" },
      { type: "okr", label: "KR-2-2 Gateway API", id: "KR-2-2" },
      { type: "member", label: "王五", id: "王五" },
    ],
    chart: {
      type: "metric",
      data: [
        { label: "O-1 协作网络", value: 52, color: "bg-success" },
        { label: "O-2 产品交付", value: 48, color: "bg-warning" },
        { label: "O-3 健康度", value: 30, color: "bg-danger" },
      ],
    },
  },
];

// ─── Task Board Data ────────────────────────────────────────

export type TaskStatus = "backlog" | "todo" | "in_progress" | "done" | "archived";
export type TaskPriority = "urgent" | "high" | "medium" | "low";
export type TaskSource = "manual" | "session" | "im" | "automation" | "okr";
export type TaskExecutor = "human" | "agent" | "hybrid";

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeAvatar: string;
  executor: TaskExecutor;
  source: TaskSource;
  sourceRef?: string;
  sprintId?: string;
  okrId?: string;
  okrTitle?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  progress: number;
  subtasks?: { title: string; done: boolean }[];
  linkedFiles?: string[];
  comments: number;
  dependencies?: string[];
}

export const TASK_BOARD: TaskItem[] = [
  {
    id: "TK-001",
    title: "前端登录页集成 Gateway API",
    description: "完成前端登录页与新 Gateway API 的对接，包括 OAuth 流程和 token 刷新机制",
    status: "in_progress",
    priority: "urgent",
    assignee: "张三",
    assigneeAvatar: "👨‍💻",
    executor: "human",
    source: "okr",
    sourceRef: "KR-2-1",
    sprintId: "Sprint 3",
    okrId: "KR-2-1",
    okrTitle: "前端核心页面完成度 ≥ 90%",
    tags: ["前端", "集成", "阻塞中"],
    createdAt: "02-20",
    updatedAt: "今天 11:20",
    dueDate: "02-28",
    progress: 30,
    subtasks: [
      { title: "OAuth 流程适配", done: true },
      { title: "Token 刷新机制", done: false },
      { title: "错误处理和重试", done: false },
      { title: "登录状态持久化", done: false },
    ],
    linkedFiles: ["frontend/src/auth/login.tsx", "frontend/src/hooks/useAuth.ts"],
    comments: 4,
    dependencies: ["TK-003"],
  },
  {
    id: "TK-002",
    title: "单元测试覆盖率提升至 85%",
    description: "为核心模块补充单元测试，目标覆盖率 85%",
    status: "in_progress",
    priority: "high",
    assignee: "张三",
    assigneeAvatar: "👨‍💻",
    executor: "hybrid",
    source: "manual",
    sprintId: "Sprint 3",
    okrId: "KR-2-1",
    okrTitle: "前端核心页面完成度 ≥ 90%",
    tags: ["测试", "CI/CD"],
    createdAt: "02-18",
    updatedAt: "今天 09:00",
    dueDate: "02-25",
    progress: 85,
    subtasks: [
      { title: "Auth 模块测试", done: true },
      { title: "Chat 模块测试", done: true },
      { title: "File 模块测试", done: true },
      { title: "Team 模块测试", done: false },
    ],
    linkedFiles: ["frontend/src/__tests__/"],
    comments: 2,
  },
  {
    id: "TK-003",
    title: "Gateway API 重构",
    description: "重构 Gateway 层，支持 BIP 协议和分身间通信",
    status: "in_progress",
    priority: "urgent",
    assignee: "李四",
    assigneeAvatar: "🧑‍💻",
    executor: "human",
    source: "okr",
    sourceRef: "KR-2-2",
    sprintId: "Sprint 3",
    okrId: "KR-2-2",
    okrTitle: "Gateway API 重构完成并通过集成测试",
    tags: ["后端", "架构", "关键路径"],
    createdAt: "02-22",
    updatedAt: "今天 08:00",
    dueDate: "03-01",
    progress: 15,
    subtasks: [
      { title: "路由层重构", done: true },
      { title: "BIP 协议接入", done: false },
      { title: "分身通信通道", done: false },
      { title: "集成测试", done: false },
    ],
    linkedFiles: ["backend/src/gateway/", "backend/src/bip/"],
    comments: 6,
  },
  {
    id: "TK-004",
    title: "竞品分析报告更新",
    description: "本周竞品动态汇总，包括 Notion AI blocks 发布分析",
    status: "done",
    priority: "medium",
    assignee: "赵六",
    assigneeAvatar: "👩‍💼",
    executor: "agent",
    source: "automation",
    sourceRef: "竞品监控自动任务",
    tags: ["市场", "竞品", "自动生成"],
    createdAt: "02-23",
    updatedAt: "今天 09:00",
    progress: 100,
    linkedFiles: ["clone/artifacts/reports/competitive-weekly.md"],
    comments: 1,
  },
  {
    id: "TK-005",
    title: "设计稿 v2 最终审查",
    description: "暗色主题和交互原型的最终设计审查",
    status: "in_progress",
    priority: "high",
    assignee: "王五",
    assigneeAvatar: "👩‍🎨",
    executor: "human",
    source: "manual",
    sprintId: "Sprint 3",
    okrId: "KR-2-3",
    okrTitle: "设计系统组件覆盖率 ≥ 85%",
    tags: ["设计", "评审"],
    createdAt: "02-17",
    updatedAt: "今天 10:30",
    dueDate: "02-25",
    progress: 90,
    subtasks: [
      { title: "亮色主题", done: true },
      { title: "暗色主题", done: true },
      { title: "响应式适配", done: true },
      { title: "动效规范", done: false },
    ],
    comments: 3,
  },
  {
    id: "TK-006",
    title: "整理本周站会纪要",
    description: "分身自动汇总本周 5 次站会的要点",
    status: "done",
    priority: "low",
    assignee: "赵六",
    assigneeAvatar: "👩‍💼",
    executor: "agent",
    source: "session",
    sourceRef: "Session #daily-standup",
    tags: ["文档", "自动生成"],
    createdAt: "02-23",
    updatedAt: "今天 17:30",
    progress: 100,
    linkedFiles: ["clone/artifacts/reports/standup-week-8.md"],
    comments: 0,
  },
  {
    id: "TK-007",
    title: "Landing Page 团队协作模块",
    description: "在 Landing Page 增加团队协作、邀请裂变相关展示",
    status: "done",
    priority: "high",
    assignee: "张三",
    assigneeAvatar: "👨‍💻",
    executor: "hybrid",
    source: "session",
    sourceRef: "Session #design-system",
    sprintId: "Sprint 3",
    okrId: "KR-2-4",
    okrTitle: "端到端用户旅程可走通",
    tags: ["前端", "设计系统", "增长"],
    createdAt: "02-23",
    updatedAt: "今天 15:00",
    progress: 100,
    linkedFiles: ["design-system/src/pages/LandingPreview.tsx"],
    comments: 2,
  },
  {
    id: "TK-008",
    title: "用户鉴权模块开发",
    description: "实现用户注册、登录、权限管理模块",
    status: "todo",
    priority: "high",
    assignee: "李四",
    assigneeAvatar: "🧑‍💻",
    executor: "human",
    source: "okr",
    sourceRef: "KR-2-2",
    sprintId: "Sprint 3",
    okrId: "KR-2-2",
    okrTitle: "Gateway API 重构完成并通过集成测试",
    tags: ["后端", "安全"],
    createdAt: "02-22",
    updatedAt: "02-22",
    dueDate: "03-02",
    progress: 0,
    dependencies: ["TK-005"],
    comments: 1,
  },
  {
    id: "TK-009",
    title: "投资人 BP 材料更新",
    description: "基于最新产品进展更新 BP 文档和 Demo 材料",
    status: "backlog",
    priority: "medium",
    assignee: "赵六",
    assigneeAvatar: "👩‍💼",
    executor: "hybrid",
    source: "manual",
    tags: ["融资", "文档"],
    createdAt: "02-20",
    updatedAt: "02-20",
    progress: 0,
    linkedFiles: ["clone/artifacts/reports/investor-bp/"],
    comments: 0,
  },
  {
    id: "TK-010",
    title: "飞书机器人消息卡片适配",
    description: "将 6 种标准 IM 卡片适配为飞书 Interactive Card 格式",
    status: "backlog",
    priority: "medium",
    assignee: "张三",
    assigneeAvatar: "👨‍💻",
    executor: "human",
    source: "im",
    sourceRef: "#product-team",
    tags: ["IM", "飞书", "集成"],
    createdAt: "02-21",
    updatedAt: "02-21",
    progress: 0,
    comments: 3,
  },
  {
    id: "TK-011",
    title: "每日竞品监控自动任务优化",
    description: "优化竞品监控的数据源和分析质量",
    status: "backlog",
    priority: "low",
    assignee: "赵六",
    assigneeAvatar: "👩‍💼",
    executor: "agent",
    source: "automation",
    tags: ["自动化", "竞品"],
    createdAt: "02-19",
    updatedAt: "02-19",
    progress: 0,
    comments: 0,
  },
  {
    id: "TK-012",
    title: "上线前安全审查清单",
    description: "QA 整理安全审查清单，覆盖鉴权、数据隔离、API 限流",
    status: "todo",
    priority: "medium",
    assignee: "孙七",
    assigneeAvatar: "🧑‍🔬",
    executor: "hybrid",
    source: "manual",
    sprintId: "Sprint 3",
    tags: ["QA", "安全"],
    createdAt: "02-22",
    updatedAt: "02-22",
    dueDate: "03-02",
    progress: 0,
    subtasks: [
      { title: "鉴权流程审查", done: false },
      { title: "数据隔离检查", done: false },
      { title: "API 限流配置", done: false },
    ],
    comments: 0,
  },
  {
    id: "TK-013",
    title: "周报自动生成",
    description: "分身自动汇总本周产出，生成结构化周报",
    status: "archived",
    priority: "low",
    assignee: "张三",
    assigneeAvatar: "👨‍💻",
    executor: "agent",
    source: "automation",
    tags: ["自动化", "文档"],
    createdAt: "02-16",
    updatedAt: "02-21",
    progress: 100,
    linkedFiles: ["clone/artifacts/reports/sprint-3-weekly.md"],
    comments: 1,
  },
];

export const SPRINT_TASKS: SprintTask[] = [
  {
    id: "T-001",
    title: "前端集成",
    assignee: "张三",
    status: "blocked",
    progress: 30,
    dependency: "T-003",
  },
  {
    id: "T-002",
    title: "单元测试",
    assignee: "张三",
    status: "in_progress",
    progress: 85,
  },
  {
    id: "T-003",
    title: "Gateway 重构",
    assignee: "李四",
    status: "in_progress",
    progress: 15,
  },
  {
    id: "T-004",
    title: "用户鉴权模块",
    assignee: "李四",
    status: "todo",
    progress: 0,
    dependency: "T-005",
  },
  {
    id: "T-005",
    title: "设计稿 v2",
    assignee: "王五",
    status: "in_progress",
    progress: 90,
  },
  {
    id: "T-006",
    title: "暗色主题适配",
    assignee: "王五",
    status: "done",
    progress: 100,
  },
  {
    id: "T-007",
    title: "交互原型",
    assignee: "王五",
    status: "in_progress",
    progress: 60,
  },
  {
    id: "T-008",
    title: "Sprint 规划",
    assignee: "赵六",
    status: "done",
    progress: 100,
  },
  {
    id: "T-009",
    title: "需求评审",
    assignee: "赵六",
    status: "in_progress",
    progress: 70,
  },
];
