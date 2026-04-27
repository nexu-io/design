export type PublicApiKind = "primitive" | "pattern" | "utility";
export type PublicApiPackage = "@nexu-design/ui-web" | "@nexu-design/tokens";
export type PublicApiStatus = "stable" | "experimental" | "internal";
export type PublicApiCoverageFlag = "complete" | "planned" | "missing" | "not-applicable";

export interface PublicApiCoverageFlags {
  docs: PublicApiCoverageFlag;
  storybook: PublicApiCoverageFlag;
  examples: PublicApiCoverageFlag;
  props: PublicApiCoverageFlag;
}

export interface PublicApiInventoryItem {
  id: string;
  name: string;
  kind: PublicApiKind;
  status: PublicApiStatus;
  packageName: PublicApiPackage;
  sourcePath: string;
  exports: string[];
  importSnippet?: string;
  docsSlug?: string;
  storybookId?: string;
  storybookPath?: string;
  storybookTitle?: string;
  examples: string[];
  documentable: boolean;
  coverage: PublicApiCoverageFlags;
}

interface PublicApiInventoryInput {
  id: string;
  name: string;
  kind: PublicApiKind;
  status?: PublicApiStatus;
  packageName?: PublicApiPackage;
  sourcePath: string;
  exports: string[];
  importNames?: string[];
  importSnippet?: string;
  docsSlug?: string;
  storybook?: {
    id: string;
    title: string;
  };
  examples?: string[];
  documentable?: boolean;
  coverage?: Partial<PublicApiCoverageFlags>;
}

const uiWebPackage = "@nexu-design/ui-web" satisfies PublicApiPackage;

const documentedDocsIds = new Set(["button"]);
const provisionalPropsIds = new Set(["button"]);

const mvpComponentDocsIds = new Set([
  "button",
  "input",
  "card",
  "badge",
  "checkbox",
  "switch",
  "select",
  "dialog",
  "tabs",
  "tooltip",
  "popover",
  "dropdown-menu",
  "alert",
  "spinner",
  "skeleton",
]);

const plannedPatternDocsIds = new Set(["form-field"]);

