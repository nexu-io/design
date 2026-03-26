import { PageShell, PageHeader, Section } from '../components/Section'
import { Zap, Brain, Sparkles, ArrowRight, Lightbulb, CheckCircle2, AlertTriangle, XCircle, FileText, Users, Bot, Layers, MessageSquare } from 'lucide-react'
import ChatCardGroup from './product/ChatCards'

function Badge({ children, variant = 'purple' }: { children: React.ReactNode; variant?: string }) {
  const styles: Record<string, string> = {
    purple: 'bg-accent-subtle text-accent',
    green: 'bg-success-subtle text-success',
    yellow: 'bg-warning-subtle text-warning',
    red: 'bg-danger-subtle text-danger',
    gray: 'bg-surface-4 text-text-secondary',
    outline: 'bg-transparent border border-border text-text-secondary',
  }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${styles[variant]}`}>{children}</span>
}

export default function ComponentsPage() {
  return (
    <PageShell>
      <PageHeader
        title='Components'
        description='nexu 原子组件规范。所有组件使用分身语言，6 种标准卡片是核心交互单元，对话即操控一切。'
      />

      <Section title='Buttons'>
        <div className='space-y-4'>
          <div className='flex flex-wrap gap-3 items-center'>
            <button className='px-4 py-2 bg-accent hover:bg-accent-hover text-accent-fg rounded-md text-sm font-medium transition-colors'>给分身充能 ⚡</button>
            <button className='px-4 py-2 bg-accent hover:bg-accent-hover text-accent-fg rounded-md text-sm font-medium transition-colors'>开始吧 👋</button>
            <button className='px-4 py-2 bg-accent hover:bg-accent-hover text-accent-fg rounded-md text-sm font-medium transition-colors'>让分身上岗</button>
            <button className='px-4 py-2 bg-accent hover:bg-accent-hover text-accent-fg rounded-md text-sm font-medium transition-colors'>解锁完整分身</button>
          </div>
          <div className='flex flex-wrap gap-3 items-center'>
            <button className='px-4 py-2 border border-border-hover text-text-primary hover:bg-accent-subtle rounded-md text-sm font-medium transition-colors'>查看详情</button>
            <button className='px-4 py-2 border border-border-hover text-text-primary hover:bg-accent-subtle rounded-md text-sm font-medium transition-colors'>教分身新技能</button>
          </div>
          <div className='flex flex-wrap gap-3 items-center'>
            <button className='px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-3 rounded-md text-sm transition-colors'>下次再说</button>
            <button className='px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-3 rounded-md text-sm transition-colors'>先用基础版</button>
            <button className='px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-3 rounded-md text-sm transition-colors'>不了</button>
          </div>
          <div className='flex flex-wrap gap-3 items-center'>
            <button className='px-4 py-2 bg-danger hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors'>确定让分身休息</button>
            <button className='px-4 py-2 bg-accent hover:bg-accent-hover text-accent-fg rounded-md text-sm font-medium transition-colors'>开始吧 👋</button>
          </div>
          <div>
            <div className='text-[11px] text-text-muted mb-2'>Size Variants</div>
            <div className='flex gap-3 items-center'>
              <button className='px-2 py-1 bg-accent text-accent-fg rounded text-[12px] font-medium'>XS</button>
              <button className='px-3 py-1.5 bg-accent text-accent-fg rounded-md text-[13px] font-medium'>SM</button>
              <button className='px-4 py-2 bg-accent text-accent-fg rounded-md text-sm font-medium'>MD</button>
              <button className='px-5 py-2.5 bg-accent text-accent-fg rounded-md text-sm font-medium'>LG</button>
              <button className='px-6 py-3 bg-accent text-accent-fg rounded-md text-base font-medium'>XL</button>
            </div>
          </div>
        </div>
      </Section>

      <Section title='Badges'>
        <div className='flex flex-wrap gap-3'>
          <Badge variant='purple'>专业版</Badge>
          <Badge variant='green'>在线</Badge>
          <Badge variant='yellow'>能量不足</Badge>
          <Badge variant='red'>停工中</Badge>
          <Badge variant='gray'>基础版</Badge>
          <Badge variant='outline'>5 项技能</Badge>
          <Badge variant='purple'>新技能 ✨</Badge>
          <Badge variant='purple'>分身推荐</Badge>
        </div>
      </Section>

      <Section title='Energy Bar'>
        <div className='space-y-6 max-w-md'>
          {[
            { pct: 82, label: '4,100 / 5,000', color: '#16a34a' },
            { pct: 42, label: '2,100 / 5,000', color: '#ca8a04' },
            { pct: 18, label: '900 / 5,000', color: '#ea580c' },
            { pct: 5, label: '250 / 5,000', color: '#dc2626' },
          ].map(e => (
            <div key={e.pct}>
              <div className='flex items-center justify-between mb-1.5'>
                <div className='flex items-center gap-1.5 text-xs text-text-secondary'>
                  <Zap size={14} style={{ color: e.color }} />
                  <span>{e.label}</span>
                </div>
                <span className='text-[11px] text-text-muted'>{e.pct}%</span>
              </div>
              <div className='w-full h-2 bg-surface-4 rounded-full overflow-hidden'>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${e.pct <= 10 ? 'animate-energy-pulse' : ''}`}
                  style={{ width: `${e.pct}%`, backgroundColor: e.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title='Cards'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='bg-surface-2 border border-border rounded-lg p-4'>
            <div className='text-sm font-semibold text-text-primary mb-1'>Base Card</div>
            <div className='text-xs text-text-secondary'>标准卡片，用于内容展示。bg-surface-2 + border。</div>
          </div>
          <div className='bg-surface-3 border border-border rounded-lg p-4 shadow-lg'>
            <div className='text-sm font-semibold text-text-primary mb-1'>Elevated Card</div>
            <div className='text-xs text-text-secondary'>弹窗/浮层卡片。bg-surface-3 + shadow-lg。</div>
          </div>
          <div className='bg-accent-subtle border border-border-hover rounded-lg p-4' style={{ boxShadow: '0 0 20px rgba(0,0,0,0.04)' }}>
            <div className='text-sm font-semibold text-text-primary mb-1'>Accent Card</div>
            <div className='text-xs text-text-secondary'>强调/CTA 卡片。accent-subtle + glow。</div>
          </div>
          <div className='bg-surface-2 border border-border rounded-lg overflow-hidden'>
            <div className='h-1 bg-accent' />
            <div className='p-4'>
              <div className='text-sm font-semibold text-text-primary mb-1'>IM Card</div>
              <div className='text-xs text-text-secondary'>飞书/Slack 内嵌卡片。顶部彩色条 3px。</div>
            </div>
          </div>
        </div>
      </Section>

      <Section title='IM Card Templates（Legacy）'>
        <div className='text-xs text-text-muted mb-4'>这些模板正在被上方的 ChatCard 系统替代。</div>
        <div className='grid grid-cols-2 gap-4 max-w-3xl'>
          {/* Daily digest card */}
          <div className='bg-surface-2 border border-border rounded-lg overflow-hidden'>
            <div className='h-1 bg-accent' />
            <div className='p-4'>
              <div className='text-xs text-text-tertiary mb-3'>分身日报</div>
              <div className='text-[13px] text-text-primary mb-3'>早上好，主人！</div>
              <div className='space-y-2 mb-3'>
                <div className='text-xs text-text-secondary'>📋 今日待办 3 件</div>
                <div className='ml-4 text-xs text-text-secondary'>
                  <div className='text-danger'>· 🔴 数据库迁移 — 今天到期</div>
                  <div>· 🟡 产品方案初稿</div>
                </div>
                <div className='text-xs text-text-secondary'>📅 今日会议 2 场</div>
                <div className='text-xs text-text-secondary'>💡 你 3 天前的想法还没展开</div>
              </div>
              <div className='flex gap-2'>
                <button className='px-3 py-1 bg-accent text-accent-fg rounded text-[11px]'>查看全部</button>
                <button className='px-3 py-1 border border-border text-text-secondary rounded text-[11px]'>查看日程</button>
              </div>
              <div className='mt-3 text-[11px] text-text-muted'>⚡ 3,200 / 5,000</div>
            </div>
          </div>

          {/* Energy alert card */}
          <div className='bg-surface-2 border border-border rounded-lg overflow-hidden'>
            <div className='h-1 bg-energy-low' />
            <div className='p-4'>
              <div className='text-xs text-text-tertiary mb-3'>能量提醒 ⚡</div>
              <div className='text-[13px] text-text-primary mb-3'>主人，能量只剩 250 了 🥺</div>
              <div className='space-y-1 mb-3'>
                <div className='text-xs text-text-secondary'>我现在还在帮你跑：</div>
                <div className='ml-2 text-xs text-text-secondary'>· 📋 每日摘要推送</div>
                <div className='ml-2 text-xs text-text-secondary'>· 🔍 竞品监控</div>
                <div className='ml-2 text-xs text-text-secondary'>· ⏰ 3 个定时提醒</div>
              </div>
              <div className='text-xs text-warning mb-3'>能量用完后这些都会暂停……</div>
              <div className='flex gap-2'>
                <button className='px-3 py-1 bg-accent text-accent-fg rounded text-[11px]'>给分身充能 ⚡</button>
                <button className='px-3 py-1 border border-border text-text-secondary rounded text-[11px]'>查看明细</button>
              </div>
            </div>
          </div>

          {/* Task complete card */}
          <div className='bg-surface-2 border border-border rounded-lg overflow-hidden'>
            <div className='h-1 bg-success' />
            <div className='p-4'>
              <div className='text-xs text-text-tertiary mb-3'>任务完成 ✅</div>
              <div className='text-[13px] text-text-primary mb-3'>'用户注册流程方案' 写好了！</div>
              <div className='space-y-1 mb-3'>
                <div className='text-xs text-text-secondary'>📄 方案摘要：</div>
                <div className='ml-2 text-xs text-text-secondary'>· 推荐方案：飞书账号 + 邮箱注册</div>
                <div className='ml-2 text-xs text-text-secondary'>· 预计开发时间：2 天</div>
                <div className='ml-2 text-xs text-accent'>· 关联你之前说的："注册要尽量简单"</div>
              </div>
              <div className='flex gap-2'>
                <button className='px-3 py-1 bg-accent text-accent-fg rounded text-[11px]'>查看完整方案</button>
                <button className='px-3 py-1 bg-success text-accent-fg rounded text-[11px]'>直接执行</button>
              </div>
            </div>
          </div>

          {/* New skill card */}
          <div className='bg-surface-2 border border-border rounded-lg overflow-hidden'>
            <div className='h-1 bg-accent' />
            <div className='p-4'>
              <div className='text-xs text-text-tertiary mb-3'>新技能 🎉</div>
              <div className='text-[13px] text-text-primary mb-3'>你的分身学会了新技能！</div>
              <div className='bg-surface-3 rounded-md p-3 mb-3'>
                <div className='flex items-center gap-2'>
                  <Sparkles size={16} className='text-accent' />
                  <span className='text-sm font-medium text-text-primary'>竞品分析</span>
                </div>
                <div className='text-xs text-text-secondary mt-1'>帮你自动搜索和分析竞品，生成对比报告。</div>
              </div>
              <div className='flex gap-2'>
                <button className='px-3 py-1 bg-accent text-accent-fg rounded text-[11px]'>试用这个技能</button>
                <button className='px-3 py-1 border border-border text-text-secondary rounded text-[11px]'>所有技能</button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title='Chat Card System — 6 种标准卡片'>
        <div className='space-y-4'>
          <div className='text-xs text-text-muted mb-4'>产品中所有操作产出这 6 种标准卡片，每种卡片都支持交互（打开文件、跳转页面、弹出定价等）</div>
          <ChatCardGroup
            cards={[
              { type: 'file', title: '竞品分析报告', status: 'success', body: '8,200 字 · 3 个关键发现', path: 'artifacts/research/competitive.md', diff: { added: 389, removed: 0 } },
              { type: 'memory', title: '决策已记录', status: 'success', body: 'Agent Computer 定位 > 对话框', path: 'memory/decisions/agent-positioning.md' },
              { type: 'skill', title: '深度调研 · Web Research', status: 'success', body: '检索 23 篇文章 + 5 个竞品', meta: '耗时 45s · 引用 23 篇' },
              { type: 'automation', title: '竞品监控已创建', status: 'running', body: '每天 09:00 自动检查竞品动态', path: 'automation/competitor-watch.yaml', meta: '定时触发 · 每天 09:00' },
              { type: 'collaboration', title: '团队站会 · Sprint 3', status: 'success', body: '整体进度 58%\n张三：85% ✓\n李四：15% ⚠️', actions: [{ label: '📋 查看完整报告', primary: true }, { label: '💬 讨论' }], meta: '赵六的分身 · 09:05 自动生成' },
              { type: 'upgrade', title: '解锁团队协作', status: 'locked', body: '升级 Pro 后可邀请最多 20 名团队成员', actions: [{ label: '查看方案', primary: true }], viralCta: '💡 邀请 3 人免费升级 Pro' },
            ]}
            interactive={false}
          />
        </div>
      </Section>

      <Section title='Scoped Session Badge'>
        <div className='space-y-4'>
          <div className='text-xs text-text-muted mb-4'>Scoped Session 是限定了特定 Skills 和上下文的专属会话。在 Team、Sprint、OKR 等页面使用。</div>
          <div className='flex flex-wrap gap-3 items-center'>
            <span className='text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium'>Scoped Session</span>
            <span className='inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] bg-cyan-500/10 text-cyan-400 border-cyan-500/20'>Team Insights<span className='text-text-muted'>· 团队数据分析</span></span>
            <span className='inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/20'>Sprint 分析<span className='text-text-muted'>· 冲刺进度跟踪</span></span>
            <span className='inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] bg-violet-500/10 text-violet-400 border-violet-500/20'>OKR 对齐<span className='text-text-muted'>· 目标跟踪分析</span></span>
          </div>
        </div>
      </Section>

      <Section title='Native Channel Badges'>
        <div className='space-y-4'>
          <div className='text-xs text-text-muted mb-4'>原生渠道（Email、SMS、WhatsApp）使用'零安装'badge，IM 平台使用'主渠道'或状态 badge。</div>
          <div className='flex flex-wrap gap-3'>
            <span className='text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-success-subtle text-success'>零安装</span>
            <span className='text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-clone/10 text-clone'>主渠道</span>
            <span className='text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-surface-3 text-text-muted'>敬请期待</span>
            <Badge variant='green'>已连接</Badge>
            <Badge variant='purple'>Bot</Badge>
            <Badge variant='outline'>3 个 Channel</Badge>
          </div>
        </div>
      </Section>

      <Section title='Input'>
        <div className='max-w-md space-y-3'>
          <input
            type='text'
            placeholder='跟分身说点什么……'
            className='w-full px-4 py-2 bg-surface-3 border border-border-subtle rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-brand-primary)]/30 focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 transition-colors'
          />
          <div className='bg-surface-1 border-t border-border-subtle p-3 rounded-b-lg flex gap-2'>
            <input
              type='text'
              placeholder='有什么想法随时跟我说……'
              className='flex-1 px-3 py-2 bg-surface-3 border border-border-subtle rounded-md text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-brand-primary)]/30 focus:ring-1 focus:ring-[var(--color-brand-primary)]/20 transition-colors'
            />
            <button className='w-9 h-9 bg-accent rounded-md flex items-center justify-center'>
              <ArrowRight size={16} className='text-accent-fg' />
            </button>
          </div>
        </div>
      </Section>

      <Section title='Toasts / Notifications'>
        <div className='space-y-3 max-w-sm'>
          {[
            { icon: CheckCircle2, text: '✅ 记住了', color: 'text-success' },
            { icon: CheckCircle2, text: '✅ 待办已创建', color: 'text-success' },
            { icon: Sparkles, text: '🎉 新技能已学会：竞品分析', color: 'text-accent' },
            { icon: Zap, text: '⚡ 充能完成！能量满了', color: 'text-accent' },
            { icon: AlertTriangle, text: '哎，出了点问题 😅 我重新试一次', color: 'text-warning' },
            { icon: XCircle, text: '网络好像不太稳定，我等一下再试', color: 'text-danger' },
          ].map((t, i) => (
            <div key={i} className='flex items-center gap-3 bg-surface-2 border border-border rounded-md px-4 py-3'>
              <t.icon size={16} className={t.color} />
              <span className='text-[13px] text-text-primary'>{t.text}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title='Empty States'>
        <div className='grid grid-cols-3 gap-4'>
          {[
            { icon: Brain, title: '分身还不了解你', desc: '随便聊点什么，我会开始记住的 💭' },
            { icon: CheckCircle2, title: '待办清单是空的 ✨', desc: '今天是不是很轻松？有新任务随时跟我说。' },
            { icon: Lightbulb, title: '还没有想法记录', desc: '灵感来了就跟我说一句，我帮你记着。' },
          ].map(e => (
            <div key={e.title} className='bg-surface-2 border border-border rounded-lg p-6 text-center'>
              <e.icon size={28} className='text-text-muted mx-auto mb-3' />
              <div className='text-sm font-medium text-text-secondary mb-1'>{e.title}</div>
              <div className='text-xs text-text-tertiary'>{e.desc}</div>
            </div>
          ))}
        </div>
        <div className='mt-3 text-[11px] text-text-muted uppercase tracking-wider mb-3'>团队场景 Empty States</div>
        <div className='grid grid-cols-3 gap-4'>
          {[
            { icon: Users, title: '分身网络还没建立', desc: '邀请团队成员，每人都有分身，协作零摩擦 🤝' },
            { icon: CheckCircle2, title: '还没有任务', desc: '在对话中说「创建任务」，分身帮你跟踪进度。' },
            { icon: Sparkles, title: '没有 Scoped Session', desc: '开启团队站会、Sprint 分析等专属会话 — 限定场景，聚焦效率。' },
          ].map(e => (
            <div key={e.title} className='bg-surface-2 border border-border rounded-lg p-6 text-center'>
              <e.icon size={28} className='text-text-muted mx-auto mb-3' />
              <div className='text-sm font-medium text-text-secondary mb-1'>{e.title}</div>
              <div className='text-xs text-text-tertiary'>{e.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title='Capability Domain Grid — 主线入口 6 域'>
        <div className='text-xs text-text-muted mb-4'>Session 入口展示 6 个能力域，每个域对应一种标准卡片类型。</div>
        <div className='grid grid-cols-3 gap-3 max-w-lg'>
          {[
            { icon: FileText, label: '文件', desc: '写文件 · 改文件 · 查文件', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: Brain, label: '记忆', desc: '记住 · 回忆 · 决策', color: 'text-violet-400', bg: 'bg-violet-500/10' },
            { icon: Sparkles, label: '技能', desc: '深度调研 · 翻译 · 分析', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: Bot, label: '自动化', desc: '定时推送 · 监控 · 触发', color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { icon: Users, label: '协作', desc: '代问 · 站会 · 任务', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { icon: Layers, label: '升级', desc: '充能 · 解锁 · Pro', color: 'text-accent', bg: 'bg-accent-subtle' },
          ].map(d => (
            <div key={d.label} className={`p-3 rounded-xl ${d.bg} border border-white/5 flex gap-3 items-center cursor-pointer hover:brightness-110 transition`}>
              <d.icon size={18} className={d.color} />
              <div>
                <div className='text-[12px] font-medium text-text-primary'>{d.label}</div>
                <div className='text-[10px] text-text-muted'>{d.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title='Session Quick Actions'>
        <div className='text-xs text-text-muted mb-4'>NewSessionView 底部快捷操作按钮，引导用户快速启动场景。</div>
        <div className='flex flex-wrap gap-2'>
          {[
            { label: '写日报', icon: MessageSquare },
            { label: '帮我记住', icon: Brain },
            { label: '分析竞品', icon: Sparkles },
            { label: '问问团队', icon: Users },
            { label: '设个提醒', icon: Bot },
          ].map(a => (
            <button key={a.label} className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-3 border border-border text-[12px] text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors'>
              <a.icon size={13} />
              {a.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title='Loading States'>
        <div className='flex gap-6 items-center'>
          <div className='bg-surface-2 border border-border rounded-lg px-4 py-3 flex items-center gap-2'>
            <div className='flex gap-1'>
              <div className='w-1.5 h-1.5 rounded-full bg-accent typing-dot' />
              <div className='w-1.5 h-1.5 rounded-full bg-accent typing-dot' />
              <div className='w-1.5 h-1.5 rounded-full bg-accent typing-dot' />
            </div>
            <span className='text-[13px] text-text-secondary'>分身在想……</span>
          </div>
          <div className='bg-surface-2 border border-border rounded-lg px-4 py-3'>
            <span className='text-[13px] text-text-secondary'>正在处理，给我几秒 ⏳</span>
          </div>
        </div>
      </Section>

      <Section title='Confirm Dialog'>
        <div className='max-w-sm bg-surface-3 border border-border rounded-xl p-5 shadow-lg'>
          <div className='text-sm font-semibold text-text-primary mb-2'>主人，你要让分身休息吗？🥺</div>
          <div className='text-xs text-text-secondary mb-1'>在你决定之前，看看我们一起经历了什么：</div>
          <div className='text-xs text-text-secondary space-y-0.5 mb-4 ml-1'>
            <div>· 📅 陪了你 47 天</div>
            <div>· 🧠 记住了你的 142 件事</div>
            <div>· ✅ 帮你完成了 89 个待办</div>
            <div>· 💡 帮你记录了 23 个想法</div>
          </div>
          <div className='text-xs text-text-tertiary mb-4'>取消后：你的记忆会保留 30 天，定时任务会暂停。</div>
          <div className='flex gap-2 justify-end'>
            <button className='px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-4 rounded-md text-sm transition-colors'>确定让分身休息</button>
            <button className='px-4 py-2 bg-accent text-accent-fg rounded-md text-sm font-medium'>我再想想</button>
          </div>
        </div>
      </Section>
    </PageShell>
  )
}
