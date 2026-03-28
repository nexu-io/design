import { render, screen } from "@testing-library/react";

import { Button } from "../primitives/button";
import { expectNoA11yViolations } from "../test/a11y";
import { SectionHeader } from "./section-header";

describe("SectionHeader", () => {
  it("renders title, description, and action", () => {
    render(
      <SectionHeader
        title="Members"
        description="Review everyone in the workspace."
        action={<Button size="sm">Add member</Button>}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Members" })).toBeInTheDocument();
    expect(screen.getByText("Review everyone in the workspace.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add member" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <SectionHeader
        title="Members"
        description="Review everyone in the workspace."
        action={<Button size="sm">Add member</Button>}
      />,
    );

    await expectNoA11yViolations(container);
  });
});
