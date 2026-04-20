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
  Copy,
  GitPullRequestArrow,
  Loader2,
  ShieldQuestion,
  Terminal,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface ContentBlockRendererProps {
  block: ContentBlock;
  isMe: boolean;
  onApprovalAction?: (id: string, action: "approved" | "rejected") => void;
  onExpand?: (block: ContentBlock) => void;
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
      width={320}
      height={200}
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
}: { block: Extract<ContentBlock, { type: "topic" }> }): React.ReactElement {
  return (
    <TopicCard
      title={block.title}
      author={block.author}
      status={block.status}
      lastActivity={block.lastActivity}
      replies={block.replies}
      participants={block.participants}
      preview={block.preview}
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

const CODE_PREVIEW_LINES = 8;

function CodeBlock({
  block,
  isMe,
  onExpand,
}: {
  block: Extract<ContentBlock, { type: "code" }>;
  isMe: boolean;
  onExpand?: () => void;
}): React.ReactElement {
  const [copied, setCopied] = useState(false);
  const lines = block.code.split("\n");
  const isTruncated = lines.length > CODE_PREVIEW_LINES;
  const previewCode = isTruncated ? lines.slice(0, CODE_PREVIEW_LINES).join("\n") : block.code;

  const handleCopy = (e: React.MouseEvent): void => {
    e.stopPropagation();
    navigator.clipboard.writeText(block.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden min-w-[280px] max-w-[480px]",
        isMe ? "bg-black/30" : "bg-[#0d1117]",
        onExpand && "cursor-pointer",
      )}
      onClick={onExpand}
      role={onExpand ? "button" : undefined}
      tabIndex={onExpand ? 0 : undefined}
      onKeyDown={
        onExpand
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onExpand();
              }
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between h-8 px-3 bg-white/[0.03] border-b border-white/[0.05]">
        <div className="flex items-center gap-2 min-w-0">
          {block.filename && (
            <span className="text-[11px] text-white/40 font-mono truncate">{block.filename}</span>
          )}
          {block.language && !block.filename && (
            <span className="text-[11px] text-white/40 font-mono">{block.language}</span>
          )}
          {block.language && block.filename && (
            <span className="text-[10px] text-white/20 font-mono">{block.language}</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-3">
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleCopy}
            className={cn(
              "h-auto px-0 py-0 flex items-center gap-1 text-[11px] transition-colors",
              copied ? "text-green-400" : "text-white/25 hover:text-white/60",
            )}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          {isTruncated && (
            <span className="text-[10px] text-white/20 ml-1">{lines.length} lines</span>
          )}
        </div>
      </div>
      <pre className="p-3 overflow-x-auto">
        <code className="text-[12px] font-mono text-white/80 leading-[1.65]">{previewCode}</code>
      </pre>
      {isTruncated && (
        <div className="flex items-center justify-center h-7 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/95 to-transparent -mt-4 relative z-10">
          <span className="text-[11px] text-white/30">Click to see all {lines.length} lines</span>
        </div>
      )}
    </div>
  );
}

function ActionCard({
  block,
}: { block: Extract<ContentBlock, { type: "action" }> }): React.ReactElement {
  return (
    <div
      className={cn(
        "flex items-start gap-3 w-[320px] px-3.5 py-3 rounded-xl border transition-colors",
        block.status === "running" && "border-blue-500/15 bg-blue-500/[0.04]",
        block.status === "success" && "border-green-500/15 bg-green-500/[0.04]",
        block.status === "failed" && "border-red-500/15 bg-red-500/[0.04]",
      )}
    >
      <div className="mt-0.5 shrink-0">
        {block.status === "running" && <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />}
        {block.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-400" />}
        {block.status === "failed" && <XCircle className="h-4 w-4 text-red-400" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium leading-snug">{block.title}</p>
        {block.description && (
          <p className="text-[12px] text-muted-foreground/70 mt-0.5 leading-relaxed">
            {block.description}
          </p>
        )}
        {block.tool && (
          <div className="flex items-center gap-1.5 mt-2">
            <Terminal className="h-3 w-3 text-muted-foreground/40" />
            <span className="text-[10px] font-mono text-muted-foreground/50">{block.tool}</span>
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
    <div className="w-[360px] rounded-xl overflow-hidden border border-white/[0.06]">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "h-auto flex items-center gap-2.5 w-full px-3.5 py-2.5 text-left justify-start transition-colors rounded-none",
          "bg-white/[0.03] hover:bg-white/[0.06]",
        )}
      >
        <div className="shrink-0">
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/50" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          )}
        </div>
        <Terminal className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
        <span className="text-[12px] font-mono font-medium truncate flex-1">{block.tool}</span>
        {block.status === "success" ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-green-400/70 shrink-0" />
        ) : (
          <XCircle className="h-3.5 w-3.5 text-red-400/70 shrink-0" />
        )}
      </Button>
      {expanded && (
        <div className="bg-[#0d1117] border-t border-white/[0.04]">
          {block.input && (
            <div className="px-3.5 pt-3 pb-2">
              <p className="text-[10px] uppercase tracking-widest text-white/20 mb-1.5 font-medium">
                Input
              </p>
              <pre className="text-[11px] font-mono text-white/50 whitespace-pre-wrap break-words leading-relaxed">
                {block.input}
              </pre>
            </div>
          )}
          <div
            className={cn(
              "px-3.5 pb-3",
              block.input ? "pt-1 border-t border-white/[0.04]" : "pt-3",
            )}
          >
            <p className="text-[10px] uppercase tracking-widest text-white/20 mb-1.5 font-medium">
              Output
            </p>
            <pre className="text-[11px] font-mono text-white/70 whitespace-pre-wrap break-words leading-relaxed">
              {block.output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

const DIFF_PREVIEW_LINES = 10;

function DiffBlock({
  block,
  onExpand,
}: { block: Extract<ContentBlock, { type: "diff" }>; onExpand?: () => void }): React.ReactElement {
  const lines = block.content.split("\n");
  const isTruncated = lines.length > DIFF_PREVIEW_LINES;
  const previewLines = isTruncated ? lines.slice(0, DIFF_PREVIEW_LINES) : lines;
  const previewEntries = createIndexedItems(previewLines, (line) => line);

  return (
    <div
      className={cn(
        "w-[420px] rounded-xl overflow-hidden border border-white/[0.06]",
        onExpand && "cursor-pointer",
      )}
      onClick={onExpand}
      role={onExpand ? "button" : undefined}
      tabIndex={onExpand ? 0 : undefined}
      onKeyDown={
        onExpand
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onExpand();
              }
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between h-9 px-3.5 bg-white/[0.03] border-b border-white/[0.04]">
        <div className="flex items-center gap-2 min-w-0">
          <GitPullRequestArrow className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
          <span className="text-[12px] font-mono font-medium truncate">{block.filename}</span>
        </div>
        <div className="flex items-center gap-2.5 text-[11px] font-mono shrink-0 ml-3">
          <span className="text-green-400/80">+{block.additions}</span>
          <span className="text-red-400/80">-{block.deletions}</span>
        </div>
      </div>
      <div className="bg-[#0d1117] overflow-x-auto">
        {previewEntries.map(({ key, value: line }) => {
          const isAdd = line.startsWith("+");
          const isDel = line.startsWith("-");
          const isHunk = line.startsWith("@@");

          return (
            <div
              key={key}
              className={cn(
                "px-3.5 text-[11px] font-mono leading-[22px] min-h-[22px] border-l-2",
                isAdd && "bg-green-500/[0.07] text-green-300/80 border-green-500/40",
                isDel && "bg-red-500/[0.07] text-red-300/80 border-red-500/40",
                isHunk && "bg-blue-500/[0.05] text-blue-300/60 border-blue-500/30",
                !isAdd && !isDel && !isHunk && "text-white/40 border-transparent",
              )}
            >
              {line || "\u00a0"}
            </div>
          );
        })}
      </div>
      {isTruncated && (
        <div className="flex items-center justify-center h-7 bg-[#0d1117] border-t border-white/[0.04]">
          <span className="text-[11px] text-white/30">Click to see all {lines.length} lines</span>
        </div>
      )}
    </div>
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
        "w-[340px] rounded-xl border px-4 py-3.5",
        block.status === "pending" && "border-amber-500/15 bg-amber-500/[0.04]",
        block.status === "approved" && "border-green-500/15 bg-green-500/[0.04]",
        block.status === "rejected" && "border-red-500/15 bg-red-500/[0.04]",
      )}
    >
      <div className="flex items-start gap-2.5">
        <ShieldQuestion
          className={cn(
            "h-[18px] w-[18px] mt-0.5 shrink-0",
            block.status === "pending" && "text-amber-400",
            block.status === "approved" && "text-green-400",
            block.status === "rejected" && "text-red-400",
          )}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-snug">{block.title}</p>
          {block.description && (
            <p className="text-[12px] text-muted-foreground/60 mt-1 leading-relaxed">
              {block.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.06]">
        {block.status === "pending" && (
          <div className="flex gap-2">
            <Button
              onClick={() => onAction?.(block.id, "approved")}
              className="flex-1 h-8 rounded-lg text-[12px] font-medium bg-green-600/90 text-white hover:bg-green-600"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => onAction?.(block.id, "rejected")}
              className="flex-1 h-8 rounded-lg text-[12px] font-medium bg-white/[0.06] text-muted-foreground hover:bg-red-600/80 hover:text-white"
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </Button>
          </div>
        )}
        {block.status === "approved" && (
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-green-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Approved
          </div>
        )}
        {block.status === "rejected" && (
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-red-400">
            <XCircle className="h-3.5 w-3.5" />
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
  const pct = Math.round((block.current / block.total) * 100);
  const isDone = pct >= 100;
  const indexedSteps = block.steps
    ? createIndexedItems(block.steps, (step) => `${step.label}-${step.status}`)
    : [];

  return (
    <div className="w-[340px] rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-medium">{block.title}</p>
        <span
          className={cn(
            "text-[11px] font-mono font-medium",
            isDone ? "text-green-400" : "text-muted-foreground/60",
          )}
        >
          {pct}%
        </span>
      </div>

      <div className="h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            isDone ? "bg-green-500" : "bg-blue-500",
          )}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>

      {block.steps && block.steps.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-white/[0.04]">
          <div className="flex flex-col gap-1.5">
            {indexedSteps.map(({ key, value: step }) => (
              <div key={key} className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "h-[7px] w-[7px] rounded-full shrink-0 ring-2",
                    step.status === "done" && "bg-green-400 ring-green-400/20",
                    step.status === "active" && "bg-blue-400 ring-blue-400/20 animate-pulse",
                    step.status === "pending" && "bg-white/10 ring-white/[0.04]",
                  )}
                />
                <span
                  className={cn(
                    "text-[12px] leading-none",
                    step.status === "done" && "text-muted-foreground/60 line-through",
                    step.status === "active" && "text-foreground font-medium",
                    step.status === "pending" && "text-muted-foreground/30",
                  )}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ContentBlockRenderer({
  block,
  isMe,
  onApprovalAction,
  onExpand,
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
      return <CodeBlock block={block} isMe={isMe} onExpand={handleExpand} />;
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
      return <TopicBlock block={block} />;
  }
}
