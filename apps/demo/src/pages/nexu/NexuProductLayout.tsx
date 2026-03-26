import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Send,
  ClipboardCheck,
  TrendingUp,
  Sparkles,
  Settings,
  Zap,
} from 'lucide-react'

const NEXU_NAV = [
  { to: '/nexu', end: true, icon: LayoutDashboard, label: '工作台' },
  { to: '/nexu/avatars', end: false, icon: Users, label: '分身与角色' },
  { to: '/nexu/task', end: false, icon: Send, label: '任务下达' },
  { to: '/nexu/approvals', end: false, icon: ClipboardCheck, label: '审批中心' },
  { to: '/nexu/progress', end: false, icon: TrendingUp, label: '进度与 ROI' },
  { to: '/nexu/skills', end: false, icon: Sparkles, label: '技能与知识库' },
  { to: '/nexu/settings', end: false, icon: Settings, label: '集成与设置' },
]

export default function NexuProductLayout() {
  return (
    <div className='flex h-full min-h-0 bg-surface-1'>
      <div className='flex flex-col items-center py-3 w-14 shrink-0 border-r border-border-subtle bg-surface-1'>
        <div className='mb-4 flex flex-col items-center gap-1'>
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-accent'>
            <span className='text-sm font-bold text-accent-fg'>N</span>
          </div>
          <span className='text-[10px] font-medium text-text-tertiary'>nexu</span>
        </div>
        <div className='flex flex-1 flex-col items-center gap-0.5'>
          {NEXU_NAV.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) =>
                `flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  isActive ? 'text-text-primary font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                }`
              }
            >
              {({ isActive }) => (
                <Icon size={18} className={isActive ? '' : 'opacity-60'} />
              )}
            </NavLink>
          ))}
        </div>
        <div className='flex flex-col items-center gap-1 pt-2 border-t border-border-subtle'>
          <div className='flex h-8 w-8 items-center justify-center' title='Credits'>
            <Zap size={14} className='text-text-tertiary' />
          </div>
        </div>
      </div>
      <main className='flex-1 min-w-0 overflow-y-auto bg-surface-1'>
        <Outlet />
      </main>
    </div>
  )
}
