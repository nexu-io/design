import { type ReactNode, useState, useCallback } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  MessageSquare, Wrench, Clock, Sparkles, Users,
  Settings, Zap, FolderTree, PanelLeftClose, PanelLeft,
} from 'lucide-react'
import FileTree from './FileTree'
import FileEditor from './FileEditor'
import { getFile } from './fileStore'
import { ProductLayoutContext } from './ProductLayoutContext'

const ACTIVITY_NAV = [
  { to: '/app/sessions', id: 'sessions', icon: MessageSquare, label: 'Sessions' },
  { to: '/app/team', id: 'team', icon: Users, label: '团队协作' },
  { to: null, id: 'explorer', icon: FolderTree, label: 'Explorer' },
  { to: '/app/clone', id: 'clone', icon: Wrench, label: '分身搭建' },
  { to: '/app/automation', id: 'automation', icon: Clock, label: 'Automation' },
  { to: '/app/skills', id: 'skills', icon: Sparkles, label: 'Skills' },
]

function inferFileType(path: string) {
  if (path.endsWith('.md')) return 'markdown' as const
  if (path.endsWith('.yaml') || path.endsWith('.yml')) return 'yaml' as const
  if (path.endsWith('.json') || path.endsWith('.jsonl')) return 'jsonl' as const
  if (path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.js')) return 'code' as const
  if (path.endsWith('.sql')) return 'sql' as const
  if (path.endsWith('.html')) return 'html' as const
  if (path.endsWith('.css')) return 'code' as const
  if (path.endsWith('.svg')) return 'svg' as const
  if (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.gif')) return 'image' as const
  if (path.endsWith('.pdf')) return 'pdf' as const
  return 'markdown' as const
}

const TREE_MIN = 180
const TREE_MAX = 480
const TREE_DEFAULT = 224

export default function ProductLayout({ children }: { children: ReactNode }) {
  const [treeCollapsed, setTreeCollapsed] = useState(false)
  const [treeWidth, setTreeWidth] = useState(TREE_DEFAULT)
  const [openFilePath, setOpenFilePath] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (to: string | null) => {
    if (!to) return !treeCollapsed
    return location.pathname.startsWith(to)
  }

  const handleTreeNavigate = useCallback((route: string) => {
    navigate(route)
  }, [navigate])

  const expandFileTree = useCallback(() => {
    setTreeCollapsed(false)
  }, [])

  const handleOpenFile = useCallback((fullPath: string) => {
    setOpenFilePath(fullPath)
  }, [])

  const handleCloseFile = useCallback(() => {
    setOpenFilePath(null)
  }, [])

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    const startX = e.clientX
    const startWidth = treeWidth

    const onMove = (ev: MouseEvent) => {
      const offset = ev.clientX - startX
      const next = Math.max(TREE_MIN, Math.min(TREE_MAX, startWidth + offset))
      setTreeWidth(next)
    }

    const onUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [treeWidth])

  return (
    <ProductLayoutContext.Provider value={{ expandFileTree, openFile: handleOpenFile }}>
    <div className={`flex h-full min-h-0 bg-surface-0 ${isDragging ? 'select-none' : ''}`}>
      {/* Activity Bar — icon-only, like VS Code */}
      <div className='flex flex-col items-center py-2 w-12 border-r shrink-0 border-border bg-surface-1'>
        {/* Clone avatar */}
        <div className='pb-3 mb-3 w-8 border-b border-border'>
          <div className='relative'>
            <div className='flex justify-center items-center w-8 h-8 text-sm rounded-full bg-surface-3 animate-clone-breath-subtle'>
              😊
            </div>
            <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-surface-1' />
          </div>
        </div>

        {/* Nav icons */}
        <div className='flex-1 flex flex-col items-center gap-0.5'>
          {ACTIVITY_NAV.map(({ to, id, icon: Icon, label }) => {
            const active = isActive(to)
            if (to) {
              return (
                <NavLink
                  key={id}
                  to={to}
                  title={label}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative ${
                    active
                      ? 'text-text-primary'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {active && (
                    <div className='absolute left-0 top-2 bottom-2 w-0.5 bg-accent rounded-r' />
                  )}
                  <Icon size={18} />
                </NavLink>
              )
            }
            return (
              <button
                key={id}
                title={label}
                onClick={() => setTreeCollapsed(c => !c)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative ${
                  !treeCollapsed
                    ? 'text-text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {!treeCollapsed && (
                  <div className='absolute left-0 top-2 bottom-2 w-0.5 bg-accent rounded-r' />
                )}
                <Icon size={18} />
              </button>
            )
          })}
        </div>

        {/* Bottom: expand tree (when collapsed) + energy + settings */}
        <div className='flex flex-col gap-1 items-center pt-2 w-8 border-t border-border'>
          {treeCollapsed && (
            <button
              onClick={() => setTreeCollapsed(false)}
              className='flex justify-center items-center w-8 h-8 rounded-lg transition-colors text-text-muted hover:text-text-secondary hover:bg-surface-3'
              title='展开文件树'
            >
              <PanelLeft size={16} />
            </button>
          )}
          <div className='flex justify-center items-center w-8 h-8' title='3,200 / 5,000 credits'>
            <Zap size={16} className='text-clone' />
          </div>
          <button className='flex justify-center items-center w-8 h-8 rounded-lg transition-colors text-text-muted hover:text-text-secondary' title='设置'>
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* File Tree sidebar — collapsible + resizable */}
      {!treeCollapsed && (
        <div className='flex shrink-0' style={{ width: treeWidth }}>
          <div className='flex overflow-hidden flex-col flex-1 min-w-0 border-r border-border bg-surface-1'>
            <div className='flex items-center justify-between px-3 py-1.5 border-b border-border'>
              <span className='text-[11px] font-medium text-text-secondary uppercase tracking-wider'>Explorer</span>
              <button
                onClick={() => setTreeCollapsed(true)}
                className='p-1 rounded transition-colors text-text-muted hover:text-text-secondary'
                title='收起文件树'
              >
                <PanelLeftClose size={14} />
              </button>
            </div>
            <FileTree onNavigate={handleTreeNavigate} onOpenFile={handleOpenFile} />
          </div>
          <div
            onMouseDown={handleResizeStart}
            className={`w-1 shrink-0 cursor-col-resize hover:bg-accent/30 active:bg-accent/50 transition-colors ${isDragging ? 'bg-accent/50' : ''}`}
          />
        </div>
      )}

      {/* Page content */}
      <main className='overflow-hidden relative flex-1'>
        <div className={`h-full flex ${openFilePath ? '':''}`}>
          <div key={location.pathname} className={`transition-all duration-200 overflow-hidden animate-page-enter ${openFilePath ? 'flex-1 min-w-0' : 'w-full'}`}>
            {children}
          </div>
          {openFilePath && (
            <div className='w-[420px] shrink-0 border-l border-border animate-slide-in-right'>
              <FileEditor
                filePath={openFilePath}
                initialContent={getFile(openFilePath)?.content ?? `# ${openFilePath.split('/').pop()}\n\n(File content)`}
                fileType={inferFileType(openFilePath)}
                lastEditedBy={getFile(openFilePath)?.lastEditedBy}
                lastEditedAt={getFile(openFilePath)?.lastEditedAt}
                onClose={handleCloseFile}
              />
            </div>
          )}
        </div>
      </main>
    </div>
    </ProductLayoutContext.Provider>
  )
}
