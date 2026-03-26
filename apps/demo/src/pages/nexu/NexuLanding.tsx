import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Users,
  Send,
  ClipboardCheck,
  TrendingUp,
  Sparkles,
  BookOpen,
  MessageSquare,
  Check,
  ChevronDown,
  Zap,
  LayoutDashboard,
} from 'lucide-react'
import { Badge, Button, Input } from '@nexu/ui-web'

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className='border-b border-border'>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='flex w-full cursor-pointer items-center justify-between py-4 text-left'
      >
        <span className='text-sm font-medium text-text-primary'>{q}</span>
        <ChevronDown
          size={16}
          className={`ml-4 shrink-0 text-text-tertiary transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className='pb-4 text-sm leading-relaxed text-text-secondary'>{a}</div>
      )}
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  badge,
}: {
  icon: typeof Users
  title: string
  desc: string
  badge?: string
}) {
  return (
    <div className='card p-6 group'>
      <div className='mb-4 flex items-start justify-between'>
        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10'>
          <Icon size={20} className='text-accent' />
        </div>
        {badge && (
          <Badge variant='brand' size='sm'>
            {badge}
          </Badge>
        )}
      </div>
      <div className='mb-2 text-[14px] font-semibold text-text-primary'>
        {title}
      </div>
      <div className='text-[13px] leading-relaxed text-text-muted'>{desc}</div>
    </div>
  )
}

function DashboardPreview() {
  return (
    <div className='overflow-hidden rounded-xl border border-border bg-surface-1 shadow-lg'>
      <div className='flex items-center gap-2 border-b border-border bg-surface-0 px-4 py-2.5'>
        <div className='flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-[10px]'>
          N
        </div>
        <span className='text-xs font-medium text-text-primary'>nexu 工作台</span>
        <div className='ml-auto h-2 w-2 rounded-full bg-success' />
      </div>
      <div className='p-4 space-y-3'>
        <div className='rounded-lg border-2 border-accent/20 bg-accent-subtle p-3'>
          <div className='text-[11px] font-medium text-text-muted uppercase tracking-wider'>
            即时任务下达
          </div>
          <div className='mt-1.5 flex items-center gap-2'>
            <div className='h-8 flex-1 rounded-md border border-border bg-surface-0 px-2.5 py-1.5 text-[11px] text-text-muted'>
              汇总本周各渠道转化数据并生成一页摘要
            </div>
            <div className='rounded-lg bg-accent px-2.5 py-1.5 text-[11px] font-medium text-accent-fg'>
              下达
            </div>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          {['运营助手', '研发助手', '内容助手', '创始人分身'].map((name, i) => (
            <div
              key={name}
              className='flex items-center gap-2 rounded-lg border border-border bg-surface-2/50 px-2.5 py-2'
            >
              <div className='h-7 w-7 rounded-md bg-accent/10' />
              <div className='min-w-0 flex-1'>
                <div className='truncate text-[11px] font-medium text-text-primary'>
                  {name}
                </div>
                <div className='text-[9px] text-text-muted'>
                  {i % 3 === 0 ? '执行中' : '空闲'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function IMPreview() {
  return (
    <div className='overflow-hidden rounded-xl border border-border bg-surface-1 shadow-lg'>
      <div className='flex items-center gap-2 border-b border-border bg-surface-0 px-4 py-2.5'>
        <div className='flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-[10px]'>
          N
        </div>
        <span className='text-xs font-medium text-text-primary'>nexu Bot</span>
        <div className='ml-auto h-2 w-2 rounded-full bg-success' />
      </div>
      <div className='space-y-3 p-4'>
        <div className='flex justify-end'>
          <div className='max-w-[85%] rounded-lg rounded-br-sm bg-accent px-3 py-2 text-[13px] text-accent-fg'>
            帮我汇总今天 Linear 里 assigned to 我的未完成事项
          </div>
        </div>
        <div className='flex gap-2'>
          <div className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[10px]'>
            🤖
          </div>
          <div className='inline-block max-w-[90%] rounded-lg rounded-bl-sm border border-border bg-surface-2 px-3 py-2 text-[13px] text-text-primary'>
            已交给研发助手处理，预计 2 分钟内完成…
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NexuLanding() {
  const [email, setEmail] = useState('')

  return (
    <div className='min-h-full bg-surface-0'>
      {/* Nav */}
      <nav className='sticky top-0 z-50 border-b border-border bg-surface-0/85 backdrop-blur-md'>
        <div className='mx-auto flex h-14 max-w-5xl items-center justify-between px-6'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-accent'>
              <span className='text-[11px] font-bold text-accent-fg'>N</span>
            </div>
            <span className='text-sm font-semibold tracking-tight text-text-primary'>
              nexu
            </span>
            <Badge variant='brand' size='sm'>
              分身监控管理
            </Badge>
          </div>
          <div className='flex items-center gap-6 text-[13px] text-text-tertiary'>
            <a href='#features' className='transition-colors hover:text-text-primary'>
              功能
            </a>
            <a href='#how' className='transition-colors hover:text-text-primary'>
              使用方式
            </a>
            <a href='#faq' className='transition-colors hover:text-text-primary'>
              FAQ
            </a>
            <Button asChild size='sm'>
              <Link to='/nexu'>
                进入产品 <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className='relative overflow-hidden'>
        <div
          className='absolute inset-0 opacity-15'
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,171,96,0.06)_0%,transparent_50%)]' />
        <div className='relative mx-auto max-w-4xl px-6 pt-24 pb-20 text-center'>
          <Badge variant='brand' size='lg' className='mb-8 text-xs'>
            <Zap size={12} /> 基于 Refly 能力 · 多数字员工，赛博工作室
          </Badge>
          <h1 className='mb-6 text-[48px] font-bold leading-[1.1] tracking-tight text-text-primary'>
            在 Slack / 飞书里，
            <br />
            <span className='text-accent'>随时调用你的数字分身</span>
          </h1>
          <p className='mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-text-tertiary'>
            nexu 是分身监控管理平台：预设角色、即时任务下达、关键节点审批、进度与 ROI 一目了然。
            <br />
            连上 IM，一句话指派任务；在办公软件里就能用，无需切后台。
          </p>
          <div className='mx-auto mb-6 flex max-w-md items-center justify-center gap-3'>
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='输入你的邮箱'
              className='flex-1 h-auto'
            />
            <Button asChild size='lg' className='shrink-0'>
              <Link to='/nexu'>
                免费开始 <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
          <div className='flex items-center justify-center gap-4 text-[13px] text-text-muted'>
            <span className='flex items-center gap-1'>
              <Check size={12} className='text-accent' /> 预设角色开箱即用
            </span>
            <span className='flex items-center gap-1'>
              <Check size={12} className='text-accent' /> 支持 Slack / 飞书
            </span>
            <span className='flex items-center gap-1'>
              <Check size={12} className='text-accent' /> 审批与进度可追溯
            </span>
          </div>
        </div>
      </section>

      {/* Demo — 工作台 + IM */}
      <section className='mx-auto max-w-5xl px-6 py-16'>
        <div className='grid items-start gap-8 lg:grid-cols-2'>
          <div>
            <div className='mb-3 text-[11px] font-semibold uppercase tracking-widest text-accent'>
              工作台
            </div>
            <DashboardPreview />
          </div>
          <div>
            <div className='mb-3 text-[11px] font-semibold uppercase tracking-widest text-accent'>
              在 Slack / 飞书里指派
            </div>
            <IMPreview />
          </div>
        </div>
      </section>

      <div className='mx-auto max-w-4xl px-6'>
        <div className='border-t border-border' />
      </div>

      {/* Value Props */}
      <section id='features' className='mx-auto max-w-4xl px-6 py-24'>
        <div className='mb-14 text-center'>
          <div className='mb-3 text-[11px] font-semibold uppercase tracking-widest text-accent'>
            核心能力
          </div>
          <h2 className='text-2xl font-bold tracking-tight text-text-primary'>
            任务、审批、进度、技能 — 一站管理
          </h2>
          <p className='mx-auto mt-3 max-w-lg text-sm leading-relaxed text-text-tertiary'>
            预设运营 / 研发 / 内容 / 创始人等角色，每个分身独立技能与知识库，关键节点可审批、可纠偏。
          </p>
        </div>
        <div className='grid grid-cols-3 gap-5'>
          <FeatureCard
            icon={Send}
            title='即时任务下达'
            desc='用自然语言描述任务，选分身或自动分配。支持快捷话术与自动化触发。'
            badge='核心'
          />
          <FeatureCard
            icon={ClipboardCheck}
            title='关键节点审批'
            desc='分身执行到决策点时可批准/驳回，附反馈帮助分身学习你的偏好。'
            badge='亮点'
          />
          <FeatureCard
            icon={TrendingUp}
            title='进度与 ROI'
            desc='实时查看各分身执行状态、成功率与成本，以及协作网络调度。'
          />
          <FeatureCard
            icon={Sparkles}
            title='技能进化'
            desc='为分身添加或更新技能（工作流/对话配置），持续扩展能力。'
          />
          <FeatureCard
            icon={BookOpen}
            title='知识库 / Memory'
            desc='注入公司文档、风格指南与业务知识，增强分身背景理解与输出一致性。'
          />
          <FeatureCard
            icon={MessageSquare}
            title='Slack / 飞书集成'
            desc='IM 里远程指派、代办回复、状态同步。无需切后台，随时调用。'
          />
        </div>
      </section>

      <div className='mx-auto max-w-4xl px-6'>
        <div className='border-t border-border' />
      </div>

      {/* How it works */}
      <section id='how' className='mx-auto max-w-4xl px-6 py-24'>
        <div className='mb-14 text-center'>
          <div className='mb-3 text-[11px] font-semibold uppercase tracking-widest text-accent'>
            使用流程
          </div>
          <h2 className='text-2xl font-bold tracking-tight text-text-primary'>
            3 步，开始用分身
          </h2>
          <p className='mx-auto mt-3 max-w-lg text-sm leading-relaxed text-text-tertiary'>
            连接 IM、选角色、下达任务 — 审批与进度在 nexu 工作台一目了然。
          </p>
        </div>
        <div className='grid grid-cols-3 gap-12'>
          {[
            {
              step: '01',
              title: '连接 Slack / 飞书',
              desc: '在集成设置里授权 nexu Bot，按引导几分钟完成。',
              icon: MessageSquare,
            },
            {
              step: '02',
              title: '选择或配置分身',
              desc: '使用预设角色（运营/研发/内容/创始人），或添加自定义分身与技能。',
              icon: Users,
            },
            {
              step: '03',
              title: '下达任务与审批',
              desc: '在 IM 里一句话指派，或在工作台即时下达；关键节点来审批中心处理。',
              icon: LayoutDashboard,
            },
          ].map((s, i) => (
            <div key={s.step} className='relative'>
              {i < 2 && (
                <div className='absolute -right-6 top-7 w-12 border-t border-dashed border-border' />
              )}
              <div className='mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10'>
                <s.icon size={24} className='text-accent' />
              </div>
              <div className='mb-2 font-mono text-xs font-semibold text-accent'>
                STEP {s.step}
              </div>
              <h3 className='mb-2 text-[14px] font-semibold text-text-primary'>
                {s.title}
              </h3>
              <p className='text-sm leading-relaxed text-text-tertiary'>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className='mx-auto max-w-4xl px-6'>
        <div className='border-t border-border' />
      </div>

      {/* Numbers */}
      <section className='mx-auto max-w-4xl px-6 py-24'>
        <div className='grid grid-cols-4 gap-8 text-center'>
          {[
            { num: '多角色', label: '预设分身', sub: '运营 / 研发 / 内容 / 创始人' },
            { num: '即时', label: '任务下达', sub: '自然语言 + 自动分配' },
            { num: '可审批', label: '关键节点', sub: '批准 / 驳回 / 反馈学习' },
            { num: '可追溯', label: '进度与 ROI', sub: '状态、成功率、成本' },
          ].map((n) => (
            <div key={n.label}>
              <div className='font-mono text-3xl font-bold tracking-tight text-accent'>
                {n.num}
              </div>
              <div className='mt-1 text-sm font-medium text-text-primary'>
                {n.label}
              </div>
              <div className='mt-0.5 text-[11px] text-text-muted'>{n.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <div className='mx-auto max-w-4xl px-6'>
        <div className='border-t border-border' />
      </div>

      {/* FAQ */}
      <section id='faq' className='mx-auto max-w-2xl px-6 py-24'>
        <div className='mb-14 text-center'>
          <div className='mb-3 text-[11px] font-semibold uppercase tracking-widest text-accent'>
            常见问题
          </div>
          <h2 className='text-2xl font-bold tracking-tight text-text-primary'>
            你可能想知道
          </h2>
        </div>
        <div>
          <FAQItem
            q='nexu 和 Refly 是什么关系？'
            a='nexu 是在 Refly 基础能力上从「数字分身」场景做的产品包装：预设角色、任务下达、审批、进度与 ROI、技能与知识库、IM 集成。Refly 提供工作流与分身底层能力，nexu 提供「分身监控管理」的完整界面与使用方式。'
          />
          <FAQItem
            q='支持哪些 IM 平台？'
            a='目前支持 Slack 和飞书。在「集成与设置」里连接 Bot 后，即可在 IM 里远程指派任务、查看状态，无需切到 nexu 后台。'
          />
          <FAQItem
            q='预设角色可以改吗？'
            a='可以。预设的运营助手、研发助手、内容助手、创始人分身等可直接使用，也可以添加自定义分身、配置独立技能与知识库，实现多数字员工协作。'
          />
          <FAQItem
            q='关键节点审批是什么？'
            a='分身执行到需要你拍板的步骤（如合并 PR、对外发送周报）时，会在审批中心列出待处理项，你可批准或驳回并附反馈，分身会据此学习你的偏好。'
          />
          <FAQItem
            q='数据与权限安全吗？'
            a='分身仅在授权范围内访问第三方工具（如 Linear、Slack 指定频道）。每个分身权限可单独配置，审批与操作可追溯。'
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,171,96,0.05)_0%,transparent_60%)]' />
        <div className='relative mx-auto max-w-3xl px-6 py-24 text-center'>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-text-primary'>
            多数字员工，你的赛博工作室
          </h2>
          <p className='mb-8 text-base text-text-tertiary'>
            预设角色、即时下达、审批与进度 — 在 Slack / 飞书里随时调用。
          </p>
          <Button asChild size='lg' className='px-8'>
            <Link to='/nexu'>
              进入 nexu 工作台 <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-border'>
        <div className='mx-auto flex max-w-5xl items-center justify-between px-6 py-8'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-5 w-5 items-center justify-center rounded bg-accent'>
              <span className='text-[10px] font-bold text-accent-fg'>N</span>
            </div>
            <span className='text-xs text-text-muted'>
              nexu — Your mind, extended. 分身监控管理平台
            </span>
          </div>
          <div className='flex gap-6 text-xs text-text-muted'>
            <a href='#' className='transition-colors hover:text-text-secondary'>
              文档
            </a>
            <a href='#' className='transition-colors hover:text-text-secondary'>
              集成指南
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
