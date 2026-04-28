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

const documentedDocsIds = new Set([
  "alert",
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
  "spinner",
  "skeleton",
]);
const provisionalPropsIds = documentedDocsIds;

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

    examples: ["accordion/basic"],
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

    examples: ["activity-bar/basic"],
  }),
  definePrimitive({
    id: "alert",
    name: "Alert",
    exports: ["Alert", "AlertDescription", "AlertTitle"],
    storybookSlug: "alert",
    examples: ["alert/basic"],
  }),
  definePrimitive({
    id: "avatar",
    name: "Avatar",
    exports: ["Avatar", "AvatarFallback", "AvatarImage"],
    storybookSlug: "avatar",

    examples: ["avatar/basic"],
  }),
  definePrimitive({
    id: "badge",
    name: "Badge",
    exports: ["Badge"],
    storybookSlug: "badge",
    examples: ["badge/basic"],
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

    examples: ["breadcrumb/basic"],
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
    examples: ["card/basic"],
  }),
  definePrimitive({
    id: "chat-message",
    name: "ChatMessage",
    status: "experimental",
    exports: ["ChatMessage", "ChatMessageReaction", "ChatSender", "Mention"],

    examples: ["chat-message/basic"],
  }),
  definePrimitive({
    id: "checkbox",
    name: "Checkbox",
    exports: ["Checkbox"],
    storybookSlug: "checkbox",
    examples: ["checkbox/basic"],
  }),
  definePrimitive({
    id: "collapsible",
    name: "Collapsible",
    exports: ["Collapsible", "CollapsibleContent", "CollapsibleTrigger"],
    storybookSlug: "collapsible",

    examples: ["collapsible/basic"],
  }),
  definePrimitive({
    id: "combobox",
    name: "Combobox",
    exports: ["Combobox", "ComboboxContent", "ComboboxInput", "ComboboxItem", "ComboboxTrigger"],
    storybookSlug: "combobox",

    examples: ["combobox/basic"],
  }),
  definePrimitive({
    id: "conversation-message",
    name: "ConversationMessage",
    status: "experimental",
    exports: ["ConversationMessage", "ConversationMessageStatusIcon"],
    storybookSlug: "conversationmessage",

    examples: ["conversation-message/basic"],
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

    examples: ["data-table/basic"],
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

    examples: ["detail-panel/basic"],
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
    examples: ["dialog/basic"],
  }),
  definePrimitive({
    id: "dropdown-menu",
    name: "DropdownMenu",
    exports: ["DropdownMenu", "DropdownMenuContent", "DropdownMenuItem", "DropdownMenuTrigger"],
    storybookSlug: "dropdownmenu",
    examples: ["dropdown-menu/basic"],
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

    examples: ["entity-card/basic"],
  }),
  definePrimitive({
    id: "event-notice",
    name: "EventNotice",
    status: "experimental",
    exports: ["EventNotice"],
    storybookSlug: "eventnotice",

    examples: ["event-notice/basic"],
  }),
  definePrimitive({
    id: "file-attachment",
    name: "FileAttachment",
    status: "experimental",
    exports: ["FileAttachment"],
    storybookSlug: "fileattachment",

    examples: ["file-attachment/basic"],
  }),
  definePrimitive({
    id: "image-attachment",
    name: "ImageAttachment",
    status: "experimental",
    exports: ["ImageAttachment"],
    storybookSlug: "imageattachment",

    examples: ["image-attachment/basic"],
  }),
  definePrimitive({
    id: "image-gallery",
    name: "ImageGallery",
    status: "experimental",
    exports: ["ImageGallery", "ImageGalleryItem"],
    storybookSlug: "imagegallery",

    examples: ["image-gallery/basic"],
  }),
  definePrimitive({
    id: "input",
    name: "Input",
    exports: ["Input"],
    storybookSlug: "input",
    examples: ["input/basic"],
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

    examples: ["interactive-row/basic"],
  }),
  definePrimitive({
    id: "label",
    name: "Label",
    exports: ["Label"],
    storybookSlug: "label",
    examples: ["label/basic"],
  }),
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

    examples: ["logo/basic"],
  }),
  definePrimitive({
    id: "nav-item",
    name: "NavItem",
    status: "experimental",
    exports: ["NavItem"],
    storybookSlug: "navitem",

    examples: ["nav-item/basic"],
  }),
  definePrimitive({
    id: "panel-footer",
    name: "PanelFooter",
    status: "experimental",
    exports: ["PanelFooter", "PanelFooterActions", "PanelFooterMeta"],
    storybookSlug: "panelfooter",

    examples: ["panel-footer/basic"],
  }),
  definePrimitive({
    id: "popover",
    name: "Popover",
    exports: ["Popover", "PopoverAnchor", "PopoverContent", "PopoverTrigger"],
    storybookSlug: "popover",
    examples: ["popover/basic"],
  }),
  definePrimitive({
    id: "pricing-card",
    name: "PricingCard",
    status: "experimental",
    exports: ["PricingCard"],
    storybookSlug: "pricingcard",

    examples: ["pricing-card/basic"],
  }),
  definePrimitive({
    id: "progress",
    name: "Progress",
    exports: ["Progress"],
    storybookSlug: "progress",

    examples: ["progress/basic"],
  }),
  definePrimitive({
    id: "prose",
    name: "Prose",
    exports: ["Prose"],
    storybookSlug: "prose",
    examples: ["prose/basic"],
  }),
  definePrimitive({
    id: "radio-group",
    name: "RadioGroup",
    exports: ["RadioGroup", "RadioGroupItem"],
    storybookSlug: "radiogroup",

    examples: ["radio-group/basic"],
  }),
  definePrimitive({
    id: "scroll-area",
    name: "ScrollArea",
    exports: ["ScrollArea", "ScrollBar"],
    storybookSlug: "scrollarea",

    examples: ["scroll-area/basic"],
  }),
  definePrimitive({
    id: "select",
    name: "Select",
    exports: ["Select", "SelectContent", "SelectItem", "SelectTrigger", "SelectValue"],
    storybookSlug: "select",
    examples: ["select/basic"],
  }),
  definePrimitive({
    id: "separator",
    name: "Separator",
    exports: ["Separator"],
    storybookSlug: "separator",

    examples: ["separator/basic"],
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

    examples: ["sheet/basic"],
  }),
  definePrimitive({
    id: "sidebar",
    name: "Sidebar",
    status: "experimental",
    exports: ["Sidebar", "SidebarContent", "SidebarFooter", "SidebarHeader"],
    storybookSlug: "sidebar",

    examples: ["sidebar/basic"],
  }),
  definePrimitive({
    id: "skeleton",
    name: "Skeleton",
    exports: ["Skeleton"],
    storybookSlug: "skeleton",
    examples: ["skeleton/basic"],
  }),
  definePrimitive({
    id: "sonner",
    name: "Toaster",
    exports: ["Toaster"],
    importNames: ["Toaster"],
    storybookSlug: "sonner",

    examples: ["sonner/basic"],
  }),
  definePrimitive({
    id: "spinner",
    name: "Spinner",
    exports: ["Spinner"],
    storybookSlug: "spinner",
    examples: ["spinner/basic"],
  }),
  definePrimitive({
    id: "split-view",
    name: "SplitView",
    status: "experimental",
    exports: ["ResizableHandle", "ResizablePanel", "SplitView"],

    examples: ["split-view/basic"],
  }),
  definePrimitive({
    id: "stat-card",
    name: "StatCard",
    status: "experimental",
    exports: ["StatCard"],
    storybookSlug: "statcard",

    examples: ["stat-card/basic"],
  }),
  definePrimitive({
    id: "stats-bar",
    name: "StatsBar",
    status: "experimental",
    exports: ["StatsBar", "StatsBarItem"],
    storybookSlug: "statsbar",

    examples: ["stats-bar/basic"],
  }),
  definePrimitive({
    id: "status-dot",
    name: "StatusDot",
    exports: ["StatusDot"],
    storybookSlug: "statusdot",

    examples: ["status-dot/basic"],
  }),
  definePrimitive({
    id: "stepper",
    name: "Stepper",
    status: "experimental",
    exports: ["Stepper", "StepperItem", "StepperSeparator"],
    storybookSlug: "stepper",
    coverage: { storybook: "missing" },

    examples: ["stepper/basic"],
  }),
  definePrimitive({
    id: "switch",
    name: "Switch",
    exports: ["Switch"],
    storybookSlug: "switch",
    examples: ["switch/basic"],
  }),
  definePrimitive({
    id: "table",
    name: "Table",
    exports: ["Table", "TableBody", "TableCell", "TableHead", "TableHeader", "TableRow"],
    storybookSlug: "table",

    examples: ["table/basic"],
  }),
  definePrimitive({
    id: "tabs",
    name: "Tabs",
    exports: ["Tabs", "TabsContent", "TabsList", "TabsTrigger"],
    storybookSlug: "tabs",
    examples: ["tabs/basic"],
  }),
  definePrimitive({
    id: "tag-group",
    name: "TagGroup",
    status: "experimental",
    exports: ["TagGroup", "TagGroupItem"],
    storybookSlug: "taggroup",

    examples: ["tag-group/basic"],
  }),
  definePrimitive({
    id: "text-link",
    name: "TextLink",
    exports: ["TextLink"],
    storybookSlug: "textlink",

    examples: ["text-link/basic"],
  }),
  definePrimitive({
    id: "textarea",
    name: "Textarea",
    exports: ["Textarea"],
    storybookSlug: "textarea",

    examples: ["textarea/basic"],
  }),
  definePrimitive({
    id: "theme-root",
    name: "ThemeRoot",
    exports: ["ThemeRoot"],
    storybookSlug: "themeroot",

    examples: ["theme-root/basic"],
  }),
  definePrimitive({
    id: "toggle",
    name: "Toggle",
    exports: ["Toggle", "ToggleGroup", "ToggleGroupItem"],
    storybookSlug: "toggle",

    examples: ["toggle/basic"],
  }),
  definePrimitive({
    id: "topic-card",
    name: "TopicCard",
    status: "experimental",
    exports: ["TopicAssignee", "TopicCard"],

    examples: ["topic-card/basic"],
  }),
  definePrimitive({
    id: "tooltip",
    name: "Tooltip",
    exports: ["Tooltip", "TooltipContent", "TooltipProvider", "TooltipTrigger"],
    storybookSlug: "tooltip",
    examples: ["tooltip/basic"],
  }),
  definePrimitive({
    id: "video-attachment",
    name: "VideoAttachment",
    status: "experimental",
    exports: ["VideoAttachment"],
    storybookSlug: "videoattachment",

    examples: ["video-attachment/basic"],
  }),
  definePrimitive({
    id: "voice-message",
    name: "VoiceMessage",
    status: "experimental",
    exports: ["VoiceMessage"],
    storybookSlug: "voicemessage",

    examples: ["voice-message/basic"],
  }),
  definePattern({
    id: "auth-shell",
    name: "AuthShell",
    status: "experimental",
    exports: ["AuthShell"],
    storybookSlug: "authshell",

    examples: ["auth-shell/basic"],
  }),
  definePattern({
    id: "brand-rail",
    name: "BrandRail",
    status: "experimental",
    exports: ["BrandRail"],

    examples: ["brand-rail/basic"],
  }),
  definePattern({
    id: "budget-popover",
    name: "BudgetPopover",
    status: "experimental",
    exports: ["BudgetPopover", "BudgetPopoverItem"],
    storybookSlug: "budgetpopover",

    examples: ["budget-popover/basic"],
  }),
  definePattern({
    id: "confirm-dialog",
    name: "ConfirmDialog",
    exports: ["ConfirmDialog"],
    storybookSlug: "confirmdialog",

    examples: ["confirm-dialog/basic"],
  }),
  definePattern({
    id: "credits-capsule",
    name: "CreditsCapsule",
    status: "experimental",
    exports: ["CreditsCapsule"],
    storybookSlug: "creditscapsule",

    examples: ["credits-capsule/basic"],
  }),
  definePattern({
    id: "empty-state",
    name: "EmptyState",
    exports: ["EmptyState"],
    storybookSlug: "emptystate",

    examples: ["empty-state/basic"],
  }),
  definePattern({
    id: "filter-pills",
    name: "FilterPills",
    exports: ["FilterPillTrigger", "FilterPills", "FilterPillsContent", "FilterPillsList"],
    storybookSlug: "filterpills",

    examples: ["filter-pills/basic"],
  }),
  definePattern({
    id: "follow-up-input",
    name: "FollowUpInput",
    status: "experimental",
    exports: ["FollowUpInput"],

    examples: ["follow-up-input/basic"],
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

    examples: ["form-field/basic"],
  }),
  definePattern({
    id: "page-header",
    name: "PageHeader",
    exports: ["PageHeader"],
    storybookSlug: "pageheader",

    examples: ["page-header/basic"],
  }),
  definePattern({
    id: "page-shell",
    name: "PageShell",
    status: "experimental",
    exports: ["PageShell"],
    storybookSlug: "pageshell",

    examples: ["page-shell/basic"],
  }),
  definePattern({
    id: "section-header",
    name: "SectionHeader",
    exports: ["SectionHeader"],
    storybookSlug: "sectionheader",

    examples: ["section-header/basic"],
  }),
  definePattern({
    id: "skill-marketplace-card",
    name: "SkillMarketplaceCard",
    status: "experimental",
    exports: ["SkillMarketplaceCard"],
    storybookSlug: "skillmarketplacecard",

    examples: ["skill-marketplace-card/basic"],
  }),
  definePattern({
    id: "underline-tabs",
    name: "UnderlineTabs",
    exports: ["UnderlineTabs", "UnderlineTabsContent", "UnderlineTabsList", "UnderlineTabsTrigger"],
    storybookSlug: "underlinetabs",

    examples: ["underline-tabs/basic"],
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
  if ((input.kind === "primitive" || input.kind === "pattern") && input.docsSlug) return "complete";
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
