import { useEffect, useRef, useState } from "react";
import { Plus, Terminal, MousePointer, Code, Cpu, Box, Sparkles, X } from "lucide-react";
import { cn } from "@nexu-design/ui-web";
import { useRuntimesStore } from "@/stores/runtimes";
import { useWorkspaceStore } from "@/stores/workspace";
import { mockRuntimes, mockUsers } from "@/mock/data";
import type { Runtime } from "@/types";

const typeIcons: Record<Runtime["type"], React.ElementType> = {
  "claude-code": Terminal,
  cursor: MousePointer,
  opencode: Code,
  hermes: Cpu,
  codex: Box,
  "gemini-cli": Sparkles,
};

const runtimeCatalog: { type: Runtime["type"]; name: string; desc: string }[] = [
  { type: "claude-code", name: "Claude Code", desc: "Anthropic" },
  { type: "opencode", name: "OpenCode", desc: "Open-source" },
  { type: "cursor", name: "Cursor", desc: "AI editor" },
  { type: "codex", name: "Codex", desc: "OpenAI" },
  { type: "gemini-cli", name: "Gemini CLI", desc: "Google" },
  { type: "hermes", name: "Hermes", desc: "Local LLM" },
];

type Tab = "mine" | "all";

export function RuntimesSidebar(): React.ReactElement {
  const { runtimes, setRuntimes, addRuntime, selectRuntime, selectedRuntimeId } =
    useRuntimesStore();
  const currentUserId = useWorkspaceStore((s) => s.currentUserId);
  const [tab, setTab] = useState<Tab>("mine");
  const [showAdd, setShowAdd] = useState(false);
  const addRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (runtimes.length === 0) setRuntimes(mockRuntimes);
  }, [runtimes.length, setRuntimes]);

  useEffect(() => {
    if (!showAdd) return;
    const handler = (e: MouseEvent): void => {
      if (addRef.current && !addRef.current.contains(e.target as Node)) setShowAdd(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAdd]);

  const onlineCount = runtimes.filter((r) => r.status === "connected").length;
  const filtered = tab === "mine" ? runtimes.filter((r) => r.ownerId === currentUserId) : runtimes;

  const existingTypes = new Set(runtimes.map((r) => r.type));
  const available = runtimeCatalog.filter((c) => !existingTypes.has(c.type));

  const handleAdd = (item: (typeof runtimeCatalog)[number]): void => {
    const newRt: Runtime = {
      id: `rt-${item.type}-${Date.now()}`,
      name: item.name,
      type: item.type,
      status: "disconnected",
      config: {},
      ownerId: currentUserId,
    };
    addRuntime(newRt);
    selectRuntime(newRt.id);
    setShowAdd(false);
    setTab("mine");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pb-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {onlineCount}/{runtimes.length} online
        </span>
      </div>

      <div className="px-3 pb-2 relative" ref={addRef}>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 w-full h-8 px-3 rounded-md text-sm bg-accent hover:bg-accent/80 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Runtime
        </button>

        {showAdd && (
          <div className="absolute top-9 left-3 right-3 z-50 rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="text-xs font-medium">Add Runtime</span>
              <button
                onClick={() => setShowAdd(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            {available.length > 0 ? (
              <div className="p-1.5">
                {available.map((item) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <button
                      key={item.type}
                      onClick={() => handleAdd(item)}
                      className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md text-xs hover:bg-accent transition-colors"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground ml-auto">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="px-3 py-3 text-xs text-muted-foreground text-center">
                All runtime types added
              </p>
            )}
          </div>
        )}
      </div>

      <div className="px-3 pb-2 flex items-center gap-1">
        <button
          onClick={() => setTab("mine")}
          className={cn(
            "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
            tab === "mine"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Mine
        </button>
        <button
          onClick={() => setTab("all")}
          className={cn(
            "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
            tab === "all"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {filtered.map((rt) => {
          const Icon = typeIcons[rt.type];
          const ownerUser = tab === "all" ? mockUsers.find((u) => u.id === rt.ownerId) : null;
          return (
            <button
              key={rt.id}
              onClick={() => selectRuntime(rt.id)}
              className={cn(
                "flex items-center gap-2.5 w-full px-2 py-2 rounded-md transition-colors",
                selectedRuntimeId === rt.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1 text-left">
                <div className="text-sm font-medium truncate">{rt.name}</div>
                {ownerUser ? (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <img src={ownerUser.avatar} alt="" className="h-3 w-3 rounded-full" />
                    <span className="truncate">{ownerUser.name}</span>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">{rt.type}</div>
                )}
              </div>
              <div
                className={cn(
                  "h-2 w-2 rounded-full shrink-0",
                  rt.status === "connected" && "bg-slark-online",
                  rt.status === "disconnected" && "bg-slark-offline",
                  rt.status === "error" && "bg-destructive",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
