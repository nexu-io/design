import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Rocket, Search, Zap } from "lucide-react";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormField,
  Input,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  cn,
} from "@nexu-design/ui-web";
import { useAgentsStore } from "@/stores/agents";
import { useRuntimesStore } from "@/stores/runtimes";
import { useWorkspaceStore } from "@/stores/workspace";
import { mockAgentTemplates, mockRuntimes } from "@/mock/data";
import type { AgentTemplate } from "@/types";

type Phase = "templates" | "settings";

export function CreateAgentStep(): React.ReactElement {
  const navigate = useNavigate();
  const completeOnboarding = useWorkspaceStore((state) => state.completeOnboarding);
  const setPendingWelcomeAgent = useWorkspaceStore((state) => state.setPendingWelcomeAgent);
  const addAgent = useAgentsStore((state) => state.addAgent);
  const runtimes = useRuntimesStore((state) => state.runtimes);
  const setGlobalRuntimes = useRuntimesStore((state) => state.setRuntimes);

  const [phase, setPhase] = useState<Phase>("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [agentName, setAgentName] = useState("");
  const [description, setDescription] = useState("");
  const [runtimeId, setRuntimeId] = useState<string | null>(null);

  const handleSelectTemplate = (template: AgentTemplate): void => {
    setSelectedTemplate(template);
    setAgentName(template.name);
    setDescription(template.description);
    const firstConnected = runtimes.find((runtime) => runtime.status === "connected");
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
    const firstConnected = runtimes.find((runtime) => runtime.status === "connected");
    if (firstConnected) setRuntimeId(firstConnected.id);
    setPhase("settings");
  };

  const handleBackToTemplates = (): void => {
    const nameChanged = selectedTemplate ? agentName !== selectedTemplate.name : agentName !== "";
    const descriptionChanged = selectedTemplate
      ? description !== selectedTemplate.description
      : description !== "";

    if (
      (nameChanged || descriptionChanged) &&
      !window.confirm("Your changes will be lost. Go back to templates?")
    ) {
      return;
    }

    setPhase("templates");
  };

  const handleDetectRuntimes = (): void => {
    const connected = mockRuntimes.filter((runtime) => runtime.status === "connected");
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

  const connectedRuntimes = runtimes.filter((runtime) => runtime.status === "connected");
  const noRuntimeValue = "__none__";

  if (phase === "templates") {
    return (
      <Card
        variant="static"
        padding="lg"
        className="rounded-2xl border-border bg-surface-1 shadow-card"
      >
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-text-primary">Create your first agent</CardTitle>
          <CardDescription className="text-sm text-text-secondary">
            Start with a proven template or create an agent from scratch.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {mockAgentTemplates.map((template) => (
              <InteractiveRow
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className="rounded-2xl border-border bg-surface-0 px-4 py-4"
                aria-label={`Use ${template.name} template`}
              >
                <InteractiveRowLeading>
                  <img src={template.avatar} alt="" className="h-10 w-10 rounded-lg shrink-0" />
                </InteractiveRowLeading>
                <InteractiveRowContent>
                  <div className="text-sm font-semibold text-text-primary">{template.name}</div>
                  <div className="mt-1 text-xs leading-relaxed text-text-secondary line-clamp-2">
                    {template.description}
                  </div>
                </InteractiveRowContent>
              </InteractiveRow>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full justify-center rounded-2xl border-dashed"
            onClick={handleBlankAgent}
          >
            <Plus className="size-4" />
            Start from scratch
          </Button>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleSkip}>
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      variant="static"
      padding="lg"
      className="rounded-2xl border-border bg-surface-1 shadow-card"
    >
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-text-primary">Customize your agent</CardTitle>
        <CardDescription className="text-sm text-text-secondary">
          Set a name, tune the prompt context, and choose a runtime to execute work.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {selectedTemplate ? (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-0 px-4 py-3">
            <img src={selectedTemplate.avatar} alt="" className="h-10 w-10 rounded-lg shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium uppercase tracking-[0.08em] text-text-tertiary">
                Based on template
              </div>
              <div className="text-sm font-semibold text-text-primary">{selectedTemplate.name}</div>
            </div>
          </div>
        ) : null}

        <FormField label="Agent name">
          <Input
            value={agentName}
            placeholder="e.g. CodeBot"
            onChange={(event) => setAgentName(event.target.value)}
          />
        </FormField>

        <FormField label="Description">
          <Textarea
            rows={4}
            value={description}
            placeholder="What should this agent help your team with?"
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormField>

        <FormField
          label={
            <span className="flex items-center gap-1.5">
              <Zap className="size-4" />
              Runtime
            </span>
          }
          description="Pick where this agent should execute tasks."
        >
          <Select
            value={runtimeId ?? noRuntimeValue}
            onValueChange={(nextValue) =>
              setRuntimeId(nextValue === noRuntimeValue ? null : nextValue)
            }
          >
            <SelectTrigger className="h-10">
              <SelectValue
                placeholder={
                  connectedRuntimes.length > 0 ? "Select a runtime" : "No runtime connected"
                }
              />
            </SelectTrigger>
            <SelectContent className="max-h-[240px]">
              <SelectGroup>
                <SelectItem value={noRuntimeValue} className="rounded-lg hover:bg-surface-2">
                  No runtime
                </SelectItem>
                {connectedRuntimes.map((runtime) => (
                  <SelectItem
                    key={runtime.id}
                    value={runtime.id}
                    className="rounded-lg pr-10 hover:bg-surface-2"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full shrink-0",
                          runtime.status === "connected" ? "bg-success" : "bg-text-muted",
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-text-primary">{runtime.name}</div>
                        <div className="truncate text-xs text-text-secondary">
                          {runtime.type}
                          {runtime.version ? ` • v${runtime.version}` : ""}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormField>

        {connectedRuntimes.length === 0 ? (
          <Alert>
            <Search className="size-4" />
            <AlertDescription>
              No connected runtimes yet.
              <button
                type="button"
                onClick={handleDetectRuntimes}
                className="ml-1 inline-flex items-center gap-1 text-text-primary underline underline-offset-2"
              >
                Scan now
              </button>
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleBackToTemplates}>
            <ArrowLeft className="size-4" />
            Back to templates
          </Button>
          <Button onClick={handleCreate} disabled={!agentName.trim()}>
            <Rocket className="size-4" />
            Create agent
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
