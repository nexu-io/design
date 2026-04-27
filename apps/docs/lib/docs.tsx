import Link from "next/link";
import type { ReactNode } from "react";

export interface DocsNavItem {
  title: string;
  href: string;
}

export interface DocsNavSection {
  title: string;
  items: DocsNavItem[];
}

export interface DocsHeading {
  id: string;
  title: string;
}

export interface DocsPage {
  title: string;
  description: string;
  slug: string[];
  headings: DocsHeading[];
  content: ReactNode;
}

export const docsNavSections: DocsNavSection[] = [
  {
    title: "Guide",
    items: [
      { title: "Introduction", href: "/guide/introduction" },
      { title: "Installation", href: "/guide/installation" },
      { title: "Styling", href: "/guide/styling" },
      { title: "Dark mode", href: "/guide/dark-mode" },
    ],
  },
  {
    title: "Foundations",
    items: [
      { title: "Colors", href: "/foundations/colors" },
      { title: "Typography", href: "/foundations/typography" },
      { title: "Spacing", href: "/foundations/spacing" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Button", href: "/components/button" },
      { title: "Input", href: "/components/input" },
      { title: "Card", href: "/components/card" },
      { title: "Badge", href: "/components/badge" },
    ],
  },
  {
    title: "Reference",
    items: [
      { title: "Component API", href: "/reference/components" },
      { title: "Tokens", href: "/reference/tokens" },
    ],
  },
];

const shellHeadings: DocsHeading[] = [
  { id: "navigation", title: "Navigation" },
  { id: "theme", title: "Theme" },
  { id: "next-steps", title: "Next steps" },
];

export const docsPages: DocsPage[] = [
  {
    title: "Introduction",
    description: "The product documentation home for Nexu Design consumers.",
    slug: ["guide", "introduction"],
    headings: shellHeadings,
    content: <InitialShellContent />,
  },
  {
    title: "Installation",
    description: "Install the packages and import the shared styles entrypoint.",
    slug: ["guide", "installation"],
    headings: [
      { id: "packages", title: "Packages" },
      { id: "styles", title: "Styles" },
    ],
    content: (
      <>
        <h2 id="packages">Packages</h2>
        <p>
          Applications consume the UI and token packages from the workspace or published package
          registry.
        </p>
        <pre>
          <code>pnpm add @nexu-design/ui-web @nexu-design/tokens</code>
        </pre>
        <h2 id="styles">Styles</h2>
        <p>Import the UI package CSS once near the application root.</p>
        <pre>
          <code>{"import '@nexu-design/ui-web/styles.css'"}</code>
        </pre>
      </>
    ),
  },
  {
    title: "Styling",
    description: "Use Nexu semantic CSS variables and component classes consistently.",
    slug: ["guide", "styling"],
    headings: shellHeadings,
    content: <InitialShellContent />,
  },
  {
    title: "Dark mode",
    description: "Dark mode uses the shared `.dark` token contract.",
    slug: ["guide", "dark-mode"],
    headings: [
      { id: "token-contract", title: "Token contract" },
      { id: "toggle", title: "Toggle" },
    ],
    content: (
      <>
        <h2 id="token-contract">Token contract</h2>
        <p>
          The docs shell toggles the <code>.dark</code> class on the document element, reusing the
          same dark variables shipped by <code>@nexu-design/tokens/styles.css</code>.
        </p>
        <h2 id="toggle">Toggle</h2>
        <p>
          The header control persists theme selection in local storage while still respecting system
          preference on first visit.
        </p>
      </>
    ),
  },
  ...["colors", "typography", "spacing"].map((name) => ({
    title: toTitle(name),
    description: `Initial ${name} foundation page scaffold backed by shared tokens.`,
    slug: ["foundations", name],
    headings: shellHeadings,
    content: <InitialShellContent />,
  })),
  ...["button", "input", "card", "badge"].map((name) => ({
    title: toTitle(name),
    description: `Initial ${toTitle(name)} component page scaffold for the docs shell.`,
    slug: ["components", name],
    headings: shellHeadings,
    content: <InitialShellContent />,
  })),
  {
    title: "Component API",
    description: "Curated component API inventory will live here in Phase 1.",
    slug: ["reference", "components"],
    headings: shellHeadings,
    content: <InitialShellContent />,
  },
  {
    title: "Tokens",
    description: "Token metadata and JSON API references will live here in Phase 2.",
    slug: ["reference", "tokens"],
    headings: shellHeadings,
    content: <InitialShellContent />,
  },
];

export function getPageBySlug(slug: string[] = ["guide", "introduction"]) {
  return docsPages.find((page) => page.slug.join("/") === slug.join("/"));
}

function InitialShellContent() {
  return (
    <>
      <h2 id="navigation">Navigation</h2>
      <p>
        The initial shell establishes stable header, sidebar, content, and page-outline regions so
        future MDX content can be added without reworking layout primitives.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border-subtle bg-card p-5 shadow-rest">
          <h3>Consumer docs</h3>
          <p>Guide, foundation, and component pages use root-level URLs.</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-card p-5 shadow-rest">
          <h3>Storybook remains</h3>
          <p>Storybook stays focused on QA, states, and visual review.</p>
        </div>
      </div>
      <h2 id="theme">Theme</h2>
      <p>
        This site imports <code>@nexu-design/ui-web/styles.css</code>, which imports token CSS and
        provides the same semantic color, spacing, radius, shadow, and typography variables used by
        the component library.
      </p>
      <h2 id="next-steps">Next steps</h2>
      <p>
        Upcoming tasks will add the typed examples registry and replace these scaffolds with rich
        component documentation.
      </p>
    </>
  );
}

function toTitle(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function HomeCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <HomeCard eyebrow="Guide" title="Start with installation" href="/guide/installation">
        Import packages, styles, and theme primitives correctly.
      </HomeCard>
      <HomeCard eyebrow="Tokens" title="Browse foundations" href="/foundations/colors">
        Colors, typography, spacing, radius, shadow, and motion.
      </HomeCard>
      <HomeCard eyebrow="Components" title="Use real primitives" href="/components/button">
        Docs render the same UI package that applications consume.
      </HomeCard>
    </div>
  );
}

function HomeCard({
  eyebrow,
  title,
  href,
  children,
}: {
  eyebrow: string;
  title: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-1/80 p-5 shadow-rest">
      <p className="mb-3 w-fit rounded-full bg-brand-subtle px-2 py-1 text-xs font-semibold text-brand-primary">
        {eyebrow}
      </p>
      <h2 className="text-xl font-semibold text-text-heading">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{children}</p>
      <Link
        href={href}
        className="mt-5 inline-flex h-8 items-center rounded-lg border border-input bg-foreground/[0.03] px-3 text-sm font-semibold text-foreground hover:bg-foreground/[0.06]"
      >
        Open page
      </Link>
    </div>
  );
}
