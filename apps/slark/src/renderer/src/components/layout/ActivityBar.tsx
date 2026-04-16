import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MessageSquare, Bot, Zap, Settings, Plus, LogOut, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWorkspaceStore } from '@/stores/workspace'

const navItems = [
  { icon: MessageSquare, path: '/chat', label: 'Chat' },
  { icon: Bot, path: '/agents', label: 'Agents' },
  { icon: Zap, path: '/runtimes', label: 'Runtimes' }
] as const

export function ActivityBar(): React.ReactElement {
  const navigate = useNavigate()
  const location = useLocation()
  const { workspace, workspaces, switchWorkspace, reset } = useWorkspaceStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <div className="flex flex-col items-center w-[52px] border-r border-border bg-background shrink-0">
      <div className={cn('h-[38px] w-full shrink-0', !menuOpen && 'drag-region')} />

      <div className="relative mb-3" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="no-drag flex h-9 w-9 items-center justify-center rounded-[10px] overflow-hidden hover:opacity-80 transition-opacity"
          title={workspace?.name ?? 'Slark'}
        >
          {workspace?.avatar ? (
            <img src={workspace.avatar} alt="" className="h-9 w-9 rounded-[10px]" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-slark-primary/20 text-slark-primary font-bold text-sm">
              {(workspace?.name ?? 'S').charAt(0).toUpperCase()}
            </div>
          )}
        </button>

        {menuOpen && (
          <>
          <div className="no-drag fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 left-[52px] z-50 w-56 rounded-xl border border-border bg-popover shadow-xl overflow-hidden">
            <div className="px-3 py-2.5 border-b border-border">
              <div className="text-xs font-semibold truncate">{workspace?.name}</div>
              <div className="text-[10px] text-muted-foreground">alice@acme.dev</div>
            </div>

            <div className="p-1.5">
              <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Workspaces
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    switchWorkspace(ws.id)
                    setMenuOpen(false)
                  }}
                  className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md text-xs hover:bg-accent transition-colors"
                >
                  {ws.avatar ? (
                    <img src={ws.avatar} alt="" className="h-5 w-5 rounded shrink-0" />
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-secondary text-[10px] font-bold shrink-0">
                      {ws.name.charAt(0)}
                    </div>
                  )}
                  <span className="flex-1 text-left truncate">{ws.name}</span>
                  {ws.id === workspace?.id && (
                    <Check className="h-3.5 w-3.5 text-slark-primary shrink-0" />
                  )}
                </button>
              ))}

              <div className="h-px bg-border my-1" />

              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Create workspace
              </button>
            </div>

            <div className="border-t border-border p-1.5">
              <button
                onClick={() => {
                  setMenuOpen(false)
                  reset()
                  navigate('/')
                }}
                className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md text-xs text-destructive-foreground hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </div>
          </div>
          </>
        )}

      </div>

      <div className="flex flex-col items-center gap-2 flex-1">
        {navItems.map(({ icon: Icon, path, label }) => {
          const isActive = location.pathname.startsWith(path)
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'no-drag flex items-center justify-center w-9 h-9 rounded-[10px] transition-colors',
                isActive
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
              title={label}
            >
              <Icon className="w-[18px] h-[18px]" />
            </button>
          )
        })}
      </div>

      <button
        onClick={() => navigate('/settings')}
        className={cn(
          'no-drag flex items-center justify-center w-9 h-9 rounded-[10px] transition-colors mb-3',
          location.pathname.startsWith('/settings')
            ? 'bg-accent text-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
        )}
        title="Settings"
      >
        <Settings className="w-[18px] h-[18px]" />
      </button>
    </div>
  )
}
