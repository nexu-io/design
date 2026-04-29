import { Stepper, StepperItem, StepperSeparator } from "@nexu-design/ui-web";

export function StepperBasicExample() {
  return (
    <Stepper className="max-w-[720px]">
      <StepperItem status="completed" step="1" label="Draft" description="Plan the rollout" />
      <StepperSeparator active />
      <StepperItem status="current" step="2" label="Review" description="Validate approvals" />
      <StepperSeparator />
      <StepperItem status="pending" step="3" label="Launch" description="Ship to production" />
    </Stepper>
  );
}
