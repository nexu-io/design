import {
  ArrowRight,
  Star,
  Check,
  X,
  Users,
  Sparkles,
  Brain,
  MessageSquare,
  Rss,
  UserPlus,
  Send,
  Shield,
  GitPullRequest,
  Target,
  BarChart3,
  Zap,
  Crown,
} from "lucide-react";
import {
  ChatMsg,
  ChatWindow,
  ChatDivider,
  ScenarioSection,
  SectionHeading,
  FAQItem,
} from "./LandingParts";
import ChatCardGroup from "./product/ChatCards";
import type { ChatCard } from "./product/sessionsData";
import { Button } from '@nexu-design/ui-web'

const LANDING_CARDS: Record<string, ChatCard[]> = {
  scenario1a: [
    { type: 'skill', title: '深度调研', status: 'success', body: '✓ 检索 23 篇文章 + 5 个竞品官网\n✓ 生成竞品分析报告', path: 'skills/web-research/SKILL.md', meta: '耗时 15s · 自动调用' },
  ],
  scenario1b: [
    { type: 'file', title: '竞品分析报告', status: 'success', body: '8,200 字 · 3 个关键发现\n记忆壁垒 · IM 入口 · 团队协作', path: 'artifacts/research/竞品分析.md', diff: { added: 128, removed: 0 }, actions: [{ label: '打开编辑', primary: true }] },
    { type: 'memory', title: '记住了 3 个关键结论', status: 'success', body: '记忆壁垒是核心 · IM 优于独立 App · 团队协作驱动付费', meta: '记忆 +3 · 自动归档' },
  ],
  scenario1c: [
    { type: 'file', title: '产品方案 v1', status: 'success', body: '基于竞品分析 + 你的 12 条历史偏好\n自动引用了之前的决策记录', path: 'artifacts/prds/产品方案.md', diff: { added: 86, removed: 0 }, actions: [{ label: '打开编辑', primary: true }, { label: '分享' }] },
  ],
  scenario2a: [
    { type: 'skill', title: '竞品监控', status: 'success', body: '✓ 能力已激活\n✓ 监控 Linear / Notion / Cursor', path: 'skills/competitor-watch/SKILL.md', actions: [{ label: '查看配置' }] },
    { type: 'automation', title: '每日竞品扫描', status: 'success', body: '⏰ cron: 每天 09:00\n有更新推送飞书 + 保存分析报告', path: 'automation/competitor-scan.yaml', meta: '下次触发：明天 09:00', actions: [{ label: '测试执行' }] },
  ],
  scenario2b: [
    { type: 'automation', title: '每周 Sprint 回顾', status: 'success', body: '⏰ cron: 每周五 18:00\n自动汇总本周产出 + 推送到群', path: 'automation/weekly-review.yaml', meta: '2 个自动任务已上线', actions: [{ label: '查看全部', primary: true }] },
  ],
  scenario3a: [
    { type: 'automation', title: '📊 今日战况复盘', status: 'success', body: '✅ 完成 12 个任务，写了 3 份文档\n🧠 新记住 5 件事，默契度 → 78%', meta: '自动推送 · 每天 21:00' },
    { type: 'skill', title: '⚡ 竞品监控发现', status: 'warning', body: 'Notion 发布了 AI 新功能\n分析报告已准备好', actions: [{ label: '查看分析', primary: true }] },
    { type: 'memory', title: '🔔 记忆冲突提醒', status: 'warning', body: '发现 3 条记忆有矛盾，需要你来定夺', actions: [{ label: '处理', primary: true }] },
  ],
  scenario3b: [
    { type: 'file', title: 'Notion AI 新功能分析', status: 'success', body: 'Notion 采用嵌入式 AI 方案\n对我们的启示：记忆 + 能力组合是差异化优势', path: 'artifacts/research/notion-ai-update.md', diff: { added: 42, removed: 0 }, actions: [{ label: '打开', primary: true }] },
  ],
  scenario4a: [
    { type: 'memory', title: '已记住', status: 'success', body: '"搜索结果页加相关推荐"\n归入产品想法 · 标签：搜索优化', path: 'memory/ideas/search-recommendations.md', meta: '记忆 +1 · 默契度 +0.5%' },
  ],
  scenario4b: [
    { type: 'file', title: '搜索优化方案', status: 'success', body: '混合搜索 + 相关推荐\n参考了你过去 17 条相关记忆', path: 'artifacts/prds/search-optimization.md', diff: { added: 64, removed: 0 }, actions: [{ label: '打开编辑', primary: true }] },
    { type: 'memory', title: '默契度提升', status: 'success', body: '记忆关联命中 · 默契度 +1% → 79%', meta: '跨越 2 个月的记忆关联' },
  ],
};