export const publicApiInventory = [
  defineUtility({
    id: "cn",
    name: "cn",
    sourcePath: "packages/ui-web/src/lib/cn.ts",
    exports: ["cn"],
    importNames: ["cn"],
    docsSlug: "/reference/components",
  }),
  defineUtility({
    id: "mono-digits",
    name: "MonoDigits",
    sourcePath: "packages/ui-web/src/lib/mono-digits.tsx",
    exports: ["MonoDigits"],
    importNames: ["MonoDigits"],
    docsSlug: "/reference/components",
  }),
  definePrimitive({
    id: "accordion",
    name: "Accordion",
    exports: ["Accordion", "AccordionContent", "AccordionItem", "AccordionTrigger"],
    storybookSlug: "accordion",
  }),
  definePrimitive({
    id: "activity-bar",
    name: "ActivityBar",
    status: "experimental",
    exports: [
      "ActivityBar",
      "ActivityBarContent",
      "ActivityBarFooter",
      "ActivityBarHeader",
      "ActivityBarIndicator",
      "ActivityBarItem",
    ],
    storybookSlug: "activitybar",
    storybookSection: "Reserved",
    storybookIdPrefix: "reserved",
  }),
  definePrimitive({
    id: "alert",
    name: "Alert",
    exports: ["Alert", "AlertDescription", "AlertTitle"],
    storybookSlug: "alert",
  }),
  definePrimitive({
    id: "avatar",
    name: "Avatar",
    exports: ["Avatar", "AvatarFallback", "AvatarImage"],
    storybookSlug: "avatar",
  }),
  definePrimitive({
    id: "badge",
    name: "Badge",
    exports: ["Badge"],
    storybookSlug: "badge",
  }),
  definePrimitive({
    id: "breadcrumb",
    name: "Breadcrumb",
    exports: [
      "Breadcrumb",
      "BreadcrumbItem",
      "BreadcrumbLink",
      "BreadcrumbList",
      "BreadcrumbPage",
      "BreadcrumbSeparator",
    ],
    storybookSlug: "breadcrumb",
  }),
  definePrimitive({
    id: "button",
    name: "Button",
    exports: ["Button"],
    storybookSlug: "button",
    examples: ["button/basic", "button/variants", "button/loading"],
  }),
  definePrimitive({
    id: "card",
    name: "Card",
    exports: ["Card", "CardContent", "CardDescription", "CardFooter", "CardHeader", "CardTitle"],
    storybookSlug: "card",
  }),
  definePrimitive({
    id: "chat-message",
    name: "ChatMessage",
    status: "experimental",
    exports: ["ChatMessage", "ChatMessageReaction", "ChatSender", "Mention"],
  }),
  definePrimitive({
    id: "checkbox",
    name: "Checkbox",
    exports: ["Checkbox"],
    storybookSlug: "checkbox",
  }),
  definePrimitive({
    id: "collapsible",
    name: "Collapsible",
    exports: ["Collapsible", "CollapsibleContent", "CollapsibleTrigger"],
    storybookSlug: "collapsible",
  }),
  definePrimitive({
    id: "combobox",
    name: "Combobox",
    exports: ["Combobox", "ComboboxContent", "ComboboxInput", "ComboboxItem", "ComboboxTrigger"],
    storybookSlug: "combobox",
  }),
  definePrimitive({
    id: "conversation-message",
    name: "ConversationMessage",
    status: "experimental",
    exports: ["ConversationMessage", "ConversationMessageStatusIcon"],
    storybookSlug: "conversationmessage",
  }),
  definePrimitive({
    id: "data-table",
    name: "DataTable",
    status: "experimental",
    exports: [
      "DataTable",
      "DataTableDescription",
      "DataTableEmpty",
      "DataTableFooter",
      "DataTableHeader",
      "DataTableTitle",
      "DataTableToolbar",
    ],
    storybookSlug: "datatable",
  }),
  definePrimitive({
    id: "detail-panel",
    name: "DetailPanel",
    status: "experimental",
    exports: [
      "DetailPanel",
      "DetailPanelCloseButton",
      "DetailPanelContent",
      "DetailPanelDescription",
      "DetailPanelHeader",
      "DetailPanelTitle",
    ],
    storybookSlug: "detailpanel",
  }),
  definePrimitive({
    id: "dialog",
    name: "Dialog",
    exports: [
      "Dialog",
      "DialogBody",
      "DialogClose",
      "DialogContent",
      "DialogDescription",
      "DialogFooter",
      "DialogHeader",
      "DialogTitle",
      "DialogTrigger",
    ],
    storybookSlug: "dialog",
  }),
  definePrimitive({
    id: "dropdown-menu",
    name: "DropdownMenu",
    exports: ["DropdownMenu", "DropdownMenuContent", "DropdownMenuItem", "DropdownMenuTrigger"],
    storybookSlug: "dropdownmenu",
  }),
  definePrimitive({
    id: "entity-card",
    name: "EntityCard",
    status: "experimental",
    exports: [
      "EntityCard",
      "EntityCardContent",
      "EntityCardDescription",
      "EntityCardFooter",
      "EntityCardHeader",
      "EntityCardMedia",
      "EntityCardMeta",
      "EntityCardTitle",
    ],
    storybookSlug: "entitycard",
  }),
  definePrimitive({
    id: "event-notice",
    name: "EventNotice",
    status: "experimental",
    exports: ["EventNotice"],
    storybookSlug: "eventnotice",
  }),
  definePrimitive({
    id: "file-attachment",
    name: "FileAttachment",
    status: "experimental",
    exports: ["FileAttachment"],
    storybookSlug: "fileattachment",
  }),
  definePrimitive({
    id: "image-attachment",
    name: "ImageAttachment",
    status: "experimental",
    exports: ["ImageAttachment"],
    storybookSlug: "imageattachment",
  }),
  definePrimitive({
    id: "image-gallery",
    name: "ImageGallery",
    status: "experimental",
    exports: ["ImageGallery", "ImageGalleryItem"],
    storybookSlug: "imagegallery",
  }),
  definePrimitive({
    id: "input",
    name: "Input",
    exports: ["Input"],
    storybookSlug: "input",
  }),
  definePrimitive({
    id: "interactive-row",
    name: "InteractiveRow",
    status: "experimental",
    exports: [
      "InteractiveRow",
      "InteractiveRowContent",
      "InteractiveRowLeading",
      "InteractiveRowTrailing",
    ],
    storybookSlug: "interactiverow",
  }),
  definePrimitive({ id: "label", name: "Label", exports: ["Label"], storybookSlug: "label" }),
  definePrimitive({
    id: "logo",
    name: "Logo",
    status: "experimental",
    exports: [
      "BrandLogo",
      "BrandName",
      "ModelLogo",
      "ModelName",
      "PlatformLogo",
      "PlatformName",
      "ProviderLogo",
      "ProviderName",
      "RuntimeLogo",
      "RuntimeName",
    ],
    importNames: ["BrandLogo", "ProviderLogo", "ModelLogo"],
  }),
  definePrimitive({
    id: "nav-item",
    name: "NavItem",
    status: "experimental",
    exports: ["NavItem"],
    storybookSlug: "navitem",
  }),
  definePrimitive({
    id: "panel-footer",
    name: "PanelFooter",
    status: "experimental",
    exports: ["PanelFooter", "PanelFooterActions", "PanelFooterMeta"],
    storybookSlug: "panelfooter",
  }),
  definePrimitive({
    id: "popover",
    name: "Popover",
    exports: ["Popover", "PopoverAnchor", "PopoverContent", "PopoverTrigger"],
    storybookSlug: "popover",
  }),
  definePrimitive({
    id: "pricing-card",
    name: "PricingCard",
    status: "experimental",
    exports: ["PricingCard"],
    storybookSlug: "pricingcard",
  }),
  definePrimitive({
    id: "progress",
    name: "Progress",
    exports: ["Progress"],
    storybookSlug: "progress",
  }),
  definePrimitive({ id: "prose", name: "Prose", exports: ["Prose"], storybookSlug: "prose" }),
  definePrimitive({
    id: "radio-group",
    name: "RadioGroup",
    exports: ["RadioGroup", "RadioGroupItem"],
    storybookSlug: "radiogroup",
  }),
  definePrimitive({
    id: "scroll-area",
    name: "ScrollArea",
    exports: ["ScrollArea", "ScrollBar"],
    storybookSlug: "scrollarea",
  }),
  definePrimitive({
    id: "select",
    name: "Select",
    exports: ["Select", "SelectContent", "SelectItem", "SelectTrigger", "SelectValue"],
    storybookSlug: "select",
  }),
  definePrimitive({
    id: "separator",
    name: "Separator",
    exports: ["Separator"],
    storybookSlug: "separator",
  }),
  definePrimitive({
    id: "sheet",
    name: "Sheet",
    exports: [
      "Sheet",
      "SheetClose",
      "SheetContent",
      "SheetDescription",
      "SheetTitle",
      "SheetTrigger",
    ],
    storybookSlug: "sheet",
  }),
  definePrimitive({
    id: "sidebar",
    name: "Sidebar",
    status: "experimental",
    exports: ["Sidebar", "SidebarContent", "SidebarFooter", "SidebarHeader"],
    storybookSlug: "sidebar",
  }),
  definePrimitive({
    id: "skeleton",
    name: "Skeleton",
    exports: ["Skeleton"],
    storybookSlug: "skeleton",
  }),
  definePrimitive({
    id: "sonner",
    name: "Toaster",
    exports: ["Toaster"],
    importNames: ["Toaster"],
    storybookSlug: "sonner",
  }),
  definePrimitive({
    id: "spinner",
    name: "Spinner",
    exports: ["Spinner"],
    storybookSlug: "spinner",
  }),
  definePrimitive({
    id: "split-view",
    name: "SplitView",
    status: "experimental",
    exports: ["ResizableHandle", "ResizablePanel", "SplitView"],
    storybookSlug: "splitview",
  }),
  definePrimitive({
    id: "stat-card",
    name: "StatCard",
    status: "experimental",
    exports: ["StatCard"],
    storybookSlug: "statcard",
  }),
  definePrimitive({
    id: "stats-bar",
    name: "StatsBar",
    status: "experimental",
    exports: ["StatsBar", "StatsBarItem"],
    storybookSlug: "statsbar",
  }),
  definePrimitive({
    id: "status-dot",
    name: "StatusDot",
    exports: ["StatusDot"],
    storybookSlug: "statusdot",
  }),
  definePrimitive({
    id: "stepper",
    name: "Stepper",
    status: "experimental",
    exports: ["Stepper", "StepperItem", "StepperSeparator"],
    storybookSlug: "stepper",
    coverage: { storybook: "missing" },
  }),
  definePrimitive({ id: "switch", name: "Switch", exports: ["Switch"], storybookSlug: "switch" }),
  definePrimitive({
    id: "table",
    name: "Table",
    exports: ["Table", "TableBody", "TableCell", "TableHead", "TableHeader", "TableRow"],
    storybookSlug: "table",
  }),
  definePrimitive({
    id: "tabs",
    name: "Tabs",
    exports: ["Tabs", "TabsContent", "TabsList", "TabsTrigger"],
    storybookSlug: "tabs",
  }),
  definePrimitive({
    id: "tag-group",
    name: "TagGroup",
    status: "experimental",
    exports: ["TagGroup", "TagGroupItem"],
    storybookSlug: "taggroup",
  }),
  definePrimitive({
    id: "text-link",
    name: "TextLink",
    exports: ["TextLink"],
    storybookSlug: "textlink",
  }),
  definePrimitive({
    id: "textarea",
    name: "Textarea",
    exports: ["Textarea"],
    storybookSlug: "textarea",
  }),
  definePrimitive({
    id: "theme-root",
    name: "ThemeRoot",
    exports: ["ThemeRoot"],
    storybookSlug: "themeroot",
  }),
  definePrimitive({
    id: "toggle",
    name: "Toggle",
    exports: ["Toggle", "ToggleGroup", "ToggleGroupItem"],
    storybookSlug: "toggle",
  }),
  definePrimitive({
    id: "topic-card",
    name: "TopicCard",
    status: "experimental",
    exports: ["TopicAssignee", "TopicCard"],
  }),
  definePrimitive({
    id: "tooltip",
    name: "Tooltip",
    exports: ["Tooltip", "TooltipContent", "TooltipProvider", "TooltipTrigger"],
    storybookSlug: "tooltip",
  }),
  definePrimitive({
    id: "video-attachment",
    name: "VideoAttachment",
    status: "experimental",
    exports: ["VideoAttachment"],
    storybookSlug: "videoattachment",
  }),
  definePrimitive({
    id: "voice-message",
    name: "VoiceMessage",
    status: "experimental",
    exports: ["VoiceMessage"],
    storybookSlug: "voicemessage",
  }),
  definePattern({
    id: "auth-shell",
    name: "AuthShell",
    status: "experimental",
    exports: ["AuthShell"],
    storybookSlug: "authshell",
  }),
  definePattern({
    id: "brand-rail",
    name: "BrandRail",
    status: "experimental",
    exports: ["BrandRail"],
  }),
  definePattern({
    id: "budget-popover",
    name: "BudgetPopover",
    status: "experimental",
    exports: ["BudgetPopover", "BudgetPopoverItem"],
    storybookSlug: "budgetpopover",
  }),
  definePattern({
    id: "confirm-dialog",
    name: "ConfirmDialog",
    exports: ["ConfirmDialog"],
    storybookSlug: "confirmdialog",
  }),
  definePattern({
    id: "credits-capsule",
    name: "CreditsCapsule",
    status: "experimental",
    exports: ["CreditsCapsule"],
    storybookSlug: "creditscapsule",
  }),
  definePattern({
    id: "empty-state",
    name: "EmptyState",
    exports: ["EmptyState"],
    storybookSlug: "emptystate",
  }),
  definePattern({
    id: "filter-pills",
    name: "FilterPills",
    exports: ["FilterPillTrigger", "FilterPills", "FilterPillsContent", "FilterPillsList"],
    storybookSlug: "filterpills",
  }),
  definePattern({
    id: "follow-up-input",
    name: "FollowUpInput",
    status: "experimental",
    exports: ["FollowUpInput"],
  }),
  definePattern({
    id: "form-field",
    name: "FormField",
    exports: [
      "FormField",
      "FormFieldControl",
      "FormFieldDescription",
      "FormFieldError",
      "FormFieldLabel",
    ],
    docsSlug: "/patterns/forms",
    storybookSlug: "formfield",
  }),
  definePattern({
    id: "page-header",
    name: "PageHeader",
    exports: ["PageHeader"],
    storybookSlug: "pageheader",
  }),
  definePattern({
    id: "page-shell",
    name: "PageShell",
    status: "experimental",
    exports: ["PageShell"],
    storybookSlug: "pageshell",
  }),
  definePattern({
    id: "section-header",
    name: "SectionHeader",
    exports: ["SectionHeader"],
    storybookSlug: "sectionheader",
  }),
  definePattern({
    id: "skill-marketplace-card",
    name: "SkillMarketplaceCard",
    status: "experimental",
    exports: ["SkillMarketplaceCard"],
    storybookSlug: "skillmarketplacecard",
  }),
  definePattern({
    id: "underline-tabs",
    name: "UnderlineTabs",
    exports: ["UnderlineTabs", "UnderlineTabsContent", "UnderlineTabsList", "UnderlineTabsTrigger"],
    storybookSlug: "underlinetabs",
  }),
] satisfies PublicApiInventoryItem[];

