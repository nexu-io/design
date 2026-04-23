import { Stepper, StepperItem, StepperSeparator } from "@nexu-design/ui-web";
import { Building2, PlugZap, UsersRound } from "lucide-react";
import { Fragment } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

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
    label: "Teammate",
    icon: <UsersRound className="size-4" />,
  },
] as const;

export function OnboardingFlow(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
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
      verticalAlign="top"
    >
      <div className="space-y-8">
        <Stepper>
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            return (
              <Fragment key={step.path}>
                <StepperItem
                  status={isCompleted ? "completed" : index === currentStep ? "current" : "pending"}
                  step={index + 1}
                  label={step.label}
                  icon={step.icon}
                  onClick={isCompleted ? () => navigate(`/onboarding/${step.path}`) : undefined}
                  title={isCompleted ? `Go back to ${step.label}` : undefined}
                />
                {index < steps.length - 1 ? (
                  <StepperSeparator active={index < currentStep} />
                ) : null}
              </Fragment>
            );
          })}
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
