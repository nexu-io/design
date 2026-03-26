import { TrendingUp, Users, Clock, DollarSign, BarChart3 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const STATS = [
  { label: '今日执行成功', value: '47', sub: '成功率 94%', icon: TrendingUp },
  { label: '活跃分身', value: '4', sub: '共 4 个角色', icon: Users },
  { label: '节省时间', value: '12.5h', sub: '本周预估', icon: Clock },
  { label: '消耗', value: '3.2k', sub: 'credits 本周', icon: DollarSign },
]

const RECENT_RUNS = [
  { avatar: '研发助手', task: '汇总 Linear issue 并生成待办', status: 'success', at: '10:35' },
  { avatar: '运营助手', task: '生成昨日渠道转化摘要', status: 'success', at: '10:20' },
  { avatar: '内容助手', task: '起草 Twitter 推文', status: 'success', at: '09:55' },
  { avatar: '创始人分身', task: '投资人周报初稿', status: 'waiting', at: '09:30' },
]

export default function NexuProgressPage() {
  return (
    <div className='h-full overflow-y-auto'>
      <div className='mx-auto max-w-4xl px-6 py-8 space-y-8'>
        <div>
          <h1 className='text-xl font-bold tracking-tight text-text-primary'>
            进度与 ROI
          </h1>
          <p className='mt-1 text-sm text-text-secondary'>
            实时查看各分身执行状态、成功率与成本，以及分身协作网络调度情况。
          </p>
        </div>

        <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {STATS.map((s) => (
            <div
              key={s.label}
              className='card p-4'
            >
              <div className='flex items-center gap-2 text-text-muted'>
                <s.icon size={14} />
                <span className='text-[11px] uppercase tracking-wider'>{s.label}</span>
              </div>
              <div className='mt-2 text-2xl font-bold tabular-nums text-text-primary'>
                {s.value}
              </div>
              <div className='mt-0.5 text-[11px] text-text-muted'>{s.sub}</div>
            </div>
          ))}
        </section>

        <section className='card p-5'>
          <div className='flex items-center gap-2'>
            <BarChart3 size={16} className='text-text-muted' />
            <h2 className='text-sm font-semibold text-text-primary'>最近执行</h2>
          </div>
          <ul className='mt-4 space-y-2'>
            {RECENT_RUNS.map((run, i) => (
              <li
                key={i}
                className='flex items-center gap-4 rounded-lg border border-border-subtle bg-surface-2/50 px-4 py-3'
              >
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10'>
                  <Users size={16} className='text-accent' />
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='text-[13px] font-medium text-text-primary'>{run.avatar}</div>
                  <div className='truncate text-[12px] text-text-secondary'>{run.task}</div>
                </div>
                <Badge
                  variant={run.status === 'success' ? 'success' : 'brand'}
                  className='shrink-0 text-[10px]'
                >
                  {run.status === 'success' ? '成功' : '待审批'}
                </Badge>
                <span className='text-[11px] text-text-muted'>{run.at}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className='rounded-xl border border-dashed border-border bg-surface-2/50 p-6 text-center'>
          <p className='text-[12px] text-text-muted'>
            分身协作网络调度：多分身协同任务时的依赖与状态视图（MVP 后可展开）
          </p>
        </section>
      </div>
    </div>
  )
}