export const publicComponentInventory = publicApiInventory.filter(
  (item) => item.kind === "primitive" || item.kind === "pattern",
);

export function getPublicApiInventoryItem(id: string) {
  return publicApiInventory.find((item) => item.id === id);
}

interface PublicPrimitiveInput
  extends Omit<PublicApiInventoryInput, "kind" | "packageName" | "sourcePath" | "storybook"> {
  storybookSlug?: string;
  storybookSection?: string;
  storybookIdPrefix?: string;
}

function definePrimitive(input: PublicPrimitiveInput): PublicApiInventoryItem {
  const storybook = input.storybookSlug
    ? makeStorybookLink({
        idPrefix: input.storybookIdPrefix ?? "primitives",
        section: input.storybookSection ?? "Primitives",
        slug: input.storybookSlug,
        name: input.name,
      })
    : undefined;

  return defineItem({
    ...input,
    kind: "primitive",
    sourcePath: `packages/ui-web/src/primitives/${input.id}.tsx`,
    docsSlug: input.docsSlug ?? `/components/${input.id}`,
    storybook,
  });
}

interface PublicPatternInput
  extends Omit<PublicApiInventoryInput, "kind" | "packageName" | "sourcePath" | "storybook"> {
  storybookSlug?: string;
}

function definePattern(input: PublicPatternInput): PublicApiInventoryItem {
  return defineItem({
    ...input,
    kind: "pattern",
    sourcePath: `packages/ui-web/src/patterns/${input.id}.tsx`,
    docsSlug: input.docsSlug ?? `/patterns/${input.id}`,
    storybook: input.storybookSlug
      ? makeStorybookLink({
          idPrefix: "patterns",
          section: "Patterns",
          slug: input.storybookSlug,
          name: input.name,
        })
      : undefined,
  });
}

