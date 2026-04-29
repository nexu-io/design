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
  type TextStyleDefinition,
  type TokenDefinition,
} from "@nexu-design/tokens";

import { exampleIds, examples, type ExampleCategory, type ExampleId } from "./examples";
import {
  getPublicApiInventoryItem,
  publicComponentInventory,
  publicApiInventory,
  type PublicApiCoverageFlags,
  type PublicApiInventoryItem,
} from "./public-api-inventory";

export interface PropMetadata {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

interface ComponentDocDefinition {
  id: string;
  title: string;
  description: string;
  overview: string;
  usage: string;
  examples: readonly ExampleId[];
  accessibility: string[];
  props: PropMetadata[];
  inheritedProps: string;
}

interface GeneratedPropsDefinition {
  inheritedProps: string;
  props: PropMetadata[];
}

export interface ComponentMetadata extends ComponentDocDefinition {
  importSnippet: string;
  docsSlug: string;
  storybookId?: string;
  storybookPath?: string;
  storybookTitle?: string;
  coverage: PublicApiCoverageFlags;
  sourcePath: string;
  packageName: string;
  exports: string[];
}

export interface ExampleMetadata {
  id: ExampleId;
  title: string;
  description?: string;
  category: ExampleCategory;
  filePath: `examples/${string}.tsx`;
  source: string;
}

export interface TokenMetadata extends Omit<TokenDefinition, "value"> {
  value: string | number;
  resolvedValue: string;
  page: TokenMetadataPageId;
  group: string;
}

export interface TypographyTokenMetadataPage {
  id: "typography";
  title: "Typography";
  groups: Array<{ title: string; tokens: TokenMetadata[] }>;
  textStyles: TextStyleDefinition[];
}

export interface TokenMetadataPage {
  id: Exclude<TokenMetadataPageId, "typography">;
  title: string;
  groups: Array<{ title: string; tokens: TokenMetadata[] }>;
}

export type TokenMetadataPageId =
  | "colors"
  | "typography"
  | "spacing"
  | "radius"
  | "shadow"
  | "motion";

export const metadataSourceFiles = {
  components: ["apps/docs/lib/docs-metadata.ts", "apps/docs/lib/public-api-inventory.ts"],
  tokens: [
    "apps/docs/lib/docs-metadata.ts",
    "packages/tokens/src/token-data.ts",
    "packages/tokens/src/token-source.json",
  ],
  examples: ["apps/docs/lib/docs-metadata.ts", "apps/docs/lib/examples.tsx"],
  inventory: ["apps/docs/lib/docs-metadata.ts", "apps/docs/lib/public-api-inventory.ts"],
  all: [
    "apps/docs/lib/docs-metadata.ts",
    "apps/docs/lib/public-api-inventory.ts",
    "apps/docs/lib/examples.tsx",
    "packages/tokens/src/token-data.ts",
    "packages/tokens/src/token-source.json",
  ],
} as const;

const componentDocDefinitions: ComponentDocDefinition[] = [
  {
    id: "button",
    title: "Button",
    description: "Trigger an action, submit a form, or navigate with a clear affordance.",
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

const componentDocDefinitionsById = new Map(
  componentDocDefinitions.map((definition) => [definition.id, definition]),
);

const generatedPropsById: Record<string, GeneratedPropsDefinition> = {
  accordion: {
    inheritedProps:
      "Accordion Root, Item, Trigger, and Content props, including native div/button attributes and Radix-style controlled state props.",
    props: [
      prop(
        "type",
        "'single' | 'multiple'",
        "'single'",
        "Selects whether one panel or multiple panels can be open.",
      ),
      prop(
        "collapsible",
        "boolean",
        "false",
        "Allows the active item to close again in single mode.",
      ),
      prop("value", "string | string[]", "—", "Controlled open item value or values."),
      prop(
        "defaultValue",
        "string | string[]",
        "—",
        "Initial uncontrolled open item value or values.",
      ),
      prop(
        "onValueChange",
        "(value: string | string[]) => void",
        "—",
        "Called when open item state changes.",
      ),
      prop(
        "icon",
        "ReactNode",
        "—",
        "Optional trigger icon slot when supported by AccordionTrigger.",
      ),
    ],
  },
  "activity-bar": {
    inheritedProps: "Div attributes on rail slots and native button attributes on ActivityBarItem.",
    props: [
      prop(
        "surface",
        "'solid' | 'glass'",
        "'solid'",
        "Background treatment for the activity rail.",
      ),
      prop("active", "boolean", "false", "Marks an ActivityBarItem as the current destination."),
      prop(
        "asChild",
        "boolean",
        "false",
        "Renders an ActivityBarItem through Radix Slot for router links.",
      ),
      prop(
        "className",
        "string",
        "—",
        "Additional classes for the rail, slot, item, or indicator.",
      ),
    ],
  },
  avatar: {
    inheritedProps: "Radix Avatar Root, Image, and Fallback props on the corresponding exports.",
    props: [
      prop("src", "string", "—", "Image source passed to AvatarImage."),
      prop("alt", "string", "—", "Accessible image alternative text passed to AvatarImage."),
      prop("delayMs", "number", "Radix default", "Delay before AvatarFallback renders."),
      prop(
        "className",
        "string",
        "—",
        "Additional classes for the avatar root, image, or fallback.",
      ),
    ],
  },
  breadcrumb: {
    inheritedProps:
      "Nav, list, list item, anchor, span, and separator attributes on the matching Breadcrumb exports.",
    props: [
      prop(
        "aria-label",
        "string",
        "'breadcrumb'",
        "Accessible label for the breadcrumb navigation landmark.",
      ),
      prop(
        "asChild",
        "boolean",
        "false",
        "Renders BreadcrumbLink through Radix Slot for framework links.",
      ),
      prop("href", "string", "—", "Destination for BreadcrumbLink when rendering an anchor."),
      prop("className", "string", "—", "Additional classes for breadcrumb slots."),
    ],
  },
  "chat-message": {
    inheritedProps:
      "Div attributes except children, plus documented ChatSender and ChatMessageReaction data shapes.",
    props: [
      prop(
        "sender",
        "ChatSender",
        "required",
        "Author metadata including id, name, fallback, avatar, role, and agent styling.",
      ),
      prop("time", "string", "required", "Formatted timestamp shown with the sender header."),
      prop(
        "compact",
        "boolean",
        "false",
        "Reduces repeated header and avatar spacing for consecutive messages.",
      ),
      prop("mention", "string", "—", "Prepends an @mention pill before the message body."),
      prop("blocks", "ReactNode", "—", "Attachment or rich-content blocks below the main message."),
      prop(
        "reactions",
        "ChatMessageReaction[]",
        "—",
        "Reaction chips with emoji, count, and reacted state.",
      ),
      prop(
        "highlighted",
        "boolean",
        "false",
        "Applies highlighted row background for referenced messages.",
      ),
      prop("rowActions", "ReactNode", "—", "Hover/focus actions rendered at the row edge."),
      prop("onAddReaction", "() => void", "—", "Called when users choose to add a reaction."),
      prop(
        "onReactionClick",
        "(emoji: string) => void",
        "—",
        "Called when an existing reaction is selected.",
      ),
    ],
  },
  collapsible: {
    inheritedProps:
      "Collapsible Root, Trigger, and Content props, including native div/button attributes.",
    props: [
      prop("open", "boolean", "—", "Controlled open state."),
      prop("defaultOpen", "boolean", "false", "Initial uncontrolled open state."),
      prop("onOpenChange", "(open: boolean) => void", "—", "Called when the collapsible toggles."),
      prop("forceMount", "boolean", "false", "Keeps CollapsibleContent mounted while closed."),
    ],
  },
  combobox: {
    inheritedProps:
      "Combobox root props plus Popover-derived Trigger/Content props and Input-derived input props.",
    props: [
      prop("value", "string", "—", "Controlled selected item value."),
      prop("defaultValue", "string", "—", "Initial uncontrolled selected value."),
      prop("onValueChange", "(value: string) => void", "—", "Called when users select an item."),
      prop("open", "boolean", "—", "Controlled popover open state."),
      prop("defaultOpen", "boolean", "false", "Initial uncontrolled popover state."),
      prop(
        "onOpenChange",
        "(open: boolean) => void",
        "—",
        "Called when the popover opens or closes.",
      ),
      prop("disabled", "boolean", "false", "Disables trigger and item interaction."),
      prop("textValue", "string", "—", "Search/display text override on ComboboxItem."),
      prop("keywords", "string[]", "—", "Additional search terms for an item."),
    ],
  },
  "conversation-message": {
    inheritedProps: "Div attributes such as className, data-*, aria-* props, and children.",
    props: [
      prop(
        "variant",
        "'user' | 'assistant' | 'system' | 'status'",
        "'assistant'",
        "Message role and bubble treatment.",
      ),
      prop("avatar", "ReactNode", "—", "Leading avatar or identity slot."),
      prop("meta", "ReactNode", "—", "Timestamp, model, or status metadata."),
      prop("actions", "ReactNode", "—", "Inline action slot for copy, retry, or menu controls."),
      prop("bubbleClassName", "string", "—", "Classes applied to the message bubble."),
      prop("contentClassName", "string", "—", "Classes applied to the message content region."),
    ],
  },
  "data-table": {
    inheritedProps:
      "Div attributes on DataTable and slot-specific div/header/footer attributes on subcomponents.",
    props: [
      prop(
        "children",
        "ReactNode",
        "—",
        "Composed table header, toolbar, content, empty state, and footer slots.",
      ),
      prop("className", "string", "—", "Additional classes for the table frame or slot wrappers."),
    ],
  },
  "detail-panel": {
    inheritedProps:
      "Div attributes on panel slots and native button attributes on DetailPanelCloseButton.",
    props: [
      prop("width", "number | string", "400", "Panel width; numbers are treated as pixel values."),
      prop("srLabel", "string", "'Close panel'", "Screen-reader label for DetailPanelCloseButton."),
      prop("className", "string", "—", "Additional classes for panel layout or slots."),
    ],
  },
  "entity-card": {
    inheritedProps:
      "Card props except padding on EntityCard, plus HTML attributes on EntityCard slots.",
    props: [
      prop(
        "interactive",
        "boolean",
        "false",
        "Adds hover and cursor affordances when the card acts as a target.",
      ),
      prop("selected", "boolean", "false", "Applies selected-state border and surface styling."),
      prop("alt", "string", "required", "Image alternative text for EntityCardMedia image usage."),
      prop("className", "string", "—", "Additional classes for the card or slots."),
    ],
  },
  "event-notice": {
    inheritedProps: "Div attributes such as className, data-*, aria-* props, and children.",
    props: [
      prop("icon", "ReactNode", "—", "Leading decorative icon for the notice."),
      prop(
        "plain",
        "boolean",
        "false",
        "Removes the side hairline treatment for simpler feed copy.",
      ),
      prop("children", "ReactNode", "—", "Notice text or composed inline content."),
    ],
  },
  "file-attachment": {
    inheritedProps: "Native button attributes such as type, onClick, disabled, and aria-* props.",
    props: [
      prop("name", "string", "required", "Visible file name."),
      prop("meta", "ReactNode", "—", "Secondary metadata such as type, size, or upload state."),
      prop(
        "kind",
        "'doc' | 'sheet' | 'archive' | 'code' | 'media' | 'generic'",
        "'doc'",
        "Chooses default icon and tile color.",
      ),
      prop("icon", "React.ElementType", "—", "Overrides the default file-kind icon."),
      prop("trailing", "ReactNode", "—", "Trailing action or metadata slot."),
      prop("type", "'button' | 'submit' | 'reset'", "'button'", "Native button type."),
    ],
  },
  "image-attachment": {
    inheritedProps:
      "HTMLElement attributes on the figure/container, including className, data-*, and aria-* props.",
    props: [
      prop("src", "string", "required", "Image source URL."),
      prop(
        "alt",
        "string",
        "''",
        "Image alternative text; keep empty only for decorative previews.",
      ),
      prop("width", "number", "360", "Preview width in pixels."),
      prop("height", "number", "220", "Preview height in pixels."),
      prop("caption", "ReactNode", "—", "Optional caption below the image."),
      prop("onSelect", "() => void", "—", "Makes the preview selectable by click and keyboard."),
      prop("imgClassName", "string", "—", "Classes applied to the inner img element."),
    ],
  },
  "image-gallery": {
    inheritedProps:
      "Div attributes except onSelect, which is replaced by the gallery item callback.",
    props: [
      prop(
        "images",
        "ImageGalleryItem[]",
        "required",
        "Image thumbnails with src and optional alt text.",
      ),
      prop(
        "maxVisible",
        "number",
        "6",
        "Number of thumbnails shown before collapsing into a +N item.",
      ),
      prop(
        "onSelect",
        "(image: ImageGalleryItem, index: number) => void",
        "—",
        "Called when a thumbnail is selected.",
      ),
    ],
  },
  "interactive-row": {
    inheritedProps: "Native button attributes such as type, onClick, disabled, and aria-* props.",
    props: [
      prop("selected", "boolean", "false", "Applies selected row styling."),
      prop(
        "tone",
        "'default' | 'subtle'",
        "'default'",
        "Controls row background and hover treatment.",
      ),
      prop("type", "'button' | 'submit' | 'reset'", "'button'", "Native button type."),
    ],
  },
  label: {
    inheritedProps:
      "Radix Label Root props, including htmlFor, className, data-*, and aria-* props.",
    props: [
      prop("htmlFor", "string", "—", "Associates the label with a form control id."),
      prop("className", "string", "—", "Additional classes for label layout or typography."),
    ],
  },
  logo: {
    inheritedProps:
      "Span attributes for logo wrappers, plus logo-specific provider/model/runtime/platform/brand identifiers.",
    props: [
      prop("size", "number", "16", "Rendered mark size in pixels."),
      prop("title", "string", "—", "Accessible title for the rendered mark."),
      prop(
        "provider",
        "ProviderName | string",
        "required",
        "Provider id for ProviderLogo or related model marks.",
      ),
      prop("model", "string", "required", "Model id for ModelLogo."),
      prop("runtime", "RuntimeName | string", "required", "Runtime id for RuntimeLogo."),
      prop(
        "platform",
        "'slack' | 'feishu' | 'discord' | 'telegram' | 'wechat' | 'whatsapp'",
        "required",
        "Platform id for PlatformLogo.",
      ),
      prop("brand", "'nexu' | 'github'", "required", "Brand id for BrandLogo."),
    ],
  },
  "nav-item": {
    inheritedProps:
      "Native button attributes by default; asChild renders through Radix Slot for links.",
    props: [
      prop("asChild", "boolean", "false", "Renders through Slot for router link composition."),
      prop("tone", "'default' | 'accent'", "'default'", "Color treatment for navigation emphasis."),
      prop("size", "'default' | 'compact'", "'default'", "Padding and density preset."),
      prop("selected", "boolean", "false", "Marks the item as selected/current."),
      prop(
        "type",
        "'button' | 'submit' | 'reset'",
        "'button'",
        "Native button type when not using asChild.",
      ),
    ],
  },
  "panel-footer": {
    inheritedProps: "Div attributes on PanelFooter, PanelFooterMeta, and PanelFooterActions.",
    props: [
      prop(
        "align",
        "'between' | 'end' | 'start'",
        "'between'",
        "Horizontal alignment of footer metadata and actions.",
      ),
    ],
  },
  "pricing-card": {
    inheritedProps:
      "Card props except children and padding, plus HTML and aria attributes accepted by Card.",
    props: [
      prop("name", "ReactNode", "required", "Plan name."),
      prop("price", "ReactNode", "required", "Primary price or value display."),
      prop("period", "ReactNode", "—", "Billing period or cadence label."),
      prop("description", "ReactNode", "—", "Supporting plan description."),
      prop("icon", "React.ElementType", "—", "Optional leading plan icon."),
      prop("badge", "ReactNode", "—", "Top badge content such as Popular."),
      prop("badgeVariant", "BadgeProps['variant']", "'accent'", "Badge visual style."),
      prop("features", "ReactNode[]", "required", "Feature list rendered inside the card."),
      prop("footer", "ReactNode", "—", "Bottom action or explanatory slot."),
      prop("featured", "boolean", "false", "Applies highlighted featured-plan styling."),
      prop("size", "'default' | 'compact'", "'default'", "Spacing and typography density."),
    ],
  },
  progress: {
    inheritedProps: "Div attributes such as className, style, data-*, and aria-* props.",
    props: [
      prop("value", "number | null", "0", "Current progress value."),
      prop("max", "number", "100", "Maximum progress value."),
      prop(
        "variant",
        "'default' | 'success' | 'warning' | 'accent'",
        "'default'",
        "Indicator color treatment.",
      ),
      prop("size", "'sm' | 'md' | 'lg'", "'md'", "Bar height preset."),
      prop("indicatorClassName", "string", "—", "Classes applied to the inner progress indicator."),
    ],
  },
  prose: {
    inheritedProps: "Div attributes such as className, data-*, aria-* props, and children.",
    props: [
      prop("size", "'default' | 'compact'", "'default'", "Rich-text typography and spacing scale."),
    ],
  },
  "radio-group": {
    inheritedProps: "Radix RadioGroup Root and Item props on RadioGroup and RadioGroupItem.",
    props: [
      prop("value", "string", "—", "Controlled selected radio value."),
      prop("defaultValue", "string", "—", "Initial uncontrolled selected value."),
      prop("onValueChange", "(value: string) => void", "—", "Called when selection changes."),
      prop("disabled", "boolean", "false", "Disables the group or item."),
    ],
  },
  "scroll-area": {
    inheritedProps:
      "Radix ScrollArea Root, Viewport, Corner, and Scrollbar props on corresponding exports.",
    props: [
      prop(
        "type",
        "'auto' | 'always' | 'scroll' | 'hover'",
        "Radix default",
        "Scrollbar visibility behavior.",
      ),
      prop("orientation", "'horizontal' | 'vertical'", "'vertical'", "Axis for ScrollBar."),
      prop("className", "string", "—", "Additional classes for the scroll root or scrollbar."),
    ],
  },
  separator: {
    inheritedProps:
      "Radix Separator Root props including orientation, decorative, className, and aria-* props.",
    props: [
      prop("orientation", "'horizontal' | 'vertical'", "'horizontal'", "Separator axis."),
      prop(
        "decorative",
        "boolean",
        "true",
        "Marks the separator as decorative when it does not convey structure.",
      ),
    ],
  },
  sheet: {
    inheritedProps:
      "Radix Dialog Root, Trigger, Close, Content, Title, and Description props on matching Sheet exports.",
    props: [
      prop("open", "boolean", "—", "Controlled open state on Sheet."),
      prop("defaultOpen", "boolean", "false", "Initial uncontrolled open state."),
      prop(
        "onOpenChange",
        "(open: boolean) => void",
        "—",
        "Called when the sheet opens or closes.",
      ),
      prop(
        "side",
        "'top' | 'bottom' | 'left' | 'right'",
        "'right'",
        "Viewport edge that SheetContent slides from.",
      ),
    ],
  },
  sidebar: {
    inheritedProps: "Div and button attributes on Sidebar slots and navigation menu subcomponents.",
    props: [
      prop(
        "asChild",
        "boolean",
        "false",
        "Renders NavigationMenuButton through Slot for link composition.",
      ),
      prop(
        "active",
        "boolean",
        "false",
        "Marks NavigationMenuButton as current and sets active styling.",
      ),
      prop(
        "className",
        "string",
        "—",
        "Additional classes for sidebar regions or navigation slots.",
      ),
    ],
  },
  sonner: {
    inheritedProps:
      "ToasterProps from sonner; Nexu applies theme classes, colors, and toastOptions defaults.",
    props: [
      prop("position", "ToasterProps['position']", "sonner default", "Toast viewport position."),
      prop(
        "theme",
        "ToasterProps['theme']",
        "Nexu theme",
        "Sonner theme setting; normally inherited from Nexu styling.",
      ),
      prop(
        "toastOptions",
        "ToasterProps['toastOptions']",
        "Nexu defaults",
        "Per-toast class and style overrides merged with Nexu defaults.",
      ),
    ],
  },
  "split-view": {
    inheritedProps: "Div attributes on SplitView, ResizablePanel, and ResizableHandle.",
    props: [
      prop(
        "orientation",
        "'horizontal' | 'vertical'",
        "'horizontal'",
        "Layout direction or resize axis.",
      ),
      prop("size", "number | string", "—", "Fixed panel size; numbers are treated as pixels."),
      prop("minSize", "number | string", "—", "Minimum panel size."),
      prop("maxSize", "number | string", "—", "Maximum panel size."),
      prop("collapsed", "boolean", "false", "Collapses a panel to zero size."),
      prop("onResizeStart", "() => void", "—", "Called when handle dragging starts."),
      prop("onResize", "(delta: number) => void", "—", "Called with drag delta while resizing."),
      prop("onResizeEnd", "() => void", "—", "Called when handle dragging ends."),
    ],
  },
  "stat-card": {
    inheritedProps:
      "Card props except children, including Card variant, padding, className, data-*, and aria-* props.",
    props: [
      prop("label", "ReactNode", "required", "Metric label."),
      prop("value", "ReactNode", "required", "Primary metric value."),
      prop("icon", "React.ElementType", "—", "Optional leading icon component."),
      prop(
        "tone",
        "'default' | 'info' | 'accent' | 'success' | 'warning' | 'danger'",
        "'default'",
        "Icon background tone.",
      ),
      prop(
        "trend",
        "{ label: ReactNode; variant?: BadgeProps['variant'] }",
        "—",
        "Trend badge content and variant.",
      ),
      prop("meta", "ReactNode", "—", "Secondary text below the value."),
      prop("progress", "number | null", "—", "Optional progress bar value."),
      prop("progressVariant", "ProgressProps['variant']", "'default'", "Progress bar color."),
      prop("progressMax", "number", "—", "Maximum progress value."),
    ],
  },
  "stats-bar": {
    inheritedProps:
      "Div attributes on the bar; interactive items render buttons when onSelect is provided.",
    props: [
      prop("items", "StatsBarItem[]", "required", "Metric entries rendered across the bar."),
      prop("items[].id", "string", "required", "Stable item key."),
      prop("items[].label", "ReactNode", "required", "Item label."),
      prop("items[].value", "ReactNode", "required", "Item value."),
      prop(
        "items[].tone",
        "'default' | 'info' | 'accent' | 'success' | 'warning' | 'danger'",
        "'default'",
        "Value color tone.",
      ),
      prop("items[].selected", "boolean", "false", "Selected item styling."),
      prop("items[].disabled", "boolean", "false", "Disables interactive item selection."),
      prop("items[].onSelect", "() => void", "—", "Turns the item into a selectable button."),
    ],
  },
  "status-dot": {
    inheritedProps: "Span attributes such as className, title, data-*, and aria-* props.",
    props: [
      prop(
        "status",
        "'success' | 'warning' | 'error' | 'info' | 'neutral'",
        "'neutral'",
        "Semantic dot color.",
      ),
      prop("size", "'xs' | 'sm' | 'default' | 'lg'", "'default'", "Dot diameter preset."),
      prop("pulse", "boolean", "false", "Adds a subtle animated pulse."),
    ],
  },
  stepper: {
    inheritedProps:
      "Ordered list, list item, separator div, and aria attributes on Stepper exports.",
    props: [
      prop("orientation", "'horizontal' | 'vertical'", "'horizontal'", "Stepper layout direction."),
      prop("status", "'pending' | 'current' | 'completed'", "'pending'", "State of a StepperItem."),
      prop("step", "ReactNode", "—", "Step number or custom indicator content."),
      prop("label", "ReactNode", "—", "Step label."),
      prop("description", "ReactNode", "—", "Supporting text for the step."),
      prop("icon", "ReactNode", "—", "Custom indicator icon."),
      prop("trailing", "ReactNode", "—", "Trailing content in vertical layouts."),
      prop("active", "boolean", "false", "Active connector state on StepperSeparator."),
    ],
  },
  table: {
    inheritedProps:
      "Native table, section, row, cell, and caption attributes on matching Table exports.",
    props: [
      prop("density", "'default' | 'compact'", "'default'", "Table row spacing scale."),
      prop("hoverable", "boolean", "true", "Enables row hover styling."),
      prop("selected", "boolean", "false", "Selected state on TableRow."),
      prop("className", "string", "—", "Additional classes for table slots."),
    ],
  },
  "tag-group": {
    inheritedProps: "Div attributes on TagGroup and BadgeProps on TagGroupItem.",
    props: [
      prop(
        "variant",
        "BadgeProps['variant']",
        "Badge default",
        "Badge color treatment for TagGroupItem.",
      ),
      prop("size", "BadgeProps['size']", "Badge default", "Badge size for TagGroupItem."),
      prop("radius", "BadgeProps['radius']", "Badge default", "Badge radius for TagGroupItem."),
      prop("className", "string", "—", "Additional classes for group layout or tag items."),
    ],
  },
  "text-link": {
    inheritedProps:
      "Anchor attributes such as href, target, rel, onClick, and aria-* props; asChild renders through Slot.",
    props: [
      prop("variant", "'default' | 'muted'", "'default'", "Link color and emphasis treatment."),
      prop("size", "'xs' | 'sm' | 'default' | 'lg' | 'inherit'", "'sm'", "Text size preset."),
      prop(
        "asChild",
        "boolean",
        "false",
        "Renders through Slot for router links or custom anchors.",
      ),
      prop(
        "showArrowUpRight",
        "boolean",
        "false",
        "Appends the standard external/up-right arrow when not using asChild.",
      ),
    ],
  },
  textarea: {
    inheritedProps:
      "Native textarea attributes such as rows, value, onChange, placeholder, disabled, and aria-* props.",
    props: [
      prop(
        "invalid",
        "boolean",
        "false",
        "Applies error styling and sets aria-invalid on the textarea.",
      ),
    ],
  },
  "theme-root": {
    inheritedProps: "Div attributes such as className, data-*, aria-* props, and children.",
    props: [
      prop(
        "theme",
        "'light' | 'dark' | 'system'",
        "'system'",
        "Theme mode scoped to the wrapped surface.",
      ),
    ],
  },
  toggle: {
    inheritedProps:
      "Radix Toggle Root, ToggleGroup Root, and ToggleGroup Item props on matching exports.",
    props: [
      prop(
        "variant",
        "'default' | 'outline' | 'compact' | 'pill' | 'underline'",
        "'default'",
        "Toggle or group visual treatment.",
      ),
      prop(
        "size",
        "'none' | 'sm' | 'default' | 'lg'",
        "'default'",
        "Toggle height and padding preset.",
      ),
      prop("pressed", "boolean", "—", "Controlled pressed state on Toggle."),
      prop("defaultPressed", "boolean", "false", "Initial uncontrolled pressed state on Toggle."),
      prop(
        "onPressedChange",
        "(pressed: boolean) => void",
        "—",
        "Called when Toggle pressed state changes.",
      ),
      prop(
        "type",
        "'single' | 'multiple'",
        "required on ToggleGroup",
        "Selection mode for ToggleGroup.",
      ),
      prop("value", "string | string[]", "—", "Controlled ToggleGroup selected value or values."),
      prop(
        "onValueChange",
        "(value: string | string[]) => void",
        "—",
        "Called when ToggleGroup selection changes.",
      ),
    ],
  },
  "topic-card": {
    inheritedProps: "Native button attributes such as type, onClick, disabled, and aria-* props.",
    props: [
      prop("title", "string", "required", "Topic title."),
      prop("author", "string", "required", "Topic starter name."),
      prop(
        "status",
        "'active' | 'needs-review' | 'blocked' | 'done' | 'archived'",
        "'active'",
        "Topic state.",
      ),
      prop("lastActivity", "string", "required", "Human-readable latest activity time."),
      prop("replies", "number", "required", "Reply count."),
      prop("participants", "string[]", "required", "Participant initials or labels."),
      prop("preview", "ReactNode", "—", "Latest reply or summary preview."),
      prop("assignee", "TopicAssignee", "—", "Optional owner/assignee metadata."),
      prop("type", "'button' | 'submit' | 'reset'", "'button'", "Native button type."),
    ],
  },
  "video-attachment": {
    inheritedProps: "Native button attributes such as type, onClick, disabled, and aria-* props.",
    props: [
      prop("thumbnail", "string", "required", "Video thumbnail image URL."),
      prop("duration", "string", "required", "Displayed duration label."),
      prop("title", "string", "required", "Video title."),
      prop("meta", "ReactNode", "—", "Secondary footer metadata."),
      prop("thumbnailAlt", "string", "title", "Alternative text for the thumbnail image."),
      prop("type", "'button' | 'submit' | 'reset'", "'button'", "Native button type."),
    ],
  },
  "voice-message": {
    inheritedProps: "Div attributes such as className, data-*, aria-* props, and children.",
    props: [
      prop("duration", "string", "required", "Duration label shown beside playback controls."),
      prop("transcript", "ReactNode", "—", "Optional transcript content."),
      prop("defaultTranscriptOpen", "boolean", "false", "Starts transcript content expanded."),
      prop(
        "transcriptToggleLabel",
        "string",
        "auto-generated",
        "Accessible label for the transcript toggle.",
      ),
      prop("waveform", "number[]", "DEFAULT_WAVEFORM", "Waveform bar heights."),
      prop("onPlay", "() => void", "—", "Called when the play button is pressed."),
      prop("state", "'idle' | 'playing'", "'idle'", "Playback state for the play affordance."),
    ],
  },
  "auth-shell": {
    inheritedProps: "Div attributes such as className, data-*, aria-* props, and children.",
    props: [
      prop("rail", "ReactNode", "—", "Optional left rail content."),
      prop("railClassName", "string", "—", "Classes for the rail container."),
      prop("contentClassName", "string", "—", "Classes for the main content pane."),
      prop("contentContainerClassName", "string", "—", "Classes for the centered content wrapper."),
      prop("contentInnerClassName", "string", "—", "Classes for the inner content width wrapper."),
      prop(
        "contentBackdrop",
        "ReactNode",
        "—",
        "Custom backdrop; otherwise the built-in grid backdrop is used.",
      ),
    ],
  },
  "brand-rail": {
    inheritedProps:
      "Aside attributes except native title, which is replaced by the React title prop.",
    props: [
      prop("logo", "ReactNode", "—", "Brand or product logo slot."),
      prop("logoLabel", "string", "'Brand'", "Accessible label for the logo button."),
      prop("onLogoClick", "() => void", "—", "Makes the logo area interactive."),
      prop("topRight", "ReactNode", "—", "Top-right utility slot."),
      prop("title", "ReactNode", "—", "Primary rail heading."),
      prop("description", "ReactNode", "—", "Supporting rail description."),
      prop("footer", "ReactNode", "—", "Footer slot."),
      prop("background", "ReactNode", "—", "Custom background layer."),
      prop("bodyClassName", "string", "—", "Classes for the main body stack."),
      prop("tone", "'light' | 'dark'", "'dark'", "Rail color scheme."),
    ],
  },
  "budget-popover": {
    inheritedProps:
      "Popover Root props plus trigger-as-child composition and PopoverContent alignment props.",
    props: [
      prop(
        "trigger",
        "ReactElement",
        "required",
        "Element rendered through PopoverTrigger asChild.",
      ),
      prop("title", "ReactNode", "required", "Popover heading."),
      prop("description", "ReactNode", "—", "Supporting copy."),
      prop("items", "BudgetPopoverItem[]", "[]", "Usage, limit, or budget detail rows."),
      prop("summary", "ReactNode", "—", "Optional summary block."),
      prop("footer", "ReactNode", "—", "Footer slot."),
      prop("contentClassName", "string", "—", "Classes for popover content."),
      prop("align", "PopoverContentProps['align']", "'end'", "Horizontal popover alignment."),
      prop("sideOffset", "number", "8", "Distance from trigger."),
      prop("open", "boolean", "—", "Controlled open state."),
      prop("defaultOpen", "boolean", "—", "Initial uncontrolled open state."),
      prop("onOpenChange", "(open: boolean) => void", "—", "Called when open state changes."),
    ],
  },
  "confirm-dialog": {
    inheritedProps:
      "Dialog Root props via open/defaultOpen/onOpenChange; trigger is rendered asChild.",
    props: [
      prop("title", "ReactNode", "required", "Dialog title."),
      prop("description", "ReactNode", "—", "Dialog description."),
      prop("trigger", "ReactNode", "—", "Optional trigger element."),
      prop("confirmLabel", "ReactNode", "'Confirm'", "Confirm button label."),
      prop("cancelLabel", "ReactNode", "'Cancel'", "Cancel button label."),
      prop(
        "confirmVariant",
        "ButtonProps['variant']",
        "'destructive'",
        "Confirm button visual style.",
      ),
      prop("open", "boolean", "—", "Controlled open state."),
      prop("defaultOpen", "boolean", "—", "Initial uncontrolled open state."),
      prop("onOpenChange", "(open: boolean) => void", "—", "Called when open state changes."),
      prop(
        "onConfirm",
        "MouseEventHandler<HTMLButtonElement>",
        "—",
        "Called when users press confirm.",
      ),
    ],
  },
  "credits-capsule": {
    inheritedProps: "Div attributes such as className, data-*, aria-* props, and children.",
    props: [
      prop("title", "ReactNode", "'Credits'", "Capsule heading."),
      prop("badge", "ReactNode", "—", "Inline badge next to the heading."),
      prop("value", "ReactNode", "required", "Primary credit value."),
      prop("meta", "ReactNode", "—", "Secondary metadata."),
      prop("hint", "ReactNode", "—", "Additional helper text."),
      prop("action", "ReactNode", "—", "Action slot."),
      prop("breakdown", "ReactNode", "—", "Detailed breakdown below progress."),
      prop("footer", "ReactNode", "—", "Footer slot."),
      prop("progress", "number | null", "—", "Optional progress value."),
      prop("progressMax", "number", "—", "Maximum progress value."),
      prop(
        "progressVariant",
        "'default' | 'success' | 'warning' | 'accent'",
        "'accent'",
        "Progress color.",
      ),
      prop(
        "progressAriaLabel",
        "string",
        "'Credit usage progress'",
        "Accessible label for the progress bar.",
      ),
    ],
  },
  "empty-state": {
    inheritedProps:
      "Div attributes except native title, which is replaced by the React title prop.",
    props: [
      prop("title", "ReactNode", "required", "Empty-state heading."),
      prop("description", "ReactNode", "—", "Supporting copy."),
      prop("icon", "ReactNode", "—", "Icon or illustration slot."),
      prop("action", "ReactNode", "—", "Primary recovery or creation action."),
    ],
  },
  "filter-pills": {
    inheritedProps:
      "Radix Tabs Root, List, Trigger, and Content props; list and trigger hard-code the default variant.",
    props: [
      prop("value", "string", "—", "Controlled active pill value."),
      prop("defaultValue", "string", "—", "Initial uncontrolled active value."),
      prop("onValueChange", "(value: string) => void", "—", "Called when users select a pill."),
      prop("disabled", "boolean", "false", "Disables an individual FilterPillTrigger."),
    ],
  },
  "follow-up-input": {
    inheritedProps:
      "Div attributes on the wrapper plus textareaProps and buttonProps passthrough with documented omissions.",
    props: [
      prop("placeholder", "string", "—", "Textarea placeholder."),
      prop("value", "string", "—", "Controlled text value."),
      prop("defaultValue", "string", "''", "Initial uncontrolled text value."),
      prop("onValueChange", "(value: string) => void", "—", "Called when text changes."),
      prop("onSend", "(value: string) => void", "—", "Called with trimmed text when users send."),
      prop("sendLabel", "string", "'Send follow-up'", "Accessible label for the send button."),
      prop("textareaClassName", "string", "—", "Classes for the textarea."),
      prop("buttonClassName", "string", "—", "Classes for the send button."),
      prop(
        "textareaProps",
        "TextareaHTMLAttributes<HTMLTextAreaElement>",
        "—",
        "Additional textarea attributes except value/defaultValue/onChange/placeholder.",
      ),
      prop(
        "buttonProps",
        "ButtonProps",
        "—",
        "Additional button props except type/onClick/children.",
      ),
    ],
  },
  "form-field": {
    inheritedProps:
      "Wrapper and helper props for label, control, description, and error composition.",
    props: [
      prop("label", "ReactNode", "—", "Field label."),
      prop("description", "ReactNode", "—", "Supporting description."),
      prop("error", "ReactNode", "—", "Validation error text."),
      prop("required", "boolean", "false", "Shows required marker."),
      prop("invalid", "boolean", "false", "Marks the field invalid and wires aria-invalid."),
      prop(
        "orientation",
        "'vertical' | 'horizontal'",
        "'vertical'",
        "Label/control layout orientation.",
      ),
      prop("labelClassName", "string", "—", "Classes for the generated label."),
      prop("children", "ReactNode", "—", "Field control and supporting slots."),
    ],
  },
  "page-header": {
    inheritedProps:
      "Header element attributes except native title, which is replaced by the React title prop.",
    props: [
      prop("title", "ReactNode", "required", "Page heading."),
      prop("description", "ReactNode", "—", "Optional subtitle or supporting context."),
      prop("actions", "ReactNode", "—", "Right-aligned action slot."),
      prop("density", "'default' | 'shell'", "'default'", "Spacing and type scale preset."),
    ],
  },
  "page-shell": {
    inheritedProps: "Div attributes such as className, data-*, aria-* props, and children.",
    props: [
      prop(
        "className",
        "string",
        "—",
        "Additional classes for page width, padding, or layout composition.",
      ),
    ],
  },
  "section-header": {
    inheritedProps:
      "Div attributes except native title, which is replaced by the React title prop.",
    props: [
      prop("title", "ReactNode", "required", "Section heading."),
      prop("action", "ReactNode", "—", "Optional section-level action slot."),
    ],
  },
  "skill-marketplace-card": {
    inheritedProps: "Div attributes such as className, data-*, aria-* props, and children.",
    props: [
      prop("name", "string", "required", "Skill name."),
      prop("description", "string", "required", "Skill description."),
      prop("categoryLabel", "string | null", "—", "Optional category label."),
      prop("logo", "string", "—", "Optional logo image URL."),
      prop(
        "icon",
        "React.ElementType<{ size?: number; className?: string }>",
        "—",
        "Fallback icon component.",
      ),
      prop(
        "dimmed",
        "boolean",
        "false",
        "Reduces card emphasis for unavailable or secondary entries.",
      ),
      prop("footer", "ReactNode", "—", "Footer action or metadata slot."),
    ],
  },
  "underline-tabs": {
    inheritedProps:
      "Radix Tabs Root, List, Trigger, and Content props; list and trigger hard-code the default variant.",
    props: [
      prop("value", "string", "—", "Controlled active tab value."),
      prop("defaultValue", "string", "—", "Initial uncontrolled active value."),
      prop("onValueChange", "(value: string) => void", "—", "Called when users activate a tab."),
      prop("disabled", "boolean", "false", "Disables an individual UnderlineTabsTrigger."),
    ],
  },
};

export const componentMetadata: ComponentMetadata[] = publicComponentInventory
  .filter((inventoryItem) => inventoryItem.documentable && inventoryItem.docsSlug)
  .map((inventoryItem) => {
    const definition =
      componentDocDefinitionsById.get(inventoryItem.id) ??
      createGeneratedComponentDocDefinition(inventoryItem);

    if (!inventoryItem.docsSlug || !inventoryItem.importSnippet) {
      throw new Error(`Missing public API inventory metadata for component: ${definition.id}`);
    }

    return {
      ...definition,
      importSnippet: inventoryItem.importSnippet,
      examples: (inventoryItem.examples.length > 0
        ? inventoryItem.examples
        : definition.examples) as readonly ExampleId[],
      docsSlug: inventoryItem.docsSlug,
      storybookId: inventoryItem.storybookId,
      storybookPath: inventoryItem.storybookPath,
      storybookTitle: inventoryItem.storybookTitle,
      coverage: inventoryItem.coverage,
      sourcePath: inventoryItem.sourcePath,
      packageName: inventoryItem.packageName,
      exports: inventoryItem.exports,
    };
  });

function createGeneratedComponentDocDefinition(
  inventoryItem: PublicApiInventoryItem,
): ComponentDocDefinition {
  const kindLabel = inventoryItem.kind === "pattern" ? "pattern" : "primitive";
  const exportsList = inventoryItem.exports.join(", ");
  const description = getGeneratedComponentDescription(inventoryItem);
  const generatedProps = generatedPropsById[inventoryItem.id];

  return {
    id: inventoryItem.id,
    title: inventoryItem.name,
    description,
    overview: `${inventoryItem.name} provides a production-ready ${kindLabel} for building consistent Nexu Design interfaces. Use it when you need a reusable, token-aligned solution with predictable layout, interaction, and accessibility behavior.`,
    usage: `Import ${inventoryItem.importSnippet ? "the documented symbol" : inventoryItem.name} and compose it with existing Nexu Design primitives instead of creating one-off local UI. Keep labels, keyboard behavior, and semantic states intact when adapting it to product surfaces.`,
    examples: [],
    accessibility: [
      "Preserve native element, Radix, and aria-* behavior exposed by the component.",
      "Provide visible labels or aria-label values for icon-only and form-related controls.",
      "Keep keyboard focus, disabled, loading, and validation states discoverable and testable.",
    ],
    inheritedProps:
      generatedProps?.inheritedProps ??
      `documented exports from ${inventoryItem.sourcePath}: ${exportsList}.`,
    props: generatedProps?.props ?? [
      {
        name: "className",
        type: "string",
        defaultValue: "—",
        description:
          "Additional classes when supported by the underlying component. Use semantic tokens and the shared cn() helper for composition.",
      },
      {
        name: "...props",
        type: "Component-specific React props",
        defaultValue: "—",
        description:
          "Additional props forwarded to the underlying element. See the component source for the full type surface.",
      },
    ],
  };
}

function prop(name: string, type: string, defaultValue: string, description: string): PropMetadata {
  return { name, type, defaultValue, description };
}

function getGeneratedComponentDescription(inventoryItem: PublicApiInventoryItem) {
  const descriptions: Record<string, string> = {
    accordion:
      "Organize related sections into expandable panels for dense product settings and reference content.",
    "activity-bar":
      "Present compact workspace navigation with clear active state and grouped actions.",
    avatar:
      "Represent people, agents, and identities with consistent fallback, image, and sizing behavior.",
    breadcrumb: "Show page hierarchy and current location with accessible navigation semantics.",
    "chat-message":
      "Render rich chat-feed rows with sender metadata, reactions, mentions, and attachments.",
    collapsible:
      "Reveal optional content inline while preserving accessible trigger and region relationships.",
    combobox:
      "Let users search and choose from a controlled list of options with keyboard-friendly behavior.",
    "conversation-message":
      "Display assistant, user, system, and status messages in conversational interfaces.",
    "data-table":
      "Frame tabular product data with headers, toolbars, empty states, and footer context.",
    "detail-panel":
      "Provide a persistent side panel for inspecting selected records without leaving context.",
    "entity-card":
      "Summarize selectable entities with media, metadata, descriptions, and footer actions.",
    "event-notice":
      "Insert low-emphasis feed notices for joins, pins, assignments, and other timeline events.",
    "file-attachment":
      "Display downloadable file rows with type-aware icons, metadata, and hover affordances.",
    "image-attachment":
      "Show a single image attachment with sizing, caption, loading fallback, and optional selection.",
    "image-gallery":
      "Preview multiple image attachments in a compact thumbnail grid with overflow handling.",
    "interactive-row":
      "Build full-width selectable rows for settings, lists, and navigation-like product surfaces.",
    label:
      "Associate controls with concise field labels that match Nexu form and settings density.",
    logo: "Render provider, platform, runtime, model, and Nexu brand marks with consistent sizing.",
    "nav-item": "Create compact navigation rows with selected, hover, and disabled states.",
    "panel-footer":
      "Align footer metadata and actions consistently at the bottom of panels and sheets.",
    "pricing-card":
      "Present plan pricing, feature lists, badges, and calls to action in a balanced card layout.",
    progress:
      "Communicate determinate progress with semantic variants, sizes, and accessible progressbar state.",
    prose:
      "Style rich text content with Nexu typography, spacing, tables, quotes, and inline code treatments.",
    "radio-group":
      "Collect a single choice from related options with native radio-group accessibility.",
    "scroll-area":
      "Provide constrained scrolling regions with subtle, token-aligned scrollbar affordances.",
    separator: "Separate related content groups with accessible horizontal or vertical dividers.",
    sheet: "Open secondary workflows in an edge-aligned overlay without losing page context.",
    sidebar:
      "Structure application sidebars with header, content, footer, and navigation menu regions.",
    sonner: "Render toast notifications with Nexu surface, border, and semantic status styling.",
    "split-view": "Compose resizable panel layouts for master-detail and multi-pane workspaces.",
    "stat-card":
      "Highlight key metrics with trend badges, icons, supporting metadata, and optional progress.",
    "stats-bar":
      "Display compact metric summaries across dashboards, lists, and filtered data views.",
    "status-dot":
      "Show concise semantic status indicators for availability, health, and processing states.",
    stepper: "Guide users through ordered workflows with current, completed, and pending steps.",
    table:
      "Render structured data tables with density, hover, selected rows, and semantic table elements.",
    "tag-group": "Group short labels and metadata tags with consistent badge styling and spacing.",
    "text-link":
      "Use inline and standalone links with token-aware color, sizing, and optional external affordance.",
    textarea: "Collect multiline text with consistent sizing, focus, invalid, and resize behavior.",
    "theme-root": "Scope light, dark, or system theme behavior around a product surface.",
    toggle:
      "Let users switch compact view, formatting, and filter states with toggle buttons or groups.",
    "topic-card":
      "Summarize persistent discussion topics with status, participants, previews, and reply counts.",
    "video-attachment":
      "Preview video files with thumbnail, play affordance, duration, title, and metadata.",
    "voice-message":
      "Display voice notes with playback controls, waveform, duration, and optional transcript.",
    "auth-shell":
      "Compose authentication screens with a branded rail and focused form content area.",
    "brand-rail":
      "Create branded side rails for onboarding, authentication, and high-emphasis product entry points.",
    "budget-popover": "Explain usage, limits, and budget details in a compact contextual popover.",
    "confirm-dialog":
      "Ask users to confirm consequential actions with clear cancel and confirm affordances.",
    "credits-capsule":
      "Summarize credit usage with progress, metadata, breakdowns, and upgrade actions.",
    "empty-state": "Guide users from an empty surface toward the next useful action.",
    "filter-pills": "Switch between filtered views with compact pill-style tab controls.",
    "follow-up-input":
      "Capture lightweight follow-up prompts with a multiline input and send action.",
    "form-field":
      "Wire labels, descriptions, controls, and validation messages into accessible form fields.",
    "page-header":
      "Introduce product pages with title, description, density options, and primary actions.",
    "page-shell": "Constrain page content to a readable product layout with consistent padding.",
    "section-header": "Label page sections with balanced action placement and reusable spacing.",
    "skill-marketplace-card":
      "Present marketplace skills with icon, category, description, and footer actions.",
    "underline-tabs": "Switch content sections with a low-profile underline tab treatment.",
  };

  return (
    descriptions[inventoryItem.id] ??
    `Build consistent ${inventoryItem.name} experiences with Nexu Design tokens, accessibility behavior, and reusable component composition.`
  );
}

export const componentMetadataById = Object.fromEntries(
  componentMetadata.map((component) => [component.id, component]),
) as Record<ComponentMetadata["id"], ComponentMetadata>;

export const exampleMetadata: ExampleMetadata[] = exampleIds.map((id) => {
  const example = examples[id];
  return {
    id: example.id,
    title: example.title,
    description: example.description,
    category: example.category,
    filePath: example.filePath,
    source: example.source,
  };
});

const tokenMetadataPagesInput = [
  {
    id: "colors",
    title: "Colors",
    groups: [
      { title: "Semantic", tokens: semanticColorTokens },
      { title: "Surface", tokens: surfaceTokens },
      { title: "Border", tokens: borderTokens },
      { title: "Text", tokens: textLevelTokens },
      { title: "Dark surfaces", tokens: darkSurfaceTokens },
      { title: "Accent variants", tokens: accentVariantTokens },
    ],
  },
  {
    id: "typography",
    title: "Typography",
    groups: [
      { title: "Font families", tokens: typographyTokens },
      { title: "Type scale", tokens: fontSizeTokens },
      { title: "Weights", tokens: fontWeightTokens },
    ],
    textStyles: textStyleTokens,
  },
  { id: "spacing", title: "Spacing", groups: [{ title: "Spacing scale", tokens: spacingTokens }] },
  { id: "radius", title: "Radius", groups: [{ title: "Radius scale", tokens: radiusTokens }] },
  { id: "shadow", title: "Shadow", groups: [{ title: "Elevation scale", tokens: shadowTokens }] },
  { id: "motion", title: "Motion", groups: [{ title: "Timing", tokens: motionTokens }] },
] as const;

export const tokenMetadataPages = tokenMetadataPagesInput.map((page) => ({
  ...page,
  groups: page.groups.map((group) => ({
    title: group.title,
    tokens: group.tokens.map((token) => ({
      ...token,
      page: page.id,
      group: group.title,
      resolvedValue: themeVariables.light[token.cssVar] ?? String(token.value),
    })),
  })),
})) as Array<TokenMetadataPage | TypographyTokenMetadataPage>;

export const tokenMetadata = tokenMetadataPages.flatMap((page) =>
  page.groups.flatMap((group) => group.tokens),
);

export function getComponentMetadata(id: string) {
  return componentMetadata.find((component) => component.id === id);
}

export function getComponentMetadataBySlug(slug: string | string[]) {
  const normalizedSlug = Array.isArray(slug) ? `/${slug.join("/")}` : slug;
  return componentMetadata.find((component) => component.docsSlug === normalizedSlug);
}

export function getTokenMetadataPage(pageId: TokenMetadataPageId) {
  return tokenMetadataPages.find((page) => page.id === pageId);
}

export const inventoryMetadata = publicApiInventory.map((item) => ({
  id: item.id,
  name: item.name,
  kind: item.kind,
  status: item.status,
  packageName: item.packageName,
  exports: item.exports,
  importSnippet: item.importSnippet,
  docsSlug: item.docsSlug,
  storybookId: item.storybookId,
  storybookPath: item.storybookPath,
  storybookTitle: item.storybookTitle,
  examples: item.examples,
  coverage: item.coverage,
  sourcePath: item.sourcePath,
}));
