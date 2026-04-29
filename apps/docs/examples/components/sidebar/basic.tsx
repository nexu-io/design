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
} from "@nexu-design/ui-web";

export function SidebarBasicExample() {
  return (
    <div className="h-[420px] overflow-hidden rounded-xl border border-border">
      <Sidebar className="h-full w-[280px]">
        <SidebarHeader className="border-b border-border px-4 py-4">
          <div className="text-sm font-semibold text-text-primary">Workspace</div>
        </SidebarHeader>
        <SidebarContent className="px-3 py-4">
          <NavigationMenu>
            <NavigationMenuLabel>General</NavigationMenuLabel>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuButton active>Overview</NavigationMenuButton>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuButton>Messages</NavigationMenuButton>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuButton>Approvals</NavigationMenuButton>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </SidebarContent>
        <SidebarFooter className="border-t border-border px-4 py-3 text-sm text-text-secondary">
          3 open alerts
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
