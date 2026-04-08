import { PageHeader, PageShell } from "@nexu-design/ui-web";

import { SectionHeader } from "@nexu-design/ui-web";
import {
  ArrowRight,
  Bot,
  Brain,
  Database,
  Globe,
  Layers,
  Lock,
  MessageSquare,
  Network,
  Play,
  Presentation,
  Route as RouteIcon,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

function EraCard({
  era,
  title,
  desc,
  color,
}: {
  era: string;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="relative bg-surface-2 border border-border rounded-xl p-5 overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${color}`} />
      <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">
        {era}
      </div>
      <div className="text-sm font-bold text-text-primary mb-2">{title}</div>
      <div className="text-xs text-text-secondary leading-relaxed">{desc}</div>
    </div>
  );
}

function InsightBlock({
  icon: Icon,
  title,
  children,
  accent = "bg-accent-subtle",
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="bg-surface-2 border border-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg ${accent} flex items-center justify-center shrink-0`}>
          <Icon size={18} className="text-text-primary" />
        </div>
        <div className="text-sm font-bold text-text-primary">{title}</div>
      </div>
      <div className="text-xs text-text-secondary leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function WhyWeBuiltPage() {
  return (
    <PageShell>
      <PageHeader
        title="Why We Build nexu"
        description="nexu（奈苏）— 为你的龙虾打造一间赛博办公室。取自 Nexus（连接），寓意人与分身的连接枢纽。世界首个人与分身共存的办公协作网络 — 人做决策，分身做执行；人会离职，分身不会。"
      />

      {/* Quick Nav */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Link
          to="/bp"
          className="group flex items-center gap-4 p-5 bg-accent/5 border border-accent/20 rounded-xl hover:bg-accent/10 transition-colors"
        >
          <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center shrink-0 group-hover:bg-accent/25 transition-colors">
            <Presentation size={22} className="text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-text-primary mb-0.5">BP PPT — 投资人 Deck</div>
            <div className="text-[11px] text-text-secondary">
              10 页全屏演示，键盘翻页，一眼 get 整体逻辑
            </div>
          </div>
          <ArrowRight
            size={16}
            className="text-accent shrink-0 group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
        <Link
          to="/journey"
          className="group flex items-center gap-4 p-5 bg-clone-subtle/30 border border-clone/15 rounded-xl hover:bg-clone-subtle/50 transition-colors"
        >
          <div className="w-11 h-11 rounded-xl bg-clone/10 flex items-center justify-center shrink-0 group-hover:bg-clone/20 transition-colors">
            <RouteIcon size={22} className="text-clone" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-text-primary mb-0.5">
              User Journey — 交互体验
            </div>
            <div className="text-[11px] text-text-secondary">
              从 Landing 到团队协作，完整产品旅程
            </div>
          </div>
          <ArrowRight
            size={16}
            className="text-clone shrink-0 group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
        <Link
          to="/demo"
          className="group flex items-center gap-4 p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/10 transition-colors"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/25 transition-colors">
            <Play size={22} className="text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-text-primary mb-0.5">
              Product Demo — 沉浸体验
            </div>
            <div className="text-[11px] text-text-secondary">
              全屏产品界面，直接感受分身的赛博办公室
            </div>
          </div>
          <ArrowRight
            size={16}
            className="text-emerald-400 shrink-0 group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>

      {/* ===== SECTION 1: THE TIPPING POINT ===== */}
      <section className="mb-12">
        <SectionHeader
          title="1. 时代拐点 — 每一代「网络」定义一个时代"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="bg-surface-1 border border-border rounded-xl p-6 mb-6">
          <div className="text-xl font-bold text-text-primary mb-2">
            OpenClaw 给了龙虾一台电脑。nexu 给了龙虾一间办公室。
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            2003 年 LinkedIn 告诉世界：职场关系可以在线化。2013 年 Slack
            告诉世界：团队协作可以在对话里完成。2026 年 OpenClaw 告诉世界：Agent 比你想象的能干 — 但
            Agent 住在哪？OpenClaw 给了它电脑，EvoMap 给了它共享大脑。但没人给它
            <strong className="text-text-primary">一间办公室</strong>—
            有任务、有记忆、有同事，和人坐在一起。
          </p>
          <div className="p-4 bg-surface-3 rounded-lg border border-border text-[13px] text-text-primary font-medium">
            <span className="text-accent">Core thesis:</span> 不是又一个 Agent 工具。是{" "}
            <span className="text-accent">
              为你的龙虾打造一间赛博办公室 — 世界首个人与分身共存的办公协作网络
            </span>
            。 人做决策，分身做执行；人会离职，分身不会。
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <EraCard
            era="Era 1 · PC Internet"
            title="文本上云 — 搜索的开端"
            desc="把人类的基础文本资料在线化。最简单的检索，Google 定义了这个时代。数据是静态的，用户主动搜索。"
            color="bg-blue-500"
          />
          <EraCard
            era="Era 2 · Mobile Internet"
            title="多模态在线化 — 推荐的开端"
            desc="图片、视频、社交关系、位置等多模态资源在线化。推荐算法替代搜索，AI 的开端。数据是动态的，系统主动推送。"
            color="bg-violet-500"
          />
          <EraCard
            era="Era 3 · Agent Era"
            title="「共存」— 人与分身"
            desc="人和 AI 不再是使用和被使用的关系，而是共存、协作、互补。分身记住一切，经验可交接 — 员工走了，判断力留下。"
            color="bg-accent"
          />
        </div>
      </section>

      {/* ===== SECTION 2: WHAT WE SEE ===== */}
      <section className="mb-12">
        <SectionHeader
          title="2. 我们看到了什么 — What We See"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="grid grid-cols-2 gap-4">
          <InsightBlock icon={Shield} title="大企业的壁垒正在瓦解" accent="bg-danger-subtle">
            <p>SaaS 时代，大企业的壁垒是 UI 复杂度、行业 best practices、客户关系和资源垄断。</p>
            <p>
              Agent 时代，这些壁垒 <strong className="text-danger">全部失效</strong>：
            </p>
            <ul className="list-disc ml-4 space-y-1">
              <li>精美的 UI → Agent 不看 UI，直接调 API</li>
              <li>复杂的 workflow → Agent 自己编排，不需要人配置</li>
              <li>行业 best practices → 编码为 SKILL.md，可 fork 可组合</li>
              <li>客户关系 → 谁的 Agent 更懂用户，谁拥有关系</li>
            </ul>
          </InsightBlock>

          <InsightBlock icon={Lock} title="新的壁垒正在形成" accent="bg-emerald-500/10">
            <p>Agent 时代的新壁垒不再是"功能多"，而是：</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>
                <strong className="text-emerald-400">Memory Lock-in</strong> —
                分身越用越懂你，记忆不可迁移，不可复制
              </li>
              <li>
                <strong className="text-emerald-400">Relationship Lock-in</strong> —
                不只是个人，是整个团队的协作关系网
              </li>
              <li>
                <strong className="text-emerald-400">Agent-Parseable Architecture</strong> —
                SKILL.md 被 Agent 自然选择消费
              </li>
              <li>
                <strong className="text-emerald-400">Data Flywheel</strong> — 任务定义 +
                任务交付的数据，是 AGI 缺失的最后一环
              </li>
            </ul>
          </InsightBlock>
        </div>
      </section>

      {/* ===== SECTION 3: WHAT WE BUILD ===== */}
      <section className="mb-12">
        <SectionHeader
          title="3. 我们在建什么 — 龙虾的赛博办公室"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="bg-surface-1 border border-border rounded-xl p-6 mb-6">
          <div className="text-lg font-bold text-text-primary mb-3">
            为你的龙虾打造一间赛博办公室 — 世界首个人与分身共存的办公协作网络
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            在这个网络里，每个人有一个分身（Clone），分身记住你的一切、帮你工作、和团队的分身自动协作。人做决策，分身做执行。人会离职，分身不会
            — 知识不再随人走。
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <InsightBlock icon={Bot} title="为 Agentic 打造办公套件" accent="bg-blue-500/10">
            <ul className="list-disc ml-4 space-y-1">
              <li>Task — Agent 可读写的任务系统</li>
              <li>Calendar — Agent 可调度的日程</li>
              <li>Email — Agent 可收发的通信</li>
              <li>分身大脑 — 全新的记忆存储方式</li>
              <li>Skills Builder — 教 Agent 新能力</li>
              <li>AI Automation — 定时 + 触发 + 主动</li>
            </ul>
          </InsightBlock>

          <InsightBlock icon={Brain} title="为员工打造数字分身" accent="bg-violet-500/10">
            <ul className="list-disc ml-4 space-y-1">
              <li>Persona — 人设、风格、偏好</li>
              <li>Memory — 决策、想法、经验</li>
              <li>Worldview — 市场认知、竞争判断</li>
              <li>Skills — 掌握的能力集</li>
              <li>Knowledge — 领域知识库</li>
              <li>Contacts — 团队协作关系</li>
            </ul>
          </InsightBlock>

          <InsightBlock icon={Network} title="分身协作网络" accent="bg-cyan-500/10">
            <ul className="list-disc ml-4 space-y-1">
              <li>Agent 完成任务，人负责协调</li>
              <li>人提供 Context + Review</li>
              <li>Agent 代问进度、代写报告</li>
              <li>自动站会、Sprint 汇总</li>
              <li>任务委托：人 → Agent → 交付</li>
              <li>系统无限熵减，直接交付价值</li>
            </ul>
          </InsightBlock>
        </div>

        {/* Architecture visualization */}
        <div className="bg-surface-2 border border-border rounded-xl p-5">
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">
            三层架构
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-32 text-right text-[11px] text-text-muted shrink-0">用户入口</div>
              <ArrowRight size={12} className="text-text-muted shrink-0" />
              <div className="flex-1 p-3 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-2 text-[12px] font-medium text-accent">
                  <MessageSquare size={14} />
                  IM 入口 — 对话即操控一切
                </div>
                <div className="text-[10px] text-text-muted mt-1">
                  飞书 · Slack · WhatsApp · Email · SMS · Telegram — 7×24，任何终端
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 text-right text-[11px] text-text-muted shrink-0">
                产品层 (nexu)
              </div>
              <ArrowRight size={12} className="text-text-muted shrink-0" />
              <div className="flex-1 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <div className="flex items-center gap-2 text-[12px] font-medium text-violet-400">
                  <Sparkles size={14} />
                  数字分身 + 分身网络 + 6 种标准卡片
                </div>
                <div className="text-[10px] text-text-muted mt-1">
                  Agent 入口 · 端到端用例 · aha moment · AARRR 全链路
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 text-right text-[11px] text-text-muted shrink-0">
                基础设施 (Refly)
              </div>
              <ArrowRight size={12} className="text-text-muted shrink-0" />
              <div className="flex-1 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 text-[12px] font-medium text-emerald-400">
                  <Database size={14} />
                  Memory OS + Skill OS + Session Fabric
                </div>
                <div className="text-[10px] text-text-muted mt-1">
                  分身大脑 · 可学习的技能系统 · 跨终端无中断会话
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: WHY US ===== */}
      <section className="mb-12">
        <SectionHeader
          title="4. 为什么是我们 — Why Us"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-surface-2 border border-border rounded-xl p-5">
            <div className="text-sm font-bold text-text-primary mb-3">三层竞争优势</div>
            <div className="space-y-3">
              {[
                {
                  layer: "表层",
                  title: "模型聚合 + 迭代速度",
                  desc: "模型无关架构，自由组合 Claude/GPT/Gemini/DeepSeek。创业公司的 velocity 碾压大厂。",
                  color: "border-l-blue-500",
                },
                {
                  layer: "中层",
                  title: "Agent-Parseable 架构",
                  desc: "SKILL.md = Agent 和 Human 共享的原语。md 文件是最原生的共享操作单元 — 没有 API-to-UI 的鸿沟。",
                  color: "border-l-violet-500",
                },
                {
                  layer: "深层",
                  title: "Memory Lock-in",
                  desc: "用户的记忆、决策、偏好、协作关系全部沉淀在分身的大脑里。用得越多越离不开，竞品无法复制，切换成本无限高。",
                  color: "border-l-accent",
                },
              ].map((l) => (
                <div key={l.layer} className={`p-3 bg-surface-3 rounded-lg border-l-2 ${l.color}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-4 text-text-muted font-mono">
                      {l.layer}
                    </span>
                    <span className="text-[12px] font-medium text-text-primary">{l.title}</span>
                  </div>
                  <div className="text-[11px] text-text-secondary leading-relaxed">{l.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-2 border border-border rounded-xl p-5">
            <div className="text-sm font-bold text-text-primary mb-3">vs 竞品</div>
            <div className="space-y-2">
              {[
                {
                  name: "ChatGPT / Claude",
                  gap: "通用聊天，无 always-on，无深度记忆，无 IM 原生",
                  us: "Memory + IM 入口 + 连续线程",
                },
                {
                  name: "Manus",
                  gap: "浅层 Skills 集合（PPT/Deep Research），在 OpenClaw 背景下被消解",
                  us: "重建办公基础设施 + 分身网络，不在 Skills 层竞争",
                },
                {
                  name: "OpenClaw",
                  gap: "开放框架，需要用户自己组装",
                  us: "开箱即用的分身体验 + 分身网络",
                },
                {
                  name: "Dify / n8n",
                  gap: "上一代 workflow 工具，配置重",
                  us: "Agent-Native，对话即操控",
                },
                {
                  name: "OpenAI / Anthropic",
                  gap: "有模型，没有 task completion + 协作数据",
                  us: "拿到他们拿不到的数据",
                },
              ].map((c) => (
                <div key={c.name} className="p-2.5 bg-surface-3 rounded-lg">
                  <div className="text-[11px] font-medium text-text-primary mb-0.5">{c.name}</div>
                  <div className="text-[10px] text-text-muted line-through mb-0.5">{c.gap}</div>
                  <div className="text-[10px] text-success">✓ {c.us}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: THE FLYWHEEL ===== */}
      <section className="mb-12">
        <SectionHeader
          title="5. 增长飞轮 — The Flywheel"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="bg-surface-2 border border-border rounded-xl p-6">
          <div className="grid grid-cols-7 gap-2 items-center text-center mb-6">
            {[
              {
                label: "加 Bot",
                sub: "3 分钟上岗",
                color: "bg-blue-500/10 text-blue-400",
              },
              { label: "→", sub: "", color: "text-text-muted text-lg" },
              {
                label: "日常使用",
                sub: "对话即操控",
                color: "bg-violet-500/10 text-violet-400",
              },
              { label: "→", sub: "", color: "text-text-muted text-lg" },
              {
                label: "记忆沉淀",
                sub: "越用越懂你",
                color: "bg-accent/10 text-accent",
              },
              { label: "→", sub: "", color: "text-text-muted text-lg" },
              {
                label: "离不开",
                sub: "Memory Lock",
                color: "bg-emerald-500/10 text-emerald-400",
              },
            ].map((step) =>
              step.sub === "" ? (
                <div key={step.label} className={step.color}>
                  {step.label}
                </div>
              ) : (
                <div key={step.label} className={`p-3 rounded-xl ${step.color.split(" ")[0]}`}>
                  <div className={`text-[12px] font-bold ${step.color.split(" ")[1]}`}>
                    {step.label}
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5">{step.sub}</div>
                </div>
              ),
            )}
          </div>
          <div className="grid grid-cols-7 gap-2 items-center text-center">
            {[
              {
                label: "付费",
                sub: "¥29/月",
                color: "bg-amber-500/10 text-amber-400",
              },
              { label: "→", sub: "", color: "text-text-muted text-lg" },
              {
                label: "群里用",
                sub: "同事看到",
                color: "bg-cyan-500/10 text-cyan-400",
              },
              { label: "→", sub: "", color: "text-text-muted text-lg" },
              {
                label: "同事加入",
                sub: "k-factor 裂变",
                color: "bg-pink-500/10 text-pink-400",
              },
              { label: "→", sub: "", color: "text-text-muted text-lg" },
              {
                label: "分身网络",
                sub: "网络效应",
                color: "bg-green-500/10 text-green-400",
              },
            ].map((step) =>
              step.sub === "" ? (
                <div key={step.label} className={step.color}>
                  {step.label}
                </div>
              ) : (
                <div key={step.label} className={`p-3 rounded-xl ${step.color.split(" ")[0]}`}>
                  <div className={`text-[12px] font-bold ${step.color.split(" ")[1]}`}>
                    {step.label}
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5">{step.sub}</div>
                </div>
              ),
            )}
          </div>

          <div className="mt-6 p-4 bg-surface-3 rounded-lg">
            <div className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">
              GTM 路径
            </div>
            <div className="flex items-center gap-3 text-[12px]">
              <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 font-medium">
                ProC — $29/mo
              </span>
              <ArrowRight size={12} className="text-text-muted" />
              <span className="px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-400 font-medium">
                SMB Team — $19/人/月
              </span>
              <ArrowRight size={12} className="text-text-muted" />
              <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-medium">
                Enterprise — 自下而上采购
              </span>
            </div>
            <div className="text-[10px] text-text-muted mt-2">
              不是 top-down 大客户销售。而是 ProC 自费使用 → 团队看到价值 → 公司采购。像
              Slack、Figma、Notion 的增长路径。
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: THE ENDGAME ===== */}
      <section className="mb-12">
        <SectionHeader
          title="6. 终局愿景 — The Endgame"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="bg-surface-1 border border-accent/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Globe size={24} className="text-accent" />
            </div>
            <div>
              <div className="text-lg font-bold text-text-primary">
                「造人」— The Ultimate Data Play
              </div>
              <div className="text-sm text-accent">
                人类社会最高价值的数据，基础模型公司永远拿不到
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="p-4 bg-surface-3 rounded-xl">
              <div className="text-[12px] font-bold text-text-primary mb-2">
                分身 + 分身网络 大规模运转后 →
              </div>
              <div className="space-y-2 text-[11px] text-text-secondary">
                <div className="flex items-start gap-2">
                  <Target size={12} className="text-accent mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-text-primary">Task 定义数据</strong> —
                    人类如何定义和分解任务
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Zap size={12} className="text-accent mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-text-primary">Task 完成数据</strong> — Agent
                    如何执行任务并交付价值
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Users size={12} className="text-accent mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-text-primary">社会协作数据</strong> — 人与人、人与
                    Agent、Agent 与 Agent 的协作模式
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Database size={12} className="text-accent mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-text-primary">价值交付数据</strong> —
                    什么样的执行路径产生了真实商业价值
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-3 rounded-xl">
              <div className="text-[12px] font-bold text-text-primary mb-2">
                为什么 OpenAI / Anthropic 拿不到？
              </div>
              <div className="space-y-2 text-[11px] text-text-secondary">
                <p>
                  基础模型公司拿到的是 <strong className="text-text-primary">对话数据</strong>
                  （人问、AI 答），不是 <strong className="text-accent">工作数据</strong>
                  （人定义任务 → Agent 执行 → 交付价值 → 人 Review → 改进）。
                </p>
                <p>让 Agent 走向真正 AGI 需要的不是更多对话，而是：</p>
                <ul className="list-disc ml-4 space-y-0.5">
                  <li>真实的任务定义（不是 benchmark）</li>
                  <li>真实的执行反馈（不是 RLHF）</li>
                  <li>真实的协作模式（不是 multi-agent 模拟）</li>
                  <li>真实的价值衡量（不是 eval score）</li>
                </ul>
                <p className="text-accent font-medium">
                  这是「造人」的关键基础 — 我们是唯一能拿到的。
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl">
            <div className="text-sm font-bold text-accent mb-2">nexu 的终局定位</div>
            <div className="text-[13px] text-text-primary leading-relaxed">
              不是 AI 工具公司，不是 SaaS 公司。
              <br />是{" "}
              <strong className="text-accent">
                为你的龙虾打造一间赛博办公室 — 世界首个人与分身共存的办公协作网络
              </strong>{" "}
              —
              让每个人都有数字分身，分身组成协作网络。人做决策，分身做执行。人会离职，分身不会。知识永不流失，能力持续传承。
              <br />
              <br />
              <span className="text-text-secondary">
                类比：LinkedIn 定义了「职场关系在线化」，Slack 定义了「团队协作对话化」。
                <br />
                nexu 定义的是「人与分身共存办公」— 龙虾终于有自己的办公室了。
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 7: EVOLUTION ===== */}
      <section className="mb-12">
        <SectionHeader
          title="7. 思想演化 — How We Got Here"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="space-y-3">
          {[
            {
              version: "v0",
              date: "2026-01",
              title: "Work-as-Code",
              desc: "最初的想法 — 用代码的方式管理工作流。发现太技术导向，缺乏人性温度。",
              color: "bg-blue-500",
              decision: "方向对，形态不对。需要更人性化的入口。",
            },
            {
              version: "v1",
              date: "2026-01",
              title: "Digital Clone MVP",
              desc: '引入"数字分身"概念，但定位泛化。什么都想做，什么都做不深。',
              color: "bg-violet-500",
              decision: "分身的心智模型是对的，但需要更 sharp 的切入点。",
            },
            {
              version: "v2",
              date: "2026-02",
              title: "OPC Programmer",
              desc: "聚焦程序员垂直场景。TAM 只有 ~30M 程序员，且 Cursor/Claude Code 已占先机。",
              color: "bg-cyan-500",
              decision: "单角色垂直太窄。需要 universal entry + role-based depth。",
            },
            {
              version: "v3",
              date: "2026-02",
              title: "Universal Agent + Role Onboarding",
              desc: "一个 IM 入口 → 3 分钟 QnA → 角色识别 → 工具认证 → 在用户的领域解决问题。TAM 扩展到 300M+ 知识工作者。",
              color: "bg-emerald-500",
              decision:
                "角色收敛（有限类型可逐一优化），工具可控（认证+分配），付费可量化（credits × 调用）。",
            },
            {
              version: "v3.1",
              date: "2026-02",
              title: "Agent-Native 办公基础设施",
              desc: '从"做一个 Agent 产品"升维到"做 Agent 时代的办公基础设施"。Memory OS + Skill OS + Session Fabric + 分身网络。终局是拿到 task completion 数据。',
              color: "bg-accent",
              decision: "不选行业，选层 — 所有行业的 Agent 都需要记忆、技能和会话基础设施。",
            },
            {
              version: "v4",
              date: "2026-02",
              title: "龙虾的赛博办公室",
              desc: "从「基础设施」升维到「赛博办公室」。不是做工具，是为 OpenClaw 龙虾打造一间真正的办公室 — 世界首个人与分身共存的办公协作网络。People quit. Clones don't.",
              color: "bg-pink-500",
              decision: "从卖功能到定义品类 — 网络效应 + 记忆锁定 + 经验传承 = 不可替代。",
            },
          ].map((v) => (
            <div key={v.version} className="flex gap-4">
              <div className="shrink-0 w-16 pt-1 text-right">
                <div
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white ${v.color}`}
                >
                  {v.version}
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">{v.date}</div>
              </div>
              <div className="flex-1 bg-surface-2 border border-border rounded-lg p-4">
                <div className="text-[13px] font-bold text-text-primary mb-1">{v.title}</div>
                <div className="text-[11px] text-text-secondary leading-relaxed mb-2">{v.desc}</div>
                <div className="text-[11px] text-accent flex items-start gap-1.5">
                  <Layers size={12} className="mt-0.5 shrink-0" />
                  <span>{v.decision}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 8: CORE AXIOMS ===== */}
      <section className="mb-12">
        <SectionHeader
          title="8. 核心公理 — Core Axioms"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: Globe,
              title: "人与 AI 共存",
              desc: "不是人用 AI，不是 AI 替代人。是共存 — 人做决策，分身做执行。每个人有一个分身，分身组成网络，知识永不流失。",
            },
            {
              icon: MessageSquare,
              title: "对话即操控一切",
              desc: "一个 Session 写文件、记笔记、问同事、设自动化、装技能。所有操作产出 6 种标准卡片 — 可触碰、可交互、可追溯。",
            },
            {
              icon: Brain,
              title: "Memory 是终极壁垒",
              desc: "不是功能多，不是模型强。而是分身越用越懂你，记忆不可迁移。这是新时代的数据 moat — 比社交关系更深。",
            },
            {
              icon: Users,
              title: "人做决策，Agent 做执行",
              desc: "分身协作网络里，人提供 Context + Review，Agent 完成任务。系统无限熵减，直接交付价值。",
            },
            {
              icon: Globe,
              title: "IM-Native 分发",
              desc: "有机增长、低成本、零安装。Agent 在群里可见工作 → 旁观者被种草 → 一键加 Bot → k-factor 裂变。",
            },
            {
              icon: Sparkles,
              title: "不说功能说感受",
              desc: "不说技术说关系，不说工具说同事。每个触点强化「你有一个数字分身」的心智模型。有温度的专业。",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-surface-2 border border-border rounded-xl p-5 flex gap-4"
            >
              <div className="w-9 h-9 rounded-lg bg-accent-subtle flex items-center justify-center shrink-0">
                <Icon size={18} className="text-text-primary" />
              </div>
              <div>
                <div className="text-sm font-bold text-text-primary mb-1">{title}</div>
                <div className="text-xs text-text-secondary leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA: Experience It ===== */}
      <div className="mt-12 mb-4">
        <div className="bg-gradient-to-br from-accent/10 via-surface-1 to-cyan-500/10 border border-accent/20 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5 animate-clone-breath">
            <Play size={28} className="text-accent ml-1" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">给你的龙虾一间赛博办公室</h3>
          <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
            从 Landing Page
            开始，走一遍完整的用户旅程。世界首个人与分身共存的办公协作网络。人做决策，分身做执行。
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/journey"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-accent-fg rounded-lg text-sm font-medium transition-colors"
            >
              <Play size={16} />
              体验完整 User Journey
            </Link>
            <Link
              to="/app/sessions"
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-border hover:border-border-hover text-text-secondary hover:text-text-primary rounded-lg text-sm transition-colors"
            >
              <MessageSquare size={16} />
              直接看 Sessions 主线入口
            </Link>
            <Link
              to="/overview"
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-border hover:border-border-hover text-text-secondary hover:text-text-primary rounded-lg text-sm transition-colors"
            >
              <Layers size={16} />
              查看设计系统 Overview
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
