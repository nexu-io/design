import { render, screen } from "@testing-library/react";

import { Button } from "../primitives/button";
import { expectNoA11yViolations } from "../test/a11y";
import { SectionHeader } from "./section-header";

describe("SectionHeader", () => {
  it("renders title and action content", () => {
    render(
      <SectionHeader
        title={<h2>Recent activity</h2>}
        action={<Button size="sm">View all</Button>}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Recent activity" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View all" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <SectionHeader
        title={<h2>Recent activity</h2>}
        action={<Button size="sm">View all</Button>}
      />,
    );

    await expectNoA11yViolations(container);
  });
});
