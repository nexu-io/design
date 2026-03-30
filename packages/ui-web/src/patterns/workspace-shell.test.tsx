import { fireEvent, render, screen } from "@testing-library/react";

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

  it("applies resize deltas relative to the drag start width", () => {
    const handleSidebarWidthChange = vi.fn();

    render(
      <div className="h-[420px] w-[960px]">
        <WorkspaceShell
          sidebar={<div>Sidebar</div>}
          onSidebarWidthChange={handleSidebarWidthChange}
          sidebarDefaultWidth={224}
        >
          <div>Main content</div>
        </WorkspaceShell>
      </div>,
    );

    const handle = screen.getByRole("separator", { name: "Resize sidebar" });

    fireEvent.mouseDown(handle, { clientX: 100 });
    fireEvent.mouseMove(document, { clientX: 130 });
    fireEvent.mouseMove(document, { clientX: 140 });
    fireEvent.mouseUp(document);

    expect(handleSidebarWidthChange).toHaveBeenNthCalledWith(1, 254);
    expect(handleSidebarWidthChange).toHaveBeenNthCalledWith(2, 264);
  });
});
