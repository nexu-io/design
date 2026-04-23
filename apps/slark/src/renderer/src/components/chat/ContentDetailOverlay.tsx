import { Button, cn } from "@nexu-design/ui-web";
import { Check, Copy, GitPullRequestArrow, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { ContentBlock } from "@/types";

interface ContentDetailOverlayProps {
  block: ContentBlock | null;
  onClose: () => void;
}

interface LineEntry {
  key: string;
  line: string;
  lineNumber: number;
}

function createLineEntries(lines: string[]): LineEntry[] {
  const occurrences = new Map<string, number>();
  const entries: LineEntry[] = [];
  let lineNumber = 0;

  for (const line of lines) {
    lineNumber += 1;
    const count = (occurrences.get(line) ?? 0) + 1;
    occurrences.set(line, count);
    entries.push({ key: `${line}:${count}`, line, lineNumber });
  }

  return entries;
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

  if (block.type === "video") {
    return (
      <VideoLightbox
        url={block.url}
        thumbnail={block.thumbnail}
        title={block.title}
        onClose={onClose}
      />
    );
  }

  if (block.type === "code") {
    return <CodeDetailView block={block} onClose={onClose} />;
  }

  if (block.type === "diff") {
    return <DiffDetailView block={block} onClose={onClose} />;
  }

  return null;
}

function VideoLightbox({
  url,
  thumbnail,
  title,
  onClose,
}: {
  url?: string;
  thumbnail: string;
  title: string;
  onClose: () => void;
}): React.ReactElement {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onClose}
        className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
      >
        <X className="h-5 w-5" />
      </Button>
      <div className="max-w-[90vw] max-h-[85vh] p-4" onMouseDown={(e) => e.stopPropagation()}>
        {url ? (
          // biome-ignore lint/a11y/useMediaCaption: user-uploaded video has no caption track available.
          <video
            src={url}
            poster={thumbnail}
            controls
            autoPlay
            className="max-w-[88vw] max-h-[80vh] rounded-lg shadow-2xl bg-black"
          />
        ) : (
          <img
            src={thumbnail}
            alt={title}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
        )}
        <p className="text-sm text-white/50 text-center mt-3">{title}</p>
      </div>
    </div>
  );
}

function ImageLightbox({
  url,
  alt,
  onClose,
}: { url: string; alt?: string; onClose: () => void }): React.ReactElement {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onClose}
        className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
      >
        <X className="h-5 w-5" />
      </Button>
      <div className="max-w-[90vw] max-h-[85vh] p-4" onMouseDown={(e) => e.stopPropagation()}>
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
  const lineEntries = createLineEntries(block.code.split("\n"));

  const handleCopy = (): void => {
    navigator.clipboard.writeText(block.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="w-[min(720px,90vw)] max-h-[85vh] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0d1117] shadow-2xl flex flex-col"
        onMouseDown={(e) => e.stopPropagation()}
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
            <Button
              variant="ghost"
              size="sm"
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
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="h-7 w-7 text-white/30 hover:text-white/60 hover:bg-white/[0.05]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <tbody>
              {lineEntries.map(({ key, line, lineNumber }) => (
                <tr key={key} className="hover:bg-white/[0.02]">
                  <td className="w-[1%] whitespace-nowrap px-4 py-0 text-right text-[12px] font-mono text-white/15 select-none align-top leading-[22px]">
                    {lineNumber}
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
          <span className="text-[11px] text-white/20 font-mono">{lineEntries.length} lines</span>
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
  const lineEntries = createLineEntries(block.content.split("\n"));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="w-[min(720px,90vw)] max-h-[85vh] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0d1117] shadow-2xl flex flex-col"
        onMouseDown={(e) => e.stopPropagation()}
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
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="h-7 w-7 text-white/30 hover:text-white/60 hover:bg-white/[0.05] shrink-0 ml-3"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <tbody>
              {lineEntries.map(({ key, line, lineNumber }) => {
                const isAdd = line.startsWith("+");
                const isDel = line.startsWith("-");
                const isHunk = line.startsWith("@@");

                return (
                  <tr
                    key={key}
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
                      {lineNumber}
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
          <span className="text-[11px] text-white/20 font-mono">{lineEntries.length} lines</span>
        </div>
      </div>
    </div>
  );
}
