import { render, screen } from "@testing-library/react";

import { Badge } from "../primitives/badge";
import { Button } from "../primitives/button";
import { expectNoA11yViolations } from "../test/a11y";
import { CreditsCapsule } from "./credits-capsule";

describe("CreditsCapsule", () => {
  it("renders summary, action, and progress", () => {
    render(
      <CreditsCapsule
        title="Credits this month"
        badge={<Badge size="xs">Plus</Badge>}
        value="3,000 left"
        meta="2,000 / 5,000 used"
        hint="12 days until reset"
        progress={2000}
        progressMax={5000}
        action={<Button variant="link">View details</Button>}
        breakdown={<div>Breakdown</div>}
      />,
    );

    expect(screen.getByText("Credits this month")).toBeInTheDocument();
    expect(screen.getByText("3,000 left")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View details" })).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2000");
    expect(screen.getByText("Breakdown")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <CreditsCapsule
        value="3,000 left"
        meta="2,000 / 5,000 used"
        progress={2000}
        progressMax={5000}
      />,
    );

    await expectNoA11yViolations(container);
  });
});
