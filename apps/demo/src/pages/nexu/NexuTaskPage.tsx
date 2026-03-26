import { useState, type FormEvent, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Users, Clock, Zap, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

const AVATAR_OPTIONS = [
  { id: 'auto', name: '自动分配', desc: '由系统根据任务类型选择最合适分身' },
  { id: 'ops', name: '运营助手', desc: '日报、周报、指标' },
  { id: 'dev', name: '研发助手', desc: 'Bug、代码、文档' },
  { id: 'content', name: '内容助手', desc: '文案、排版、发布' },
  { id: 'founder', name: '创始人分身', desc: '战略、投资人、决策' },
]

export default function NexuTaskPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialQuery = (location.state as { initialQuery?: string })?.initialQuery ?? ''
  const [query, setQuery] = useState(initialQuery)
  const [selectedAvatar, setSelectedAvatar] = useState('auto')

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery)
  }, [initialQuery])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    // In real app: submit task, then redirect to progress or approvals
    navigate('/nexu')
  }

  return (
    <div className='h-full overflow-y-auto'>
      <div className='mx-auto max-w-2xl px-6 py-8 space-y-8'>
        <div>
          <h1 className='text-xl font-bold tracking-tight text-text-primary'>
            任务下达
          </h1>
          <p className='mt-1 text-sm text-text-secondary'>
            即时下达单次任务，或设置自动化规则在指定时间/事件触发时由分身执行。
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <section className='card p-5'>
            <h3 className='text-xs font-medium uppercase tracking-wider text-text-muted'>
              任务描述（自然语言）
            </h3>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              placeholder='e.g. 每天上午 9 点汇总昨日 Linear 里我负责的 issue 状态变更，并发到 Slack #standup'
              className='mt-3 resize-none bg-surface-0 px-4 py-3 text-[14px]'
            />
          </section>

          <section className='card p-5'>
            <h3 className='text-xs font-medium uppercase tracking-wider text-text-muted'>
              指派给
            </h3>
            <div className='mt-3 grid gap-2'>
              {AVATAR_OPTIONS.map((a) => (
                <button
                  key={a.id}
                  type='button'
                  onClick={() => setSelectedAvatar(a.id)}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                    selectedAvatar === a.id
                      ? 'border-accent bg-accent-subtle'
                      : 'border-border hover:border-border-hover bg-surface-0'
                  }`}
                >
                  <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10'>
                    <Users size={16} className='text-accent' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='text-[13px] font-medium text-text-primary'>{a.name}</div>
                    <div className='text-[11px] text-text-secondary'>{a.desc}</div>
                  </div>
                  {selectedAvatar === a.id && (
                    <Badge variant='brand' className='bg-accent text-accent-fg text-[10px]'>
                      已选
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </section>

          <div className='flex flex-wrap items-center gap-3'>
            <Button type='submit' className='rounded-xl px-5 font-semibold shadow-sm'>
              <Sparkles size={16} />
              立即下达
            </Button>
            <Button variant='outline' className='rounded-xl hover:border-accent/40 hover:text-accent'>
              <Clock size={16} />
              设为自动化
            </Button>
          </div>
        </form>

        <section className='rounded-xl border border-border bg-surface-2/50 p-4'>
          <div className='flex items-center gap-2 text-[12px] text-text-muted'>
            <Zap size={14} />
            <span>自动化：可基于时间（如每日 9:00）或外部事件（如 Linear 新 Bug、电商差评）触发，分身自动执行任务。</span>
          </div>
        </section>
      </div>
    </div>
  )
}
