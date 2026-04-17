import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Settings2, ChevronDown, ChevronUp, RotateCcw, LogIn, LogOut, UserCog, Zap, ZapOff, Search, SearchX, GripVertical, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWorkspaceStore } from '@/stores/workspace'
import { useRuntimesStore } from '@/stores/runtimes'
import { mockUsers, mockRuntimes } from '@/mock/data'

type AppState = 'welcome' | 'onboarding' | 'app'

const POS_STORAGE_KEY = 'nexu.devPanel.pos'
const PANEL_WIDTH = 288
const PANEL_HEIGHT_COLLAPSED = 36

function loadInitialPos(): { x: number; y: number } {
  try {
    const raw = localStorage.getItem(POS_STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (typeof p.x === 'number' && typeof p.y === 'number') return p
    }
  } catch {
    /* ignore */
  }
  return { x: window.innerWidth - PANEL_WIDTH - 16, y: window.innerHeight - PANEL_HEIGHT_COLLAPSED - 16 }
}

export function DevPanel(): React.ReactElement {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(loadInitialPos)
  const dragStateRef = useRef<{ dx: number; dy: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(pos))
    } catch {
      /* ignore */
    }
  }, [pos])

  const handleDragPointerDown = (e: React.PointerEvent): void => {
    if ((e.target as HTMLElement).closest('button[data-no-drag]')) return
    dragStateRef.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y }
    setDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handleDragPointerMove = (e: React.PointerEvent): void => {
    const st = dragStateRef.current
    if (!st) return
    const maxX = window.innerWidth - 40
    const maxY = window.innerHeight - 40
    const x = Math.max(-PANEL_WIDTH + 60, Math.min(maxX, e.clientX - st.dx))
    const y = Math.max(0, Math.min(maxY, e.clientY - st.dy))
    setPos({ x, y })
  }

  const handleDragPointerUp = (e: React.PointerEvent): void => {
    dragStateRef.current = null
    setDragging(false)
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  const navigate = useNavigate()
  const location = useLocation()
  const { isOnboarded, currentUserId, setCurrentUser, completeOnboarding, switchWorkspace, reset, workspaces, addWorkspace } =
    useWorkspaceStore()
  const workspacesAtLimit = workspaces.length >= 5
  const fillWorkspacesToLimit = (): void => {
    const missing = 5 - workspaces.length
    for (let i = 0; i < missing; i++) {
      const idx = workspaces.length + i + 1
      addWorkspace({
        id: `ws-dev-${idx}-${Date.now()}`,
        name: `Dev Workspace ${idx}`,
        avatar: `https://api.dicebear.com/9.x/identicon/svg?seed=dev-${idx}`,
        createdAt: Date.now()
      })
    }
  }
  const {
    runtimes,
    setRuntimes,
    devSimulateNone,
    setDevSimulateNone,
    devSimulateNoDetection,
    setDevSimulateNoDetection
  } = useRuntimesStore()
  const hasRuntimes = runtimes.length > 0 && !devSimulateNone

  const currentState: AppState = !isOnboarded
    ? location.pathname.startsWith('/onboarding')
      ? 'onboarding'
      : 'welcome'
    : 'app'

  const jumpTo = (state: AppState): void => {
    switch (state) {
      case 'welcome':
        reset()
        navigate('/')
        break
      case 'onboarding':
        reset()
        navigate('/onboarding/workspace')
        break
      case 'app':
        switchWorkspace('ws-1')
        completeOnboarding()
        navigate('/chat')
        break
    }
  }

  const states: { id: AppState; label: string; icon: React.ElementType }[] = [
    { id: 'welcome', label: 'Welcome (Logged out)', icon: LogOut },
    { id: 'onboarding', label: 'Onboarding', icon: LogIn },
    { id: 'app', label: 'Main App (Logged in)', icon: Settings2 }
  ]

  if (!open) {
    return (
      <div
        onPointerDown={handleDragPointerDown}
        onPointerMove={handleDragPointerMove}
        onPointerUp={handleDragPointerUp}
        onPointerCancel={handleDragPointerUp}
        style={{ left: pos.x, top: pos.y }}
        className={cn(
          'fixed z-[999] flex h-9 items-center gap-1.5 rounded-lg bg-nexu-primary/90 pl-2 pr-3 text-xs font-medium text-white shadow-lg hover:bg-nexu-primary transition-colors select-none',
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
      >
        <GripVertical className="h-3.5 w-3.5 opacity-70" />
        <button
          data-no-drag
          onClick={() => !dragging && setOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Dev
          <ChevronUp className="h-3 w-3" />
        </button>
      </div>
    )
  }

  return (
    <div
      style={{ left: pos.x, top: pos.y }}
      className="fixed z-[999] w-72 rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
    >
      <div
        onPointerDown={handleDragPointerDown}
        onPointerMove={handleDragPointerMove}
        onPointerUp={handleDragPointerUp}
        onPointerCancel={handleDragPointerUp}
        className={cn(
          'flex items-center justify-between px-3 py-2 border-b border-border bg-accent/50 select-none',
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
      >
        <span className="text-xs font-semibold flex items-center gap-1.5">
          <GripVertical className="h-3.5 w-3.5 opacity-60" />
          Dev Controls
        </span>
        <button
          data-no-drag
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="p-3 space-y-3">
        <div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            App State
          </div>
          <div className="space-y-1">
            {states.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => jumpTo(id)}
                className={cn(
                  'flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs transition-colors',
                  currentState === id
                    ? 'bg-nexu-primary/15 text-nexu-primary font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {currentState === id && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-nexu-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        <div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <UserCog className="h-3 w-3" />
            Current User
          </div>
          <div className="space-y-1">
            {mockUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setCurrentUser(user.id)}
                className={cn(
                  'flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs transition-colors',
                  currentUserId === user.id
                    ? 'bg-accent text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                <img src={user.avatar} alt="" className="h-4 w-4 rounded-full" />
                <span className="flex-1 text-left truncate">{user.name}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded',
                    user.role === 'owner' ? 'bg-nexu-primary/10 text-nexu-primary' : 'bg-secondary text-muted-foreground'
                  )}
                >
                  {user.role}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        <div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Runtimes
          </div>
          <button
            onClick={() => {
              if (hasRuntimes) {
                setRuntimes([])
                setDevSimulateNone(true)
              } else {
                setDevSimulateNone(false)
                setRuntimes(mockRuntimes)
              }
            }}
            className={cn(
              'flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs transition-colors',
              hasRuntimes
                ? 'text-muted-foreground hover:bg-accent hover:text-foreground'
                : 'bg-nexu-primary/15 text-nexu-primary font-medium'
            )}
          >
            {hasRuntimes ? <ZapOff className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
            {hasRuntimes ? `Clear runtimes (${runtimes.length})` : 'Simulate no runtimes'}
          </button>
          <button
            onClick={() => setDevSimulateNoDetection(!devSimulateNoDetection)}
            className={cn(
              'flex items-center gap-2 w-full px-2.5 py-1.5 mt-1 rounded-md text-xs transition-colors',
              devSimulateNoDetection
                ? 'bg-nexu-primary/15 text-nexu-primary font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            {devSimulateNoDetection ? (
              <SearchX className="h-3.5 w-3.5" />
            ) : (
              <Search className="h-3.5 w-3.5" />
            )}
            {devSimulateNoDetection ? 'Detection disabled' : 'Simulate no detection'}
          </button>
        </div>

        <div className="h-px bg-border" />

        <div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Layers className="h-3 w-3" />
            Workspaces
          </div>
          <button
            onClick={fillWorkspacesToLimit}
            disabled={workspacesAtLimit}
            className={cn(
              'flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs transition-colors',
              workspacesAtLimit
                ? 'bg-nexu-primary/15 text-nexu-primary font-medium cursor-not-allowed'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">
              {workspacesAtLimit ? 'At workspace limit' : 'Fill to 5 workspaces'}
            </span>
            <span className="text-[10px] opacity-80">{workspaces.length}/5</span>
          </button>
        </div>

        <div className="h-px bg-border" />

        <button
          onClick={() => {
            reset()
            navigate('/')
          }}
          className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs text-destructive-foreground hover:bg-destructive/10 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset All State
        </button>
      </div>
    </div>
  )
}
