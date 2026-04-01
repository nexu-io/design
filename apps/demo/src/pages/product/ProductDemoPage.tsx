import {
  ActivityBar,
  ActivityBarContent,
  ActivityBarFooter,
  ActivityBarHeader,
  ActivityBarIndicator,
  ActivityBarItem,
  DetailPanel,
  NavigationMenu,
  NavigationMenuButton,
  NavigationMenuItem,
  Sidebar,
  SidebarContent,
  SidebarHeader,
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
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AutomationPage from "./AutomationPage";
import CloneBuilderPage from "./CloneBuilderPage";
import { FileEditor } from "./FileEditor";
import { CLONE_FILE_TREE, FileTree, FOLDER_ICONS, type FileNode } from "./FileTree";
import { WorkspaceShell } from "./WorkspaceShell";
import { ProductLayoutContext } from "./ProductLayoutContext";
import SessionsPage from "./SessionsPage";
import SkillsPage from "./SkillsPage";
import TeamPage from "./TeamPage";
import { getFile, saveFile } from "./fileStore";

const PAGES = [
  { id: "sessions", icon: MessageSquare, label: "Sessions", component: SessionsPage },
  { id: "team", icon: Users, label: "团队协作", component: TeamPage },
  { id: "explorer", icon: FolderTree, label: "Explorer", component: null },
  { id: "clone", icon: Wrench, label: "分身搭建", component: CloneBuilderPage },
  { id: "automation", icon: Clock, label: "Automation", component: AutomationPage },
  { id: "skills", icon: Sparkles, label: "Skills", component: SkillsPage },
] as const;

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
  return "markdown" as const;
}

function decorateTree(nodes: FileNode[]): FileNode[] {
  return nodes.map((node) => ({
    ...node,
    icon: node.type === "folder" ? FOLDER_ICONS[node.name] : node.icon,
    children: node.children ? decorateTree(node.children) : undefined,
  }));
}

export default function ProductDemoPage() {
  const [activeTab, setActiveTab] = useState("sessions");
  const [treeCollapsed, setTreeCollapsed] = useState(false);
  const [treeWidth, setTreeWidth] = useState(TREE_DEFAULT);
  const [openFilePath, setOpenFilePath] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const tree = useMemo(() => decorateTree(CLONE_FILE_TREE), []);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && PAGES.some((page) => page.id === hash && page.component)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") navigate("/why");
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  const expandFileTree = useCallback(() => {
    setTreeCollapsed(false);
  }, []);

  const handleOpenFile = useCallback((fullPath: string) => {
    setOpenFilePath(fullPath);
  }, []);

  const handleCloseFile = useCallback(() => {
    setOpenFilePath(null);
  }, []);

  const handleTreeSelect = useCallback(({ node, path }: { node: FileNode; path: string }) => {
    const mapping: Record<string, string> = {
      ".soul": "clone",
      sessions: "sessions",
      team: "team",
      clone: "clone",
      automation: "automation",
      skills: "skills",
    };

    if (node.type === "folder") {
      const tab = mapping[node.name];
      if (tab) {
        setActiveTab(tab);
      }
      return;
    }

    setOpenFilePath(path);
    const tab = mapping[path.split("/")[0]];
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  const activePage = PAGES.find((page) => page.id === activeTab);
  const ActiveComponent = activePage?.component ?? CloneBuilderPage;

  return (
    <ProductLayoutContext.Provider value={{ expandFileTree, openFile: handleOpenFile }}>
      <div className="fixed inset-0 z-50 flex flex-col bg-surface-0">
        <header className="flex h-9 shrink-0 items-center gap-3 border-b border-border bg-surface-0/90 px-4 backdrop-blur-md">
          <button
            type="button"
            onClick={() => navigate("/why")}
            className="rounded-lg p-1 text-text-muted transition-colors hover:bg-surface-3"
            title="返回 Design System (Esc)"
          >
            <X size={14} />
          </button>
          <div className="text-[11px] font-medium text-text-muted">nexu Product Demo</div>
          <div className="flex items-center gap-1.5">
            {PAGES.filter((page) => page.component).map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => setActiveTab(page.id)}
                className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  activeTab === page.id
                    ? "bg-accent text-accent-fg"
                    : "text-text-muted hover:bg-surface-3 hover:text-text-primary"
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="text-[11px] text-text-muted">按 Esc 退出</div>
        </header>

        <WorkspaceShell
          className="flex-1 overflow-hidden"
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
                {PAGES.map(({ id, icon: Icon, label }) => {
                  const isExplorer = id === "explorer";
                  const active = isExplorer ? !treeCollapsed : activeTab === id;

                  return (
                    <ActivityBarItem
                      key={id}
                      active={active}
                      title={label}
                      onClick={() =>
                        isExplorer ? setTreeCollapsed((collapsed) => !collapsed) : setActiveTab(id)
                      }
                    >
                      {active ? <ActivityBarIndicator /> : null}
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
                  onSave={(content: string) => saveFile(openFilePath, content, "human")}
                />
              </DetailPanel>
            ) : null
          }
        >
          <ActiveComponent />
        </WorkspaceShell>
      </div>
    </ProductLayoutContext.Provider>
  );
}
