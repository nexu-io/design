"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DocsNavSection } from "../lib/docs";

interface MobileSidebarProps {
  sections: DocsNavSection[];
}

export function MobileSidebar({ sections }: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <details className="group border-b border-border-subtle bg-surface-1/95 px-4 py-3 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-text-heading">
        Browse docs
        <span
          className="text-text-muted transition-transform group-open:rotate-180"
          aria-hidden="true"
        >
          ↓
        </span>
      </summary>
      <nav className="mt-3 grid gap-4" aria-label="Mobile documentation navigation">
        {sections.map((section) => (
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
                    className={
                      isActive
                        ? "rounded-md bg-surface-3 px-2 py-2 text-sm font-semibold text-text-heading"
                        : "rounded-md px-2 py-2 text-sm text-text-secondary hover:bg-surface-2 hover:text-text-heading"
                    }
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
