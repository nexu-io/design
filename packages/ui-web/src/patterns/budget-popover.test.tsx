import { render, screen } from "@testing-library/react";
import { Sparkles } from "lucide-react";

import { Button } from "../primitives/button";
import { BudgetPopover } from "./budget-popover";

describe("BudgetPopover", () => {
  it("renders summary content when open", () => {
    render(
      <BudgetPopover
        defaultOpen
        trigger={<Button>View details</Button>}
        title="Credit usage this month"
        description="Track where this cycle's credits are going."
        items={[
          {
            id: "ai-coding",
            label: "AI coding",
            value: "1,280",
            icon: Sparkles,
            dotClassName: "bg-info",
          },
        ]}
        summary="3,000 credits left this month"
      />,
    );

    expect(screen.getByText("Credit usage this month")).toBeInTheDocument();
    expect(screen.getByText("AI coding")).toBeInTheDocument();
    expect(screen.getByText("1,280")).toBeInTheDocument();
    expect(screen.getByText("3,000 credits left this month")).toBeInTheDocument();
  });
});
