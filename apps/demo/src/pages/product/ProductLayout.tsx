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
import {
  Clock,
  FolderTree,
  MessageSquare,
  PanelLeft,
  PanelLeftClose,
  Settings,
  Sparkles,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { CLONE_FILE_TREE, FOLDER_ICONS, FOLDER_ROUTES, type FileNode } from "./FileTree";
import { ProductLayoutContext } from "./ProductLayoutContext";
import { getFile, saveFile } from "./fileStore";

const ACTIVITY_NAV = [
  { to: "/app/sessions", id: "sessions", icon: MessageSquare, label: "Sessions" },
  { to: "/app/team", id: "team", icon: Users, label: "团队协作" },
  { to: null, id: "explorer", icon: FolderTree, label: "Explorer" },
  { to: "/app/clone", id: "clone", icon: Wrench, label: "分身搭建" },
  { to: "/app/automation", id: "automation", icon: Clock, label: "Automation" },
  { to: "/app/skills", id: "skills", icon: Sparkles, label: "Skills" },
];

const TREE_MIN = 180;
const TREE_MAX = 480;
const TREE_DEFAULT = 224;
const DEFAULT_EXPANDED_PATHS = [
  ".soul",
  "contacts",
  "memory",
  "memory/decisions",
  "knowledge",
  "artifacts",
  "artifacts/prds",
  "sessions",
  "sessions/2026-02-22-clone文件系统验证",
];

function inferFileType(path: string) {
  if (path.endsWith(".md")) return "markdown" as const;
  if (path.endsWith(".yaml") || path.endsWith(".yml")) return "yaml" as const;
  if (path.endsWith(".json") || path.endsWith(".jsonl")) return "jsonl" as const;
  if (path.endsWith(".ts") || path.endsWith(".tsx") || path.endsWith(".js")) return "code" as const;
  if (path.endsWith(".sql")) return "sql" as const;
  if (path.endsWith(".html")) return "html" as const;
  if (path.endsWith(".css")) return "code" as const;
  if (path.endsWith(".svg")) return "svg" as const;
  if (path.endsWith(".png") || path.endsWith(".jpg") || path.endsWith(".gif"))
    return "image" as const;
  if (path.endsWith(".pdf")) return "pdf" as const;
  return "markdown" as const;
}

function decorateTree(nodes: FileNode[]): FileNode[] {
  return nodes.map((node) => ({
    ...node,
    icon: node.type === "folder" ? FOLDER_ICONS[node.name] : node.icon,
    children: node.children ? decorateTree(node.children) : undefined,
  }));
}

export default function ProductLayout({ children }: { children: ReactNode }) {
  const [treeCollapsed, setTreeCollapsed] = useState(false);
  const [treeWidth, setTreeWidth] = useState(TREE_DEFAULT);
  const [openFilePath, setOpenFilePath] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const tree = useMemo(() => decorateTree(CLONE_FILE_TREE), []);

  const isActive = (to: string | null) => {
    if (!to) return !treeCollapsed;
    return location.pathname.startsWith(to);
  };

  const expandFileTree = useCallback(() => {
    setTreeCollapsed(false);
  }, []);

  const handleOpenFile = useCallback((fullPath: string) => {
    setOpenFilePath(fullPath);
  }, []);

  const handleCloseFile = useCallback(() => {
    setOpenFilePath(null);
  }, []);

  const handleTreeSelect = useCallback(
    ({ node, path }: { node: FileNode; path: string }) => {
      if (node.type === "folder") {
        const route = FOLDER_ROUTES[node.name];
        if (route) {
          navigate(route);
        }
        return;
      }

      setOpenFilePath(path);
      const parentFolder = path.split("/")[0];
      const route = FOLDER_ROUTES[parentFolder];
      if (route) {
        navigate(route);
      }
    },
    [navigate],
  );

  return (
    <ProductLayoutContext.Provider value={{ expandFileTree, openFile: handleOpenFile }}>
      <WorkspaceShell
        sidebarCollapsed={treeCollapsed}
        onSidebarCollapsedChange={setTreeCollapsed}
        sidebarWidth={treeWidth}
        onSidebarWidthChange={setTreeWidth}
        sidebarDefaultWidth={TREE_DEFAULT}
        sidebarMinWidth={TREE_MIN}
        sidebarMaxWidth={TREE_MAX}
        contentClassName={`transition-all duration-200 ${openFilePath ? "min-w-0 flex-1" : "w-full"}`}
        activityBar={
          <ActivityBar>
            <ActivityBarHeader>
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-3 text-sm animate-clone-breath-subtle">
                  😊
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface-1 bg-success" />
              </div>
            </ActivityBarHeader>

            <ActivityBarContent>
              {ACTIVITY_NAV.map(({ to, id, icon: Icon, label }) => {
                const active = isActive(to);

                if (to) {
                  return (
                    <ActivityBarItem key={id} asChild active={active} title={label}>
                      <NavLink to={to}>
                        {active ? <ActivityBarIndicator /> : null}
                        <Icon size={18} />
                      </NavLink>
                    </ActivityBarItem>
                  );
                }

                return (
                  <ActivityBarItem
                    key={id}
                    active={!treeCollapsed}
                    title={label}
                    onClick={() => setTreeCollapsed((collapsed) => !collapsed)}
                  >
                    {!treeCollapsed ? <ActivityBarIndicator /> : null}
                    <Icon size={18} />
                  </ActivityBarItem>
                );
              })}
            </ActivityBarContent>

            <ActivityBarFooter>
              {treeCollapsed ? (
                <ActivityBarItem title="展开文件树" onClick={() => setTreeCollapsed(false)}>
                  <PanelLeft size={16} />
                </ActivityBarItem>
              ) : null}
              <div
                className="flex h-8 w-8 items-center justify-center"
                title="3,200 / 5,000 credits"
              >
                <Zap size={16} className="text-clone" />
              </div>
              <ActivityBarItem title="设置">
                <Settings size={16} />
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
                  <NavigationMenuButton
                    type="button"
                    title="收起文件树"
                    className="h-7 w-7 justify-center px-0 py-0"
                    onClick={() => setTreeCollapsed(true)}
                  >
                    <PanelLeftClose size={14} />
                  </NavigationMenuButton>
                </NavigationMenuItem>
              </NavigationMenu>
            </SidebarHeader>
            <SidebarContent className="overflow-hidden">
              <FileTree
                tree={tree}
                rootLabel="~/clone"
                defaultExpandedPaths={DEFAULT_EXPANDED_PATHS}
                defaultSelectedPath="artifacts/prds/universal-agent-v3.md"
                footer={
                  <div className="flex items-center justify-between text-[10px] text-text-muted">
                    <span>137 files</span>
                    <span>1 modified · 4 new</span>
                  </div>
                }
                onItemSelect={handleTreeSelect}
              />
            </SidebarContent>
          </Sidebar>
        }
        detailPanel={
          openFilePath ? (
            <DetailPanel width={420} className="animate-slide-in-right bg-surface-0">
              <FileEditor
                filePath={openFilePath}
                initialContent={
                  getFile(openFilePath)?.content ??
                  `# ${openFilePath.split("/").pop()}\n\n(File content)`
                }
                fileType={inferFileType(openFilePath)}
                lastEditedBy={getFile(openFilePath)?.lastEditedBy}
                lastEditedAt={getFile(openFilePath)?.lastEditedAt}
                onClose={handleCloseFile}
                onSave={(content) => saveFile(openFilePath, content, "human")}
              />
            </DetailPanel>
          ) : null
        }
      >
        <div key={location.pathname} className="h-full overflow-hidden animate-page-enter">
          {children}
        </div>
      </WorkspaceShell>
    </ProductLayoutContext.Provider>
  );
}
