import Link from "next/link";
import type { ReactNode } from "react";

import { CodeBlock } from "../components/code-block";
import { ComponentPreview } from "../components/component-preview";
import { StorybookLink } from "../components/storybook-link";
import {
  componentFrontmatterPolicy,
  componentPageTemplateSections,
  docsNavigationSections,
  docsSourceOfTruthPolicy,
} from "./content-policy";

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

export const docsNavSections: DocsNavSection[] = docsNavigationSections.map((section) => ({
  title: section.title,
  items: section.items.map(({ title, href }) => ({ title, href })),
}));

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
    title: "Theming",
    description: "Understand the shared token contract for application themes.",
    slug: ["guide", "theming"],
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
  ...[
    ["accessibility", "Accessibility"],
    ["copy-and-localization", "Copy & localization"],
    ["release-and-versioning", "Release & versioning"],
    ["local-package-consumption", "Local package consumption"],
  ].map(([slug, title]) => ({
    title,
    description: `${title} guidance summarized from the internal source documents.`,
    slug: ["guide", slug],
    headings: shellHeadings,
    content: <InitialShellContent />,
  })),
  ...["colors", "typography", "spacing", "radius", "shadow", "motion"].map((name) => ({
    title: toTitle(name),
    description: `Initial ${name} foundation page scaffold backed by shared tokens.`,
    slug: ["foundations", name],
    headings: shellHeadings,
    content: <InitialShellContent />,
  })),
  {
    title: "Button",
    description: "Trigger an action, submit a form, or navigate with a clear affordance.",
    slug: ["components", "button"],
    headings: [
      { id: "overview", title: "Overview" },
      { id: "import", title: "Import" },
      { id: "basic-usage", title: "Basic usage" },
      { id: "variants", title: "Variants" },
      { id: "states", title: "States" },
      { id: "accessibility", title: "Accessibility" },
      { id: "props", title: "Props" },
      { id: "storybook", title: "Storybook" },
    ],
    content: <ButtonDocsContent />,
  },
  ...["input", "card", "badge", "checkbox", "switch", "select", "dialog"].map((name) => ({
    title: toTitle(name),
    description: `Initial ${toTitle(name)} component page scaffold for the docs shell.`,
    slug: ["components", name],
    headings: shellHeadings,
    content: <InitialShellContent />,
  })),
  {
    title: "Forms",
    description: "Composition guidance for form fields and validation patterns.",
    slug: ["patterns", "forms"],
    headings: shellHeadings,
    content: <InitialShellContent />,
  },
  {
    title: "Component API",
    description: "Component page IA, frontmatter, template, and source-of-truth policy.",
    slug: ["reference", "components"],
    headings: [
      { id: "frontmatter", title: "Frontmatter" },
      { id: "component-template", title: "Component template" },
      { id: "source-of-truth", title: "Source of truth" },
    ],
    content: <ComponentReferenceContent />,
  },
  {
    title: "Tokens",
    description: "Token metadata and JSON API references will live here in Phase 2.",
    slug: ["reference", "tokens"],
    headings: shellHeadings,
    content: <InitialShellContent />,
  },
  {
    title: "Release notes",
    description: "Changelog and release summary entry point for Nexu Design packages.",
    slug: ["changelog"],
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

function ComponentReferenceContent() {
  return (
    <>
      <h2 id="frontmatter">Frontmatter</h2>
      <p>
        MDX pages use the Fumadocs schema in <code>apps/docs/source.config.ts</code>. Component
        pages must identify the public API inventory item, package import, Storybook story, runnable
        example ids, source files, and source documents before the page can move beyond draft
        status.
      </p>
      <div className="not-prose my-6 rounded-xl border border-border-subtle bg-card p-5 shadow-rest">
        <h3 className="text-base font-semibold text-text-heading">Required fields</h3>
        <p className="mt-2 text-sm text-text-secondary">
          {componentFrontmatterPolicy.required.join(", ")}
        </p>
        <h3 className="mt-5 text-base font-semibold text-text-heading">Optional fields</h3>
        <p className="mt-2 text-sm text-text-secondary">
          {componentFrontmatterPolicy.optional.join(", ")}
        </p>
        <p className="mt-5 text-sm text-text-secondary">{componentFrontmatterPolicy.notes}</p>
      </div>
      <h2 id="component-template">Component template</h2>
      <p>
        Component pages follow a reusable outline so the docs, metadata APIs, Storybook links, and
        future <code>llms.txt</code> outputs can share the same shape.
      </p>
      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border-subtle bg-card shadow-rest">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-surface-2 text-xs uppercase tracking-wider text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Section</th>
              <th className="px-4 py-3 font-semibold">Required</th>
              <th className="px-4 py-3 font-semibold">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {componentPageTemplateSections.map((section) => (
              <tr key={section.id}>
                <td className="px-4 py-3 font-medium text-text-heading">{section.title}</td>
                <td className="px-4 py-3 text-text-secondary">{section.required ? "Yes" : "No"}</td>
                <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                  {section.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 id="source-of-truth">Source of truth</h2>
      <p>
        During Phase 1, existing <code>docs/*.md</code> files remain the authoritative maintainer
        policies. Docs pages should summarize them for consumers and link back rather than fork a
        second policy.
      </p>
      <ul>
        {docsSourceOfTruthPolicy.map((item) => (
          <li key={item.source}>
            <code>{item.source}</code> feeds {item.docsDestinations.join(", ")}. {item.policy}
          </li>
        ))}
      </ul>
    </>
  );
}

const buttonImportSnippet = "import { Button } from '@nexu-design/ui-web';";

const buttonProps = [
  {
    name: "variant",
    type: "'default' | 'brand' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'destructive' | 'link'",
    defaultValue: "'default'",
    description: "Visual style and emphasis level for the action.",
  },
  {
    name: "size",
    type: "'xs' | 'sm' | 'md' | 'lg' | 'inline' | 'icon' | 'icon-sm'",
    defaultValue: "'md'",
    description: "Control height, padding, and type scale preset.",
  },
  {
    name: "loading",
    type: "boolean",
    defaultValue: "false",
    description: "Shows a spinner and disables native button interaction while work is pending.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Disables the button for unavailable actions.",
  },
  {
    name: "leadingIcon",
    type: "ReactNode",
    defaultValue: "—",
    description: "Icon before the label, reserved for identity or verb meaning.",
  },
  {
    name: "trailingIcon",
    type: "ReactNode",
    defaultValue: "—",
    description: "Icon after the label, reserved for direction or outcome.",
  },
  {
    name: "asChild",
    type: "boolean",
    defaultValue: "false",
    description: "Renders through Radix Slot for link-like or custom element composition.",
  },
];

function ButtonDocsContent() {
  return (
    <>
      <h2 id="overview">Overview</h2>
      <p>
        Use <code>Button</code> for explicit user actions: saving changes, starting flows,
        confirming destructive work, or linking to a next destination when the action needs button
        affordance. Button renders a native <code>button</code> by default and supports variants,
        sizes, icons, loading, disabled state, and <code>asChild</code> composition.
      </p>
      <h2 id="import">Import</h2>
      <CodeBlock code={buttonImportSnippet} title="Import" />
      <h2 id="basic-usage">Basic usage</h2>
      <ComponentPreview id="button/basic" />
      <h2 id="variants">Variants</h2>
      <p>
        Choose one high-emphasis action per group, then use outline, ghost, or secondary variants
        for supporting actions. Reserve destructive for irreversible work.
      </p>
      <ComponentPreview id="button/variants" />
      <h2 id="states">States</h2>
      <p>
        Pair <code>loading</code> with async work so users cannot submit twice. Use disabled for
        unavailable actions and explain the prerequisite nearby when it is not obvious.
      </p>
      <ComponentPreview id="button/loading" />
      <h2 id="accessibility">Accessibility</h2>
      <ul>
        <li>Renders a native button by default, preserving keyboard and form behavior.</li>
        <li>
          Loading native buttons are disabled to prevent duplicate submission while keeping the
          visible label in place.
        </li>
        <li>
          Icon-only buttons must include an accessible label with <code>aria-label</code>.
        </li>
        <li>
          When using <code>asChild</code> for links, keep the child element accessible and avoid
          presenting disabled links as interactive controls.
        </li>
      </ul>
      <h2 id="props">Props</h2>
      <p>
        Button also accepts native <code>button</code> HTML attributes such as <code>type</code>,
        <code> onClick</code>, and <code>aria-*</code> props.
      </p>
      <ButtonPropsTable />
      <h2 id="storybook">Storybook</h2>
      <StorybookLink component="button" />
    </>
  );
}

function ButtonPropsTable() {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border-subtle bg-card shadow-rest">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-surface-2 text-xs uppercase tracking-wider text-text-muted">
          <tr>
            <th className="px-4 py-3 font-semibold">Prop</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Default</th>
            <th className="px-4 py-3 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {buttonProps.map((prop) => (
            <tr key={prop.name}>
              <td className="px-4 py-3 align-top font-mono text-xs text-text-heading">
                {prop.name}
              </td>
              <td className="max-w-xs px-4 py-3 align-top font-mono text-xs leading-5 text-text-secondary">
                {prop.type}
              </td>
              <td className="px-4 py-3 align-top font-mono text-xs text-text-secondary">
                {prop.defaultValue}
              </td>
              <td className="px-4 py-3 align-top text-text-secondary">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
