import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Search, X } from "lucide-react";

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
  const [search, setSearch] = useState("");

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
      {/* Persistent search input, sitting right under the sidebar's
          `TEAMMATE` title row. Keeping it always visible (rather than
          behind a toggle) mirrors the Chat sidebar's layout and makes
          the filter immediately discoverable. Scope is both members
          and agents, matching the lists below.
          `pt-2 pb-4` gives the input clear breathing room on both
          sides — `pt-2` stacks on the SidebarHeader's own `pb-2` for
          16px above the field, and `pb-4` keeps the input visually
          detached from the MEMBERS section header beneath it. */}
      <div className="px-3 pt-2 pb-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members, agents"
          leadingIcon={<Search className="h-3.5 w-3.5 text-nav-muted" />}
          trailingIcon={
            search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="flex h-4 w-4 items-center justify-center rounded text-nav-muted hover:bg-nav-hover hover:text-nav-fg"
              >
                <X className="h-3 w-3" />
              </button>
            ) : undefined
          }
          className="h-8 border-border-subtle bg-nav-input text-nav-fg shadow-none focus-within:border-transparent focus-within:ring-1 focus-within:ring-nav-ring"
          inputClassName="text-[13px] placeholder:text-nav-muted/50"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-3">
        <section>
          {/* Section header: [Members] [count, gap-1.5 ≈ 6px].
              "Members" is kept distinct from the top-level "Teammate"
              title — the top label is the sidebar's identity (and carries
              the invite CTA + search), while this scoped label reminds
              the reader that this list is human members, paired with the
              Agents list below. */}
          <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-nav-muted uppercase tracking-wider">
            <div className="flex flex-1 items-baseline gap-1.5 min-w-0">
              <span>Members</span>
              <span className="text-[11px] normal-case tracking-normal font-medium text-nav-muted">
                {filteredUsers.length}
              </span>
            </div>
            {/* Section-header action: outlined 20px `+` chip. The border
                + `surface-0` fill give it visibly more weight than a
                bare ghost icon, reading as a clear affordance next to
                the label rather than decorative chrome. Same chip is
                reused on the AGENTS header for consistency. */}
            <button
              type="button"
              onClick={() => setShowInvite(true)}
              aria-label="Invite teammate"
              title="Invite teammate"
              className="flex h-5 w-5 items-center justify-center rounded border border-border-subtle bg-surface-0 text-nav-fg shadow-xs transition-colors hover:border-border hover:bg-nav-hover"
            >
              <Plus className="h-3 w-3" />
            </button>
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
                      <span className="text-[9px] font-semibold uppercase tracking-wide text-brand-primary bg-brand-subtle px-1 py-px rounded shrink-0">
                        Owner
                      </span>
                    )}
                  </div>
                  <div
                    className={cn(
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
        </section>

        <section>
          <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-nav-muted uppercase tracking-wider">
            <div className="flex flex-1 items-baseline gap-1.5 min-w-0">
              <span>Agents</span>
              <span className="text-[11px] normal-case tracking-normal font-medium text-nav-muted">
                {filteredAgents.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!atAgentLimit) setShowCreateAgent(true);
              }}
              disabled={atAgentLimit}
              aria-label="Create agent"
              title={atAgentLimit ? `${agents.length}/10` : "Create agent"}
              className="flex h-5 w-5 items-center justify-center rounded border border-border-subtle bg-surface-0 text-nav-fg shadow-xs transition-colors hover:border-border hover:bg-nav-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-subtle disabled:hover:bg-surface-0"
            >
              <Plus className="h-3 w-3" />
            </button>
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
        </section>

        {search && filteredUsers.length === 0 && filteredAgents.length === 0 && (
          <div className="px-2 py-4 text-center text-xs text-nav-muted">No matches</div>
        )}
      </div>

      <CreateAgentDialog open={showCreateAgent} onOpenChange={setShowCreateAgent} />
      <InvitePeopleDialog open={showInvite} onOpenChange={setShowInvite} />
    </div>
  );
}
