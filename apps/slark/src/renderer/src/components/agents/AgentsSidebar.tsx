import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Search, Users as UsersIcon, Bot, UserPlus } from "lucide-react";

import { Button, Input, cn } from "@nexu-design/ui-web";

import { useT } from "@/i18n";
import { useAgentsStore } from "@/stores/agents";
import { mockAgents, mockAgentTemplates, mockUsers } from "@/mock/data";
import { CreateAgentDialog } from "./CreateAgentDialog";
import { InvitePeopleDialog } from "@/components/chat/InvitePeopleDialog";
import type { Agent, User } from "@/types";

export function AgentsSidebar(): React.ReactElement {
  const navigate = useNavigate();
  const t = useT();
  const { memberId } = useParams();
  const { agents, setAgents, setTemplates, selectAgent } = useAgentsStore();
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [search, setSearch] = useState("");
  const addMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (agents.length === 0) {
      setAgents(mockAgents);
      setTemplates(mockAgentTemplates);
    }
  }, [agents.length, setAgents, setTemplates]);

  useEffect(() => {
    if (!memberId && (mockUsers.length > 0 || agents.length > 0)) {
      const first = mockUsers[0]?.id ?? agents[0]?.id;
      if (first) navigate(`/agents/${first}`, { replace: true });
    }
  }, [memberId, agents, navigate]);

  useEffect(() => {
    if (!showAddMenu) return;
    const handler = (e: MouseEvent): void => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAddMenu]);

  const matchSearch = (text: string): boolean => {
    if (!search) return true;
    return text.toLowerCase().includes(search.toLowerCase());
  };

  const filteredUsers = mockUsers.filter((u) => matchSearch(u.name) || matchSearch(u.email));
  const filteredAgents = agents.filter((a) => matchSearch(a.name) || matchSearch(a.description));

  const atAgentLimit = agents.length >= 10;

  const handleSelectUser = (user: User): void => {
    navigate(`/agents/${user.id}`);
  };

  const handleSelectAgent = (agent: Agent): void => {
    selectAgent(agent.id);
    navigate(`/agents/${agent.id}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pb-2 space-y-2">
        <div className="relative" ref={addMenuRef}>
          <Button
            onClick={() => setShowAddMenu((v) => !v)}
            variant="ghost"
            size="sm"
            className="h-8 w-full justify-start rounded-md bg-nav-hover text-nav-fg hover:bg-nav-border hover:text-nav-fg"
            leadingIcon={<Plus className="h-3.5 w-3.5" />}
          >
            {t("team.addMember")}
          </Button>

          {showAddMenu && (
            <div className="absolute top-9 left-0 right-0 z-50 rounded-lg border border-border bg-popover text-foreground shadow-lg overflow-hidden p-1">
              <Button
                onClick={() => {
                  setShowAddMenu(false);
                  setShowInvite(true);
                }}
                variant="ghost"
                size="inline"
                className="h-auto w-full justify-start rounded-md px-2.5 py-2 text-xs text-left text-foreground hover:bg-accent hover:text-foreground"
                leadingIcon={<UserPlus className="h-3.5 w-3.5 shrink-0" />}
              >
                <span className="flex-1">{t("team.invitePerson")}</span>
              </Button>
              <Button
                onClick={() => {
                  setShowAddMenu(false);
                  if (!atAgentLimit) setShowCreateAgent(true);
                }}
                disabled={atAgentLimit}
                title={atAgentLimit ? `${agents.length}/10` : undefined}
                variant="ghost"
                size="inline"
                className="h-auto w-full justify-start rounded-md px-2.5 py-2 text-xs text-left text-foreground hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                leadingIcon={<Bot className="h-3.5 w-3.5 shrink-0" />}
              >
                <span className="flex-1">{t("team.createAgent")}</span>
                {atAgentLimit && (
                  <span className="text-[10px] text-muted-foreground">{agents.length}/10</span>
                )}
              </Button>
            </div>
          )}
        </div>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("team.searchPlaceholder")}
          leadingIcon={<Search className="h-3.5 w-3.5 text-nav-muted" />}
          className="h-8 border-transparent bg-nav-input text-nav-fg shadow-none focus-within:border-transparent focus-within:ring-1 focus-within:ring-nav-ring"
          inputClassName="text-[13px] placeholder:text-nav-muted"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-3">
        {filteredUsers.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-nav-muted uppercase tracking-wider">
              <UsersIcon className="h-3 w-3" />
              <span className="flex-1">{t("team.people")}</span>
              <span className="text-[10px] normal-case tracking-normal font-medium">
                {filteredUsers.length}
              </span>
            </div>
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={cn(
                  "flex items-center gap-2.5 w-full px-2 py-2 rounded-md transition-colors",
                  memberId === user.id
                    ? "bg-nav-active text-nav-active-fg"
                    : "text-nav-muted hover:bg-nav-hover hover:text-nav-fg",
                )}
              >
                <img src={user.avatar} alt="" className="h-7 w-7 rounded-full shrink-0" />
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate">{user.name}</span>
                    {user.role === "owner" && (
                      <span
                        className={cn(
                          "text-[9px] font-semibold uppercase tracking-wide px-1 py-px rounded shrink-0",
                          memberId === user.id
                            ? "text-nav-active-fg bg-nav-active-soft"
                            : "text-nav-muted bg-nav-hover",
                        )}
                      >
                        {t("team.role.owner")}
                      </span>
                    )}
                  </div>
                  <div
                    className={cn(
                      "text-xs truncate",
                      memberId === user.id ? "text-nav-active-muted" : "text-nav-muted",
                    )}
                  >
                    {user.email}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {filteredAgents.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-nav-muted uppercase tracking-wider">
              <Bot className="h-3 w-3" />
              <span className="flex-1">{t("team.agents")}</span>
              <span className="text-[10px] normal-case tracking-normal font-medium">
                {filteredAgents.length}
              </span>
            </div>
            {filteredAgents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => handleSelectAgent(agent)}
                className={cn(
                  "flex items-center gap-2.5 w-full px-2 py-2 rounded-md transition-colors",
                  memberId === agent.id
                    ? "bg-nav-active text-nav-active-fg"
                    : "text-nav-muted hover:bg-nav-hover hover:text-nav-fg",
                )}
              >
                <img src={agent.avatar} alt="" className="h-7 w-7 rounded-lg shrink-0" />
                <div className="min-w-0 flex-1 text-left">
                  <div className="text-sm font-medium truncate">{agent.name}</div>
                  <div
                    className={cn(
                      "text-xs truncate",
                      memberId === agent.id ? "text-nav-active-muted" : "text-nav-muted",
                    )}
                  >
                    {agent.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {filteredUsers.length === 0 && filteredAgents.length === 0 && (
          <div className="px-2 py-4 text-center text-xs text-nav-muted">{t("team.noResults")}</div>
        )}
      </div>

      <CreateAgentDialog open={showCreateAgent} onOpenChange={setShowCreateAgent} />
      <InvitePeopleDialog open={showInvite} onOpenChange={setShowInvite} />
    </div>
  );
}
