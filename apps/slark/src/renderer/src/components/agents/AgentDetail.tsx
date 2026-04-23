import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Copy,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Settings,
  Trash2,
  Wrench,
  Zap,
} from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  FormField,
  FormFieldControl,
  Input,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  cn,
} from "@nexu-design/ui-web";

import { WindowChrome } from "@/components/layout/WindowChrome";
import { useT } from "@/i18n";
import { mockRuntimes } from "@/mock/data";
import { useAgentsStore } from "@/stores/agents";
import { useChatStore } from "@/stores/chat";
import type { Agent, Channel } from "@/types";

import { RuntimePicker } from "./RuntimePicker";

interface AgentDetailProps {
  agent: Agent;
}

export function AgentDetail({ agent }: AgentDetailProps): React.ReactElement {
  const t = useT();
  const navigate = useNavigate();
  const channels = useChatStore((s) => s.channels);
  const addChannel = useChatStore((s) => s.addChannel);
  const addAgent = useAgentsStore((s) => s.addAgent);
  const updateAgent = useAgentsStore((s) => s.updateAgent);
  const removeAgent = useAgentsStore((s) => s.removeAgent);

  const runtime = agent.runtimeId
    ? mockRuntimes.filter((item) => item.id === agent.runtimeId)[0]
    : undefined;

  const dmChannelId = useMemo(() => {
    for (const channel of channels) {
      if (channel.type !== "dm") {
        continue;
      }

      for (const member of channel.members) {
        if (member.kind === "agent" && member.id === agent.id) {
          return channel.id;
        }
      }
    }

    return undefined;
  }, [agent.id, channels]);

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

  const handleDuplicate = (): void => {
    const duplicateId = `a-${Date.now()}`;
    addAgent({
      ...agent,
      id: duplicateId,
      name: `${agent.name} (copy)`,
      createdAt: Date.now(),
    });

    const duplicateChannel: Channel = {
      id: `dm-${duplicateId}`,
      name: `${agent.name} (copy)`,
      type: "dm",
      members: [
        { kind: "user", id: "u-1" },
        { kind: "agent", id: duplicateId },
      ],
      lastMessageAt: Date.now(),
      unreadCount: 0,
      createdAt: Date.now(),
    };

    addChannel(duplicateChannel);
    navigate(`/agents/${duplicateId}`);
  };

  const handleDelete = (): void => {
    removeAgent(agent.id);
    navigate("/agents");
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-[800px] px-4 pt-2 pb-6 sm:px-6 sm:pb-8">
        <WindowChrome className="h-10" />

        <PageHeader
          density="shell"
          title={agent.name}
          description={agent.description}
          actions={
            <>
              <Button
                size="sm"
                leadingIcon={<MessageSquare className="size-3.5" />}
                onClick={handleSendMessage}
              >
                {t("agent.message")}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon-sm" className="text-text-primary">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="size-4 text-text-muted" />
                    {t("agent.duplicate")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="size-4" />
                    {t("agent.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          }
        />

        <div className="-mt-2 pb-6 text-[12px] text-text-muted">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1",
                agent.status === "online" && "text-[var(--color-success)]",
                agent.status === "busy" && "text-[var(--color-warning)]",
                agent.status === "offline" && "text-text-muted",
              )}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {agent.status === "online"
                ? t("agent.online")
                : agent.status === "busy"
                  ? t("agent.busy")
                  : t("agent.offline")}
            </span>
            {runtime ? (
              <span className="inline-flex items-center gap-1 text-text-muted">
                <Zap className="size-3.5" />
                {runtime.name}
              </span>
            ) : null}
          </div>
        </div>

        <Tabs defaultValue="instructions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="instructions">
              <FileText className="size-3.5" />
              {t("agent.tabInstructions")}
            </TabsTrigger>
            <TabsTrigger value="skills">
              <Wrench className="size-3.5" />
              {t("agent.tabSkills")}
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="size-3.5" />
              {t("agent.tabSettings")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="instructions" className="mt-0">
            <InstructionsTab
              agent={agent}
              onSave={(prompt) => updateAgent(agent.id, { systemPrompt: prompt })}
            />
          </TabsContent>

          <TabsContent value="skills" className="mt-0">
            <SkillsTab agent={agent} />
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <SettingsTab agent={agent} onUpdate={(updates) => updateAgent(agent.id, updates)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function InstructionsTab({
  agent,
  onSave,
}: {
  agent: Agent;
  onSave: (prompt: string) => void;
}): React.ReactElement {
  const t = useT();
  const [prompt, setPrompt] = useState(agent.systemPrompt);
  const isDirty = prompt !== agent.systemPrompt;

  return (
    <Card variant="outline" padding="lg">
      <CardHeader>
        <CardTitle className="text-[16px] text-text-heading">
          {t("agent.instructionsTitle")}
        </CardTitle>
        <CardDescription>{t("agent.instructionsDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="System prompt" description={t("agent.instructionsPlaceholder")}>
          <FormFieldControl>
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="min-h-[240px] font-mono text-[13px] leading-relaxed"
            />
          </FormFieldControl>
        </FormField>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-text-muted">
            {t("agent.charactersCount", { count: String(prompt.length) })}
          </span>
          <Button onClick={() => onSave(prompt)} disabled={!isDirty}>
            {t("common.save")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillsTab({ agent }: { agent: Agent }): React.ReactElement {
  const t = useT();

  return (
    <Card variant="outline" padding="lg">
      <CardHeader>
        <CardTitle className="text-[16px] text-text-heading">{t("agent.skillsTitle")}</CardTitle>
        <CardDescription>{t("agent.skillsDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        {agent.skills.length > 0 ? (
          <div className="space-y-2">
            {agent.skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-start gap-3 rounded-xl border border-border px-3 py-3"
              >
                <div className="shrink-0">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-surface-2">
                    <Wrench className="size-4 text-text-muted" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-text-heading">{skill.name}</div>
                  <div className="text-[11px] text-text-muted">{skill.description}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title={t("agent.noSkills")}
            description={t("agent.noSkillsHint")}
            icon={<Wrench className="size-7" />}
            className="border-border-subtle"
          />
        )}
      </CardContent>
    </Card>
  );
}

function SettingsTab({
  agent,
  onUpdate,
}: {
  agent: Agent;
  onUpdate: (updates: Partial<Agent>) => void;
}): React.ReactElement {
  const t = useT();
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
    const trimmedName = name.trim();
    if (!trimmedName) return;

    onUpdate({
      name: trimmedName,
      description: description.trim(),
      runtimeId,
      avatar,
    });
  };

  const handleRandomizeAvatar = (): void => {
    const seed = Math.random().toString(36).slice(2, 8);
    setAvatar(`https://api.dicebear.com/9.x/bottts/svg?seed=${seed}`);
  };

  return (
    <Card variant="outline" padding="lg">
      <CardHeader>
        <CardTitle className="text-[16px] text-text-heading">{t("agent.settingsTitle")}</CardTitle>
        <CardDescription>{t("agent.settingsDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label={t("agent.avatar")}>
          <FormFieldControl>
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt=""
                className="size-12 rounded-full bg-secondary ring-1 ring-inset ring-black/5 dark:ring-white/10"
              />
              <Button
                variant="outline"
                size="sm"
                className="text-text-primary"
                onClick={handleRandomizeAvatar}
              >
                {t("agent.randomize")}
              </Button>
            </div>
          </FormFieldControl>
        </FormField>

        <FormField label={t("agent.name")}>
          <FormFieldControl>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </FormFieldControl>
        </FormField>

        <FormField label={t("agent.description")}>
          <FormFieldControl>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="min-h-[112px] resize-y text-[13px]"
            />
          </FormFieldControl>
        </FormField>

        <FormField label={t("agent.runtime")}>
          <FormFieldControl>
            <RuntimePicker value={runtimeId} onChange={setRuntimeId} />
          </FormFieldControl>
        </FormField>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!isDirty || !name.trim()}>
            {t("common.saveChanges")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
