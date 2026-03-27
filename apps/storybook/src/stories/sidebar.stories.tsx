import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, LayoutGrid, MessageSquare, Search, Settings } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuButton,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuList,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@nexu/ui-web";

const meta = {
  title: "Primitives/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
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
