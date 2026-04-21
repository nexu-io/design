import type { ContentBlock } from "@/types";
import {
  Button,
  FileAttachment,
  ImageAttachment,
  ImageGallery,
  TopicCard,
  VideoAttachment,
  VoiceMessage,
  cn,
} from "@nexu-design/ui-web";
import type { FileAttachmentKind } from "@nexu-design/ui-web";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  FileCode2,
  GitPullRequestArrow,
  Loader2,
  ShieldQuestion,
  Terminal,
  XCircle,
} from "lucide-react";
import { useState } from "react";

/**
 * Content-block props.
 *
 * Two "expansion" callbacks live side-by-side on purpose:
 *
 * - `onExpand` routes heavy/ephemeral content (code, diff, image) into a
 *   fullscreen modal overlay. The reader briefly leaves the chat context
 *   to inspect a payload and then returns.
 *
 * - `onTopicOpen` routes *topic cards* into the persistent right-side
 *   detail panel. A topic is a tracked thread, not a blob to preview, so
 *   it stays in-flow next to the message list and pushes the chat
 *   (never overlays). These are semantically different interactions and
 *   must not be multiplexed through the same callback.
 */
interface ContentBlockRendererProps {
  block: ContentBlock;
  onApprovalAction?: (id: string, action: "approved" | "rejected") => void;
  onExpand?: (block: ContentBlock) => void;
  onTopicOpen?: (block: Extract<ContentBlock, { type: "topic" }>) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function kindFromMime(mimeType?: string, name?: string): FileAttachmentKind {
  if (mimeType?.startsWith("image/")) return "media";
  if (mimeType?.startsWith("video/") || mimeType?.startsWith("audio/")) return "media";
  if (
    mimeType?.includes("zip") ||
    mimeType?.includes("archive") ||
    /\.(zip|tar|gz)$/i.test(name ?? "")
  )
    return "archive";
  if (mimeType?.includes("spreadsheet") || /\.(csv|xlsx?)$/i.test(name ?? "")) return "sheet";
  if (mimeType?.startsWith("text/") || /\.(ts|tsx|js|jsx|py|rs|go|sh|log)$/i.test(name ?? ""))
    return "code";
  return "doc";
}

function fileExtension(name: string): string | undefined {
  const idx = name.lastIndexOf(".");
  if (idx <= 0 || idx === name.length - 1) return undefined;
  return name.slice(idx + 1).toLowerCase();
}

interface IndexedItem<T> {
  key: string;
  value: T;
  lineNumber: number;
}

function createIndexedItems<T>(items: T[], keyOf: (item: T) => string): IndexedItem<T>[] {
  const occurrences = new Map<string, number>();
  const indexed: IndexedItem<T>[] = [];
  let lineNumber = 0;

  for (const item of items) {
    lineNumber += 1;
    const base = keyOf(item);
    const count = (occurrences.get(base) ?? 0) + 1;
    occurrences.set(base, count);
    indexed.push({ key: `${base}:${count}`, value: item, lineNumber });
  }

  return indexed;
}

function ImageBlock({
  block,
  onExpand,
}: { block: Extract<ContentBlock, { type: "image" }>; onExpand?: () => void }): React.ReactElement {
  return (
    <ImageAttachment
      src={block.url}
      alt={block.alt ?? ""}
      width={360}
      height={220}
      onSelect={onExpand}
      caption={block.alt}
    />
  );
}

function FileBlock({
  block,
}: { block: Extract<ContentBlock, { type: "file" }> }): React.ReactElement {
  const ext = fileExtension(block.name);
  const meta = ext ? `${formatFileSize(block.size)} · ${ext}` : formatFileSize(block.size);

  return (
    <FileAttachment
      name={block.name}
      meta={meta}
      kind={kindFromMime(block.mimeType, block.name)}
      onClick={() => {
        if (block.url) window.open(block.url, "_blank", "noopener,noreferrer");
      }}
    />
  );
}

function GalleryBlock({
  block,
}: { block: Extract<ContentBlock, { type: "gallery" }> }): React.ReactElement {
  return (
    <ImageGallery
      images={block.images.map((img) => ({ src: img.url, alt: img.alt }))}
      onSelect={() => {
        /* TODO: open in ContentDetailOverlay; gallery expansion is not yet wired up. */
      }}
    />
  );
}

function VideoBlock({
  block,
}: { block: Extract<ContentBlock, { type: "video" }> }): React.ReactElement {
  return (
    <VideoAttachment
      thumbnail={block.thumbnail}
      duration={block.duration}
      title={block.title}
      meta={block.size ? formatFileSize(block.size) : undefined}
      onClick={() => {
        if (block.url) window.open(block.url, "_blank", "noopener,noreferrer");
      }}
    />
  );
}

function VoiceBlock({
  block,
}: { block: Extract<ContentBlock, { type: "voice" }> }): React.ReactElement {
  return (
    <VoiceMessage
      duration={block.duration}
      transcript={block.transcript}
      waveform={block.waveform}
    />
  );
}

function TopicBlock({
  block,
  onOpen,
}: {
  block: Extract<ContentBlock, { type: "topic" }>;
  onOpen?: () => void;
}): React.ReactElement {
  return (
    <TopicCard
      className="max-w-[640px]"
      title={block.title}
      author={block.author}
      status={block.status}
      lastActivity={block.lastActivity}
      replies={block.replies}
      participants={block.participants}
      preview={block.preview}
      onClick={onOpen}
      assignee={
        block.assignee
          ? {
              name: block.assignee.name,
              isAgent: block.assignee.isAgent,
              accent: block.assignee.accent,
            }
          : undefined
      }
    />
  );
}

/**
 * Collapsed one-line row shared by code + diff blocks.
 *
 * Chat keeps to a minimal, Cursor-style affordance — a single pill that names
 * the artifact and hints at its weight; clicking opens the full content in the
 * overlay. Long code dumps are never inlined into the message stream because
 * they break the reading rhythm for everyone not actively reviewing the code.
 */
function CollapsedContentRow({
  icon,
  primary,
  meta,
  onClick,
}: {
  icon: React.ReactNode;
  primary: React.ReactNode;
  meta?: React.ReactNode;
  onClick?: () => void;
}): React.ReactElement {
  const interactive = typeof onClick === "function";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      className={cn(
        "flex w-full max-w-[640px] items-center gap-2.5 rounded-lg border border-border-subtle bg-surface-1 px-3 py-2 text-left transition-colors",
        interactive && "cursor-pointer hover:bg-surface-2",
      )}
    >
      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-surface-2 text-text-muted">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-text-heading">
        {primary}
      </span>
      {meta ? (
        <span className="shrink-0 text-[11px] text-text-muted tabular-nums">{meta}</span>
      ) : null}
    </button>
  );
}

