import { useEffect, useState } from "react";
import {
  ChevronDown,
  Code,
  Cpu,
  MousePointer,
  Plus,
  Sparkles,
  Terminal,
  Box,
  User,
  Users,
} from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  ScrollArea,
  Tabs,
  TabsList,
  TabsTrigger,
  cn,
} from "@nexu-design/ui-web";
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

  useEffect(() => {
    if (runtimes.length === 0) setRuntimes(mockRuntimes);
  }, [runtimes.length, setRuntimes]);

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
    setTab("mine");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-3 pb-2 flex items-center gap-2">
        <span className="text-xs text-text-tertiary">
          {onlineCount}/{runtimes.length} online
        </span>
      </div>

      <div className="px-3 pb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="w-full justify-start"
              leadingIcon={<Plus className="size-3.5" />}
              trailingIcon={<ChevronDown className="size-3.5" />}
            >
              Add Runtime
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[232px]">
            {available.length > 0 ? (
              available.map((item) => {
                const Icon = typeIcons[item.type];
                return (
                  <DropdownMenuItem
                    key={item.type}
                    onClick={() => handleAdd(item)}
                    className="gap-2.5 rounded-lg text-[13px] hover:bg-surface-2"
                  >
                    <Icon className="size-3.5 shrink-0" />
                    <span className="font-medium">{item.name}</span>
                    <span className="ml-auto text-xs text-text-tertiary">{item.desc}</span>
                  </DropdownMenuItem>
                );
              })
            ) : (
              <div className="px-3 py-3 text-center text-xs text-text-tertiary">
                All runtime types added
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="px-3 pb-2">
        <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
          <TabsList variant="compact">
            <TabsTrigger value="mine" variant="compact">
              <User className="size-3.5" />
              Mine
            </TabsTrigger>
            <TabsTrigger value="all" variant="compact">
              <Users className="size-3.5" />
              All
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-2 pb-3">
        <div className="space-y-1 pr-1">
          {filtered.map((rt) => {
            const Icon = typeIcons[rt.type];
            const ownerUser = tab === "all" ? mockUsers.find((u) => u.id === rt.ownerId) : null;
            return (
              <InteractiveRow
                key={rt.id}
                tone="subtle"
                selected={selectedRuntimeId === rt.id}
                onClick={() => selectRuntime(rt.id)}
                className="items-center gap-2.5 rounded-lg px-2.5 py-2"
              >
                <InteractiveRowLeading className="pt-0.5">
                  <Icon className="h-4 w-4 shrink-0" />
                </InteractiveRowLeading>
                <InteractiveRowContent className="text-left">
                  <div className="truncate text-[13px] font-medium text-text-primary">
                    {rt.name}
                  </div>
                  {ownerUser ? (
                    <div className="flex items-center gap-1 text-xs text-text-tertiary">
                      <img src={ownerUser.avatar} alt="" className="h-3 w-3 rounded-full" />
                      <span className="truncate">{ownerUser.name}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-text-tertiary">{rt.type}</div>
                  )}
                </InteractiveRowContent>
                <InteractiveRowTrailing className="pt-1">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full shrink-0",
                      rt.status === "connected" && "bg-slark-online",
                      rt.status === "disconnected" && "bg-slark-offline",
                      rt.status === "error" && "bg-destructive",
                    )}
                  />
                </InteractiveRowTrailing>
              </InteractiveRow>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
