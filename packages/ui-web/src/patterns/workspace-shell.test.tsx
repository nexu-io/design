import { render, screen } from "@testing-library/react";

import { expectNoA11yViolations } from "../test/a11y";
import { WorkspaceShell } from "./workspace-shell";

describe("WorkspaceShell", () => {
  it("renders activity bar, sidebar, main content, and detail panel", () => {
    render(
      <div className="h-[420px] w-[960px]">
        <WorkspaceShell
          activityBar={<div>Activity</div>}
          sidebar={<div>Sidebar</div>}
          detailPanel={<aside>Inspector</aside>}
        >
          <div>Main content</div>
        </WorkspaceShell>
      </div>,
    );

    expect(screen.getByText("Activity")).toBeInTheDocument();
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Main content")).toBeInTheDocument();
    expect(screen.getByText("Inspector")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <div className="h-[420px] w-[960px]">
        <WorkspaceShell activityBar={<div>Activity</div>} sidebar={<div>Sidebar</div>}>
          <div>Main content</div>
        </WorkspaceShell>
      </div>,
    );

    await expectNoA11yViolations(container);
  });
});
