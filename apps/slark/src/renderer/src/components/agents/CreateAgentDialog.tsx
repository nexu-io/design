import { useState } from "react";
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
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  cn,
} from "@nexu-design/ui-web";

import { useT } from "@/i18n";
import { mockSkills } from "@/mock/data";
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
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [runtimeId, setRuntimeId] = useState<string | null>(null);

  const reset = (): void => {
    setSelectedTemplate(null);
    setName("");
    setDescription("");
    setRuntimeId(null);
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
          <DialogDescription>
            Start from a template or configure the core details for a brand new agent.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-4">
            {templates.length > 0 ? (
              <FormField
                label={t("createAgent.template")}
                description="Templates prefill the name, description, and default prompt."
              >
                <FormFieldControl>
                  <div className="space-y-1.5">
                    {templates.map((template) => {
                      const selected = selectedTemplate?.id === template.id;
                      return (
                        <InteractiveRow
                          key={template.id}
                          selected={selected}
                          tone="subtle"
                          onClick={() => handleSelectTemplate(template)}
                          className="px-3 py-2"
                        >
                          <InteractiveRowLeading>
                            <img
                              src={template.avatar}
                              alt=""
                              className="size-9 rounded-full bg-secondary ring-1 ring-inset ring-black/5"
                            />
                          </InteractiveRowLeading>
                          <InteractiveRowContent>
                            <div className="text-[13px] font-medium text-text-heading">
                              {template.name}
                            </div>
                            <div className="text-[11px] text-text-muted">{template.category}</div>
                          </InteractiveRowContent>
                          <InteractiveRowTrailing className="flex items-center gap-2">
                            {selected ? (
                              <Check className="size-4 text-text-heading" strokeWidth={3} />
                            ) : null}
                          </InteractiveRowTrailing>
                        </InteractiveRow>
                      );
                    })}
                  </div>
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
              description="Connect a runtime now or leave it empty and configure it later."
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
