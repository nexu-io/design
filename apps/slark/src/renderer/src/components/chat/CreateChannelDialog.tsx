import { useState, useEffect, useRef, useMemo } from "react";
import { Hash, X, ArrowLeft, Search, Check, Bot } from "lucide-react";
import { useT } from "@/i18n";
import { useChatStore } from "@/stores/chat";
import { useAgentsStore } from "@/stores/agents";
import { mockUsers, mockAgents } from "@/mock/data";
import type { Channel, MemberRef } from "@/types";
import { cn } from "@/lib/utils";

interface CreateChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (channelId: string) => void;
}

type Step = "details" | "members";

export function CreateChannelDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateChannelDialogProps): React.ReactElement | null {
  const t = useT();
  const addChannel = useChatStore((s) => s.addChannel);
  const storeAgents = useAgentsStore((s) => s.agents);
  // Fallback to mockAgents if the agents store hasn't been hydrated yet —
  // Create Channel can be opened before the Agents tab has mounted.
  const agents = storeAgents.length > 0 ? storeAgents : mockAgents;

  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    () => new Set(mockUsers.map((u) => u.id)),
  );
  const [selectedAgentIds, setSelectedAgentIds] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setStep("details");
    setName("");
    setDescription("");
    setQuery("");
    setSelectedUserIds(new Set(mockUsers.map((u) => u.id)));
    setSelectedAgentIds(new Set(agents.map((a) => a.id)));
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open, agents]);

  useEffect(() => {
    if (step === "members") {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [step]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockUsers;
    return mockUsers.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [query]);

  const filteredAgents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter(
      (a) => a.name.toLowerCase().includes(q) || (a.description ?? "").toLowerCase().includes(q),
    );
  }, [query, agents]);

  if (!open) return null;

  const toggleUser = (id: string): void => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAgent = (id: string): void => {
    setSelectedAgentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalSelected = selectedUserIds.size + selectedAgentIds.size;

  const handleNext = (): void => {
    if (!name.trim()) return;
    setStep("members");
  };

  const handleBack = (): void => setStep("details");

  const handleCreate = (): void => {
    const trimmed = name.trim().toLowerCase().replace(/\s+/g, "-");
    if (!trimmed) return;

    const members: MemberRef[] = [
      ...Array.from(selectedUserIds).map((id): MemberRef => ({ kind: "user", id })),
      ...Array.from(selectedAgentIds).map((id): MemberRef => ({ kind: "agent", id })),
    ];

    const channel: Channel = {
      id: `ch-${Date.now()}`,
      name: trimmed,
      description: description.trim() || undefined,
      type: "channel",
      members,
      lastMessageAt: Date.now(),
      unreadCount: 0,
      createdAt: Date.now(),
    };

    const id = channel.id;
    addChannel(channel);
    onOpenChange(false);
    setTimeout(() => onCreated?.(id), 0);
  };

  const handleDetailsKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" && !e.shiftKey && name.trim()) {
      e.preventDefault();
      handleNext();
    }
    if (e.key === "Escape") onOpenChange(false);
  };

  const handleOverlayClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) onOpenChange(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") onOpenChange(false);
      }}
    >
      <div className="w-[440px] rounded-xl border border-border bg-background text-foreground p-0 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-1">
          <div className="flex items-center gap-2">
            {step === "members" && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title={t("common.back")}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <h2 className="text-base font-semibold text-foreground">
              {step === "details" ? t("createChannel.title") : t("createChannel.addMembers")}
            </h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-5 pt-2 pb-1">
          <div className="flex items-center gap-1.5">
            <div className={cn("h-1 flex-1 rounded-full transition-colors", "bg-foreground")} />
            <div
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                step === "members" ? "bg-foreground" : "bg-secondary",
              )}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("createChannel.stepOfTwo", { step: String(step === "details" ? 1 : 2) })}
            {step === "details"
              ? t("createChannel.detailsSuffix")
              : totalSelected === 1
                ? t("createChannel.membersSuffix", { count: String(totalSelected) })
                : t("createChannel.membersSuffixPlural", { count: String(totalSelected) })}
          </p>
        </div>

        {step === "details" ? (
          <>
            <div className="px-5 py-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t("createChannel.nameLabel")}</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleDetailsKeyDown}
                    placeholder={t("createChannel.namePlaceholder")}
                    className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  {t("createChannel.descLabel")}{" "}
                  <span className="text-muted-foreground font-normal">
                    {t("createChannel.optional")}
                  </span>
                </label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={handleDetailsKeyDown}
                  placeholder={t("createChannel.descPlaceholder")}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 px-5 pb-5">
              <button
                onClick={() => onOpenChange(false)}
                className="h-8 px-3 rounded-md text-sm border border-border hover:bg-accent transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleNext}
                disabled={!name.trim()}
                className="h-8 px-4 rounded-md text-sm font-medium bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                {t("common.next")}
              </button>
            </div>
          </>
        ) : (
          <>
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

              <div className="max-h-[320px] overflow-y-auto -mx-1 px-1">
                {filteredUsers.length === 0 && filteredAgents.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    {t("common.noMatches")}
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {filteredUsers.map((u) => {
                      const selected = selectedUserIds.has(u.id);
                      return (
                        <button
                          key={`u-${u.id}`}
                          onClick={() => toggleUser(u.id)}
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

                    {filteredAgents.map((a) => {
                      const selected = selectedAgentIds.has(a.id);
                      return (
                        <button
                          key={`a-${a.id}`}
                          onClick={() => toggleAgent(a.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-left transition-colors",
                            selected ? "bg-accent/60" : "hover:bg-accent",
                          )}
                        >
                          <div className="relative h-7 w-7 shrink-0">
                            {a.avatar ? (
                              <img
                                src={a.avatar}
                                alt={a.name}
                                className="h-7 w-7 rounded-md bg-secondary"
                              />
                            ) : (
                              <div className="h-7 w-7 rounded-md bg-secondary flex items-center justify-center">
                                <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
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
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 px-5 pb-5 pt-1">
              <button
                onClick={handleBack}
                className="h-8 px-3 rounded-md text-sm border border-border hover:bg-accent transition-colors"
              >
                {t("common.back")}
              </button>
              <button
                onClick={handleCreate}
                className="h-8 px-4 rounded-md text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                {t("createChannel.createCta")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
