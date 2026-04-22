import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  ConfirmDialog,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from "@nexu-design/ui-web";
import {
  ArrowUpRight,
  Brain,
  Check,
  Cpu,
  Info,
  Keyboard,
  Lightbulb,
  MousePointerClick,
  Pencil,
  Plus,
  ScrollText,
  Search,
  Sparkles,
  Sprout,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";

import { type TranslationKey, useT } from "@/i18n";
import { resolveRef } from "@/mock/data";
import { useMemoriesStore } from "@/stores/memories";
import type { Memory, MemoryKind, MemoryMethod } from "@/types";

const KIND_ORDER: MemoryKind[] = ["context", "decision", "preference", "fact"];

const kindIcons: Record<MemoryKind, React.ElementType> = {
  context: ScrollText,
  decision: Lightbulb,
  preference: Sparkles,
  fact: Brain,
};

/**
 * Tinted backgrounds for the kind icon swatch on the left of every memory row.
 * `decision` was previously `warning` (orange) which read as "danger" — switched to brand
 * (purple) to convey "important judgment" without alarm.
 */
const kindTint: Record<MemoryKind, string> = {
  context: "bg-info-subtle text-info",
  decision: "bg-brand-subtle text-brand-primary",
  preference: "bg-success-subtle text-success",
  fact: "bg-surface-2 text-text-muted",
};

const kindLabelKey: Record<MemoryKind, TranslationKey> = {
  context: "memory.kindContext",
  decision: "memory.kindDecision",
  preference: "memory.kindPreference",
  fact: "memory.kindFact",
};

const methodIcons: Record<MemoryMethod, React.ElementType> = {
  explicit: MousePointerClick,
  keyword: Keyboard,
  agent_auto: Cpu,
  seed: Sprout,
};

const methodLabelKey: Record<MemoryMethod, TranslationKey> = {
  explicit: "memory.methodExplicit",
  keyword: "memory.methodKeyword",
  agent_auto: "memory.methodAgentAuto",
  seed: "memory.methodSeed",
};

type SourceFilter = "all" | "user" | "agent";

type DateGroupKey = "today" | "yesterday" | "thisWeek" | "older";

const groupLabelKey: Record<DateGroupKey, TranslationKey> = {
  today: "memory.groupToday",
  yesterday: "memory.groupYesterday",
  thisWeek: "memory.groupThisWeek",
  older: "memory.groupOlder",
};

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function bucketOf(ts: number): DateGroupKey {
  const today = startOfDay(Date.now());
  const day = 24 * 60 * 60 * 1000;
  const target = startOfDay(ts);
  if (target === today) return "today";
  if (target === today - day) return "yesterday";
  if (target > today - day * 7) return "thisWeek";
  return "older";
}

function formatRelativeTime(
  ts: number,
  t: (key: TranslationKey, vars?: Record<string, string>) => string,
): string {
  const diff = Date.now() - ts;
  const min = 60_000;
  const hour = 60 * min;
  const day = 24 * hour;
  if (diff < min) return t("memory.justNow");
  if (diff < hour) return t("memory.minutesAgo", { count: String(Math.floor(diff / min)) });
  if (diff < day) return t("memory.hoursAgo", { count: String(Math.floor(diff / hour)) });
  if (diff < day * 7) return t("memory.daysAgo", { count: String(Math.floor(diff / day)) });
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface ChannelMemoryPanelProps {
  channelId: string;
  onJumpToMessage?: (messageId: string) => void;
}

export function ChannelMemoryPanel({
  channelId,
  onJumpToMessage,
}: ChannelMemoryPanelProps): ReactElement {
  const t = useT();
  const memories = useMemoriesStore((s) => s.memories);
  const addMemory = useMemoriesStore((s) => s.addMemory);
  const updateMemory = useMemoriesStore((s) => s.updateMemory);
  const removeMemory = useMemoriesStore((s) => s.removeMemory);

  const [composeOpen, setComposeOpen] = useState(false);
  const [draftKind, setDraftKind] = useState<MemoryKind>("context");
  const [draftContent, setDraftContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const channelMemories = useMemo(
    () => memories.filter((m) => m.channelId === channelId),
    [memories, channelId],
  );

  const trimmedQuery = query.trim().toLowerCase();

  const visible = useMemo(() => {
    let list = channelMemories;
    if (sourceFilter !== "all") {
      list = list.filter((m) => m.source === sourceFilter);
    }
    if (trimmedQuery) {
      list = list.filter((m) => {
        if (m.content.toLowerCase().includes(trimmedQuery)) return true;
        const author = resolveRef(
          m.source === "agent"
            ? { kind: "agent", id: m.authorId }
            : { kind: "user", id: m.authorId },
        );
        if (author?.name?.toLowerCase().includes(trimmedQuery)) return true;
        return false;
      });
    }
    return [...list].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [channelMemories, trimmedQuery, sourceFilter]);

  const grouped = useMemo(() => {
    const buckets: Record<DateGroupKey, Memory[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };
    for (const m of visible) buckets[bucketOf(m.updatedAt)].push(m);
    const order: DateGroupKey[] = ["today", "yesterday", "thisWeek", "older"];
    return order.filter((k) => buckets[k].length > 0).map((k) => ({ key: k, items: buckets[k] }));
  }, [visible]);

  const handleCreate = (): void => {
    const content = draftContent.trim();
    if (!content) return;
    addMemory({ channelId, kind: draftKind, content });
    setDraftContent("");
    setDraftKind("context");
    setComposeOpen(false);
  };

  const handleStartEdit = (m: Memory): void => {
    setEditingId(m.id);
    setEditDraft(m.content);
  };

  const handleSaveEdit = (id: string): void => {
    const next = editDraft.trim();
    if (next) updateMemory(id, { content: next });
    setEditingId(null);
    setEditDraft("");
  };

  const openSearch = (): void => {
    setSearchOpen(true);
    requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  const closeSearch = (): void => {
    setQuery("");
    setSearchOpen(false);
  };

  // Keep the search field expanded as long as there is a query, even after blur.
  useEffect(() => {
    if (query) setSearchOpen(true);
  }, [query]);

  const filterCounts: Record<SourceFilter, number> = {
    all: channelMemories.length,
    user: channelMemories.filter((m) => m.source === "user").length,
    agent: channelMemories.filter((m) => m.source === "agent").length,
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-6 py-3.5">
        <div className="flex min-w-0 items-center gap-2">
          <Brain className="size-4 shrink-0 text-text-muted" />
          <h2 className="text-sm font-semibold tracking-tight">{t("memory.title")}</h2>
          <span className="rounded-full bg-surface-2 px-1.5 text-[10px] font-semibold tabular-nums text-text-muted">
            {channelMemories.length}
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={t("memory.isolationNote")}
                className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-text-muted hover:bg-surface-2 hover:text-text-primary"
              >
                <Info className="size-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              className="w-[300px] p-3 text-xs text-text-secondary"
            >
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  {t("memory.isolationNote")}
                </div>
                <p className="mt-1 leading-relaxed text-text-muted">
                  {t("memory.isolationNoteTooltip")}
                </p>
              </div>
              <div className="mt-3 border-t border-border-subtle pt-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  {t("memory.howAddedTitle")}
                </div>
                <TriggerExplainList t={t} className="mt-2" />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {channelMemories.length > 0 ? (
            searchOpen ? (
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-text-muted" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") closeSearch();
                  }}
                  placeholder={t("memory.searchPlaceholder")}
                  className="h-8 w-56 rounded-md border border-border bg-background pl-7 pr-7 text-xs outline-none focus:border-brand-primary"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="absolute right-1.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded text-text-muted hover:bg-surface-2 hover:text-text-primary"
                  title={t("memory.clearSearch")}
                >
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-8"
                    onClick={openSearch}
                    aria-label={t("memory.search")}
                  >
                    <Search className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{t("memory.search")}</TooltipContent>
              </Tooltip>
            )
          ) : null}
          {!composeOpen ? (
            <Button
              type="button"
              size="sm"
              onClick={() => setComposeOpen(true)}
              className="h-8 px-3"
            >
              <Plus className="mr-1 size-3.5" />
              {t("memory.add")}
            </Button>
          ) : null}
        </div>
      </div>

      {channelMemories.length > 0 ? (
        <div className="flex items-center gap-1 border-b border-border-subtle px-6 py-2">
          <FilterChip
            label={t("memory.filterAll")}
            count={filterCounts.all}
            active={sourceFilter === "all"}
            onClick={() => setSourceFilter("all")}
          />
          <FilterChip
            label={t("memory.filterMine")}
            count={filterCounts.user}
            active={sourceFilter === "user"}
            onClick={() => setSourceFilter("user")}
          />
          <FilterChip
            label={t("memory.filterAgent")}
            count={filterCounts.agent}
            active={sourceFilter === "agent"}
            onClick={() => setSourceFilter("agent")}
          />
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-4">
          {composeOpen ? (
            <div className="mb-4 rounded-xl border border-border bg-card/60 p-4 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                {KIND_ORDER.map((k) => (
                  <KindChip
                    key={k}
                    kind={k}
                    active={draftKind === k}
                    onClick={() => setDraftKind(k)}
                    label={t(kindLabelKey[k])}
                  />
                ))}
              </div>
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                placeholder={t("memory.placeholder")}
                rows={3}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setComposeOpen(false);
                    setDraftContent("");
                  } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleCreate();
                  }
                }}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-primary"
              />
              <div className="mt-3 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setComposeOpen(false);
                    setDraftContent("");
                  }}
                >
                  {t("memory.cancel")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCreate}
                  disabled={!draftContent.trim()}
                >
                  {t("memory.save")}
                </Button>
              </div>
            </div>
          ) : null}

          {visible.length === 0 && trimmedQuery ? (
            <EmptyCard
              icon={<Search className="size-6 text-text-muted" />}
              title={t("memory.noResultsTitle")}
              desc={t("memory.noResultsDesc", { query })}
              action={
                <Button type="button" size="sm" variant="outline" onClick={closeSearch}>
                  {t("memory.clearSearch")}
                </Button>
              }
            />
          ) : visible.length === 0 ? (
            <EmptyCard
              icon={<Brain className="size-6 text-text-muted" />}
              title={t("memory.emptyTitle")}
              desc={t("memory.emptyDesc")}
              action={
                !composeOpen ? (
                  <Button type="button" size="sm" onClick={() => setComposeOpen(true)}>
                    <Plus className="mr-1 size-3.5" />
                    {t("memory.addFirst")}
                  </Button>
                ) : null
              }
              extra={
                <div className="mt-6 w-full max-w-sm rounded-lg border border-border-subtle bg-surface-2/40 p-3 text-left">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                    {t("memory.howAddedTitle")}
                  </div>
                  <TriggerExplainList t={t} className="mt-2" />
                </div>
              }
            />
          ) : (
            <div className="space-y-5">
              {grouped.map((group) => (
                <section key={group.key}>
                  <h3 className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                    {t(groupLabelKey[group.key])}
                  </h3>
                  <ul className="space-y-1.5">
                    {group.items.map((m) => (
                      <MemoryRow
                        key={m.id}
                        memory={m}
                        isEditing={editingId === m.id}
                        editDraft={editDraft}
                        onEditDraftChange={setEditDraft}
                        onStartEdit={handleStartEdit}
                        onCancelEdit={() => {
                          setEditingId(null);
                          setEditDraft("");
                        }}
                        onSaveEdit={() => handleSaveEdit(m.id)}
                        onDelete={() => removeMemory(m.id)}
                        onJumpToMessage={onJumpToMessage}
                        t={t}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MemoryRowProps {
  memory: Memory;
  isEditing: boolean;
  editDraft: string;
  onEditDraftChange: (next: string) => void;
  onStartEdit: (m: Memory) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
  onJumpToMessage?: (messageId: string) => void;
  t: (key: TranslationKey, vars?: Record<string, string>) => string;
}

function MemoryRow({
  memory: m,
  isEditing,
  editDraft,
  onEditDraftChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onJumpToMessage,
  t,
}: MemoryRowProps): ReactElement {
  const author = resolveRef(
    m.source === "agent"
      ? { kind: "agent", id: m.authorId }
      : { kind: "user", id: m.authorId },
  );
  const Icon = kindIcons[m.kind];
  const MIcon = methodIcons[m.method];
  const authorName = author?.name ?? t("memory.unknownAuthor");

  return (
    <li className="group/mem rounded-xl border border-border-subtle bg-card/40 px-3.5 py-2.5 transition-colors hover:bg-card/70">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md",
            kindTint[m.kind],
          )}
          title={t(kindLabelKey[m.kind])}
        >
          <Icon className="size-3.5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] text-text-muted">
            <Avatar className="size-4 rounded-full">
              {author?.avatar ? <AvatarImage src={author.avatar} alt="" /> : null}
              <AvatarFallback className="rounded-full bg-surface-2 text-[8px] font-semibold text-text-secondary">
                {initialsOf(authorName)}
              </AvatarFallback>
            </Avatar>
            <span className={cn("truncate", m.source === "agent" && "text-nexu-agent")}>
              {authorName}
            </span>
            <span className="text-text-tertiary">·</span>
            <span title={new Date(m.createdAt).toLocaleString()}>
              {formatRelativeTime(m.createdAt, t)}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="ml-0.5 inline-flex size-3.5 items-center justify-center text-text-tertiary"
                  aria-label={t(methodLabelKey[m.method])}
                >
                  <MIcon className="size-3" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">{t(methodLabelKey[m.method])}</TooltipContent>
            </Tooltip>
          </div>

          {isEditing ? (
            <div>
              <textarea
                value={editDraft}
                onChange={(e) => onEditDraftChange(e.target.value)}
                rows={3}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Escape") onCancelEdit();
                  else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    onSaveEdit();
                  }
                }}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-primary"
              />
              <div className="mt-2 flex items-center justify-end gap-1.5">
                <Button type="button" variant="ghost" size="sm" onClick={onCancelEdit}>
                  <X className="mr-1 size-3.5" />
                  {t("memory.cancel")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={onSaveEdit}
                  disabled={!editDraft.trim()}
                >
                  <Check className="mr-1 size-3.5" />
                  {t("memory.save")}
                </Button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-text-primary">
              {m.content}
            </p>
          )}
        </div>

        {!isEditing ? (
          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover/mem:opacity-100">
            {m.sourceMessageId && onJumpToMessage ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 text-text-muted hover:text-brand-primary"
                    onClick={() => onJumpToMessage(m.sourceMessageId as string)}
                    aria-label={t("memory.jumpToSource")}
                  >
                    <ArrowUpRight className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">{t("memory.jumpToSource")}</TooltipContent>
              </Tooltip>
            ) : null}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-7 text-text-muted hover:text-text-primary"
                  onClick={() => onStartEdit(m)}
                  aria-label={t("memory.edit")}
                >
                  <Pencil className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{t("memory.edit")}</TooltipContent>
            </Tooltip>
            <ConfirmDialog
              title={t("memory.deleteConfirmTitle")}
              description={t("memory.deleteConfirmDesc")}
              confirmLabel={t("memory.delete")}
              cancelLabel={t("memory.cancel")}
              confirmVariant="destructive"
              onConfirm={onDelete}
              trigger={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-7 text-text-muted hover:text-destructive"
                  aria-label={t("memory.delete")}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              }
            />
          </div>
        ) : null}
      </div>
    </li>
  );
}

interface EmptyCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action?: React.ReactNode;
  extra?: React.ReactNode;
}

function EmptyCard({ icon, title, desc, action, extra }: EmptyCardProps): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-surface-2">
        {icon}
      </div>
      <h3 className="mb-1 text-sm font-semibold">{title}</h3>
      <p className="mb-4 max-w-sm text-xs text-text-muted">{desc}</p>
      {action}
      {extra}
    </div>
  );
}

