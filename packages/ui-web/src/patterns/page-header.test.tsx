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
});
