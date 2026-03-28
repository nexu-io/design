import {
  Brain,
  ChevronDown,
  ChevronRight,
  Clock,
  Database,
  File,
  FileCode,
  FileSpreadsheet,
  FileText,
  Film,
  FolderClosed,
  FolderOpen,
  Image,
  Music,
  Presentation,
  Sparkles,
  Terminal as TermIcon,
  Users,
  Wrench,
} from "lucide-react";
import { type ReactNode, useState } from "react";

export interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  modified?: boolean;
  isNew?: boolean;
  active?: boolean;
  icon?: ReactNode;
}

export const FOLDER_ROUTES: Record<string, string> = {
  ".soul": "/app/clone",
  contacts: "/app/clone?tab=contacts",
  memory: "/app/clone?tab=memory",
  knowledge: "/app/clone?tab=memory",
  artifacts: "/app/clone?tab=artifacts",
  team: "/app/team",
  sessions: "/app/sessions",
  automation: "/app/automation",
  skills: "/app/skills",
};

export const FOLDER_ICONS: Record<string, ReactNode> = {
  ".soul": <Brain size={14} className="text-clone" />,
  contacts: <Users size={14} className="text-role-ops" />,
  memory: <Database size={14} className="text-info" />,
  knowledge: <FileText size={14} className="text-success" />,
  artifacts: <Sparkles size={14} className="text-role-founder" />,
  team: <Users size={14} className="text-warning" />,
  sessions: <TermIcon size={14} className="text-role-programmer" />,
  automation: <Clock size={14} className="text-warning" />,
  skills: <Wrench size={14} className="text-role-designer" />,
};

