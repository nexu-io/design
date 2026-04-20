import { useState, useEffect } from "react";
import { X, Copy, Check, GitPullRequestArrow, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentBlock } from "@/types";

interface ContentDetailOverlayProps {
  block: ContentBlock | null;
  onClose: () => void;
}

export function ContentDetailOverlay({
  block,
  onClose,
}: ContentDetailOverlayProps): React.ReactElement | null {
  useEffect(() => {
    if (!block) return;
    const handler = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [block, onClose]);

  if (!block) return null;

  if (block.type === "image") {
    return <ImageLightbox url={block.url} alt={block.alt} onClose={onClose} />;
  }

  if (block.type === "code") {
    return <CodeDetailView block={block} onClose={onClose} />;
  }

  if (block.type === "diff") {
    return <DiffDetailView block={block} onClose={onClose} />;
  }

  return null;
}

function ImageLightbox({
  url,
  alt,
  onClose,
}: { url: string; alt?: string; onClose: () => void }): React.ReactElement {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center h-9 w-9 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="max-w-[90vw] max-h-[85vh] p-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={url}
          alt={alt ?? ""}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
        />
        {alt && <p className="text-sm text-white/50 text-center mt-3">{alt}</p>}
      </div>
    </div>
  );
}

function CodeDetailView({
  block,
  onClose,
}: {
  block: Extract<ContentBlock, { type: "code" }>;
  onClose: () => void;
}): React.ReactElement {
  const [copied, setCopied] = useState(false);
  const lines = block.code.split("\n");

  const handleCopy = (): void => {
    navigator.clipboard.writeText(block.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[min(720px,90vw)] max-h-[85vh] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0d1117] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between h-11 px-4 bg-white/[0.03] border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {block.filename && (
              <span className="text-[13px] text-white/60 font-mono truncate">{block.filename}</span>
            )}
            {block.language && (
              <span className="text-[11px] text-white/25 font-mono bg-white/[0.05] px-2 py-0.5 rounded">
                {block.language}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-3">
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[12px] transition-colors",
                copied
                  ? "text-green-400"
                  : "text-white/30 hover:text-white/60 hover:bg-white/[0.05]",
              )}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center h-7 w-7 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="w-[1%] whitespace-nowrap px-4 py-0 text-right text-[12px] font-mono text-white/15 select-none align-top leading-[22px]">
                    {i + 1}
                  </td>
                  <td className="px-4 py-0 text-[12px] font-mono text-white/80 leading-[22px] whitespace-pre">
                    {line || "\u00a0"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between h-8 px-4 bg-white/[0.02] border-t border-white/[0.04] shrink-0">
          <span className="text-[11px] text-white/20 font-mono">{lines.length} lines</span>
        </div>
      </div>
    </div>
  );
}

function DiffDetailView({
  block,
  onClose,
}: {
  block: Extract<ContentBlock, { type: "diff" }>;
  onClose: () => void;
}): React.ReactElement {
  const lines = block.content.split("\n");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[min(720px,90vw)] max-h-[85vh] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0d1117] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between h-11 px-4 bg-white/[0.03] border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <GitPullRequestArrow className="h-4 w-4 text-white/30 shrink-0" />
            <span className="text-[13px] text-white/60 font-mono truncate">{block.filename}</span>
            <div className="flex items-center gap-2 text-[12px] font-mono shrink-0">
              <span className="text-green-400/70">+{block.additions}</span>
              <span className="text-red-400/70">-{block.deletions}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center h-7 w-7 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-colors shrink-0 ml-3"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, i) => {
                const isAdd = line.startsWith("+");
                const isDel = line.startsWith("-");
                const isHunk = line.startsWith("@@");

                return (
                  <tr
                    key={i}
                    className={cn(
                      isAdd && "bg-green-500/[0.07]",
                      isDel && "bg-red-500/[0.07]",
                      isHunk && "bg-blue-500/[0.05]",
                      !isAdd && !isDel && !isHunk && "hover:bg-white/[0.02]",
                    )}
                  >
                    <td
                      className={cn(
                        "w-[1%] whitespace-nowrap px-4 py-0 text-right text-[12px] font-mono select-none align-top leading-[22px] border-r",
                        isAdd && "text-green-400/30 border-green-500/20",
                        isDel && "text-red-400/30 border-red-500/20",
                        isHunk && "text-blue-400/30 border-blue-500/20",
                        !isAdd && !isDel && !isHunk && "text-white/10 border-white/[0.04]",
                      )}
                    >
                      {i + 1}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-0 text-[12px] font-mono leading-[22px] whitespace-pre",
                        isAdd && "text-green-300/80",
                        isDel && "text-red-300/80",
                        isHunk && "text-blue-300/60",
                        !isAdd && !isDel && !isHunk && "text-white/50",
                      )}
                    >
                      {line || "\u00a0"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between h-8 px-4 bg-white/[0.02] border-t border-white/[0.04] shrink-0">
          <span className="text-[11px] text-white/20 font-mono">{lines.length} lines</span>
        </div>
      </div>
    </div>
  );
}

export function ExpandHint(): React.ReactElement {
  return (
    <div className="flex items-center gap-1 text-[10px] text-muted-foreground/40 mt-1">
      <Maximize2 className="h-2.5 w-2.5" />
      Click to expand
    </div>
  );
}
