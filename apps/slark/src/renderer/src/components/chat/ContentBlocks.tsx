import type { ContentBlock } from "@/types";
import {
  FileAttachment,
  ImageAttachment,
  ImageGallery,
  VideoAttachment,
  VoiceMessage,
  cn,
} from "@nexu-design/ui-web";
import type { FileAttachmentKind } from "@nexu-design/ui-web";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Loader2,
  MessageSquareReply,
  SendHorizontal,
  ShieldQuestion,
  Terminal,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export type ApprovalResult =
  | { kind: "choice"; choiceId: string; label: string }
  | { kind: "text"; text: string };

interface ContentBlockRendererProps {
  block: ContentBlock;
  isMe: boolean;
  onApprovalAction?: (id: string, result: ApprovalResult) => void;
  onExpand?: (block: ContentBlock) => void;
}

const DEFAULT_APPROVAL_OPTIONS: {
  id: string;
  label: string;
  tone: "primary" | "danger" | "neutral";
}[] = [
  { id: "approved", label: "Approve", tone: "primary" },
  { id: "rejected", label: "Reject", tone: "danger" },
];

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

function ImageBlock({
  block,
  onExpand,
}: { block: Extract<ContentBlock, { type: "image" }>; onExpand?: () => void }): React.ReactElement {
  // Stickers render at natural aspect ratio, capped by max-width, with no frame/caption.
  if (block.alt === "sticker") {
    return (
      <button
        type="button"
        onClick={onExpand}
        className="inline-block max-w-[200px] cursor-zoom-in overflow-hidden rounded-md bg-transparent p-0 align-top transition-opacity hover:opacity-90"
        aria-label="Sticker"
      >
        <img
          src={block.url}
          alt=""
          className="block h-auto w-auto max-h-[220px] max-w-full object-contain"
          draggable={false}
        />
      </button>
    );
  }
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
  onExpand,
}: {
  block: Extract<ContentBlock, { type: "gallery" }>;
  onExpand?: (block: ContentBlock) => void;
}): React.ReactElement {
  return (
    <ImageGallery
      images={block.images.map((img) => ({ src: img.url, alt: img.alt }))}
      onSelect={(img) => {
        onExpand?.({ type: "image", url: img.src, alt: img.alt });
      }}
    />
  );
}

function VideoBlock({
  block,
  onExpand,
}: {
  block: Extract<ContentBlock, { type: "video" }>;
  onExpand?: () => void;
}): React.ReactElement {
  return (
    <VideoAttachment
      thumbnail={block.thumbnail}
      duration={block.duration}
      title={block.title}
      meta={block.size ? formatFileSize(block.size) : undefined}
      onClick={onExpand}
    />
  );
}

function VoiceBlock({
  block,
}: { block: Extract<ContentBlock, { type: "voice" }> }): React.ReactElement {
  return <VoiceMessage duration={block.duration} waveform={block.waveform} />;
}

function ActionCard({
  block,
}: { block: Extract<ContentBlock, { type: "action" }> }): React.ReactElement {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 max-w-[360px] pl-2.5 pr-3 py-1.5 rounded-full border text-[12.5px] leading-snug transition-colors",
        block.status === "running" && "border-info/25 bg-info-subtle text-info",
        block.status === "success" && "border-success/25 bg-success-subtle text-success",
        block.status === "failed" && "border-danger/25 bg-danger-subtle text-danger",
      )}
    >
      <span className="shrink-0 inline-flex items-center">
        {block.status === "running" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {block.status === "success" && <CheckCircle2 className="h-3.5 w-3.5" />}
        {block.status === "failed" && <XCircle className="h-3.5 w-3.5" />}
      </span>
      <span className="truncate font-medium text-text-primary">{block.title}</span>
      {block.description && (
        <span className="truncate text-text-muted">· {block.description}</span>
      )}
    </div>
  );
}

