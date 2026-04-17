import { ArrowLeft, Bot, Zap, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAgentsStore } from '@/stores/agents'
import { usePanelStore } from '@/stores/panel'
import { mockRuntimes } from '@/mock/data'
import { SlidePanel } from '@/components/layout/SlidePanel'

export function AgentDetailPanel(): React.ReactElement {
  const panelData = usePanelStore((s) => s.panelData)
  const openPanel = usePanelStore((s) => s.openPanel)
  const agents = useAgentsStore((s) => s.agents)

  const agent = agents.find((a) => a.id === panelData.agentId)

  if (!agent) {
    return (
      <SlidePanel title="Agent">
        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          Agent not found
        </div>
      </SlidePanel>
    )
  }

  const runtime = agent.runtimeId
    ? mockRuntimes.find((r) => r.id === agent.runtimeId)
    : undefined

  return (
    <SlidePanel title={agent.name}>
      <div className="p-4 space-y-6">
        <button
          onClick={() => openPanel('agents')}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          All Agents
        </button>

        <div className="flex items-center gap-3">
          <img src={agent.avatar} alt="" className="h-14 w-14 rounded-2xl" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{agent.name}</h3>
              <div
                className={cn(
                  'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                  agent.status === 'online' && 'bg-nexu-online/10 text-nexu-online',
                  agent.status === 'busy' && 'bg-nexu-busy/10 text-nexu-busy',
                  agent.status === 'offline' && 'bg-nexu-offline/10 text-nexu-offline'
                )}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-current" />
                {agent.status}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{agent.description}</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Bot className="h-3.5 w-3.5" />
            System Prompt
          </h4>
          <div className="rounded-lg border border-border bg-secondary/30 p-3 text-xs leading-relaxed whitespace-pre-wrap font-mono text-muted-foreground">
            {agent.systemPrompt}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5" />
            Skills ({agent.skills.length})
          </h4>
          <div className="space-y-1.5">
            {agent.skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2.5 rounded-lg border border-border p-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
                  <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium">{skill.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{skill.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {runtime && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Runtime
            </h4>
            <div className="flex items-center gap-2.5 rounded-lg border border-border p-2.5">
              <div
                className={cn(
                  'h-2.5 w-2.5 rounded-full',
                  runtime.status === 'connected' && 'bg-nexu-online',
                  runtime.status === 'disconnected' && 'bg-nexu-offline',
                  runtime.status === 'error' && 'bg-destructive'
                )}
              />
              <div>
                <div className="text-xs font-medium">{runtime.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {runtime.type} {runtime.version && `v${runtime.version}`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SlidePanel>
  )
}
