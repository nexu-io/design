import Link from "next/link";
import type { ReactNode } from "react";
import {
  fontSizeTokens,
  themeVariables,
  type FontSizeToken,
  type TextStyleDefinition,
  type TokenDefinition,
} from "@nexu-design/tokens";

import { CodeBlock } from "../components/code-block";
import { ComponentPreview } from "../components/component-preview";
import { StorybookLink } from "../components/storybook-link";
import {
  componentFrontmatterPolicy,
  componentPageTemplateSections,
  docsNavigationSections,
  docsSourceOfTruthPolicy,
} from "./content-policy";
import {
  componentMetadata,
  getTokenMetadataPage,
  metadataSourceFiles,
  type ComponentMetadata,
  type PropMetadata,
} from "./docs-metadata";
import { publicApiInventory } from "./public-api-inventory";
import { getStorybookHomeUrl } from "./storybook";

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

type FoundationToken = Omit<TokenDefinition, "value"> & {
  value: string | number;
};

export const docsNavSections: DocsNavSection[] = docsNavigationSections.map((section) => ({
  title: section.title,
  items: section.items.map(({ title, href }) => ({ title, href })),
}));

const shellHeadings: DocsHeading[] = [
  { id: "navigation", title: "Navigation" },
  { id: "theme", title: "Theme" },
  { id: "next-steps", title: "Next steps" },
];

const guideHeadings: DocsHeading[] = [
  { id: "summary", title: "Summary" },
  { id: "consumer-guidance", title: "Consumer guidance" },
  { id: "source-documents", title: "Source documents" },
];

const foundationHeadings: DocsHeading[] = [
  { id: "overview", title: "Overview" },
  { id: "tokens", title: "Tokens" },
  { id: "usage", title: "Usage" },
  { id: "source", title: "Source" },
];

const foundationPages: DocsPage[] = [
  {
    title: "Colors",
    description: "Semantic color, surface, border, text, dark-surface, and accent variables.",
    slug: ["foundations", "colors"],
    headings: foundationHeadings,
    content: <ColorsFoundationContent />,
  },
  {
    title: "Typography",
    description:
      "Font families, type scale, weights, and text-style recipes from token source data.",
    slug: ["foundations", "typography"],
    headings: foundationHeadings,
    content: <TypographyFoundationContent />,
  },
  {
    title: "Spacing",
    description: "The base spacing unit and named spacing steps used for layout rhythm.",
    slug: ["foundations", "spacing"],
    headings: foundationHeadings,
    content: <SpacingFoundationContent />,
  },
  {
    title: "Radius",
    description: "Corner-radius variables for controls, cards, overlays, and pill shapes.",
    slug: ["foundations", "radius"],
    headings: foundationHeadings,
    content: <RadiusFoundationContent />,
  },
  {
    title: "Shadow",
    description: "Elevation variables for cards, focus, dropdowns, overlays, and hover lift.",
    slug: ["foundations", "shadow"],
    headings: foundationHeadings,
    content: <ShadowFoundationContent />,
  },
  {
    title: "Motion",
    description: "Shared duration and easing variables for consistent UI transitions.",
    slug: ["foundations", "motion"],
    headings: foundationHeadings,
    content: <MotionFoundationContent />,
  },
];

const componentHeadings: DocsHeading[] = [
  { id: "overview", title: "Overview" },
  { id: "import", title: "Import" },
  { id: "examples", title: "Examples" },
  { id: "accessibility", title: "Accessibility" },
  { id: "props", title: "Props" },
  { id: "storybook", title: "Storybook" },
];

