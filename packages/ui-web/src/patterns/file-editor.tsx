import {
  Bot,
  Check,
  ChevronRight,
  Eye,
  File,
  Film,
  FolderOpen,
  Image,
  type LucideIcon,
  Music,
  Pencil,
  Save,
  User,
  X,
} from "lucide-react";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "../lib/cn";
import { Button } from "../primitives/button";

export type FileEditorFileType =
  | "markdown"
  | "yaml"
  | "code"
  | "jsonl"
  | "contact"
  | "skill"
  | "config"
  | "pdf"
  | "docx"
  | "xlsx"
  | "csv"
  | "pptx"
  | "image"
  | "video"
  | "audio"
  | "figma"
  | "svg"
  | "html"
  | "sql"
  | "archive"
  | "other";

const EDITABLE_TYPES = new Set<FileEditorFileType>([
  "markdown",
  "yaml",
  "code",
  "jsonl",
  "contact",
  "skill",
  "config",
  "html",
  "sql",
]);

const BINARY_PLACEHOLDERS: Partial<
  Record<FileEditorFileType, { icon: LucideIcon; label: string }>
> = {
  image: { icon: Image, label: "图片文件 — 不支持在线编辑" },
  video: { icon: Film, label: "视频文件 — 不支持在线编辑" },
  audio: { icon: Music, label: "音频文件 — 不支持在线编辑" },
  pdf: { icon: File, label: "PDF 文件 — 不支持在线编辑" },
  xlsx: { icon: File, label: "Excel 文件 — 不支持在线编辑" },
  docx: { icon: File, label: "Word 文件 — 不支持在线编辑" },
  pptx: { icon: File, label: "演示文稿 — 不支持在线编辑" },
  archive: { icon: File, label: "压缩文件 — 不支持在线编辑" },
  figma: { icon: File, label: "Figma 文件 — 在 Figma 中打开" },
  svg: { icon: Image, label: "SVG 文件 — 不支持在线编辑" },
  csv: { icon: File, label: "CSV 文件 — 不支持在线编辑" },
};

export interface FileEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  filePath: string;
  initialContent: string;
  fileType: FileEditorFileType;
  lastEditedBy?: "human" | "agent";
  lastEditedAt?: string;
  onSave?: (content: string) => void;
  onClose?: () => void;
  readOnly?: boolean;
  compact?: boolean;
}

function BinaryPlaceholder({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 text-text-muted">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-1">
        <Icon size={24} />
      </div>
      <div className="text-center text-[12px]">{label}</div>
    </div>
  );
}

