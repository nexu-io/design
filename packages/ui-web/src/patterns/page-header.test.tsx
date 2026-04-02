import { render, screen } from "@testing-library/react";

import { Button } from "../primitives/button";
import { expectNoA11yViolations } from "../test/a11y";
import { PageHeader } from "./page-header";

describe("PageHeader", () => {
  it("renders title, description, and actions", () => {
    render(
      <PageHeader
        title="Workspace"
        description="Manage team settings and members."
        actions={<Button>Invite member</Button>}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Workspace" })).toBeInTheDocument();
    expect(screen.getByText("Manage team settings and members.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Invite member" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <PageHeader
        title="Workspace"
        description="Manage team settings and members."
        actions={<Button>Invite member</Button>}
      />,
    );

    await expectNoA11yViolations(container);
  });

  it("applies shell density for embedded desktop-style headings", () => {
    const { container } = render(
      <PageHeader
        density="shell"
        title="Earn more usage"
        description="Complete tasks for credits."
      />,
    );

    const heading = screen.getByRole("heading", { level: 1, name: "Earn more usage" });
    expect(heading).toHaveClass("text-2xl", "font-bold");
    const desc = container.querySelector("p");
    expect(desc).toHaveTextContent("Complete tasks for credits.");
    expect(desc).toHaveClass("text-xs", "text-[var(--color-text-tertiary)]");
  });
});
