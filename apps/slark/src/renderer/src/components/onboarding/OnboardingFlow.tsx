import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@nexu-design/ui-web";
import { TitleBarSpacer } from "@/components/layout/WindowChrome";
import { CreateWorkspaceStep } from "./CreateWorkspaceStep";
import { ConnectRuntimeStep } from "./ConnectRuntimeStep";
import { CreateAgentStep } from "./CreateAgentStep";

const steps = [
  { path: "workspace", label: "Workspace" },
  { path: "runtime", label: "Runtime" },
  { path: "agent", label: "Agent" },
] as const;

export function OnboardingFlow(): React.ReactElement {
  const location = useLocation();
  const currentStep = steps.findIndex((s) => location.pathname.includes(s.path));

  return (
    <div className="flex h-screen w-screen flex-col items-center bg-background">
      <TitleBarSpacer />
      <div className="flex items-center gap-2 py-6">
        {steps.map((step, i) => (
          <div key={step.path} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                i <= currentStep
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground",
              )}
            >
              {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-sm font-medium",
                i <= currentStep ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>
      <div className="flex-1 w-full max-w-2xl px-8 pb-8">
        <Routes>
          <Route path="workspace" element={<CreateWorkspaceStep />} />
          <Route path="runtime" element={<ConnectRuntimeStep />} />
          <Route path="agent" element={<CreateAgentStep />} />
          <Route path="*" element={<Navigate to="workspace" replace />} />
        </Routes>
      </div>
    </div>
  );
}
