import { Stepper, StepperItem, StepperSeparator } from "@nexu-design/ui-web";
import { Bot, Building2, PlugZap } from "lucide-react";
import { Fragment } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { ConnectRuntimeStep } from "./ConnectRuntimeStep";
import { CreateAgentStep } from "./CreateAgentStep";
import { CreateWorkspaceStep } from "./CreateWorkspaceStep";
import { SlarkAuthFrame } from "./slark-auth-frame";

const steps = [
  {
    path: "workspace",
    label: "Workspace",
    icon: <Building2 className="size-4" />,
  },
  {
    path: "runtime",
    label: "Runtimes",
    icon: <PlugZap className="size-4" />,
  },
  {
    path: "agent",
    label: "Agent",
    icon: <Bot className="size-4" />,
  },
] as const;

export function OnboardingFlow(): React.ReactElement {
  const location = useLocation();
  const currentStep = Math.max(
    steps.findIndex((step) => location.pathname.includes(step.path)),
    0,
  );
  const isRuntimeStep = location.pathname.includes("/runtime");

  return (
    <SlarkAuthFrame
      contentInnerClassName={
        isRuntimeStep ? "mx-auto w-[760px] max-w-full" : "mx-auto max-w-[560px]"
      }
      hideBranding
      hideFooter
    >
      <div className="space-y-8">
        <Stepper>
          {steps.map((step, index) => (
            <Fragment key={step.path}>
              <StepperItem
                status={
                  index < currentStep ? "completed" : index === currentStep ? "current" : "pending"
                }
                step={index + 1}
                label={step.label}
                icon={step.icon}
              />
              {index < steps.length - 1 ? <StepperSeparator active={index < currentStep} /> : null}
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
