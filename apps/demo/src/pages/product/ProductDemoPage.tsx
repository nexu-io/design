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
  ResizableHandle,
  ResizablePanel,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SplitView,
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
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AutomationPage from "./AutomationPage";
import CloneBuilderPage from "./CloneBuilderPage";
import FileEditor from "./FileEditor";
import FileTree from "./FileTree";
import { ProductLayoutContext } from "./ProductLayoutContext";
import SessionsPage from "./SessionsPage";
import SkillsPage from "./SkillsPage";
import TeamPage from "./TeamPage";
import { getFile } from "./fileStore";

const PAGES = [
  { id: "sessions", icon: MessageSquare, label: "Sessions", component: SessionsPage },
  { id: "team", icon: Users, label: "团队协作", component: TeamPage },
  { id: "explorer", icon: FolderTree, label: "Explorer", component: null },
  { id: "clone", icon: Wrench, label: "分身搭建", component: CloneBuilderPage },
  { id: "automation", icon: Clock, label: "Automation", component: AutomationPage },
  { id: "skills", icon: Sparkles, label: "Skills", component: SkillsPage },
] as const;

function inferFileType(path: string) {
  if (path.endsWith(".md")) return "markdown" as const;
  if (path.endsWith(".yaml") || path.endsWith(".yml")) return "yaml" as const;
  if (path.endsWith(".json") || path.endsWith(".jsonl")) return "jsonl" as const;
  if (path.endsWith(".ts") || path.endsWith(".tsx") || path.endsWith(".js")) return "code" as const;
  return "markdown" as const;
}

const TREE_MIN = 180;
const TREE_MAX = 480;
const TREE_DEFAULT = 224;

export default function ProductDemoPage() {
  const [activeTab, setActiveTab] = useState("sessions");
  const [treeCollapsed, setTreeCollapsed] = useState(false);
  const [treeWidth, setTreeWidth] = useState(TREE_DEFAULT);
  const [openFilePath, setOpenFilePath] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && PAGES.some((p) => p.id === hash && p.component)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate("/why");
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

  const handleTreeNavigate = useCallback((route: string) => {
    const mapping: Record<string, string> = {
      "/app/sessions": "sessions",
      "/app/team": "team",
      "/app/clone": "clone",
      "/app/automation": "automation",
      "/app/skills": "skills",
    };
    const tab = mapping[route];
    if (tab) setActiveTab(tab);
  }, []);

  const handleResize = useCallback(
    (offset: number) => {
      const next = Math.max(TREE_MIN, Math.min(TREE_MAX, treeWidth + offset));
      setTreeWidth(next);
    },
    [treeWidth],
  );

  const activePage = PAGES.find((p) => p.id === activeTab);
  const ActiveComponent = activePage?.component ?? CloneBuilderPage;

  return (
    <ProductLayoutContext.Provider value={{ expandFileTree, openFile: handleOpenFile }}>
      <div className="fixed inset-0 z-50 bg-surface-0 flex flex-col">
        {/* Close bar */}
        <header className="h-9 border-b border-border bg-surface-0/90 backdrop-blur-md flex items-center px-4 gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate("/why")}
            className="p-1 rounded-lg hover:bg-surface-3 text-text-muted transition-colors"
            title="返回 Design System (Esc)"
          >
            <X size={14} />
          </button>
          <div className="text-[11px] font-medium text-text-muted">nexu Product Demo</div>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5">
            {PAGES.filter((p) => p.component).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveTab(p.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeTab === p.id
                    ? "bg-accent text-accent-fg"
                    : "text-text-muted hover:text-text-primary hover:bg-surface-3"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="text-[11px] text-text-muted">按 Esc 退出</div>
        </header>

        {/* Product UI */}
        <SplitView className={`flex-1 ${isDragging ? "select-none" : ""}`}>
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
                    onClick={() => (isExplorer ? setTreeCollapsed((c) => !c) : setActiveTab(id))}
                  >
                    {active && <ActivityBarIndicator />}
                    <Icon size={18} />
                  </ActivityBarItem>
                );
              })}
            </ActivityBarContent>

            <ActivityBarFooter>
              {treeCollapsed && (
                <ActivityBarItem title="展开文件树" onClick={() => setTreeCollapsed(false)}>
                  <PanelLeft size={16} />
                </ActivityBarItem>
              )}
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

          {!treeCollapsed && (
            <>
              <ResizablePanel size={treeWidth} minSize={TREE_MIN} maxSize={TREE_MAX}>
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
                    <FileTree onNavigate={handleTreeNavigate} onOpenFile={handleOpenFile} />
                  </SidebarContent>
                </Sidebar>
              </ResizablePanel>

              <ResizableHandle
                className="w-1 hover:bg-accent/30 data-[dragging=true]:bg-accent/50"
                onResizeStart={() => setIsDragging(true)}
                onResize={handleResize}
                onResizeEnd={() => setIsDragging(false)}
              />
            </>
          )}

          <SplitView className="flex-1 overflow-hidden">
            <main className="min-w-0 flex-1 overflow-hidden">
              <div
                className={`h-full overflow-hidden transition-all duration-200 ${openFilePath ? "min-w-0 flex-1" : "w-full"}`}
              >
                <ActiveComponent />
              </div>
            </main>

            {openFilePath && (
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
                />
              </DetailPanel>
            )}
          </SplitView>
        </SplitView>
      </div>
    </ProductLayoutContext.Provider>
  );
}
