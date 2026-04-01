import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ChevronUp,
  CircleHelp,
  Globe,
  Home,
  PanelLeftClose,
  Settings,
  Sparkles,
} from "lucide-react";

import {
  GitHubIcon,
  NavigationMenu,
  NavigationMenuButton,
  NavigationMenuItem,
  NavigationMenuList,
  NexuLogoIcon,
  PlatformLogo,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const sessions = [
  {
    id: "1",
    title: "Customer onboarding flow",
    platform: "slack" as const,
    time: "2m ago",
  },
  {
    id: "2",
    title: "Weekly report automation",
    platform: "feishu" as const,
    time: "15m ago",
  },
  {
    id: "3",
    title: "Team standup bot",
    platform: "discord" as const,
    time: "1h ago",
  },
  {
    id: "4",
    title: "Support ticket triage",
    platform: "wechat" as const,
    time: "3h ago",
  },
];

export const Default: Story = {
  render: () => (
    <div className="h-[560px] w-[220px] overflow-hidden rounded-xl border border-border">
      <Sidebar className="h-full">
        <SidebarHeader className="flex items-center justify-between gap-2.5 border-b border-border px-4 py-3">
          <NexuLogoIcon size={28} />
          <div className="min-w-0 flex-1">
            <div className="text-lg font-semibold text-text-primary">Nexu</div>
            <div className="text-2xs text-text-tertiary">OpenClaw Desktop</div>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary"
          >
            <PanelLeftClose size={14} />
          </button>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-y-auto">
          <div className="px-2 pb-1 pt-3">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuButton active>
                    <Home className="size-4" />
                    Home
                  </NavigationMenuButton>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuButton>
                    <Sparkles className="size-4" />
                    Skills
                    <span className="ml-auto text-2xs font-normal text-text-tertiary">3</span>
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
          </div>

          <div className="px-2 pt-4">
            <div className="mb-1.5 px-3 text-2xs font-medium uppercase tracking-wider text-text-muted">
              Conversations
            </div>
            <div className="space-y-0.5">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left transition-colors ${
                    s.id === "1"
                      ? "bg-surface-2 text-text-primary"
                      : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                  }`}
                >
                  <span className="flex size-5 shrink-0 items-center justify-center">
                    <PlatformLogo platform={s.platform} size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{s.title}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 truncate text-2xs text-text-muted">
                      <span>{s.platform.charAt(0).toUpperCase() + s.platform.slice(1)}</span>
                      <span className="text-border">·</span>
                      <span>{s.time}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </SidebarContent>

        <div className="flex shrink-0 items-center justify-between gap-1 px-3 pb-1.5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary"
              title="Help"
            >
              <CircleHelp size={16} />
            </button>
            <a
              href="https://github.com/nexu-io/nexu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary"
              title="GitHub"
            >
              <GitHubIcon size={16} />
            </a>
          </div>
          <button
            type="button"
            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary"
          >
            <Globe size={14} />
            <span>EN</span>
          </button>
        </div>

        <SidebarFooter className="border-t border-border px-2 py-2">
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 transition-all hover:bg-surface-3"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-accent/20 to-accent/5 text-2xs font-bold text-accent ring-1 ring-accent/10">
              J
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="truncate text-sm font-medium text-text-primary">Joey</div>
              <div className="truncate text-2xs text-text-muted">joey@nexu.ai</div>
            </div>
            <ChevronUp size={12} className="shrink-0 rotate-180 text-text-muted/50" />
          </button>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
};
