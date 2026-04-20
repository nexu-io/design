import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Check, Bot } from "lucide-react";
import {
  Badge,
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  FormField,
  FormFieldControl,
  Input,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  cn,
} from "@nexu-design/ui-web";
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
}: AddMembersDialogProps): React.ReactElement {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" className="max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{t("addMembers.title", { name: channel.name })}</DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-3">
          <FormField>
            <FormFieldControl>
              <Input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("createChannel.searchPlaceholder")}
                leadingIcon={<Search className="h-3.5 w-3.5 text-muted-foreground" />}
              />
            </FormFieldControl>
          </FormField>

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
                      <InteractiveRow
                        key={u.id}
                        onClick={() => toggle(selectedUserIds, u.id, setSelectedUserIds)}
                        selected={selected}
                        tone="subtle"
                        className="rounded-md px-2 py-1.5"
                      >
                        <InteractiveRowLeading>
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="h-7 w-7 rounded-full bg-secondary shrink-0"
                          />
                        </InteractiveRowLeading>
                        <InteractiveRowContent>
                          <div className="text-sm truncate">{u.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                        </InteractiveRowContent>
                        <InteractiveRowTrailing
                          className={cn(
                            "flex items-center justify-center h-5 w-5 rounded border transition-colors shrink-0",
                            selected
                              ? "bg-foreground border-foreground text-background"
                              : "border-input",
                          )}
                        >
                          {selected && <Check className="h-3.5 w-3.5" />}
                        </InteractiveRowTrailing>
                      </InteractiveRow>
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
                      <InteractiveRow
                        key={a.id}
                        onClick={() => toggle(selectedAgentIds, a.id, setSelectedAgentIds)}
                        selected={selected}
                        tone="subtle"
                        className="rounded-md px-2 py-1.5"
                      >
                        <InteractiveRowLeading>
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
                        </InteractiveRowLeading>
                        <InteractiveRowContent>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm truncate">{a.name}</span>
                            <Badge
                              size="xs"
                              className="bg-nexu-agent/15 text-nexu-agent px-1.5 py-0.5 text-[10px]"
                            >
                              {t("createChannel.agentBadge")}
                            </Badge>
                          </div>
                          {a.description && (
                            <div className="text-xs text-muted-foreground truncate">
                              {a.description}
                            </div>
                          )}
                        </InteractiveRowContent>
                        <InteractiveRowTrailing
                          className={cn(
                            "flex items-center justify-center h-5 w-5 rounded border transition-colors shrink-0",
                            selected
                              ? "bg-foreground border-foreground text-background"
                              : "border-input",
                          )}
                        >
                          {selected && <Check className="h-3.5 w-3.5" />}
                        </InteractiveRowTrailing>
                      </InteractiveRow>
                    );
                  })}
                </div>
              </section>
            )}

            {filteredUsers.length === 0 && filteredAgents.length === 0 && (
              <EmptyState
                title={
                  availableUsers.length === 0 && availableAgents.length === 0
                    ? t("addMembers.everyoneAlreadyIn", { name: channel.name })
                    : t("common.noMatches")
                }
                className="border-border-subtle"
              />
            )}
          </div>
        </DialogBody>

        <DialogFooter className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {totalSelected > 0
              ? t("addMembers.selectedCount", { count: String(totalSelected) })
              : channel.members.length === 1
                ? t("addMembers.currentMember", { count: String(channel.members.length) })
                : t("addMembers.currentMembers", { count: String(channel.members.length) })}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleAdd} disabled={totalSelected === 0}>
              {totalSelected > 0
                ? t("addMembers.addWithCount", { count: String(totalSelected) })
                : t("common.add")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
