import { ClipboardCheck, Check, X, Users } from 'lucide-react'
import { Button, Input } from '@nexu/ui-web'

const MOCK_ITEMS = [
  {
    id: '1',
    avatar: '研发助手',
    action: '合并 PR #234 到 main',
    detail: '已通过 CI，无冲突。请确认是否合并。',
    at: '2 min ago',
    type: 'merge',
  },
  {
    id: '2',
    avatar: '运营助手',
    action: '发送本周周报给全员',
    detail: '周报已生成，将发送至 #all-hands。',
    at: '15 min ago',
    type: 'send',
  },
  {
    id: '3',
    avatar: '内容助手',
    action: '发布推文到 Twitter',
    detail: '文案与配图已就绪，请确认发布。',
    at: '1 hour ago',
    type: 'publish',
  },
]

export default function NexuApprovalsPage() {
  return (
    <div className='h-full overflow-y-auto'>
      <div className='mx-auto max-w-3xl px-6 py-8 space-y-8'>
        <div>
          <h1 className='text-xl font-bold tracking-tight text-text-primary'>
            审批中心
          </h1>
          <p className='mt-1 text-sm text-text-secondary'>
            分身执行到关键节点时需要你的批准或驳回，可附上反馈以帮助分身学习你的偏好。
          </p>
        </div>

        <section className='space-y-3'>
          <div className='flex items-center gap-2'>
            <ClipboardCheck size={18} className='text-accent' />
            <h2 className='text-sm font-semibold text-text-primary'>待处理</h2>
          </div>
          <ul className='space-y-4'>
            {MOCK_ITEMS.map((item) => (
              <li
                key={item.id}
                className='card p-5'
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex items-start gap-3'>
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10'>
                      <Users size={18} className='text-accent' />
                    </div>
                    <div>
                      <div className='text-[12px] text-text-muted'>{item.avatar}</div>
                      <div className='mt-1 text-[14px] font-medium text-text-primary'>
                        {item.action}
                      </div>
                      <div className='mt-1 text-[12px] text-text-secondary'>
                        {item.detail}
                      </div>
                      <div className='mt-2 text-[11px] text-text-muted'>{item.at}</div>
                    </div>
                  </div>
                  <div className='flex shrink-0 gap-2'>
                    <Button size='xs' className='px-3 text-[12px]'>
                      <Check size={14} />
                      批准
                    </Button>
                    <Button variant='outline' size='xs' className='px-3 text-[12px] hover:border-danger hover:text-danger'>
                      <X size={14} />
                      驳回
                    </Button>
                  </div>
                </div>
                <div className='mt-3 flex'>
                  <Input
                    type='text'
                    placeholder='可选：填写反馈，帮助分身纠偏学习'
                    className='flex-1 bg-surface-0 text-[12px]'
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
