import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Check, ChevronDown, Hash, Search } from "lucide-react";
import {
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
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from "@nexu-design/ui-web";

import { mockAgents, mockUsers } from "@/mock/data";
import { useAgentsStore } from "@/stores/agents";
import { useChatStore } from "@/stores/chat";
import type { Channel, MemberRef } from "@/types";

interface CreateChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (channelId: string) => void;
}

/*
 * Single-step "Create channel" dialog.
 *
 * Top: name (required) + description (optional).
 * Bottom: a member-picker trigger that looks like an Input; clicking opens
 * a Popover dropdown with search + People / Agents groups. Defaults to
 * everyone selected so the straight-through path still yields a fully-
 * populated channel. The Popover keeps the dialog at a fixed, compact
 * height — no inline expansion.
 *
 * Copy is hardcoded English on purpose — this product surface is English-only.
 */
export function CreateChannelDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateChannelDialogProps): React.ReactElement {
  const addChannel = useChatStore((s) => s.addChannel);
  const storeAgents = useAgentsStore((s) => s.agents);
  const agents = storeAgents.length > 0 ? storeAgents : mockAgents;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(() => new Set());
  const [selectedAgentIds, setSelectedAgentIds] = useState<Set<string>>(() => new Set());
  const [membersOpen, setMembersOpen] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    setName("");
    setDescription("");
    setQuery("");
    setSelectedUserIds(new Set(mockUsers.map((u) => u.id)));
    setSelectedAgentIds(new Set(agents.map((a) => a.id)));
    setMembersOpen(false);

    requestAnimationFrame(() => nameInputRef.current?.focus());
  }, [open, agents]);

  const q = query.trim().toLowerCase();
  const filteredUsers = useMemo(() => {
    if (!q) return mockUsers;
    return mockUsers.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [q]);
  const filteredAgents = useMemo(() => {
    if (!q) return agents;
    return agents.filter(
      (a) => a.name.toLowerCase().includes(q) || (a.description ?? "").toLowerCase().includes(q),
    );
  }, [agents, q]);

  const toggle = (set: Set<string>, id: string, setter: (s: Set<string>) => void): void => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  };

  const totalSelected = selectedUserIds.size + selectedAgentIds.size;
  const canCreate = name.trim().length > 0 && totalSelected > 0;

  const previewAvatars = useMemo(() => {
    const userAvatars = mockUsers
      .filter((u) => selectedUserIds.has(u.id))
      .map((u) => ({ kind: "user" as const, src: u.avatar, alt: u.name }));
    const agentAvatars = agents
      .filter((a) => selectedAgentIds.has(a.id))
      .map((a) => ({ kind: "agent" as const, src: a.avatar, alt: a.name }));
    return [...userAvatars, ...agentAvatars].slice(0, 4);
  }, [agents, selectedAgentIds, selectedUserIds]);

  const handleCreate = (): void => {
    if (!canCreate) return;

    const trimmedName = name.trim().toLowerCase().replace(/\s+/g, "-");

    const members: MemberRef[] = [
      ...Array.from(selectedUserIds).map((id): MemberRef => ({ kind: "user", id })),
      ...Array.from(selectedAgentIds).map((id): MemberRef => ({ kind: "agent", id })),
    ];

    const channel: Channel = {
      id: `ch-${Date.now()}`,
      name: trimmedName,
      description: description.trim() || undefined,
      type: "channel",
      members,
      lastMessageAt: Date.now(),
      unreadCount: 0,
      createdAt: Date.now(),
    };

    addChannel(channel);
    onOpenChange(false);
    setTimeout(() => onCreated?.(channel.id), 0);
  };

  const handleDetailsKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === "Enter" && !event.shiftKey && canCreate && !membersOpen) {
      event.preventDefault();
      handleCreate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" className="w-[460px] max-w-[calc(100vw-2rem)] overflow-hidden">
        <DialogHeader className="min-w-0">
          <DialogTitle>Create channel</DialogTitle>
        </DialogHeader>

        <DialogBody className="min-w-0 space-y-4">
          <FormField label="Name">
            <FormFieldControl>
              <Input
                ref={nameInputRef}
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={handleDetailsKeyDown}
                placeholder="e.g. design-review"
                leadingIcon={<Hash className="size-4" />}
              />
            </FormFieldControl>
          </FormField>

          <FormField
            label={
              <span>
                Description <span className="font-normal text-text-muted">(optional)</span>
              </span>
            }
          >
            <FormFieldControl>
              <Input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                onKeyDown={handleDetailsKeyDown}
                placeholder="What's this channel about?"
              />
            </FormFieldControl>
          </FormField>

          <FormField label="Select members">
            <FormFieldControl>
              <Popover open={membersOpen} onOpenChange={setMembersOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg border border-input bg-surface-0 px-3 py-2 text-left transition-colors hover:border-border-hover data-[state=open]:border-accent data-[state=open]:ring-2 data-[state=open]:ring-accent/20"
                  >
                    {previewAvatars.length > 0 ? (
                      <div className="flex shrink-0 -space-x-1.5">
                        {previewAvatars.map((a, i) =>
                          a.src ? (
                            <img
                              key={`${a.kind}-${i}`}
                              src={a.src}
                              alt=""
                              className="h-5 w-5 rounded-full object-cover bg-secondary ring-2 ring-surface-0"
                            />
                          ) : (
                            <div
                              key={`${a.kind}-${i}`}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary ring-2 ring-surface-0"
                            >
                              <Bot className="h-3 w-3 text-muted-foreground" />
                            </div>
                          ),
                        )}
                      </div>
                    ) : null}
                    <span className="flex-1 truncate text-sm">
                      {totalSelected > 0 ? (
                        <>
                          {totalSelected} selected
                          <span className="text-muted-foreground">
                            {" "}
                            · {selectedUserIds.size} people, {selectedAgentIds.size} agents
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Add people and agents</span>
                      )}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform",
                        membersOpen && "rotate-180",
                      )}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  align="start"
                  sideOffset={6}
                  avoidCollisions={false}
                  className="w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] p-2"
                  onOpenAutoFocus={(event) => event.preventDefault()}
                >
                  <Input
                    size="sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search people and agents"
                    leadingIcon={<Search className="size-3.5 text-muted-foreground" />}
                  />

                  <div className="mt-2 max-h-[220px] space-y-3 overflow-y-auto">
                    {filteredUsers.length > 0 && (
                      <section>
                        <div className="mb-1 flex items-baseline gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          <span>People</span>
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
                                  <div className="truncate text-sm">{u.name}</div>
                                  <div className="truncate text-xs text-muted-foreground">
                                    {u.email}
                                  </div>
                                </InteractiveRowContent>
                                <InteractiveRowTrailing
                                  className={cn(
                                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                                    selected
                                      ? "border-foreground bg-foreground text-background"
                                      : "border-input",
                                  )}
                                >
                                  {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                                </InteractiveRowTrailing>
                              </InteractiveRow>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    {filteredAgents.length > 0 && (
                      <section>
                        <div className="mb-1 flex items-baseline gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          <span>Agents</span>
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
                                  <div className="truncate text-sm">{a.name}</div>
                                  {a.description && (
                                    <div className="truncate text-xs text-muted-foreground">
                                      {a.description}
                                    </div>
                                  )}
                                </InteractiveRowContent>
                                <InteractiveRowTrailing
                                  className={cn(
                                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                                    selected
                                      ? "border-foreground bg-foreground text-background"
                                      : "border-input",
                                  )}
                                >
                                  {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                                </InteractiveRowTrailing>
                              </InteractiveRow>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    {filteredUsers.length === 0 && filteredAgents.length === 0 && (
                      <div className="py-6 text-center text-xs text-muted-foreground">
                        No matches
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </FormFieldControl>
          </FormField>
        </DialogBody>

        <DialogFooter className="min-w-0 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!canCreate}>
            Create channel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