export const docsPages: DocsPage[] = [
  {
    title: "Introduction",
    description: "The product documentation home for Nexu Design consumers.",
    slug: ["guide", "introduction"],
    headings: guideHeadings,
    content: <IntroductionGuideContent />,
  },
  {
    title: "Installation",
    description: "Install the packages and import the shared styles entrypoint.",
    slug: ["guide", "installation"],
    headings: [
      { id: "summary", title: "Summary" },
      { id: "packages", title: "Packages" },
      { id: "styles", title: "Styles" },
      { id: "source-documents", title: "Source documents" },
    ],
    content: <InstallationGuideContent />,
  },
  {
    title: "Styling",
    description: "Use Nexu semantic CSS variables and component classes consistently.",
    slug: ["guide", "styling"],
    headings: guideHeadings,
    content: <StylingGuideContent />,
  },
  {
    title: "Theming",
    description: "Understand the shared token contract for application themes.",
    slug: ["guide", "theming"],
    headings: guideHeadings,
    content: <ThemingGuideContent />,
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
  {
    title: "Accessibility",
    description: "Accessible component usage guidance summarized from source policy.",
    slug: ["guide", "accessibility"],
    headings: guideHeadings,
    content: <AccessibilityGuideContent />,
  },
  {
    title: "Copy & localization",
    description: "Product copy and localization boundaries for Nexu Design consumers.",
    slug: ["guide", "copy-and-localization"],
    headings: guideHeadings,
    content: <CopyLocalizationGuideContent />,
  },
  {
    title: "Release & versioning",
    description: "Changesets, versioning, validation, and publish flow guidance.",
    slug: ["guide", "release-and-versioning"],
    headings: guideHeadings,
    content: <ReleaseVersioningGuideContent />,
  },
  {
    title: "Local package consumption",
    description: "Use workspace or file dependencies while developing against local packages.",
    slug: ["guide", "local-package-consumption"],
    headings: guideHeadings,
    content: <LocalConsumptionGuideContent />,
  },
  {
    title: "AI agents",
    description: "Static machine-readable docs surfaces and current agent support scope.",
    slug: ["guide", "ai-agents"],
    headings: [
      { id: "summary", title: "Summary" },
      { id: "entrypoints", title: "Entrypoints" },
      { id: "scope", title: "Current scope" },
      { id: "limits", title: "Limits" },
      { id: "source-documents", title: "Source documents" },
    ],
    content: <AiAgentsGuideContent />,
  },
  ...foundationPages,
  ...componentMetadata.map((component) => ({
    title: component.title,
    description: component.description,
    slug: component.docsSlug.split("/").filter(Boolean),
    headings: componentHeadings,
    content: <ComponentDocsContent component={component} />,
  })),
  {
    title: "Component API",
    description: "Component page IA, frontmatter, template, and source-of-truth policy.",
    slug: ["reference", "components"],
    headings: [
      { id: "frontmatter", title: "Frontmatter" },
      { id: "public-inventory", title: "Public API inventory" },
      { id: "component-template", title: "Component template" },
      { id: "source-of-truth", title: "Source of truth" },
    ],
    content: <ComponentReferenceContent />,
  },
  {
    title: "Tokens",
    description: "Token metadata reference page placeholder for the shared docs metadata model.",
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

export const docsSearchItems = docsPages.map((page) => {
  const href = `/${page.slug.join("/")}`;
  const section =
    docsNavSections.find((navSection) => navSection.items.some((item) => item.href === href))
      ?.title ?? "Docs";

  return {
    title: page.title,
    description: page.description,
    href,
    section,
    headings: page.headings.map((heading) => heading.title),
  };
});

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

function IntroductionGuideContent() {
  return (
    <>
      <h2 id="summary">Summary</h2>
      <p>
        Nexu Design docs are the consumer-facing layer for installation, foundations, components,
        patterns, and reference material. The source policy remains in repository markdown files;
        guide pages summarize that policy and link back when maintainers need the complete workflow.
      </p>
      <h2 id="consumer-guidance">Consumer guidance</h2>
      <ul>
        <li>Start with installation, then import the shared stylesheet once at the app root.</li>
        <li>Use semantic tokens for color, spacing, radius, shadow, and typography decisions.</li>
        <li>Prefer documented primitives and patterns over custom low-level behavior.</li>
        <li>Use Storybook for state matrices and visual QA; use docs for product integration.</li>
      </ul>
      <h2 id="source-documents">Source documents</h2>
      <GuideSourceLinks
        sources={[
          "docs/design-system-guidelines.md",
          "docs/component-api-guidelines.md",
          "docs/package-publishing-and-consumption.md",
        ]}
      />
    </>
  );
}

function InstallationGuideContent() {
  return (
    <>
      <h2 id="summary">Summary</h2>
      <p>
        Applications consume <code>@nexu-design/ui-web</code> and <code>@nexu-design/tokens</code>
        from the workspace during development or from the package registry after release. The UI
        package ships compiled JavaScript, declarations, and a compiled stylesheet.
      </p>
      <h2 id="packages">Packages</h2>
      <p>Install both public packages when consuming the design system from a regular app.</p>
      <CodeBlock code="pnpm add @nexu-design/ui-web @nexu-design/tokens" language="bash" />
      <h2 id="styles">Styles</h2>
      <p>
        Import the UI package stylesheet once near the application root. This is the preferred
        entrypoint because it includes the compiled component classes and token CSS expected by
        <code> ui-web</code> components.
      </p>
      <CodeBlock code="import '@nexu-design/ui-web/styles.css';" title="Root stylesheet" />
      <h2 id="source-documents">Source documents</h2>
      <GuideSourceLinks sources={["docs/package-publishing-and-consumption.md"]} />
    </>
  );
}

function StylingGuideContent() {
  return (
    <>
      <h2 id="summary">Summary</h2>
      <p>
        Styling is utility-first and token-driven. Compose existing components with the shared
        <code> cn()</code> helper, CVA variants, and semantic CSS variables instead of duplicating
        visual rules in product code.
      </p>
      <h2 id="consumer-guidance">Consumer guidance</h2>
      <ul>
        <li>Prefer semantic utilities and token variables over one-off colors or pixel values.</li>
        <li>Use CVA-backed variants for repeated component states and emphasis levels.</li>
        <li>
          Keep global CSS at package or app entrypoints; keep component styling in class names.
        </li>
        <li>Use neutral surface tokens for persistent selection and row hover states.</li>
        <li>Match spacing, radius, typography, and shadow choices to the documented hierarchy.</li>
      </ul>
      <h2 id="source-documents">Source documents</h2>
      <GuideSourceLinks sources={["docs/design-system-guidelines.md"]} />
    </>
  );
}

function ThemingGuideContent() {
  return (
    <>
      <h2 id="summary">Summary</h2>
      <p>
        Themes are built from the shared token contract in <code>@nexu-design/tokens</code>. Use
        semantic text, surface, border, brand, semantic-status, radius, shadow, typography, and
        motion variables so applications can change themes without rewriting component markup.
      </p>
      <h2 id="consumer-guidance">Consumer guidance</h2>
      <ul>
        <li>
          Use <code>--color-text-*</code> tokens for readable hierarchy.
        </li>
        <li>
          Layer surfaces from <code>surface-0</code> through <code>surface-4</code> in order.
        </li>
        <li>
          Reserve brand for links, focus, badges, and brand emphasis; use semantic colors for
          status.
        </li>
        <li>Use radius and shadow tokens consistently with component scale and elevation.</li>
        <li>Use motion tokens for hover and transition timing instead of ad hoc durations.</li>
      </ul>
      <h2 id="source-documents">Source documents</h2>
      <GuideSourceLinks sources={["docs/design-system-guidelines.md"]} />
    </>
  );
}

function AccessibilityGuideContent() {
  return (
    <>
      <h2 id="summary">Summary</h2>
      <p>
        Accessibility depends on preserving native and Radix behavior, using components for their
        intended semantics, and keeping labels, error text, focus states, and keyboard behavior
        intact.
      </p>
      <h2 id="consumer-guidance">Consumer guidance</h2>
      <ul>
        <li>
          Use native form semantics and labeled controls; prefer <code>FormField</code> for inputs.
        </li>
        <li>Do not skip heading levels or flatten semantic structure for visual convenience.</li>
        <li>
          Keep icon-only controls labeled with <code>aria-label</code> or visible text.
        </li>
        <li>Use the right primitive for the interaction: menus for actions, selects for values.</li>
        <li>Localize dates, numbers, currency, and pluralization with locale-aware formatting.</li>
      </ul>
      <h2 id="source-documents">Source documents</h2>
      <GuideSourceLinks
        sources={["docs/design-system-guidelines.md", "docs/copy-and-localization.md"]}
      />
    </>
  );
}

function CopyLocalizationGuideContent() {
  return (
    <>
      <h2 id="summary">Summary</h2>
      <p>
        Product-surface copy is hardcoded English by default unless a feature explicitly requires
        localization. Component-library packages should remain copy-free and receive labels through
        props.
      </p>
      <h2 id="consumer-guidance">Consumer guidance</h2>
      <ul>
        <li>Write shipped UI copy inline unless the surrounding surface is already localized.</li>
        <li>
          Do not add <code>useT()</code>, <code>t()</code>, or another resolver without a
          requirement.
        </li>
        <li>
          User-authored content, mock content, and seed data render in their authored language.
        </li>
        <li>
          Legal, policy, dates, numbers, currencies, and pluralization may need locale-aware
          handling.
        </li>
        <li>Decorative uppercase labels and page-level navigation tabs stay English by default.</li>
      </ul>
      <h2 id="source-documents">Source documents</h2>
      <GuideSourceLinks sources={["docs/copy-and-localization.md"]} />
    </>
  );
}

function ReleaseVersioningGuideContent() {
  return (
    <>
      <h2 id="summary">Summary</h2>
      <p>
        Package releases use Changesets for <code>@nexu-design/tokens</code> and
        <code> @nexu-design/ui-web</code>. Add a changeset for consumer-visible package changes and
        run release readiness checks before publishing.
      </p>
      <h2 id="consumer-guidance">Consumer guidance</h2>
      <ul>
        <li>
          Create a changeset with <code>pnpm changeset</code> for public package changes.
        </li>
        <li>
          Use <code>major</code> for breaking changes and include migration notes.
        </li>
        <li>
          Run <code>pnpm release:check</code> before release-oriented work is considered ready.
        </li>
        <li>Publishable packages release together through the linked Changesets group.</li>
        <li>
          Prefer a patch hotfix over unpublishing; deprecate bad published versions if needed.
        </li>
      </ul>
      <h2 id="source-documents">Source documents</h2>
      <GuideSourceLinks sources={["docs/release-flow.md"]} />
    </>
  );
}

function LocalConsumptionGuideContent() {
  return (
    <>
      <h2 id="summary">Summary</h2>
      <p>
        During development, consume packages through workspace ranges inside a pnpm workspace or
        <code> file:</code> dependencies from another local app. Build packages before relying on
        their publishable <code>dist/</code> outputs.
      </p>
      <h2 id="consumer-guidance">Consumer guidance</h2>
      <ul>
        <li>
          Use <code>workspace:^0.1.0</code> ranges for monorepo consumers.
        </li>
        <li>
          Use <code>file:../path/to/packages/ui-web</code> only for local machine integration.
        </li>
        <li>
          Run <code>pnpm --dir ../design build:packages</code> before consuming file dependencies.
        </li>
        <li>
          Still import <code>@nexu-design/ui-web/styles.css</code> from the consuming app root.
        </li>
      </ul>
      <h2 id="source-documents">Source documents</h2>
      <GuideSourceLinks sources={["docs/package-publishing-and-consumption.md"]} />
    </>
  );
}

function AiAgentsGuideContent() {
  return (
    <>
      <h2 id="summary">Summary</h2>
      <p>
        Nexu Design currently supports AI agents through static, generated docs artifacts. Agents
        should use these surfaces to discover public component and pattern metadata without scraping
        Storybook or source files first.
      </p>
      <h2 id="entrypoints">Entrypoints</h2>
      <ul>
        <li>
          <Link href="/llms.txt">/llms.txt</Link> is the compact text index for LLM context.
        </li>
        <li>
          <Link href="/api/manifest.json">/api/manifest.json</Link> is the structured manifest for
          docs routes, package names, inventory items, Storybook ids, examples, and coverage flags.
        </li>
        <li>
          <Link href="/reference/components">/reference/components</Link> documents the source of
          truth policy for public component pages and frontmatter.
        </li>
      </ul>
      <h2 id="scope">Current scope</h2>
      <ul>
        <li>Discover package import snippets for public primitives, patterns, and utilities.</li>
        <li>Resolve docs slugs and Storybook ids from the curated public API inventory.</li>
        <li>Read coverage flags for docs, examples, Storybook, and provisional props content.</li>
        <li>Use Storybook links for state matrices and visual QA context, not as primary docs.</li>
      </ul>
      <CodeBlock
        title="Recommended static-agent flow"
        code={
          "1. Fetch /llms.txt for a compact overview.\n2. Fetch /api/manifest.json when structured metadata is needed.\n3. Open the linked docs page for usage guidance.\n4. Use Storybook ids only for visual QA or state coverage."
        }
        language="text"
      />
      <h2 id="limits">Limits</h2>
      <ul>
        <li>There is no published MCP server yet; MCP tools are planned for Phase 3.</li>
        <li>
          Shared component, token, example, and props metadata exists internally now; public JSON
          endpoints are still planned as the next step.
        </li>
        <li>
          Props tables on MVP component pages are still provisional even though the shared metadata
          source now removes the previous duplicated docs definitions.
        </li>
        <li>
          Coverage flags describe docs readiness and should not be treated as exhaustive package
          export validation.
        </li>
      </ul>
      <h2 id="source-documents">Source documents</h2>
      <GuideSourceLinks
        sources={["docs/component-api-guidelines.md", "packages/ui-web/COMPONENT_REFERENCE.md"]}
      />
    </>
  );
}

function GuideSourceLinks({ sources }: { sources: string[] }) {
  return (
    <ul className="not-prose my-4 grid gap-2">
      {sources.map((source) => (
        <li key={source} className="flex">
          <Link
            href={`https://github.com/nexu-io/design/blob/main/${source}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-1 px-3 py-2 font-mono text-xs text-brand-primary shadow-rest transition-colors hover:border-border-hover hover:bg-surface-2 hover:underline"
          >
            <span>{source}</span>
            <span aria-hidden="true" className="text-text-muted">
              ↗
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ColorsFoundationContent() {
  const colorPage = getTokenMetadataPage("colors");
  if (!colorPage) return null;

  const colorGroups = colorPage.groups;
  const allColorTokens = colorGroups.flatMap((group) => group.tokens);

  return (
    <FoundationPageIntro
      title="Color tokens"
      description="Use semantic variables instead of fixed hex values so components inherit light, dark, and brand presets. Primitive HSL tokens such as --primary are wrapped with hsl(var(...)); derived --color-* tokens can be used directly."
      usage="Use role-based choices first: surfaces for containers, text levels for hierarchy, borders for separation, semantic colors for state, and accent variables for brand emphasis."
      tokens={allColorTokens}
    >
      <h2 id="tokens">Tokens</h2>
      {colorGroups.map((group) => (
        <TokenSection key={group.title} title={group.title} tokens={group.tokens} preview="color" />
      ))}
    </FoundationPageIntro>
  );
}

function TypographyFoundationContent() {
  const typographyPage = getTokenMetadataPage("typography");
  if (!typographyPage || !("textStyles" in typographyPage)) return null;

  return (
    <FoundationPageIntro
      title="Typography tokens"
      description="Typography tokens define the font stacks, compact UI type scale, and supported weights used by Nexu components. Text-style recipes combine generated Tailwind utilities for common hierarchy roles."
      usage="Use the documented text-size and weight variables through the package utilities; reserve script and heading families for intentional brand moments."
      tokens={typographyPage.groups.flatMap((group) => group.tokens)}
    >
      <h2 id="tokens">Tokens</h2>
      <TokenSection
        title="Font families"
        tokens={typographyPage.groups[0]?.tokens ?? []}
        preview="typography"
      />
      <FontSizeTable tokens={fontSizeTokens} />
      <TokenSection
        title="Weights"
        tokens={typographyPage.groups[2]?.tokens ?? []}
        preview="text"
      />
      <TextStyleRecipes styles={typographyPage.textStyles} />
    </FoundationPageIntro>
  );
}

function SpacingFoundationContent() {
  const spacingPage = getTokenMetadataPage("spacing");
  if (!spacingPage) return null;

  return (
    <FoundationPageIntro
      title="Spacing tokens"
      description="Spacing is based on a 4px unit exposed as --spacing. Shared metadata now provides the supported steps for docs and internal agent artifacts, while public JSON endpoints remain a planned follow-up."
      usage="Prefer the named spacing steps for product layout rhythm; use smaller values for inline controls and larger values for sections or page regions."
      tokens={spacingPage.groups[0]?.tokens ?? []}
    >
      <h2 id="tokens">Tokens</h2>
      <TokenSection
        title="Spacing scale"
        tokens={spacingPage.groups[0]?.tokens ?? []}
        preview="spacing"
      />
    </FoundationPageIntro>
  );
}

function RadiusFoundationContent() {
  const radiusPage = getTokenMetadataPage("radius");
  if (!radiusPage) return null;

  return (
    <FoundationPageIntro
      title="Radius tokens"
      description="Radius tokens set consistent corner geometry for compact controls, cards, panels, modals, hero surfaces, and pills."
      usage="Match radius to component scale: md for default controls, lg/xl for cards and overlays, and pill only for badges or capsules."
      tokens={radiusPage.groups[0]?.tokens ?? []}
    >
      <h2 id="tokens">Tokens</h2>
      <TokenSection
        title="Radius scale"
        tokens={radiusPage.groups[0]?.tokens ?? []}
        preview="radius"
      />
    </FoundationPageIntro>
  );
}

function ShadowFoundationContent() {
  const shadowPage = getTokenMetadataPage("shadow");
  if (!shadowPage) return null;

  return (
    <FoundationPageIntro
      title="Shadow tokens"
      description="Shadow tokens create a restrained elevation scale for rest states, cards, dropdowns, focus rings, overlays, and interactive lift."
      usage="Use the semantic shadows for intent: rest/card for static containers, dropdown/overlay for detached layers, focus for keyboard focus, and refine/elevated for hover or prominent panels."
      tokens={shadowPage.groups[0]?.tokens ?? []}
    >
      <h2 id="tokens">Tokens</h2>
      <TokenSection
        title="Elevation scale"
        tokens={shadowPage.groups[0]?.tokens ?? []}
        preview="shadow"
      />
    </FoundationPageIntro>
  );
}

function MotionFoundationContent() {
  const motionPage = getTokenMetadataPage("motion");
  if (!motionPage) return null;

  return (
    <FoundationPageIntro
      title="Motion tokens"
      description="Motion tokens define the shared transition durations and easing curve for small UI affordances and default component state changes."
      usage="Use fast for hover affordances, normal for default state transitions, and the standard easing curve for consistent acceleration."
      tokens={motionPage.groups[0]?.tokens ?? []}
    >
      <h2 id="tokens">Tokens</h2>
      <TokenSection title="Timing" tokens={motionPage.groups[0]?.tokens ?? []} preview="motion" />
    </FoundationPageIntro>
  );
}

function FoundationPageIntro({
  title,
  description,
  usage,
  tokens,
  children,
}: {
  title: string;
  description: string;
  usage: string;
  tokens: FoundationToken[];
  children: ReactNode;
}) {
  return (
    <>
      <h2 id="overview">Overview</h2>
      <p>{description}</p>
      <div className="not-prose my-6 rounded-xl border border-border-subtle bg-card p-5 shadow-rest">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Source-backed Phase 1 page
        </p>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Token names, descriptions, CSS variables, and shared docs metadata come from
          <code> {metadataSourceFiles.tokens.join(", ")}</code>. Public JSON endpoints for this
          metadata are still planned as a follow-up.
        </p>
      </div>
      {children}
      <h2 id="usage">Usage</h2>
      <p>{usage}</p>
      <CodeBlock
        code={cssVariablesSnippet(tokens)}
        language="css"
        title={`${title} CSS variables`}
      />
      <h2 id="source">Source</h2>
      <GuideSourceLinks
        sources={["packages/tokens/src/token-source.json", "packages/tokens/src/styles.css"]}
      />
    </>
  );
}

function TokenSection({
  title,
  tokens,
  preview,
}: {
  title: string;
  tokens: FoundationToken[];
  preview: "color" | "radius" | "shadow" | "spacing" | "motion" | "typography" | "text";
}) {
  return (
    <section className="not-prose my-6">
      <h3 className="mb-3 text-base font-semibold text-text-heading">{title}</h3>
      <div className="overflow-hidden rounded-xl border border-border-subtle bg-card shadow-rest">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-surface-2 text-xs uppercase tracking-wider text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Preview</th>
              <th className="px-4 py-3 font-semibold">Token</th>
              <th className="px-4 py-3 font-semibold">CSS variable</th>
              <th className="px-4 py-3 font-semibold">Value</th>
              <th className="px-4 py-3 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {tokens.map((token) => (
              <tr key={token.cssVar}>
                <td className="px-4 py-3 align-top">
                  <TokenPreview token={token} kind={preview} />
                </td>
                <td className="px-4 py-3 align-top font-medium text-text-heading">{token.name}</td>
                <td className="px-4 py-3 align-top font-mono text-xs text-text-secondary">
                  {token.cssVar}
                </td>
                <td className="max-w-xs px-4 py-3 align-top font-mono text-xs leading-5 text-text-secondary">
                  {tokenDisplayValue(token)}
                </td>
                <td className="px-4 py-3 align-top text-text-secondary">{token.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TokenPreview({ token, kind }: { token: FoundationToken; kind: string }) {
  if (kind === "color") {
    return (
      <div
        className="h-10 w-16 rounded-lg border border-border-subtle shadow-xs"
        style={{ background: colorPreviewValue(token) }}
      />
    );
  }

  if (kind === "radius") {
    return (
      <div
        className="h-10 w-16 border border-brand-primary bg-brand-subtle"
        style={{ borderRadius: `var(${token.cssVar})` }}
      />
    );
  }

  if (kind === "shadow") {
    return (
      <div
        className="h-10 w-16 rounded-lg border border-border-subtle bg-card"
        style={{ boxShadow: `var(${token.cssVar})` }}
      />
    );
  }

  if (kind === "spacing") {
    return (
      <div className="flex h-10 w-20 items-center rounded-lg bg-surface-2 px-2">
        <div className="h-3 rounded-full bg-brand-primary" style={{ width: token.value }} />
      </div>
    );
  }

  if (kind === "motion") {
    return <div className="h-3 w-16 rounded-full bg-brand-primary transition-all" />;
  }

  if (kind === "typography") {
    return <span style={{ fontFamily: `var(${token.cssVar})` }}>Aa</span>;
  }

  return <span className="font-semibold text-text-heading">Aa</span>;
}

function FontSizeTable({ tokens }: { tokens: FontSizeToken[] }) {
  return (
    <section className="not-prose my-6">
      <h3 className="mb-3 text-base font-semibold text-text-heading">Type scale</h3>
      <div className="overflow-hidden rounded-xl border border-border-subtle bg-card shadow-rest">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-surface-2 text-xs uppercase tracking-wider text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Preview</th>
              <th className="px-4 py-3 font-semibold">Token</th>
              <th className="px-4 py-3 font-semibold">CSS variable</th>
              <th className="px-4 py-3 font-semibold">Size</th>
              <th className="px-4 py-3 font-semibold">Line height</th>
              <th className="px-4 py-3 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {tokens.map((token) => (
              <tr key={token.cssVar}>
                <td className="px-4 py-3 align-top">
                  <span style={{ fontSize: `var(${token.cssVar})`, lineHeight: token.lineHeight }}>
                    Aa
                  </span>
                </td>
                <td className="px-4 py-3 align-top font-medium text-text-heading">{token.name}</td>
                <td className="px-4 py-3 align-top font-mono text-xs text-text-secondary">
                  {token.cssVar}
                </td>
                <td className="px-4 py-3 align-top font-mono text-xs text-text-secondary">
                  {token.value} / {token.px}px
                </td>
                <td className="px-4 py-3 align-top font-mono text-xs text-text-secondary">
                  {token.lineHeight}
                </td>
                <td className="px-4 py-3 align-top text-text-secondary">{token.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TextStyleRecipes({ styles }: { styles: TextStyleDefinition[] }) {
  return (
    <section className="not-prose my-6">
      <h3 className="mb-3 text-base font-semibold text-text-heading">Text-style recipes</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {styles.map((style) => (
          <div
            key={style.name}
            className="rounded-xl border border-border-subtle bg-card p-4 shadow-rest"
          >
            <p className={`${style.size} ${style.weight} ${style.leading} text-text-heading`}>
              {style.name}
            </p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{style.description}</p>
            <p className="mt-3 font-mono text-xs text-text-muted">
              {style.size} {style.weight} {style.leading}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function cssVariablesSnippet(tokens: FoundationToken[]) {
  const lines = tokens.flatMap((token) => {
    const value = cssVariableValue(token);
    const base = [`  ${token.cssVar}: ${value};`];

    if (token.foreground) {
      const cssVar = token.foreground.match(/var\((--[^)]+)\)/)?.[1];
      if (cssVar) {
        const foregroundVar = cssVar as `--${string}`;
        base.push(
          `  ${foregroundVar}: ${themeVariables.light[foregroundVar] ?? token.foreground};`,
        );
      }
    }

    return base;
  });

  return [":root {", ...lines, "}"].join("\n");
}

function cssVariableValue(token: FoundationToken) {
  return themeVariables.light[token.cssVar] ?? String(token.value);
}

function tokenDisplayValue(token: FoundationToken) {
  const value = cssVariableValue(token);
  return token.foreground ? `${value} / fg ${token.foreground}` : value;
}

function colorPreviewValue(token: FoundationToken) {
  const value = String(token.value);
  if (value.startsWith("hsl(var(")) return value;
  if (value.startsWith("var(")) return `var(${token.cssVar})`;
  return value;
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
      <h2 id="public-inventory">Public API inventory</h2>
      <p>
        The curated inventory in <code>apps/docs/lib/public-api-inventory.ts</code> separates public
        barrel exports from the component docs backlog. It tracks package imports, source files,
        planned docs slugs, Storybook ids, examples, status, and coverage flags, and now feeds the
        shared docs metadata module used by docs pages and agent artifacts.
      </p>
      <PublicInventorySummary />
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

function PublicInventorySummary() {
  const counts = publicApiInventory.reduce(
    (accumulator, item) => {
      accumulator[item.kind] += 1;
      if (item.documentable) accumulator.documentable += 1;
      if (item.coverage.docs === "complete") accumulator.docsComplete += 1;
      if (item.coverage.storybook === "complete") accumulator.storybookComplete += 1;
      return accumulator;
    },
    {
      primitive: 0,
      pattern: 0,
      utility: 0,
      documentable: 0,
      docsComplete: 0,
      storybookComplete: 0,
    },
  );

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border-subtle bg-card shadow-rest">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-surface-2 text-xs uppercase tracking-wider text-text-muted">
          <tr>
            <th className="px-4 py-3 font-semibold">Area</th>
            <th className="px-4 py-3 font-semibold">Count</th>
            <th className="px-4 py-3 font-semibold">Coverage note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          <tr>
            <td className="px-4 py-3 font-medium text-text-heading">Primitives</td>
            <td className="px-4 py-3 font-mono text-xs text-text-secondary">{counts.primitive}</td>
            <td className="px-4 py-3 text-text-secondary">Public component-level exports.</td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium text-text-heading">Patterns</td>
            <td className="px-4 py-3 font-mono text-xs text-text-secondary">{counts.pattern}</td>
            <td className="px-4 py-3 text-text-secondary">Compositional product patterns.</td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium text-text-heading">Utilities</td>
            <td className="px-4 py-3 font-mono text-xs text-text-secondary">{counts.utility}</td>
            <td className="px-4 py-3 text-text-secondary">Public helpers, not component pages.</td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium text-text-heading">Documentable items</td>
            <td className="px-4 py-3 font-mono text-xs text-text-secondary">
              {counts.documentable}
            </td>
            <td className="px-4 py-3 text-text-secondary">
              {counts.docsComplete} docs complete; {counts.storybookComplete} Storybook links found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ComponentDocsContent({ component }: { component: ComponentMetadata }) {
  return (
    <>
      <h2 id="overview">Overview</h2>
      <p>{component.overview}</p>
      <h2 id="import">Import</h2>
      <CodeBlock code={component.importSnippet} title="Import" />
      <h2 id="examples">Examples</h2>
      <p>{component.usage}</p>
      {component.examples.length > 0
        ? component.examples.map((exampleId) => <ComponentPreview key={exampleId} id={exampleId} />)
        : null}
      <h2 id="accessibility">Accessibility</h2>
      <ul>
        {component.accessibility.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <h2 id="props">Props</h2>
      <p>This component also accepts {component.inheritedProps}</p>
      <PropsTable props={component.props} />
      <h2 id="storybook">Storybook</h2>
      <StorybookLink href={component.storybookPath} title={component.storybookTitle} />
    </>
  );
}

function PropsTable({ props }: { props: PropMetadata[] }) {
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
          {props.map((prop) => (
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
  const storybookUrl = getStorybookHomeUrl();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard eyebrow="Guide" title="Start with installation" href="/guide/installation">
        Import packages, styles, and theme primitives correctly.
      </HomeCard>
      <HomeCard eyebrow="Tokens" title="Browse foundations" href="/foundations/colors">
        Colors, typography, spacing, radius, shadow, and motion.
      </HomeCard>
      <HomeCard eyebrow="Components" title="Use real primitives" href="/components/button">
        Docs render the same UI package that applications consume.
      </HomeCard>
      <HomeCard eyebrow="Storybook" title="Browse live stories" href={storybookUrl}>
        Explore interactive component docs and states in Storybook.
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
