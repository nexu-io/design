import { X, Check, Crown, Sparkles, Users } from 'lucide-react'

const PLANS = [
  {
    name: '基础版',
    price: '免费',
    desc: '体验分身核心能力',
    icon: Sparkles,
    color: 'text-text-muted',
    features: ['500 credits/月', '3 个 Skills', '基础记忆', '1 个渠道'],
    cta: '当前方案',
    ctaStyle: 'bg-surface-3 text-text-muted cursor-default',
  },
  {
    name: '专业版',
    price: '¥199/月',
    desc: '释放分身全部潜力',
    icon: Crown,
    color: 'text-accent',
    badge: '推荐',
    features: ['5,000 credits/月', '无限 Skills', '深度记忆 + 知识库', '全部渠道', 'Proxy 代理对话', '自动化无限制'],
    cta: '升级 Pro',
    ctaStyle: 'bg-accent text-accent-fg hover:bg-accent/90',
  },
  {
    name: '团队版',
    price: '¥399/人/月',
    desc: '团队协作 + 分身互联',
    icon: Users,
    color: 'text-clone',
    features: ['Pro 全部功能', '团队共享记忆', 'Agent-to-Agent 协作', 'OKR + Sprint 联动', '管理后台', '优先支持'],
    cta: '联系我们',
    ctaStyle: 'bg-clone text-white hover:bg-clone/90',
  },
]

export default function PricingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center animate-fade-in'>
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={onClose} />
      <div className='relative bg-surface-0 border border-border rounded-2xl shadow-2xl w-[720px] max-h-[85vh] overflow-y-auto animate-scale-in'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-border'>
          <div>
            <h2 className='text-[16px] font-bold text-text-primary'>解锁你的超能力</h2>
            <p className='text-[12px] text-text-muted mt-0.5'>选择适合你的方案</p>
          </div>
          <button onClick={onClose} className='p-1.5 rounded-lg hover:bg-surface-3 text-text-muted transition-colors'>
            <X size={16} />
          </button>
        </div>

        <div className='grid grid-cols-3 gap-3 p-6'>
          {PLANS.map((plan) => {
            const Icon = plan.icon
            return (
              <div key={plan.name} className={`relative flex flex-col rounded-xl border p-4 transition-all ${
                plan.badge ? 'border-accent bg-accent/5 shadow-md shadow-accent/10' : 'border-border bg-surface-1'
              }`}>
                {plan.badge && (
                  <span className='absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] px-2.5 py-0.5 rounded-full bg-accent text-accent-fg font-medium'>
                    {plan.badge}
                  </span>
                )}
                <div className='flex items-center gap-2 mb-2'>
                  <Icon size={16} className={plan.color} />
                  <span className='text-[13px] font-semibold text-text-primary'>{plan.name}</span>
                </div>
                <div className='text-[20px] font-bold text-text-primary mb-1'>{plan.price}</div>
                <p className='text-[11px] text-text-muted mb-3'>{plan.desc}</p>
                <div className='flex-1 space-y-1.5 mb-4'>
                  {plan.features.map((f) => (
                    <div key={f} className='flex items-center gap-1.5 text-[11px] text-text-secondary'>
                      <Check size={12} className='text-success shrink-0' />
                      {f}
                    </div>
                  ))}
                </div>
                <button className={`w-full py-2 rounded-lg text-[12px] font-medium transition-colors ${plan.ctaStyle}`}>
                  {plan.cta}
                </button>
              </div>
            )
          })}
        </div>

        <div className='px-6 pb-5'>
          <div className='flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-accent/10 to-clone/10 border border-accent/20'>
            <span className='text-[18px]'>🎁</span>
            <div className='flex-1'>
              <div className='text-[12px] font-medium text-text-primary'>邀请 3 位同事，免费获得 Pro 30 天</div>
              <div className='text-[10px] text-text-muted'>每成功邀请 1 位，双方各获 10 天 Pro 体验</div>
            </div>
            <button className='px-3 py-1.5 bg-accent text-accent-fg rounded-lg text-[11px] font-medium hover:bg-accent/90 transition-colors'>
              生成邀请链接
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
