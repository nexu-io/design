"use client";

import type { ReactNode } from "react";
import { useId, useLayoutEffect, useRef, useState } from "react";

import { Button } from "@nexu-design/ui-web";
import { CopyButton } from "./copy-button";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  variant?: "standalone" | "embedded";
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function CodeBlock({
  code,
  language = "tsx",
  variant = "standalone",
  collapsible = false,
  defaultCollapsed = true,
}: CodeBlockProps) {
  const isEmbedded = variant === "embedded";
  const isCollapsible = collapsible && code.split("\n").length > 8;
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [expandedHeight, setExpandedHeight] = useState<number | null>(null);
  const codeId = useId();
  const codeRef = useRef<HTMLPreElement>(null);
  const codeCollapsed = isCollapsible && collapsed;

  useLayoutEffect(() => {
    if (!isCollapsible) return;

    const codeElement = codeRef.current;
    if (!codeElement) return;

    const updateHeight = () => setExpandedHeight(codeElement.scrollHeight);
    updateHeight();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateHeight);
    observer.observe(codeElement);

    return () => observer.disconnect();
  }, [isCollapsible]);

  return (
    <div
      className={
        isEmbedded
          ? "not-prose overflow-hidden border-t border-border-subtle bg-surface-1"
          : "not-prose overflow-hidden rounded-xl border border-border-subtle bg-surface-1 shadow-rest"
      }
    >
      <div className="relative">
        <CopyButton
          value={code}
          label="Copy code"
          variant="ghost"
          size="icon-sm"
          className="absolute right-3 top-3 z-10 size-8 border-none bg-transparent text-text-muted shadow-none hover:bg-transparent hover:text-text-heading"
        />
        <pre
          ref={codeRef}
          id={codeId}
          style={
            isCollapsible
              ? { maxHeight: codeCollapsed ? "10rem" : (expandedHeight ?? undefined) }
              : undefined
          }
          className={[
            "m-0 overflow-x-auto bg-transparent p-4 pr-14 text-sm leading-6 text-text-primary shadow-none",
            "transition-[max-height] duration-300 ease-out",
            codeCollapsed ? "overflow-hidden" : isCollapsible ? "pb-14" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <code data-language={language}>{highlightCode(code, language)}</code>
        </pre>
        {isCollapsible ? (
          <>
            <div
              aria-hidden="true"
              className={[
                "pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface-1 via-surface-1/90 to-transparent transition-opacity duration-200",
                codeCollapsed ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
              <Button
                type="button"
                size="xs"
                variant="outline"
                className="pointer-events-auto bg-surface-1 px-3 text-xs text-text-secondary shadow-rest hover:text-text-heading"
                aria-controls={codeId}
                aria-expanded={!collapsed}
                onClick={() => setCollapsed((current) => !current)}
              >
                {collapsed ? "Expand code" : "Collapse code"}
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

const tokenPattern =
  /(\/\/.*|\/\*[\s\S]*?\*\/|`(?:\\.|[^`])*`|'(?:\\.|[^'])*'|"(?:\\.|[^"])*"|\b(?:as|async|await|boolean|class|const|export|false|from|function|import|interface|null|number|return|string|true|type|undefined)\b|\b\d+(?:\.\d+)?\b|<\/?[A-Z][\w.:-]*|\b[A-Z][A-Za-z0-9]+(?=\b)|--[\w-]+|@[\w/-]+)/g;

function highlightCode(code: string, language: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of code.matchAll(tokenPattern)) {
    const token = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      nodes.push(code.slice(lastIndex, index));
    }

    nodes.push(
      <span key={`${index}-${token}`} className={getTokenClassName(token, language)}>
        {token}
      </span>,
    );
    lastIndex = index + token.length;
  }

  if (lastIndex < code.length) {
    nodes.push(code.slice(lastIndex));
  }

  return nodes;
}

function getTokenClassName(token: string, language: string) {
  if (token.startsWith("//") || token.startsWith("/*")) {
    return "text-text-muted";
  }

  if (token.startsWith("'") || token.startsWith('"') || token.startsWith("`")) {
    return "text-success";
  }

  if (token.startsWith("<") || /^[A-Z]/.test(token)) {
    return "text-brand-primary";
  }

  if (token.startsWith("--") || token.startsWith("@")) {
    return language === "bash" ? "text-warning" : "text-accent";
  }

  if (/^\d/.test(token)) {
    return "text-warning";
  }

  return "text-brand-primary";
}
