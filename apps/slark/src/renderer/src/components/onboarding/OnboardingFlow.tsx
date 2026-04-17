import { Fragment } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Bot, Building2, PlugZap } from "lucide-react";
import { Stepper, StepperItem, StepperSeparator } from "@nexu-design/ui-web";
import { CreateAgentStep } from "./CreateAgentStep";
import { ConnectRuntimeStep } from "./ConnectRuntimeStep";
import { CreateWorkspaceStep } from "./CreateWorkspaceStep";
import { SlarkAuthFrame } from "./slark-auth-frame";

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
    <SlarkAuthFrame contentInnerClassName="max-w-[560px]">
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
    </SlarkAuthFrame>
  );
}
