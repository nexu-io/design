import { readFileSync } from "node:fs";
import path from "node:path";

export const exampleIds = [
  "accordion/basic",
  "activity-bar/basic",
  "alert/basic",
  "auth-shell/basic",
  "avatar/basic",
  "badge/basic",
  "brand-rail/basic",
  "breadcrumb/basic",
  "budget-popover/basic",
  "button/basic",
  "button/loading",
  "button/variants",
  "card/basic",
  "chat-message/basic",
  "checkbox/basic",
  "collapsible/basic",
  "combobox/basic",
  "confirm-dialog/basic",
  "conversation-message/basic",
  "credits-capsule/basic",
  "data-table/basic",
  "detail-panel/basic",
  "dialog/basic",
  "dropdown-menu/basic",
  "empty-state/basic",
  "entity-card/basic",
  "event-notice/basic",
  "file-attachment/basic",
  "filter-pills/basic",
  "follow-up-input/basic",
  "form-field/basic",
  "image-attachment/basic",
  "image-gallery/basic",
  "input/basic",
  "interactive-row/basic",
  "label/basic",
  "logo/basic",
  "nav-item/basic",
  "page-header/basic",
  "page-shell/basic",
  "panel-footer/basic",
  "popover/basic",
  "pricing-card/basic",
  "progress/basic",
  "prose/basic",
  "radio-group/basic",
  "scroll-area/basic",
  "section-header/basic",
  "select/basic",
  "separator/basic",
  "sheet/basic",
  "sidebar/basic",
  "skeleton/basic",
  "skill-marketplace-card/basic",
  "sonner/basic",
  "spinner/basic",
  "split-view/basic",
  "stat-card/basic",
  "stats-bar/basic",
  "status-dot/basic",
  "stepper/basic",
  "switch/basic",
  "table/basic",
  "tabs/basic",
  "tag-group/basic",
  "text-link/basic",
  "textarea/basic",
  "theme-root/basic",
  "toggle/basic",
  "tooltip/basic",
  "topic-card/basic",
  "underline-tabs/basic",
  "video-attachment/basic",
  "voice-message/basic",
] as const;

export type ExampleId = (typeof exampleIds)[number];

export type ExampleCategory = "components";

export interface ExampleDefinition {
  id: ExampleId;
  title: string;
  description?: string;
  category: ExampleCategory;
  source: string;
  filePath: `examples/${string}.tsx`;
}

