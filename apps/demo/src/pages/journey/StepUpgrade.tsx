import {
  Check, Sparkles, Crown, Users, ArrowRight,
  Zap, Brain, Shield, BarChart3, UserPlus,
  Rocket, Gift,
} from 'lucide-react'

const VALUE_ITEMS = [
  { icon: Brain, label: '无限记忆', free: '50 条', pro: '无限制', team: '无限制 + 共享' },
  { icon: Zap, label: '自动任务', free: '—', pro: '无限制', team: '无限制 + 团队联动' },
  { icon: Sparkles, label: '能力', free: '3 种', pro: '数千种 + 自定义', team: '数千种 + 团队共享' },
  { icon: BarChart3, label: '每日动态', free: '基础版', pro: '完整 + 主动提醒', team: '完整 + 团队 Insights' },
  { icon: Shield, label: '知识库', free: '10 MB', pro: '10 GB', team: '100 GB + 团队共享' },
  { icon: Users, label: '分身协作', free: '—', pro: '—', team: '分身间自动通信' },
]

const PLANS = [
  {
    name: '基础版',
    price: '免费',
    sub: '',
    desc: '入门体验分身能力',
    items: ['分身上岗', '500 能量/月', '3 种能力', '50 条记忆', '基础动态'],
    cta: '当前版本',
    highlight: false,
    disabled: true,
  },
  {
    name: '专业版',
    price: '¥29',
    sub: '/月',
    desc: '解锁完整分身潜力',
    items: [
      '5,000 能量/月',
      '无限能力 + 自定义',
      '完整记忆 + 成长体系',
      '自动任务 + 主动提醒',
      '飞书/Slack 深度整合',
      '优先模型',
    ],
    cta: '升级到专业版',
    highlight: true,
    disabled: false,
  },
  {
    name: '团队版',
    price: '¥19',
    sub: '/人/月',
    desc: '全团队 AI 协作网络',
    items: [
      '专业版全部能力',
      '团队共享知识库',
      '分身间自动协作',
      'OKR + Sprint 联动',
      '团队管理后台',
      '优先技术支持',
    ],
    cta: '邀请团队',
    highlight: false,
    disabled: false,
  },
]

const SUPERPOWERS = [
  { icon: '🧠', title: '记忆锁定', desc: '用了 30 天后，分身比你自己还懂你的偏好和工作习惯' },
  { icon: '⚡', title: '自动驾驶', desc: '竞品监控、日报周报、客户跟进 — 分身全天候自动运转' },
  { icon: '🤝', title: '团队网络', desc: '分身帮你问进度、对齐信息、汇总全局 — 不打扰同事' },
  { icon: '📈', title: '越用越强', desc: '每次对话都在学习你的风格，等级和默契度持续成长' },
]