function defineUtility(input: Omit<PublicApiInventoryInput, "kind">): PublicApiInventoryItem {
  return defineItem({
    documentable: false,
    ...input,
    kind: "utility",
    coverage: {
      docs: input.docsSlug ? "planned" : "not-applicable",
      storybook: "not-applicable",
      examples: "not-applicable",
      props: "not-applicable",
      ...input.coverage,
    },
  });
}

function defineItem(input: PublicApiInventoryInput): PublicApiInventoryItem {
  const packageName = input.packageName ?? uiWebPackage;
  const examples = input.examples ?? [];
  const documentable = input.documentable ?? input.kind !== "utility";
  const importNames = input.importNames ?? [input.exports[0]].filter(Boolean);
  const importSnippet = input.importSnippet ?? makeImportSnippet(packageName, importNames);
  const coverage = resolveCoverage(input, { documentable, examples });

  return {
    id: input.id,
    name: input.name,
    kind: input.kind,
    status: input.status ?? "stable",
    packageName,
    sourcePath: input.sourcePath,
    exports: input.exports,
    importSnippet,
    docsSlug: input.docsSlug,
    storybookId: input.storybook?.id,
    storybookPath: input.storybook ? `/?path=/docs/${input.storybook.id}` : undefined,
    storybookTitle: input.storybook?.title,
    examples,
    documentable,
    coverage,
  };
}

