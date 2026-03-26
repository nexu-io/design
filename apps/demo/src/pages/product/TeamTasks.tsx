import { useState } from 'react'
import {
  ChevronDown, ChevronRight, Plus, Filter, Search,
  CheckCircle2, Circle, Clock, Archive, Inbox,
  Bot, User, Users, Zap,
  FileText, Link2, MessageSquare, Target,
  ArrowUp, ArrowDown, Minus,
} from 'lucide-react'
import { Button } from '@nexu/ui-web'
import {
  TASK_BOARD,
  type TaskItem,
  type TaskStatus,
  type TaskPriority,
  type TaskExecutor,
} from './teamData'

// ─── Constants ──────────────────────────────────────────────

type FilterStatus = TaskStatus | 'all'
type GroupBy = 'status' | 'assignee' | 'priority' | 'sprint'

const STATUS_CONFIG: Record<TaskStatus, {
  label: string; icon: typeof Circle; color: string; bg: string
}> = {
  backlog: { label: '待规划', icon: Inbox, color: 'text-text-muted', bg: 'bg-surface-3' },
  todo: { label: '待开始', icon: Circle, color: 'text-info', bg: 'bg-info-subtle' },
  in_progress: { label: '进行中', icon: Clock, color: 'text-clone', bg: 'bg-clone/10' },
  done: { label: '已完成', icon: CheckCircle2, color: 'text-success', bg: 'bg-success-subtle' },
  archived: { label: '已归档', icon: Archive, color: 'text-text-muted', bg: 'bg-surface-3' },
}

const PRIORITY_CONFIG: Record<TaskPriority, {
  label: string; icon: typeof ArrowUp; color: string
}> = {
  urgent: { label: '紧急', icon: ArrowUp, color: 'text-danger' },
  high: { label: '高', icon: ArrowUp, color: 'text-warning' },
  medium: { label: '中', icon: Minus, color: 'text-info' },
  low: { label: '低', icon: ArrowDown, color: 'text-text-muted' },
}

const EXECUTOR_CONFIG: Record<TaskExecutor, {
  label: string; icon: typeof User; color: string
}> = {
  human: { label: '人工', icon: User, color: 'text-text-secondary' },
  agent: { label: 'Agent', icon: Bot, color: 'text-clone' },
  hybrid: { label: '人+Agent', icon: Users, color: 'text-info' },
}

const FILTER_TABS: { id: FilterStatus; label: string; count?: (tasks: TaskItem[]) => number }[] = [
  { id: 'all', label: '全部' },
  { id: 'in_progress', label: '进行中', count: ts => ts.filter(t => t.status === 'in_progress').length },
  { id: 'todo', label: '待开始', count: ts => ts.filter(t => t.status === 'todo').length },
  { id: 'backlog', label: '待规划', count: ts => ts.filter(t => t.status === 'backlog').length },
  { id: 'done', label: '已完成', count: ts => ts.filter(t => t.status === 'done').length },
  { id: 'archived', label: '归档', count: ts => ts.filter(t => t.status === 'archived').length },
]

// ─── Task Card ──────────────────────────────────────────────

