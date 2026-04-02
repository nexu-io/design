import { PageHeader, PageShell } from "@nexu-design/ui-web";

import {
  Bot,
  Brain,
  FileText,
  Globe,
  Heart,
  Layers,
  MessageSquare,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { SectionHeader } from "../components/SectionHeader";

export default function OverviewPage() {
  return (
    <PageShell>
      <PageHeader
        title="nexu Design System"
        description="nexu（奈苏）— 为你的龙虾打造一间赛博办公室。世界首个人与分身共存的办公协作网络。人做决策，分身做执行。人会离职，分身不会。"
      />

      <section className="mb-12">
        <SectionHeader title="产品定位" className="mb-4 border-b border-border-subtle pb-2" />
        <div className="bg-surface-2 border border-border rounded-lg p-6">
          <p className="text-xl font-bold text-text-primary mb-1">
            nexu — 为你的龙虾打造一间赛博办公室
          </p>
          <p className="text-base text-accent font-medium mb-2">
            为你的龙虾打造一间赛博办公室 — People quit. Clones don&apos;t.
          </p>
          <p className="text-[13px] text-text-secondary mb-6 leading-relaxed">
            不是 AI 助手，不是 workflow 工具，不是 agent builder。
            <br />
            是世界首个<strong className="text-text-primary">人与分身共存的办公协作网络</strong> —
            每个人有一个分身，分身记住你的一切，人走了分身留下，知识永不流失。
          </p>

          <div className="grid grid-cols-4 gap-3">
            <div className="bg-surface-3 rounded-lg p-4">
              <div className="text-sm font-medium text-text-primary mb-1">对用户</div>
              <div className="text-xs text-text-secondary leading-relaxed">
                你有一个分身 — 记住一切、帮你做事、越用越懂你。人走了，分身留下。
              </div>
            </div>
            <div className="bg-surface-3 rounded-lg p-4">
              <div className="text-sm font-medium text-text-primary mb-1">对团队</div>
              <div className="text-xs text-text-secondary leading-relaxed">
                分身网络 — 人与分身共存，知识永不流失，经验可交接
              </div>
            </div>
            <div className="bg-surface-3 rounded-lg p-4">
              <div className="text-sm font-medium text-text-primary mb-1">对投资人</div>
              <div className="text-xs text-text-secondary leading-relaxed">
                为你的龙虾打造一间赛博办公室 — 人与分身共存的办公协作网络
              </div>
            </div>
            <div className="bg-surface-3 rounded-lg p-4">
              <div className="text-sm font-medium text-text-primary mb-1">校验标准</div>
              <div className="text-xs text-accent leading-relaxed">
                这让人和分身更好地共存了吗？知识能传承了吗？网络更强了吗？
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader title="核心概念" className="mb-4 border-b border-border-subtle pb-2" />
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              icon: MessageSquare,
              title: "对话即操控",
              desc: "一个 Session 入口操控文件、记忆、技能、自动化、团队、升级。所有操作产出 6 种标准卡片。",
              color: "bg-accent-subtle",
            },
            {
              icon: Layers,
              title: "6 种标准卡片",
              desc: "文件 · 记忆 · 技能 · 自动化 · 协作 · 升级。产品中所有操作的产出形态，卡片可交互。",
              color: "bg-emerald-500/10",
            },
            {
              icon: Brain,
              title: "记忆系统",
              desc: "分身的大脑 — 身份、记忆、知识、产出，全部结构化存储，越用越懂你。",
              color: "bg-violet-500/10",
            },
            {
              icon: Sparkles,
              title: "Scoped Session",
              desc: "限定 Skills 和上下文的专属会话。Team Insights、Sprint 分析、OKR 对齐都是 Scoped Session。",
              color: "bg-cyan-500/10",
            },
            {
              icon: Globe,
              title: "原生渠道",
              desc: "Email / SMS / WhatsApp — 零安装，发消息即启动 Session。IM 平台（飞书/Slack）深度集成。",
              color: "bg-green-500/10",
            },
            {
              icon: Users,
              title: "分身网络",
              desc: "团队成员各有分身，代问代答、自动站会、任务委托。人做决策，Agent 做执行。",
              color: "bg-blue-500/10",
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-surface-2 border border-border rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center shrink-0`}
                >
                  <Icon size={18} className="text-text-primary" />
                </div>
                <div className="text-sm font-semibold text-text-primary">{title}</div>
              </div>
              <div className="text-xs text-text-secondary leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader title="设计信条" className="mb-4 border-b border-border-subtle pb-2" />
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: Heart,
              title: "有温度的专业",
              desc: 'Linear 的克制 + 分身的温暖。暗色主题，琥珀色是分身"活着"的信号。',
            },
            {
              icon: Layers,
              title: "卡片即交互",
              desc: "6 种标准卡片是核心交互单元。所有操作产出可触碰、可交互的卡片。",
            },
            {
              icon: Zap,
              title: "会呼吸的 UI",
              desc: "分身有状态——在线、思考中、工作中。界面跟随分身状态，Avatar 有呼吸动画。",
            },
            {
              icon: Shield,
              title: "渐进式复杂度",
              desc: "第一眼极简（Session 入口），深入才看到更多（Scoped Session、任务系统、OKR）。",
            },
            {
              icon: Globe,
              title: "全球化就绪",
              desc: "中英双语，IM-native 入口适配多市场（飞书/Slack/WhatsApp/Telegram）。",
            },
            {
              icon: Brain,
              title: "分身心智模型",
              desc: "每个触点都强化「你有一个数字分身」。不说功能说感受，不说技术说关系，不说工具说同事。",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-surface-2 border border-border rounded-lg p-5 flex gap-4"
            >
              <div className="w-9 h-9 rounded-lg bg-accent-subtle flex items-center justify-center shrink-0">
                <Icon size={18} className="text-text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary mb-1">{title}</div>
                <div className="text-xs text-text-secondary leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader title="品牌声音" className="mb-4 border-b border-border-subtle pb-2" />
        <div className="bg-surface-2 border border-border rounded-lg p-5">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[13px]">
            {[
              ["品牌名", "nexu（奈苏）— 产品 / Refly — 公司与基础设施"],
              ["Tagline", "为你的龙虾打造一间赛博办公室 — People quit. Clones don't."],
              ["性格", "靠谱 + 温暖 + 高效 — 像一个什么都记得的靠谱同事"],
              ["自称", '"我"（不说"本系统"、"Refly 助手"、"AI"）'],
              ["语气", "简洁直接，但有温度。不拽术语，不过度卖萌"],
              ["叙事", "不说功能说感受，不说技术说关系，不说工具说同事"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-text-tertiary w-16 shrink-0">{k}</span>
                <span className="text-text-primary">{v}</span>
              </div>
            ))}
          </div>

          {/* Audience-specific narratives */}
          <div className="mt-5 pt-4 border-t border-border">
            <div className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-3">
              叙事框架（按受众）
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  audience: "对用户",
                  narrative: "你有一个分身，记住一切、帮你做事。人走了，分身留下。",
                  color: "border-l-emerald-500",
                },
                {
                  audience: "对投资人",
                  narrative:
                    "龙虾的赛博办公室 — 不是 Skills 集合，是办公基础设施 + 分身网络。网络效应 + 记忆锁定 + 经验传承",
                  color: "border-l-violet-500",
                },
                {
                  audience: "对开发者",
                  narrative:
                    "分身拥有完整的大脑 — 身份·记忆·知识·能力。人和 Agent 都能读写，没有翻译层。",
                  color: "border-l-blue-500",
                },
                {
                  audience: "对团队市场",
                  narrative: "每个人都有分身，分身帮你协作。员工走了，分身留下。知识永不流失。",
                  color: "border-l-cyan-500",
                },
              ].map((n) => (
                <div
                  key={n.audience}
                  className={`p-3 bg-surface-3 rounded-lg border-l-2 ${n.color}`}
                >
                  <div className="text-[11px] font-medium text-text-primary mb-1">{n.audience}</div>
                  <div className="text-[11px] text-text-secondary leading-relaxed">
                    {n.narrative}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader title="术语对照" className="mb-4 border-b border-border-subtle pb-2" />
        <div className="mb-3 text-xs text-text-muted">产品中不暴露技术术语，用分身语言替代。</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Token", "能量（Credits）"],
            ["Agent Skills", "分身的技能"],
            ["Workflow", "自动化"],
            ["Tool Calling", "分身帮你查了/做了"],
            ["Memory OS", "分身记住了这件事"],
            ["Session", "对话 / 主线"],
            ["Scoped Session", "专属会话"],
            ["Skills Builder", "教分身新技能"],
            ["Upgrade / Pay", "给分身充能"],
            ["IM Bot", "数字分身"],
            ["API", "渠道连接"],
            ["File System", "分身的大脑"],
            ["Card Component", "卡片（6 种标准类型）"],
            ["Native Channel", "原生渠道（零安装）"],
            ["Team Workspace", "分身网络"],
          ].map(([from, to]) => (
            <div
              key={from}
              className="bg-surface-2 border border-border rounded-md p-3 flex items-center gap-2"
            >
              <span className="text-xs text-danger line-through">{from}</span>
              <span className="text-text-muted">→</span>
              <span className="text-xs text-success font-medium">{to}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader title="产品架构概览" className="mb-4 border-b border-border-subtle pb-2" />
        <div className="bg-surface-2 border border-border rounded-lg p-5">
          <div className="grid grid-cols-4 gap-4 mb-5">
            {[
              {
                icon: Bot,
                label: "主线入口",
                desc: "Session — 对话即操控一切",
                accent: "text-accent",
              },
              {
                icon: FileText,
                label: "6 种卡片",
                desc: "文件·记忆·技能·自动化·协作·升级",
                accent: "text-emerald-400",
              },
              {
                icon: Brain,
                label: "记忆系统",
                desc: "结构化记忆系统 — 越用越懂你",
                accent: "text-violet-400",
              },
              {
                icon: Target,
                label: "团队协作",
                desc: "任务流·OKR·Sprint·分身网络",
                accent: "text-cyan-400",
              },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 bg-surface-3 rounded-xl">
                <item.icon size={24} className={`mx-auto mb-2 ${item.accent}`} />
                <div className="text-[12px] font-medium text-text-primary mb-1">{item.label}</div>
                <div className="text-[10px] text-text-muted">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-surface-3 rounded-xl font-mono text-[11px] text-text-secondary leading-relaxed">
            <div className="text-text-primary font-medium mb-2">分身的大脑 — 它记住的一切</div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
              <div>
                <span className="text-clone">├── .soul/</span> 身份（我是谁、价值观、世界观）
              </div>
              <div>
                <span className="text-clone">├── contacts/</span> 人脉（每人一个 .md）
              </div>
              <div>
                <span className="text-clone">├── memory/</span> 记忆（决策、想法、偏好、事实）
              </div>
              <div>
                <span className="text-clone">├── knowledge/</span> 知识库（架构、参考、市场）
              </div>
              <div>
                <span className="text-clone">├── artifacts/</span> 产出物（PRD、报告、设计）
              </div>
              <div>
                <span className="text-clone">├── sessions/</span> 会话记录
              </div>
              <div>
                <span className="text-clone">├── automation/</span> 自动化规则（.yaml）
              </div>
              <div>
                <span className="text-clone">└── skills/</span> 技能定义（SKILL.md）
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
