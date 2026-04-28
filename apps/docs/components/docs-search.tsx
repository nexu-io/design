"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
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

  useEffect(() => {
    setActiveIndex(results.length > 0 ? 0 : -1);
  }, [results]);

  function navigateToResult(index: number) {
    const result = results[index];

    if (!result) {
      return;
    }

    setIsOpen(false);
    router.push(result.href);
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      if (isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }

      return;
    }

    if (results.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current <= 0 ? results.length - 1 : current - 1));
      return;
    }

    if (event.key === "Enter" && isOpen && activeIndex >= 0) {
      event.preventDefault();
      navigateToResult(activeIndex);
    }
  }

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
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleInputKeyDown}
        placeholder="Search components, guides, tokens…"
        className="h-10 w-full rounded-xl border border-border-subtle bg-surface-1 px-10 text-sm text-text-heading shadow-rest outline-none transition placeholder:text-text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        autoComplete="off"
        aria-expanded={isOpen}
        aria-controls="docs-search-results"
        aria-activedescendant={activeIndex >= 0 ? `docs-search-result-${activeIndex}` : undefined}
      />
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
        aria-hidden="true"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border-subtle bg-surface-2 px-1.5 py-0.5 text-[0.65rem] font-semibold text-text-muted sm:block">
        /
      </kbd>
      {isOpen && (query || results.length > 0) && (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-border-subtle bg-surface-0 shadow-floating">
          <SearchResults
            id="docs-search-results"
            resultIdPrefix="docs-search-result"
            results={results}
            query={normalizedQuery}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
          />
        </div>
      )}
    </div>
  );
}

export function MobileDocsSearch({ items, onNavigate }: DocsSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
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

  useEffect(() => {
    setActiveIndex(results.length > 0 ? 0 : -1);
  }, [results]);

  function navigateToResult(index: number) {
    const result = results[index];

    if (!result) {
      return;
    }

    setIsOpen(false);
    onNavigate?.();
    router.push(result.href);
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      if (isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }

      return;
    }

    if (results.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current <= 0 ? results.length - 1 : current - 1));
      return;
    }

    if (event.key === "Enter" && isOpen && activeIndex >= 0) {
      event.preventDefault();
      navigateToResult(activeIndex);
    }
  }

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
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleInputKeyDown}
        placeholder="Search documentation…"
        className="h-10 w-full rounded-xl border border-border-subtle bg-surface-0 px-3 text-sm text-text-heading outline-none placeholder:text-text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        autoComplete="off"
        aria-expanded={isOpen}
        aria-controls="mobile-docs-search-results"
        aria-activedescendant={
          activeIndex >= 0 ? `mobile-docs-search-result-${activeIndex}` : undefined
        }
      />
      {isOpen && normalizedQuery && (
        <SearchResults
          id="mobile-docs-search-results"
          resultIdPrefix="mobile-docs-search-result"
          results={results}
          query={normalizedQuery}
          compact
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          onNavigate={() => {
            setIsOpen(false);
            onNavigate?.();
          }}
        />
      )}
    </div>
  );
}

function SearchResults({
  id,
  resultIdPrefix,
  results,
  query,
  compact = false,
  activeIndex,
  onActiveIndexChange,
  onNavigate,
}: {
  id: string;
  resultIdPrefix: string;
  results: DocsSearchItem[];
  query: string;
  compact?: boolean;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
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
    <div id={id} className={compact ? "grid gap-1" : "max-h-96 overflow-y-auto p-2"}>
      {results.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <Link
            key={item.href}
            id={`${resultIdPrefix}-${index}`}
            href={item.href}
            onClick={onNavigate}
            onMouseEnter={() => onActiveIndexChange(index)}
            className={`block rounded-lg px-3 py-2 text-sm focus:outline-none ${
              isActive ? "bg-surface-2" : "hover:bg-surface-2 focus:bg-surface-2"
            }`}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="font-semibold text-text-heading">{item.title}</span>
              <span className="shrink-0 text-xs text-text-muted">{item.section}</span>
            </span>
            <span className="mt-1 block text-xs leading-5 text-text-secondary">
              {item.description}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
