"use client";

import type { ComponentType } from "react";

import { AccordionBasicExample } from "../examples/components/accordion/basic";
import { ActivityBarBasicExample } from "../examples/components/activity-bar/basic";
import { AlertBasicExample } from "../examples/components/alert/basic";
import { AuthShellBasicExample } from "../examples/components/auth-shell/basic";
import { AvatarBasicExample } from "../examples/components/avatar/basic";
import { BadgeBasicExample } from "../examples/components/badge/basic";
import { BrandRailBasicExample } from "../examples/components/brand-rail/basic";
import { BreadcrumbBasicExample } from "../examples/components/breadcrumb/basic";
import { BudgetPopoverBasicExample } from "../examples/components/budget-popover/basic";
import { ButtonBasicExample } from "../examples/components/button/basic";
import { ButtonLoadingExample } from "../examples/components/button/loading";
import { ButtonVariantsExample } from "../examples/components/button/variants";
import { CardBasicExample } from "../examples/components/card/basic";
import { ChatMessageBasicExample } from "../examples/components/chat-message/basic";
import { CheckboxBasicExample } from "../examples/components/checkbox/basic";
import { CollapsibleBasicExample } from "../examples/components/collapsible/basic";
import { ComboboxBasicExample } from "../examples/components/combobox/basic";
import { ConfirmDialogBasicExample } from "../examples/components/confirm-dialog/basic";
import { ConversationMessageBasicExample } from "../examples/components/conversation-message/basic";
import { CreditsCapsuleBasicExample } from "../examples/components/credits-capsule/basic";
import { DataTableBasicExample } from "../examples/components/data-table/basic";
import { DetailPanelBasicExample } from "../examples/components/detail-panel/basic";
import { DialogBasicExample } from "../examples/components/dialog/basic";
import { DropdownMenuBasicExample } from "../examples/components/dropdown-menu/basic";
import { EmptyStateBasicExample } from "../examples/components/empty-state/basic";
import { EntityCardBasicExample } from "../examples/components/entity-card/basic";
import { EventNoticeBasicExample } from "../examples/components/event-notice/basic";
import { FileAttachmentBasicExample } from "../examples/components/file-attachment/basic";
import { FilterPillsBasicExample } from "../examples/components/filter-pills/basic";
import { FollowUpInputBasicExample } from "../examples/components/follow-up-input/basic";
import { FormFieldBasicExample } from "../examples/components/form-field/basic";
import { ImageAttachmentBasicExample } from "../examples/components/image-attachment/basic";
import { ImageGalleryBasicExample } from "../examples/components/image-gallery/basic";
import { InputBasicExample } from "../examples/components/input/basic";
import { InteractiveRowBasicExample } from "../examples/components/interactive-row/basic";
import { LabelBasicExample } from "../examples/components/label/basic";
import { LogoBasicExample } from "../examples/components/logo/basic";
import { NavItemBasicExample } from "../examples/components/nav-item/basic";
import { PageHeaderBasicExample } from "../examples/components/page-header/basic";
import { PageShellBasicExample } from "../examples/components/page-shell/basic";
import { PanelFooterBasicExample } from "../examples/components/panel-footer/basic";
import { PopoverBasicExample } from "../examples/components/popover/basic";
import { PricingCardBasicExample } from "../examples/components/pricing-card/basic";
import { ProgressBasicExample } from "../examples/components/progress/basic";
import { ProseBasicExample } from "../examples/components/prose/basic";
import { RadioGroupBasicExample } from "../examples/components/radio-group/basic";
import { ScrollAreaBasicExample } from "../examples/components/scroll-area/basic";
import { SectionHeaderBasicExample } from "../examples/components/section-header/basic";
import { SelectBasicExample } from "../examples/components/select/basic";
import { SeparatorBasicExample } from "../examples/components/separator/basic";
import { SheetBasicExample } from "../examples/components/sheet/basic";
import { SidebarBasicExample } from "../examples/components/sidebar/basic";
import { SkeletonBasicExample } from "../examples/components/skeleton/basic";
import { SkillMarketplaceCardBasicExample } from "../examples/components/skill-marketplace-card/basic";
import { SonnerBasicExample } from "../examples/components/sonner/basic";
import { SpinnerBasicExample } from "../examples/components/spinner/basic";
import { SplitViewBasicExample } from "../examples/components/split-view/basic";
import { StatCardBasicExample } from "../examples/components/stat-card/basic";
import { StatsBarBasicExample } from "../examples/components/stats-bar/basic";
import { StatusDotBasicExample } from "../examples/components/status-dot/basic";
import { StepperBasicExample } from "../examples/components/stepper/basic";
import { SwitchBasicExample } from "../examples/components/switch/basic";
import { TableBasicExample } from "../examples/components/table/basic";
import { TabsBasicExample } from "../examples/components/tabs/basic";
import { TagGroupBasicExample } from "../examples/components/tag-group/basic";
import { TextLinkBasicExample } from "../examples/components/text-link/basic";
import { TextareaBasicExample } from "../examples/components/textarea/basic";
import { ThemeRootBasicExample } from "../examples/components/theme-root/basic";
import { ToggleBasicExample } from "../examples/components/toggle/basic";
import { TooltipBasicExample } from "../examples/components/tooltip/basic";
import { TopicCardBasicExample } from "../examples/components/topic-card/basic";
import { UnderlineTabsBasicExample } from "../examples/components/underline-tabs/basic";
import { VideoAttachmentBasicExample } from "../examples/components/video-attachment/basic";
import { VoiceMessageBasicExample } from "../examples/components/voice-message/basic";
import type { ExampleId } from "./examples";

