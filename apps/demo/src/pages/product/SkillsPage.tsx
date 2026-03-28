import {
  Button,
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
  DetailPanel,
  DetailPanelCloseButton,
  DetailPanelContent,
  DetailPanelHeader,
  DetailPanelTitle,
  EntityCard,
  EntityCardContent,
  EntityCardDescription,
  EntityCardHeader,
  EntityCardMeta,
  EntityCardTitle,
  PanelFooter,
  PanelFooterActions,
  ScrollArea,
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
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductLayout } from "./ProductLayoutContext";

type TabId = "installed" | "featured" | "explore";

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
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="关闭详情面板"
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <DetailPanel width={420} className="relative shadow-2xl animate-slide-in-right">
        <DetailPanelHeader className="items-start gap-4 p-6">
          <div className="w-12 h-12 rounded-xl bg-surface-3 flex items-center justify-center shrink-0">
            <skill.icon size={22} className="text-text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <DetailPanelTitle className="text-base">{skill.name}</DetailPanelTitle>
              {skill.certified && <Shield size={14} className="text-success" />}
            </div>
            <div className="text-xs text-text-secondary mt-0.5">{skill.author}</div>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-text-muted">
              <span className="flex items-center gap-1">
                <Download size={10} />
                {skill.installs} 安装
              </span>
              {detail && (
                <>
                  <span>v{detail.version}</span>
                  <span>更新于 {detail.updated}</span>
                </>
              )}
            </div>
          </div>
          <DetailPanelCloseButton
            onClick={onClose}
            srLabel="关闭技能详情"
            className="mt-1 hover:bg-surface-3 text-text-muted"
          />
        </DetailPanelHeader>

        <DetailPanelContent>
          <ScrollArea className="h-full flex-1">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              {skill.installed ? (
                <>
                  <span className="flex items-center gap-1.5 px-4 py-2 bg-success-subtle text-success rounded-lg text-[13px] font-medium">
                    <Check size={14} /> 已安装
                  </span>
                  <Button variant="ghost" className="px-4 py-2 text-[13px]">
                    卸载
                  </Button>
                </>
              ) : (
                <Button className="px-5 py-2 text-[13px]">
                  <Download size={14} /> 安装此 Skill
                </Button>
              )}
              <Button
                type="button"
                size="inline"
                onClick={expandFileTree}
                className="ml-auto p-2 rounded-lg hover:bg-surface-3 text-text-muted hover:text-accent transition-colors"
                title="在文件树中查看"
              >
                <FolderOpen size={14} />
              </Button>
            </div>

            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-[12px] font-medium text-text-muted uppercase tracking-wider mb-2">
                描述
              </h3>
              <p className="text-[13px] text-text-primary leading-relaxed">
                {detail?.longDesc || skill.desc}
              </p>
            </div>

            {detail && (
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-[12px] font-medium text-text-muted uppercase tracking-wider mb-2">
                  触发条件
                </h3>
                <div className="space-y-1.5">
                  {detail.triggers.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-[12px]">
                      <Zap size={11} className="text-clone shrink-0" />
                      <span className="text-text-primary">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detail && (
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-[12px] font-medium text-text-muted uppercase tracking-wider mb-2">
                  使用工具
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {detail.tools.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 bg-surface-3 rounded text-[11px] font-mono text-text-secondary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {detail && detail.auth.length > 0 && (
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-[12px] font-medium text-text-muted uppercase tracking-wider mb-2">
                  需要授权
                </h3>
                <div className="space-y-1.5">
                  {detail.auth.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-[12px]">
                      <Lock size={11} className="text-success" />
                      <span className="text-text-primary">{a}</span>
                      <span className="text-[10px] text-success ml-auto">已授权</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detail && (
              <div className="px-6 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={12} className="text-text-muted" />
                  <h3 className="text-[12px] font-medium text-text-muted uppercase tracking-wider">
                    SKILL.md
                  </h3>
                  <span className="text-[10px] text-text-muted font-mono ml-auto">
                    ~/clone/skills/{skill.name.toLowerCase().replace(/\s+/g, "-")}/
                  </span>
                </div>
                <pre className="p-3 bg-surface-3/60 border border-border rounded-lg text-[11px] font-mono text-text-secondary leading-relaxed whitespace-pre-wrap overflow-x-auto">
                  {detail.skillMd}
                </pre>
              </div>
            )}
          </ScrollArea>
        </DetailPanelContent>
        <PanelFooter className="border-t border-border">
          <span className="text-[11px] text-text-muted">
            Skill metadata, auth, and source are managed here.
          </span>
          <PanelFooterActions>
            <Button variant="ghost" size="xs">
              关闭
            </Button>
            <Button size="xs">打开 Session</Button>
          </PanelFooterActions>
        </PanelFooter>
      </DetailPanel>
    </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="关闭对话式创建"
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-[480px] max-h-[600px] bg-surface-1/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-clone/15 flex items-center justify-center">
              <MessageSquare size={12} className="text-clone" />
            </div>
            <span className="text-[13px] font-medium text-text-primary">对话式创建 Skill</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-surface-3 text-text-muted transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((msg) => (
            <div
              key={`${msg.from}-${msg.content}`}
              className={`flex ${msg.from === "user" ? "justify-end" : "gap-2"}`}
            >
              {msg.from === "system" && (
                <div className="w-5 h-5 rounded-full bg-clone/15 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  🛠
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-[12px] leading-relaxed whitespace-pre-line ${
                  msg.from === "user"
                    ? "bg-accent text-accent-fg rounded-br-sm"
                    : "bg-surface-3/80 text-text-primary rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div className="p-3 bg-surface-3/60 border border-border/50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
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
            <div className="flex items-center gap-2 mt-3">
              <Button size="xs" className="flex-1">
                保存并激活
              </Button>
              <Button variant="ghost" size="xs">
                继续调整
              </Button>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-border/50">
          <div className="flex items-end gap-2 bg-surface-3/60 rounded-xl px-3 py-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="描述你想要的技能..."
              rows={1}
              className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted resize-none focus:outline-none leading-relaxed"
            />
            <Button
              type="button"
              size="inline"
              className="p-1.5 bg-accent text-accent-fg rounded-lg shrink-0 hover:bg-accent-hover transition-colors"
            >
              <Send size={12} />
            </Button>
          </div>
        </div>
      </div>
    </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="关闭工作流编辑器"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-[720px] h-[520px] bg-surface-1/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-clone/15 flex items-center justify-center">
                <Workflow size={12} className="text-clone" />
              </div>
              <span className="text-[13px] font-medium text-text-primary">Workflow Editor</span>
            </div>
            <span className="text-[10px] font-mono text-text-muted bg-surface-3 px-1.5 py-0.5 rounded">
              ~/clone/skills/github-pr-digest/
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="xs">
              预览 SKILL.md
            </Button>
            <Button size="xs">保存</Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md hover:bg-surface-3 text-text-muted transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="flex-1 flex">
          <div className="flex-1 relative bg-surface-2/50 overflow-hidden">
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
          <div className="w-52 border-l border-border/50 p-3 overflow-y-auto">
            <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-3">
              节点配置
            </div>
            <div className="space-y-3">
              {[
                { label: "名称", value: "GitHub PR Digest" },
                { label: "触发器", value: "Cron: 0 9 * * *" },
                { label: "超时", value: "30s" },
              ].map((f) => (
                <div key={f.label}>
                  <div className="text-[10px] text-text-muted mb-1">{f.label}</div>
                  <input
                    type="text"
                    defaultValue={f.value}
                    className="w-full px-2 py-1.5 bg-surface-3/60 border border-border/50 rounded-md text-[11px] text-text-primary focus:outline-none focus:border-[var(--color-brand-primary)]/30 focus:ring-1 focus:ring-[var(--color-brand-primary)]/20 transition-colors"
                  />
                </div>
              ))}
              <div>
                <div className="text-[10px] text-text-muted mb-1">工具</div>
                <div className="space-y-1">
                  {["github_api", "markdown_write", "feishu_send"].map((t) => (
                    <div
                      key={t}
                      className="flex items-center gap-1.5 px-2 py-1 bg-surface-3/60 rounded text-[10px] font-mono text-text-secondary"
                    >
                      <Settings size={9} className="text-text-muted" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillRow({ skill, onSelect }: { skill: Skill; onSelect: (s: Skill) => void }) {
  return (
    <button
      type="button"
      className="flex items-center gap-3 p-3 hover:bg-surface-3/50 rounded-lg transition-colors cursor-pointer group"
      onClick={() => onSelect(skill)}
    >
      <div className="w-9 h-9 rounded-xl bg-surface-3 flex items-center justify-center shrink-0">
        <skill.icon size={16} className="text-text-secondary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-medium text-text-primary">{skill.name}</span>
          {skill.certified && <Shield size={11} className="text-success shrink-0" />}
        </div>
        <div className="text-[11px] text-text-muted truncate">{skill.desc}</div>
      </div>
      {skill.installed ? (
        <button
          type="button"
          className="p-1 text-text-muted hover:text-text-secondary transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Pencil size={14} />
        </button>
      ) : (
        <button
          type="button"
          className="p-1.5 rounded-lg hover:bg-surface-3 text-text-muted opacity-0 group-hover:opacity-100 transition-all"
          onClick={(e) => {
            e.stopPropagation();
          }}
          title="安装"
        >
          <Plus size={16} />
        </button>
      )}
    </button>
  );
}

function InstalledTab({ onSelectSkill }: { onSelectSkill: (s: Skill) => void }) {
  const [chatModal, setChatModal] = useState(false);
  const [workflowModal, setWorkflowModal] = useState(false);

  return (
    <div>
      {/* Builder tools — elevated priority */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button
          type="button"
          size="inline"
          onClick={() => setChatModal(true)}
          className="flex items-center gap-3 p-4 bg-surface-2 border border-border rounded-xl hover:border-border-hover transition-colors text-left"
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
          size="inline"
          onClick={() => setWorkflowModal(true)}
          className="flex items-center gap-3 p-4 bg-surface-2 border border-border rounded-xl hover:border-border-hover transition-colors text-left"
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

      {/* Installed skills list */}
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
      {/* Featured cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {FEATURED_SKILLS.map((f) => (
          <EntityCard
            key={f.title}
            interactive
            className={`${f.color} rounded-xl hover:opacity-90 transition-opacity`}
          >
            <EntityCardHeader className="p-5 pb-0">
              <div>
                <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-text-muted">
                  {f.badge}
                </div>
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

      {/* Recommended list — two columns */}
      <div className="grid grid-cols-2 gap-x-4">
        {RECOMMENDED_SKILLS.slice(0, 6).map((s) => (
          <SkillRow key={s.name} skill={s} onSelect={onSelectSkill} />
        ))}
      </div>
    </div>
  );
}

function ExploreTab({ onSelectSkill }: { onSelectSkill: (s: Skill) => void }) {
  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search skills..."
          className="w-full pl-9 pr-4 py-2.5 bg-surface-2 border border-border rounded-lg text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-brand-primary)]/30 focus:ring-1 focus:ring-[var(--color-brand-primary)]/20 transition-colors"
        />
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 mb-5">
        {["All", "integration", "developer", "productivity", "design", "business"].map((cat) => (
          <button
            type="button"
            key={cat}
            className={`px-3 py-1.5 rounded-lg text-[12px] transition-colors ${
              cat === "All"
                ? "bg-accent text-accent-fg font-medium"
                : "text-text-secondary hover:bg-surface-3"
            }`}
          >
            {cat === "All" ? cat : `#${cat}`}
          </button>
        ))}
      </div>

      {/* Full skills list — two columns */}
      <div className="text-[12px] text-text-muted font-medium mb-2">
        {RECOMMENDED_SKILLS.length} skills available
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        {RECOMMENDED_SKILLS.map((s) => (
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Skills</h1>
            <p className="text-sm text-text-secondary mt-1">
              Give your clone superpowers.
              <Button
                type="button"
                size="inline"
                onClick={expandFileTree}
                className="font-mono text-text-primary hover:text-accent transition-colors ml-1 inline-flex items-center gap-1"
              >
                <FolderOpen size={12} />
                ~/clone/skills/
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
            New skill
          </Button>
        </div>

        {/* Tabs + inline search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {TABS_CONFIG.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`text-[13px] transition-colors pb-2 border-b-2 ${
                  activeTab === t.id
                    ? "border-text-primary text-text-primary font-medium"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                {t.label}
                {t.count != null && (
                  <span className="text-[11px] text-text-muted ml-1.5">{t.count}</span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-surface-3 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={13} />
            </button>
            <Combobox
              value={selectedSkill?.name}
              onValueChange={(value: string) => {
                const nextSkill = quickFindSkills.find((skill) => skill.name === value);
                if (!nextSkill) return;
                setSelectedSkill(nextSkill);
                setActiveTab(nextSkill.installed ? "installed" : "explore");
              }}
            >
              <ComboboxTrigger className="h-8 w-48 bg-surface-2 text-[11px]">
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
                        <div className="truncate text-[10px] text-text-muted">
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

        {/* Tab content */}
        {activeTab === "installed" && <InstalledTab onSelectSkill={setSelectedSkill} />}
        {activeTab === "featured" && <FeaturedTab onSelectSkill={setSelectedSkill} />}
        {activeTab === "explore" && <ExploreTab onSelectSkill={setSelectedSkill} />}
      </div>

      {selectedSkill && (
        <SkillDetailPanel skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
      )}
    </div>
  );
}
