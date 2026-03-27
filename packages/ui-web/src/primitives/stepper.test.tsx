import { render, screen } from "@testing-library/react";

import { Stepper, StepperItem, StepperSeparator } from "./stepper";

describe("Stepper", () => {
  it("renders horizontal steps", () => {
    render(
      <Stepper>
        <StepperItem status="completed" step={1} label="Profile" />
        <StepperSeparator active />
        <StepperItem status="current" step={2} label="Channels" />
      </Stepper>,
    );

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Channels")).toBeInTheDocument();
  });

  it("renders vertical step descriptions", () => {
    render(
      <Stepper orientation="vertical">
        <StepperItem status="pending" step={1} label="Install" description="Set up Slack" />
      </Stepper>,
    );

    expect(screen.getByText("Install")).toBeInTheDocument();
    expect(screen.getByText("Set up Slack")).toBeInTheDocument();
  });
});