function resolveCoverage(
  input: PublicApiInventoryInput,
  context: { documentable: boolean; examples: string[] },
): PublicApiCoverageFlags {
  const docs = getDocsCoverage(input);
  const storybook = input.storybook ? "complete" : "missing";
  const examples = context.examples.length > 0 ? "complete" : "planned";
  const props = provisionalPropsIds.has(input.id) ? "complete" : "planned";

  if (!context.documentable) {
    return {
      docs: "not-applicable",
      storybook: "not-applicable",
      examples: "not-applicable",
      props: "not-applicable",
      ...input.coverage,
    };
  }

  return {
    docs,
    storybook,
    examples,
    props,
    ...input.coverage,
  };
}

function getDocsCoverage(input: PublicApiInventoryInput): PublicApiCoverageFlag {
  if (documentedDocsIds.has(input.id)) return "complete";
  if (mvpComponentDocsIds.has(input.id) || plannedPatternDocsIds.has(input.id)) return "planned";
  return input.docsSlug ? "missing" : "not-applicable";
}

function makeStorybookLink({
  idPrefix,
  section,
  slug,
  name,
}: {
  idPrefix: string;
  section: string;
  slug: string;
  name: string;
}) {
  return {
    id: `${idPrefix}-${slug}--docs`,
    title: `${section}/${name}`,
  };
}

function makeImportSnippet(packageName: PublicApiPackage, importNames: string[]) {
  return `import { ${importNames.join(", ")} } from '${packageName}'`;
}