function ToolResultBlock({
  block,
}: { block: Extract<ContentBlock, { type: "tool-result" }> }): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  const isSuccess = block.status === "success";

  return (
    <div className="inline-flex flex-col items-stretch max-w-[420px]">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full border text-[12px] transition-colors self-start",
          isSuccess
            ? "border-border-subtle bg-surface-1 hover:bg-surface-2 text-text-secondary"
            : "border-danger/25 bg-danger-subtle hover:bg-danger/10 text-danger",
          expanded && "rounded-b-none",
        )}
      >
        {expanded ? (
          <ChevronDown className="h-3 w-3 shrink-0 opacity-60" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0 opacity-60" />
        )}
        <Terminal className="h-3 w-3 shrink-0 opacity-70" />
        <span className="font-mono font-medium truncate text-text-primary">{block.tool}</span>
        {isSuccess ? (
          <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
        ) : (
          <XCircle className="h-3 w-3 text-danger shrink-0" />
        )}
      </button>
      {expanded && (
        <div className="rounded-b-lg rounded-tr-lg border border-border-subtle bg-surface-1 -mt-px overflow-hidden">
          {block.input && (
            <div className="px-3 pt-2.5 pb-2">
              <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1 font-medium">
                Input
              </p>
              <pre className="text-[11px] font-mono text-text-secondary whitespace-pre-wrap break-words leading-relaxed">
                {block.input}
              </pre>
            </div>
          )}
          <div
            className={cn(
              "px-3 pb-2.5",
              block.input ? "pt-1.5 border-t border-border-subtle" : "pt-2.5",
            )}
          >
            <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1 font-medium">
              Output
            </p>
            <pre className="text-[11px] font-mono text-text-primary whitespace-pre-wrap break-words leading-relaxed">
              {block.output}
            </pre>
          </div>
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
  onAction?: (id: string, result: ApprovalResult) => void;
}): React.ReactElement {
  const [customText, setCustomText] = useState("");
  const [replyOpen, setReplyOpen] = useState(false);
  const options = block.options?.length ? block.options : DEFAULT_APPROVAL_OPTIONS;
  const isResolved = block.status !== "pending";
  const isCompact = options.length <= 2;

  const toneClass = (tone: "primary" | "danger" | "neutral" = "neutral"): string => {
    switch (tone) {
      case "primary":
        return "border-success/30 bg-success-subtle text-success hover:bg-success hover:text-white hover:border-success";
      case "danger":
        return "border-danger/25 bg-danger-subtle text-danger hover:bg-danger hover:text-white hover:border-danger";
      default:
        return "border-border-subtle bg-surface-2 text-text-secondary hover:bg-surface-3 hover:text-text-primary";
    }
  };

  const submitText = (): void => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    onAction?.(block.id, { kind: "text", text: trimmed });
    setCustomText("");
    setReplyOpen(false);
  };

  return (
    <div
      className={cn(
        "w-[320px] max-w-full rounded-xl border px-3 py-2.5",
        block.status === "pending" && "border-warning/20 bg-warning-subtle",
        block.status === "approved" && "border-success/20 bg-success-subtle",
        block.status === "rejected" && "border-danger/20 bg-danger-subtle",
        block.status === "responded" && "border-info/20 bg-info-subtle",
      )}
    >
      <div className="flex items-start gap-2">
        <ShieldQuestion
          className={cn(
            "h-4 w-4 mt-0.5 shrink-0",
            block.status === "pending" && "text-warning",
            block.status === "approved" && "text-success",
            block.status === "rejected" && "text-danger",
            block.status === "responded" && "text-info",
          )}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-snug text-text-primary">{block.title}</p>
          {block.description && (
            <p className="text-[12px] text-text-muted mt-0.5 leading-relaxed">
              {block.description}
            </p>
          )}
        </div>
      </div>

      {!isResolved && (
        <div className="mt-2.5">
          <div className={cn("flex gap-1.5", isCompact ? "flex-row" : "flex-col")}>
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  onAction?.(block.id, { kind: "choice", choiceId: opt.id, label: opt.label })
                }
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg border text-[12.5px] font-medium transition-colors",
                  isCompact ? "flex-1 min-w-0" : "w-full",
                  toneClass(opt.tone),
                )}
              >
                {opt.tone === "primary" ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                ) : opt.tone === "danger" ? (
                  <XCircle className="h-3.5 w-3.5 shrink-0" />
                ) : null}
                <span className="truncate">{opt.label}</span>
              </button>
            ))}
            {!replyOpen && (
              <button
                type="button"
                onClick={() => setReplyOpen(true)}
                aria-label="Write a reply"
                className="shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border-subtle bg-surface-2 text-text-muted hover:bg-surface-3 hover:text-text-primary transition-colors"
              >
                <MessageSquareReply className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {replyOpen && (
            <div className="relative mt-1.5">
              <input
                autoFocus
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submitText();
                  } else if (e.key === "Escape") {
                    setReplyOpen(false);
                    setCustomText("");
                  }
                }}
                placeholder="Write a reply…"
                className="w-full h-8 rounded-lg border border-border-subtle bg-surface-2 pl-3 pr-8 text-[12.5px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-strong focus:bg-surface-3"
              />
              <button
                type="button"
                onClick={submitText}
                disabled={!customText.trim()}
                aria-label="Send reply"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 inline-flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-surface-3 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-muted"
              >
                <SendHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
      {block.status === "approved" && (
        <div className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-success">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {block.response?.label ?? "Approved"}
        </div>
      )}
      {block.status === "rejected" && (
        <div className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-danger">
          <XCircle className="h-3.5 w-3.5" />
          {block.response?.label ?? "Rejected"}
        </div>
      )}
      {block.status === "responded" && (
        <div className="mt-2 flex items-start gap-1.5 text-[12px] text-info">
          <MessageSquareReply className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span className="leading-relaxed">{block.response?.text}</span>
        </div>
      )}
    </div>
  );
}

export function ContentBlockRenderer({
  block,
  isMe: _isMe,
  onApprovalAction,
  onExpand,
}: ContentBlockRendererProps): React.ReactElement {
  const handleExpand = (): void => onExpand?.(block);

  switch (block.type) {
    case "image":
      return <ImageBlock block={block} onExpand={handleExpand} />;
    case "gallery":
      return <GalleryBlock block={block} onExpand={onExpand} />;
    case "video":
      return <VideoBlock block={block} onExpand={handleExpand} />;
    case "voice":
      return <VoiceBlock block={block} />;
    case "file":
      return <FileBlock block={block} />;
    case "action":
      return <ActionCard block={block} />;
    case "tool-result":
      return <ToolResultBlock block={block} />;
    case "approval":
      return <ApprovalBlock block={block} onAction={onApprovalAction} />;
  }
}
