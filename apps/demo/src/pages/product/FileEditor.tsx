import { Badge, Button, Textarea } from "@nexu-design/ui-web";
import {
  Bot,
  Check,
  ChevronRight,
  Eye,
  File,
  type FileText,
  Film,
  FolderOpen,
  Image,
  Music,
  Pencil,
  Save,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getFile, saveFile } from "./fileStore";
import type { FileType } from "./sessionsData";

const EDITABLE_TYPES = new Set<FileType>([
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

const BINARY_PLACEHOLDERS: Partial<Record<FileType, { icon: typeof FileText; label: string }>> = {
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

interface FileEditorProps {
  filePath: string;
  initialContent: string;
  fileType: FileType;
  lastEditedBy?: "human" | "agent";
  lastEditedAt?: string;
  onSave?: (content: string) => void;
  onClose?: () => void;
  readOnly?: boolean;
  compact?: boolean;
}

export default function FileEditor({
  filePath,
  initialContent,
  fileType,
  lastEditedBy: propEditedBy,
  lastEditedAt: propEditedAt,
  onSave,
  onClose,
  readOnly = false,
  compact = false,
}: FileEditorProps) {
  const stored = getFile(filePath);
  const content = stored?.content ?? initialContent;
  const editedBy = propEditedBy ?? stored?.lastEditedBy ?? "agent";
  const editedAt = propEditedAt ?? stored?.lastEditedAt ?? "";

  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [draft, setDraft] = useState(content);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isEditable = EDITABLE_TYPES.has(fileType) && !readOnly;
  const isMarkdown = fileType === "markdown" || fileType === "contact" || fileType === "skill";
  const binary = BINARY_PLACEHOLDERS[fileType];

  useEffect(() => {
    setDraft(content);
    setMode("preview");
    setSaved(false);
  }, [content]);

  useEffect(() => {
    if (mode === "edit" && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [mode]);

  const handleSave = useCallback(() => {
    saveFile(filePath, draft, "human");
    onSave?.(draft);
    setSaved(true);
    setMode("preview");
    setTimeout(() => setSaved(false), 2000);
  }, [filePath, draft, onSave]);

  const handleCancel = useCallback(() => {
    setDraft(content);
    setMode("preview");
  }, [content]);

  const pathParts = filePath.split("/");
  const fileName = pathParts.pop() || "";

  if (compact) {
    return (
      <CompactEditor
        content={content}
        draft={draft}
        setDraft={setDraft}
        mode={mode}
        setMode={setMode}
        isEditable={isEditable}
        isMarkdown={isMarkdown}
        binary={binary}
        saved={saved}
        editedBy={editedBy}
        editedAt={editedAt}
        onSave={handleSave}
        onCancel={handleCancel}
        textareaRef={textareaRef}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface-0">
      {/* Header */}
      <div className="flex justify-between items-center px-3 h-11 border-b border-border shrink-0">
        <div className="flex gap-2 items-center min-w-0">
          <FolderOpen size={12} className="text-text-muted shrink-0" />
          {pathParts.map((part, i) => (
            <span key={part} className="flex items-center gap-1 text-[10px] text-text-muted">
              {i > 0 && <ChevronRight size={8} />}
              <span>{part}</span>
            </span>
          ))}
          <ChevronRight size={8} className="text-text-muted" />
          <span className="text-[12px] font-medium text-text-primary truncate">{fileName}</span>
        </div>
        <div className="flex gap-1 items-center shrink-0">
          {isEditable && (
            <div className="flex items-center bg-surface-3 rounded-md p-0.5">
              <button
                onClick={() => setMode("preview")}
                type="button"
                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors ${
                  mode === "preview"
                    ? "bg-surface-0 text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <Eye size={10} />
                Preview
              </button>
              <button
                onClick={() => setMode("edit")}
                type="button"
                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors ${
                  mode === "edit"
                    ? "bg-surface-0 text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <Pencil size={10} />
                Edit
              </button>
            </div>
          )}
          {onClose && (
            <button
              onClick={onClose}
              type="button"
              className="p-1 ml-1 rounded transition-colors hover:bg-surface-3 text-text-muted"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 min-h-0">
        {binary ? (
          <BinaryPlaceholder icon={binary.icon} label={binary.label} />
        ) : mode === "edit" ? (
            <Textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="h-full w-full resize-none border-0 bg-transparent p-4 font-mono text-[12px] leading-relaxed shadow-none focus-visible:ring-0"
              spellCheck={false}
            />
        ) : isMarkdown ? (
          <div className="p-4 markdown-preview">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <pre className="p-4 text-[12px] leading-relaxed text-text-secondary font-mono whitespace-pre-wrap">
            {content}
          </pre>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-3 h-9 border-t border-border shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
          {editedBy === "agent" ? <Bot size={10} /> : <User size={10} />}
          <span>
            {editedBy === "agent" ? "Agent" : "You"} edited {editedAt && `at ${editedAt}`}
          </span>
          {saved && (
            <span className="flex items-center gap-0.5 text-success ml-1">
              <Check size={10} />
              Saved
            </span>
          )}
        </div>
        {mode === "edit" && (
          <div className="flex items-center gap-1.5">
            <Button onClick={handleCancel} type="button" variant="ghost" size="xs">
              Cancel
            </Button>
            <Button onClick={handleSave} type="button" size="xs" className="gap-1">
              <Save size={10} />
              Save
            </Button>
          </div>
        )}
      </div>
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
  setDraft: (v: string) => void;
  mode: "preview" | "edit";
  setMode: (m: "preview" | "edit") => void;
  isEditable: boolean;
  isMarkdown: boolean;
  binary: { icon: typeof FileText; label: string } | undefined;
  saved: boolean;
  editedBy: "human" | "agent";
  editedAt: string;
  onSave: () => void;
  onCancel: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Compact toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-1.5 text-[9px] text-text-muted">
          {editedBy === "agent" ? <Bot size={9} /> : <User size={9} />}
          <span>
            {editedBy === "agent" ? "Agent" : "You"} · {editedAt}
          </span>
          {saved && (
            <Badge variant="success" size="xs" className="gap-0.5">
              <Check size={9} /> Saved
            </Badge>
          )}
        </div>
        <div className="flex gap-1 items-center">
          {isEditable && mode === "preview" && (
            <Button onClick={() => setMode("edit")} type="button" variant="outline" size="xs" className="gap-1">
              <Pencil size={9} />
              Edit
            </Button>
          )}
          {mode === "edit" && (
            <>
              <Button onClick={onCancel} type="button" variant="ghost" size="xs">
                Cancel
              </Button>
              <Button onClick={onSave} type="button" size="xs" className="gap-0.5">
                <Save size={9} />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 min-h-0">
        {binary ? (
          <BinaryPlaceholder icon={binary.icon} label={binary.label} />
        ) : mode === "edit" ? (
          <Textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="h-full w-full resize-none border-0 bg-transparent p-3 font-mono text-[11px] leading-relaxed shadow-none focus-visible:ring-0"
            spellCheck={false}
          />
        ) : isMarkdown ? (
          <div className="p-3 markdown-preview markdown-preview-compact">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <pre className="p-3 text-[11px] leading-relaxed text-text-secondary font-mono whitespace-pre-wrap">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
}

function BinaryPlaceholder({
  icon: Icon,
  label,
}: {
  icon: typeof FileText;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2 justify-center items-center h-full text-text-muted">
      <Icon size={28} className="opacity-30" />
      <span className="text-[11px]">{label}</span>
    </div>
  );
}
