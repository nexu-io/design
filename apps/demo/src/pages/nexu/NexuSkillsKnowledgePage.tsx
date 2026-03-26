import { Sparkles, BookOpen, Plus, Wrench, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const SKILLS_BY_AVATAR = [
  { avatar: '研发助手', skills: ['Linear 同步', 'Git 操作', '代码摘要', '文档生成', 'PR Review 助手'] },
  { avatar: '运营助手', skills: ['日报生成', '指标拉取', 'Slack 推送', '周报模板'] },
  { avatar: '内容助手', skills: ['多平台发布', '文案润色', '配图建议'] },
]

const MEMORY_SOURCES = [
  { name: '公司风格指南', count: 24, type: 'doc' },
  { name: '产品 PRD 摘要', count: 8, type: 'doc' },
  { name: '联系人偏好', count: 15, type: 'memory' },
]

export default function NexuSkillsKnowledgePage() {
  return (
    <div className='h-full overflow-y-auto'>
      <div className='mx-auto max-w-4xl px-6 py-8 space-y-8'>
        <div>
          <h1 className='text-xl font-bold tracking-tight text-text-primary'>
            技能与知识库
          </h1>
          <p className='mt-1 text-sm text-text-secondary'>
            为分身添加或更新技能（工作流编排 / 对话配置），并注入公司文档、风格指南与业务知识到 Memory。
          </p>
        </div>

        <section className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Sparkles size={18} className='text-accent' />
            <h2 className='text-sm font-semibold text-text-primary'>技能进化</h2>
          </div>
          <p className='text-[12px] text-text-secondary'>
            通过工作流编排或对话为分身添加新技能、更新最佳实践模板。
          </p>
          <div className='space-y-4'>
            {SKILLS_BY_AVATAR.map((row) => (
              <div
                key={row.avatar}
                className='card p-4'
              >
                <div className='text-[13px] font-medium text-text-primary'>{row.avatar}</div>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {row.skills.map((s) => (
                    <Badge key={s} variant='brand' className='gap-1 rounded-lg px-2.5 py-1.5 text-[12px]'>
                      <Wrench size={12} />
                      {s}
                    </Badge>
                  ))}
                  <Button
                    variant='outline'
                    size='sm'
                    className='rounded-lg border-dashed px-2.5 py-1.5 text-[12px] text-text-muted hover:border-accent hover:text-accent'
                  >
                    <Plus size={12} />
                    添加
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='space-y-4'>
          <div className='flex items-center gap-2'>
            <BookOpen size={18} className='text-accent' />
            <h2 className='text-sm font-semibold text-text-primary'>知识库 / Memory</h2>
          </div>
          <p className='text-[12px] text-text-secondary'>
            将公司文档、风格指南或业务知识注入分身记忆，增强背景理解与输出一致性。
          </p>
          <ul className='space-y-2'>
            {MEMORY_SOURCES.map((m) => (
              <li
                key={m.name}
                className='card flex items-center justify-between px-4 py-3'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-surface-3'>
                    <FileText size={16} className='text-text-muted' />
                  </div>
                  <div>
                    <div className='text-[13px] font-medium text-text-primary'>{m.name}</div>
                    <div className='text-[11px] text-text-muted'>{m.count} 条</div>
                  </div>
                </div>
                <Button variant='outline' size='sm' className='rounded-lg px-3 py-1.5 text-[11px]'>
                  管理
                </Button>
              </li>
            ))}
          </ul>
          <Button
            variant='outline'
            className='w-full rounded-xl border-dashed py-3 h-auto text-[12px] text-text-muted hover:border-accent hover:text-accent'
          >
            <Plus size={14} />
            添加知识源
          </Button>
        </section>
      </div>
    </div>
  )
}
