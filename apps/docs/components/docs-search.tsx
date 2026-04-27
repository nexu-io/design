"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export interface DocsSearchItem {
  title: string;
  description: string;
  href: string;
  section: string;
  headings: string[];
}

interface DocsSearchProps {
  items: DocsSearchItem[];
  onNavigate?: () => void;
}

export function DocsSearch({ items }: DocsSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;

      if (event.key === "/" && !isEditable) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalizedQuery) {
      return items.slice(0, 6);
    }

    return items
      .map((item) => {
        const haystack = [item.title, item.description, item.section, item.href, ...item.headings]
          .join(" ")
          .toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(normalizedQuery);
        const sectionMatch = item.section.toLowerCase().includes(normalizedQuery);
        const score = titleMatch
          ? 3
          : sectionMatch
            ? 2
            : haystack.includes(normalizedQuery)
              ? 1
              : 0;

        return { item, score };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
      .slice(0, 8)
      .map((result) => result.item);
  }, [items, normalizedQuery]);

  return (
    <div className="group relative w-full max-w-xl">
      <label className="sr-only" htmlFor="docs-search">
        Search documentation
      </label>
      <input
        ref={inputRef}
        id="docs-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search components, guides, tokens…"
        className="h-10 w-full rounded-xl border border-border-subtle bg-surface-1 px-10 text-sm text-text-heading shadow-rest outline-none transition placeholder:text-text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        autoComplete="off"
      />
      <span
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        aria-hidden="true"
      >
        ⌕
      </span>
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border-subtle bg-surface-2 px-1.5 py-0.5 text-[0.65rem] font-semibold text-text-muted sm:block">
        /
      </kbd>
      {(query || results.length > 0) && (
        <div className="absolute left-0 right-0 top-12 z-50 hidden overflow-hidden rounded-xl border border-border-subtle bg-surface-0 shadow-floating group-focus-within:block">
          <SearchResults results={results} query={normalizedQuery} />
        </div>
      )}
    </div>
  );
}

export function MobileDocsSearch({ items, onNavigate }: DocsSearchProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return items
      .filter((item) =>
        [item.title, item.description, item.section, item.href, ...item.headings]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 6);
  }, [items, normalizedQuery]);

  return (
    <div className="grid gap-2">
      <label
        className="text-xs font-semibold uppercase tracking-wider text-text-muted"
        htmlFor="mobile-docs-search"
      >
        Search docs
      </label>
      <input
        id="mobile-docs-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search documentation…"
        className="h-10 w-full rounded-xl border border-border-subtle bg-surface-0 px-3 text-sm text-text-heading outline-none placeholder:text-text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        autoComplete="off"
      />
      {normalizedQuery && (
        <SearchResults results={results} query={normalizedQuery} compact onNavigate={onNavigate} />
      )}
    </div>
  );
}

function SearchResults({
  results,
  query,
  compact = false,
  onNavigate,
}: {
  results: DocsSearchItem[];
  query: string;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  if (results.length === 0) {
    return (
      <p className="px-3 py-4 text-sm text-text-muted">
        No docs found{query ? ` for “${query}”` : ""}.
      </p>
    );
  }

  return (
    <div className={compact ? "grid gap-1" : "max-h-96 overflow-y-auto p-2"}>
      {results.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-2 focus:bg-surface-2 focus:outline-none"
        >
          <span className="flex items-center justify-between gap-3">
            <span className="font-semibold text-text-heading">{item.title}</span>
            <span className="shrink-0 text-xs text-text-muted">{item.section}</span>
          </span>
          <span className="mt-1 block text-xs leading-5 text-text-secondary">
            {item.description}
          </span>
        </Link>
      ))}
    </div>
  );
}
