import { CopyButton } from "./copy-button";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  variant?: "standalone" | "embedded";
}

export function CodeBlock({
  code,
  language = "tsx",
  title,
  variant = "standalone",
}: CodeBlockProps) {
  const isEmbedded = variant === "embedded";

  return (
    <div
      className={
        isEmbedded
          ? "not-prose overflow-hidden border-t border-border-subtle bg-surface-1"
          : "not-prose overflow-hidden rounded-xl border border-border-subtle bg-surface-1 shadow-rest"
      }
    >
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle bg-surface-2/70 px-4 py-3">
        <p className="min-w-0 truncate text-xs font-semibold text-text-muted">
          {title ?? language}
        </p>
        <CopyButton value={code} label="Copy code" className="h-7 w-24 shrink-0 px-2 text-xs" />
      </div>
      <pre className="m-0 overflow-x-auto bg-transparent p-4 text-sm leading-6 text-text-primary shadow-none">
        <code>{code}</code>
      </pre>
    </div>
  );
}
