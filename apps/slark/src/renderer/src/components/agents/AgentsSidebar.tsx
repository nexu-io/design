import { mockAgentTemplates, mockAgents } from "@/mock/data";
import { useAgentsStore } from "@/stores/agents";
import { Button, Input, ScrollArea, Tabs, TabsList, TabsTrigger, cn } from "@nexu-design/ui-web";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreateAgentDialog } from "./CreateAgentDialog";

type Filter = "all" | "mine";

export function AgentsSidebar(): React.ReactElement {
  const navigate = useNavigate();
  const { agentId } = useParams();
  const { agents, setAgents, setTemplates, selectAgent } = useAgentsStore();
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const onlineCount = agents.filter((agent) => agent.status === "online").length;

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
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-3 pb-2 flex items-center gap-2">
        <span className="text-xs text-text-tertiary">
          {onlineCount}/{agents.length} online
        </span>
      </div>
      <div className="px-3 pb-2 space-y-2">
        <Button
          onClick={() => setShowCreateAgent(true)}
          size="sm"
          className="w-full justify-start"
          leadingIcon={<Plus className="size-3.5" />}
        >
          Create Agent
        </Button>
        <Input
          size="sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search agents"
          leadingIcon={<Search className="size-3.5" />}
        />
        <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
          <TabsList variant="compact">
            <TabsTrigger value="all" variant="compact">
              All
            </TabsTrigger>
            <TabsTrigger value="mine" variant="compact">
              My Agents
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ScrollArea className="min-h-0 flex-1 px-2 pb-3">
        <div className="space-y-1 pr-1">
          {filtered.map((agent) => (
            <button
              key={agent.id}
              type="button"
              onClick={() => {
                selectAgent(agent.id);
                navigate(`/agents/${agent.id}`);
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors",
                agentId === agent.id
                  ? "bg-surface-2 text-text-primary"
                  : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
              )}
            >
              <div className="relative shrink-0">
                <img src={agent.avatar} alt="" className="h-7 w-7 rounded-lg" />
                <div
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface-1",
                    agent.status === "online" && "bg-slark-online",
                    agent.status === "busy" && "bg-slark-busy",
                    agent.status === "offline" && "bg-slark-offline",
                  )}
                />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="truncate text-[13px] font-medium">{agent.name}</div>
                <div className="truncate text-xs text-text-tertiary">{agent.description}</div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-2 py-4 text-center text-xs text-text-tertiary">No agents found</div>
          )}
        </div>
      </ScrollArea>
      <CreateAgentDialog open={showCreateAgent} onOpenChange={setShowCreateAgent} />
    </div>
  );
}
