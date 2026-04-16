import { useParams } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAgentsStore } from '@/stores/agents'
import { mockRuntimes } from '@/mock/data'
import { AgentDetail } from './AgentDetail'

export function AgentsView(): React.ReactElement {
  const { agentId } = useParams()
  const agents = useAgentsStore((s) => s.agents)

  if (agentId && agentId !== 'create') {
    const agent = agents.find((a) => a.id === agentId)
    if (agent) return <AgentDetail agent={agent} />
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Agent not found
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Bot className="h-10 w-10" />
          <p className="text-lg font-medium">No agents yet</p>
          <p className="text-sm">Create your first agent to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="drag-region h-10" />
      <h1 className="text-xl font-semibold mb-6">Agents</h1>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const runtime = agent.runtimeId
            ? mockRuntimes.find((r) => r.id === agent.runtimeId)
            : undefined
          return (
            <div
              key={agent.id}
              className="rounded-xl border border-border p-4 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <img src={agent.avatar} alt="" className="h-10 w-10 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{agent.name}</span>
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        agent.status === 'online' && 'bg-slark-online',
                        agent.status === 'busy' && 'bg-slark-busy',
                        agent.status === 'offline' && 'bg-slark-offline'
                      )}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {agent.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span>{agent.skills.length} skills</span>
                {runtime && (
                  <>
                    <span>·</span>
                    <span>{runtime.name}</span>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