export default function LandingPreview() {
  return (
    <div className="min-h-full bg-surface-0">
      {/* ───── Nav ───── */}
      <nav className="sticky top-0 z-50 border-b backdrop-blur-md border-border bg-surface-0/85">
        <div className="flex justify-between items-center px-6 mx-auto max-w-5xl h-14">
          <div className="flex items-center gap-2.5">
            <div className="flex justify-center items-center w-7 h-7 rounded-lg bg-accent">
              <span className="text-xs font-bold text-accent-fg">N</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-text-primary">
              nexu
            </span>
          </div>
          <div className="flex items-center gap-6 text-[13px] text-text-tertiary">
            <a href="#" className="transition-colors hover:text-text-primary">
              产品
            </a>
            <a href="#" className="transition-colors hover:text-text-primary">
              定价
            </a>
            <a href="#" className="transition-colors hover:text-text-primary">
              文档
            </a>
            <Button size='sm'>
              免费开始 <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </nav>

      {/* ───── Hero ───── */}
      <section className="overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,138,37,0.05)_0%,transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative px-6 pt-28 pb-24 mx-auto max-w-3xl text-center">
          <div className="relative mx-auto mb-10 w-28 h-28">
            <div className="absolute inset-0 rounded-2xl bg-clone/8 animate-clone-breath" />
            <div className="flex relative justify-center items-center w-28 h-28 text-5xl rounded-2xl border bg-surface-2 border-border">
              😊
            </div>
            <div className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full border-2 border-white bg-clone animate-clone-breath-subtle" />
            <div className="absolute -top-1 -left-1 px-1.5 py-0.5 rounded bg-surface-1 border border-border text-[9px] font-mono text-text-muted">
              Lv.3
            </div>
          </div>
          <h1 className="text-[52px] font-bold text-text-primary mb-5 leading-[1.1] tracking-tight">
            People quit. Clones don&apos;t.
            <br />
            <span className="text-text-secondary">为你的龙虾打造一间赛博办公室 — 世界首个人与分身共存的办公协作网络</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-text-tertiary">
            每个人有一个分身 — 记住你说过的每句话，帮你做事，和团队协作。
            <br />
            人走了，分身留下，知识永不流失。
          </p>
          <div className="flex gap-3 justify-center mb-6">
            <Button size='lg'>
              免费开始 <ArrowRight size={14} />
            </Button>
            <Button variant='outline' size='lg'>
              <UserPlus size={14} /> 邀请同事一起用
            </Button>
          </div>
          <div className="flex items-center justify-center gap-4 text-[13px] text-text-muted">
            <span>✓ 免费开始</span>
            <span>✓ 无需信用卡</span>
            <span>✓ 邀请同事立减 50%</span>
          </div>
        </div>
      </section>

      {/* ───── Logo / Trust Bar ───── */}
      <section className="py-8 border-y border-border">
        <div className="px-6 mx-auto max-w-4xl">
          <div className="text-center text-[11px] text-text-muted mb-5 tracking-widest uppercase">
            已有数万知识工作者在使用
          </div>
          <div className="flex gap-12 justify-center items-center text-text-muted">
            {[
              "ByteBuilder",
              "NextStudio",
              "锐思科技",
              "CloudStack",
              "DataPulse",
              "创见设计",
            ].map((name) => (
              <span
                key={name}
                className="text-[13px] font-semibold opacity-30 select-none"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Pain → Solution ───── */}
      <section className="px-6 py-24 mx-auto max-w-4xl">
        <SectionHeading
          tag="问题"
          title="你的 CTO 离职了，他带走了什么？"
          desc="不是代码 — 代码在 GitHub。不是文档 — 文档在 Notion。他带走的是三年的记忆和判断力。"
        />
        <div className="grid grid-cols-2 gap-y-8 gap-x-16">
          {[
            {
              before: "每次用 AI 都要重新解释背景",
              after: "分身记住你说过的一切，新人继承分身第一天就有前任的判断力",
            },
            {
              before: "AI 只能等你问，不会主动帮忙",
              after: "分身主动推送日报、代问进度、自动站会 — 人与分身共存",
            },
            {
              before: "想做一件事要切换 5 个工具",
              after: "一句话告诉分身，它调用技能帮你搞定 — 人做决策，分身做执行",
            },
            {
              before: "灵感和决策散落在各处",
              after: "所有记忆、文档、资料都帮你整理好",
            },
            {
              before: "每个 AI 工具都是单点，无法串联",
              after: "数千种能力自由组合，自动任务全天运转",
            },
            {
              before: "对话结束后什么也没留下",
              after: "每次对话都帮你沉淀文档、记忆和知识",
            },
          ].map((p, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="mt-1 shrink-0">
                <div className="flex justify-center items-center w-5 h-5 rounded-full bg-danger-subtle">
                  <X size={10} className="text-danger" />
                </div>
              </div>
              <div>
                <div className="text-sm line-through text-text-tertiary">
                  {p.before}
                </div>
                <div className="text-sm text-text-primary font-medium mt-1.5 flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-success-subtle flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={10} className="text-success" />
                  </div>
                  {p.after}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ───── Your Clone's Workspace ───── */}
      <section className="px-6 py-24 mx-auto max-w-4xl">
        <SectionHeading
          tag="你的专属空间"
          title="每个分身都有一个完整的「大脑」"
          desc="不是一段对话记录，是一个完整的人 — 身份、记忆、人脉、知识、产出，全部结构化存储。越用越懂你。"
        />
        <div className="p-8 rounded-xl border bg-surface-1 border-border">
          <div className="text-[13px] leading-[2] text-text-secondary">
            <div className="mb-1 font-semibold text-text-primary">
              你的分身空间
            </div>
            {[
              {
                icon: "🧬",
                name: "身份档案",
                desc: "性格、角色、头像、声音…… 分身了解你是谁",
              },
              {
                icon: "👥",
                name: "联系人",
                desc: "你的同事、朋友、客户…… 分身记得每个人",
              },
              {
                icon: "🧠",
                name: "记忆库",
                desc: "223 条记忆 — 你说过的想法、决策、偏好全都记住",
              },
              {
                icon: "📁",
                name: "文档和产出",
                desc: "报告、方案、设计稿、表格…… 分身帮你整理归档",
              },
              {
                icon: "📚",
                name: "知识库",
                desc: "参考资料、竞品信息、行业报告…… 随时调用",
              },
              {
                icon: "💬",
                name: "对话记录",
                desc: "每次聊天的完整记录和上传的资料",
              },
              {
                icon: "⚡",
                name: "自动任务",
                desc: "定时日报、竞品监控、周报…… 分身自动执行",
              },
              {
                icon: "🔧",
                name: "能力清单",
                desc: "数千种能力 — 写报告、做分析、跑数据……",
              },
            ].map((item) => (
              <div key={item.name} className="flex gap-3 items-center pl-5">
                <span>{item.icon}</span>
                <span className="font-medium text-text-primary">
                  {item.name}
                </span>
                <span className="text-text-muted text-[11px]">
                  — {item.desc}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-5 mt-6 border-t border-border">
            <div className="flex items-center gap-6 text-[12px] text-text-muted">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span>218 份资料 · 今天新增 6 份</span>
              </div>
              <span>
                支持任意内容：文档 · 表格 · 设计稿 · 图片 · 音视频 · PDF
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ───── Scenario 1: Just Tell It ───── */}
      <ScenarioSection
        tag="场景一"
        tagIcon={MessageSquare}
        title="说出来就行，剩下的它来"
        desc="不用打开别的工具、不用切换来切去。用大白话告诉分身你想做什么——它会自动查资料、写文档、整理结论。每一步你都看得到。"
        features={[
          "大白话说需求，分身自动完成",
          "每个动作都帮你沉淀文档，有迹可查",
          "自动调用合适的能力来帮你完成",
        ]}
        chatContent={
          <ChatWindow title="nexu · 我的分身">
            <ChatMsg from="user">帮我做一份 AI 赛道的竞品分析</ChatMsg>
            <ChatMsg from="clone">
              收到，让我帮你搞定 📂
            </ChatMsg>
            <div className="ml-8 mb-2.5">
              <ChatCardGroup cards={LANDING_CARDS.scenario1a} />
            </div>
            <ChatMsg from="clone">
              报告完成 ✅ 8,200 字，3 个关键发现
            </ChatMsg>
            <div className="ml-8 mb-2.5">
              <ChatCardGroup cards={LANDING_CARDS.scenario1b} />
            </div>
            <ChatMsg from="user">不错，基于这个写一份产品方案</ChatMsg>
            <div className="ml-8 mb-2.5">
              <ChatCardGroup cards={LANDING_CARDS.scenario1c} />
            </div>
          </ChatWindow>
        }
      />

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ───── Scenario 2: Abilities & Auto Tasks ───── */}
      <ScenarioSection
        tag="场景二"
        tagIcon={Sparkles}
        title="给分身装能力，像装 App 一样"
        desc="数千种现成能力，从写方案到监控竞品。还能用大白话创建自动任务——让分身在你睡觉时也在帮你干活。"
        features={[
          "数千种能力，覆盖产品/研发/运营/设计",
          "说一句话就能创建自动任务",
          "定时执行 + 条件触发，全天候运转",
        ]}
        reverse
        chatContent={
          <ChatWindow title="nexu · 我的分身">
            <ChatMsg from="user">帮我设一个竞品监控，每天自动跑</ChatMsg>
            <ChatMsg from="clone">
              好的，帮你设置 ⚡
            </ChatMsg>
            <div className="ml-8 mb-2.5">
              <ChatCardGroup cards={LANDING_CARDS.scenario2a} />
            </div>
            <ChatMsg from="user">再加一个每周五自动生成周报</ChatMsg>
            <div className="ml-8 mb-2.5">
              <ChatCardGroup cards={LANDING_CARDS.scenario2b} />
            </div>
          </ChatWindow>
        }
      />

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ───── Scenario 3: Daily Updates ───── */}
      <ScenarioSection
        tag="场景三"
        tagIcon={Rss}
        title="每天打开，都有新鲜感"
        desc="分身不是被动等你问的 AI。它会主动跑任务、整理记忆、发现异常——你每天打开就能看到它做了什么，像刷朋友圈一样，但每一条都是你的生产力。"
        features={[
          "每日动态：一眼看到分身今天的产出和发现",
          "主动推送日报、周报、异常提醒",
          "记忆自动整理，发现矛盾主动提醒你",
        ]}
        chatContent={
          <ChatWindow title="nexu · 今日动态">
            <div className="mb-2.5">
              <ChatCardGroup cards={LANDING_CARDS.scenario3a} />
            </div>
            <ChatMsg from="user">展开竞品分析看看</ChatMsg>
            <div className="ml-8 mb-2.5">
              <ChatCardGroup cards={LANDING_CARDS.scenario3b} />
            </div>
          </ChatWindow>
        }
      />

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ───── Scenario 4: Memory & Growth ───── */}
      <ScenarioSection
        tag="场景四"
        tagIcon={Brain}
        title="越用越像你，换不掉"
        desc="不是冰冷的工具。分身会从每次聊天中学习你的偏好、决策习惯、工作风格——用得越久，它越懂你。有等级、有默契度，就像培养一个真正的助手。"
        features={[
          "聊天自动记住重点，不需要手动整理",
          "等级 + 默契度，看得到它在进步",
          "3 个月前的随口一说，它会在合适的时候提醒你",
        ]}
        reverse
        chatContent={
          <ChatWindow title="nexu · 我的分身">
            <ChatMsg from="user">对了，搜索结果页可以加个相关推荐</ChatMsg>
            <div className="ml-8 mb-2.5">
              <ChatCardGroup cards={LANDING_CARDS.scenario4a} />
            </div>
            <ChatDivider text="2 个月后" />
            <ChatMsg from="clone">
              主人，你 2 个月前提过"搜索加相关推荐"。这周刚好在做搜索优化，要不要一起做了？
            </ChatMsg>
            <ChatMsg from="user">我都忘了！好，帮我写个方案</ChatMsg>
            <div className="ml-8 mb-2.5">
              <ChatCardGroup cards={LANDING_CARDS.scenario4b} />
            </div>
          </ChatWindow>
        }
      />

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ───── Scenario 5: Team Collaboration & Virality ───── */}
      <ScenarioSection
        tag="场景五"
        tagIcon={Users}
        title="邀请同事，组建 Agent 协作网络"
        desc="每个人有自己的分身，分身之间自动协作。你问进度，分身帮你去问同事的分身；开站会，分身自动汇总所有人的状态。团队群里一发，同事自然想要。"
        features={[
          "一键邀请同事，每人获得专属分身",
          "分身代理跨人沟通，你不用逐个去问",
          "团队共享知识库 + OKR + Sprint 自动跟踪",
          "群聊里的每张卡片都是天然的裂变入口",
        ]}
        chatContent={
          <ChatWindow title="项目群" badge="6 人">
            <ChatMsg from="user">@分身 帮我问下李四 Gateway 进度</ChatMsg>
            <ChatMsg from="clone">
              已替你询问李四的分身 🤝
              <br />
              <br />
              <span className="text-text-muted text-[11px]">
                → 你的分身 → 李四的分身 → 自动获取进度
              </span>
              <br />
              <br />
              李四反馈：Gateway 重构完成 65%，卡在第三方 SDK 适配，预计延迟 2
              天。
              <br />
              <br />
              已自动更新 Sprint 状态 ✅
            </ChatMsg>
            <ChatMsg from="other" name="王五">
              这个分身太方便了，我也想要一个！
            </ChatMsg>
            <ChatMsg from="clone">
              <span className="text-clone">✨ 欢迎加入！</span>
              <br />
              王五，点击下方链接 3 分钟激活你的专属分身 👇
              <br />
              <span className="text-info underline text-[12px]">
                refly.ai/invite/team-abc123
              </span>
            </ChatMsg>
          </ChatWindow>
        }
      />

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ───── Agent-Native Workspace ───── */}
      <section className="px-6 py-24 mx-auto max-w-4xl">
        <SectionHeading
          tag="Agent-Native 协作空间"
          title="为你的龙虾打造一间赛博办公室 — 世界首个人与分身共存的办公协作网络"
          desc="每个人有一个分身 → 分身记忆沉淀 → 分身之间协作 → 人走了分身留下 → 知识永不流失"
        />

        {/* Invite Flow */}
        <div className="p-8 mb-8 rounded-xl border bg-surface-1 border-border">
          <div className="flex gap-6 justify-between items-center">
            {[
              {
                step: "1",
                icon: UserPlus,
                title: "邀请同事",
                desc: "发送链接或在群里 @分身邀请",
                color: "text-info",
              },
              {
                step: "2",
                icon: Sparkles,
                title: "3 分钟激活",
                desc: "同事在 IM 里完成 onboarding",
                color: "text-clone",
              },
              {
                step: "3",
                icon: GitPullRequest,
                title: "分身互联",
                desc: "分身之间自动建立协作通道",
                color: "text-success",
              },
              {
                step: "4",
                icon: Zap,
                title: "效率飞轮",
                desc: "团队越大，每个分身越强",
                color: "text-warning",
              },
            ].map((s, i) => (
              <div key={s.step} className="relative flex-1">
                {i < 3 && (
                  <div className="absolute -right-3 top-4 w-6 border-t border-dashed border-border" />
                )}
                <div
                  className={`w-9 h-9 rounded-lg bg-surface-3 flex items-center justify-center mb-3 ${s.color}`}
                >
                  <s.icon size={18} />
                </div>
                <div className="text-[13px] font-semibold text-text-primary mb-1">
                  {s.title}
                </div>
                <div className="text-[11px] text-text-muted leading-relaxed">
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team capabilities grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              icon: Target,
              title: "OKR + Sprint 联动",
              desc: "团队目标自动拆解到每个人的分身，Sprint 进度实时汇总。不用开会就能掌握全局。",
              badge: "自动追踪",
            },
            {
              icon: Send,
              title: "分身代理沟通",
              desc: '"帮我问李四进度" — 你的分身自动找李四的分身，结果直接返回。不打扰同事，不等回复。',
              badge: "零等待",
            },
            {
              icon: BarChart3,
              title: "团队 Insights",
              desc: '自然语言查询团队数据："Sprint 3 有什么风险？" — 分身分析所有人的任务和进度，给出建议。',
              badge: "AI 分析",
            },
            {
              icon: Shield,
              title: "共享知识库",
              desc: "团队记忆自动沉淀：决策、方案、竞品情报。新人入职，分身一读就懂团队上下文。",
              badge: "壁垒沉淀",
            },
            {
              icon: Rss,
              title: "IM 卡片协作",
              desc: "所有操作以交互式卡片出现在群聊中：审批、对齐、报告、提醒。在聊天里完成一切。",
              badge: "飞书/Slack",
            },
            {
              icon: Crown,
              title: "裂变增长",
              desc: "群聊里每张卡片都是入口。同事看到你的分身在干活 → 点击 → 3 分钟获得自己的分身。",
              badge: "k-factor >1",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-xl border transition-colors bg-surface-1 border-border hover:border-border-hover"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex justify-center items-center w-8 h-8 rounded-lg bg-accent/8">
                  <item.icon size={16} className="text-accent" />
                </div>
                <span className="text-[9px] text-clone bg-clone/10 px-1.5 py-0.5 rounded-full font-medium">
                  {item.badge}
                </span>
              </div>
              <div className="text-[13px] font-semibold text-text-primary mb-1.5">
                {item.title}
              </div>
              <div className="text-[12px] text-text-muted leading-relaxed">
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Team invite CTA */}
        <div className="flex justify-between items-center p-6 mt-8 rounded-xl border bg-accent/5 border-accent/15">
          <div>
            <div className="text-[15px] font-semibold text-text-primary mb-1">
              带上你的团队，一起 10x
            </div>
            <div className="text-[13px] text-text-muted">
              邀请 3 位同事加入，每人免费获得 Pro 版 30 天体验
            </div>
          </div>
          <Button className='shrink-0'>
            <UserPlus size={14} /> 邀请同事
          </Button>
        </div>
      </section>

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ───── How it works ───── */}
      <section className="px-6 py-24 mx-auto max-w-4xl">
        <SectionHeading
          tag="使用流程"
          title="3 步，让分身上岗"
          desc="不需要任何技术背景，像加一个新同事一样简单"
        />
        <div className="grid grid-cols-3 gap-12">
          {[
            {
              step: "01",
              title: "加个好友",
              desc: "在飞书/Slack 里添加机器人，或直接打开网页版。30 秒搞定。",
            },
            {
              step: "02",
              title: "聊几句就上岗",
              desc: "分身会问你几个问题——做什么工作、喜欢什么风格。不是填表，是聊天。3 分钟搞定。",
            },
            {
              step: "03",
              title: "越用越懂你",
              desc: "记住你的一切、主动帮你干活、每天看它做了什么。用得越久越离不开。",
            },
          ].map((s, i) => (
            <div key={s.step} className="relative">
              {i < 2 && (
                <div className="absolute top-5 -right-6 w-12 border-t border-dashed border-border" />
              )}
              <div className="mb-4 font-mono text-2xl font-bold text-clone">
                {s.step}
              </div>
              <h3 className="text-[15px] font-semibold text-text-primary mb-2">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-tertiary">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ───── Killer Numbers ───── */}
      <section className="px-6 py-24 mx-auto max-w-4xl">
        <div className="grid grid-cols-4 gap-8 text-center">
          {[
            { num: "数千+", label: "种能力", sub: "产品/研发/运营/设计全覆盖" },
            {
              num: "5",
              label: "个平台",
              sub: "飞书 · Slack · 网页 · WhatsApp · API",
            },
            { num: "10x", label: "团队效率", sub: "分身代理沟通 + 自动对齐" },
            { num: "82%", label: "续费率", sub: "用了 30 天的团队都不想停" },
          ].map((n) => (
            <div key={n.label}>
              <div className="font-mono text-3xl font-bold tracking-tight text-text-primary">
                {n.num}
              </div>
              <div className="mt-1 text-sm font-medium text-text-primary">
                {n.label}
              </div>
              <div className="text-[11px] text-text-muted mt-0.5">{n.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ───── Comparison ───── */}
      <section className="px-6 py-24 mx-auto max-w-4xl">
        <SectionHeading
          tag="对比"
          title="不是另一个对话框"
          desc="对比你熟悉的 AI 工具——nexu 是龙虾的赛博办公室 — 世界首个人与分身共存的办公协作网络，不只是对话框。"
        />
        <div className="overflow-hidden rounded-xl border bg-surface-1 border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2/50">
                <th className="text-left p-4 text-text-secondary font-medium w-[28%]">
                  能力
                </th>
                <th className="text-center p-4 font-semibold text-text-primary w-[18%]">
                  nexu
                </th>
                <th className="text-center p-4 text-text-secondary font-medium w-[18%]">
                  ChatGPT
                </th>
                <th className="text-center p-4 text-text-secondary font-medium w-[18%]">
                  Notion AI
                </th>
                <th className="text-center p-4 text-text-secondary font-medium w-[18%]">
                  Coze/扣子
                </th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["记得住，越用越懂你", true, "shallow", false, "shallow"],
                  ["有自己的知识库和工作空间", true, false, false, false],
                  ["数千种能力，自由组合", true, "plugin", "limited", true],
                  ["自动任务（定时 + 条件触发）", true, false, false, true],
                  ["每日动态 + 主动提醒", true, false, false, "limited"],
                  ["住在飞书/Slack 里直接用", true, false, false, true],
                  ["团队群协作，天然传播", true, false, "limited", "limited"],
                  ["等级 + 默契度成长体系", true, false, false, false],
                  ["3 分钟上手", true, true, false, false],
                ] as [
                  string,
                  boolean | string,
                  boolean | string,
                  boolean | string,
                  boolean | string
                ][]
              ).map(([feature, refly, chatgpt, notion, coze]) => (
                <tr
                  key={feature as string}
                  className="border-b border-border last:border-0"
                >
                  <td className="p-4 text-text-primary text-[13px]">
                    {feature as string}
                  </td>
                  {[refly, chatgpt, notion, coze].map((val, ci) => (
                    <td key={ci} className="p-4 text-center">
                      {val === true ? (
                        <Check size={16} className="mx-auto text-success" />
                      ) : val === false ? (
                        <X size={16} className="mx-auto text-text-placeholder" />
                      ) : (
                        <span className="text-[11px] text-text-muted">
                          {{
                            shallow: "浅层",
                            plugin: "需插件",
                            limited: "有限",
                          }[val as string] ?? val}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ───── Social Proof ───── */}
      <section className="px-6 py-24 mx-auto max-w-4xl">
        <SectionHeading
          tag="用户声音"
          title="他们的分身已经上岗了"
          desc="来自真实用户的反馈"
        />
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              quote:
                "我的分身记得我 3 个月前随口说的一个想法，上周竟然主动提醒我可以做了。太神了。",
              who: "独立开发者",
              title: "@IndieHacker",
              days: 87,
            },
            {
              quote:
                "每天打开看分身昨晚做了什么，比刷朋友圈有意义。竞品监控已经帮我发现了两次重要机会。",
              who: "产品经理",
              title: "PM @ SaaS",
              days: 62,
            },
            {
              quote:
                "让分身帮我写产品方案，它先做了竞品调研再写。比实习生靠谱。",
              who: "创业公司 CEO",
              title: "CEO & Founder",
              days: 45,
            },
            {
              quote:
                "团队 5 个人，每人一个分身，开会前它已经帮我汇总了所有人的进度。群里一发，大家都想加。",
              who: "技术负责人",
              title: "Tech Lead",
              days: 93,
            },
            {
              quote:
                "做了一个客户跟进的自动任务，现在每周自动提醒我跟进，一个客户都不漏。",
              who: "销售负责人",
              title: "Sales",
              days: 38,
            },
            {
              quote:
                "分身里已经有 500 多条记忆了。默契度 82%，它比我自己还了解我的偏好。",
              who: "自由设计师",
              title: "Freelancer",
              days: 186,
            },
          ].map((t) => (
            <div
              key={t.who}
              className="p-5 rounded-xl border bg-surface-1 border-border"
            >
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={13} className="text-clone fill-clone" />
                ))}
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-5">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-2.5">
                <div className="flex justify-center items-center w-8 h-8 text-xs font-medium rounded-full bg-surface-3 text-text-secondary">
                  {t.who[0]}
                </div>
                <div>
                  <div className="text-xs font-medium text-text-primary">
                    {t.who}
                  </div>
                  <div className="text-[11px] text-text-muted">
                    {t.title} · 使用 {t.days} 天
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ───── FAQ ───── */}
      <section className="px-6 py-24 mx-auto max-w-2xl">
        <SectionHeading tag="常见问题" title="你可能想知道" />
        <div>
          <FAQItem
            q="跟 ChatGPT、Claude 有什么区别？"
            a="最大的区别是三个字：记得住、会主动、能成长。ChatGPT 每次都是新对话，不知道你是谁。nexu 记住你说过的一切，会主动推送日报、竞品发现，还有等级和默契度——用了 3 个月，它比你自己还了解你。"
          />
          <FAQItem
            q="能力是什么？怎么用？"
            a='能力就像手机上的 App。nexu 有 数千种现成的能力（写方案、竞品分析、数据处理等），你还可以用大白话创建新能力。在聊天中说"帮我做竞品分析"，分身会自动用合适的能力来帮你完成——不需要你选择。'
          />
          <FAQItem
            q="自动任务怎么设置？"
            a='在聊天中告诉分身你想要什么就行。比如"每天早上 9 点帮我检查竞品动态"或"每周五生成周报"。分身会自动帮你设好。你也可以在「自动任务」页面手动管理。'
          />
          <FAQItem
            q="每日动态是什么？"
            a='每日动态就是你分身的朋友圈——每次自动任务运行、能力执行、记忆整理的结果都会出现在这里。每天打开就能看到分身做了什么，比如"竞品监控发现 Notion 发布新功能"。你可以直接从这里跟分身继续聊。'
          />
          <FAQItem
            q="我的数据安全吗？"
            a="你的对话和记忆数据加密存储在独立的云端服务器中。我们不会把你的数据拿去训练 AI。你可以随时导出全部数据或一键删除。"
          />
          <FAQItem
            q="支持哪些平台？"
            a="目前深度支持飞书（Lark），Slack 和网页版已上线。WhatsApp 和 Telegram 正在内测中。分身的所有记忆跨平台同步——在飞书说的话，在网页也记得。"
          />
          <FAQItem
            q="需要技术基础吗？"
            a="完全不需要。在聊天里说话就行。创建能力、设置自动任务、管理记忆——全部用大白话完成。不需要写代码、不需要学新工具。"
          />
          <FAQItem
            q="团队版和个人版有什么不同？"
            a="团队版增加了共享知识库、分身间协作（你的分身可以向同事的分身要信息）和团队管理后台。最关键的是——团队群里用分身干活，同事看到效果就想加，自然传播。"
          />
        </div>
      </section>

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ───── Pricing ───── */}
      <section className="px-6 py-24 mx-auto max-w-4xl">
        <SectionHeading
          tag="定价"
          title="给你的分身选个状态"
          desc="所有版本都保留你的全部记忆。升级或降级不丢失任何数据。"
        />
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              name: "基础版",
              price: "免费",
              sub: "",
              items: [
                "分身上岗",
                "500 能量/月",
                "3 种能力",
                "基础记忆",
                "每日动态",
              ],
              cta: "免费开始",
              hl: false,
            },
            {
              name: "专业版",
              price: "¥29",
              sub: "/月",
              items: [
                "分身全力以赴",
                "5,000 能量/月",
                "无限能力 + 自定义",
                "完整记忆 + 成长体系",
                "自动任务",
                "飞书深度整合",
                "主动提醒",
                "优先模型",
              ],
              cta: "解锁完整分身",
              hl: true,
            },
            {
              name: "团队版",
              price: "¥19",
              sub: "/人/月",
              items: [
                "专业版全部",
                "团队共享知识库",
                "分身间协作",
                "团队管理后台",
                "群聊协作",
              ],
              cta: "团队一起用",
              hl: false,
            },
          ].map((p) => (
            <div
              key={p.name}
              className={`rounded-xl p-6 relative ${
                p.hl
                  ? "bg-surface-1 border-2 border-clone/30"
                  : "bg-surface-1 border border-border"
              }`}
              style={
                p.hl ? { boxShadow: "0 0 40px rgba(192,138,37,0.08)" } : {}
              }
            >
              {p.hl && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-clone text-white text-[11px] font-semibold px-3 py-0.5 rounded-full">
                  推荐
                </div>
              )}
              <div className="text-sm font-medium text-text-secondary">
                {p.name}
              </div>
              <div className="mt-2 mb-6">
                <span className="text-3xl font-bold tracking-tight text-text-primary">
                  {p.price}
                </span>
                <span className="text-sm text-text-muted">{p.sub}</span>
              </div>
              <div className="space-y-2.5 mb-6">
                {p.items.map((item) => (
                  <div
                    key={item}
                    className="text-[13px] text-text-secondary flex items-center gap-2.5"
                  >
                    <span className="text-xs text-clone">✓</span> {item}
                  </div>
                ))}
              </div>
              <Button
                variant={p.hl ? 'default' : 'outline'}
                className='w-full'
              >
                {p.cta}
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-6 text-xs text-center text-text-muted">
          还可以单独购买能量包：¥10 = 1,000 能量
        </div>
      </section>

      {/* ───── Final CTA ───── */}
      <section className="overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,138,37,0.04)_0%,transparent_60%)]" />
        <div className="relative px-6 py-28 mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-text-primary">
            给你的龙虾一间赛博办公室
          </h2>
          <p className="mb-8 text-base text-text-tertiary">
            免费开始，3 分钟上手。员工会辞职，分身不会。
          </p>
          <div className="flex gap-3 justify-center">
            <Button size='lg'>
              免费开始 <ArrowRight size={14} />
            </Button>
            <Button variant='outline' size='lg'>
              <UserPlus size={14} /> 邀请同事
            </Button>
          </div>
          <div className="flex gap-0 justify-center mt-10">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex justify-center items-center -ml-2 w-9 h-9 text-sm rounded-full border-2 bg-surface-3 border-surface-0 first:ml-0"
              >
                {["😊", "🤝", "😄", "💻", "🎨", "🚀", "✨"][i]}
              </div>
            ))}
          </div>
          <div className="text-[13px] text-text-muted mt-3">
            12,000+ 团队 · 89,536 人已加入
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t border-border">
        <div className="flex justify-between items-center px-6 py-8 mx-auto max-w-5xl">
          <div className="flex items-center gap-2.5">
            <div className="flex justify-center items-center w-5 h-5 rounded bg-accent">
              <span className="text-accent-fg text-[9px] font-bold">N</span>
            </div>
            <span className="text-xs text-text-muted">
              nexu — People quit. Clones don&apos;t.
            </span>
          </div>
          <div className="flex gap-6 text-xs text-text-muted">
            <a href="#" className="transition-colors hover:text-text-secondary">
              GitHub
            </a>
            <a href="#" className="transition-colors hover:text-text-secondary">
              X / Twitter
            </a>
            <a href="#" className="transition-colors hover:text-text-secondary">
              即刻
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
