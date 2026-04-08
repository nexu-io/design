import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CodeBlock({
  code,
  lang: _lang = "bash",
  filename,
}: { code: string; lang?: string; filename?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border bg-[#1e1e2e] overflow-hidden">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
          <span className="text-[12px] text-white/50 font-mono">{filename}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white/70 transition-colors"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      <div className="relative">
        {!filename && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded text-[11px] text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        )}
        <pre className="px-4 py-3 overflow-x-auto text-[13px] leading-relaxed font-mono text-[#cdd6f4]">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
