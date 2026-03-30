import {
  ChevronDown,
  ChevronRight,
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
} from "lucide-react";
import * as React from "react";

import { cn } from "../lib/cn";

export interface FileTreeNode {
  id?: string;
  name: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
  modified?: boolean;
  isNew?: boolean;
  active?: boolean;
  icon?: React.ReactNode;
}

export interface FileTreeSelection {
  node: FileTreeNode;
  path: string;
}

export interface FileTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  tree: FileTreeNode[];
  rootLabel?: React.ReactNode;
  footer?: React.ReactNode;
  selectedPath?: string | null;
  defaultSelectedPath?: string | null;
  expandedPaths?: string[];
  defaultExpandedPaths?: string[];
  onExpandedPathsChange?: (paths: string[]) => void;
  onItemSelect?: (selection: FileTreeSelection) => void;
}

function getFileIcon(node: FileTreeNode) {
  const ext = node.name.split(".").pop()?.toLowerCase();
  if (ext === "md") return <FileText size={14} className="text-text-muted" />;
  if (ext === "yaml" || ext === "yml") return <FileText size={14} className="text-warning" />;
  if (ext === "sql") return <FileCode size={14} className="text-info" />;
  if (ext === "jsonl" || ext === "json") {
    return <FileCode size={14} className="text-role-programmer" />;
  }
  if (ext === "pdf") return <File size={14} className="text-danger" />;
  if (ext === "docx" || ext === "doc") return <FileText size={14} className="text-info" />;
  if (ext === "xlsx" || ext === "xls" || ext === "csv") {
    return <FileSpreadsheet size={14} className="text-success" />;
  }
  if (ext === "pptx" || ext === "ppt") {
    return <Presentation size={14} className="text-role-founder" />;
  }
  if (
    ext === "html" ||
    ext === "css" ||
    ext === "tsx" ||
    ext === "ts" ||
    ext === "js" ||
    ext === "py"
  ) {
    return <FileCode size={14} className="text-role-programmer" />;
  }
  if (
    ext === "png" ||
    ext === "jpg" ||
    ext === "jpeg" ||
    ext === "webp" ||
    ext === "svg" ||
    ext === "gif"
  ) {
    return <Image size={14} className="text-role-designer" />;
  }
  if (ext === "mp4" || ext === "mov" || ext === "webm") {
    return <Film size={14} className="text-role-designer" />;
  }
  if (ext === "mp3" || ext === "wav" || ext === "ogg" || ext === "m4a") {
    return <Music size={14} className="text-role-ops" />;
  }
  if (ext === "figma") return <Presentation size={14} className="text-role-designer" />;
  return <File size={14} className="text-text-muted" />;
}

function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value: T | undefined;
  defaultValue: T;
  onChange?: (value: T) => void;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = React.useCallback(
    (nextValue: React.SetStateAction<T>) => {
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (previousValue: T) => T)(currentValue)
          : nextValue;

      if (!isControlled) {
        setInternalValue(resolvedValue);
      }

      onChange?.(resolvedValue);
    },
    [currentValue, isControlled, onChange],
  );

  return [currentValue, setValue] as const;
}

interface TreeNodeProps {
  node: FileTreeNode;
  depth: number;
  path: string;
  expandedPaths: Set<string>;
  toggleExpanded: (path: string) => void;
  selectedPath: string | null;
  onSelect?: (selection: FileTreeSelection) => void;
}

function TreeNode({
  node,
  depth,
  path,
  expandedPaths,
  toggleExpanded,
  selectedPath,
  onSelect,
}: TreeNodeProps) {
  const isFolder = node.type === "folder";
  const isExpanded = expandedPaths.has(path);
  const isSelected = !isFolder && selectedPath === path;

  const handleClick = () => {
    if (isFolder) {
      toggleExpanded(path);
    }

    onSelect?.({ node, path });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "group flex w-full items-center gap-1 rounded-sm py-[3px] pr-2 text-[12px] transition-colors hover:bg-surface-3",
          isSelected && "bg-accent/8 text-text-primary",
          node.active ? "font-medium text-text-primary" : "text-text-secondary",
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {isFolder ? (
          <>
            {isExpanded ? (
              <ChevronDown size={12} className="shrink-0 text-text-muted" />
            ) : (
              <ChevronRight size={12} className="shrink-0 text-text-muted" />
            )}
            {isExpanded ? (
              <FolderOpen size={14} className="shrink-0 text-text-muted" />
            ) : (
              <FolderClosed size={14} className="shrink-0 text-text-muted" />
            )}
            {node.icon ?? null}
          </>
        ) : (
          <>
            <span className="w-3 shrink-0" />
            {node.icon ?? getFileIcon(node)}
          </>
        )}
        <span className="ml-1 truncate">{node.name}</span>
        {node.modified ? (
          <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-clone" />
        ) : null}
        {node.isNew ? (
          <span className="ml-auto shrink-0 text-[9px] font-medium text-success">N</span>
        ) : null}
      </button>
      {isFolder && isExpanded
        ? node.children?.map((child) => {
            const childPath = `${path}/${child.name}`;

            return (
              <TreeNode
                key={child.id ?? childPath}
                node={child}
                depth={depth + 1}
                path={childPath}
                expandedPaths={expandedPaths}
                toggleExpanded={toggleExpanded}
                selectedPath={selectedPath}
                onSelect={onSelect}
              />
            );
          })
        : null}
    </>
  );
}

export function FileTree({
  tree,
  rootLabel,
  footer,
  selectedPath: selectedPathProp,
  defaultSelectedPath = null,
  expandedPaths: expandedPathsProp,
  defaultExpandedPaths = [],
  onExpandedPathsChange,
  onItemSelect,
  className,
  ...props
}: FileTreeProps) {
  const [selectedPath, setSelectedPath] = useControllableState<string | null>({
    value: selectedPathProp,
    defaultValue: defaultSelectedPath,
  });
  const [expandedPaths, setExpandedPaths] = useControllableState<string[]>({
    value: expandedPathsProp,
    defaultValue: defaultExpandedPaths,
    onChange: onExpandedPathsChange,
  });

  const expandedPathSet = React.useMemo(() => new Set(expandedPaths), [expandedPaths]);

  const toggleExpanded = React.useCallback(
    (path: string) => {
      setExpandedPaths((currentPaths) => {
        const nextPaths = new Set(currentPaths);
        if (nextPaths.has(path)) {
          nextPaths.delete(path);
        } else {
          nextPaths.add(path);
        }

        return Array.from(nextPaths);
      });
    },
    [setExpandedPaths],
  );

  const handleSelect = React.useCallback(
    (selection: FileTreeSelection) => {
      if (selection.node.type === "file") {
        setSelectedPath(selection.path);
      }

      onItemSelect?.(selection);
    },
    [onItemSelect, setSelectedPath],
  );

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)} {...props}>
      {rootLabel ? (
        <div className="border-b border-border px-3 py-2">
          <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
            {rootLabel}
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto py-1">
        {tree.map((node) => {
          const path = node.name;

          return (
            <TreeNode
              key={node.id ?? path}
              node={node}
              depth={0}
              path={path}
              expandedPaths={expandedPathSet}
              toggleExpanded={toggleExpanded}
              selectedPath={selectedPath}
              onSelect={handleSelect}
            />
          );
        })}
      </div>

      {footer ? <div className="border-t border-border px-3 py-2">{footer}</div> : null}
    </div>
  );
}