export default function StepUpgrade() {
  return (
    <div className='max-w-4xl mx-auto px-6 py-8'>
      {/* Header */}
      <div className='text-center mb-10'>
        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clone/10 text-clone text-[11px] leading-none font-semibold mb-4'>
          <Gift size={12} /> 解锁你的超能力
        </div>
        <h1 className='text-2xl font-bold text-text-primary mb-3 tracking-tight'>
          你已经体验了分身的基础能力
        </h1>
        <p className='text-sm text-text-tertiary max-w-lg mx-auto leading-relaxed'>
          升级后，分身将进入全力以赴模式 — 无限记忆、自动任务、团队协作。<br />
          <span className='text-text-secondary font-medium'>这不是付费墙，是你的超能力入口。</span>
        </p>
      </div>

      {/* Value you've already built */}
      <div className='bg-surface-1 border border-border rounded-xl p-5 mb-8'>
        <div className='flex items-center gap-2 mb-4'>
          <Rocket size={14} className='text-clone' />
          <span className='text-[13px] font-semibold text-text-primary'>你刚才体验的旅程已经为你创造了价值</span>
        </div>
        <div className='grid grid-cols-4 gap-4'>
          {SUPERPOWERS.map(s => (
            <div key={s.title} className='text-center'>
              <div className='text-2xl mb-2'>{s.icon}</div>
              <div className='text-[12px] font-semibold text-text-primary mb-1'>{s.title}</div>
              <div className='text-[10px] text-text-muted leading-relaxed'>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Capability comparison table */}
      <div className='bg-surface-1 border border-border rounded-xl overflow-hidden mb-8'>
        <div className='px-5 py-3 border-b border-border bg-surface-2/50'>
          <span className='text-[13px] font-semibold text-text-primary'>能力对比 — 你值得拥有更多</span>
        </div>
        <table className='w-full text-[12px]'>
          <thead>
            <tr className='border-b border-border'>
              <th className='text-left p-3 text-text-secondary font-medium w-[28%]'>能力</th>
              <th className='text-center p-3 text-text-muted font-medium w-[24%]'>基础版</th>
              <th className='text-center p-3 font-semibold text-text-primary w-[24%]'>
                <span className='inline-flex items-center gap-1'>
                  <Crown size={11} className='text-clone' /> 专业版
                </span>
              </th>
              <th className='text-center p-3 font-medium text-text-secondary w-[24%]'>
                <span className='inline-flex items-center gap-1'>
                  <Users size={11} /> 团队版
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {VALUE_ITEMS.map(item => (
              <tr key={item.label} className='border-b border-border last:border-0'>
                <td className='p-3 text-text-primary flex items-center gap-2'>
                  <item.icon size={13} className='text-text-muted' /> {item.label}
                </td>
                <td className='p-3 text-center text-text-muted'>{item.free}</td>
                <td className='p-3 text-center text-text-primary font-medium'>{item.pro}</td>
                <td className='p-3 text-center text-text-secondary'>{item.team}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pricing cards */}
      <div className='grid grid-cols-3 gap-5 mb-8'>
        {PLANS.map(p => (
          <div
            key={p.name}
            className={`rounded-xl p-5 relative ${
              p.highlight
                ? 'bg-surface-1 border-2 border-clone/30'
                : 'bg-surface-1 border border-border'
            }`}
            style={p.highlight ? { boxShadow: '0 0 40px rgba(192,138,37,0.08)' } : {}}
          >
            {p.highlight && (
              <div className='absolute -top-2.5 left-1/2 -translate-x-1/2 bg-clone text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full'>
                推荐
              </div>
            )}
            <div className='text-[13px] font-medium text-text-secondary'>{p.name}</div>
            <div className='text-[11px] text-text-muted mb-3'>{p.desc}</div>
            <div className='mb-5'>
              <span className='text-2xl font-bold text-text-primary tracking-tight'>{p.price}</span>
              <span className='text-[12px] text-text-muted'>{p.sub}</span>
            </div>
            <div className='space-y-2 mb-5'>
              {p.items.map(item => (
                <div key={item} className='text-[12px] text-text-secondary flex items-center gap-2'>
                  <Check size={12} className='text-clone shrink-0' /> {item}
                </div>
              ))}
            </div>
            <button
              disabled={p.disabled}
              className={`w-full py-2 rounded-lg text-[12px] font-medium transition-all ${
                p.disabled
                  ? 'bg-surface-3 text-text-muted cursor-default'
                  : p.highlight
                    ? 'bg-accent text-accent-fg hover:bg-accent-hover'
                    : 'border border-border text-text-secondary hover:text-text-primary hover:border-border-hover'
              }`}
            >
              {p.name === '团队版' && <UserPlus size={12} className='inline mr-1.5' />}
              {p.cta}
              {!p.disabled && <ArrowRight size={12} className='inline ml-1' />}
            </button>
          </div>
        ))}
      </div>

      {/* Team invite incentive */}
      <div className='bg-accent/5 border border-accent/15 rounded-xl p-5 mb-8'>
        <div className='flex items-start gap-4'>
          <div className='w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0'>
            <UserPlus size={20} className='text-accent' />
          </div>
          <div className='flex-1'>
            <div className='text-[14px] font-semibold text-text-primary mb-1'>
              邀请同事，一起解锁超能力
            </div>
            <div className='text-[12px] text-text-muted leading-relaxed mb-3'>
              邀请 3 位同事加入，每人免费获得 Pro 版 30 天。你也会获得 30 天 Pro 延期。<br />
              团队越大，每个分身获得的共享知识越多，协作效率越高。
            </div>
            <div className='flex items-center gap-3'>
              <button className='px-4 py-2 bg-accent hover:bg-accent-hover text-accent-fg rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1.5'>
                <UserPlus size={12} /> 生成邀请链接
              </button>
              <div className='text-[11px] text-text-muted'>
                或直接在飞书/Slack 群里 @分身，说 "邀请 XXX"
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skip option */}
      <div className='text-center'>
        <div className='text-[11px] text-text-muted mb-2'>
          升级是可选的。基础版完全免费，随时可以升级。
        </div>
        <div className='flex items-center justify-center gap-3 text-[12px]'>
          <span className='text-text-muted'>✓ 不强制付费</span>
          <span className='text-text-muted'>✓ 随时升降级</span>
          <span className='text-text-muted'>✓ 数据不丢失</span>
        </div>
      </div>
    </div>
  )
}
