"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MobileDocsSearch, type DocsSearchItem } from "./docs-search";
import type { DocsNavSection } from "../lib/docs";

interface MobileSidebarProps {
  sections: DocsNavSection[];
  searchItems: DocsSearchItem[];
}

export function MobileSidebar({ sections, searchItems }: MobileSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const currentItem = sections
    .flatMap((section) => section.items)
    .find((item) => item.href === pathname);
  const activeSection = getActiveSection(sections, pathname);
  const visibleSections = activeSection ? [activeSection] : sections;

  return (
    <details
      className="group border-b border-border-subtle bg-surface-1/95 px-4 py-3 shadow-rest lg:hidden"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-text-heading">
        <span>
          Browse docs
          {currentItem ? (
            <span className="ml-2 font-normal text-text-muted">/ {currentItem.title}</span>
          ) : null}
        </span>
        <span
          className="text-text-muted transition-transform group-open:rotate-180"
          aria-hidden="true"
        >
          ↓
        </span>
      </summary>
      <nav className="mt-3 grid gap-4" aria-label="Mobile documentation navigation">
        <MobileDocsSearch items={searchItems} onNavigate={() => setOpen(false)} />
        {visibleSections.map((section) => (
          <div key={section.title}>
            <p className="px-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
              {section.title}
            </p>
            <div className="mt-1 grid gap-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-2 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-surface-3 font-semibold text-text-heading"
                        : "text-text-secondary hover:bg-surface-2 hover:text-text-heading",
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </details>
  );
}

function getActiveSection(sections: DocsNavSection[], pathname: string) {
  const exactSection = sections.find((section) =>
    section.items.some((item) => item.href === pathname),
  );

  if (exactSection) {
    return exactSection;
  }

  const segment = pathname.split("/").filter(Boolean)[0];

  return sections.find((section) =>
    section.items.some((item) => item.href.split("/").filter(Boolean)[0] === segment),
  );
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
