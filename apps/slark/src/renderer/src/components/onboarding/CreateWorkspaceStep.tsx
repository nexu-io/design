import {
  Button,
  FormField,
  FormFieldControl,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TextLink,
} from "@nexu-design/ui-web";
import { ArrowRight, Building2, Check, Loader2, LogIn } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { mockAgentTemplates, mockRuntimes } from "@/mock/data";
import { useAgentsStore } from "@/stores/agents";
import { useRuntimesStore } from "@/stores/runtimes";
import { useWorkspaceStore } from "@/stores/workspace";
import type { Agent, Runtime } from "@/types";

const SCAN_DURATION_MS = 600;

export function CreateWorkspaceStep(): React.ReactElement {
  const navigate = useNavigate();
  const setWorkspace = useWorkspaceStore((s) => s.setWorkspace);
  const completeOnboarding = useWorkspaceStore((s) => s.completeOnboarding);
  const setPendingWelcomeAgent = useWorkspaceStore((s) => s.setPendingWelcomeAgent);
  const setGlobalRuntimes = useRuntimesStore((s) => s.setRuntimes);
  const globalRuntimes = useRuntimesStore((s) => s.runtimes);
  const devSimulateNone = useRuntimesStore((s) => s.devSimulateNone);
  const addAgent = useAgentsStore((s) => s.addAgent);

  const [name, setName] = useState("");
  const [scanning, setScanning] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Background runtime detection — runs implicitly while the user names the workspace.
  useEffect(() => {
    setScanning(true);
    const timer = setTimeout(() => {
      const detected = devSimulateNone ? [] : mockRuntimes.filter((r) => r.status === "connected");
      setGlobalRuntimes(detected);
      setScanning(false);
    }, SCAN_DURATION_MS);
    return () => clearTimeout(timer);
  }, [devSimulateNone, setGlobalRuntimes]);

  const detectedRuntimes = globalRuntimes.filter((r) => r.status === "connected");
  const detectedSummary = useMemo(() => summarizeDetected(detectedRuntimes), [detectedRuntimes]);

  const canContinue = Boolean(name.trim()) && !scanning && !submitting;

  const handleContinue = (): void => {
    if (!canContinue) return;
    setSubmitting(true);

    const workspaceName = name.trim();
    setWorkspace({
      id: `ws-${Date.now()}`,
      name: workspaceName,
      createdAt: Date.now(),
    });

    const welcomeAgentId = mountDefaultAgent(detectedRuntimes, addAgent);
    if (welcomeAgentId) {
      setPendingWelcomeAgent(welcomeAgentId);
    }

    completeOnboarding();
    navigate("/chat/ch-welcome");
  };

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-2">
        <Building2 className="size-7 text-text-secondary" />
      </div>

      <div className="text-center">
        <h2 className="text-[22px] font-semibold text-text-heading">Name your workspace</h2>
        <p className="mt-1.5 text-[13px] text-text-secondary">
          One step to get in. Invite teammates and pick agents from inside.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <FormField label="Workspace name">
          <FormFieldControl>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canContinue) {
                  e.preventDefault();
                  handleContinue();
                }
              }}
              placeholder="e.g. Acme Engineering"
              autoFocus
            />
          </FormFieldControl>
        </FormField>

        <RuntimeScanRow scanning={scanning} summary={detectedSummary} runtimes={detectedRuntimes} />

        <div className="flex items-center justify-center gap-1.5 text-sm text-text-muted">
          <LogIn className="size-3" />
          <span>Got an invite link?</span>
          <TextLink href="#" size="xs" className="text-sm" onClick={handleNavigateToJoin(navigate)}>
            Join a workspace
          </TextLink>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleContinue}
        disabled={!canContinue}
        trailingIcon={<ArrowRight size={18} />}
      >
        Continue
      </Button>

      <p className="text-[11px] text-text-muted">~15 seconds to your first message.</p>
    </div>
  );
}

function RuntimeScanRow({
  scanning,
  summary,
  runtimes,
}: {
  scanning: boolean;
  summary: string;
  runtimes: Runtime[];
}): React.ReactElement {
  if (scanning) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-surface-1 px-3 py-2.5">
        <Loader2 className="size-3.5 shrink-0 animate-spin text-text-muted" />
        <span className="text-sm text-text-secondary">Scanning your system for runtimes…</span>
      </div>
    );
  }

  if (runtimes.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-surface-1 px-3 py-2.5">
        <span className="size-3.5 shrink-0 rounded-full border border-border" />
        <span className="text-sm text-text-secondary">
          No runtimes detected — you can install one after sign-in.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg bg-surface-1 px-3 py-2.5">
      <Check className="size-3.5 shrink-0 text-success" strokeWidth={3} />
      <span className="flex-1 truncate text-sm text-text-secondary">{summary}</span>
      <Popover>
        <PopoverTrigger asChild>
          <TextLink href="#" size="xs" className="shrink-0 text-sm">
            Details
          </TextLink>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[280px] p-0">
          <div className="border-b border-border-subtle px-3 py-2">
            <div className="text-[12px] font-semibold text-text-heading">Detected runtimes</div>
            <div className="text-[11px] text-text-muted">
              {runtimes.length} runtime{runtimes.length === 1 ? "" : "s"} ready
            </div>
          </div>
          <ul className="max-h-[260px] divide-y divide-border-subtle overflow-y-auto">
            {runtimes.map((rt) => (
              <li key={rt.id} className="flex items-center gap-2 px-3 py-2">
                <Check className="size-3 shrink-0 text-success" strokeWidth={3} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-medium text-text-primary">
                    {rt.name}
                  </div>
                  {rt.version ? (
                    <div className="truncate text-[11px] text-text-muted">v{rt.version}</div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function summarizeDetected(runtimes: Runtime[]): string {
  const count = runtimes.length;
  if (count === 0) return "";
  const names = runtimes
    .slice(0, 3)
    .map((r) => r.name.replace(/\s*\(Local\)$/, ""))
    .join(", ");
  const rest = count > 3 ? ` +${count - 3} more` : "";
  return `Detected ${count} runtime${count === 1 ? "" : "s"} on this Mac — ${names}${rest}`;
}

function mountDefaultAgent(runtimes: Runtime[], addAgent: (agent: Agent) => void): string | null {
  if (runtimes.length === 0) return null;

  const template = mockAgentTemplates[0];
  if (!template) return null;

  const runtime = runtimes[0];
  const agentId = `a-onboard-${Date.now()}`;
  addAgent({
    id: agentId,
    name: template.name,
    avatar: template.avatar,
    description: template.description,
    systemPrompt: template.defaultPrompt,
    status: "online",
    skills: [],
    runtimeId: runtime.id,
    templateId: template.id,
    createdBy: "u-1",
    createdAt: Date.now(),
  });
  return agentId;
}

function handleNavigateToJoin(
  navigate: ReturnType<typeof useNavigate>,
): (event: React.MouseEvent) => void {
  return (event) => {
    event.preventDefault();
    navigate("/onboarding/join");
  };
}
