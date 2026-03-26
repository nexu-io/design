import { render, screen } from "@testing-library/react";
import { TrendingUp } from "lucide-react";

import { StatCard } from "./stat-card";

describe("StatCard", () => {
  it("renders label, value, trend, and meta", () => {
    render(
      <StatCard
        label="Success rate"
        value="96%"
        icon={TrendingUp}
        trend={{ label: "+4.2%", variant: "success" }}
        meta="vs last week"
      />,
    );

    expect(screen.getByText("Success rate")).toBeInTheDocument();
    expect(screen.getByText("96%")).toBeInTheDocument();
    expect(screen.getByText("+4.2%")).toBeInTheDocument();
    expect(screen.getByText("vs last week")).toBeInTheDocument();
  });

  it("renders progress when provided", () => {
    render(<StatCard label="Pipeline" value="58%" progress={58} progressVariant="accent" />);

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "58");
  });
});