export const examples = {
  "accordion/basic": defineExample({
    id: "accordion/basic",
    title: "Basic usage",
    description: "Runnable example for accordion.",
    category: "components",
    filePath: "examples/components/accordion/basic.tsx",
  }),
  "activity-bar/basic": defineExample({
    id: "activity-bar/basic",
    title: "Basic usage",
    description: "Runnable example for activity-bar.",
    category: "components",
    filePath: "examples/components/activity-bar/basic.tsx",
  }),
  "alert/basic": defineExample({
    id: "alert/basic",
    title: "Basic usage",
    description: "Runnable example for alert.",
    category: "components",
    filePath: "examples/components/alert/basic.tsx",
  }),
  "auth-shell/basic": defineExample({
    id: "auth-shell/basic",
    title: "Basic usage",
    description: "Runnable example for auth-shell.",
    category: "components",
    filePath: "examples/components/auth-shell/basic.tsx",
  }),
  "avatar/basic": defineExample({
    id: "avatar/basic",
    title: "Basic usage",
    description: "Runnable example for avatar.",
    category: "components",
    filePath: "examples/components/avatar/basic.tsx",
  }),
  "badge/basic": defineExample({
    id: "badge/basic",
    title: "Basic usage",
    description: "Runnable example for badge.",
    category: "components",
    filePath: "examples/components/badge/basic.tsx",
  }),
  "brand-rail/basic": defineExample({
    id: "brand-rail/basic",
    title: "Basic usage",
    description: "Runnable example for brand-rail.",
    category: "components",
    filePath: "examples/components/brand-rail/basic.tsx",
  }),
  "breadcrumb/basic": defineExample({
    id: "breadcrumb/basic",
    title: "Basic usage",
    description: "Runnable example for breadcrumb.",
    category: "components",
    filePath: "examples/components/breadcrumb/basic.tsx",
  }),
  "budget-popover/basic": defineExample({
    id: "budget-popover/basic",
    title: "Basic usage",
    description: "Runnable example for budget-popover.",
    category: "components",
    filePath: "examples/components/budget-popover/basic.tsx",
  }),
  "button/basic": defineExample({
    id: "button/basic",
    title: "Basic usage",
    description: "Runnable example for button.",
    category: "components",
    filePath: "examples/components/button/basic.tsx",
  }),
  "button/loading": defineExample({
    id: "button/loading",
    title: "Basic usage",
    description: "Runnable example for button.",
    category: "components",
    filePath: "examples/components/button/loading.tsx",
  }),
  "button/variants": defineExample({
    id: "button/variants",
    title: "Basic usage",
    description: "Runnable example for button.",
    category: "components",
    filePath: "examples/components/button/variants.tsx",
  }),
  "card/basic": defineExample({
    id: "card/basic",
    title: "Basic usage",
    description: "Runnable example for card.",
    category: "components",
    filePath: "examples/components/card/basic.tsx",
  }),
  "chat-message/basic": defineExample({
    id: "chat-message/basic",
    title: "Basic usage",
    description: "Runnable example for chat-message.",
    category: "components",
    filePath: "examples/components/chat-message/basic.tsx",
  }),
  "checkbox/basic": defineExample({
    id: "checkbox/basic",
    title: "Basic usage",
    description: "Runnable example for checkbox.",
    category: "components",
    filePath: "examples/components/checkbox/basic.tsx",
  }),
  "collapsible/basic": defineExample({
    id: "collapsible/basic",
    title: "Basic usage",
    description: "Runnable example for collapsible.",
    category: "components",
    filePath: "examples/components/collapsible/basic.tsx",
  }),
  "combobox/basic": defineExample({
    id: "combobox/basic",
    title: "Basic usage",
    description: "Runnable example for combobox.",
    category: "components",
    filePath: "examples/components/combobox/basic.tsx",
  }),
  "confirm-dialog/basic": defineExample({
    id: "confirm-dialog/basic",
    title: "Basic usage",
    description: "Runnable example for confirm-dialog.",
    category: "components",
    filePath: "examples/components/confirm-dialog/basic.tsx",
  }),
  "conversation-message/basic": defineExample({
    id: "conversation-message/basic",
    title: "Basic usage",
    description: "Runnable example for conversation-message.",
    category: "components",
    filePath: "examples/components/conversation-message/basic.tsx",
  }),
  "credits-capsule/basic": defineExample({
    id: "credits-capsule/basic",
    title: "Basic usage",
    description: "Runnable example for credits-capsule.",
    category: "components",
    filePath: "examples/components/credits-capsule/basic.tsx",
  }),
  "data-table/basic": defineExample({
    id: "data-table/basic",
    title: "Basic usage",
    description: "Runnable example for data-table.",
    category: "components",
    filePath: "examples/components/data-table/basic.tsx",
  }),
  "detail-panel/basic": defineExample({
    id: "detail-panel/basic",
    title: "Basic usage",
    description: "Runnable example for detail-panel.",
    category: "components",
    filePath: "examples/components/detail-panel/basic.tsx",
  }),
  "dialog/basic": defineExample({
    id: "dialog/basic",
    title: "Basic usage",
    description: "Runnable example for dialog.",
    category: "components",
    filePath: "examples/components/dialog/basic.tsx",
  }),
  "dropdown-menu/basic": defineExample({
    id: "dropdown-menu/basic",
    title: "Basic usage",
    description: "Runnable example for dropdown-menu.",
    category: "components",
    filePath: "examples/components/dropdown-menu/basic.tsx",
  }),
  "empty-state/basic": defineExample({
    id: "empty-state/basic",
    title: "Basic usage",
    description: "Runnable example for empty-state.",
    category: "components",
    filePath: "examples/components/empty-state/basic.tsx",
  }),
  "entity-card/basic": defineExample({
    id: "entity-card/basic",
    title: "Basic usage",
    description: "Runnable example for entity-card.",
    category: "components",
    filePath: "examples/components/entity-card/basic.tsx",
  }),
  "event-notice/basic": defineExample({
    id: "event-notice/basic",
    title: "Basic usage",
    description: "Runnable example for event-notice.",
    category: "components",
    filePath: "examples/components/event-notice/basic.tsx",
  }),
  "file-attachment/basic": defineExample({
    id: "file-attachment/basic",
    title: "Basic usage",
    description: "Runnable example for file-attachment.",
    category: "components",
    filePath: "examples/components/file-attachment/basic.tsx",
  }),
  "filter-pills/basic": defineExample({
    id: "filter-pills/basic",
    title: "Basic usage",
    description: "Runnable example for filter-pills.",
    category: "components",
    filePath: "examples/components/filter-pills/basic.tsx",
  }),
  "follow-up-input/basic": defineExample({
    id: "follow-up-input/basic",
    title: "Basic usage",
    description: "Runnable example for follow-up-input.",
    category: "components",
    filePath: "examples/components/follow-up-input/basic.tsx",
  }),
  "form-field/basic": defineExample({
    id: "form-field/basic",
    title: "Basic usage",
    description: "Runnable example for form-field.",
    category: "components",
    filePath: "examples/components/form-field/basic.tsx",
  }),
  "image-attachment/basic": defineExample({
    id: "image-attachment/basic",
    title: "Basic usage",
    description: "Runnable example for image-attachment.",
    category: "components",
    filePath: "examples/components/image-attachment/basic.tsx",
  }),
  "image-gallery/basic": defineExample({
    id: "image-gallery/basic",
    title: "Basic usage",
    description: "Runnable example for image-gallery.",
    category: "components",
    filePath: "examples/components/image-gallery/basic.tsx",
  }),
  "input/basic": defineExample({
    id: "input/basic",
    title: "Basic usage",
    description: "Runnable example for input.",
    category: "components",
    filePath: "examples/components/input/basic.tsx",
  }),
  "interactive-row/basic": defineExample({
    id: "interactive-row/basic",
    title: "Basic usage",
    description: "Runnable example for interactive-row.",
    category: "components",
    filePath: "examples/components/interactive-row/basic.tsx",
  }),
  "label/basic": defineExample({
    id: "label/basic",
    title: "Basic usage",
    description: "Runnable example for label.",
    category: "components",
    filePath: "examples/components/label/basic.tsx",
  }),
  "logo/basic": defineExample({
    id: "logo/basic",
    title: "Basic usage",
    description: "Runnable example for logo.",
    category: "components",
    filePath: "examples/components/logo/basic.tsx",
  }),
  "nav-item/basic": defineExample({
    id: "nav-item/basic",
    title: "Basic usage",
    description: "Runnable example for nav-item.",
    category: "components",
    filePath: "examples/components/nav-item/basic.tsx",
  }),
  "page-header/basic": defineExample({
    id: "page-header/basic",
    title: "Basic usage",
    description: "Runnable example for page-header.",
    category: "components",
    filePath: "examples/components/page-header/basic.tsx",
  }),
  "page-shell/basic": defineExample({
    id: "page-shell/basic",
    title: "Basic usage",
    description: "Runnable example for page-shell.",
    category: "components",
    filePath: "examples/components/page-shell/basic.tsx",
  }),
  "panel-footer/basic": defineExample({
    id: "panel-footer/basic",
    title: "Basic usage",
    description: "Runnable example for panel-footer.",
    category: "components",
    filePath: "examples/components/panel-footer/basic.tsx",
  }),
  "popover/basic": defineExample({
    id: "popover/basic",
    title: "Basic usage",
    description: "Runnable example for popover.",
    category: "components",
    filePath: "examples/components/popover/basic.tsx",
  }),
  "pricing-card/basic": defineExample({
    id: "pricing-card/basic",
    title: "Basic usage",
    description: "Runnable example for pricing-card.",
    category: "components",
    filePath: "examples/components/pricing-card/basic.tsx",
  }),
  "progress/basic": defineExample({
    id: "progress/basic",
    title: "Basic usage",
    description: "Runnable example for progress.",
    category: "components",
    filePath: "examples/components/progress/basic.tsx",
  }),
  "prose/basic": defineExample({
    id: "prose/basic",
    title: "Basic usage",
    description: "Runnable example for prose.",
    category: "components",
    filePath: "examples/components/prose/basic.tsx",
  }),
  "radio-group/basic": defineExample({
    id: "radio-group/basic",
    title: "Basic usage",
    description: "Runnable example for radio-group.",
    category: "components",
    filePath: "examples/components/radio-group/basic.tsx",
  }),
  "scroll-area/basic": defineExample({
    id: "scroll-area/basic",
    title: "Basic usage",
    description: "Runnable example for scroll-area.",
    category: "components",
    filePath: "examples/components/scroll-area/basic.tsx",
  }),
  "section-header/basic": defineExample({
    id: "section-header/basic",
    title: "Basic usage",
    description: "Runnable example for section-header.",
    category: "components",
    filePath: "examples/components/section-header/basic.tsx",
  }),
  "select/basic": defineExample({
    id: "select/basic",
    title: "Basic usage",
    description: "Runnable example for select.",
    category: "components",
    filePath: "examples/components/select/basic.tsx",
  }),
  "separator/basic": defineExample({
    id: "separator/basic",
    title: "Basic usage",
    description: "Runnable example for separator.",
    category: "components",
    filePath: "examples/components/separator/basic.tsx",
  }),
  "sheet/basic": defineExample({
    id: "sheet/basic",
    title: "Basic usage",
    description: "Runnable example for sheet.",
    category: "components",
    filePath: "examples/components/sheet/basic.tsx",
  }),
  "sidebar/basic": defineExample({
    id: "sidebar/basic",
    title: "Basic usage",
    description: "Runnable example for sidebar.",
    category: "components",
    filePath: "examples/components/sidebar/basic.tsx",
  }),
  "skeleton/basic": defineExample({
    id: "skeleton/basic",
    title: "Basic usage",
    description: "Runnable example for skeleton.",
    category: "components",
    filePath: "examples/components/skeleton/basic.tsx",
  }),
  "skill-marketplace-card/basic": defineExample({
    id: "skill-marketplace-card/basic",
    title: "Basic usage",
    description: "Runnable example for skill-marketplace-card.",
    category: "components",
    filePath: "examples/components/skill-marketplace-card/basic.tsx",
  }),
  "sonner/basic": defineExample({
    id: "sonner/basic",
    title: "Basic usage",
    description: "Runnable example for sonner.",
    category: "components",
    filePath: "examples/components/sonner/basic.tsx",
  }),
  "spinner/basic": defineExample({
    id: "spinner/basic",
    title: "Basic usage",
    description: "Runnable example for spinner.",
    category: "components",
    filePath: "examples/components/spinner/basic.tsx",
  }),
  "split-view/basic": defineExample({
    id: "split-view/basic",
    title: "Basic usage",
    description: "Runnable example for split-view.",
    category: "components",
    filePath: "examples/components/split-view/basic.tsx",
  }),
  "stat-card/basic": defineExample({
    id: "stat-card/basic",
    title: "Basic usage",
    description: "Runnable example for stat-card.",
    category: "components",
    filePath: "examples/components/stat-card/basic.tsx",
  }),
  "stats-bar/basic": defineExample({
    id: "stats-bar/basic",
    title: "Basic usage",
    description: "Runnable example for stats-bar.",
    category: "components",
    filePath: "examples/components/stats-bar/basic.tsx",
  }),
  "status-dot/basic": defineExample({
    id: "status-dot/basic",
    title: "Basic usage",
    description: "Runnable example for status-dot.",
    category: "components",
    filePath: "examples/components/status-dot/basic.tsx",
  }),
  "stepper/basic": defineExample({
    id: "stepper/basic",
    title: "Basic usage",
    description: "Runnable example for stepper.",
    category: "components",
    filePath: "examples/components/stepper/basic.tsx",
  }),
  "switch/basic": defineExample({
    id: "switch/basic",
    title: "Basic usage",
    description: "Runnable example for switch.",
    category: "components",
    filePath: "examples/components/switch/basic.tsx",
  }),
  "table/basic": defineExample({
    id: "table/basic",
    title: "Basic usage",
    description: "Runnable example for table.",
    category: "components",
    filePath: "examples/components/table/basic.tsx",
  }),
  "tabs/basic": defineExample({
    id: "tabs/basic",
    title: "Basic usage",
    description: "Runnable example for tabs.",
    category: "components",
    filePath: "examples/components/tabs/basic.tsx",
  }),
  "tag-group/basic": defineExample({
    id: "tag-group/basic",
    title: "Basic usage",
    description: "Runnable example for tag-group.",
    category: "components",
    filePath: "examples/components/tag-group/basic.tsx",
  }),
  "text-link/basic": defineExample({
    id: "text-link/basic",
    title: "Basic usage",
    description: "Runnable example for text-link.",
    category: "components",
    filePath: "examples/components/text-link/basic.tsx",
  }),
  "textarea/basic": defineExample({
    id: "textarea/basic",
    title: "Basic usage",
    description: "Runnable example for textarea.",
    category: "components",
    filePath: "examples/components/textarea/basic.tsx",
  }),
  "theme-root/basic": defineExample({
    id: "theme-root/basic",
    title: "Basic usage",
    description: "Runnable example for theme-root.",
    category: "components",
    filePath: "examples/components/theme-root/basic.tsx",
  }),
  "toggle/basic": defineExample({
    id: "toggle/basic",
    title: "Basic usage",
    description: "Runnable example for toggle.",
    category: "components",
    filePath: "examples/components/toggle/basic.tsx",
  }),
  "tooltip/basic": defineExample({
    id: "tooltip/basic",
    title: "Basic usage",
    description: "Runnable example for tooltip.",
    category: "components",
    filePath: "examples/components/tooltip/basic.tsx",
  }),
  "topic-card/basic": defineExample({
    id: "topic-card/basic",
    title: "Basic usage",
    description: "Runnable example for topic-card.",
    category: "components",
    filePath: "examples/components/topic-card/basic.tsx",
  }),
  "underline-tabs/basic": defineExample({
    id: "underline-tabs/basic",
    title: "Basic usage",
    description: "Runnable example for underline-tabs.",
    category: "components",
    filePath: "examples/components/underline-tabs/basic.tsx",
  }),
  "video-attachment/basic": defineExample({
    id: "video-attachment/basic",
    title: "Basic usage",
    description: "Runnable example for video-attachment.",
    category: "components",
    filePath: "examples/components/video-attachment/basic.tsx",
  }),
  "voice-message/basic": defineExample({
    id: "voice-message/basic",
    title: "Basic usage",
    description: "Runnable example for voice-message.",
    category: "components",
    filePath: "examples/components/voice-message/basic.tsx",
  }),
} satisfies Record<ExampleId, ExampleDefinition>;

export function getExample(id: ExampleId) {
  return examples[id];
}

export function getExamples(ids: readonly ExampleId[]) {
  return ids.map((id) => getExample(id));
}

function defineExample(definition: Omit<ExampleDefinition, "source">): ExampleDefinition {
  return {
    ...definition,
    description: normalizeExampleDescription(definition),
    source: readExampleSource(definition.filePath),
  };
}

function normalizeExampleDescription(definition: Omit<ExampleDefinition, "source">) {
  if (!definition.description?.startsWith("Runnable example for ")) {
    return definition.description;
  }

  const componentName = definition.id
    .split("/")[0]
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return `Shows ${componentName} in a realistic product UI composition.`;
}

function readExampleSource(filePath: ExampleDefinition["filePath"]) {
  const source = readFileSync(resolveExampleFile(filePath), "utf8");

  return source.trimEnd();
}

function resolveExampleFile(filePath: ExampleDefinition["filePath"]) {
  const cwd = process.cwd();
  const docsRoot = cwd.endsWith(`${path.sep}apps${path.sep}docs`)
    ? cwd
    : path.join(cwd, "apps", "docs");

  return path.join(docsRoot, filePath);
}
