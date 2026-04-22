import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleSlash,
  Copy,
  Eye,
  FileText,
  Globe,
  Hash,
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
import { useTopicsStore } from "@/stores/topics";
import { resolveRef } from "@/mock/data";
import type { Agent, Channel, IssueStatus, Topic } from "@/types";

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
            <TabsTrigger value="issues">
              <CircleDot className="size-3.5" />
              Issues
            </TabsTrigger>
            <TabsTrigger value="channels">
              <Hash className="size-3.5" />
              Channels
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

          <TabsContent value="issues" className="mt-0">
            <IssuesTab agent={agent} />
          </TabsContent>

          <TabsContent value="channels" className="mt-0">
            <ChannelsTab agent={agent} />
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

const ISSUE_STATUS_META: Record<
  IssueStatus,
  { label: string; icon: typeof CircleDot; dotClass: string; textClass: string }
> = {
  todo: { label: "Todo", icon: Circle, dotClass: "text-text-muted", textClass: "text-text-muted" },
  in_progress: {
    label: "In progress",
    icon: CircleDashed,
    dotClass: "text-warning",
    textClass: "text-warning",
  },
  in_review: { label: "In review", icon: Eye, dotClass: "text-info", textClass: "text-info" },
  blocked: {
    label: "Blocked",
    icon: CircleSlash,
    dotClass: "text-danger",
    textClass: "text-danger",
  },
  done: {
    label: "Done",
    icon: CircleCheck,
    dotClass: "text-success",
    textClass: "text-success",
  },
};

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(ts).toLocaleDateString();
}

function IssuesTab({ agent }: { agent: Agent }): React.ReactElement {
  const navigate = useNavigate();
  const topics = useTopicsStore((s) => s.topics);
  const topicMessages = useTopicsStore((s) => s.messages);
  const setActiveTopic = useTopicsStore((s) => s.setActiveTopic);
  const channels = useChatStore((s) => s.channels);

  const assigned = useMemo<Topic[]>(
    () =>
      Object.values(topics)
        .filter(
          (t): t is Topic =>
            !!t.issue &&
            t.issue.assignee?.kind === "agent" &&
            t.issue.assignee.id === agent.id,
        )
        .sort((a, b) => (b.issue?.createdAt ?? 0) - (a.issue?.createdAt ?? 0)),
    [topics, agent.id],
  );

  const openIssue = (topic: Topic): void => {
    setActiveTopic(topic.id);
    navigate(`/chat/${topic.rootChannelId}`);
  };

  return (
    <Card variant="outline" padding="lg">
      <CardHeader>
        <CardTitle className="text-[16px] text-text-heading">Assigned issues</CardTitle>
        <CardDescription>
          Issues assigned to {agent.name}. Click to open the thread in chat.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {assigned.length === 0 ? (
          <EmptyState
            title="No issues assigned"
            description="Assign an issue to this agent from any chat thread."
            icon={<CircleDot className="size-7" />}
            className="border-border-subtle"
          />
        ) : (
          <ul className="divide-y divide-border-subtle">
            {assigned.map((topic) => {
              const issue = topic.issue;
              if (!issue) return null;
              const meta = ISSUE_STATUS_META[issue.status];
              const Icon = meta.icon;
              const channel = channels.find((c) => c.id === topic.rootChannelId);
              const replies = topicMessages[topic.id]?.length ?? 0;
              return (
                <li key={topic.id}>
                  <button
                    type="button"
                    onClick={() => openIssue(topic)}
                    className="flex w-full items-start gap-3 py-2.5 text-left hover:bg-surface-2/60"
                  >
                    <Icon className={cn("mt-0.5 size-4 shrink-0", meta.dotClass)} />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-[13px] font-medium text-text-primary">
                          {topic.title}
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-[4px] bg-surface-2 px-1.5 py-[1px] text-[10px] font-semibold uppercase tracking-wide",
                            meta.textClass,
                          )}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-text-muted">
                        {channel ? (
                          <span className="inline-flex items-center gap-1">
                            <Hash className="size-3" />
                            {channel.name}
                          </span>
                        ) : null}
                        <span>·</span>
                        <span>
                          {replies} repl{replies === 1 ? "y" : "ies"}
                        </span>
                        <span>·</span>
                        <span>{formatRelative(issue.createdAt)}</span>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function ChannelsTab({ agent }: { agent: Agent }): React.ReactElement {
  const navigate = useNavigate();
  const channels = useChatStore((s) => s.channels);

  const memberOf = useMemo<Channel[]>(
    () =>
      channels.filter((c) =>
        c.members.some((m) => m.kind === "agent" && m.id === agent.id),
      ),
    [channels, agent.id],
  );

  return (
    <Card variant="outline" padding="lg">
      <CardHeader>
        <CardTitle className="text-[16px] text-text-heading">Channels</CardTitle>
        <CardDescription>Where {agent.name} has been added.</CardDescription>
      </CardHeader>
      <CardContent>
        {memberOf.length === 0 ? (
          <EmptyState
            title="Not in any channel"
            description="Add this agent to a channel to let it participate."
            icon={<Hash className="size-7" />}
            className="border-border-subtle"
          />
        ) : (
          <ul className="divide-y divide-border-subtle">
            {memberOf.map((c) => {
              const isDm = c.type === "dm";
              const other = isDm ? c.members.find((m) => m.id !== "u-1") : undefined;
              const resolved = other ? resolveRef(other) : undefined;
              const label = isDm ? (resolved?.name ?? c.name) : c.name;
              const memberCount = c.members.length;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/chat/${c.id}`)}
                    className="flex w-full items-center gap-3 py-2.5 text-left hover:bg-surface-2/60"
                  >
                    {isDm ? (
                      <MessageSquare className="size-4 shrink-0 text-text-muted" />
                    ) : (
                      <Globe className="size-4 shrink-0 text-text-muted" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium text-text-primary">
                        {label}
                      </div>
                      <div className="text-[11px] text-text-muted">
                        {isDm
                          ? "Direct message"
                          : `Channel · ${memberCount} member${memberCount === 1 ? "" : "s"}`}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
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
              <img src={avatar} alt="" className="size-12 rounded-xl" />
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