function CodeBlock({
  block,
  onExpand,
}: {
  block: Extract<ContentBlock, { type: "code" }>;
  onExpand?: () => void;
}): React.ReactElement {
  const lineCount = block.code.split("\n").length;
  const primary = block.filename ?? `${block.language ?? "code"} snippet`;
  const meta = `${lineCount} line${lineCount === 1 ? "" : "s"}`;

  return (
    <CollapsedContentRow
      icon={<FileCode2 className="size-3.5" />}
      primary={primary}
      meta={meta}
      onClick={onExpand}
    />
  );
}

function ActionCard({
  block,
}: { block: Extract<ContentBlock, { type: "action" }> }): React.ReactElement {
  return (
    <div
      className={cn(
        "flex w-full max-w-[640px] items-start gap-3 rounded-xl border bg-surface-1 px-3.5 py-3 transition-colors",
        block.status === "running" && "border-info/25 bg-info-subtle/40",
        block.status === "success" && "border-success/25 bg-success-subtle/40",
        block.status === "failed" && "border-error/25 bg-error-subtle/40",
      )}
    >
      <div className="mt-0.5 shrink-0">
        {block.status === "running" && <Loader2 className="size-4 animate-spin text-info" />}
        {block.status === "success" && <CheckCircle2 className="size-4 text-success" />}
        {block.status === "failed" && <XCircle className="size-4 text-error" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium leading-snug text-text-heading">{block.title}</p>
        {block.description && (
          <p className="mt-0.5 text-[12px] leading-relaxed text-text-secondary">
            {block.description}
          </p>
        )}
        {block.tool && (
          <div className="mt-2 flex items-center gap-1.5">
            <Terminal className="size-3 text-text-muted" />
            <span className="font-mono text-[10px] text-text-muted">{block.tool}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolResultBlock({
  block,
}: { block: Extract<ContentBlock, { type: "tool-result" }> }): React.ReactElement {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full max-w-[640px] overflow-hidden rounded-lg border border-border-subtle bg-surface-1">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-surface-2"
      >
        <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-surface-2 text-text-muted">
          <Terminal className="size-3.5" />
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-text-heading">
          {block.tool}
        </span>
        {block.status === "success" ? (
          <CheckCircle2 className="size-3.5 shrink-0 text-success" />
        ) : (
          <XCircle className="size-3.5 shrink-0 text-error" />
        )}
        {expanded ? (
          <ChevronDown className="size-3.5 shrink-0 text-text-muted" />
        ) : (
          <ChevronRight className="size-3.5 shrink-0 text-text-muted" />
        )}
      </button>
      {expanded && (
        <div className="border-t border-border-subtle bg-[#0d1117]">
          {block.input && (
            <div className="px-3.5 pt-3 pb-2">
              <p className="mb-1.5 font-medium text-[10px] uppercase tracking-widest text-white/20">
                Input
              </p>
              <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-white/50">
                {block.input}
              </pre>
            </div>
          )}
          <div
            className={cn(
              "px-3.5 pb-3",
              block.input ? "border-t border-white/[0.04] pt-1" : "pt-3",
            )}
          >
            <p className="mb-1.5 font-medium text-[10px] uppercase tracking-widest text-white/20">
              Output
            </p>
            <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-white/70">
              {block.output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function DiffBlock({
  block,
  onExpand,
}: { block: Extract<ContentBlock, { type: "diff" }>; onExpand?: () => void }): React.ReactElement {
  return (
    <CollapsedContentRow
      icon={<GitPullRequestArrow className="size-3.5" />}
      primary={block.filename}
      meta={
        <span className="inline-flex items-center gap-1.5">
          <span className="text-success">+{block.additions}</span>
          <span className="text-error">-{block.deletions}</span>
        </span>
      }
      onClick={onExpand}
    />
  );
}

function ApprovalBlock({
  block,
  onAction,
}: {
  block: Extract<ContentBlock, { type: "approval" }>;
  onAction?: (id: string, action: "approved" | "rejected") => void;
}): React.ReactElement {
  return (
    <div
      className={cn(
        "w-full max-w-[640px] rounded-xl border bg-surface-1 px-4 py-3.5",
        block.status === "pending" && "border-warning/25 bg-warning-subtle/40",
        block.status === "approved" && "border-success/25 bg-success-subtle/40",
        block.status === "rejected" && "border-error/25 bg-error-subtle/40",
      )}
    >
      <div className="flex items-start gap-2.5">
        <ShieldQuestion
          className={cn(
            "mt-0.5 size-[18px] shrink-0",
            block.status === "pending" && "text-warning",
            block.status === "approved" && "text-success",
            block.status === "rejected" && "text-error",
          )}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-snug text-text-heading">{block.title}</p>
          {block.description && (
            <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">
              {block.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 border-t border-border-subtle pt-3">
        {block.status === "pending" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onAction?.(block.id, "approved")}
              leadingIcon={<CheckCircle2 className="size-3.5" />}
              className="flex-1"
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAction?.(block.id, "rejected")}
              leadingIcon={<XCircle className="size-3.5" />}
              className="flex-1 hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
            >
              Reject
            </Button>
          </div>
        )}
        {block.status === "approved" && (
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-success">
            <CheckCircle2 className="size-3.5" />
            Approved
          </div>
        )}
        {block.status === "rejected" && (
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-error">
            <XCircle className="size-3.5" />
            Rejected
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressBlock({
  block,
}: { block: Extract<ContentBlock, { type: "progress" }> }): React.ReactElement {
  const isDone = block.current >= block.total;
  const indexedSteps = block.steps
    ? createIndexedItems(block.steps, (step) => `${step.label}-${step.status}`)
    : [];

  return (
    <div className="w-full max-w-[640px] rounded-xl border border-border-subtle bg-surface-1 px-4 py-3.5">
      {/*
       * Header — title + compact "X of Y" counter instead of a percentage bar.
       * Rendering progress as a list of checklist-style steps (Cursor style)
       * makes the individual substeps the primary readout; a duplicate bar or
       * big percentage competes with that. The counter keeps completion
       * legible at a glance without an extra color surface.
       */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-text-heading">{block.title}</p>
        <span
          className={cn(
            "font-mono text-[11px] font-medium tabular-nums",
            isDone ? "text-success" : "text-text-muted",
          )}
        >
          {block.current} / {block.total}
        </span>
      </div>

      {block.steps && block.steps.length > 0 && (
        <ul className="mt-3 flex flex-col gap-3">
          {indexedSteps.map(({ key, value: step }) => (
            <li key={key} className="flex items-center gap-2.5">
              {/*
               * Monochrome step icons (Cursor style) — no status colors here
               * because the label styling (strikethrough + muted / bold /
               * tertiary) already communicates state. Keeps the card quiet in
               * a busy chat feed.
               * - done:    Check glyph, muted
               * - active:  spinner, heading color
               * - pending: empty circle, tertiary color
               */}
              {step.status === "done" && (
                <Check
                  aria-hidden="true"
                  strokeWidth={2.75}
                  className="size-3.5 shrink-0 text-text-muted"
                />
              )}
              {step.status === "active" && (
                <Loader2
                  aria-hidden="true"
                  className="size-3.5 shrink-0 animate-spin text-text-heading"
                />
              )}
              {step.status === "pending" && (
                <Circle
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-3.5 shrink-0 text-text-tertiary"
                />
              )}
              <span
                className={cn(
                  "text-[12px] leading-none",
                  step.status === "done" && "text-text-muted line-through",
                  step.status === "active" && "font-medium text-text-heading",
                  step.status === "pending" && "text-text-tertiary",
                )}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ContentBlockRenderer({
  block,
  onApprovalAction,
  onExpand,
  onTopicOpen,
}: ContentBlockRendererProps): React.ReactElement {
  const handleExpand = (): void => onExpand?.(block);

  switch (block.type) {
    case "image":
      return <ImageBlock block={block} onExpand={handleExpand} />;
    case "gallery":
      return <GalleryBlock block={block} />;
    case "video":
      return <VideoBlock block={block} />;
    case "voice":
      return <VoiceBlock block={block} />;
    case "file":
      return <FileBlock block={block} />;
    case "code":
      return <CodeBlock block={block} onExpand={handleExpand} />;
    case "action":
      return <ActionCard block={block} />;
    case "tool-result":
      return <ToolResultBlock block={block} />;
    case "diff":
      return <DiffBlock block={block} onExpand={handleExpand} />;
    case "approval":
      return <ApprovalBlock block={block} onAction={onApprovalAction} />;
    case "progress":
      return <ProgressBlock block={block} />;
    case "topic":
      return (
        <TopicBlock block={block} onOpen={onTopicOpen ? () => onTopicOpen(block) : undefined} />
      );
  }
}