export const CLONE_FILE_TREE: FileNode[] = [
  {
    name: ".soul",
    type: "folder",
    children: [
      { name: "identity.md", type: "file" },
      { name: "identity-source.md", type: "file" },
      { name: "persona.md", type: "file" },
      { name: "values.md", type: "file" },
      { name: "values-source.md", type: "file" },
      { name: "worldview.md", type: "file" },
    ],
  },
  {
    name: "contacts",
    type: "folder",
    children: [
      {
        name: "_groups",
        type: "folder",
        children: [
          { name: "product-team.md", type: "file" },
          { name: "engineering.md", type: "file" },
          { name: "founders.md", type: "file" },
        ],
      },
      { name: "林远-CEO.md", type: "file" },
      { name: "周明-PM.md", type: "file" },
      { name: "赵雪-设计.md", type: "file" },
      { name: "吴恒-研发.md", type: "file" },
      { name: "张毅-增长.md", type: "file" },
      { name: "刘晴-测试.md", type: "file" },
      { name: "王谦-investor.md", type: "file" },
    ],
  },
  {
    name: "memory",
    type: "folder",
    children: [
      { name: "decisions-all.md", type: "file" },
      { name: "insights.md", type: "file" },
      {
        name: "decisions",
        type: "folder",
        children: [
          { name: "2026-02-22-clone-filesystem.md", type: "file" },
          { name: "2026-02-22-8week-roadmap.md", type: "file" },
          { name: "2026-02-22-agent-native-team.md", type: "file" },
          { name: "2026-02-21-product-philosophy.md", type: "file" },
          { name: "2026-02-20-v3-universal-agent.md", type: "file" },
          { name: "2026-02-18-product-naming.md", type: "file" },
        ],
      },
      {
        name: "ideas",
        type: "folder",
        children: [
          { name: "data-flywheel-architecture.md", type: "file" },
          { name: "stopping-cost-psychology.md", type: "file" },
          { name: "im-group-virality.md", type: "file" },
          { name: "seven-new-skills.md", type: "file" },
          {
            name: "2026-02-22-happycappy-product-learnings.md",
            type: "file",
            isNew: true,
          },
        ],
      },
      {
        name: "preferences",
        type: "folder",
        children: [
          { name: "tech-stack.md", type: "file" },
          { name: "communication-style.md", type: "file" },
          { name: "work-habits.md", type: "file" },
        ],
      },
      {
        name: "facts",
        type: "folder",
        children: [
          { name: "project-refly.md", type: "file" },
          { name: "project-context.md", type: "file" },
          { name: "team.md", type: "file" },
          { name: "team-structure.md", type: "file" },
          { name: "fundraising.md", type: "file" },
          { name: "growth.md", type: "file" },
          { name: "market.md", type: "file" },
          { name: "operations.md", type: "file" },
        ],
      },
      {
        name: "context",
        type: "folder",
        children: [
          { name: "current-sprint.md", type: "file", modified: true },
          { name: "blockers.md", type: "file" },
          { name: "ownership.md", type: "file" },
          { name: "todo.md", type: "file" },
          {
            name: "okr",
            type: "folder",
            children: [{ name: "current.md", type: "file" }],
          },
          {
            name: "sprint",
            type: "folder",
            children: [{ name: "current.md", type: "file", active: true }],
          },
          {
            name: "week",
            type: "folder",
            children: [{ name: "current.md", type: "file" }],
          },
        ],
      },
    ],
  },
  {
    name: "knowledge",
    type: "folder",
    children: [
      { name: "architecture.md", type: "file" },
      { name: "tech-stack.md", type: "file" },
      {
        name: "team",
        type: "folder",
        children: [
          { name: "agent-native-team-philosophy.md", type: "file" },
          { name: "culture-playbook.md", type: "file" },
        ],
      },
      {
        name: "operations",
        type: "folder",
        children: [
          { name: "goal-tracking-okr-sprint-week.md", type: "file" },
          { name: "linear-integration.md", type: "file" },
          { name: "weekly-review-template.md", type: "file" },
        ],
      },
      {
        name: "references",
        type: "folder",
        children: [
          { name: "growth-strategy.md", type: "file" },
          { name: "fundraising-brief.md", type: "file" },
          {
            name: "articles",
            type: "folder",
            children: [
              {
                name: "openclaw-ecosystem-kimi-claw-cloud-agent.md",
                type: "file",
              },
              { name: "pi-mono-minimalism-agent-philosophy.md", type: "file" },
              { name: "proactive-coding-agent-as-infra.md", type: "file" },
              {
                name: "memory-context-flow-recsys-digital-avatar.md",
                type: "file",
              },
              {
                name: "happycappy-skill-is-new-app.md",
                type: "file",
                isNew: true,
              },
              {
                name: "happycappy-use-cases-guide.md",
                type: "file",
                isNew: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "artifacts",
    type: "folder",
    children: [
      {
        name: "prds",
        type: "folder",
        children: [
          { name: "universal-agent-v3.md", type: "file", active: true },
          { name: "clone-filesystem.md", type: "file" },
        ],
      },
      {
        name: "research",
        type: "folder",
        children: [
          { name: "evolution.md", type: "file" },
          { name: "execution-risk-mitigations.md", type: "file" },
          { name: "openclaw-power-user-usecases.md", type: "file" },
          {
            name: "v0-openclaw",
            type: "folder",
            children: [
              { name: "product-plan.md", type: "file" },
              { name: "personal-agent-plan.md", type: "file" },
              { name: "org-network-plan.md", type: "file" },
            ],
          },
          {
            name: "v1-digital-clone",
            type: "folder",
            children: [
              { name: "mvp-thought.md", type: "file" },
              { name: "architecture.md", type: "file" },
              { name: "growth-strategy.md", type: "file" },
            ],
          },
          {
            name: "v2-opc-programmer",
            type: "folder",
            children: [
              { name: "opc-programmer-vertical.md", type: "file" },
              { name: "refly-nexu-architecture.md", type: "file" },
            ],
          },
          {
            name: "v3-universal-agent",
            type: "folder",
            children: [
              { name: "universal-agent-strategy.md", type: "file" },
              { name: "roadmap.md", type: "file" },
              { name: "refly-positioning.md", type: "file" },
              { name: "refly-design-system.md", type: "file" },
              { name: "refly-copy-system.md", type: "file" },
              { name: "caicai-openclaw-analysis.md", type: "file" },
            ],
          },
        ],
      },
      {
        name: "designs",
        type: "folder",
        children: [{ name: "design-system-overview.md", type: "file" }],
      },
      {
        name: "reports",
        type: "folder",
        children: [
          { name: "sprint-review-s0-planning.md", type: "file" },
          { name: "investor-narrative.md", type: "file" },
          {
            name: "investor-bp",
            type: "folder",
            children: [
              { name: "bp-deck.md", type: "file" },
              { name: "bp-document.md", type: "file" },
              { name: "investor-qa.md", type: "file" },
              { name: "speech-outline.md", type: "file" },
              { name: "data-metrics.md", type: "file" },
            ],
          },
          {
            name: "投资人BP准备",
            type: "folder",
            children: [
              { name: "final-bp.md", type: "file" },
              { name: "whole-bp.md", type: "file" },
              { name: "investor-qa-answers.md", type: "file" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "team",
    type: "folder",
    children: [
      { name: "sprint.md", type: "file", modified: true },
      {
        name: "standup",
        type: "folder",
        children: [
          { name: "2026-02-23.md", type: "file", isNew: true },
          { name: "2026-02-22.md", type: "file" },
          { name: "2026-02-21.md", type: "file" },
        ],
      },
      {
        name: "decisions",
        type: "folder",
        children: [{ name: "2026-02-23-gateway-priority.md", type: "file", isNew: true }],
      },
      { name: "topology.md", type: "file" },
    ],
  },
  {
    name: "sessions",
    type: "folder",
    children: [
      {
        name: "2026-02-22-clone文件系统验证",
        type: "folder",
        children: [{ name: "thread.jsonl", type: "file", active: true }],
      },
      {
        name: "2026-02-22-roadmap规划",
        type: "folder",
        children: [{ name: "thread.jsonl", type: "file" }],
      },
      {
        name: "2026-02-21-设计系统",
        type: "folder",
        children: [{ name: "thread.jsonl", type: "file" }],
      },
    ],
  },
  {
    name: "automation",
    type: "folder",
    children: [
      { name: "morning-digest.yaml", type: "file" },
      { name: "weekly-retro.yaml", type: "file" },
      { name: "todo-reminder.yaml", type: "file" },
      { name: "competitor-watch.yaml", type: "file" },
      { name: "proactive-rules.yaml", type: "file" },
    ],
  },
  {
    name: "skills",
    type: "folder",
    children: [
      {
        name: "memory-notes",
        type: "folder",
        children: [{ name: "SKILL.md", type: "file" }],
      },
      {
        name: "task-manager",
        type: "folder",
        children: [{ name: "SKILL.md", type: "file" }],
      },
      {
        name: "code-automation",
        type: "folder",
        children: [{ name: "SKILL.md", type: "file" }],
      },
      {
        name: "web-research",
        type: "folder",
        children: [{ name: "SKILL.md", type: "file" }],
      },
      {
        name: "daily-digest",
        type: "folder",
        children: [{ name: "SKILL.md", type: "file" }],
      },
      {
        name: "investor-prep",
        type: "folder",
        children: [{ name: "SKILL.md", type: "file" }],
      },
    ],
  },
];

const DEFAULT_OPEN = new Set([
  ".soul",
  "contacts",
  "memory",
  "artifacts",
  "prds",
  "knowledge",
  "sessions",
  "2026-02-22-clone文件系统验证",
  "decisions",
]);

function FileIcon({ node }: { node: FileNode }) {
  const ext = node.name.split(".").pop()?.toLowerCase();
  if (ext === "md") return <FileText size={14} className="text-text-muted" />;
  if (ext === "yaml" || ext === "yml") return <FileText size={14} className="text-warning" />;
  if (ext === "sql") return <FileCode size={14} className="text-info" />;
  if (ext === "jsonl" || ext === "json")
    return <FileCode size={14} className="text-role-programmer" />;
  if (ext === "pdf") return <File size={14} className="text-danger" />;
  if (ext === "docx" || ext === "doc") return <FileText size={14} className="text-info" />;
  if (ext === "xlsx" || ext === "xls" || ext === "csv")
    return <FileSpreadsheet size={14} className="text-success" />;
  if (ext === "pptx" || ext === "ppt")
    return <Presentation size={14} className="text-role-founder" />;
  if (
    ext === "html" ||
    ext === "css" ||
    ext === "tsx" ||
    ext === "ts" ||
    ext === "js" ||
    ext === "py"
  )
    return <FileCode size={14} className="text-role-programmer" />;
  if (
    ext === "png" ||
    ext === "jpg" ||
    ext === "jpeg" ||
    ext === "webp" ||
    ext === "svg" ||
    ext === "gif"
  )
    return <Image size={14} className="text-role-designer" />;
  if (ext === "mp4" || ext === "mov" || ext === "webm")
    return <Film size={14} className="text-role-designer" />;
  if (ext === "mp3" || ext === "wav" || ext === "ogg" || ext === "m4a")
    return <Music size={14} className="text-role-ops" />;
  if (ext === "figma") return <Presentation size={14} className="text-role-designer" />;
  return <File size={14} className="text-text-muted" />;
}

function TreeNode({
  node,
  depth,
  path,
  openFolders,
  toggleFolder,
  selectedFile,
  onSelectFile,
  onNavigate,
  onOpenFile,
}: {
  node: FileNode;
  depth: number;
  path: string;
  openFolders: Set<string>;
  toggleFolder: (name: string) => void;
  selectedFile: string | null;
  onSelectFile: (name: string) => void;
  onNavigate?: (route: string) => void;
  onOpenFile?: (fullPath: string) => void;
}) {
  const isOpen = openFolders.has(node.name);
  const isFolder = node.type === "folder";
  const isSelected = !isFolder && selectedFile === node.name;
  const hasRoute = isFolder && FOLDER_ROUTES[node.name];

  const handleClick = () => {
    if (isFolder) {
      toggleFolder(node.name);
      if (hasRoute && onNavigate) {
        onNavigate(FOLDER_ROUTES[node.name]);
      }
    } else {
      onSelectFile(node.name);
      const fullPath = path ? `${path}/${node.name}` : node.name;
      onOpenFile?.(fullPath);
      const parentFolder = path.split("/")[0];
      if (parentFolder && FOLDER_ROUTES[parentFolder] && onNavigate) {
        onNavigate(FOLDER_ROUTES[parentFolder]);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`w-full flex items-center gap-1 py-[3px] pr-2 text-[12px] hover:bg-surface-3 transition-colors rounded-sm group ${
          isSelected ? "bg-accent/8 text-text-primary" : ""
        } ${node.active ? "text-text-primary font-medium" : "text-text-secondary"}`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {isFolder ? (
          <>
            {isOpen ? (
              <ChevronDown size={12} className="text-text-muted shrink-0" />
            ) : (
              <ChevronRight size={12} className="text-text-muted shrink-0" />
            )}
            {isOpen ? (
              <FolderOpen size={14} className="text-text-muted shrink-0" />
            ) : (
              <FolderClosed size={14} className="text-text-muted shrink-0" />
            )}
            {FOLDER_ICONS[node.name] || null}
          </>
        ) : (
          <>
            <span className="w-3 shrink-0" />
            <FileIcon node={node} />
          </>
        )}
        <span className="ml-1 truncate">{node.name}</span>
        {node.modified && <span className="w-1.5 h-1.5 rounded-full bg-clone ml-auto shrink-0" />}
        {node.isNew && (
          <span className="text-[9px] text-success ml-auto shrink-0 font-medium">N</span>
        )}
      </button>
      {isFolder &&
        isOpen &&
        node.children?.map((child) => (
          <TreeNode
            key={child.name}
            node={child}
            depth={depth + 1}
            path={path ? `${path}/${child.name}` : child.name}
            openFolders={openFolders}
            toggleFolder={toggleFolder}
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
            onNavigate={onNavigate}
            onOpenFile={onOpenFile}
          />
        ))}
    </>
  );
}

export default function FileTree({
  collapsed,
  onNavigate,
  onOpenFile,
}: {
  collapsed?: boolean;
  onNavigate?: (route: string) => void;
  onOpenFile?: (fullPath: string) => void;
}) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(DEFAULT_OPEN));
  const [selectedFile, setSelectedFile] = useState<string | null>("universal-agent-v3.md");

  const toggleFolder = (name: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  if (collapsed) return null;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border">
        <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
          ~/clone
        </div>
      </div>

      {/* Tree */}
      <div className="overflow-y-auto flex-1 py-1">
        {CLONE_FILE_TREE.map((node) => (
          <TreeNode
            key={node.name}
            node={node}
            depth={0}
            path={node.name}
            openFolders={openFolders}
            toggleFolder={toggleFolder}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            onNavigate={onNavigate}
            onOpenFile={onOpenFile}
          />
        ))}
      </div>

      {/* Footer stats */}
      <div className="px-3 py-2 border-t border-border">
        <div className="flex items-center justify-between text-[10px] text-text-muted">
          <span>137 files</span>
          <span>1 modified · 4 new</span>
        </div>
      </div>
    </div>
  );
}
