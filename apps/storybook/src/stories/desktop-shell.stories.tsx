import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, CreditCard, LayoutGrid, MessageSquare, Search, Settings } from "lucide-react";

import {
  ActivityBar,
  ActivityBarContent,
  ActivityBarFooter,
  ActivityBarHeader,
  ActivityBarIndicator,
  ActivityBarItem,
  Badge,
  Button,
  DetailPanel,
  DetailPanelCloseButton,
  DetailPanelContent,
  DetailPanelDescription,
  DetailPanelHeader,
  DetailPanelTitle,
  NavigationMenu,
  NavigationMenuButton,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuList,
  ResizableHandle,
  ResizablePanel,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SplitView,
} from "@nexu/ui-web";

const meta = {
  title: "Scenarios/Desktop Shell",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const WorkspaceSplitView: Story = {
  render: () => (
    <div className="h-[360px] w-[960px] overflow-hidden rounded-xl border border-border">
      <SplitView className="h-full bg-surface-2">
        <ResizablePanel size={240} className="border-r border-border bg-surface-1 p-4">
          <div className="text-sm font-medium text-text-primary">Navigation</div>
        </ResizablePanel>
        <ResizableHandle className="w-px bg-border" />
        <ResizablePanel className="min-w-0 p-4">
          <div className="h-full rounded-lg border border-dashed border-border p-4 text-sm text-text-muted">
            Main workspace content
          </div>
        </ResizablePanel>
        <ResizableHandle className="w-px bg-border" />
        <ResizablePanel size={320} className="border-l border-border bg-surface-1 p-4">
          <div className="text-sm font-medium text-text-primary">Details</div>
        </ResizablePanel>
      </SplitView>
    </div>
  ),
};

export const WorkspaceSidebar: Story = {
  render: () => (
    <div className="h-[420px] w-[280px] overflow-hidden rounded-xl border border-border">
      <Sidebar className="h-full">
        <SidebarHeader className="border-b border-border px-4 py-4">
          <div className="text-sm font-semibold text-text-primary">Nexu workspace</div>
          <div className="text-xs text-text-muted">Revenue operations</div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-3">
          <NavigationMenu>
            <NavigationMenuLabel>Main</NavigationMenuLabel>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuButton active>
                  <LayoutGrid className="size-4" />
                  Dashboard
                </NavigationMenuButton>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuButton>
                  <MessageSquare className="size-4" />
                  Channels
                </NavigationMenuButton>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuButton>
                  <Bell className="size-4" />
                  Approvals
                </NavigationMenuButton>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuLabel className="mt-4">Workspace</NavigationMenuLabel>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuButton>
                  <Search className="size-4" />
                  Search
                </NavigationMenuButton>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuButton>
                  <Settings className="size-4" />
                  Settings
                </NavigationMenuButton>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </SidebarContent>
        <SidebarFooter className="border-t border-border px-4 py-3 text-xs text-text-muted">
          3 teammates online
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
};

export const CompactActivityBar: Story = {
  render: () => (
    <div className="h-[360px] overflow-hidden rounded-xl border border-border">
      <ActivityBar className="h-full">
        <ActivityBarHeader>
          <Button variant="ghost" size="icon-sm" aria-label="Workspace home">
            <LayoutGrid className="size-4" />
          </Button>
        </ActivityBarHeader>
        <ActivityBarContent>
          <ActivityBarItem active aria-label="Inbox">
            <ActivityBarIndicator />
            <Bell className="size-4" />
          </ActivityBarItem>
          <ActivityBarItem aria-label="Channels">
            <MessageSquare className="size-4" />
          </ActivityBarItem>
          <ActivityBarItem aria-label="Billing">
            <CreditCard className="size-4" />
          </ActivityBarItem>
        </ActivityBarContent>
        <ActivityBarFooter>
          <ActivityBarItem aria-label="Settings">
            <Settings className="size-4" />
          </ActivityBarItem>
        </ActivityBarFooter>
      </ActivityBar>
    </div>
  ),
};

export const ApprovalDetailPanel: Story = {
  render: () => (
    <div className="h-[360px] overflow-hidden rounded-xl border border-border bg-surface-2">
      <DetailPanel className="h-full" width={360}>
        <DetailPanelHeader>
          <div className="min-w-0 flex-1">
            <DetailPanelTitle>Approval details</DetailPanelTitle>
            <DetailPanelDescription>
              Review the latest automation decision before publishing.
            </DetailPanelDescription>
          </div>
          <DetailPanelCloseButton srLabel="Close details" />
        </DetailPanelHeader>
        <DetailPanelContent className="space-y-4 p-4 text-sm text-text-secondary">
          <div className="rounded-lg border border-border bg-surface-1 p-3">
            The workflow is waiting for finance approval because spend exceeds the daily threshold.
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-1 p-3">
            <span>Current status</span>
            <Badge variant="warning">Pending review</Badge>
          </div>
        </DetailPanelContent>
      </DetailPanel>
    </div>
  ),
};