const exampleComponents = {
  "accordion/basic": AccordionBasicExample,
  "activity-bar/basic": ActivityBarBasicExample,
  "alert/basic": AlertBasicExample,
  "auth-shell/basic": AuthShellBasicExample,
  "avatar/basic": AvatarBasicExample,
  "badge/basic": BadgeBasicExample,
  "brand-rail/basic": BrandRailBasicExample,
  "breadcrumb/basic": BreadcrumbBasicExample,
  "budget-popover/basic": BudgetPopoverBasicExample,
  "button/basic": ButtonBasicExample,
  "button/loading": ButtonLoadingExample,
  "button/variants": ButtonVariantsExample,
  "card/basic": CardBasicExample,
  "chat-message/basic": ChatMessageBasicExample,
  "checkbox/basic": CheckboxBasicExample,
  "collapsible/basic": CollapsibleBasicExample,
  "combobox/basic": ComboboxBasicExample,
  "confirm-dialog/basic": ConfirmDialogBasicExample,
  "conversation-message/basic": ConversationMessageBasicExample,
  "credits-capsule/basic": CreditsCapsuleBasicExample,
  "data-table/basic": DataTableBasicExample,
  "detail-panel/basic": DetailPanelBasicExample,
  "dialog/basic": DialogBasicExample,
  "dropdown-menu/basic": DropdownMenuBasicExample,
  "empty-state/basic": EmptyStateBasicExample,
  "entity-card/basic": EntityCardBasicExample,
  "event-notice/basic": EventNoticeBasicExample,
  "file-attachment/basic": FileAttachmentBasicExample,
  "filter-pills/basic": FilterPillsBasicExample,
  "follow-up-input/basic": FollowUpInputBasicExample,
  "form-field/basic": FormFieldBasicExample,
  "image-attachment/basic": ImageAttachmentBasicExample,
  "image-gallery/basic": ImageGalleryBasicExample,
  "input/basic": InputBasicExample,
  "interactive-row/basic": InteractiveRowBasicExample,
  "label/basic": LabelBasicExample,
  "logo/basic": LogoBasicExample,
  "nav-item/basic": NavItemBasicExample,
  "page-header/basic": PageHeaderBasicExample,
  "page-shell/basic": PageShellBasicExample,
  "panel-footer/basic": PanelFooterBasicExample,
  "popover/basic": PopoverBasicExample,
  "pricing-card/basic": PricingCardBasicExample,
  "progress/basic": ProgressBasicExample,
  "prose/basic": ProseBasicExample,
  "radio-group/basic": RadioGroupBasicExample,
  "scroll-area/basic": ScrollAreaBasicExample,
  "section-header/basic": SectionHeaderBasicExample,
  "select/basic": SelectBasicExample,
  "separator/basic": SeparatorBasicExample,
  "sheet/basic": SheetBasicExample,
  "sidebar/basic": SidebarBasicExample,
  "skeleton/basic": SkeletonBasicExample,
  "skill-marketplace-card/basic": SkillMarketplaceCardBasicExample,
  "sonner/basic": SonnerBasicExample,
  "spinner/basic": SpinnerBasicExample,
  "split-view/basic": SplitViewBasicExample,
  "stat-card/basic": StatCardBasicExample,
  "stats-bar/basic": StatsBarBasicExample,
  "status-dot/basic": StatusDotBasicExample,
  "stepper/basic": StepperBasicExample,
  "switch/basic": SwitchBasicExample,
  "table/basic": TableBasicExample,
  "tabs/basic": TabsBasicExample,
  "tag-group/basic": TagGroupBasicExample,
  "text-link/basic": TextLinkBasicExample,
  "textarea/basic": TextareaBasicExample,
  "theme-root/basic": ThemeRootBasicExample,
  "toggle/basic": ToggleBasicExample,
  "tooltip/basic": TooltipBasicExample,
  "topic-card/basic": TopicCardBasicExample,
  "underline-tabs/basic": UnderlineTabsBasicExample,
  "video-attachment/basic": VideoAttachmentBasicExample,
  "voice-message/basic": VoiceMessageBasicExample,
} satisfies Record<ExampleId, ComponentType>;

export function ExampleRenderer({ id }: { id: ExampleId }) {
  const Example = exampleComponents[id];

  return <Example />;
}
