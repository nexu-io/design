import {
  Badge,
  Button,
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
  ConversationMessage,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EntityCard,
  EntityCardContent,
  EntityCardDescription,
  EntityCardHeader,
  EntityCardMeta,
  EntityCardTitle,
  FilterPillTrigger,
  FilterPills,
  FilterPillsList,
  FormField,
  FormFieldControl,
  Input,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  PageHeader,
  PanelFooter,
  PanelFooterActions,
  PanelFooterMeta,
  ScrollArea,
  Sheet,
  SheetContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@nexu-design/ui-web";
import {
  BarChart3,
  Building,
  Check,
  Code,
  Download,
  FileText,
  FolderOpen,
  GitBranch,
  Lock,
  Megaphone,
  MessageSquare,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  Server,
  Settings,
  Shield,
  Sparkles,
  Star,
  Users,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useProductLayout } from "./ProductLayoutContext";

type TabId = "installed" | "featured" | "explore";
type ExploreCategory = "All" | "integration" | "developer" | "productivity" | "design" | "business";

interface Skill {
  name: string;
  desc: string;
  icon: React.ElementType;
  author: string;
  installs: string;
  certified: boolean;
  installed: boolean;
  category: string;
}

const INSTALLED_SKILLS: Skill[] = [
  {
    name: "Memory & Notes",
    desc: "自动记忆管理，知识沉淀",
    icon: FileText,
    author: "nexu",
    installs: "12.4k",
    certified: true,
    installed: true,
    category: "base",
  },
  {
    name: "Task Manager",
    desc: "待办创建、追踪、提醒",
    icon: BarChart3,
    author: "nexu",
    installs: "11.2k",
    certified: true,
    installed: true,
    category: "base",
  },
  {
    name: "Daily Digest",
    desc: "每日汇总日程 + 待办 + 要事",
    icon: FileText,
    author: "nexu",
    installs: "9.8k",
    certified: true,
    installed: true,
    category: "base",
  },
  {
    name: "Web Research",
    desc: "联网搜索 + 信息整理",
    icon: Search,
    author: "nexu",
    installs: "10.1k",
    certified: true,
    installed: true,
    category: "base",
  },
  {
    name: "Code Automation",
    desc: "代码生成、PR、自动化开发",
    icon: Code,
    author: "nexu",
    installs: "8.3k",
    certified: true,
    installed: true,
    category: "developer",
  },
];

const FEATURED_SKILLS: { title: string; badge: string; desc: string; color: string }[] = [
  {
    title: "Advisory Board (Committee)",
    badge: "SKILLS WE LOVE",
    desc: "Multiple expert agents debate and produce actionable insights.",
    color: "bg-clone/10",
  },
  {
    title: "Contact Intelligence + CRM",
    badge: "NEW",
    desc: "AI-powered relationship management with health scoring.",
    color: "bg-info-subtle",
  },
  {
    title: "Zero-friction Knowledge Ingestion",
    badge: "NEW",
    desc: "Drop links, PDFs, screenshots — auto-process and organize.",
    color: "bg-success-subtle",
  },
];

const RECOMMENDED_SKILLS: Skill[] = [
  {
    name: "Contact Intelligence",
    desc: "联系人健康评分、互动分析、关系管理、主动提醒",
    icon: Users,
    author: "nexu",
    installs: "7.2k",
    certified: true,
    installed: false,
    category: "base",
  },
  {
    name: "Meeting Action Tracker",
    desc: "会议 action item 提取 + mine/theirs 分类 + 完成追踪",
    icon: FileText,
    author: "nexu",
    installs: "6.1k",
    certified: true,
    installed: false,
    category: "productivity",
  },
  {
    name: "Advisory Board",
    desc: "多 Agent 并行分析 → 辩论 → 综合建议 (Committee Technique)",
    icon: Building,
    author: "nexu",
    installs: "3.8k",
    certified: true,
    installed: false,
    category: "founder",
  },
  {
    name: "Knowledge Ingester",
    desc: "零摩擦知识入库：链接/PDF/截图 → 自动抓取、摘要、向量化",
    icon: FileText,
    author: "nexu",
    installs: "5.6k",
    certified: true,
    installed: false,
    category: "base",
  },
  {
    name: "Content Pipeline",
    desc: "灵感 → 全网搜索 → 去重 → 大纲 → 任务卡片",
    icon: Megaphone,
    author: "nexu",
    installs: "4.5k",
    certified: true,
    installed: false,
    category: "marketing",
  },
  {
    name: "Security Auditor",
    desc: "多视角审查系统安全，自我进化规则，异常立即告警",
    icon: Shield,
    author: "nexu",
    installs: "3.2k",
    certified: true,
    installed: false,
    category: "devops",
  },
  {
    name: "PRD Generator",
    desc: "需求文档生成与迭代",
    icon: FileText,
    author: "nexu",
    installs: "6.7k",
    certified: true,
    installed: false,
    category: "product",
  },
  {
    name: "GitHub Digest",
    desc: "每日 PR/Issue 摘要，代码审查提醒",
    icon: Code,
    author: "community/dev-tools",
    installs: "4.1k",
    certified: true,
    installed: false,
    category: "developer",
  },
  {
    name: "Notion Sync",
    desc: "双向同步 Notion 数据库和页面",
    icon: FileText,
    author: "community/alex",
    installs: "3.2k",
    certified: false,
    installed: false,
    category: "integration",
  },
  {
    name: "Email Classifier",
    desc: "邮件智能分类 + 过滤营销/冷推销 + 优先级标注",
    icon: FileText,
    author: "community/inbox-zero",
    installs: "1.9k",
    certified: false,
    installed: false,
    category: "productivity",
  },
  {
    name: "Investor Update",
    desc: "自动生成投资人周报 + 数据可视化",
    icon: Building,
    author: "community/startups",
    installs: "1.5k",
    certified: false,
    installed: false,
    category: "business",
  },
  {
    name: "Deploy Checklist",
    desc: "部署前自动检查清单，CI/CD 集成",
    icon: Server,
    author: "community/devops",
    installs: "2.1k",
    certified: true,
    installed: false,
    category: "devops",
  },
];

const SKILL_DETAILS: Record<
  string,
  {
    longDesc: string;
    triggers: string[];
    tools: string[];
    auth: string[];
    version: string;
    updated: string;
    skillMd: string;
  }
> = {
  "Memory & Notes": {
    longDesc:
      "自动从对话中提取关键记忆，管理知识沉淀。支持记忆分类（想法、口吻、喜好、习惯、近况、目标、世界观、决策）、自动合并去重、对齐率计算。",
    triggers: ["对话中出现重要信息", "用户主动标记", "记忆微调"],
    tools: ["memory_write", "memory_search", "embedding_index"],
    auth: [],
    version: "2.1.0",
    updated: "2026-02-20",
    skillMd:
      '# Memory & Notes\n\ntriggers: ["记忆", "记住", "记录"]\ntools: [memory_write, memory_search]\n\n## Instructions\n自动从对话中提取有价值的信息...\n\n## Categories\n想法, 口吻, 喜好, 习惯, 近况, 目标, 世界观, 决策',
  },
  "Task Manager": {
    longDesc:
      "待办事项的完整生命周期管理：创建、分配、追踪、提醒。支持自然语言输入、自动拆解子任务、截止日提醒、与 Sprint 关联。",
    triggers: ["创建待办", "TODO 提醒", "截止日预警"],
    tools: ["task_create", "task_update", "calendar_read", "feishu_send"],
    auth: ["飞书 OAuth"],
    version: "1.8.0",
    updated: "2026-02-18",
    skillMd:
      '# Task Manager\n\ntriggers: ["待办", "任务", "TODO"]\nschedule: "0 10,15 * * *"\ntools: [task_create, task_update]\n\n## Instructions\n管理待办事项...',
  },
  "Daily Digest": {
    longDesc:
      "每日汇总日程、待办、紧急事项、记忆更新，生成简洁的晨间报告。支持自定义格式和推送渠道。",
    triggers: ["每天 08:30 自动触发"],
    tools: ["calendar_read", "task_list", "memory_search", "feishu_send"],
    auth: ["飞书 OAuth"],
    version: "1.5.0",
    updated: "2026-02-19",
    skillMd:
      '# Daily Digest\n\nschedule: "30 8 * * *"\ntools: [calendar_read, task_list, feishu_send]\n\n## Instructions\n汇总今日日程和待办...',
  },
  "Web Research": {
    longDesc: "联网搜索、信息整理、竞品分析。支持多源搜索、自动摘要、关键信息提取并写入记忆系统。",
    triggers: ["用户请求搜索", "竞品分析", "信息调研"],
    tools: ["web_search", "url_fetch", "markdown_write", "memory_write"],
    auth: [],
    version: "2.0.0",
    updated: "2026-02-21",
    skillMd:
      '# Web Research\n\ntriggers: ["搜索", "查一下", "调研"]\ntools: [web_search, url_fetch]\n\n## Instructions\n联网搜索相关信息...',
  },
  "Code Automation": {
    longDesc:
      "代码生成、PR 创建、自动化开发任务。支持读取项目上下文、生成代码片段、创建 PR、代码审查摘要。",
    triggers: ["代码生成请求", "PR 相关操作"],
    tools: ["code_write", "github_api", "file_read", "file_write"],
    auth: ["GitHub OAuth"],
    version: "1.3.0",
    updated: "2026-02-17",
    skillMd:
      '# Code Automation\n\ntriggers: ["写代码", "生成", "PR"]\ntools: [code_write, github_api]\n\n## Instructions\n根据用户需求生成代码...',
  },
  "PRD Generator": {
    longDesc:
      "需求文档生成与迭代。基于用户描述自动生成结构化 PRD，支持竞品参考、用户故事、优先级排序。",
    triggers: ["需求文档请求", "PRD 生成"],
    tools: ["markdown_write", "memory_search", "web_search"],
    auth: [],
    version: "1.0.0",
    updated: "2026-02-15",
    skillMd:
      '# PRD Generator\n\ntriggers: ["PRD", "需求文档", "产品方案"]\ntools: [markdown_write, memory_search]\n\n## Instructions\n生成产品需求文档...',
  },
  "Contact Intelligence": {
    longDesc:
      "联系人智能管理系统。自动从对话、会议、邮件中提取联系人信息，计算关系健康评分，追踪互动频率，标记需要关注的关键人脉。支持自然语言查询和跨模块主动关联。",
    triggers: ["联系人查询", "关系分析", "人脉管理", "谁"],
    tools: ["contact_scan", "contact_write", "memory_search", "feishu_contacts"],
    auth: ["飞书通讯录"],
    version: "1.0.0",
    updated: "2026-02-22",
    skillMd:
      '# Contact Intelligence\n\ntriggers: ["联系人", "关系", "谁", "上次聊"]\nschedule: "0 9 * * 1"\ntools: [contact_scan, contact_write, memory_search]\n\n## Instructions\n管理联系人网络，计算关系健康度...\n\n## Features\n- 关系健康评分 (互动频率 × 重要性)\n- 重复联系人检测和合并建议\n- 跨模块主动关联 (在其他 session 中插入相关联系人)',
  },
  "Meeting Action Tracker": {
    longDesc:
      '会议行动项全生命周期管理。从会议转录中提取 action items，区分"我的"和"对方的"（waiting on），自动追踪完成情况，未完成时主动提醒跟进。支持自我学习过滤。',
    triggers: ["会议", "action item", "行动项", "纪要"],
    tools: ["transcript_parse", "contact_match", "todo_create", "feishu_send"],
    auth: ["飞书 OAuth"],
    version: "1.0.0",
    updated: "2026-02-22",
    skillMd:
      '# Meeting Action Tracker\n\ntriggers: ["会议", "action item", "行动项"]\ntools: [transcript_parse, contact_match, todo_create]\n\n## Instructions\n1. 解析会议转录\n2. 匹配联系人\n3. 提取 action items，区分 mine vs theirs\n4. 创建 Todo，设置追踪\n\n## Smart Features\n- "waiting on" 追踪对方承诺\n- 自我学习过滤（用户拒绝后更新规则）\n- 每天 3 次自动检查完成情况\n- 14 天自动归档',
  },
  "Advisory Board": {
    longDesc:
      "多 Agent 顾问委员会。将业务数据分配给多个专家角色（财务/营销/增长/运营/产品等），各自独立分析后互相讨论分歧，合并成按优先级排序的建议清单。每天凌晨自动运行。",
    triggers: ["顾问", "分析", "决策建议", "综合评估"],
    tools: ["multi_agent_dispatch", "data_aggregate", "markdown_write", "feishu_send"],
    auth: [],
    version: "1.0.0",
    updated: "2026-02-22",
    skillMd:
      '# Advisory Board\n\ntriggers: ["顾问", "分析", "决策"]\nschedule: "0 2 * * *"\ntools: [multi_agent_dispatch, data_aggregate]\n\n## Instructions\n1. 收集 N 个数据源\n2. 分配给 M 个专家 Agent 并行分析\n3. 汇总分歧，互相辩论\n4. 合并为按优先级排序的建议清单\n5. 编号摘要发送到 IM\n\n## Expert Roles\n财务, 营销, 增长, 运营, 产品, 技术, 用户体验, 竞争分析',
  },
};

function SkillDetailPanel({ skill, onClose }: { skill: Skill; onClose: () => void }) {
  const detail = SKILL_DETAILS[skill.name];
  const { expandFileTree } = useProductLayout();

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-[min(100vw,440px)] gap-0 overflow-hidden p-0 sm:max-w-[440px]"
      >
        <div className="flex h-full flex-col bg-surface-0">
          <div className="border-b border-border px-6 py-6 pr-14">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-3">
                <skill.icon size={22} className="text-text-secondary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-text-primary">{skill.name}</h2>
                  {skill.certified ? <Shield size={14} className="text-success" /> : null}
                </div>
                <p className="mt-0.5 text-xs text-text-muted">{skill.author}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-2xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Download size={10} />
                    {skill.installs} 安装
                  </span>
                  {detail ? (
                    <>
                      <span>v{detail.version}</span>
                      <span>更新于 {detail.updated}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="h-full flex-1">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              {skill.installed ? (
                <>
                  <Badge variant="success" size="default" radius="lg" className="gap-1.5 px-4 py-2">
                    <Check size={14} />
                    已安装
                  </Badge>
                  <Button variant="ghost" size="sm">
                    卸载
                  </Button>
                </>
              ) : (
                <Button size="sm">
                  <Download size={14} />
                  安装此 Skill
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={expandFileTree}
                className="ml-auto"
                aria-label="在文件树中查看"
                title="在文件树中查看"
              >
                <FolderOpen size={14} />
              </Button>
            </div>

            <div className="border-b border-border px-6 py-4">
              <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wider text-text-muted">
                描述
              </h3>
              <p className="text-[13px] leading-relaxed text-text-primary">
                {detail?.longDesc || skill.desc}
              </p>
            </div>

            {detail && (
              <div className="border-b border-border px-6 py-4">
                <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wider text-text-muted">
                  触发条件
                </h3>
                <div className="space-y-1.5">
                  {detail.triggers.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-[12px]">
                      <Zap size={11} className="shrink-0 text-clone" />
                      <span className="text-text-primary">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detail && (
              <div className="border-b border-border px-6 py-4">
                <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wider text-text-muted">
                  使用工具
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {detail.tools.map((t) => (
                    <Badge key={t} variant="outline" size="xs" radius="md" className="font-mono">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {detail && detail.auth.length > 0 && (
              <div className="border-b border-border px-6 py-4">
                <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wider text-text-muted">
                  需要授权
                </h3>
                <div className="space-y-1.5">
                  {detail.auth.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-[12px]">
                      <Lock size={11} className="text-success" />
                      <span className="text-text-primary">{a}</span>
                      <Badge variant="success" size="xs" className="ml-auto">
                        已授权
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detail && (
              <div className="px-6 py-4">
                <div className="mb-2 flex items-center gap-2">
                  <FileText size={12} className="text-text-muted" />
                  <h3 className="text-[12px] font-medium uppercase tracking-wider text-text-muted">
                    SKILL.md
                  </h3>
                  <span className="ml-auto text-[10px] font-mono text-text-muted">
                    ~/clone/skills/{skill.name.toLowerCase().replace(/\s+/g, "-")}/
                  </span>
                </div>
                <pre className="overflow-x-auto rounded-lg border border-border bg-surface-3/60 p-3 text-[11px] font-mono leading-relaxed text-text-secondary whitespace-pre-wrap">
                  {detail.skillMd}
                </pre>
              </div>
            )}
          </ScrollArea>

          <PanelFooter>
            <PanelFooterMeta>Skill metadata, auth, and source are managed here.</PanelFooterMeta>
            <PanelFooterActions>
              <Button size="xs">打开 Session</Button>
            </PanelFooterActions>
          </PanelFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ChatCreatorModal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const chatMessages = [
    { from: "system" as const, content: "你好！告诉我你想要什么样的 Skill，我帮你生成。" },
    { from: "user" as const, content: "我想要一个每天早上自动汇总 GitHub PR 的技能" },
    {
      from: "system" as const,
      content:
        "明白了！让我帮你拆解：\n\n📌 技能名称：GitHub PR Digest\n⏰ 触发条件：每天 09:00\n🔧 调用工具：GitHub API\n📄 输出格式：Markdown 摘要\n\n我来生成 SKILL.md...",
    },
  ];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md" className="max-h-[min(100vh-2rem,600px)] overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-5 py-4 pr-12">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-clone/15">
              <MessageSquare size={12} className="text-clone" />
            </div>
            <DialogTitle className="text-base">对话式创建 Skill</DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            通过对话快速生成 skill 结构、触发条件和工具配置。
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="flex min-h-0 flex-1 flex-col gap-0">
          <ScrollArea className="max-h-[360px] flex-1 px-4 py-4">
            <div className="space-y-3 pr-3">
              {chatMessages.map((msg) => (
                <ConversationMessage
                  key={`${msg.from}-${msg.content}`}
                  variant={msg.from === "user" ? "user" : "assistant"}
                  avatar={
                    msg.from === "system" ? (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-clone/15 text-xs">
                        🛠
                      </div>
                    ) : undefined
                  }
                  bubbleClassName={
                    msg.from === "user" ? "border-accent bg-accent text-accent-fg" : ""
                  }
                  contentClassName="text-xs leading-relaxed"
                >
                  {msg.content}
                </ConversationMessage>
              ))}
              <div className="rounded-xl border border-border/50 bg-surface-3/60 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <FileText size={12} className="text-clone" />
                  <span className="text-[11px] font-mono text-text-secondary">
                    ~/clone/skills/github-pr-digest/SKILL.md
                  </span>
                </div>
                <div className="text-[11px] font-mono text-text-secondary leading-relaxed">
                  <div className="text-text-primary"># GitHub PR Digest</div>
                  <div className="mt-1">triggers: [&quot;PR 汇总&quot;, &quot;代码审查&quot;]</div>
                  <div>schedule: &quot;0 9 * * *&quot;</div>
                  <div>tools: [github_api, markdown_write]</div>
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="border-t border-border px-4 py-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="描述你想要的技能..."
              rows={3}
              className="min-h-[88px] border-border bg-surface-2/60 text-sm"
            />
          </div>
        </DialogBody>
        <DialogFooter className="border-t border-border px-4 py-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            取消
          </Button>
          <Button variant="outline" size="sm">
            继续调整
          </Button>
          <Button size="sm">
            <Send size={14} />
            保存并激活
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WorkflowEditorModal({ onClose }: { onClose: () => void }) {
  const NODES = [
    {
      id: "trigger",
      label: "触发",
      desc: "每天 09:00",
      icon: Zap,
      x: 60,
      y: 40,
      color: "text-warning",
    },
    {
      id: "fetch",
      label: "GitHub API",
      desc: "获取 Open PRs",
      icon: Code,
      x: 220,
      y: 40,
      color: "text-info",
    },
    {
      id: "filter",
      label: "过滤",
      desc: "只看 my team",
      icon: GitBranch,
      x: 380,
      y: 40,
      color: "text-role-programmer",
    },
    {
      id: "format",
      label: "格式化",
      desc: "Markdown 摘要",
      icon: FileText,
      x: 220,
      y: 140,
      color: "text-clone",
    },
    {
      id: "output",
      label: "推送",
      desc: "发到飞书",
      icon: Send,
      x: 380,
      y: 140,
      color: "text-success",
    },
  ];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        size="xl"
        className="h-[min(100vh-2rem,520px)] max-w-[720px] overflow-hidden p-0"
      >
        <DialogHeader className="border-b border-border px-5 py-4 pr-12">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-clone/15">
                <Workflow size={12} className="text-clone" />
              </div>
              <DialogTitle className="text-base">Workflow Editor</DialogTitle>
            </div>
            <Badge variant="outline" size="xs" radius="md" className="font-mono">
              ~/clone/skills/github-pr-digest/
            </Badge>
          </div>
          <DialogDescription className="text-sm">
            可视化配置技能工作流、节点关系和运行参数。
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="flex min-h-0 flex-1 gap-0">
          <div className="relative flex-1 overflow-hidden bg-surface-2/50">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden="true"
              focusable="false"
            >
              <line
                x1="140"
                y1="66"
                x2="220"
                y2="66"
                stroke="var(--color-border-hover)"
                strokeWidth="2"
                strokeDasharray="4,3"
              />
              <line
                x1="300"
                y1="66"
                x2="380"
                y2="66"
                stroke="var(--color-border-hover)"
                strokeWidth="2"
                strokeDasharray="4,3"
              />
              <line
                x1="300"
                y1="66"
                x2="300"
                y2="166"
                stroke="var(--color-border-hover)"
                strokeWidth="2"
                strokeDasharray="4,3"
              />
              <line
                x1="300"
                y1="166"
                x2="380"
                y2="166"
                stroke="var(--color-border-hover)"
                strokeWidth="2"
                strokeDasharray="4,3"
              />
            </svg>
            {NODES.map((n) => (
              <div
                key={n.id}
                className="absolute w-[120px] bg-surface-1 border border-border rounded-xl p-2.5 cursor-move hover:border-border-hover hover:shadow-md transition-all"
                style={{ left: n.x, top: n.y }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <n.icon size={12} className={n.color} />
                  <span className="text-[11px] font-medium text-text-primary">{n.label}</span>
                </div>
                <div className="text-[10px] text-text-muted">{n.desc}</div>
              </div>
            ))}
            <Button
              variant="outline"
              size="xs"
              className="absolute bottom-4 right-4 border-dashed bg-surface-1 text-[11px] text-text-secondary"
            >
              <Plus size={12} />
              添加节点
            </Button>
          </div>
          <ScrollArea className="w-64 border-l border-border/50 px-4 py-4">
            <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-3">
              节点配置
            </div>
            <div className="space-y-4">
              {[
                { label: "名称", value: "GitHub PR Digest" },
                { label: "触发器", value: "Cron: 0 9 * * *" },
                { label: "超时", value: "30s" },
              ].map((f) => (
                <FormField key={f.label} label={f.label}>
                  <FormFieldControl>
                    <Input defaultValue={f.value} size="sm" className="bg-surface-3/60" />
                  </FormFieldControl>
                </FormField>
              ))}
              <div>
                <div className="text-[10px] text-text-muted mb-2">工具</div>
                <div className="space-y-1.5">
                  {["github_api", "markdown_write", "feishu_send"].map((t) => (
                    <Badge
                      key={t}
                      variant="outline"
                      size="xs"
                      radius="md"
                      className="flex w-full items-center justify-start gap-1.5 bg-surface-3/60 px-2 py-1 font-mono text-text-secondary"
                    >
                      <Settings size={9} className="text-text-muted" />
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogBody>
        <DialogFooter className="border-t border-border px-5 py-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            取消
          </Button>
          <Button variant="outline" size="sm">
            预览 SKILL.md
          </Button>
          <Button size="sm">保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SkillRow({ skill, onSelect }: { skill: Skill; onSelect: (s: Skill) => void }) {
  return (
    <InteractiveRow
      onClick={() => onSelect(skill)}
      tone="subtle"
      className="group border-transparent p-3"
    >
      <InteractiveRowLeading>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-3">
          <skill.icon size={16} className="text-text-secondary" />
        </div>
      </InteractiveRowLeading>
      <InteractiveRowContent>
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-medium text-text-primary">{skill.name}</span>
          {skill.certified && <Shield size={11} className="shrink-0 text-success" />}
        </div>
        <div className="truncate text-[12px] text-text-muted">{skill.desc}</div>
      </InteractiveRowContent>
      <InteractiveRowTrailing>
        {skill.installed ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-text-muted hover:text-text-secondary"
            onClick={(e) => e.stopPropagation()}
            aria-label={`编辑 ${skill.name}`}
          >
            <Pencil size={14} />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-text-muted opacity-0 transition-all group-hover:opacity-100 focus-visible:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
            }}
            aria-label={`安装 ${skill.name}`}
            title="安装"
          >
            <Plus size={16} />
          </Button>
        )}
      </InteractiveRowTrailing>
    </InteractiveRow>
  );
}

function InstalledTab({ onSelectSkill }: { onSelectSkill: (s: Skill) => void }) {
  const [chatModal, setChatModal] = useState(false);
  const [workflowModal, setWorkflowModal] = useState(false);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => setChatModal(true)}
          className="h-auto items-start justify-start gap-3 rounded-xl bg-surface-2 p-4 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-clone/10 flex items-center justify-center shrink-0">
            <Pencil size={18} className="text-clone" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-text-primary">Skill Creator</div>
            <div className="text-[11px] text-text-muted">Create or update a skill</div>
          </div>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setWorkflowModal(true)}
          className="h-auto items-start justify-start gap-3 rounded-xl bg-surface-2 p-4 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-info-subtle flex items-center justify-center shrink-0">
            <Workflow size={18} className="text-info" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-text-primary">Workflow Editor</div>
            <div className="text-[11px] text-text-muted">Build visual skill workflows</div>
          </div>
        </Button>
      </div>

      <div className="space-y-0.5">
        {INSTALLED_SKILLS.map((s) => (
          <SkillRow key={s.name} skill={s} onSelect={onSelectSkill} />
        ))}
      </div>

      {chatModal && <ChatCreatorModal onClose={() => setChatModal(false)} />}
      {workflowModal && <WorkflowEditorModal onClose={() => setWorkflowModal(false)} />}
    </div>
  );
}

function FeaturedTab({ onSelectSkill }: { onSelectSkill: (s: Skill) => void }) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 mb-8 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_SKILLS.map((f) => (
          <EntityCard
            key={f.title}
            interactive
            className={`${f.color} rounded-xl hover:opacity-90 transition-opacity`}
          >
            <EntityCardHeader className="p-5 pb-0">
              <div>
                <Badge variant="outline" size="xs" className="mb-2 uppercase tracking-wider">
                  {f.badge}
                </Badge>
                <EntityCardTitle className="leading-snug">{f.title}</EntityCardTitle>
              </div>
            </EntityCardHeader>
            <EntityCardContent className="p-5 pt-2">
              <EntityCardDescription className="text-[11px]">{f.desc}</EntityCardDescription>
              <EntityCardMeta className="mt-4">精选推荐</EntityCardMeta>
            </EntityCardContent>
          </EntityCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        {RECOMMENDED_SKILLS.slice(0, 6).map((s) => (
          <SkillRow key={s.name} skill={s} onSelect={onSelectSkill} />
        ))}
      </div>
    </div>
  );
}

function ExploreTab({ onSelectSkill }: { onSelectSkill: (s: Skill) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ExploreCategory>("All");

  const filteredSkills = RECOMMENDED_SKILLS.filter((skill) => {
    const matchesQuery =
      query.trim().length === 0 ||
      `${skill.name} ${skill.desc} ${skill.author} ${skill.category}`
        .toLowerCase()
        .includes(query.toLowerCase());
    const matchesCategory = category === "All" || skill.category === category;

    return matchesQuery && matchesCategory;
  });

  return (
    <div>
      <div className="mb-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skills..."
          leadingIcon={<Search size={14} />}
          className="bg-surface-2"
        />
      </div>

      <FilterPills
        value={category}
        onValueChange={(value) => setCategory(value as ExploreCategory)}
      >
        <FilterPillsList className="mb-5 flex-wrap">
          {EXPLORE_CATEGORIES.map((item) => (
            <FilterPillTrigger key={item} value={item}>
              {item === "All" ? item : `#${item}`}
            </FilterPillTrigger>
          ))}
        </FilterPillsList>
      </FilterPills>

      <div className="text-[12px] text-text-muted font-medium mb-2">
        {filteredSkills.length} skills available
      </div>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        {filteredSkills.map((s) => (
          <SkillRow key={s.name} skill={s} onSelect={onSelectSkill} />
        ))}
      </div>
    </div>
  );
}

const TABS_CONFIG = [
  { id: "installed" as const, label: "Installed", icon: Wrench, count: INSTALLED_SKILLS.length },
  { id: "featured" as const, label: "Featured", icon: Star, count: null },
  { id: "explore" as const, label: "Explore", icon: Sparkles, count: RECOMMENDED_SKILLS.length },
];

const EXPLORE_CATEGORIES: ExploreCategory[] = [
  "All",
  "integration",
  "developer",
  "productivity",
  "design",
  "business",
];

function isTabId(value: string): value is TabId {
  return TABS_CONFIG.some((tab) => tab.id === value);
}

export default function SkillsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("installed");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const { expandFileTree } = useProductLayout();
  const navigate = useNavigate();
  const quickFindSkills = [...INSTALLED_SKILLS, ...RECOMMENDED_SKILLS].filter(
    (skill, index, skills) =>
      skills.findIndex((candidate) => candidate.name === skill.name) === index,
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <PageHeader
          title="Skills"
          description={
            <>
              Give your clone superpowers.
              <Button
                type="button"
                variant="link"
                size="inline"
                onClick={expandFileTree}
                className="font-mono text-text-primary ml-1 inline-flex items-center gap-1"
              >
                <FolderOpen size={12} />
                ~/clone/skills/
              </Button>
            </>
          }
          actions={
            <Button type="button" onClick={() => navigate("/app/sessions")}>
              <Plus size={14} />
              New skill
            </Button>
          }
        />

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            if (isTabId(value)) {
              setActiveTab(value);
            }
          }}
        >
          <div className="flex items-center justify-between mb-6 gap-4">
            <TabsList variant="underline" className="w-auto">
              {TABS_CONFIG.map((t) => (
                <TabsTrigger key={t.id} value={t.id} variant="underline" className="px-0 pr-4">
                  {t.label}
                  {t.count != null && (
                    <span className="text-[11px] text-text-muted ml-1.5">{t.count}</span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                title="Refresh"
                aria-label="Refresh skills"
              >
                <RefreshCw size={13} />
              </Button>
              <Combobox
                value={selectedSkill?.name}
                onValueChange={(value: string) => {
                  const nextSkill = quickFindSkills.find((skill) => skill.name === value);
                  if (!nextSkill) return;
                  setSelectedSkill(nextSkill);
                  setActiveTab(nextSkill.installed ? "installed" : "explore");
                }}
              >
                <ComboboxTrigger className="h-8 w-48 bg-surface-2 text-[12px]">
                  <span className="flex items-center gap-2 text-left">
                    <Search size={12} className="shrink-0 text-text-muted" />
                    <span className="truncate text-text-primary">
                      {selectedSkill ? selectedSkill.name : "Search skills"}
                    </span>
                  </span>
                </ComboboxTrigger>
                <ComboboxContent>
                  <ComboboxInput placeholder="Search skills" leadingIcon={<Search size={12} />} />
                  <div className="max-h-80 overflow-y-auto p-1">
                    {quickFindSkills.map((skill) => (
                      <ComboboxItem
                        key={skill.name}
                        value={skill.name}
                        textValue={`${skill.name} ${skill.desc} ${skill.category} ${skill.author}`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[12px] font-medium text-text-primary">
                            {skill.name}
                          </div>
                          <div className="truncate text-[11px] text-text-muted">
                            {skill.category} · {skill.author}
                          </div>
                        </div>
                      </ComboboxItem>
                    ))}
                  </div>
                </ComboboxContent>
              </Combobox>
            </div>
          </div>

          <TabsContent value="installed">
            <InstalledTab onSelectSkill={setSelectedSkill} />
          </TabsContent>
          <TabsContent value="featured">
            <FeaturedTab onSelectSkill={setSelectedSkill} />
          </TabsContent>
          <TabsContent value="explore">
            <ExploreTab onSelectSkill={setSelectedSkill} />
          </TabsContent>
        </Tabs>
      </div>

      {selectedSkill && (
        <SkillDetailPanel skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
      )}
    </div>
  );
}
