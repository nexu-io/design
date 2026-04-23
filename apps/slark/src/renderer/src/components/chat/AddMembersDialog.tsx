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
                {/* Section label styled to match the Teammate sidebar's
                    MEMBERS / AGENTS headers: `tracking-wider`, plus the
                    list count right after the title (gap-1.5 ≈ 6px) in
                    `normal-case` so label and count read as one phrase.
                    Kept at `text-muted-foreground` — this dialog sits on
                    a `surface-0` background, not the nav, so we stay on
                    the generic muted token. */}
                <div className="mb-1.5 flex items-baseline gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>{t("createChannel.people")}</span>
                  <span className="text-[11px] font-medium normal-case tracking-normal">
                    {filteredUsers.length}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {filteredUsers.map((u) => {
                    const selected = selectedUserIds.has(u.id);
                    return (
                      <InteractiveRow
                        key={u.id}
                        onClick={() => toggle(selectedUserIds, u.id, setSelectedUserIds)}
                        tone="subtle"
                        className="rounded-md px-2 py-1.5"
                      >
                        <InteractiveRowLeading>
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="h-7 w-7 shrink-0 rounded-full bg-secondary ring-1 ring-inset ring-black/5 dark:ring-white/10"
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
                              : // Empty-state checkbox needs to read as a
                                // visible rounded shape, not a ghost border.
                                // `border-input` alone was invisible on the
                                // Dialog's dark surface-2 card; add a
                                // translucent `foreground` tint so the box
                                // is clearly an affordance before the user
                                // hovers it.
                                "border-input bg-foreground/[0.04] dark:bg-foreground/[0.08]",
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
                <div className="mb-1.5 flex items-baseline gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>{t("createChannel.agents")}</span>
                  <span className="text-[11px] font-medium normal-case tracking-normal">
                    {filteredAgents.length}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {filteredAgents.map((a) => {
                    const selected = selectedAgentIds.has(a.id);
                    return (
                      <InteractiveRow
                        key={a.id}
                        onClick={() => toggle(selectedAgentIds, a.id, setSelectedAgentIds)}
                        tone="subtle"
                        className="rounded-md px-2 py-1.5"
                      >
                        <InteractiveRowLeading>
                          {a.avatar ? (
                            <img
                              src={a.avatar}
                              alt={a.name}
                              className="h-7 w-7 shrink-0 rounded-full bg-secondary ring-1 ring-inset ring-black/5 dark:ring-white/10"
                            />
                          ) : (
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary ring-1 ring-inset ring-black/5 dark:ring-white/10">
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
                              : // Empty-state checkbox needs to read as a
                                // visible rounded shape, not a ghost border.
                                // `border-input` alone was invisible on the
                                // Dialog's dark surface-2 card; add a
                                // translucent `foreground` tint so the box
                                // is clearly an affordance before the user
                                // hovers it.
                                "border-input bg-foreground/[0.04] dark:bg-foreground/[0.08]",
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
              <div className="py-6 text-center text-xs text-muted-foreground">
                {availableUsers.length === 0 && availableAgents.length === 0
                  ? t("addMembers.everyoneAlreadyIn", { name: channel.name })
                  : t("common.noMatches")}
              </div>
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleAdd} disabled={totalSelected === 0}>
            {totalSelected > 0
              ? t("addMembers.addWithCount", { count: String(totalSelected) })
              : t("common.add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
