import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { cn } from "@nexu-design/ui-web";
import { useAgentsStore } from "@/stores/agents";
import { mockAgents, mockAgentTemplates } from "@/mock/data";
import { CreateAgentDialog } from "./CreateAgentDialog";

type Filter = "all" | "mine";

export function AgentsSidebar(): React.ReactElement {
  const navigate = useNavigate();
  const { agentId } = useParams();
  const { agents, setAgents, setTemplates, selectAgent } = useAgentsStore();
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (agents.length === 0) {
      setAgents(mockAgents);
      setTemplates(mockAgentTemplates);
    }
  }, [agents.length, setAgents, setTemplates]);

  useEffect(() => {
    if (!agentId && agents.length > 0) {
      navigate(`/agents/${agents[0].id}`, { replace: true });
    }
  }, [agentId, agents, navigate]);

  const filtered = agents.filter((a) => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "mine" && a.createdBy !== "u-1") return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pb-2 space-y-2">
        <button
          onClick={() => setShowCreateAgent(true)}
          className="flex items-center gap-2 w-full h-8 px-3 rounded-md text-sm bg-accent hover:bg-accent/80 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Agent
        </button>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents"
            className="w-full h-8 rounded-md border border-input bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "h-6 px-2.5 rounded-md text-xs font-medium transition-colors",
              filter === "all"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-accent",
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("mine")}
            className={cn(
              "h-6 px-2.5 rounded-md text-xs font-medium transition-colors",
              filter === "mine"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-accent",
            )}
          >
            My Agents
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {filtered.map((agent) => (
          <button
            key={agent.id}
            onClick={() => {
              selectAgent(agent.id);
              navigate(`/agents/${agent.id}`);
            }}
            className={cn(
              "flex items-center gap-2.5 w-full px-2 py-2 rounded-md transition-colors",
              agentId === agent.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            )}
          >
            <div className="relative shrink-0">
              <img src={agent.avatar} alt="" className="h-7 w-7 rounded-lg" />
              <div
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                  agent.status === "online" && "bg-slark-online",
                  agent.status === "busy" && "bg-slark-busy",
                  agent.status === "offline" && "bg-slark-offline",
                )}
              />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="text-sm font-medium truncate">{agent.name}</div>
              <div className="text-xs text-muted-foreground truncate">{agent.description}</div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="px-2 py-4 text-center text-xs text-muted-foreground">No agents found</div>
        )}
      </div>
      <CreateAgentDialog open={showCreateAgent} onOpenChange={setShowCreateAgent} />
    </div>
  );
}
