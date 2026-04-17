import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Zap } from "lucide-react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  cn,
} from "@nexu-design/ui-web";
import { useAgentsStore } from "@/stores/agents";
import { useChatStore } from "@/stores/chat";
import { mockSkills } from "@/mock/data";
import { RuntimePicker } from "./RuntimePicker";
import type { Agent, AgentTemplate, Channel } from "@/types";

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAgentDialog({
  open,
  onOpenChange,
}: CreateAgentDialogProps): React.ReactElement {
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

  const handleSelectTemplate = (tpl: AgentTemplate): void => {
    setSelectedTemplate(tpl);
    setName(tpl.name);
    setDescription(tpl.description);
  };

  const handleCreate = (): void => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

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
      skills: (selectedTemplate?.defaultSkills ?? [])
        .map((sid) => mockSkills.find((s) => s.id === sid))
        .filter((s): s is NonNullable<typeof s> => s != null),
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

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" && !e.shiftKey && name.trim()) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent size="md" className="w-[500px] max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="px-5 pt-5 pb-1">
          <DialogTitle className="text-base font-semibold">Create Agent</DialogTitle>
        </DialogHeader>

        <DialogBody className="px-5 py-4 space-y-4">
          {templates.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-sm font-medium">Template</div>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((tpl) => (
                  <Button
                    type="button"
                    variant="outline"
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={cn(
                      "h-auto justify-start gap-2.5 p-2.5 text-left",
                      selectedTemplate?.id === tpl.id
                        ? "border-ring bg-surface-2"
                        : "hover:bg-surface-2",
                    )}
                  >
                    <img src={tpl.avatar} alt="" className="h-8 w-8 rounded-lg shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{tpl.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{tpl.category}</div>
                    </div>
                    {selectedTemplate?.id === tpl.id && (
                      <Check className="h-4 w-4 text-foreground shrink-0" strokeWidth={3} />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <FormField label="Name">
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. MyAssistant"
            />
          </FormField>

          <FormField label="Description">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What does this agent do?"
            />
          </FormField>

          <FormField
            label={
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                Runtime
              </span>
            }
          >
            <RuntimePicker value={runtimeId} onChange={setRuntimeId} />
          </FormField>
        </DialogBody>

        <DialogFooter className="px-5 pb-5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onOpenChange(false);
              reset();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()} size="sm">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
