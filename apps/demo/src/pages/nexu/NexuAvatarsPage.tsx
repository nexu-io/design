import { useNavigate } from 'react-router-dom'
import { Users, ChevronRight, Plus, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const PRESET_ROLES = [
  {
    id: 'ops',
    name: '运营助手',
    desc: '日报、周报、指标跟进、跨渠道信息汇总',
    status: 'idle',
    skillsCount: 5,
    lastActive: '刚刚',
  },
  {
    id: 'dev',
    name: '研发助手',
    desc: 'Bug 跟进、代码 Review、文档、Linear 同步',
    status: 'busy',
    skillsCount: 8,
    lastActive: '执行中',
  },
  {
    id: 'content',
    name: '内容助手',
    desc: '文案、排版、多平台发布、素材整理',
    status: 'idle',
    skillsCount: 4,
    lastActive: '1 小时前',
  },
  {
    id: 'founder',
    name: '创始人分身',
    desc: '战略摘要、投资人同步、决策备忘、会议纪要',
    status: 'waiting',
    skillsCount: 6,
    lastActive: '待审批',
  },
]

const STATUS_MAP = {
  idle: { label: '空闲', class: 'bg-success-subtle text-success' },
  busy: { label: '执行中', class: 'bg-warning-subtle text-warning' },
  waiting: { label: '待审批', class: 'bg-info-subtle text-info' },
} as const

export default function NexuAvatarsPage() {
  const navigate = useNavigate()

  return (
    <div className='h-full overflow-y-auto'>
      <div className='mx-auto max-w-4xl px-6 py-8 space-y-8'>
        <div>
          <h1 className='text-xl font-bold tracking-tight text-text-primary'>
            分身与角色
          </h1>
          <p className='mt-1 text-sm text-text-secondary'>
            预设角色开箱即用，每个分身可配置独立技能与知识库，支持多数字员工协作。
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          {PRESET_ROLES.map((role) => {
            const status = STATUS_MAP[role.status as keyof typeof STATUS_MAP]
            return (
              <button
                key={role.id}
                type='button'
                onClick={() => navigate(`/nexu/avatars/${role.id}`)}
                className='card group flex flex-col p-5 text-left hover:border-accent/40'
              >
                <div className='flex items-start justify-between gap-3'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-white border border-border text-accent'>
                    <Users size={22} />
                  </div>
                  <Badge
                    variant={role.status === 'busy' ? 'warning' : role.status === 'waiting' ? 'brand' : 'success'}
                    className='shrink-0 text-[10px]'
                  >
                    {status.label}
                  </Badge>
                </div>
                <h3 className='mt-3 text-[14px] font-semibold text-text-primary'>
                  {role.name}
                </h3>
                <p className='mt-1 text-[12px] text-text-secondary leading-relaxed'>
                  {role.desc}
                </p>
                <div className='mt-4 flex items-center gap-4 text-[11px] text-text-muted'>
                  <span className='flex items-center gap-1'>
                    <Zap size={12} />
                    {role.skillsCount} 技能
                  </span>
                  <span>{role.lastActive}</span>
                </div>
                <div className='mt-3 flex items-center gap-1 text-[11px] text-accent opacity-0 transition-opacity group-hover:opacity-100'>
                  查看详情
                  <ChevronRight size={12} />
                </div>
              </button>
            )
          })}
        </div>

        <div className='rounded-xl border border-dashed border-border bg-surface-2/50 p-6 text-center'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-[12px] bg-white border border-border text-text-muted'>
            <Plus size={20} />
          </div>
          <p className='mt-2 text-[13px] font-medium text-text-secondary'>
            添加自定义分身
          </p>
          <p className='mt-0.5 text-[11px] text-text-muted'>
            从工作角色模板创建，或从零配置技能与知识库
          </p>
        </div>
      </div>
    </div>
  )
}
