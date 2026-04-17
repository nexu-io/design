import { Fragment } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Bot, Building2, PlugZap } from "lucide-react";
import { AuthShell, Stepper, StepperItem, StepperSeparator } from "@nexu-design/ui-web";
import { TitleBarSpacer } from "@/components/layout/WindowChrome";
import { CreateAgentStep } from "./CreateAgentStep";
import { ConnectRuntimeStep } from "./ConnectRuntimeStep";
import { CreateWorkspaceStep } from "./CreateWorkspaceStep";
import { SlarkAuthRail } from "./slark-auth-rail";

const steps = [
  {
    path: "workspace",
    label: "Workspace",
    description: "Name your team space and invite collaborators.",
    icon: <Building2 className="size-4" />,
  },
  {
    path: "runtime",
    label: "Runtimes",
    description: "Choose which local tools Slark can orchestrate.",
    icon: <PlugZap className="size-4" />,
  },
  {
    path: "agent",
    label: "Agent",
    description: "Launch the first agent your workspace will use.",
    icon: <Bot className="size-4" />,
  },
] as const;

export function OnboardingFlow(): React.ReactElement {
  const location = useLocation();
  const currentStep = Math.max(
    steps.findIndex((step) => location.pathname.includes(step.path)),
    0,
  );

  return (
    <div className="flex h-screen flex-col bg-background">
      <TitleBarSpacer />
      <div className="min-h-0 flex-1">
        <AuthShell
          className="h-full min-h-full"
          rail={
            <SlarkAuthRail
              title={
                <>
                  Create the workspace.
                  <br />
                  Connect the team.
                </>
              }
              description="The onboarding shell stays stable while workspace, runtime, and agent setup swap in route-driven steps."
              highlights={[
                {
                  icon: Building2,
                  text: "Keep workspace setup focused with shared cards, forms, and validation states.",
                },
                {
                  icon: PlugZap,
                  text: "Surface runtime readiness with clearer cards, alerts, and multi-select actions.",
                },
                {
                  icon: Bot,
                  text: "Move from template selection to agent customization without losing context.",
                },
              ]}
            />
          }
          contentInnerClassName="max-w-[640px]"
        >
          <div className="space-y-6">
            <Stepper>
              {steps.map((step, index) => (
                <Fragment key={step.path}>
                  <StepperItem
                    className="max-w-[180px]"
                    status={
                      index < currentStep
                        ? "completed"
                        : index === currentStep
                          ? "current"
                          : "pending"
                    }
                    step={index + 1}
                    label={step.label}
                    description={step.description}
                    icon={step.icon}
                  />
                  {index < steps.length - 1 ? (
                    <StepperSeparator active={index < currentStep} />
                  ) : null}
                </Fragment>
              ))}
            </Stepper>

            <Routes>
              <Route path="workspace" element={<CreateWorkspaceStep />} />
              <Route path="runtime" element={<ConnectRuntimeStep />} />
              <Route path="agent" element={<CreateAgentStep />} />
              <Route path="*" element={<Navigate to="workspace" replace />} />
            </Routes>
          </div>
        </AuthShell>
      </div>
    </div>
  );
}