interface TriggerExplainListProps {
  t: (key: TranslationKey, vars?: Record<string, string>) => string;
  className?: string;
}

/**
 * Educational mini-list showing the three ways memories get created.
 * Used in the header info popover and in the empty-state hint card.
 */
function TriggerExplainList({ t, className }: TriggerExplainListProps): ReactElement {
  const rows: { method: MemoryMethod; descKey: TranslationKey }[] = [
    { method: "explicit", descKey: "memory.howAddedExplicit" },
    { method: "keyword", descKey: "memory.howAddedKeyword" },
    { method: "agent_auto", descKey: "memory.howAddedAgentAuto" },
  ];
  return (
    <ul className={cn("space-y-2", className)}>
      {rows.map(({ method, descKey }) => {
        const Icon = methodIcons[method];
        return (
          <li key={method} className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-surface-2 text-text-secondary">
              <Icon className="size-3" />
            </span>
            <div className="min-w-0 flex-1 leading-snug">
              <div className="text-[11.5px] font-semibold text-text-primary">
                {t(methodLabelKey[method])}
              </div>
              <div className="text-[11px] text-text-muted">{t(descKey)}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

interface FilterChipProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function FilterChip({ label, count, active, onClick }: FilterChipProps): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-md px-2 text-[11px] font-medium transition-colors",
        active
          ? "bg-brand-subtle text-brand-primary"
          : "text-text-muted hover:bg-surface-2 hover:text-text-primary",
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "rounded-sm px-1 text-[10px] tabular-nums",
          active ? "text-brand-primary/70" : "text-text-tertiary",
        )}
      >
        {count}
      </span>
    </button>
  );
}

interface KindChipProps {
  kind: MemoryKind;
  active: boolean;
  label: string;
  onClick: () => void;
}

function KindChip({ kind, active, label, onClick }: KindChipProps): ReactElement {
  const Icon = kindIcons[kind];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium transition-colors",
        active
          ? "border-transparent bg-brand-primary text-accent-fg"
          : "border-border text-text-muted hover:bg-surface-2/60 hover:text-text-primary",
      )}
    >
      <Icon className="size-3" />
      {label}
    </button>
  );
}

// SourceFilter is exported via type for filter-chip helpers.
export type { SourceFilter };
