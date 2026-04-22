import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Search, Bot, UserPlus } from "lucide-react";

import { Button, Input, cn } from "@nexu-design/ui-web";

import { useAgentsStore } from "@/stores/agents";
import { presenceDotClass, presenceLabel } from "@/lib/user-presence";
import { mockAgents, mockAgentTemplates, mockUsers } from "@/mock/data";
import { CreateAgentDialog } from "./CreateAgentDialog";
import { InvitePeopleDialog } from "@/components/chat/InvitePeopleDialog";
import type { Agent, User } from "@/types";

export function AgentsSidebar(): React.ReactElement {
  const navigate = useNavigate();
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
          {/* Outline variant: white fill + subtle border + surface-2 hover.
              This gives the Add-teammate action a clear visual weight and
              keeps it distinct from the adjacent gray-filled Search input. */}
          <Button
            onClick={() => setShowAddMenu((v) => !v)}
            variant="outline"
            size="sm"
            className="h-8 w-full justify-start"
            leadingIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Add teammate
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
                className="h-auto w-full justify-start rounded-md px-2.5 py-2 text-xs text-left text-foreground hover:bg-surface-2 hover:text-foreground"
                leadingIcon={<UserPlus className="h-3.5 w-3.5 shrink-0" />}
              >
                <span className="flex-1">Invite person</span>
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
                className="h-auto w-full justify-start rounded-md px-2.5 py-2 text-xs text-left text-foreground hover:bg-surface-2 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                leadingIcon={<Bot className="h-3.5 w-3.5 shrink-0" />}
              >
                <span className="flex-1">Create agent</span>
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
          placeholder="Search team"
          leadingIcon={<Search className="h-3.5 w-3.5 text-nav-muted" />}
          className="h-8 border-transparent bg-nav-input text-nav-fg shadow-none focus-within:border-transparent focus-within:ring-1 focus-within:ring-nav-ring"
          inputClassName="text-[13px] placeholder:text-nav-muted"
        />
      </div>

      {/* `pt-2` gives the first section header visible breathing room
          below the Search input — flush against the input block it felt
          cramped and made the header read as input meta. */}
      <div className="flex-1 overflow-y-auto px-2 pt-2 space-y-3">
        {filteredUsers.length > 0 && (
          <div>
            {/* Section headers drop their leading icon — the uppercase
                label already reads as a header and the icon was adding
                visual noise in a narrow sidebar. */}
            <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-nav-muted uppercase tracking-wider">
              <span className="flex-1">Members</span>
              <span className="text-[11px] normal-case tracking-normal font-medium">
                {filteredUsers.length}
              </span>
            </div>
            <div className="space-y-0.5">
              {filteredUsers.map((user) => (
                <Button
                  key={user.id}
                  type="button"
                  variant="ghost"
                  size="inline"
                  onClick={() => handleSelectUser(user)}
                  className={cn(
                    "flex items-center gap-2.5 w-full px-2 py-2 rounded-md transition-colors",
                    memberId === user.id
                      ? "bg-nav-active text-nav-active-fg"
                      : "text-nav-muted hover:bg-nav-hover hover:text-nav-fg",
                  )}
                >
                  {/* Avatar + presence dot overlay. The ring keeps the photo
                    readable on surface hover fills; the small colored dot
                    in the bottom-right carries the member's live status
                    (online / away / offline) using the shared presence
                    palette. A `border-nav` ring on the dot cuts it out
                    cleanly from whichever avatar it's sitting on. */}
                  <span className="relative inline-block shrink-0">
                    <img
                      src={user.avatar}
                      alt=""
                      className="h-7 w-7 rounded-full ring-1 ring-inset ring-black/5"
                    />
                    <span
                      role="status"
                      aria-label={presenceLabel(user.status)}
                      title={presenceLabel(user.status)}
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-nav",
                        presenceDotClass(user.status),
                      )}
                    />
                  </span>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium truncate">{user.name}</span>
                      {user.role === "owner" && (
                        /* Owner tag always reads as a brand-accented label
                         (brand-primary on brand-subtle), selected row or
                         not — matches the larger Owner badge on the
                         profile detail header for visual consistency. */
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-brand-primary bg-brand-subtle px-1 py-px rounded shrink-0">
                          Owner
                        </span>
                      )}
                    </div>
                    <div
                      className={cn(
                        /* `font-normal` overrides the Button primitive's default
                         `font-medium` so secondary meta (email, agent desc)
                         reads as body text, not a second heading.
                         `text-text-tertiary` is the lightest text token — used
                         here so email stays clearly subordinate to the name. */
                        "text-xs font-normal truncate",
                        memberId === user.id ? "text-nav-active-muted" : "text-text-tertiary",
                      )}
                    >
                      {user.email}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {filteredAgents.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-nav-muted uppercase tracking-wider">
              <span className="flex-1">Agents</span>
              <span className="text-[11px] normal-case tracking-normal font-medium">
                {filteredAgents.length}
              </span>
            </div>
            <div className="space-y-0.5">
              {filteredAgents.map((agent) => (
                <Button
                  key={agent.id}
                  type="button"
                  variant="ghost"
                  size="inline"
                  onClick={() => handleSelectAgent(agent)}
                  className={cn(
                    "flex items-center gap-2.5 w-full px-2 py-2 rounded-md transition-colors",
                    memberId === agent.id
                      ? "bg-nav-active text-nav-active-fg"
                      : "text-nav-muted hover:bg-nav-hover hover:text-nav-fg",
                  )}
                >
                  <img
                    src={agent.avatar}
                    alt=""
                    className="h-7 w-7 rounded-full shrink-0 bg-secondary ring-1 ring-inset ring-black/5"
                  />
                  <div className="min-w-0 flex-1 text-left">
                    <div className="text-sm font-medium truncate">{agent.name}</div>
                    <div
                      className={cn(
                        "text-xs font-normal truncate",
                        memberId === agent.id ? "text-nav-active-muted" : "text-text-tertiary",
                      )}
                    >
                      {agent.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {filteredUsers.length === 0 && filteredAgents.length === 0 && (
          <div className="px-2 py-4 text-center text-xs text-nav-muted">No matches</div>
        )}
      </div>

      <CreateAgentDialog open={showCreateAgent} onOpenChange={setShowCreateAgent} />
      <InvitePeopleDialog open={showInvite} onOpenChange={setShowInvite} />
    </div>
  );
}
