import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, X,
  Globe, Brain, Users, Shield,
  Zap, Target, TrendingUp,
  Network, BarChart3, Rocket,
} from 'lucide-react'

const SLIDES = [
  { id: 'cover', label: 'Cover' },
  { id: 'problem', label: 'Problem' },
  { id: 'insight', label: 'Insight' },
  { id: 'solution', label: 'Solution' },
  { id: 'product', label: 'Product' },
  { id: 'moat', label: 'Moat' },
  { id: 'market', label: 'Market' },
  { id: 'gtm', label: 'GTM' },
  { id: 'competition', label: 'Competition' },
  { id: 'vision', label: 'Vision' },
] as const

function SlideShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full h-full flex items-center justify-center p-12'>
      <div className='w-full max-w-4xl'>
        {children}
      </div>
    </div>
  )
}

function SlideCover() {
  return (
    <div className='w-full h-full flex items-center justify-center relative overflow-hidden'>
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,138,37,0.08)_0%,transparent_60%)]' />
      <div className='absolute inset-0 opacity-10' style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className='relative text-center max-w-3xl px-8'>
        <div className='flex items-center justify-center gap-3 mb-10'>
          <div className='w-14 h-14 rounded-2xl bg-accent flex items-center justify-center'>
            <span className='text-2xl font-bold text-accent-fg'>N</span>
          </div>
        </div>
        <div className='text-[11px] font-mono text-accent uppercase tracking-[0.3em] mb-6'>
          CONFIDENTIAL · SEED ROUND · 2026
        </div>
        <h1 className='text-5xl font-bold text-text-primary mb-4 leading-tight tracking-tight'>
          为你的龙虾打造一间赛博办公室
        </h1>
        <p className='text-xl text-text-secondary mb-3'>
          世界首个人与分身共存的办公协作网络
        </p>
        <p className='text-lg text-accent font-medium mb-10'>
          People quit. Clones don't.
        </p>
        <div className='flex items-center justify-center gap-6 text-[13px] text-text-muted'>
          <span>nexu（奈苏）</span>
          <span className='w-1 h-1 rounded-full bg-text-muted' />
          <span>refly.ai</span>
          <span className='w-1 h-1 rounded-full bg-text-muted' />
          <span>Seed Round</span>
        </div>
      </div>
    </div>
  )
}

