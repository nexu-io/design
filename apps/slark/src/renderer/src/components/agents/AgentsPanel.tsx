import { SlidePanel } from "@/components/layout/SlidePanel";
import { mockAgentTemplates, mockAgents, mockRuntimes } from "@/mock/data";
import { useAgentsStore } from "@/stores/agents";
import { usePanelStore } from "@/stores/panel";
import { cn } from "@nexu-design/ui-web";
import { Bot, ChevronRight } from "lucide-react";
import { useEffect } from "react";

export function AgentsPanel(): React.ReactElement {
  const { agents, setAgents, setTemplates } = useAgentsStore();
  const openPanel = usePanelStore((s) => s.openPanel);

  useEffect(() => {
    if (agents.length === 0) {
      setAgents(mockAgents);
      setTemplates(mockAgentTemplates);
    }
  }, [agents.length, setAgents, setTemplates]);

  return (
    <SlidePanel title={`Agents (${agents.length})`}>
      <div className="p-4 space-y-3">
        {agents.map((agent) => {
          const runtime = agent.runtimeId
            ? mockRuntimes.find((r) => r.id === agent.runtimeId)
            : undefined;
          return (
            <button
              type="button"
              key={agent.id}
              onClick={() => openPanel("agent-detail", { agentId: agent.id })}
              className="flex items-center gap-3 w-full p-3 rounded-xl border border-border hover:bg-accent/50 transition-colors text-left"
            >
              <img src={agent.avatar} alt="" className="h-10 w-10 rounded-xl shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{agent.name}</span>
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      agent.status === "online" && "bg-slark-online",
                      agent.status === "busy" && "bg-slark-busy",
                      agent.status === "offline" && "bg-slark-offline",
                    )}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{agent.description}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                  <span>{agent.skills.length} skills</span>
                  {runtime && (
                    <>
                      <span>·</span>
                      <span>{runtime.name}</span>
                    </>
                  )}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          );
        })}

        {agents.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <Bot className="h-8 w-8" />
            <p className="text-sm">No agents yet</p>
          </div>
        )}
      </div>
    </SlidePanel>
  );
}
