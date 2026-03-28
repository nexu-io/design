import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { expectNoA11yViolations } from "../test/a11y";
import { InspectorPanel } from "./inspector-panel";

describe("InspectorPanel", () => {
  it("renders leading content, header metadata, footer, and close action", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <div className="h-96">
        <InspectorPanel
          title="Approval details"
          description="Review the latest automation decision before publishing."
          meta={<span>Updated 5 minutes ago</span>}
          badges={<span>Pending review</span>}
          leading={<span>AI</span>}
          footer={<button type="button">Open session</button>}
          onClose={handleClose}
          closeButtonProps={{ srLabel: "Close details" }}
        >
          <p>Panel content</p>
        </InspectorPanel>
      </div>,
    );

    expect(screen.getByText("AI")).toBeInTheDocument();
    expect(screen.getByText("Pending review")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Approval details" })).toBeInTheDocument();
    expect(
      screen.getByText("Review the latest automation decision before publishing."),
    ).toBeInTheDocument();
    expect(screen.getByText("Updated 5 minutes ago")).toBeInTheDocument();
    expect(screen.getByText("Panel content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open session" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close details" }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <div className="h-96">
        <InspectorPanel
          title="Approval details"
          description="Review the latest automation decision before publishing."
          onClose={() => {}}
          closeButtonProps={{ srLabel: "Close details" }}
        >
          <p>Panel content</p>
        </InspectorPanel>
      </div>,
    );

    await expectNoA11yViolations(container);
  });
});
