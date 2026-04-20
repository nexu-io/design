import { useEffect, useMemo, useRef, useState } from "react";
import { X, Search, Check, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";
import { useChatStore } from "@/stores/chat";
import { useAgentsStore } from "@/stores/agents";
import { mockUsers } from "@/mock/data";
import type { Channel, MemberRef } from "@/types";

interface AddMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel: Channel;
}

export function AddMembersDialog({
  open,
  onOpenChange,
  channel,
}: AddMembersDialogProps): React.ReactElement | null {
  const t = useT();
  const updateChannel = useChatStore((s) => s.updateChannel);
  const addMessage = useChatStore((s) => s.addMessage);
  const agents = useAgentsStore((s) => s.agents);

  const currentUserIds = useMemo(
    () => new Set(channel.members.filter((m) => m.kind === "user").map((m) => m.id)),
    [channel.members],
  );
  const currentAgentIds = useMemo(
    () => new Set(channel.members.filter((m) => m.kind === "agent").map((m) => m.id)),
    [channel.members],
  );

  const [query, setQuery] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [selectedAgentIds, setSelectedAgentIds] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelectedUserIds(new Set());
    setSelectedAgentIds(new Set());
    requestAnimationFrame(() => searchRef.current?.focus());
  }, [open]);

  if (!open) return null;

  const availableUsers = mockUsers.filter((u) => !currentUserIds.has(u.id));
  const availableAgents = agents.filter((a) => !currentAgentIds.has(a.id));

  const q = query.trim().toLowerCase();
  const filteredUsers = q
    ? availableUsers.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      )
    : availableUsers;
  const filteredAgents = q
    ? availableAgents.filter(
        (a) => a.name.toLowerCase().includes(q) || (a.description ?? "").toLowerCase().includes(q),
      )
    : availableAgents;

  const toggle = (set: Set<string>, id: string, setter: (s: Set<string>) => void): void => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  };

  const totalSelected = selectedUserIds.size + selectedAgentIds.size;

  const handleAdd = (): void => {
    if (totalSelected === 0) return;
    const additions: MemberRef[] = [
      ...Array.from(selectedUserIds).map((id): MemberRef => ({ kind: "user", id })),
      ...Array.from(selectedAgentIds).map((id): MemberRef => ({ kind: "agent", id })),
    ];
    updateChannel(channel.id, { members: [...channel.members, ...additions] });
    addMessage(channel.id, {
      id: `msg-join-${Date.now()}`,
      channelId: channel.id,
      sender: { kind: "user", id: "u-1" },
      content: "",
      mentions: [],
      reactions: [],
      createdAt: Date.now(),
      system: { kind: "join", members: additions },
    });
    onOpenChange(false);
  };

  const handleOverlayClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) onOpenChange(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      <div className="w-[440px] rounded-xl border border-border bg-background text-foreground shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-1">
          <h2 className="text-base font-semibold text-foreground">
            {t("addMembers.title", { name: channel.name })}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("createChannel.searchPlaceholder")}
              className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="max-h-[320px] overflow-y-auto -mx-1 px-1 space-y-4">
            {filteredUsers.length > 0 && (
              <section>
                <div className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("createChannel.people")}
                </div>
                <div className="space-y-0.5">
                  {filteredUsers.map((u) => {
                    const selected = selectedUserIds.has(u.id);
                    return (
                      <button
                        key={u.id}
                        onClick={() => toggle(selectedUserIds, u.id, setSelectedUserIds)}
                        className={cn(
                          "w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-left transition-colors",
                          selected ? "bg-accent/60" : "hover:bg-accent",
                        )}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="h-7 w-7 rounded-full bg-secondary shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate">{u.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                        </div>
                        <div
                          className={cn(
                            "flex items-center justify-center h-5 w-5 rounded border transition-colors shrink-0",
                            selected
                              ? "bg-foreground border-foreground text-background"
                              : "border-input",
                          )}
                        >
                          {selected && <Check className="h-3.5 w-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {filteredAgents.length > 0 && (
              <section>
                <div className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("createChannel.agents")}
                </div>
                <div className="space-y-0.5">
                  {filteredAgents.map((a) => {
                    const selected = selectedAgentIds.has(a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() => toggle(selectedAgentIds, a.id, setSelectedAgentIds)}
                        className={cn(
                          "w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-left transition-colors",
                          selected ? "bg-accent/60" : "hover:bg-accent",
                        )}
                      >
                        {a.avatar ? (
                          <img
                            src={a.avatar}
                            alt={a.name}
                            className="h-7 w-7 rounded-md bg-secondary shrink-0"
                          />
                        ) : (
                          <div className="h-7 w-7 rounded-md bg-secondary flex items-center justify-center shrink-0">
                            <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm truncate">{a.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-nexu-agent/15 text-nexu-agent font-medium shrink-0">
                              {t("createChannel.agentBadge")}
                            </span>
                          </div>
                          {a.description && (
                            <div className="text-xs text-muted-foreground truncate">
                              {a.description}
                            </div>
                          )}
                        </div>
                        <div
                          className={cn(
                            "flex items-center justify-center h-5 w-5 rounded border transition-colors shrink-0",
                            selected
                              ? "bg-foreground border-foreground text-background"
                              : "border-input",
                          )}
                        >
                          {selected && <Check className="h-3.5 w-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {filteredUsers.length === 0 && filteredAgents.length === 0 && (
              <div className="py-10 text-center text-sm text-muted-foreground">
                {availableUsers.length === 0 && availableAgents.length === 0
                  ? t("addMembers.everyoneAlreadyIn", { name: channel.name })
                  : t("common.noMatches")}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-5 pb-5 pt-1">
          <span className="text-xs text-muted-foreground">
            {totalSelected > 0
              ? t("addMembers.selectedCount", { count: String(totalSelected) })
              : channel.members.length === 1
                ? t("addMembers.currentMember", { count: String(channel.members.length) })
                : t("addMembers.currentMembers", { count: String(channel.members.length) })}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="h-8 px-3 rounded-md text-sm border border-border hover:bg-accent transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={handleAdd}
              disabled={totalSelected === 0}
              className="h-8 px-4 rounded-md text-sm font-medium bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              {totalSelected > 0
                ? t("addMembers.addWithCount", { count: String(totalSelected) })
                : t("common.add")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
