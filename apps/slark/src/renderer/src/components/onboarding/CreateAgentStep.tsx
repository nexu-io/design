import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Rocket, ChevronDown, Check, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWorkspaceStore } from '@/stores/workspace'
import { useAgentsStore } from '@/stores/agents'
import { useRuntimesStore } from '@/stores/runtimes'
import { mockAgentTemplates, mockRuntimes } from '@/mock/data'
import type { AgentTemplate } from '@/types'

type Phase = 'templates' | 'settings'

export function CreateAgentStep(): React.ReactElement {
  const navigate = useNavigate()
  const completeOnboarding = useWorkspaceStore((s) => s.completeOnboarding)
  const setPendingWelcomeAgent = useWorkspaceStore((s) => s.setPendingWelcomeAgent)
  const addAgent = useAgentsStore((s) => s.addAgent)
  const runtimes = useRuntimesStore((s) => s.runtimes)
  const setGlobalRuntimes = useRuntimesStore((s) => s.setRuntimes)

  const [phase, setPhase] = useState<Phase>('templates')
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null)

  const [agentName, setAgentName] = useState('')
  const [description, setDescription] = useState('')
  const [runtimeId, setRuntimeId] = useState<string | null>(null)
  const [runtimeOpen, setRuntimeOpen] = useState(false)

  const handleSelectTemplate = (tpl: AgentTemplate): void => {
    setSelectedTemplate(tpl)
    setAgentName(tpl.name)
    setDescription(tpl.description)
    const firstConnected = runtimes.find((r) => r.status === 'connected')
    if (firstConnected) setRuntimeId(firstConnected.id)
    setPhase('settings')
  }

  useEffect(() => {
    if (!runtimeOpen) return
    const handleClick = (): void => setRuntimeOpen(false)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [runtimeOpen])

  const handleSkip = (): void => {
    completeOnboarding()
    navigate('/chat/ch-welcome')
  }

  const handleBlankAgent = (): void => {
    setSelectedTemplate(null)
    setAgentName('')
    setDescription('')
    const firstConnected = runtimes.find((r) => r.status === 'connected')
    if (firstConnected) setRuntimeId(firstConnected.id)
    setPhase('settings')
  }

  const handleBackToTemplates = (): void => {
    const nameChanged = selectedTemplate ? agentName !== selectedTemplate.name : agentName !== ''
    const descChanged = selectedTemplate ? description !== selectedTemplate.description : description !== ''
    if (nameChanged || descChanged) {
      if (!window.confirm('Your changes will be lost. Go back to templates?')) return
    }
    setPhase('templates')
  }

  const handleDetectRuntimes = (): void => {
    const connected = mockRuntimes.filter((r) => r.status === 'connected')
    setGlobalRuntimes(connected)
    if (connected.length > 0) setRuntimeId(connected[0].id)
  }

  const handleCreate = (): void => {
    if (!agentName.trim()) return
    const agentId = `a-${Date.now()}`
    addAgent({
      id: agentId,
      name: agentName.trim(),
      avatar: selectedTemplate?.avatar ?? `https://api.dicebear.com/9.x/bottts/svg?seed=${agentId}&backgroundColor=6366f1`,
      description: description.trim(),
      systemPrompt: selectedTemplate?.defaultPrompt ?? `You are ${agentName.trim()}, a helpful AI assistant.`,
      status: 'online',
      skills: [],
      runtimeId,
      templateId: selectedTemplate?.id ?? null,
      createdBy: 'u-1',
      createdAt: Date.now()
    })
    setPendingWelcomeAgent(agentId)
    completeOnboarding()
    navigate('/chat/ch-welcome')
  }

  const selectedRuntime = runtimeId ? runtimes.find((r) => r.id === runtimeId) : null
  const connectedRuntimes = runtimes.filter((r) => r.status === 'connected')

  if (phase === 'templates') {
    return (
      <div className="flex flex-col items-center gap-6 pt-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Create your first Agent</h2>
          <p className="text-muted-foreground mt-2">Choose a template to get started</p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full">
          {mockAgentTemplates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl)}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl border transition-all text-left',
                'border-border hover:border-muted-foreground/50 hover:bg-accent/50'
              )}
            >
              <img src={tpl.avatar} alt="" className="h-10 w-10 rounded-lg shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-sm">{tpl.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {tpl.description}
                </div>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={handleBlankAgent}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-border hover:border-muted-foreground/50 hover:bg-accent/50 transition-all text-muted-foreground"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Start from scratch</span>
        </button>
        <button
          onClick={handleSkip}
          className="h-10 px-5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
        >
          Skip for now
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 pt-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Customize your Agent</h2>
        <p className="text-muted-foreground mt-2">
          Set a name, description, and connect a runtime
        </p>
      </div>

      <div className="w-full max-w-md space-y-5">
        {selectedTemplate && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50 border border-border">
            <img
              src={selectedTemplate.avatar}
              alt=""
              className="h-10 w-10 rounded-lg shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground">Based on template</div>
              <div className="text-sm font-medium">{selectedTemplate.name}</div>
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium mb-1.5 block">Agent Name</label>
          <input
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="e.g. CodeBot"
            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this agent do?"
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Runtime</label>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setRuntimeOpen((v) => !v)
              }}
              className={cn(
                'w-full h-10 rounded-lg border bg-background px-3 text-sm text-left flex items-center justify-between transition-colors',
                runtimeOpen
                  ? 'border-ring ring-2 ring-ring'
                  : 'border-input hover:border-muted-foreground/50'
              )}
            >
              {selectedRuntime ? (
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full shrink-0',
                      selectedRuntime.status === 'connected'
                        ? 'bg-nexu-online'
                        : 'bg-nexu-offline'
                    )}
                  />
                  <span className="truncate">{selectedRuntime.name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">
                  {connectedRuntimes.length > 0
                    ? 'Select a runtime'
                    : 'No runtime connected'}
                </span>
              )}
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground shrink-0 transition-transform',
                  runtimeOpen && 'rotate-180'
                )}
              />
            </button>

            {runtimeOpen && connectedRuntimes.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 rounded-lg border border-border bg-background shadow-lg py-1 max-h-48 overflow-y-auto">
                {connectedRuntimes.map((rt) => (
                  <button
                    key={rt.id}
                    onClick={() => {
                      setRuntimeId(rt.id)
                      setRuntimeOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-accent transition-colors"
                  >
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full shrink-0',
                        rt.status === 'connected' ? 'bg-nexu-online' : 'bg-nexu-offline'
                      )}
                    />
                    <span className="flex-1 truncate">{rt.name}</span>
                    {rt.version && (
                      <span className="text-xs text-muted-foreground">v{rt.version}</span>
                    )}
                    {runtimeId === rt.id && (
                      <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          {connectedRuntimes.length === 0 && (
            <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1.5">
              No runtimes detected.
              <button
                type="button"
                onClick={handleDetectRuntimes}
                className="inline-flex items-center gap-1 text-foreground underline underline-offset-2 hover:no-underline transition-colors"
              >
                <Search className="h-3 w-3" />
                Scan now
              </button>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleBackToTemplates}
          className="flex items-center gap-1.5 h-10 px-5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to templates
        </button>
        <button
          onClick={handleCreate}
          disabled={!agentName.trim()}
          className="flex items-center gap-2 h-10 px-5 rounded-lg bg-foreground text-background text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors"
        >
          <Rocket className="h-4 w-4" />
          Create Agent
        </button>
      </div>
    </div>
  )
}
