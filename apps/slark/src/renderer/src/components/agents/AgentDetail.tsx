import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Bot,
  Zap,
  Wrench,
  MessageSquare,
  MoreHorizontal,
  FileText,
  Settings,
  Trash2,
  Copy,
} from "lucide-react";
import { cn } from "@nexu-design/ui-web";
import { useChatStore } from "@/stores/chat";
import { useAgentsStore } from "@/stores/agents";
import { mockRuntimes } from "@/mock/data";
import { RuntimePicker } from "./RuntimePicker";
import type { Agent, Channel } from "@/types";

interface AgentDetailProps {
  agent: Agent;
}

export function AgentDetail({ agent }: AgentDetailProps): React.ReactElement {
  const navigate = useNavigate();
  const channels = useChatStore((s) => s.channels);
  const addChannel = useChatStore((s) => s.addChannel);
  const addAgent = useAgentsStore((s) => s.addAgent);
  const updateAgent = useAgentsStore((s) => s.updateAgent);
  const removeAgent = useAgentsStore((s) => s.removeAgent);

  const runtime = agent.runtimeId ? mockRuntimes.find((r) => r.id === agent.runtimeId) : undefined;

  const dmChannelId = useMemo(() => {
    const dm = channels.find(
      (c) => c.type === "dm" && c.members.some((m) => m.kind === "agent" && m.id === agent.id),
    );
    return dm?.id;
  }, [channels, agent.id]);

  const handleSendMessage = (): void => {
    if (dmChannelId) {
      navigate(`/chat/${dmChannelId}`);
      return;
    }
    const newDm: Channel = {
      id: `dm-${agent.id}`,
      name: agent.name,
      type: "dm",
      members: [
        { kind: "user", id: "u-1" },
        { kind: "agent", id: agent.id },
      ],
      lastMessageAt: Date.now(),
      unreadCount: 0,
      createdAt: Date.now(),
    };
    addChannel(newDm);
    navigate(`/chat/${newDm.id}`);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="drag-region h-10 shrink-0" />

      <div className="flex items-center gap-3 px-5 h-12 border-b border-border shrink-0">
        <Bot className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="font-semibold text-sm">{agent.name}</span>
        <div
          className={cn(
            "flex items-center gap-1 text-xs",
            agent.status === "online" && "text-slark-online",
            agent.status === "busy" && "text-slark-busy",
            agent.status === "offline" && "text-muted-foreground",
          )}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-current" />
          {agent.status === "online" ? "Online" : agent.status === "busy" ? "Busy" : "Offline"}
        </div>
        {runtime && (
          <>
            <span className="text-border">·</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {runtime.name}
            </span>
          </>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={handleSendMessage}
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium border border-border hover:bg-accent transition-colors"
          >
            <MessageSquare className="h-3 w-3" />
            Message
          </button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={4}
                className="min-w-[160px] rounded-lg border border-border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100"
              >
                <DropdownMenu.Item
                  onClick={() => {
                    const dupId = `a-${Date.now()}`;
                    addAgent({
                      ...agent,
                      id: dupId,
                      name: `${agent.name} (copy)`,
                      createdAt: Date.now(),
                    });
                    const dmCh: Channel = {
                      id: `dm-${dupId}`,
                      name: `${agent.name} (copy)`,
                      type: "dm",
                      members: [
                        { kind: "user", id: "u-1" },
                        { kind: "agent", id: dupId },
                      ],
                      lastMessageAt: Date.now(),
                      unreadCount: 0,
                      createdAt: Date.now(),
                    };
                    addChannel(dmCh);
                    navigate(`/agents/${dupId}`);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm cursor-pointer outline-none hover:bg-accent transition-colors"
                >
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  Duplicate
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-border" />
                <DropdownMenu.Item
                  onClick={() => {
                    removeAgent(agent.id);
                    navigate("/agents");
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm cursor-pointer outline-none text-destructive-foreground hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Agent
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      <Tabs.Root defaultValue="instructions" className="flex-1 flex flex-col min-h-0">
        <Tabs.List className="flex items-center gap-1 px-5 h-10 border-b border-border shrink-0">
          <TabTrigger
            value="instructions"
            icon={<FileText className="h-3.5 w-3.5" />}
            label="Instructions"
          />
          <TabTrigger value="skills" icon={<Wrench className="h-3.5 w-3.5" />} label="Skills" />
          <TabTrigger
            value="settings"
            icon={<Settings className="h-3.5 w-3.5" />}
            label="Settings"
          />
        </Tabs.List>

        <Tabs.Content value="instructions" className="flex-1 overflow-y-auto outline-none">
          <InstructionsTab
            agent={agent}
            onSave={(prompt) => updateAgent(agent.id, { systemPrompt: prompt })}
          />
        </Tabs.Content>

        <Tabs.Content value="skills" className="flex-1 overflow-y-auto outline-none">
          <SkillsTab agent={agent} />
        </Tabs.Content>

        <Tabs.Content value="settings" className="flex-1 overflow-y-auto outline-none">
          <SettingsTab agent={agent} onUpdate={(updates) => updateAgent(agent.id, updates)} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

function TabTrigger({
  value,
  icon,
  label,
}: { value: string; icon: React.ReactNode; label: string }): React.ReactElement {
  return (
    <Tabs.Trigger
      value={value}
      className="flex items-center gap-1.5 px-3 h-10 text-sm text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground -mb-px"
    >
      {icon}
      {label}
    </Tabs.Trigger>
  );
}

function InstructionsTab({
  agent,
  onSave,
}: { agent: Agent; onSave: (prompt: string) => void }): React.ReactElement {
  const [prompt, setPrompt] = useState(agent.systemPrompt);
  const isDirty = prompt !== agent.systemPrompt;

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-sm font-semibold">Agent Instructions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Define this agent's identity and working style. These instructions are injected into the
            agent's context for every task.
          </p>
        </div>
      </div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full mt-3 rounded-lg border border-input bg-background p-4 text-sm font-mono leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y min-h-[200px]"
        placeholder="You are a helpful assistant..."
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-foreground">{prompt.length} characters</span>
        <button
          onClick={() => onSave(prompt)}
          disabled={!isDirty}
          className="flex items-center gap-1.5 h-8 px-4 rounded-md text-sm font-medium bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function SkillsTab({ agent }: { agent: Agent }): React.ReactElement {
  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Skills</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Skills assigned to this agent. These are synced from the connected runtime.
        </p>
      </div>

      {agent.skills.length > 0 ? (
        <div className="rounded-lg border border-border divide-y divide-border">
          {agent.skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent shrink-0">
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{skill.name}</div>
                <div className="text-xs text-muted-foreground truncate">{skill.description}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border border-dashed p-8 flex flex-col items-center gap-2 text-center">
          <Wrench className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">No skills available</p>
          <p className="text-xs text-muted-foreground">
            Connect a runtime to load skills automatically.
          </p>
        </div>
      )}
    </div>
  );
}

function SettingsTab({
  agent,
  onUpdate,
}: { agent: Agent; onUpdate: (updates: Partial<Agent>) => void }): React.ReactElement {
  const [name, setName] = useState(agent.name);
  const [description, setDescription] = useState(agent.description);
  const [runtimeId, setRuntimeId] = useState<string | null>(agent.runtimeId);
  const [avatar, setAvatar] = useState(agent.avatar);

  const isDirty =
    name !== agent.name ||
    description !== agent.description ||
    runtimeId !== agent.runtimeId ||
    avatar !== agent.avatar;

  const handleSave = (): void => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onUpdate({ name: trimmed, description: description.trim(), runtimeId, avatar });
  };

  const handleRandomizeAvatar = (): void => {
    const seed = Math.random().toString(36).slice(2, 8);
    setAvatar(`https://api.dicebear.com/9.x/bottts/svg?seed=${seed}`);
  };

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h3 className="text-sm font-semibold">Settings</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure agent identity and runtime.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Avatar</label>
          <div className="flex items-center gap-3">
            <img src={avatar} alt="" className="h-12 w-12 rounded-xl" />
            <button
              type="button"
              onClick={handleRandomizeAvatar}
              className="h-8 px-3 rounded-md text-sm border border-border hover:bg-accent transition-colors"
            >
              Randomize
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Runtime</label>
          <RuntimePicker value={runtimeId} onChange={setRuntimeId} />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!isDirty || !name.trim()}
        className="flex items-center gap-1.5 h-8 px-4 rounded-md text-sm font-medium bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        Save Changes
      </button>
    </div>
  );
}
