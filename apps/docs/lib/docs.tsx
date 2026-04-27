import Link from "next/link";
import type { ReactNode } from "react";
import {
  accentVariantTokens,
  borderTokens,
  darkSurfaceTokens,
  fontSizeTokens,
  fontWeightTokens,
  motionTokens,
  radiusTokens,
  semanticColorTokens,
  shadowTokens,
  spacingTokens,
  surfaceTokens,
  textLevelTokens,
  textStyleTokens,
  themeVariables,
  typographyTokens,
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
import type { ExampleId } from "./examples";
import { publicApiInventory } from "./public-api-inventory";
import type { StorybookComponentId } from "./storybook";

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

interface PropDefinition {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

interface ComponentDocDefinition {
  id: StorybookComponentId;
  title: string;
  description: string;
  importSnippet: string;
  overview: string;
  usage: string;
  examples: readonly ExampleId[];
  accessibility: string[];
  props: PropDefinition[];
  inheritedProps: string;
}

const componentDocDefinitions: ComponentDocDefinition[] = [
  {
    id: "button",
    title: "Button",
    description: "Trigger an action, submit a form, or navigate with a clear affordance.",
    importSnippet: "import { Button } from '@nexu-design/ui-web';",
    overview:
      "Use Button for explicit user actions: saving changes, starting flows, confirming destructive work, or linking to a next destination when the action needs button affordance.",
    usage:
      "Choose one high-emphasis action per group, then use outline, ghost, or secondary variants for supporting actions. Pair loading with async work so users cannot submit twice.",
    examples: ["button/basic", "button/variants", "button/loading"],
    accessibility: [
      "Renders a native button by default, preserving keyboard and form behavior.",
      "Loading native buttons are disabled to prevent duplicate submission while keeping the visible label in place.",
      "Icon-only buttons must include an accessible label with aria-label.",
      "When using asChild for links, keep the child element accessible and avoid presenting disabled links as interactive controls.",
    ],
    inheritedProps: "Native button HTML attributes such as type, onClick, and aria-* props.",
    props: [
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
        description:
          "Shows a spinner and disables native button interaction while work is pending.",
      },
      {
        name: "asChild",
        type: "boolean",
        defaultValue: "false",
        description: "Renders through Radix Slot for link-like or custom element composition.",
      },
    ],
  },
  {
    id: "input",
    title: "Input",
    description: "Collect short freeform text with token-aligned focus, invalid, and icon states.",
    importSnippet: "import { Input } from '@nexu-design/ui-web';",
    overview:
      "Use Input for single-line text entry such as names, search queries, API keys, and short identifiers. It wraps a native input in a styled shell for size, focus, invalid, and icon support.",
    usage:
      "Pair every Input with a visible label or an aria-label. Use invalid when validation fails and connect supporting error text with aria-describedby.",
    examples: ["input/basic"],
    accessibility: [
      "Preserves native input semantics and forwards input attributes to the inner input element.",
      "Use htmlFor/id or aria-label so the field has an accessible name.",
      "The invalid prop sets aria-invalid on the input; pair it with nearby error copy for recovery.",
    ],
    inheritedProps: "Native input attributes except the HTML size attribute, plus aria-* props.",
    props: [
      {
        name: "size",
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: "Control height, padding, and text size.",
      },
      {
        name: "invalid",
        type: "boolean",
        defaultValue: "false",
        description: "Applies error styling and aria-invalid.",
      },
      {
        name: "leadingIcon",
        type: "ReactNode",
        defaultValue: "—",
        description: "Decorative icon before the input value.",
      },
      {
        name: "trailingIcon",
        type: "ReactNode",
        defaultValue: "—",
        description: "Decorative icon after the input value.",
      },
      {
        name: "inputClassName",
        type: "string",
        defaultValue: "—",
        description: "Class name applied to the inner input element.",
      },
    ],
  },
  {
    id: "card",
    title: "Card",
    description: "Group related content and actions in a bordered, token-backed surface.",
    importSnippet:
      "import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@nexu-design/ui-web';",
    overview:
      "Use Card for contained content groups such as summaries, settings panels, and lightweight dashboards. Compose slots for consistent title, description, body, and footer spacing.",
    usage:
      "Use static cards for non-interactive content and interactive only when the whole surface acts as one target.",
    examples: ["card/basic"],
    accessibility: [
      "Card renders a div and does not add landmark or button semantics by itself.",
      "Keep headings meaningful with CardTitle and preserve heading order in the page.",
      "If a card is interactive, use the appropriate semantic element or labelled control inside it.",
    ],
    inheritedProps: "Div attributes on Card and slot-specific HTML attributes on subcomponents.",
    props: [
      {
        name: "variant",
        type: "'default' | 'outline' | 'muted' | 'interactive' | 'static'",
        defaultValue: "'default'",
        description: "Surface treatment and hover behavior.",
      },
      {
        name: "padding",
        type: "'none' | 'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: "Outer padding applied by Card.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "—",
        description: "Additional classes for Card or slot composition.",
      },
    ],
  },
  {
    id: "badge",
    title: "Badge",
    description: "Show compact status, metadata, or category labels.",
    importSnippet: "import { Badge } from '@nexu-design/ui-web';",
    overview:
      "Use Badge for short labels that annotate nearby content: status, novelty, category, or priority. Badges are informational and should not replace buttons or links.",
    usage: "Choose semantic variants for status and keep badge text short enough to scan inline.",
    examples: ["badge/basic"],
    accessibility: [
      "Badge renders a div and is read as plain text by default.",
      "Do not rely on color alone; include text that communicates the status.",
      "Avoid placing interactive behavior on Badge; use Button or links for actions.",
    ],
    inheritedProps: "Div attributes such as title, data-*, and aria-* props.",
    props: [
      {
        name: "variant",
        type: "'default' | 'accent' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'destructive'",
        defaultValue: "'default'",
        description: "Color and emphasis treatment.",
      },
      {
        name: "size",
        type: "'xs' | 'sm' | 'default' | 'lg'",
        defaultValue: "'default'",
        description: "Padding and text size preset.",
      },
      {
        name: "radius",
        type: "'full' | 'md' | 'lg'",
        defaultValue: "'full'",
        description: "Corner radius preset.",
      },
    ],
  },
  {
    id: "checkbox",
    title: "Checkbox",
    description: "Toggle independent boolean choices in forms and settings.",
    importSnippet: "import { Checkbox } from '@nexu-design/ui-web';",
    overview:
      "Use Checkbox when users may select zero, one, or many independent options. It wraps Radix Checkbox for checked, unchecked, and indeterminate state behavior.",
    usage:
      "Place a concise label next to the control and use Checkbox for form choices, not immediate system toggles.",
    examples: ["checkbox/basic"],
    accessibility: [
      "Radix provides checkbox roles, state attributes, keyboard interaction, and focus management.",
      "Associate the control with visible label text using htmlFor/id.",
      "Use aria-describedby for helper or error text that affects the decision.",
    ],
    inheritedProps:
      "Radix Checkbox Root props including checked, defaultChecked, disabled, required, and onCheckedChange.",
    props: [
      {
        name: "checked",
        type: "boolean | 'indeterminate'",
        defaultValue: "—",
        description: "Controlled checked state.",
      },
      {
        name: "defaultChecked",
        type: "boolean | 'indeterminate'",
        defaultValue: "false",
        description: "Initial uncontrolled checked state.",
      },
      {
        name: "onCheckedChange",
        type: "(checked) => void",
        defaultValue: "—",
        description: "Called when the checked state changes.",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Prevents user interaction.",
      },
    ],
  },
  {
    id: "switch",
    title: "Switch",
    description: "Control an immediately applied on/off setting.",
    importSnippet: "import { Switch } from '@nexu-design/ui-web';",
    overview:
      "Use Switch for settings that take effect immediately, such as enabling sync or notifications. For multi-select form choices, use Checkbox instead.",
    usage:
      "Use a visible label and reserve Switch for binary state where on/off language is clear.",
    examples: ["switch/basic"],
    accessibility: [
      "Radix provides switch semantics, keyboard interaction, and checked state attributes.",
      "Associate the switch with a visible label using htmlFor/id or provide aria-label.",
      "Do not use Switch for actions that require a separate submit confirmation.",
    ],
    inheritedProps:
      "Radix Switch Root props including checked, defaultChecked, disabled, required, and onCheckedChange.",
    props: [
      {
        name: "size",
        type: "'default' | 'sm'",
        defaultValue: "'default'",
        description: "Track and thumb dimensions.",
      },
      {
        name: "checked",
        type: "boolean",
        defaultValue: "—",
        description: "Controlled on/off state.",
      },
      {
        name: "defaultChecked",
        type: "boolean",
        defaultValue: "false",
        description: "Initial uncontrolled state.",
      },
      {
        name: "onCheckedChange",
        type: "(checked: boolean) => void",
        defaultValue: "—",
        description: "Called when the setting changes.",
      },
    ],
  },
  {
    id: "select",
    title: "Select",
    description: "Pick one value from a closed list of options.",
    importSnippet:
      "import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@nexu-design/ui-web';",
    overview:
      "Use Select for finite option lists where search is not required. It composes Radix Select primitives for trigger, value, portal content, grouped options, labels, separators, and items.",
    usage:
      "Use Select for values, DropdownMenu for actions, and Combobox when users need filtering or freeform search.",
    examples: ["select/basic"],
    accessibility: [
      "Radix handles trigger roles, roving focus, typeahead, and keyboard selection behavior.",
      "Label the trigger with visible text or aria-label and keep option text descriptive.",
      "Use disabled SelectItem values for unavailable options instead of removing important context.",
    ],
    inheritedProps:
      "Radix Select Root, Trigger, Content, and Item props on the corresponding exports.",
    props: [
      {
        name: "value",
        type: "string",
        defaultValue: "—",
        description: "Controlled selected value on Select.",
      },
      {
        name: "defaultValue",
        type: "string",
        defaultValue: "—",
        description: "Initial uncontrolled selected value.",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        defaultValue: "—",
        description: "Called when the selected value changes.",
      },
      {
        name: "position",
        type: "'item-aligned' | 'popper'",
        defaultValue: "'popper'",
        description: "Positioning mode on SelectContent.",
      },
    ],
  },
  {
    id: "dialog",
    title: "Dialog",
    description: "Present modal content with a focus trap, scrim, title, and actions.",
    importSnippet:
      "import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@nexu-design/ui-web';",
    overview:
      "Use Dialog for focused workflows that interrupt the current page, such as setup forms and confirmations. The primitive composes Radix Dialog with a portal overlay and built-in close control.",
    usage:
      "Every dialog needs a title, concise description when helpful, and clear primary/secondary actions in the footer.",
    examples: ["dialog/basic"],
    accessibility: [
      "Radix traps focus, restores focus to the trigger, handles Escape, and wires modal semantics.",
      "Always include DialogTitle; use DialogDescription for supporting context.",
      "Keep destructive confirmations explicit and avoid hiding critical consequences only in color.",
    ],
    inheritedProps:
      "Radix Dialog Root, Trigger, Content, Close, Title, and Description props on corresponding exports.",
    props: [
      {
        name: "open",
        type: "boolean",
        defaultValue: "—",
        description: "Controlled open state on Dialog.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        defaultValue: "false",
        description: "Initial uncontrolled open state.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        defaultValue: "—",
        description: "Called when the modal opens or closes.",
      },
      {
        name: "size",
        type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
        defaultValue: "'md'",
        description: "Maximum width preset on DialogContent.",
      },
      {
        name: "closeOnOverlayClick",
        type: "boolean",
        defaultValue: "true",
        description: "Allows DialogContent to prevent outside-pointer close.",
      },
    ],
  },
  {
    id: "tabs",
    title: "Tabs",
    description: "Organize related sections into keyboard-accessible tab panels.",
    importSnippet:
      "import { Tabs, TabsContent, TabsList, TabsTrigger } from '@nexu-design/ui-web';",
    overview:
      "Use Tabs when users need to switch between peer sections without navigating away from the current page. Tabs compose Radix Tabs with Nexu list, trigger, and content styling.",
    usage:
      "Keep tab labels short, choose stable values for each panel, and avoid hiding critical form steps behind tabs when users must complete them in order.",
    examples: ["tabs/basic"],
    accessibility: [
      "Radix provides tablist, tab, and tabpanel semantics with keyboard navigation.",
      "Give TabsList an accessible label when the tab set needs context beyond nearby headings.",
      "Use disabled tabs only for unavailable sections, not as progress indicators without explanation.",
    ],
    inheritedProps: "Radix Tabs Root, List, Trigger, and Content props on corresponding exports.",
    props: [
      {
        name: "value",
        type: "string",
        defaultValue: "—",
        description: "Controlled active tab value on Tabs.",
      },
      {
        name: "defaultValue",
        type: "string",
        defaultValue: "—",
        description: "Initial uncontrolled active tab value.",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        defaultValue: "—",
        description: "Called when users activate a different tab.",
      },
      {
        name: "variant",
        type: "'default' | 'compact'",
        defaultValue: "'default'",
        description: "Visual density on TabsList and TabsTrigger.",
      },
    ],
  },
  {
    id: "tooltip",
    title: "Tooltip",
    description: "Reveal short supplemental hints on hover or keyboard focus.",
    importSnippet:
      "import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@nexu-design/ui-web';",
    overview:
      "Use Tooltip for concise, non-essential supporting information. It composes Radix Tooltip with portal rendering, a small elevated surface, and arrow treatment.",
    usage:
      "Wrap related tooltips in TooltipProvider, keep copy brief, and do not put required instructions or interactive content inside a tooltip.",
    examples: ["tooltip/basic"],
    accessibility: [
      "Radix opens tooltips from hover and focus and connects trigger/content semantics.",
      "Tooltip content should supplement, not replace, visible labels or error messages.",
      "Use Popover or Dialog instead when content is interactive or longer than a short hint.",
    ],
    inheritedProps: "Radix Tooltip Provider, Root, Trigger, and Content props.",
    props: [
      {
        name: "delayDuration",
        type: "number",
        defaultValue: "Radix default",
        description: "Delay before opening when set on TooltipProvider or Tooltip.",
      },
      {
        name: "open",
        type: "boolean",
        defaultValue: "—",
        description: "Controlled open state on Tooltip.",
      },
      {
        name: "sideOffset",
        type: "number",
        defaultValue: "8",
        description: "Distance between trigger and TooltipContent.",
      },
    ],
  },
  {
    id: "popover",
    title: "Popover",
    description: "Show contextual content in an anchored floating panel.",
    importSnippet:
      "import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@nexu-design/ui-web';",
    overview:
      "Use Popover for lightweight contextual panels such as summaries, filters, or small pickers that should remain anchored to a trigger.",
    usage:
      "Prefer Popover for short contextual content, Dialog for modal workflows, and DropdownMenu for menu actions.",
    examples: ["popover/basic"],
    accessibility: [
      "Radix handles trigger association, portal rendering, dismissal, and focus behavior.",
      "Keep popover content concise and provide a labelled trigger that describes what opens.",
      "Do not use Popover for critical blocking workflows that need modal focus trapping.",
    ],
    inheritedProps: "Radix Popover Root, Anchor, Trigger, and Content props.",
    props: [
      {
        name: "open",
        type: "boolean",
        defaultValue: "—",
        description: "Controlled open state on Popover.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        defaultValue: "false",
        description: "Initial uncontrolled open state.",
      },
      {
        name: "align",
        type: "'start' | 'center' | 'end'",
        defaultValue: "'center'",
        description: "Horizontal alignment for PopoverContent.",
      },
      {
        name: "sideOffset",
        type: "number",
        defaultValue: "4",
        description: "Distance between trigger and PopoverContent.",
      },
    ],
  },
  {
    id: "dropdown-menu",
    title: "DropdownMenu",
    description: "Present a compact menu of actions, grouped options, or submenus.",
    importSnippet:
      "import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@nexu-design/ui-web';",
    overview:
      "Use DropdownMenu for action menus and menu-like choices attached to a trigger. It composes Radix Dropdown Menu with styled items, labels, separators, shortcuts, checkbox items, radio items, and submenus.",
    usage:
      "Use menu items for commands, Select for choosing one value in a form, and visible buttons for primary actions that should not be hidden.",
    examples: ["dropdown-menu/basic"],
    accessibility: [
      "Radix provides menu roles, roving focus, typeahead, submenus, and keyboard dismissal.",
      "Label the trigger clearly and keep destructive menu items explicit in text, not only color.",
      "Use disabled menu items for temporarily unavailable actions when the context remains useful.",
    ],
    inheritedProps:
      "Radix Dropdown Menu Root, Trigger, Content, Item, CheckboxItem, RadioItem, and submenu props.",
    props: [
      {
        name: "open",
        type: "boolean",
        defaultValue: "—",
        description: "Controlled open state on DropdownMenu.",
      },
      {
        name: "modal",
        type: "boolean",
        defaultValue: "true",
        description: "Whether menu interaction is modal while open.",
      },
      {
        name: "sideOffset",
        type: "number",
        defaultValue: "4",
        description: "Distance between trigger and DropdownMenuContent.",
      },
      {
        name: "inset",
        type: "boolean",
        defaultValue: "false",
        description:
          "Adds leading indentation on labels, items, and submenu triggers that support it.",
      },
    ],
  },
  {
    id: "alert",
    title: "Alert",
    description: "Communicate contextual status with semantic emphasis and recovery guidance.",
    importSnippet: "import { Alert, AlertDescription, AlertTitle } from '@nexu-design/ui-web';",
    overview:
      "Use Alert for inline messages that need attention: warnings, errors, success states, or information tied to the surrounding content.",
    usage:
      "Choose a variant that matches the message severity and include clear text so status is not communicated by color alone.",
    examples: ["alert/basic"],
    accessibility: [
      "Alert renders role=alert so assistive technology can announce important status updates.",
      "Use AlertTitle for a concise summary and AlertDescription for actionable recovery details.",
      "Avoid overusing alerts for decorative callouts; reserve live announcements for meaningful changes.",
    ],
    inheritedProps: "Div attributes on Alert and slot-specific heading/div attributes.",
    props: [
      {
        name: "variant",
        type: "'default' | 'info' | 'success' | 'warning' | 'destructive'",
        defaultValue: "'default'",
        description: "Semantic color and border treatment for the message.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "—",
        description: "Additional classes for the alert container or slots.",
      },
    ],
  },
  {
    id: "spinner",
    title: "Spinner",
    description: "Indicate indeterminate loading with a compact animated icon.",
    importSnippet: "import { Spinner } from '@nexu-design/ui-web';",
    overview:
      "Use Spinner for short indeterminate waits, inline async states, or background refresh. It renders a decorative loading icon sized by token-aligned presets.",
    usage:
      "Pair Spinner with visible loading copy or an aria-live region when users need to understand what is happening.",
    examples: ["spinner/basic"],
    accessibility: [
      "Spinner is aria-hidden by default because the icon itself is decorative.",
      "Provide adjacent text such as Loading or Syncing when the state needs to be announced visually.",
      "Use Button loading for pending button actions instead of adding a separate spinner beside the same action.",
    ],
    inheritedProps: "SVG attributes such as className, data-*, and aria-* props.",
    props: [
      {
        name: "size",
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: "Icon size preset.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "—",
        description: "Additional classes for color, spacing, or layout context.",
      },
    ],
  },
  {
    id: "skeleton",
    title: "Skeleton",
    description: "Reserve layout space with animated loading placeholders.",
    importSnippet: "import { Skeleton } from '@nexu-design/ui-web';",
    overview:
      "Use Skeleton to show the expected shape of content while data loads, reducing layout shift and making loading states feel intentional.",
    usage:
      "Match skeleton dimensions to the eventual content and keep the placeholder structure simpler than the final UI.",
    examples: ["skeleton/basic"],
    accessibility: [
      "Skeleton renders a div and does not announce loading by itself.",
      "Use nearby loading copy, aria-busy, or live-region status when users need assistive feedback.",
      "Do not leave skeletons on screen after content has loaded or when an error requires recovery copy.",
    ],
    inheritedProps: "Div attributes such as className, style, data-*, and aria-* props.",
    props: [
      {
        name: "className",
        type: "string",
        defaultValue: "—",
        description: "Controls placeholder size, radius overrides, and layout placement.",
      },
    ],
  },
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
  ...foundationPages,
  ...componentDocDefinitions.map((component) => ({
    title: component.title,
    description: component.description,
    slug: ["components", component.id],
    headings: componentHeadings,
    content: <ComponentDocsContent component={component} />,
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
      { id: "public-inventory", title: "Public API inventory" },
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

function GuideSourceLinks({ sources }: { sources: string[] }) {
  return (
    <ul>
      {sources.map((source) => (
        <li key={source}>
          <Link href={`https://github.com/nexu-io/design/blob/main/${source}`}>{source}</Link>
        </li>
      ))}
    </ul>
  );
}

function ColorsFoundationContent() {
  const colorGroups = [
    { title: "Semantic", tokens: semanticColorTokens },
    { title: "Surface", tokens: surfaceTokens },
    { title: "Border", tokens: borderTokens },
    { title: "Text", tokens: textLevelTokens },
    { title: "Dark surfaces", tokens: darkSurfaceTokens },
    { title: "Accent variants", tokens: accentVariantTokens },
  ];
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
  return (
    <FoundationPageIntro
      title="Typography tokens"
      description="Typography tokens define the font stacks, compact UI type scale, and supported weights used by Nexu components. Text-style recipes combine generated Tailwind utilities for common hierarchy roles."
      usage="Use the documented text-size and weight variables through the package utilities; reserve script and heading families for intentional brand moments."
      tokens={[...typographyTokens, ...fontSizeTokens, ...fontWeightTokens]}
    >
      <h2 id="tokens">Tokens</h2>
      <TokenSection title="Font families" tokens={typographyTokens} preview="typography" />
      <FontSizeTable tokens={fontSizeTokens} />
      <TokenSection title="Weights" tokens={fontWeightTokens} preview="text" />
      <TextStyleRecipes styles={textStyleTokens} />
    </FoundationPageIntro>
  );
}

function SpacingFoundationContent() {
  return (
    <FoundationPageIntro
      title="Spacing tokens"
      description="Spacing is based on a 4px unit exposed as --spacing. Source metadata documents the supported steps and their intended use while full generated spacing metadata is deferred to Phase 2."
      usage="Prefer the named spacing steps for product layout rhythm; use smaller values for inline controls and larger values for sections or page regions."
      tokens={spacingTokens}
    >
      <h2 id="tokens">Tokens</h2>
      <TokenSection title="Spacing scale" tokens={spacingTokens} preview="spacing" />
    </FoundationPageIntro>
  );
}

function RadiusFoundationContent() {
  return (
    <FoundationPageIntro
      title="Radius tokens"
      description="Radius tokens set consistent corner geometry for compact controls, cards, panels, modals, hero surfaces, and pills."
      usage="Match radius to component scale: md for default controls, lg/xl for cards and overlays, and pill only for badges or capsules."
      tokens={radiusTokens}
    >
      <h2 id="tokens">Tokens</h2>
      <TokenSection title="Radius scale" tokens={radiusTokens} preview="radius" />
    </FoundationPageIntro>
  );
}

function ShadowFoundationContent() {
  return (
    <FoundationPageIntro
      title="Shadow tokens"
      description="Shadow tokens create a restrained elevation scale for rest states, cards, dropdowns, focus rings, overlays, and interactive lift."
      usage="Use the semantic shadows for intent: rest/card for static containers, dropdown/overlay for detached layers, focus for keyboard focus, and refine/elevated for hover or prominent panels."
      tokens={shadowTokens}
    >
      <h2 id="tokens">Tokens</h2>
      <TokenSection title="Elevation scale" tokens={shadowTokens} preview="shadow" />
    </FoundationPageIntro>
  );
}

function MotionFoundationContent() {
  return (
    <FoundationPageIntro
      title="Motion tokens"
      description="Motion tokens define the shared transition durations and easing curve for small UI affordances and default component state changes."
      usage="Use fast for hover affordances, normal for default state transitions, and the standard easing curve for consistent acceleration."
      tokens={motionTokens}
    >
      <h2 id="tokens">Tokens</h2>
      <TokenSection title="Timing" tokens={motionTokens} preview="motion" />
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
          Token names, descriptions, and CSS variables come from
          <code> packages/tokens/src/token-source.json</code>. Full shared metadata generation for
          docs, APIs, and <code>llms</code> outputs is deferred to Phase 2.
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
        planned docs slugs, Storybook ids, examples, status, and coverage flags for Phase 1 and the
        metadata APIs planned in Phase 2.
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

function ComponentDocsContent({ component }: { component: ComponentDocDefinition }) {
  return (
    <>
      <h2 id="overview">Overview</h2>
      <p>{component.overview}</p>
      <h2 id="import">Import</h2>
      <CodeBlock code={component.importSnippet} title="Import" />
      <h2 id="examples">Examples</h2>
      <p>{component.usage}</p>
      {component.examples.map((exampleId) => (
        <ComponentPreview key={exampleId} id={exampleId} />
      ))}
      <h2 id="accessibility">Accessibility</h2>
      <ul>
        {component.accessibility.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <h2 id="props">Props</h2>
      <p>
        Provisional prop coverage for Phase 1. This page also accepts {component.inheritedProps}
      </p>
      <PropsTable props={component.props} />
      <h2 id="storybook">Storybook</h2>
      <StorybookLink component={component.id} />
    </>
  );
}

function PropsTable({ props }: { props: PropDefinition[] }) {
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
