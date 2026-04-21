import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Search } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  cn,
} from "@nexu-design/ui-web";
import { useWorkspaceStore } from "@/stores/workspace";
import { useAgentsStore } from "@/stores/agents";
import { useRuntimesStore } from "@/stores/runtimes";
import { mockAgentTemplates, mockRuntimes } from "@/mock/data";
import type { AgentTemplate } from "@/types";

type Phase = "templates" | "settings";

export function CreateAgentStep(): React.ReactElement {
  const navigate = useNavigate();
  const completeOnboarding = useWorkspaceStore((s) => s.completeOnboarding);
  const setPendingWelcomeAgent = useWorkspaceStore((s) => s.setPendingWelcomeAgent);
  const addAgent = useAgentsStore((s) => s.addAgent);
  const runtimes = useRuntimesStore((s) => s.runtimes);
  const setGlobalRuntimes = useRuntimesStore((s) => s.setRuntimes);

  const [phase, setPhase] = useState<Phase>("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);

  const [agentName, setAgentName] = useState("");
  const [description, setDescription] = useState("");
  const [runtimeId, setRuntimeId] = useState<string | null>(null);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const handleSelectTemplate = (tpl: AgentTemplate): void => {
    setSelectedTemplate(tpl);
    setAgentName(tpl.name);
    setDescription(tpl.description);
    const firstConnected = runtimes.find((r) => r.status === "connected");
    if (firstConnected) setRuntimeId(firstConnected.id);
    setPhase("settings");
  };

  const handleSkip = (): void => {
    completeOnboarding();
    navigate("/chat/ch-welcome");
  };

  const handleBlankAgent = (): void => {
    setSelectedTemplate(null);
    setAgentName("");
    setDescription("");
    const firstConnected = runtimes.find((r) => r.status === "connected");
    if (firstConnected) setRuntimeId(firstConnected.id);
    setPhase("settings");
  };

  const handleBackToTemplates = (): void => {
    const nameChanged = selectedTemplate ? agentName !== selectedTemplate.name : agentName !== "";
    const descChanged = selectedTemplate
      ? description !== selectedTemplate.description
      : description !== "";
    if (nameChanged || descChanged) {
      setShowDiscardDialog(true);
      return;
    }
    setPhase("templates");
  };

  const handleDetectRuntimes = (): void => {
    const connected = mockRuntimes.filter((r) => r.status === "connected");
    setGlobalRuntimes(connected);
    if (connected.length > 0) setRuntimeId(connected[0].id);
  };

  const handleCreate = (): void => {
    if (!agentName.trim()) return;
    const agentId = `a-${Date.now()}`;
    addAgent({
      id: agentId,
      name: agentName.trim(),
      avatar:
        selectedTemplate?.avatar ??
        `https://api.dicebear.com/9.x/bottts/svg?seed=${agentId}&backgroundColor=6366f1`,
      description: description.trim(),
      systemPrompt:
        selectedTemplate?.defaultPrompt ?? `You are ${agentName.trim()}, a helpful AI assistant.`,
      status: "online",
      skills: [],
      runtimeId,
      templateId: selectedTemplate?.id ?? null,
      createdBy: "u-1",
      createdAt: Date.now(),
    });
    setPendingWelcomeAgent(agentId);
    completeOnboarding();
    navigate("/chat/ch-welcome");
  };

  const connectedRuntimes = runtimes.filter((r) => r.status === "connected");

  if (phase === "templates") {
    return (
      <div className="flex flex-col items-center gap-6 pt-8">
        <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h2 className="text-xl font-semibold text-text-primary">Create your first Agent</h2>
          <p className="mt-1 text-sm text-text-secondary">Choose a template to get started</p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full">
          {mockAgentTemplates.map((tpl, i) => (
            <InteractiveRow
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl)}
              tone="subtle"
              className={cn(
                "group items-start rounded-xl border border-border px-3 py-3",
                "transition-all duration-200 ease-out",
                "hover:-translate-y-0.5 hover:shadow-[0_6px_20px_-10px_rgba(0,0,0,0.18),0_2px_6px_-2px_rgba(0,0,0,0.08)] hover:border-border-strong",
                "animate-in fade-in slide-in-from-bottom-3",
              )}
              style={{
                animationDuration: "420ms",
                animationDelay: `${120 + i * 80}ms`,
                animationFillMode: "both",
              }}
            >
              <InteractiveRowLeading>
                <img
                  src={tpl.avatar}
                  alt=""
                  className="size-10 rounded-lg shrink-0 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6"
                />
              </InteractiveRowLeading>
              <InteractiveRowContent>
                <div className="text-sm font-medium text-text-primary">{tpl.name}</div>
                <div className="mt-0.5 line-clamp-2 text-xs text-text-muted">{tpl.description}</div>
              </InteractiveRowContent>
            </InteractiveRow>
          ))}
        </div>
        <Button
          onClick={handleBlankAgent}
          variant="outline"
          className="w-full border-dashed shadow-none hover:shadow-none animate-in fade-in duration-500"
          style={{ animationDelay: "460ms", animationFillMode: "both" }}
          leadingIcon={<Plus className="size-4" />}
        >
          Start from scratch
        </Button>
        <Button
          onClick={handleSkip}
          variant="ghost"
          size="sm"
          className="animate-in fade-in duration-500"
          style={{ animationDelay: "540ms", animationFillMode: "both" }}
        >
          Skip for now
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 pt-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary">Customize your Agent</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Set a name, description, and connect a runtime
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {selectedTemplate && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-1 border border-border">
            <img src={selectedTemplate.avatar} alt="" className="size-10 rounded-lg shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-text-muted">Based on template</div>
              <div className="text-sm font-medium text-text-primary">{selectedTemplate.name}</div>
            </div>
          </div>
        )}

        <FormField label="Agent Name">
          <FormFieldControl>
            <Input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="e.g. CodeBot"
              autoFocus
            />
          </FormFieldControl>
        </FormField>

        <FormField label="Description">
          <FormFieldControl>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this agent do?"
              rows={3}
            />
          </FormFieldControl>
        </FormField>

        <FormField label="Runtime">
          <FormFieldControl>
            <Select
              value={runtimeId ?? undefined}
              onValueChange={(value) => {
                setRuntimeId(value);
              }}
              disabled={connectedRuntimes.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    connectedRuntimes.length > 0 ? "Select a runtime" : "No runtime connected"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {connectedRuntimes.map((rt) => (
                  <SelectItem key={rt.id} value={rt.id}>
                    <span className="flex w-full items-center gap-2">
                      <span
                        className={cn(
                          "size-2 rounded-full shrink-0",
                          rt.status === "connected" ? "bg-success" : "bg-surface-3",
                        )}
                      />
                      <span className="truncate">{rt.name}</span>
                      {rt.version ? (
                        <span className="text-xs text-text-muted">v{rt.version}</span>
                      ) : null}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldControl>
          {connectedRuntimes.length === 0 && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-text-muted">
              No runtimes detected.
              <Button
                onClick={handleDetectRuntimes}
                type="button"
                variant="link"
                size="inline"
                leadingIcon={<Search className="size-3" />}
              >
                Scan now
              </Button>
            </p>
          )}
        </FormField>
      </div>

      <div className="w-full max-w-md flex flex-col items-center gap-2 mt-2">
        <Button onClick={handleCreate} disabled={!agentName.trim()} className="w-full">
          Create Agent
        </Button>
        <Button
          onClick={handleBackToTemplates}
          variant="ghost"
          size="sm"
          leadingIcon={<ArrowLeft className="size-3.5" />}
        >
          Back to templates
        </Button>
      </div>

      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogDescription>
              Your edits to this agent draft will be lost if you go back to templates.
            </DialogDescription>
          </DialogHeader>
          <DialogBody />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDiscardDialog(false)}>
              Keep editing
            </Button>
            <Button
              onClick={() => {
                setShowDiscardDialog(false);
                setPhase("templates");
              }}
            >
              Discard and go back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