function TaskCard({
  task,
  onSelect,
  selected,
  expanded,
  onToggleExpand,
}: {
  task: TaskItem
  onSelect: () => void
  selected: boolean
  expanded: boolean
  onToggleExpand: () => void
}) {
  const status = STATUS_CONFIG[task.status]
  const priority = PRIORITY_CONFIG[task.priority]
  const executor = EXECUTOR_CONFIG[task.executor]
  const StatusIcon = status.icon
  const PriorityIcon = priority.icon

  const subtasksDone = task.subtasks?.filter(s => s.done).length ?? 0
  const subtasksTotal = task.subtasks?.length ?? 0

  return (
    <div
      className={`border rounded-xl bg-surface-1 transition-all ${
        selected ? 'ring-2 ring-accent/30 border-accent/40' : 'border-border hover:border-border-hover'
      }`}
    >
      {/* Main row */}
      <div
        role='button'
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={e => { if (e.key === 'Enter') onSelect() }}
        className='flex items-start gap-3 px-4 py-3 cursor-pointer'
      >
        {/* Expand toggle */}
        <button
          onClick={e => { e.stopPropagation(); onToggleExpand() }}
          className='mt-0.5 p-0.5 rounded hover:bg-surface-3 text-text-muted transition-colors shrink-0'
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Status icon */}
        <StatusIcon size={16} className={`${status.color} mt-0.5 shrink-0`} />

        {/* Content */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-0.5'>
            <span className='text-[10px] text-text-muted font-mono'>{task.id}</span>
            <PriorityIcon size={12} className={priority.color} />
            {task.dependencies?.length ? (
              <span className='text-[9px] px-1 py-0.5 bg-danger-subtle text-danger rounded font-medium flex items-center gap-0.5'>
                <Link2 size={8} /> 有依赖
              </span>
            ) : null}
          </div>
          <div className={`text-[13px] font-medium ${task.status === 'archived' ? 'text-text-muted line-through' : 'text-text-primary'}`}>
            {task.title}
          </div>
          <div className='flex items-center gap-3 mt-1.5 flex-wrap'>
            {/* Tags */}
            {task.tags.slice(0, 3).map(tag => (
              <span key={tag} className='text-[9px] px-1.5 py-0.5 bg-surface-3 text-text-muted rounded'>{tag}</span>
            ))}
            {/* Subtasks */}
            {subtasksTotal > 0 && (
              <span className='text-[10px] text-text-muted flex items-center gap-1'>
                <CheckCircle2 size={10} /> {subtasksDone}/{subtasksTotal}
              </span>
            )}
            {/* Comments */}
            {task.comments > 0 && (
              <span className='text-[10px] text-text-muted flex items-center gap-1'>
                <MessageSquare size={10} /> {task.comments}
              </span>
            )}
            {/* Linked files */}
            {task.linkedFiles?.length ? (
              <span className='text-[10px] text-text-muted flex items-center gap-1'>
                <FileText size={10} /> {task.linkedFiles.length}
              </span>
            ) : null}
          </div>
        </div>

        {/* Right meta */}
        <div className='flex flex-col items-end gap-1.5 shrink-0'>
          <div className='flex items-center gap-1.5'>
            <span className='text-lg'>{task.assigneeAvatar}</span>
          </div>
          <div className='flex items-center gap-1'>
            <executor.icon size={10} className={executor.color} />
            <span className={`text-[9px] ${executor.color} font-medium`}>{executor.label}</span>
          </div>
          {task.dueDate && (
            <span className={`text-[9px] ${
              task.status !== 'done' && task.dueDate <= '02-24' ? 'text-danger' : 'text-text-muted'
            }`}>
              截止 {task.dueDate}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {task.progress > 0 && task.progress < 100 && (
        <div className='px-4 pb-2'>
          <div className='h-1 bg-surface-3 rounded-full overflow-hidden'>
            <div
              className={`h-full rounded-full ${task.progress >= 80 ? 'bg-success' : task.progress >= 40 ? 'bg-clone' : 'bg-warning'}`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div className='border-t border-border px-4 py-3 space-y-3 bg-surface-0/50'>
          {/* Description */}
          {task.description && (
            <div className='text-[12px] text-text-secondary leading-relaxed'>
              {task.description}
            </div>
          )}

          {/* Meta grid */}
          <div className='grid grid-cols-3 gap-2'>
            <MetaChip label='状态' value={status.label} icon={StatusIcon} color={status.color} />
            <MetaChip label='优先级' value={priority.label} icon={PriorityIcon} color={priority.color} />
            <MetaChip label='执行者' value={executor.label} icon={executor.icon} color={executor.color} />
            {task.sprintId && <MetaChip label='Sprint' value={task.sprintId} icon={Target} color='text-info' />}
            {task.okrTitle && <MetaChip label='OKR' value={task.okrTitle} icon={Target} color='text-accent' className='col-span-2' />}
            {task.source !== 'manual' && (
              <MetaChip
                label='来源'
                value={task.sourceRef ?? task.source}
                icon={task.source === 'automation' ? Zap : task.source === 'session' ? MessageSquare : Link2}
                color='text-text-muted'
              />
            )}
          </div>

          {/* Subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div>
              <div className='text-[11px] font-medium text-text-secondary mb-1.5'>子任务</div>
              <div className='space-y-1'>
                {task.subtasks.map((sub, i) => (
                  <div key={i} className='flex items-center gap-2 text-[12px]'>
                    {sub.done ? (
                      <CheckCircle2 size={13} className='text-success shrink-0' />
                    ) : (
                      <Circle size={13} className='text-text-muted shrink-0' />
                    )}
                    <span className={sub.done ? 'text-text-muted line-through' : 'text-text-primary'}>
                      {sub.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Linked files */}
          {task.linkedFiles && task.linkedFiles.length > 0 && (
            <div>
              <div className='text-[11px] font-medium text-text-secondary mb-1.5'>关联文件</div>
              <div className='space-y-1'>
                {task.linkedFiles.map(f => (
                  <div key={f} className='flex items-center gap-1.5 text-[11px] text-info hover:underline cursor-pointer'>
                    <FileText size={11} /> {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dependencies */}
          {task.dependencies && task.dependencies.length > 0 && (
            <div className='flex items-center gap-2'>
              <span className='text-[11px] text-text-muted'>依赖：</span>
              {task.dependencies.map(d => (
                <span key={d} className='text-[10px] px-1.5 py-0.5 bg-danger-subtle text-danger rounded font-mono'>{d}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className='flex items-center gap-2 pt-1'>
            {task.status === 'todo' && (
              <ActionBtn icon={Clock} label='开始任务' variant='primary' />
            )}
            {task.status === 'in_progress' && (
              <ActionBtn icon={CheckCircle2} label='标记完成' variant='success' />
            )}
            {task.executor !== 'agent' && (
              <ActionBtn icon={Bot} label='委托给 Agent' />
            )}
            {task.status === 'done' && (
              <ActionBtn icon={Archive} label='归档' />
            )}
            <ActionBtn icon={MessageSquare} label='评论' />
          </div>

          <div className='text-[9px] text-text-muted pt-1'>
            创建于 {task.createdAt} · 更新于 {task.updatedAt}
          </div>
        </div>
      )}
    </div>
  )
}

function MetaChip({ label, value, icon: Icon, color, className = '' }: {
  label: string; value: string; icon: typeof Circle; color: string; className?: string
}) {
  return (
    <div className={`p-2 bg-surface-2 rounded-lg ${className}`}>
      <div className='text-[9px] text-text-muted mb-0.5'>{label}</div>
      <div className={`text-[11px] font-medium flex items-center gap-1 ${color}`}>
        <Icon size={11} /> <span className='truncate'>{value}</span>
      </div>
    </div>
  )
}

function ActionBtn({ icon: Icon, label, variant = 'default' }: {
  icon: typeof Circle; label: string; variant?: 'default' | 'primary' | 'success'
}) {
  const styles = {
    default: 'bg-surface-2 text-text-secondary hover:bg-surface-3',
    primary: 'bg-accent/10 text-accent hover:bg-accent/15',
    success: 'bg-success-subtle text-success hover:bg-success/20',
  }
  return (
    <Button
      type='button'
      size='inline'
      onClick={e => e.stopPropagation()}
      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1.5 ${styles[variant]}`}
    >
      <Icon size={12} /> {label}
    </Button>
  )
}

// ─── Status Group ───────────────────────────────────────────

function TaskGroup({ title, count, tasks, icon: Icon, color, selectedTask, onSelectTask, expandedIds, onToggleExpand, defaultOpen = true }: {
  title: string
  count: number
  tasks: TaskItem[]
  icon: typeof Circle
  color: string
  selectedTask: TaskItem | null
  onSelectTask: (t: TaskItem) => void
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className='flex items-center gap-2 w-full px-1 py-1.5 hover:bg-surface-2 rounded-lg transition-colors'
      >
        {open ? <ChevronDown size={14} className='text-text-muted' /> : <ChevronRight size={14} className='text-text-muted' />}
        <Icon size={14} className={color} />
        <span className='text-[12px] font-semibold text-text-primary'>{title}</span>
        <span className='text-[10px] text-text-muted bg-surface-3 px-1.5 py-0.5 rounded-full'>{count}</span>
      </button>
      {open && (
        <div className='space-y-2 mt-2 ml-1'>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onSelect={() => onSelectTask(task)}
              selected={selectedTask?.id === task.id}
              expanded={expandedIds.has(task.id)}
              onToggleExpand={() => onToggleExpand(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────

export default function TeamTasks({
  selectedTask,
  onSelectTask,
}: {
  selectedTask: TaskItem | null
  onSelectTask: (t: TaskItem) => void
}) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [groupBy, setGroupBy] = useState<GroupBy>('status')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [showGroupMenu, setShowGroupMenu] = useState(false)

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = TASK_BOARD.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q))
    }
    return true
  })

  const grouped = groupTasks(filtered, groupBy)

  const totalActive = TASK_BOARD.filter(t => t.status === 'in_progress').length
  const totalDone = TASK_BOARD.filter(t => t.status === 'done').length
  const agentTasks = TASK_BOARD.filter(t => t.executor === 'agent').length

  return (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <div className='px-5 py-3 border-b border-border bg-surface-1/50 shrink-0'>
        <div className='flex items-center justify-between mb-2.5'>
          <div className='flex items-center gap-3'>
            <span className='text-[13px] font-medium text-text-primary'>任务看板</span>
            <span className='text-[11px] text-text-muted'>
              {totalActive} 进行中 · {totalDone} 已完成 · {agentTasks} 个 Agent 任务
            </span>
          </div>
          <div className='flex items-center gap-2'>
            {/* Group by */}
            <div className='relative'>
              <button
                onClick={() => setShowGroupMenu(!showGroupMenu)}
                className='flex items-center gap-1 px-2.5 py-1.5 bg-surface-2 rounded-lg text-[11px] text-text-secondary hover:bg-surface-3 transition-colors'
              >
                <Filter size={11} /> 分组：{GROUP_LABELS[groupBy]}
                <ChevronDown size={10} />
              </button>
              {showGroupMenu && (
                <div className='absolute right-0 top-full mt-1 bg-surface-1 border border-border rounded-lg shadow-lg z-10 py-1 min-w-[120px]'>
                  {(Object.keys(GROUP_LABELS) as GroupBy[]).map(g => (
                    <button
                      key={g}
                      onClick={() => { setGroupBy(g); setShowGroupMenu(false) }}
                      className={`w-full text-left px-3 py-1.5 text-[11px] transition-colors ${groupBy === g ? 'text-accent bg-accent/5' : 'text-text-secondary hover:bg-surface-2'}`}
                    >
                      {GROUP_LABELS[g]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button type='button' size='inline' className='flex items-center gap-1 px-2.5 py-1.5 bg-accent text-accent-fg rounded-lg text-[11px] font-medium hover:bg-accent-hover transition-colors'>
              <Plus size={12} /> 新建任务
            </Button>
          </div>
        </div>

        {/* Search + filter tabs */}
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-2 rounded-lg flex-1 max-w-[240px]'>
            <Search size={12} className='text-text-muted' />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='搜索任务...'
              className='bg-transparent text-[11px] text-text-primary placeholder:text-text-muted outline-none w-full'
            />
          </div>
          <div className='flex items-center gap-0.5'>
            {FILTER_TABS.map(tab => {
              const count = tab.count?.(TASK_BOARD)
              const active = filterStatus === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    active ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text-secondary hover:bg-surface-2'
                  }`}
                >
                  {tab.label}
                  {count !== undefined && count > 0 && (
                    <span className={`ml-1 text-[9px] ${active ? 'text-accent' : 'text-text-muted'}`}>{count}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className='flex-1 overflow-y-auto p-5 space-y-5'>
        {grouped.map(group => (
          <TaskGroup
            key={group.key}
            title={group.title}
            count={group.tasks.length}
            tasks={group.tasks}
            icon={group.icon}
            color={group.color}
            selectedTask={selectedTask}
            onSelectTask={onSelectTask}
            expandedIds={expandedIds}
            onToggleExpand={toggleExpand}
            defaultOpen={group.key !== 'archived'}
          />
        ))}
        {filtered.length === 0 && (
          <div className='text-center py-12 text-text-muted text-[13px]'>
            没有匹配的任务
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────────

const GROUP_LABELS: Record<GroupBy, string> = {
  status: '按状态',
  assignee: '按负责人',
  priority: '按优先级',
  sprint: '按 Sprint',
}

interface TaskGroup {
  key: string
  title: string
  icon: typeof Circle
  color: string
  tasks: TaskItem[]
}

function groupTasks(tasks: TaskItem[], by: GroupBy): TaskGroup[] {
  switch (by) {
    case 'status': {
      const order: TaskStatus[] = ['in_progress', 'todo', 'backlog', 'done', 'archived']
      return order
        .map(s => ({
          key: s,
          title: STATUS_CONFIG[s].label,
          icon: STATUS_CONFIG[s].icon,
          color: STATUS_CONFIG[s].color,
          tasks: tasks.filter(t => t.status === s),
        }))
        .filter(g => g.tasks.length > 0)
    }
    case 'assignee': {
      const assignees = [...new Set(tasks.map(t => t.assignee))]
      return assignees.map(a => ({
        key: a,
        title: a,
        icon: User,
        color: 'text-text-secondary',
        tasks: tasks.filter(t => t.assignee === a),
      }))
    }
    case 'priority': {
      const order: TaskPriority[] = ['urgent', 'high', 'medium', 'low']
      return order
        .map(p => ({
          key: p,
          title: PRIORITY_CONFIG[p].label,
          icon: PRIORITY_CONFIG[p].icon,
          color: PRIORITY_CONFIG[p].color,
          tasks: tasks.filter(t => t.priority === p),
        }))
        .filter(g => g.tasks.length > 0)
    }
    case 'sprint': {
      const sprints = [...new Set(tasks.map(t => t.sprintId ?? 'Backlog'))]
      return sprints.map(s => ({
        key: s,
        title: s,
        icon: s === 'Backlog' ? Inbox : Target,
        color: s === 'Backlog' ? 'text-text-muted' : 'text-info',
        tasks: tasks.filter(t => (t.sprintId ?? 'Backlog') === s),
      }))
    }
  }
}