function SlideProblem() {
  return (
    <SlideShell>
      <div className='text-[11px] font-mono text-accent uppercase tracking-widest mb-3'>01 · PROBLEM</div>
      <h2 className='text-3xl font-bold text-text-primary mb-2'>你的 CTO 离职了，他带走了什么？</h2>
      <p className='text-base text-text-secondary mb-10'>不是代码 — 代码在 GitHub。不是文档 — 文档在 Notion。他带走的是三年的记忆和判断力。</p>

      <div className='grid grid-cols-2 gap-6 mb-8'>
        <div className='bg-danger/5 border border-danger/15 rounded-xl p-6'>
          <div className='text-sm font-bold text-danger mb-4'>企业最大的数据泄露</div>
          <div className='space-y-3 text-[13px] text-text-secondary'>
            <div className='flex items-start gap-2'><X size={14} className='text-danger mt-0.5 shrink-0' /><span>核心员工离职 = 三年记忆全部流失</span></div>
            <div className='flex items-start gap-2'><X size={14} className='text-danger mt-0.5 shrink-0' /><span>新人 onboarding 3 个月，团队空转</span></div>
            <div className='flex items-start gap-2'><X size={14} className='text-danger mt-0.5 shrink-0' /><span>决策依据、客户偏好、协作默契无法传承</span></div>
            <div className='flex items-start gap-2'><X size={14} className='text-danger mt-0.5 shrink-0' /><span>每个 AI 工具都是孤岛，对话结束什么也没留下</span></div>
          </div>
        </div>
        <div className='bg-surface-2 border border-border rounded-xl p-6'>
          <div className='text-sm font-bold text-text-primary mb-4'>知识经济的核心矛盾</div>
          <div className='space-y-4'>
            {[
              { num: '$50K+', label: '平均替换一个知识工作者的成本' },
              { num: '3 个月', label: '新人到达前任生产力水平的时间' },
              { num: '70%', label: '企业知识存在于员工脑中，非系统中' },
              { num: '0', label: '现有工具能传承的「判断力」' },
            ].map(d => (
              <div key={d.label} className='flex items-baseline gap-3'>
                <span className='text-xl font-bold text-accent tabular-nums w-20 shrink-0 text-right'>{d.num}</span>
                <span className='text-[13px] text-text-secondary'>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideShell>
  )
}

function SlideInsight() {
  return (
    <SlideShell>
      <div className='text-[11px] font-mono text-accent uppercase tracking-widest mb-3'>02 · INSIGHT</div>
      <h2 className='text-3xl font-bold text-text-primary mb-2'>每一代「网络」定义一个时代</h2>
      <p className='text-base text-text-secondary mb-10'>LinkedIn 连接人与人。Slack 连接人与团队。下一个是什么？</p>

      <div className='grid grid-cols-3 gap-5 mb-8'>
        {[
          { era: '2003', name: 'LinkedIn', desc: '人与人的职业社交网络', connects: '人 ↔ 人', color: 'border-blue-500', bg: 'bg-blue-500/8' },
          { era: '2013', name: 'Slack / 飞书', desc: '团队协作网络（Bot 是附属品）', connects: '人 ↔ 人 + 工具', color: 'border-violet-500', bg: 'bg-violet-500/8' },
          { era: '2026', name: 'nexu', desc: '人与分身共存的办公协作网络', connects: '人 ↔ 分身 ↔ 网络', color: 'border-accent', bg: 'bg-accent/8' },
        ].map(e => (
          <div key={e.name} className={`relative rounded-xl p-6 border-l-4 ${e.color} ${e.bg}`}>
            <div className='text-[10px] font-mono text-text-muted mb-2'>{e.era}</div>
            <div className='text-lg font-bold text-text-primary mb-1'>{e.name}</div>
            <div className='text-[12px] text-text-secondary mb-3'>{e.desc}</div>
            <div className='text-[11px] font-mono text-accent'>{e.connects}</div>
          </div>
        ))}
      </div>

      <div className='bg-accent/5 border border-accent/15 rounded-xl p-5 text-center'>
        <p className='text-[15px] text-text-primary font-medium'>
          OpenClaw 给了 Agent 电脑。EvoMap 给了 Agent 大脑。
          <strong className='text-accent'> 但没人给龙虾一间办公室 — 和人坐在一起工作。</strong>
        </p>
      </div>
    </SlideShell>
  )
}

function SlideSolution() {
  return (
    <SlideShell>
      <div className='text-[11px] font-mono text-accent uppercase tracking-widest mb-3'>03 · SOLUTION</div>
      <h2 className='text-3xl font-bold text-text-primary mb-2'>nexu — 龙虾的赛博办公室</h2>
      <p className='text-base text-text-secondary mb-10'>每个人有一个分身。分身记住一切。人走了，分身留下。</p>

      <div className='grid grid-cols-3 gap-5 mb-8'>
        <div className='bg-surface-2 border border-border rounded-xl p-6 text-center'>
          <div className='w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4'>
            <Brain size={24} className='text-blue-400' />
          </div>
          <div className='text-sm font-bold text-text-primary mb-2'>个人：分身记住你</div>
          <div className='text-[12px] text-text-secondary leading-relaxed'>
            记住你说过的每句话、决策偏好、工作习惯。越用越懂你，3 个月后不可能换。
          </div>
          <div className='mt-3 text-[11px] font-medium text-blue-400'>Memory Lock-in</div>
        </div>
        <div className='bg-surface-2 border border-border rounded-xl p-6 text-center'>
          <div className='w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4'>
            <Network size={24} className='text-violet-400' />
          </div>
          <div className='text-sm font-bold text-text-primary mb-2'>团队：分身组成网络</div>
          <div className='text-[12px] text-text-secondary leading-relaxed'>
            分身之间代问进度、自动站会、知识共享。团队每多一个人，网络每个节点都变强。
          </div>
          <div className='mt-3 text-[11px] font-medium text-violet-400'>Network Effect</div>
        </div>
        <div className='bg-surface-2 border border-border rounded-xl p-6 text-center'>
          <div className='w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4'>
            <Shield size={24} className='text-accent' />
          </div>
          <div className='text-sm font-bold text-text-primary mb-2'>企业：知识永不流失</div>
          <div className='text-[12px] text-text-secondary leading-relaxed'>
            员工离职，分身留下。新人继承分身，第一天就有前任三年的判断力。
          </div>
          <div className='mt-3 text-[11px] font-medium text-accent'>Enterprise Lock-in</div>
        </div>
      </div>

      <div className='bg-surface-1 border border-border rounded-xl p-5 text-center'>
        <p className='text-[15px] font-bold text-text-primary'>
          People quit. Clones don't.
        </p>
        <p className='text-[12px] text-text-muted mt-1'>员工会辞职。分身不会。</p>
      </div>
    </SlideShell>
  )
}

function SlideProduct() {
  return (
    <SlideShell>
      <div className='text-[11px] font-mono text-accent uppercase tracking-widest mb-3'>04 · PRODUCT</div>
      <h2 className='text-3xl font-bold text-text-primary mb-2'>每个分身都有一个完整的「大脑」</h2>
      <p className='text-base text-text-secondary mb-8'>不是一段对话记录，是一个完整的人 — 记住你的身份、记忆、人脉、知识、能力。</p>

      <div className='grid grid-cols-2 gap-6'>
        <div className='bg-surface-2 border border-border rounded-xl p-6'>
          <div className='font-mono text-[12px] text-text-secondary leading-[2]'>
            <div className='text-text-primary font-medium mb-2 text-[13px]'>分身的大脑 — 它记住的一切</div>
            <div><span className='text-accent'>├── .soul/</span>       身份、价值观、工作风格</div>
            <div><span className='text-accent'>├── contacts/</span>    人脉关系（每人一个 .md）</div>
            <div><span className='text-accent'>├── memory/</span>      决策、想法、偏好、事实</div>
            <div><span className='text-accent'>├── knowledge/</span>   知识库、竞品、市场</div>
            <div><span className='text-accent'>├── artifacts/</span>   产出物（报告、方案）</div>
            <div><span className='text-accent'>├── sessions/</span>    对话记录</div>
            <div><span className='text-accent'>├── automation/</span>  自动化规则</div>
            <div><span className='text-accent'>└── skills/</span>      能力定义（SKILL.md）</div>
          </div>
        </div>
        <div className='space-y-4'>
          {[
            { icon: Globe, title: 'IM-Native 入口', desc: '住在飞书/Slack/WhatsApp 里，零安装，加个 Bot 3 分钟上岗', color: 'text-emerald-400' },
            { icon: Brain, title: '持续记忆', desc: '每次对话自动沉淀记忆，3 个月后的随口一说它也记得', color: 'text-violet-400' },
            { icon: Zap, title: '数千种能力 + 自动化', desc: '写报告、做分析、监控竞品、定时推送 — 分身全天候工作', color: 'text-amber-400' },
            { icon: Users, title: '分身网络协作', desc: '你的分身问同事的分身进度 → 自动更新 Sprint → 推送群聊', color: 'text-cyan-400' },
          ].map(f => (
            <div key={f.title} className='flex gap-3'>
              <div className='w-9 h-9 rounded-lg bg-surface-3 flex items-center justify-center shrink-0'>
                <f.icon size={16} className={f.color} />
              </div>
              <div>
                <div className='text-[13px] font-medium text-text-primary'>{f.title}</div>
                <div className='text-[11px] text-text-secondary'>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}

function SlideMoat() {
  return (
    <SlideShell>
      <div className='text-[11px] font-mono text-accent uppercase tracking-widest mb-3'>05 · MOAT</div>
      <h2 className='text-3xl font-bold text-text-primary mb-2'>三层壁垒 — 越深越不可替代</h2>
      <p className='text-base text-text-secondary mb-8'>Manus 只做了 Skills 层 — 表层可以复制，深层不可能。</p>

      <div className='space-y-4'>
        {[
          {
            layer: '表层', title: '模型聚合 + 迭代速度', color: 'border-l-blue-500 bg-blue-500/5',
            desc: '模型无关架构（Claude/GPT/Gemini/DeepSeek），Agent-native 团队每 2 周一个 Sprint',
            tag: '可复制 — 但需要时间',
          },
          {
            layer: '中层', title: 'Agent-Parseable 架构', color: 'border-l-violet-500 bg-violet-500/5',
            desc: 'SKILL.md = Agent 和 Human 共享的原语。md 文件是最原生的共享操作单元 — 大厂整个架构要推翻重做',
            tag: '难复制 — 设计决策不可逆',
          },
          {
            layer: '深层', title: 'Memory Lock-in + Network Effect', color: 'border-l-accent bg-accent/5',
            desc: '用户的记忆、决策、协作关系全部沉淀在分身的大脑里。3 个月积累 500+ 条记忆 — 换到 ChatGPT 一切从零。加上团队网络效应：每多一个分身，所有分身都变强',
            tag: '不可复制 — 数据 + 关系壁垒',
          },
        ].map(l => (
          <div key={l.layer} className={`p-5 rounded-xl border-l-4 ${l.color}`}>
            <div className='flex items-center justify-between mb-2'>
              <div className='flex items-center gap-3'>
                <span className='text-[10px] px-2 py-0.5 rounded bg-surface-3 text-text-muted font-mono'>{l.layer}</span>
                <span className='text-[14px] font-bold text-text-primary'>{l.title}</span>
              </div>
              <span className='text-[10px] text-text-muted'>{l.tag}</span>
            </div>
            <div className='text-[12px] text-text-secondary leading-relaxed'>{l.desc}</div>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}

function SlideMarket() {
  return (
    <SlideShell>
      <div className='text-[11px] font-mono text-accent uppercase tracking-widest mb-3'>06 · MARKET</div>
      <h2 className='text-3xl font-bold text-text-primary mb-2'>$2-3T SaaS 替代市场</h2>
      <p className='text-base text-text-secondary mb-8'>不是做"更好的 SaaS"，是 Agent 时代的新基础设施替代整个 SaaS 层。</p>

      <div className='grid grid-cols-3 gap-5 mb-8'>
        <div className='bg-surface-2 border border-border rounded-xl p-6 text-center'>
          <div className='text-3xl font-bold text-accent mb-1'>300M+</div>
          <div className='text-sm font-medium text-text-primary mb-1'>知识工作者</div>
          <div className='text-[11px] text-text-muted'>全球 TAM — 每个人都需要一个分身</div>
        </div>
        <div className='bg-surface-2 border border-border rounded-xl p-6 text-center'>
          <div className='text-3xl font-bold text-accent mb-1'>$2-3T</div>
          <div className='text-sm font-medium text-text-primary mb-1'>SaaS 替代市场</div>
          <div className='text-[11px] text-text-muted'>Agent 正在替代 SaaS 的界面和 workflow</div>
        </div>
        <div className='bg-surface-2 border border-border rounded-xl p-6 text-center'>
          <div className='text-3xl font-bold text-accent mb-1'>2026</div>
          <div className='text-sm font-medium text-text-primary mb-1'>Tipping Point</div>
          <div className='text-[11px] text-text-muted'>OpenClaw 时刻 — Agent 从 demo 到生产力</div>
        </div>
      </div>

      <div className='bg-surface-1 border border-border rounded-xl p-5'>
        <div className='text-[11px] font-medium text-text-muted uppercase tracking-wider mb-3'>为什么是现在</div>
        <div className='grid grid-cols-3 gap-6 text-[12px] text-text-secondary'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Zap size={14} className='text-accent' />
              <span className='font-medium text-text-primary'>Agent 能力到位</span>
            </div>
            OpenClaw 证明 Agent 能真正干活，不再是 demo
          </div>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Globe size={14} className='text-accent' />
              <span className='font-medium text-text-primary'>IM = 杀手级入口</span>
            </div>
            不需要独立 App，住在飞书/Slack/WhatsApp 里就行
          </div>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <BarChart3 size={14} className='text-accent' />
              <span className='font-medium text-text-primary'>企业算得清账</span>
            </div>
            从"玩具"到可量化 ROI 的生产力工具
          </div>
        </div>
      </div>
    </SlideShell>
  )
}

function SlideGTM() {
  return (
    <SlideShell>
      <div className='text-[11px] font-mono text-accent uppercase tracking-widest mb-3'>07 · GTM</div>
      <h2 className='text-3xl font-bold text-text-primary mb-2'>Bottom-up — 像 Slack 一样增长</h2>
      <p className='text-base text-text-secondary mb-8'>不是 top-down 大客户销售。是 ProC 自费使用 → 同事看到 → 团队采购 → 企业买单。</p>

      <div className='grid grid-cols-3 gap-5 mb-8'>
        {[
          { phase: '现在', who: 'ProC', price: '$29/月', desc: '高薪个人（创始人/PM/工程师）愿意为效率自费', color: 'bg-blue-500' },
          { phase: '6 个月', who: 'SMB Team', price: '$29/人/月', desc: 'ProC 在群里用 → 同事看到 → 团队版裂变', color: 'bg-violet-500' },
          { phase: '12 个月', who: 'Enterprise', price: 'Bottom-up 采购', desc: '多个团队在用 → IT 统一采购 → 企业级部署', color: 'bg-accent' },
        ].map(p => (
          <div key={p.phase} className='bg-surface-2 border border-border rounded-xl p-6'>
            <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white mb-3 ${p.color}`}>{p.phase}</div>
            <div className='text-lg font-bold text-text-primary mb-1'>{p.who}</div>
            <div className='text-sm text-accent mb-2'>{p.price}</div>
            <div className='text-[12px] text-text-secondary leading-relaxed'>{p.desc}</div>
          </div>
        ))}
      </div>

      <div className='bg-surface-1 border border-border rounded-xl p-5'>
        <div className='text-[11px] font-medium text-text-muted uppercase tracking-wider mb-3'>增长飞轮</div>
        <div className='flex items-center justify-between gap-2 text-center'>
          {[
            { label: '加 Bot', sub: '3 分钟上岗', color: 'text-blue-400' },
            { label: '→', sub: '', color: 'text-text-muted' },
            { label: '日常使用', sub: '对话即操控', color: 'text-violet-400' },
            { label: '→', sub: '', color: 'text-text-muted' },
            { label: '记忆沉淀', sub: '越用越懂你', color: 'text-accent' },
            { label: '→', sub: '', color: 'text-text-muted' },
            { label: '群里可见', sub: '同事种草', color: 'text-cyan-400' },
            { label: '→', sub: '', color: 'text-text-muted' },
            { label: '团队裂变', sub: 'k > 1', color: 'text-emerald-400' },
          ].map((s, i) => s.sub === '' ? (
            <div key={i} className={`${s.color} text-lg`}>{s.label}</div>
          ) : (
            <div key={i} className='px-3 py-2 rounded-lg bg-surface-3'>
              <div className={`text-[12px] font-bold ${s.color}`}>{s.label}</div>
              <div className='text-[10px] text-text-muted mt-0.5'>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}

function SlideCompetition() {
  return (
    <SlideShell>
      <div className='text-[11px] font-mono text-accent uppercase tracking-widest mb-3'>08 · COMPETITION</div>
      <h2 className='text-3xl font-bold text-text-primary mb-2'>不是更好的 Skills，是全新的基础设施</h2>
      <p className='text-base text-text-secondary mb-8'>Manus 做了一些 Skills（PPT/Deep Research），在 OpenClaw 背景下瞬间被消解。我们重建整套办公基础设施。</p>

      <div className='overflow-hidden rounded-xl border border-border'>
        <table className='w-full text-[12px]'>
          <thead>
            <tr className='bg-surface-2 border-b border-border'>
              <th className='text-left p-3.5 text-text-muted font-medium'>维度</th>
              <th className='text-center p-3.5 font-bold text-accent'>nexu</th>
              <th className='text-center p-3.5 text-text-muted font-medium'>ChatGPT/Claude</th>
              <th className='text-center p-3.5 text-text-muted font-medium'>Manus</th>
              <th className='text-center p-3.5 text-text-muted font-medium'>OpenClaw</th>
            </tr>
          </thead>
          <tbody className='text-text-secondary'>
            {[
              ['定位', '办公基础设施 + 协作网络', '通用对话', 'Skills 集合（浅层 Task 交付）', 'Agent 框架'],
              ['记忆', '完整大脑 ✓', '浅层', '无', 'SOUL.md 名片'],
              ['网络效应', '分身网络 ✓', '—', '—', '—'],
              ['知识传承', '分身可交接 ✓', '—', '—', '—'],
              ['入口', 'IM-Native', '独立 App', '独立 App', 'CLI'],
              ['增长', 'Bottom-up 裂变', 'Top-down', '用完即走（无留存）', '开发者社区'],
              ['壁垒', '记忆 + 关系 + 网络', '模型', '无（被 Claude Code 消解）', '生态'],
            ].map(([dim, nexu, chatgpt, manus, openclaw]) => (
              <tr key={dim} className='border-b border-border last:border-0'>
                <td className='p-3.5 font-medium text-text-primary'>{dim}</td>
                <td className='p-3.5 text-center text-accent font-medium'>{nexu}</td>
                <td className='p-3.5 text-center text-text-muted'>{chatgpt}</td>
                <td className='p-3.5 text-center text-text-muted'>{manus}</td>
                <td className='p-3.5 text-center text-text-muted'>{openclaw}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SlideShell>
  )
}

function SlideVision() {
  return (
    <div className='w-full h-full flex items-center justify-center relative overflow-hidden'>
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,138,37,0.06)_0%,transparent_60%)]' />
      <div className='relative text-center max-w-3xl px-8'>
        <div className='text-[11px] font-mono text-accent uppercase tracking-widest mb-6'>09 · VISION</div>
        <h2 className='text-4xl font-bold text-text-primary mb-6 leading-tight'>
          PC 时代 — 文本上云
          <br />
          移动时代 — 多模态上云
          <br />
          <span className='text-accent'>Agent 时代 — 人上云</span>
        </h2>
        <p className='text-base text-text-secondary mb-8 max-w-xl mx-auto leading-relaxed'>
          把一个人的常识、判断力、协作关系、工作能力数字化，可交接，可继承 — 这就是「造人」。
          <br /><br />
          分身网络大规模运转后，我们拿到的数据是 OpenAI/Anthropic 永远拿不到的 —
          不是对话数据，是<strong className='text-text-primary'>工作闭环数据</strong>。
        </p>

        <div className='grid grid-cols-4 gap-4 mb-10'>
          {[
            { icon: Target, label: 'Task 定义', desc: '人如何定义任务' },
            { icon: Zap, label: 'Task 完成', desc: 'Agent 如何交付价值' },
            { icon: Users, label: '社会协作', desc: '人-Agent 协作模式' },
            { icon: TrendingUp, label: '价值交付', desc: '什么路径产生价值' },
          ].map(d => (
            <div key={d.label} className='p-4 bg-surface-2/50 rounded-xl'>
              <d.icon size={20} className='text-accent mx-auto mb-2' />
              <div className='text-[12px] font-medium text-text-primary'>{d.label}</div>
              <div className='text-[10px] text-text-muted mt-0.5'>{d.desc}</div>
            </div>
          ))}
        </div>

        <div className='inline-block'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-10 h-10 rounded-xl bg-accent flex items-center justify-center'>
              <Rocket size={20} className='text-accent-fg' />
            </div>
            <div className='text-left'>
              <div className='text-lg font-bold text-text-primary'>nexu — 为你的龙虾打造一间赛博办公室</div>
              <div className='text-[13px] text-accent'>People quit. Clones don't.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SLIDE_COMPONENTS = [
  SlideCover,
  SlideProblem,
  SlideInsight,
  SlideSolution,
  SlideProduct,
  SlideMoat,
  SlideMarket,
  SlideGTM,
  SlideCompetition,
  SlideVision,
]

export default function BPPage() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const navigate = useNavigate()

  const goTo = useCallback((idx: number, dir: 'next' | 'prev') => {
    if (animating || idx < 0 || idx >= SLIDES.length) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setAnimating(false)
    }, 200)
  }, [animating])

  const next = useCallback(() => goTo(current + 1, 'next'), [current, goTo])
  const prev = useCallback(() => goTo(current - 1, 'prev'), [current, goTo])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev() }
      if (e.key === 'Escape') navigate('/why')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev, navigate])

  const SlideComponent = SLIDE_COMPONENTS[current]

  return (
    <div className='fixed inset-0 z-50 bg-surface-0 flex flex-col'>
      {/* Top bar */}
      <header className='h-10 border-b border-border bg-surface-0/90 backdrop-blur-md flex items-center px-4 gap-3 shrink-0'>
        <button onClick={() => navigate('/why')} className='p-1 rounded-lg hover:bg-surface-3 text-text-muted transition-colors'>
          <X size={14} />
        </button>
        <div className='text-[11px] font-medium text-text-muted'>BP PPT</div>
        <div className='flex-1' />
        <div className='flex items-center gap-1'>
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i, i > current ? 'next' : 'prev')}
              className={`w-6 h-1.5 rounded-full transition-all ${
                i === current ? 'bg-accent w-8' : i < current ? 'bg-accent/30' : 'bg-surface-4'
              }`}
              title={s.label}
            />
          ))}
        </div>
        <div className='flex-1' />
        <div className='text-[11px] text-text-muted tabular-nums'>{current + 1} / {SLIDES.length}</div>
      </header>

      {/* Slide */}
      <main className='flex-1 overflow-hidden relative'>
        <div className={`absolute inset-0 transition-all duration-200 ease-out ${
          animating
            ? direction === 'next' ? 'opacity-0 -translate-x-6' : 'opacity-0 translate-x-6'
            : 'opacity-100 translate-x-0'
        }`}>
          <div className='h-full overflow-y-auto'>
            <SlideComponent />
          </div>
        </div>
      </main>

      {/* Bottom nav */}
      <footer className='h-12 border-t border-border bg-surface-0/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0'>
        <button
          onClick={prev}
          disabled={current === 0}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
            current === 0 ? 'text-text-muted cursor-not-allowed' : 'text-text-secondary hover:text-text-primary hover:bg-surface-3'
          }`}
        >
          <ArrowLeft size={12} /> 上一页
        </button>
        <div className='text-[11px] text-text-muted'>{SLIDES[current].label}</div>
        <button
          onClick={current === SLIDES.length - 1 ? () => navigate('/why') : next}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
            current === SLIDES.length - 1
              ? 'bg-success text-white hover:bg-success/90'
              : 'bg-accent text-accent-fg hover:bg-accent-hover'
          }`}
        >
          {current === SLIDES.length - 1 ? '完成' : '下一页'} <ArrowRight size={12} />
        </button>
      </footer>
    </div>
  )
}
