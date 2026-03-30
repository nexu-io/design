import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Brain, LayoutGrid, MessageSquare, PanelLeftClose, Settings } from "lucide-react";

import {
  ActivityBar,
  ActivityBarContent,
  ActivityBarFooter,
  ActivityBarHeader,
  ActivityBarIndicator,
  ActivityBarItem,
  DetailPanel,
  FileEditor,
  FileTree,
  NavigationMenu,
  NavigationMenuButton,
  NavigationMenuItem,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  WorkspaceShell,
} from "@nexu-design/ui-web";

const meta = {
  title: "Patterns/WorkspaceShell",
  component: WorkspaceShell,
  tags: ["autodocs"],
} satisfies Meta<typeof WorkspaceShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const tree = [
  {
    name: ".soul",
    type: "folder" as const,
    icon: <Brain size={14} className="text-clone" />,
    children: [{ name: "identity.md", type: "file" as const, active: true }],
  },
  {
    name: "sessions",
    type: "folder" as const,
    children: [{ name: "thread.jsonl", type: "file" as const }],
  },
];

export const Default: Story = {
  render: () => (
    <div className="h-[480px] w-[1100px] overflow-hidden rounded-xl border border-border">
      <WorkspaceShell
        activityBar={
          <ActivityBar>
            <ActivityBarHeader>
              <ActivityBarItem active aria-label="Workspace home">
                <ActivityBarIndicator />
                <LayoutGrid className="size-4" />
              </ActivityBarItem>
            </ActivityBarHeader>
            <ActivityBarContent>
              <ActivityBarItem aria-label="Messages">
                <MessageSquare className="size-4" />
              </ActivityBarItem>
              <ActivityBarItem aria-label="Alerts">
                <Bell className="size-4" />
              </ActivityBarItem>
            </ActivityBarContent>
            <ActivityBarFooter>
              <ActivityBarItem aria-label="Settings">
                <Settings className="size-4" />
              </ActivityBarItem>
            </ActivityBarFooter>
          </ActivityBar>
        }
        sidebar={
          <Sidebar className="h-full">
            <SidebarHeader className="flex items-center justify-between border-b border-border px-3 py-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                Explorer
              </span>
              <NavigationMenu>
                <NavigationMenuItem>
                  <NavigationMenuButton type="button" className="h-7 w-7 justify-center px-0 py-0">
                    <PanelLeftClose size={14} />
                  </NavigationMenuButton>
                </NavigationMenuItem>
              </NavigationMenu>
            </SidebarHeader>
            <SidebarContent className="overflow-hidden">
              <FileTree
                tree={tree}
                rootLabel="~/clone"
                defaultExpandedPaths={[".soul"]}
                defaultSelectedPath=".soul/identity.md"
                footer={
                  <div className="flex items-center justify-between text-[10px] text-text-muted">
                    <span>2 files</span>
                    <span>Desktop shell</span>
                  </div>
                }
              />
            </SidebarContent>
          </Sidebar>
        }
        detailPanel={
          <DetailPanel width={420} className="bg-surface-0">
            <FileEditor
              filePath=".soul/identity.md"
              initialContent={"# Identity\n\nNexu is a filesystem-first agent."}
              fileType="markdown"
              lastEditedBy="agent"
              lastEditedAt="10:16"
            />
          </DetailPanel>
        }
      >
        <div className="flex h-full items-center justify-center bg-surface-2 text-sm text-text-muted">
          Main workspace content
        </div>
      </WorkspaceShell>
    </div>
  ),
};
