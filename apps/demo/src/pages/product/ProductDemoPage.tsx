import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  X, MessageSquare, Wrench, Clock, Sparkles, Users,
  Settings, Zap, FolderTree, PanelLeftClose, PanelLeft,
} from 'lucide-react'
import FileTree from './FileTree'
import FileEditor from './FileEditor'
import { getFile } from './fileStore'
import { ProductLayoutContext } from './ProductLayoutContext'
import SessionsPage from './SessionsPage'
import CloneBuilderPage from './CloneBuilderPage'
import AutomationPage from './AutomationPage'
import SkillsPage from './SkillsPage'
import TeamPage from './TeamPage'

const PAGES = [
  { id: 'sessions', icon: MessageSquare, label: 'Sessions', component: SessionsPage },
  { id: 'team', icon: Users, label: '团队协作', component: TeamPage },
  { id: 'explorer', icon: FolderTree, label: 'Explorer', component: null },
  { id: 'clone', icon: Wrench, label: '分身搭建', component: CloneBuilderPage },
  { id: 'automation', icon: Clock, label: 'Automation', component: AutomationPage },
  { id: 'skills', icon: Sparkles, label: 'Skills', component: SkillsPage },
] as const

function inferFileType(path: string) {
  if (path.endsWith('.md')) return 'markdown' as const
  if (path.endsWith('.yaml') || path.endsWith('.yml')) return 'yaml' as const
  if (path.endsWith('.json') || path.endsWith('.jsonl')) return 'jsonl' as const
  if (path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.js')) return 'code' as const
  return 'markdown' as const
}

const TREE_MIN = 180
const TREE_MAX = 480
const TREE_DEFAULT = 224

export default function ProductDemoPage() {
  const [activeTab, setActiveTab] = useState('sessions')
  const [treeCollapsed, setTreeCollapsed] = useState(false)
  const [treeWidth, setTreeWidth] = useState(TREE_DEFAULT)
  const [openFilePath, setOpenFilePath] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (hash && PAGES.some(p => p.id === hash && p.component)) {
      setActiveTab(hash)
    }
  }, [location.hash])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/why')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
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

  const handleTreeNavigate = useCallback((route: string) => {
    const mapping: Record<string, string> = {
      '/app/sessions': 'sessions',
      '/app/team': 'team',
      '/app/clone': 'clone',
      '/app/automation': 'automation',
      '/app/skills': 'skills',
    }
    const tab = mapping[route]
    if (tab) setActiveTab(tab)
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

  const activePage = PAGES.find(p => p.id === activeTab)
  const ActiveComponent = activePage?.component ?? CloneBuilderPage

  return (
    <ProductLayoutContext.Provider value={{ expandFileTree, openFile: handleOpenFile }}>
      <div className='fixed inset-0 z-50 bg-surface-0 flex flex-col'>
        {/* Close bar */}
        <header className='h-9 border-b border-border bg-surface-0/90 backdrop-blur-md flex items-center px-4 gap-3 shrink-0'>
          <button
            onClick={() => navigate('/why')}
            className='p-1 rounded-lg hover:bg-surface-3 text-text-muted transition-colors'
            title='返回 Design System (Esc)'
          >
            <X size={14} />
          </button>
          <div className='text-[11px] font-medium text-text-muted'>nexu Product Demo</div>
          <div className='flex-1' />
          <div className='flex items-center gap-1.5'>
            {PAGES.filter(p => p.component).map(p => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeTab === p.id
                    ? 'bg-accent text-accent-fg'
                    : 'text-text-muted hover:text-text-primary hover:bg-surface-3'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className='flex-1' />
          <div className='text-[11px] text-text-muted'>按 Esc 退出</div>
        </header>

        {/* Product UI */}
        <div className={`flex flex-1 min-h-0 ${isDragging ? 'select-none' : ''}`}>
          {/* Activity Bar */}
          <div className='flex flex-col items-center py-2 w-12 border-r shrink-0 border-border bg-surface-1'>
            <div className='pb-3 mb-3 w-8 border-b border-border'>
              <div className='relative'>
                <div className='flex justify-center items-center w-8 h-8 text-sm rounded-full bg-surface-3 animate-clone-breath-subtle'>
                  😊
                </div>
                <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-surface-1' />
              </div>
            </div>

            <div className='flex-1 flex flex-col items-center gap-0.5'>
              {PAGES.map(({ id, icon: Icon, label }) => {
                const isExplorer = id === 'explorer'
                const active = isExplorer ? !treeCollapsed : activeTab === id

                if (isExplorer) {
                  return (
                    <button
                      key={id}
                      title={label}
                      onClick={() => setTreeCollapsed(c => !c)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative ${
                        active ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
                      }`}
                    >
                      {active && <div className='absolute left-0 top-2 bottom-2 w-0.5 bg-accent rounded-r' />}
                      <Icon size={18} />
                    </button>
                  )
                }

                return (
                  <button
                    key={id}
                    title={label}
                    onClick={() => setActiveTab(id)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative ${
                      active ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {active && <div className='absolute left-0 top-2 bottom-2 w-0.5 bg-accent rounded-r' />}
                    <Icon size={18} />
                  </button>
                )
              })}
            </div>

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

          {/* File Tree */}
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

          {/* Page Content */}
          <main className='overflow-hidden relative flex-1'>
            <div className='h-full flex'>
              <div className={`transition-all duration-200 overflow-hidden ${openFilePath ? 'flex-1 min-w-0' : 'w-full'}`}>
                <ActiveComponent />
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
      </div>
    </ProductLayoutContext.Provider>
  )
}