function CompactEditor({
  content,
  draft,
  setDraft,
  mode,
  setMode,
  isEditable,
  isMarkdown,
  binary,
  saved,
  editedBy,
  editedAt,
  onSave,
  onCancel,
  textareaRef,
}: {
  content: string;
  draft: string;
  setDraft: (value: string) => void;
  mode: "preview" | "edit";
  setMode: (mode: "preview" | "edit") => void;
  isEditable: boolean;
  isMarkdown: boolean;
  binary: { icon: LucideIcon; label: string } | undefined;
  saved: boolean;
  editedBy: "human" | "agent";
  editedAt: string;
  onSave: () => void;
  onCancel: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border/50 px-3 py-1.5">
        <div className="flex items-center gap-1.5 text-[9px] text-text-muted">
          {editedBy === "agent" ? <Bot size={9} /> : <User size={9} />}
          <span>
            {editedBy === "agent" ? "Agent" : "You"} · {editedAt}
          </span>
          {saved ? (
            <span className="flex items-center gap-0.5 text-success">
              <Check size={9} /> Saved
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          {isEditable && mode === "preview" ? (
            <Button
              type="button"
              variant="ghost"
              size="inline"
              className="h-auto gap-1 px-1.5 py-0.5 text-[9px] text-text-muted hover:text-text-primary"
              onClick={() => setMode("edit")}
            >
              <Pencil size={9} />
              Edit
            </Button>
          ) : null}
          {mode === "edit" ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="inline"
                className="h-auto px-1.5 py-0.5 text-[9px] text-text-muted"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="inline"
                className="h-auto gap-0.5 px-1.5 py-0.5 text-[9px]"
                onClick={onSave}
              >
                <Save size={9} />
                Save
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {binary ? (
          <BinaryPlaceholder icon={binary.icon} label={binary.label} />
        ) : mode === "edit" ? (
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="h-full w-full resize-none bg-transparent p-3 font-mono text-[11px] leading-relaxed text-text-primary focus:outline-none"
            spellCheck={false}
          />
        ) : isMarkdown ? (
          <div className="markdown-preview p-3 text-[11px]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap p-3 font-mono text-[11px] leading-relaxed text-text-secondary">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
}

export function FileEditor({
  filePath,
  initialContent,
  fileType,
  lastEditedBy = "agent",
  lastEditedAt = "",
  onSave,
  onClose,
  readOnly = false,
  compact = false,
  className,
  ...props
}: FileEditorProps) {
  const [mode, setMode] = React.useState<"preview" | "edit">("preview");
  const [draft, setDraft] = React.useState(initialContent);
  const [saved, setSaved] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = React.useRef<number | null>(null);
  const isEditable = EDITABLE_TYPES.has(fileType) && !readOnly;
  const isMarkdown = fileType === "markdown" || fileType === "contact" || fileType === "skill";
  const binary = BINARY_PLACEHOLDERS[fileType];

  React.useEffect(() => {
    setDraft(initialContent);
    setMode("preview");
    setSaved(false);
  }, [initialContent]);

  React.useEffect(() => {
    if (mode === "edit" && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [mode]);

  React.useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleSave = React.useCallback(() => {
    onSave?.(draft);
    setSaved(true);
    setMode("preview");

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => setSaved(false), 2000);
  }, [draft, onSave]);

  const handleCancel = React.useCallback(() => {
    setDraft(initialContent);
    setMode("preview");
  }, [initialContent]);

  const pathParts = filePath.split("/");
  const fileName = pathParts.pop() || "";

  if (compact) {
    return (
      <div className={cn("h-full", className)} {...props}>
        <CompactEditor
          content={initialContent}
          draft={draft}
          setDraft={setDraft}
          mode={mode}
          setMode={setMode}
          isEditable={isEditable}
          isMarkdown={isMarkdown}
          binary={binary}
          saved={saved}
          editedBy={lastEditedBy}
          editedAt={lastEditedAt}
          onSave={handleSave}
          onCancel={handleCancel}
          textareaRef={textareaRef}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col bg-surface-0", className)} {...props}>
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-border px-3">
        <div className="flex min-w-0 items-center gap-2">
          <FolderOpen size={12} className="shrink-0 text-text-muted" />
          {pathParts.map((part) => (
            <span key={part} className="flex items-center gap-1 text-[10px] text-text-muted">
              <ChevronRight size={8} />
              <span>{part}</span>
            </span>
          ))}
          <ChevronRight size={8} className="text-text-muted" />
          <span className="truncate text-[12px] font-medium text-text-primary">{fileName}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {isEditable ? (
            <div className="flex items-center rounded-md bg-surface-3 p-0.5">
              <Button
                type="button"
                variant="ghost"
                size="inline"
                className={cn(
                  "h-auto gap-1 px-2 py-1 text-[10px]",
                  mode === "preview"
                    ? "bg-surface-0 text-text-primary shadow-sm hover:bg-surface-0"
                    : "text-text-muted hover:text-text-secondary",
                )}
                onClick={() => setMode("preview")}
              >
                <Eye size={10} />
                Preview
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="inline"
                className={cn(
                  "h-auto gap-1 px-2 py-1 text-[10px]",
                  mode === "edit"
                    ? "bg-surface-0 text-text-primary shadow-sm hover:bg-surface-0"
                    : "text-text-muted hover:text-text-secondary",
                )}
                onClick={() => setMode("edit")}
              >
                <Pencil size={10} />
                Edit
              </Button>
            </div>
          ) : null}
          {onClose ? (
            <Button type="button" variant="ghost" size="icon-sm" onClick={onClose}>
              <X size={14} />
              <span className="sr-only">Close editor</span>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {binary ? (
          <BinaryPlaceholder icon={binary.icon} label={binary.label} />
        ) : mode === "edit" ? (
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="h-full w-full resize-none bg-transparent p-4 font-mono text-[12px] leading-relaxed text-text-primary focus:outline-none"
            spellCheck={false}
          />
        ) : isMarkdown ? (
          <div className="markdown-preview p-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{initialContent}</ReactMarkdown>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap p-4 font-mono text-[12px] leading-relaxed text-text-secondary">
            {initialContent}
          </pre>
        )}
      </div>

      <div className="flex h-9 shrink-0 items-center justify-between border-t border-border px-3">
        <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
          {lastEditedBy === "agent" ? <Bot size={10} /> : <User size={10} />}
          <span>
            {lastEditedBy === "agent" ? "Agent" : "You"} edited{" "}
            {lastEditedAt ? `at ${lastEditedAt}` : ""}
          </span>
          {saved ? (
            <span className="ml-1 flex items-center gap-0.5 text-success">
              <Check size={10} />
              Saved
            </span>
          ) : null}
        </div>
        {mode === "edit" ? (
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="inline"
              className="h-auto px-2 py-1 text-[10px] text-text-muted"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="inline"
              className="h-auto gap-1 px-2.5 py-1 text-[10px]"
              onClick={handleSave}
            >
              <Save size={10} />
              Save
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
