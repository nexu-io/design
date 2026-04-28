import Link from "next/link";

import { DocsSearch } from "./docs-search";
import {
  docsNavSections,
  docsSearchItems,
  type DocsHeading,
  type DocsNavSection,
} from "../lib/docs";
import { getStorybookHomeUrl } from "../lib/storybook";
import { MobileSidebar } from "./mobile-sidebar";
import { ThemeToggle } from "./theme-toggle";

interface DocsShellProps {
  title: string;
  description: string;
  headings: DocsHeading[];
  pathname: string;
  children: React.ReactNode;
}

export function DocsShell({ title, description, headings, pathname, children }: DocsShellProps) {
  const activeSection = getActiveSection(pathname);

  return (
    <div className="min-h-screen">
      <DocsHeader pathname={pathname} />
      <MobileSidebar sections={docsNavSections} searchItems={docsSearchItems} />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[17rem_minmax(0,1fr)_13rem] lg:px-8">
        <DocsSidebar activeSection={activeSection} pathname={pathname} />
        <main className="min-w-0">
          <div className="mb-10 border-b border-border-subtle pb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-primary">
              Documentation
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-text-heading sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-text-secondary">{description}</p>
          </div>
          <article className="docs-prose max-w-none">{children}</article>
        </main>
        <TableOfContents headings={headings} />
      </div>
    </div>
  );
}

export function DocsHeader({ pathname = "/" }: { pathname?: string }) {
  const storybookUrl = getStorybookHomeUrl();
  const activeSection = getActiveSection(pathname);
  const componentsActive = activeSection?.title === "Components";

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface-0/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Nexu Design home">
          <span className="grid size-8 place-items-center rounded-xl bg-accent text-sm font-bold text-accent-foreground shadow-rest">
            N
          </span>
          <span>
            <span className="block text-sm font-semibold text-text-heading">Nexu Design</span>
            <span className="hidden text-xs text-text-muted sm:block">Components and tokens</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {docsNavSections.map((section) => {
            const active = activeSection?.title === section.title;

            return (
              <Link
                key={section.title}
                href={section.items[0]?.href ?? "/"}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-surface-3 text-text-heading"
                    : "text-text-secondary hover:bg-surface-2 hover:text-text-heading",
                )}
              >
                {section.title}
              </Link>
            );
          })}
        </nav>
        <div className="hidden min-w-0 flex-1 justify-center lg:flex">
          <DocsSearch items={docsSearchItems} />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/components/button"
            aria-current={componentsActive ? "page" : undefined}
            className={cn(
              "hidden rounded-md px-3 py-2 text-sm font-medium transition-colors sm:inline-flex lg:hidden",
              componentsActive
                ? "bg-surface-3 text-text-heading"
                : "text-text-secondary hover:bg-surface-2 hover:text-text-heading",
            )}
          >
            Components
          </Link>
          <Link
            href={storybookUrl}
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-heading sm:inline-flex"
          >
            Storybook
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function DocsSidebar({
  activeSection,
  pathname,
}: {
  activeSection: DocsNavSection | undefined;
  pathname: string;
}) {
  if (!activeSection) {
    return null;
  }

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] overflow-y-auto pr-4 lg:block">
      <nav className="grid gap-6" aria-label={`${activeSection.title} navigation`}>
        <div>
          <h2 className="px-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
            {activeSection.title}
          </h2>
          <div className="mt-2 grid gap-1">
            {activeSection.items.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-2 py-2 text-sm transition-colors",
                    active
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
      </nav>
    </aside>
  );
}

function getActiveSection(pathname: string) {
  const exactSection = docsNavSections.find((section) =>
    section.items.some((item) => item.href === pathname),
  );

  if (exactSection) {
    return exactSection;
  }

  const segment = pathname.split("/").filter(Boolean)[0];

  return docsNavSections.find((section) =>
    section.items.some((item) => item.href.split("/").filter(Boolean)[0] === segment),
  );
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function TableOfContents({ headings }: { headings: DocsHeading[] }) {
  return (
    <aside className="sticky top-20 hidden h-fit xl:block">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        On this page
      </h2>
      <nav className="mt-3 grid gap-2" aria-label="Table of contents">
        {headings.length > 0 ? (
          headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className="border-l border-border-subtle pl-3 text-sm text-text-secondary hover:border-brand-primary hover:text-text-heading"
            >
              {heading.title}
            </a>
          ))
        ) : (
          <p className="text-sm text-text-muted">No page sections yet.</p>
        )}
      </nav>
    </aside>
  );
}
