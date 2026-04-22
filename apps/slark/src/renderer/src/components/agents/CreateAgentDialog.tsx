import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, Zap } from "lucide-react";

import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  FormFieldControl,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from "@nexu-design/ui-web";

import { useT } from "@/i18n";
import { mockRuntimes, mockSkills } from "@/mock/data";
import { useAgentsStore } from "@/stores/agents";
import { useChatStore } from "@/stores/chat";
import type { Agent, AgentTemplate, Channel } from "@/types";

import { RuntimePicker } from "./RuntimePicker";

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAgentDialog({
  open,
  onOpenChange,
}: CreateAgentDialogProps): React.ReactElement {
  const t = useT();
  const navigate = useNavigate();
  const templates = useAgentsStore((s) => s.templates);
  const addAgent = useAgentsStore((s) => s.addAgent);
  const selectAgent = useAgentsStore((s) => s.selectAgent);
  const addChannel = useChatStore((s) => s.addChannel);
  /*
   * Runtime default — pick the first connected runtime on mount so the
   * happy path doesn't force users to hunt through a dropdown before
   * they can press Create. They can still switch to "No runtime" or
   * another option; we just don't want an empty-field stall.
   *
   * Mirrors the selection that `CreateAgentStep` (onboarding) makes
   * after a template is chosen — keeping behaviour consistent between
   * the two entry points.
   */
  const defaultRuntimeId = useMemo(
    () => mockRuntimes.find((r) => r.status === "connected")?.id ?? null,
    [],
  );

  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [runtimeId, setRuntimeId] = useState<string | null>(defaultRuntimeId);

  const reset = (): void => {
    setSelectedTemplate(null);
    setName("");
    setDescription("");
    setRuntimeId(defaultRuntimeId);
  };

  const handleSelectTemplate = (template: AgentTemplate): void => {
    setSelectedTemplate(template);
    setName(template.name);
    setDescription(template.description);
  };

  const handleCreate = (): void => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const templateSkills: Agent["skills"] = [];
    for (const skillId of selectedTemplate?.defaultSkills ?? []) {
      const matchedSkill = mockSkills.filter((skill) => skill.id === skillId)[0];
      if (matchedSkill) {
        templateSkills.push(matchedSkill);
      }
    }

    const agentId = `a-${Date.now()}`;
    const agent: Agent = {
      id: agentId,
      name: trimmedName,
      avatar:
        selectedTemplate?.avatar ??
        `https://api.dicebear.com/9.x/bottts/svg?seed=${trimmedName.toLowerCase()}&backgroundColor=6366f1`,
      description: description.trim(),
      systemPrompt:
        selectedTemplate?.defaultPrompt ?? `You are ${trimmedName}, a helpful AI assistant.`,
      status: "online",
      skills: templateSkills,
      runtimeId,
      templateId: selectedTemplate?.id ?? null,
      createdBy: "u-1",
      createdAt: Date.now(),
    };

    addAgent(agent);

    const dmChannel: Channel = {
      id: `dm-${agentId}`,
      name: trimmedName,
      type: "dm",
      members: [
        { kind: "user", id: "u-1" },
        { kind: "agent", id: agentId },
      ],
      lastMessageAt: Date.now(),
      unreadCount: 0,
      createdAt: Date.now(),
    };

    addChannel(dmChannel);
    selectAgent(agentId);
    navigate(`/agents/${agentId}`);
    onOpenChange(false);
    reset();
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === "Enter" && !event.shiftKey && name.trim()) {
      event.preventDefault();
      handleCreate();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          reset();
        }
      }}
    >
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{t("createAgent.title")}</DialogTitle>
          <DialogDescription>Pick a template, or start blank.</DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-4">
            {templates.length > 0 ? (
              <FormField
                label={t("createAgent.template")}
                description="Templates prefill the name, description, and default prompt."
              >
                <FormFieldControl>
                  {/*
                   * Two-column tile grid — 4 templates lay out as 2×2
                   * which both shortens the dialog and lets avatars read
                   * as a gallery rather than a list. Each tile is a
                   * `TooltipTrigger` so hovering surfaces the full
                   * description without requiring the user to select
                   * the template first. `delayDuration={200}` balances
                   * discoverability against accidental tooltip spam
                   * when the cursor passes over while scanning.
                   */}
                  <TooltipProvider delayDuration={200} skipDelayDuration={120}>
                    <div className="grid grid-cols-2 gap-2">
                      {templates.map((template) => {
                        const selected = selectedTemplate?.id === template.id;
                        return (
                          <Tooltip key={template.id}>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                aria-pressed={selected}
                                onClick={() => handleSelectTemplate(template)}
                                className={cn(
                                  "group relative flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors",
                                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                                  selected
                                    ? "border-accent/40 bg-accent/5"
                                    : "border-border-subtle bg-surface-0 hover:border-border hover:bg-surface-1",
                                )}
                              >
                                <img
                                  src={template.avatar}
                                  alt=""
                                  className="size-9 shrink-0 rounded-full bg-secondary ring-1 ring-inset ring-black/5"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-[13px] font-medium text-text-heading">
                                    {template.name}
                                  </div>
                                  <div className="truncate text-[11px] capitalize text-text-muted">
                                    {template.category}
                                  </div>
                                </div>
                                {selected ? (
                                  <Check className="size-4 shrink-0 text-accent" strokeWidth={3} />
                                ) : null}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[280px] text-left">
                              <div className="text-[12px] font-semibold leading-tight">
                                {template.name}
                              </div>
                              <div className="mt-1 text-[11px] leading-[1.5] text-background/80">
                                {template.description}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </TooltipProvider>
                </FormFieldControl>
              </FormField>
            ) : null}

            <FormField label={t("agent.name")}>
              <FormFieldControl>
                <Input
                  autoFocus
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("createAgent.namePlaceholder")}
                />
              </FormFieldControl>
            </FormField>

            <FormField label={t("agent.description")}>
              <FormFieldControl>
                <Input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("createAgent.descPlaceholder")}
                />
              </FormFieldControl>
            </FormField>

            <FormField
              label={
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="size-3.5" />
                  {t("agent.runtime")}
                </span>
              }
            >
              <FormFieldControl>
                <RuntimePicker value={runtimeId} onChange={setRuntimeId} />
              </FormFieldControl>
            </FormField>

            {selectedTemplate ? (
              <div
                className={cn(
                  "flex items-start gap-2 rounded-xl border border-border bg-surface-1 px-3 py-2",
                )}
              >
                <Sparkles className="mt-0.5 size-4 text-text-muted" />
                <p className="text-[12px] text-text-muted">
                  {selectedTemplate.name} will seed the system prompt and default skills for this
                  agent.
                </p>
              </div>
            ) : null}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            {t("common.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
